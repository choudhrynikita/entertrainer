export type ScaleId = 'earth' | 'sun' | 'galaxy' | 'cosmos'

export interface ScaleDef {
  id: ScaleId
  name: string
  kicker: string
  kms: number
  story: string[]
}

export const SCALES: ScaleDef[] = [
  {
    id: 'earth',
    name: 'Earth spin',
    kicker: 'You, on the surface',
    kms: 1670,
    story: [
      'The ground is already moving. At the equator the surface of the Earth travels about 1,670 kilometres an hour. That number falls with the cosine of latitude — Delhi sits near 1,470.',
      'One blink, ten kilometres. You do not feel it because everything in the room is riding the same circle.',
      'Drag the pin. The speed is yours, not a global average.',
    ],
  },
  {
    id: 'sun',
    name: 'Solar orbit',
    kicker: 'Earth around the Sun',
    kms: 107000,
    story: [
      'The planet is also falling around the Sun at about 107,000 kilometres an hour. A year is that orbit, nothing more ceremonial.',
      'The seasons are a tilt, not a speed change. The number on the dial barely moves from January to July.',
    ],
  },
  {
    id: 'galaxy',
    name: 'Milky Way',
    kicker: 'Sun around the core',
    kms: 828000,
    story: [
      'The Sun is not parked. It is riding the disc of the Milky Way at about 828,000 kilometres an hour, one loop every 230 million years.',
      'We have no photograph of that orbit from outside. The spiral is a reconstruction from motion and dust.',
    ],
  },
  {
    id: 'cosmos',
    name: 'CMB frame',
    kicker: 'Against the leftover light',
    kms: 2200000,
    story: [
      'The microwave sky is slightly warmer in one direction. That dipole is our motion relative to the rest frame of the early universe — about 370 km/s, or 2.2 million km/h.',
      'That is the largest speed on this dial. It is also the quietest: no wind, no sound, only a colour in the oldest light.',
    ],
  },
]

export const NEXT_UNIT = { 'km/h': 'mph', mph: 'km/s', 'km/s': 'km/h' } as const
export type SpeedUnit = keyof typeof NEXT_UNIT

export function spinKms(latDeg: number): number {
  const lat = Math.max(-90, Math.min(90, latDeg))
  return 1670 * Math.cos((lat * Math.PI) / 180)
}

export function latHemisphere(lat: number): string {
  if (Math.abs(lat) < 0.4) return 'equator'
  return lat >= 0 ? `${lat.toFixed(1)}°N` : `${Math.abs(lat).toFixed(1)}°S`
}

export function formatSpeed(kms: number, unit: SpeedUnit, locale = 'en-US'): string {
  const n = unit === 'mph' ? kms * 0.621371 : unit === 'km/s' ? kms / 3600 : kms
  const digits = unit === 'km/s' ? (n >= 10 ? 0 : 2) : 0
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(n)} ${unit}`
}

export function speedForScale(id: ScaleId, lat: number): number {
  if (id === 'earth') return spinKms(lat)
  const row = SCALES.find((s) => s.id === id)
  return row?.kms ?? 0
}
