import { buildComposeSystemPrompt } from '../../prompts/load-prompts'
import {
  applyImagesToFigures,
  enrichComposeImages,
  IMAGE_PHASE_BUDGET_MS,
  normalizeImageSource
} from '../../utils/compose-images'
import { generateElevateHero, parseHeroBrief, pickHeroBrief } from '../../utils/elevate-hero'
import { assertComposeAccess } from '../../utils/compose-request'
import { formatGateForRetry, runHumanNotModelGate } from '../../utils/human-not-model-gate'
import {
  emptyComposedPost,
  newBlockId,
  slugifyTitle,
  type ComposedBlock,
  type ComposedBlockType,
  type ComposedPost,
  type ComposedReference
} from '~/types/composed'

/** Align with nitro.vercel.functions.maxDuration (global 60s). */
export const maxDuration = 60

const BLOCK_TYPES = new Set<ComposedBlockType>([
  'lead', 'paragraph', 'heading', 'blockquote', 'callout', 'figure', 'list', 'closing'
])

const DEFAULT_GROQ_MODEL = 'groq/compound'
const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite'
const GROQ_MAX_TOKENS = 7000
const GEMINI_MAX_TOKENS = 8192

type ProviderId = 'groq' | 'gemini'

type ProviderCallResult = {
  content: string
  status: number
  errText: string
  rate?: Record<string, string>
}

/** H3/Nitro body parse workaround used elsewhere in this codebase. */
function parseBody(event: any): Promise<any> {
  const req = event.node?.req ?? event.req
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: any) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(String(c))))
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf8').trim()
        resolve(text ? JSON.parse(text) : {})
      } catch (e: any) {
        reject(new Error(`Body parse failed: ${e?.message}`))
      }
    })
    req.on('error', reject)
    if (req.readableEnded) resolve({})
  })
}

function stripJsonFences(raw: string): string {
  let text = raw.trim()
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  }
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start >= 0 && end > start) text = text.slice(start, end + 1)
  return text.trim()
}

function looksLikeRefusal(text: string): boolean {
  const t = text.toLowerCase()
  if (!t.trim()) return true
  // Structured JSON drafts are never refusals.
  if (t.includes('"blocks"') && t.includes('"title"')) return false
  const cues = [
    'i cannot',
    "i can't",
    'i am unable',
    "i'm unable",
    'cannot assist',
    "can't assist",
    'not able to help',
    'against my guidelines',
    'as an ai',
    'i must refuse',
    'i will not',
    'cannot provide',
    'unable to generate',
    'refuse to'
  ]
  return cues.some((c) => t.includes(c)) && !t.includes('"blocks"')
}

function scientificReframe(topic: string, notes: string): string {
  return [
    'Reframe this as a curiosity-driven science / cognitive-psychology investigation.',
    'Prefer angles like: mechanisms, limits of intuition, why perfect performance is a myth,',
    'evolutionary trade-offs, measurement challenges, or everyday phenomenology — not how-to harm,',
    'deception instruction, or exploit guidance.',
    '',
    `Original topic: ${topic}`,
    notes ? `Author notes:\n${notes}` : null,
    '',
    'Write a complete Elevate draft JSON now, with the scientific framing above.'
  ].filter(Boolean).join('\n')
}

function normalizeBlock(raw: any): ComposedBlock | null {
  const type = String(raw?.type || '') as ComposedBlockType
  if (!BLOCK_TYPES.has(type)) return null
  const block: ComposedBlock = { id: newBlockId(), type }
  if (typeof raw.text === 'string') block.text = raw.text
  if (typeof raw.label === 'string') block.label = raw.label
  if (typeof raw.src === 'string') block.src = raw.src
  if (typeof raw.alt === 'string') block.alt = raw.alt
  if (typeof raw.caption === 'string') block.caption = raw.caption
  if (Array.isArray(raw.items)) {
    block.items = raw.items.map((item: any) => String(item ?? '')).filter((s: string) => s.length >= 0)
  }
  if (type === 'list' && !block.items) block.items = ['']
  if (type === 'callout' && !block.label) block.label = 'Note'
  if (type === 'figure') {
    block.src = block.src || ''
    block.alt = block.alt || ''
    block.caption = block.caption || ''
  }
  return block
}

function normalizeReferences(raw: any): ComposedReference[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item, index) => ({
      id: Number(item?.id) || index + 1,
      title: String(item?.title || '').trim() || `Reference ${index + 1}`,
      source: String(item?.source || '').trim() || 'Source',
      href: String(item?.href || '').trim() || '#'
    }))
    .filter((item) => item.title)
}

