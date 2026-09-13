/**
 * Fail-closed lint for Elevate drafts.
 * Detects model-default register against the human-not-model skill:
 * excess vocabulary (Kobak), GPT-ism phrases, burstiness, scene, competing turn.
 *
 * This is not a vendor AI detector and does not claim to prove authorship.
 */

export type GateSeverity = 'fail' | 'warn'

export type GateViolation = {
  severity: GateSeverity
  code: string
  detail: string
}

export type GateReport = {
  pass: boolean
  wordCount: number
  sentenceCount: number
  sentenceMean: number
  sentenceCv: number
  shortShare: number
  violations: GateViolation[]
}

const TIER1: Array<{ re: RegExp; word: string }> = [
  { word: 'delve', re: /\bdelv(e|es|ed|ing)\b/i },
  { word: 'tapestry', re: /\btapestries\b|\btapestry\b/i },
  { word: 'underscore-verb', re: /\bunderscor(e|es|ed|ing)\b/i },
  { word: 'intricate', re: /\bintricacies\b|\bintricate\b/i },
  { word: 'meticulous', re: /\bmeticulously\b|\bmeticulous\b/i },
  { word: 'showcase', re: /\bshowcas(e|es|ed|ing)\b/i },
  { word: 'multifaceted', re: /\bmultifaceted\b/i },
  { word: 'pivotal', re: /\bpivotal\b/i },
  { word: 'realm-of', re: /\bin the realm of\b/i },
  { word: 'testament-to', re: /\btestament to\b/i },
  { word: 'embark', re: /\bembark(s|ed|ing)?\b/i },
  { word: 'myriad', re: /\bmyriad\b/i },
  { word: 'harness-metaphor', re: /\bharness(es|ed|ing)?\b/i },
  { word: 'unlock-metaphor', re: /\bunlock(s|ed|ing)?\b/i },
  { word: 'foster-verb', re: /\bfoster(s|ed|ing)?\b/i },
  { word: 'leverage-verb', re: /\bleverage[sd]?\b|\bleveraging\b/i },
  { word: 'commendable', re: /\bcommendable\b/i },
  { word: 'garnered', re: /\bgarner(s|ed|ing)?\b/i },
  { word: 'renowned', re: /\brenowned\b/i },
  { word: 'revolutionize', re: /\brevolutionis(e|es|ed|ing)\b|\brevolutioniz(e|es|ed|ing)\b/i },
  { word: 'landscape-of', re: /\bthe\s+\w+\s+landscape\b|\bin today’s digital landscape\b|\bdigital landscape\b/i },
  { word: 'cornerstone', re: /\bcornerstone\b/i },
  { word: 'paramount', re: /\bparamount\b/i },
  { word: 'illuminate', re: /\billuminat(e|es|ed|ing)\b/i },
  { word: 'holistic', re: /\bholistic\b/i },
  { word: 'beacon', re: /\bbeacon\b/i },
  { word: 'interplay', re: /\binterplay\b/i }
]

