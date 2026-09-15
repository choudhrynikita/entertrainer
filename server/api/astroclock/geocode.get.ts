/**
 * Nominatim geocode proxy for AstroClock.
 * Keeps User-Agent honest and throttles to ~1 req/s process-wide.
 *
 * Note: do not use auto-imported `getQuery` here — @nuxt/devtools pulls
 * h3@2 to the workspace root, and that getQuery expects a Web Request
 * shape Nitro's event does not have ("Invalid URL"). Parse the query
 * from the Node request URL instead.
 */

const USER_AGENT =
  'Entertrainer-AstroClock/1.0 (https://github.com/the-entertrainer/entertrainer; https://entertrainer.in/engage/astroclock)'

let lastFetchAt = 0
const MIN_INTERVAL_MS = 1000

export interface GeocodeHit {
  displayName: string
  lat: number
  lon: number
  type?: string
}

function readQ(event: { node?: { req?: { url?: string } }; path?: string }): string {
  const raw = event.node?.req?.url || event.path || ''
  const qs = raw.includes('?') ? raw.slice(raw.indexOf('?') + 1) : ''
  return String(new URLSearchParams(qs).get('q') ?? '').trim()
}

export default defineEventHandler(async (event) => {
  const q = readQ(event)

  if (q.length < 2) {
    return { results: [] as GeocodeHit[] }
  }
  if (q.length > 200) {
    throw createError({ statusCode: 400, statusMessage: 'Query too long' })
  }

  const wait = MIN_INTERVAL_MS - (Date.now() - lastFetchAt)
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait))
  }
  lastFetchAt = Date.now()

  const url =
    'https://nominatim.openstreetmap.org/search?' +
    new URLSearchParams({
      format: 'json',
      addressdetails: '1',
      limit: '8',
      q,
    }).toString()

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Geocode upstream error',
      })
    }

    const data = (await res.json()) as Array<{
      display_name?: string
      lat?: string
      lon?: string
      type?: string
      class?: string
    }>

    const results: GeocodeHit[] = (data || [])
      .map((row) => ({
        displayName: row.display_name || '',
        lat: Number(row.lat),
        lon: Number(row.lon),
        type: row.type || row.class,
      }))
      .filter(
        (r) =>
          r.displayName &&
          Number.isFinite(r.lat) &&
          Number.isFinite(r.lon),
      )

    return { results }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'statusCode' in err) throw err
    throw createError({
      statusCode: 502,
      statusMessage: 'Geocode request failed',
    })
  }
})