function draftFromModel(parsed: any, topic: string): ComposedPost {
  const title = String(parsed?.title || topic).trim() || topic
  const slug = slugifyTitle(String(parsed?.slug || title))
  const now = new Date().toISOString()

  const blocks = Array.isArray(parsed?.blocks)
    ? (parsed.blocks.map(normalizeBlock).filter(Boolean) as ComposedBlock[])
    : []

  return emptyComposedPost({
    title,
    slug,
    dek: String(parsed?.dek || '').trim(),
    category: String(parsed?.category || 'Mind & meaning').trim() || 'Mind & meaning',
    tags: Array.isArray(parsed?.tags)
      ? parsed.tags.map((tag: unknown) => String(tag || '').trim()).filter(Boolean).slice(0, 6)
      : [],
    minutes: Math.max(1, Math.min(30, Number(parsed?.minutes) || 8)),
    hero: '',
    heroAlt: String(parsed?.heroAlt || '').trim(),
    status: 'draft',
    publishedAt: now,
    updatedAt: now,
    marginNote: {
      label: String(parsed?.marginNote?.label || 'One useful idea.').trim() || 'One useful idea.',
      body: String(parsed?.marginNote?.body || '').trim()
    },
    blocks: blocks.length
      ? blocks
      : [
          { id: newBlockId(), type: 'lead', text: `A draft about ${topic}.` },
          { id: newBlockId(), type: 'paragraph', text: '' }
        ],
    references: normalizeReferences(parsed?.references)
  })
}

async function callGroq(opts: {
  apiKey: string
  model: string
  systemPrompt: string
  userPrompt: string
}): Promise<ProviderCallResult> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'EntertrainerComposeBot/1.0 (https://entertrainer.in; elevate-composer)'
    },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: 'system', content: opts.systemPrompt },
        { role: 'user', content: opts.userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: GROQ_MAX_TOKENS
    })
  })

  const rate: Record<string, string> = {}
  for (const key of [
    'x-ratelimit-remaining-requests',
    'x-ratelimit-remaining-tokens',
    'x-ratelimit-limit-requests',
    'x-ratelimit-limit-tokens'
  ]) {
    const v = res.headers.get(key)
    if (v) rate[key] = v
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    return { content: '', status: res.status, errText, rate }
  }

  const payload = await res.json() as any
  const content = String(payload?.choices?.[0]?.message?.content || '')
  return { content, status: res.status, errText: '', rate }
}

function extractGeminiText(payload: any): string {
  const parts = payload?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ''
  return parts
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .filter(Boolean)
    .join('\n')
    .trim()
}