const FAIL_PHRASES: Array<{ re: RegExp; phrase: string }> = [
  { phrase: 'in today’s fast-paced', re: /\bin today['’]s (fast-paced|ever-evolving|digital)\b/i },
  { phrase: 'it’s important to note', re: /\bit['’]?s important to note\b|\bit is important to note\b|\bit is worth noting\b|\bit['’]s worth noting\b|\bit should be noted\b|\bit bears mentioning\b/i },
  { phrase: 'let’s dive in', re: /\blet['’]s (dive in|unpack|take a deep dive)\b|\bdeep dive into\b/i },
  { phrase: 'whether you’re a', re: /\bwhether you['’]re an?\b/i },
  { phrase: 'at the end of the day', re: /\bat the end of the day\b/i },
  { phrase: 'comprehensive grasp', re: /\bcomprehensive grasp\b/i },
  { phrase: 'intricate interplay', re: /\bintricate interplay\b/i },
  { phrase: 'plays a pivotal role', re: /\bplays? a pivotal role\b/i },
  { phrase: 'moreover-opener', re: /(?:^|[.!?]\s+)(moreover|furthermore|additionally)\b/i },
  { phrase: 'in conclusion', re: /\bin conclusion\b|\bto summariz[e]\b|\bin summary\b/i },
  { phrase: 'here’s the thing', re: /\bhere['’]s the thing\b|\bhere['’]s where it gets interesting\b/i },
  { phrase: 'let’s be honest', re: /\blet['’]s be (honest|clear)\b/i },
  { phrase: 'as an AI', re: /\bas an ai\b|\bas a language model\b/i },
  { phrase: 'I hope this helps', re: /\bi hope this helps\b|\bfeel free to (ask|reach out)\b/i }
]

const TIER2: Array<{ re: RegExp; word: string }> = [
  { word: 'robust', re: /\brobust\b/i },
  { word: 'seamless', re: /\bseamless(ly)?\b/i },
  { word: 'crucial', re: /\bcrucial(ly)?\b/i },
  { word: 'notable', re: /\bnotable\b|\bnotably\b/i },
  { word: 'comprehensive', re: /\bcomprehensive(ly)?\b/i },
  { word: 'enhance', re: /\benhanc(e|es|ed|ing)\b/i },
  { word: 'navigate-metaphor', re: /\bnavigat(e|es|ed|ing)\b/i },
  { word: 'journey', re: /\bjourney\b/i },
  { word: 'ecosystem', re: /\becosystem\b/i },
  { word: 'paradigm', re: /\bparadigm\b/i },
  { word: 'synergy', re: /\bsynerg(y|ies)\b/i }
]

const TITLE_BANS = [
  /\bwhy your brain\b/i,
  /\bterrifying truth\b/i,
  /\bhardwired\b/i,
  /\bdissolving into the ether\b/i
]

const COMPETING = /\b(competing|limitation|limits of|where i have to be honest|the tidy story|not a settled|evidence is mixed|a plausible reading|treat it as a competing|counter-argument|still genuinely unsettled|later work (has|have) been unkind|a separate line of research|hypothesis built from|read carefully, that is|the full mechanism is still|on this account|this is not a law|not a replacement slogan|the useful part|physically, no)\b/i

const GENERIC_OPENER = /\b(in the (study|field|world|realm) of|human beings have always|throughout history|have you ever wondered|in today’s|in today's)\b/i

const NOT_X_IT_Y = /\b(it['’]s not\b.{0,60}\bit['’]s\b|\bthis is not (about )?.{0,40}\.?\s*it['’]?s\b|\bnot because\b.{0,50}\bbecause\b)/gi

const HUMANIZER_SLANG = /\b(hits different|chef['’]s kiss|let that sink in|\brizz\b|unalive|living rent-free)\b/i

function stripToProse(raw: string): string {
  return String(raw || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function splitSentences(text: string): string[] {
  const parts = stripToProse(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1)
  return parts.length ? parts : stripToProse(text) ? [stripToProse(text)] : []
}

function wordCount(text: string): number {
  const m = stripToProse(text).match(/[A-Za-z']+/g)
  return m ? m.length : 0
}

function mean(xs: number[]): number {
  if (!xs.length) return 0
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

function stdev(xs: number[]): number {
  if (xs.length < 2) return 0
  const m = mean(xs)
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1)
  return Math.sqrt(v)
}

export function collectDraftText(input: {
  title?: string
  dek?: string
  body?: string
  blocks?: Array<{ text?: string; caption?: string; alt?: string; items?: string[]; label?: string }>
}): string {
  const chunks: string[] = []
  if (input.title) chunks.push(input.title)
  if (input.dek) chunks.push(input.dek)
  if (input.body) chunks.push(input.body)
  for (const b of input.blocks || []) {
    if (b.label) chunks.push(b.label)
    if (b.text) chunks.push(b.text)
    if (b.caption) chunks.push(b.caption)
    if (b.alt) chunks.push(b.alt)
    if (b.items?.length) chunks.push(b.items.join(' '))
  }
  return chunks.join('\n')
}

export function runHumanNotModelGate(input: {
  title?: string
  dek?: string
  body?: string
  blocks?: Array<{ text?: string; caption?: string; alt?: string; items?: string[]; label?: string; type?: string }>
}): GateReport {
  const title = String(input.title || '')
  const dek = String(input.dek || '')
  const full = collectDraftText(input)
  const prose = stripToProse(full)
  const sentences = splitSentences(full)
  const lengths = sentences.map((s) => wordCount(s)).filter((n) => n > 0)
  const wc = wordCount(full)
  const m = mean(lengths)
  const sd = stdev(lengths)
  const cv = m > 0 ? sd / m : 0
  const shortShare = lengths.length ? lengths.filter((n) => n <= 8).length / lengths.length : 0
  const violations: GateViolation[] = []

  const fail = (code: string, detail: string) => violations.push({ severity: 'fail', code, detail })
  const warn = (code: string, detail: string) => violations.push({ severity: 'warn', code, detail })

  for (const { re, word } of TIER1) {
    if (word === 'unlock-metaphor' && /\bunlock(s|ed|ing)? (a |the )?(door|phone|screen|lock)\b/i.test(prose)) continue
    if (word === 'foster-verb' && /\bfoster (child|home|parent|care)\b/i.test(prose)) continue
    if (word === 'tapestry' && /\b(a |the )tapestry (on |hanging |in the )\b/i.test(prose)) continue
    if (re.test(prose)) fail('tier1', `Tier-1 excess word: ${word}`)
  }

  for (const { re, phrase } of FAIL_PHRASES) {
    if (re.test(prose)) fail('phrase', `Banned phrase: ${phrase}`)
  }

  const tier2Hits = TIER2.filter(({ re }) => re.test(prose)).map((t) => t.word)
  if (tier2Hits.length >= 2) {
    fail('tier2-cluster', `Tier-2 cluster (${tier2Hits.length}): ${tier2Hits.join(', ')}`)
  } else if (tier2Hits.length === 1) {
    warn('tier2', `Tier-2 word: ${tier2Hits[0]}`)
  }

  for (const re of TITLE_BANS) {
    if (re.test(title) || re.test(dek)) fail('title-template', 'Pop-neuro title/dek template')
  }

  const notX = prose.match(NOT_X_IT_Y) || []
  if (notX.length > 2) fail('not-x-its-y', `"It's not X, it's Y" count ${notX.length} (max 2)`)
  else if (notX.length === 2) warn('not-x-its-y', `"It's not X, it's Y" used twice — do not add a third`)

  if (lengths.length >= 8 && cv < 0.55) {
    fail('burstiness', `Sentence-length CV ${cv.toFixed(2)} < 0.55 (catalog ~0.89, shortest essays ~0.57)`)
  }
  if (lengths.length >= 8 && shortShare < 0.22) {
    fail('short-sentences', `Short sentences (≤8 words) ${(shortShare * 100).toFixed(0)}% < 22% (catalog 27–57%, mean 43%)`)
  }

  const paraLens = (input.blocks || [])
    .filter((b) => b.type === 'paragraph' || b.type === 'lead')
    .map((b) => wordCount(b.text || ''))
    .filter((n) => n > 0)
  if (paraLens.length >= 4) {
    for (let i = 0; i <= paraLens.length - 4; i++) {
      const slice = paraLens.slice(i, i + 4)
      const pMean = mean(slice)
      if (pMean >= 35 && slice.every((n) => Math.abs(n - pMean) <= 5)) {
        warn('metronome-paragraphs', 'Four consecutive medium paragraphs within ±5 words — helpful-essay brick')
        break
      }
    }
  }

  const opening = sentences.slice(0, 6).join(' ')
  if (GENERIC_OPENER.test(opening)) {
    fail('no-scene', 'Opening is a generic explainer template, not a filmable scene')
  }

  const headings = (input.blocks || [])
    .filter((b) => b.type === 'heading' || b.type === 'paragraph' || b.type === 'callout')
    .map((b) => `${b.label || ''} ${b.text || ''}`)
    .join('\n')
  if (wc > 900 && !COMPETING.test(full) && !COMPETING.test(headings)) {
    warn('no-competing', 'No competing interpretation / limitation / “where I have to be honest” turn')
  }

  if (HUMANIZER_SLANG.test(prose)) fail('humanizer-slang', 'Humanizer slang the catalog does not use')

  const em = (prose.match(/—/g) || []).length
  if (sentences.length >= 10 && em / sentences.length > 0.2) {
    warn('emdash', `Em dashes in ${(em / sentences.length * 100).toFixed(0)}% of sentences — cut back`)
  }

  return {
    pass: !violations.some((v) => v.severity === 'fail'),
    wordCount: wc,
    sentenceCount: lengths.length,
    sentenceMean: Math.round(m * 10) / 10,
    sentenceCv: Math.round(cv * 100) / 100,
    shortShare: Math.round(shortShare * 100) / 100,
    violations
  }
}

export function formatGateForRetry(report: GateReport): string {
  const fails = report.violations.filter((v) => v.severity === 'fail')
  const warns = report.violations.filter((v) => v.severity === 'warn')
  return [
    'VOICE GATE FAILED. Rebuild the draft from the outline. Do not synonym-swap. Do not add typos or extra contractions.',
    `Stats: ${report.wordCount} words, ${report.sentenceCount} sentences, mean ${report.sentenceMean}, CV ${report.sentenceCv}, short≤8 ${Math.round(report.shortShare * 100)}%.`,
    'Hard fails:',
    ...fails.map((v) => `- [${v.code}] ${v.detail}`),
    warns.length ? 'Warnings:' : '',
    ...warns.map((v) => `- [${v.code}] ${v.detail}`),
    'Rewrite with: a filmable opening scene, bursty sentence lengths (many ≤8 words, some long), zero Tier-1 excess words, max two “it’s not X it’s Y”, and a competing-interpretation section.',
    'Return STRICT JSON only, same schema.'
  ].filter(Boolean).join('\n')
}
