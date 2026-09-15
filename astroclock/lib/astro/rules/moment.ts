/** P1 — moment sharpness helpers: panchanga-lite, orb bands, combustion, day volume */

import { absShortest, norm360 } from '../math';
import type { GrahaId } from '../constants';

export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

/** Classical yoga names (27) — approximate from Sun+Moon longitude sum */
export const YOGA_NAMES = [
  'Vishkambha',
  'Priti',
  'Ayushman',
  'Saubhagya',
  'Shobhana',
  'Atiganda',
  'Sukarma',
  'Dhriti',
  'Shula',
  'Ganda',
  'Vriddhi',
  'Dhruva',
  'Vyaghata',
  'Harshana',
  'Vajra',
  'Siddhi',
  'Vyatipata',
  'Variyan',
  'Parigha',
  'Shiva',
  'Siddha',
  'Sadhya',
  'Shubha',
  'Shukla',
  'Brahma',
  'Indra',
  'Vaidhriti',
] as const;

/** Karana names cycle (half-tithi) — simplified */
export const KARANA_MOVABLE = [
  'Bava',
  'Balava',
  'Kaulava',
  'Taitila',
  'Gara',
  'Vanija',
  'Vishti',
] as const;

export type OrbBand = 'exact' | 'tight' | 'wide';

export function orbBand(orbDeg: number): OrbBand {
  if (orbDeg < 0.5) return 'exact';
  if (orbDeg < 2) return 'tight';
  return 'wide';
}

export function orbBandWording(band: OrbBand): { life: string; advice: string } {
  if (band === 'exact') {
    return {
      life: 'A contact is exact — that theme is loud right now in mood, talk, and choices.',
      advice: 'Treat the moment as a peak: act with care, then integrate.',
    };
  }
  if (band === 'tight') {
    return {
      life: 'A contact is close — that theme is clearly in play in daily life.',
      advice: 'Stay precise; the window is open but not infinite.',
    };
  }
  return {
    life: 'A contact is loose — more background noise than a headline; don’t over-weight it.',
    advice: 'Note it, but do not over-weight a loose connection.',
  };
}

export function weekdayFromDate(d: Date): string {
  return WEEKDAYS[d.getUTCDay()];
}

/** Yoga from (Sun + Moon) sidereal / (360/27) — classical approximation */
export function computeYoga(
  sunSid: number,
  moonSid: number,
): { index: number; name: string } {
  const sum = norm360(sunSid + moonSid);
  const span = 360 / 27;
  const index = Math.floor(sum / span) % 27;
  return { index, name: YOGA_NAMES[index] };
}

/**
 * Karana from Moon–Sun elongation half-tithis.
 * First half of first tithi = Kimstughna; last half of Amavasya = Naga;
 * otherwise movable cycle. Simplified: use movable cycle for ordinary halves.
 */
export function computeKarana(
  moonSid: number,
  sunSid: number,
): { name: string; approx: boolean } {
  const diff = norm360(moonSid - sunSid);
  const half = Math.floor(diff / 6); // 0..59
  if (half === 0) return { name: 'Kimstughna', approx: true };
  if (half === 59) return { name: 'Naga', approx: true };
  if (half >= 57) {
    const fixed = ['Shakuni', 'Chatushpada', 'Naga'] as const;
    return { name: fixed[half - 57], approx: true };
  }
  const movableIdx = (half - 1) % 7;
  return { name: KARANA_MOVABLE[movableIdx], approx: true };
}

export interface CombustionHit {
  graha: GrahaId;
  sep: number;
  underBeams: boolean;
  combust: boolean;
}

const COMBUST_ORBS: Partial<Record<GrahaId, number>> = {
  Mercury: 14,
  Venus: 10,
  Mars: 17,
};

/** Combustion / under Sun beams for Mercury, Venus, optional Mars */
export function detectCombustion(
  sunSid: number,
  planets: Partial<Record<GrahaId, number>>,
): CombustionHit[] {
  const out: CombustionHit[] = [];
  for (const g of ['Mercury', 'Venus', 'Mars'] as GrahaId[]) {
    const lon = planets[g];
    if (lon == null) continue;
    const sep = absShortest(lon, sunSid);
    const orb = COMBUST_ORBS[g] ?? 12;
    const combust = sep <= orb * 0.55;
    const underBeams = sep <= orb && !combust;
    if (combust || underBeams) {
      out.push({ graha: g, sep, underBeams, combust });
    }
  }
  return out;
}

export function combustionWording(hit: CombustionHit): {
  life: string;
  advice: string;
} {
  if (hit.combust) {
    return {
      life: `${hit.graha} is sitting very close to the Sun — its voice can feel washed in solar heat.`,
      advice: `Favour quiet drafts over loud launches; let identity heat settle before you broadcast.`,
    };
  }
  return {
    life: `${hit.graha} is near the Sun — still visible, but softer than usual.`,
    advice: `Keep ${hit.graha} themes practical and low-drama until the Sun moves on.`,
  };
}

/** Moon speed notes (°/day) */
export function moonSpeedNote(speedDegPerDay: number): string | null {
  const abs = Math.abs(speedDegPerDay);
  if (abs >= 14.5) {
    return 'The Moon is moving fast — moods and needs may shift quickly today; decide small, revisit later.';
  }
  if (abs <= 11.5) {
    return 'The Moon is moving slowly — feelings linger; give them room rather than forcing a quick decision.';
  }
  return null;
}

export type DayVolume = 'quiet' | 'balanced' | 'loud';

export function dayVolumeFromAspectCount(totalAspects: number): {
  volume: DayVolume;
  life: string;
  advice: string;
} {
  if (totalAspects <= 1) {
    return {
      volume: 'quiet',
      life: 'A quiet sky day — few exact links, more room for deep work than forced pivots.',
      advice: 'Protect focus; skip manufacturing drama when the sky is sparse.',
    };
  }
  if (totalAspects >= 5) {
    return {
      volume: 'loud',
      life: 'A loud sky day — many links competing for attention.',
      advice: 'Pick one or two headlines; do not try to answer every sky ping.',
    };
  }
  return {
    volume: 'balanced',
    life: 'A balanced sky day — enough contacts to shape the hours without a stampede.',
    advice: 'Alternate push and glide; name the main thread once.',
  };
}

export function yogaWording(name: string): string {
  const soft = new Set([
    'Priti',
    'Ayushman',
    'Saubhagya',
    'Shobhana',
    'Sukarma',
    'Dhriti',
    'Vriddhi',
    'Dhruva',
    'Harshana',
    'Siddhi',
    'Variyan',
    'Shiva',
    'Siddha',
    'Sadhya',
    'Shubha',
    'Shukla',
    'Brahma',
    'Indra',
  ]);
  if (soft.has(name)) {
    return 'This lunar-day leans cooperative — favour alliance and finish work.';
  }
  return 'This lunar-day leans edged — favour precision and smaller scope.';
}

export function karanaWording(name: string): string {
  if (name === 'Vishti') {
    return 'This half-day traditionally favours repairs and closing loops over brand-new launches.';
  }
  if (name === 'Naga' || name === 'Kimstughna') {
    return 'You’re at an edge-of-cycle half-day — keep aims simple.';
  }
  return 'Ordinary half-day rhythm — ordinary work is fine.';
}