async function callGemini(opts: {
  apiKey: string
  model: string
  systemPrompt: string
  userPrompt: string
}): Promise<ProviderCallResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(opts.model)}:generateContent`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-goog-api-key': opts.apiKey,
      'User-Agent': 'EntertrainerComposeBot/1.0 (https://entertrainer.in; elevate-composer)'
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: opts.systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: opts.userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: GEMINI_MAX_TOKENS,
        responseMimeType: 'application/json'
      }
    })
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    return { content: '', status: res.status, errText }
  }

  const payload = await res.json() as any
  const content = extractGeminiText(payload)
  return { content, status: res.status, errText: '' }
}

function tryParseDraft(content: string): any | null {
  if (!content || looksLikeRefusal(content)) return null
  try {
    const parsed = JSON.parse(stripJsonFences(content))
    if (!parsed || typeof parsed !== 'object') return null
    // Require at least a title or blocks to count as a usable draft.
    if (!parsed.title && !Array.isArray(parsed.blocks)) return null
    if (Array.isArray(parsed.blocks) && parsed.blocks.length === 0 && !parsed.title) return null
    return parsed
  } catch {
    return null
  }
}

function resolveProvider(
  requested: unknown,
  groqKey: string,
  geminiKey: string
): ProviderId {
  const raw = String(requested || '').trim().toLowerCase()
  if (raw === 'groq' || raw === 'gemini') return raw as ProviderId
  if (groqKey) return 'groq'
  if (geminiKey) return 'gemini'
  throw createError({
    statusCode: 503,
    statusMessage:
      'No AI provider configured. Set GROQ_API_KEY and/or GEMINI_API_KEY in Vercel → Settings → Environment Variables (or local .env) and redeploy.'
  })
}

export default defineEventHandler(async (event) => {
  assertComposeAccess(event)
  const config = useRuntimeConfig()
  const groqApiKey = String(config.groqApiKey || process.env.GROQ_API_KEY || '').trim()
  const groqModel = String(config.groqModel || process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL).trim() || DEFAULT_GROQ_MODEL
  const geminiApiKey = String(config.geminiApiKey || process.env.GEMINI_API_KEY || '').trim()
  const geminiModel = String(config.geminiModel || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL).trim() || DEFAULT_GEMINI_MODEL
  const geminiImageModel = String(
    config.geminiImageModel || process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'
  ).trim() || 'gemini-2.5-flash-image'
  const gammaApiKey = String(config.gammaApiKey || process.env.GAMMA_API_KEY || '').trim()

  let body: any
  try {
    body = await parseBody(event)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Could not read request body.' })
  }

  const topic = String(body?.topic ?? body?.title ?? '').trim()
  const notes = String(body?.notes ?? '').trim()
  const heroOnly = Boolean(body?.heroOnly)
  const imageSource = normalizeImageSource(body?.imageSource)

  // ── Hero-only regenerate (no full draft LLM) ──────────────────────────────
  if (heroOnly) {
    const title = String(body?.title ?? topic).trim()
    const dek = String(body?.dek ?? '').trim()
    const slug = String(body?.slug ?? '').trim() || 'draft'
    const seedRaw = body?.seed
    const seed =
      typeof seedRaw === 'number'
        ? seedRaw
        : typeof seedRaw === 'string' && seedRaw.trim()
          ? seedRaw
          : Date.now()
    if (!topic && !title) {
      throw createError({ statusCode: 400, statusMessage: 'topic or title is required for hero regeneration' })
    }
    const briefFromBody = parseHeroBrief(body?.heroBrief)
    try {
      const hero = await generateElevateHero({
        topic: topic || title,
        slug,
        title,
        dek,
        seed,
        brief: briefFromBody
      })
      return {
        hero: hero.dataUrl,
        heroAlt: hero.alt,
        heroBrief: hero.brief,
        motif: hero.motif,
        heroOnly: true
      }
    } catch (heroErr: any) {
      throw createError({
        statusCode: 502,
        statusMessage: heroErr?.message || 'Hero regeneration failed'
      })
    }
  }

  const provider = resolveProvider(body?.provider, groqApiKey, geminiApiKey)

  if (!topic) {
    throw createError({ statusCode: 400, statusMessage: 'topic is required' })
  }
  if (topic.length > 300) {
    throw createError({ statusCode: 400, statusMessage: 'topic is too long' })
  }

  if (provider === 'groq' && !groqApiKey) {
    throw createError({
      statusCode: 503,
      statusMessage:
        'GROQ_API_KEY is not configured on the server. Add it in Vercel → Settings → Environment Variables (or local .env) and redeploy.'
    })
  }
  if (provider === 'gemini' && !geminiApiKey) {
    throw createError({
      statusCode: 503,
      statusMessage:
        'GEMINI_API_KEY is not configured on the server. Add it in Vercel → Settings → Environment Variables (or local .env) and redeploy.'
    })
  }

  const model = provider === 'groq' ? groqModel : geminiModel
  const apiKey = provider === 'groq' ? groqApiKey : geminiApiKey
  const callProvider = provider === 'groq' ? callGroq : callGemini
  const providerLabel = provider === 'groq' ? 'Groq' : 'Gemini'

  const systemPrompt = buildComposeSystemPrompt()
  const primaryUser = [
    `Topic: ${topic}`,
    notes ? `Author notes / angle preferences:\n${notes}` : null,
    'Frame this as science of cognition / psychology / everyday phenomenology when the topic could be misread as harm instruction.',
    'Write a complete Elevate draft JSON for this topic now.'
  ].filter(Boolean).join('\n\n')

  let lastError = ''
  let parsed: any = null

  try {
    const first = await callProvider({
      apiKey,
      model,
      systemPrompt,
      userPrompt: primaryUser
    })

    if (first.status === 429) {
      throw createError({
        statusCode: 429,
        statusMessage:
          provider === 'groq'
            ? 'Groq free-tier rate limit hit. Wait a minute and retry. compound usually has ~250 RPM / ~70k TPM; smaller models can be ~8k TPM.'
            : 'Gemini rate limit / quota hit. Wait a minute and retry, or switch to Groq.'
      })
    }

    if (first.status === 503 && provider === 'gemini') {
      lastError = `Gemini high demand (503): ${first.errText.slice(0, 240) || 'try again or set GEMINI_MODEL to gemini-3.5-flash-lite'}`
    } else if (first.status >= 400) {
      lastError = `${providerLabel} error ${first.status}: ${first.errText.slice(0, 240) || 'request failed'}`
    } else {
      parsed = tryParseDraft(first.content)
      if (!parsed) {
        lastError = looksLikeRefusal(first.content)
          ? 'Model refused or returned non-draft text on the first pass.'
          : 'Could not parse a ComposedPost JSON draft on the first pass.'
      }
    }

    // One retry with an explicit scientific reframe (helps when framing looks like harm/deception how-to).
    if (!parsed) {
      const retry = await callProvider({
        apiKey,
        model,
        systemPrompt,
        userPrompt: scientificReframe(topic, notes)
      })

      if (retry.status === 429) {
        throw createError({
          statusCode: 429,
          statusMessage:
            provider === 'groq'
              ? 'Groq free-tier rate limit hit on retry. Wait a minute, then try a narrower scientific angle.'
              : 'Gemini rate limit / quota hit on retry. Wait a minute, then try again or switch provider.'
        })
      }

      if (retry.status >= 400) {
        lastError = `Retry ${providerLabel} error ${retry.status}: ${retry.errText.slice(0, 240) || 'request failed'}`
      } else {
        parsed = tryParseDraft(retry.content)
        if (!parsed) {
          lastError = looksLikeRefusal(retry.content)
            ? 'Model still refused after a scientific reframe. Try a curiosity/cognitive-psychology angle (e.g. “why perfect lying is a myth”) instead of how-to framing.'
            : 'Retry returned empty or invalid JSON. Simplify the topic or add clearer science notes, then try again.'
        }
      }
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 502,
      statusMessage: `${providerLabel} request failed: ${err?.message || 'network error'}`
    })
  }

  if (!parsed) {
    throw createError({
      statusCode: 502,
      statusMessage: lastError || 'Could not generate a draft. Reframe as science/cognition and retry.'
    })
  }

  const post = draftFromModel(parsed, topic)

  let voiceGate = runHumanNotModelGate({
    title: post.title,
    dek: post.dek,
    blocks: post.blocks
  })

  if (!voiceGate.pass) {
    try {
      const voiceRetry = await callProvider({
        apiKey,
        model,
        systemPrompt,
        userPrompt: [
          `Topic: ${topic}`,
          notes ? `Author notes / angle preferences:\n${notes}` : null,
          formatGateForRetry(voiceGate),
          'Write a complete replacement Elevate draft JSON now. Rebuild rhythm and scene; do not synonym-swap the failed draft.'
        ].filter(Boolean).join('\n\n')
      })
      if (voiceRetry.status < 400) {
        const retried = tryParseDraft(voiceRetry.content)
        if (retried) {
          const next = draftFromModel(retried, topic)
          const nextGate = runHumanNotModelGate({
            title: next.title,
            dek: next.dek,
            blocks: next.blocks
          })
          parsed = retried
          Object.assign(post, next)
          voiceGate = nextGate
        }
      }
    } catch {
      /* keep first draft; report the failing gate */
    }
  }

  let imageWarning: string | undefined
  let imageSourceUsed = imageSource

  // Conceptual Elevate hero ALWAYS — topic-driven metaphor (not Gemini/Gamma noise).
  // Prefer LLM heroBrief from the draft JSON; fall back to heuristic pickHeroBrief.
  let heroBriefUsed = parseHeroBrief(parsed?.heroBrief) || pickHeroBrief(topic, post.slug, post.title, post.dek)
  try {
    const hero = await generateElevateHero({
      topic,
      slug: post.slug,
      title: post.title,
      dek: post.dek,
      brief: heroBriefUsed
    })
    post.hero = hero.dataUrl
    post.heroAlt = hero.alt || post.heroAlt
    heroBriefUsed = hero.brief
  } catch (heroErr: any) {
    imageWarning = heroErr?.message || 'Procedural Elevate hero failed'
  }

  // Figure enrichment AFTER text — time-budgeted; never fail the draft when LLM succeeded.
  // Heroes are procedural above; Commons/Gemini/Gamma only fill inline figures.
  try {
    const figureBlocks = post.blocks.filter((b) => b.type === 'figure')
    const figureCount = figureBlocks.length
    const figureHints = figureBlocks.map((b) => b.alt || b.caption || b.text || '').filter(Boolean)
    const enriched = await enrichComposeImages({
      topic,
      figureCount: Math.min(4, Math.max(2, figureCount || 2)),
      figureHints,
      imageSource,
      geminiApiKey,
      geminiImageModel,
      gammaApiKey,
      budgetMs: IMAGE_PHASE_BUDGET_MS,
      includeHero: false
    })
    imageSourceUsed = enriched.sourceUsed
    if (enriched.warning) {
      imageWarning = imageWarning ? `${imageWarning}; ${enriched.warning}` : enriched.warning
    }
    applyImagesToFigures(post.blocks, enriched.images, { skipHeroSlot: false })
  } catch (err: any) {
    try {
      applyImagesToFigures(post.blocks, [])
    } catch {
      /* ignore */
    }
    const skip = `Image enrichment skipped (${err?.message || 'error'}); draft text is ready — add images manually or retry with Commons.`
    imageWarning = imageWarning ? `${imageWarning}; ${skip}` : skip
  }

  post.status = 'draft'
  post.updatedAt = new Date().toISOString()

  return {
    post,
    provider,
    model,
    imageSource: imageSourceUsed,
    imageWarning: imageWarning || undefined,
    heroBrief: heroBriefUsed,
    voiceGate
  }
})
