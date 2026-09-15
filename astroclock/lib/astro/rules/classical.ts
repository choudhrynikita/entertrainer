/** P2 — lagnesha / Moon-lord chains, atmakaraka-lite, dusthana/upachaya tones */

import type { GrahaId } from '../constants';
import { grahaBhavaRule } from './grahaBhava';

export const RASHI_LORDS: GrahaId[] = [
  'Mars',
  'Venus',
  'Mercury',
  'Moon',
  'Sun',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Saturn',
  'Jupiter',
];

const RASHI_INDEX: Record<string, number> = {
  Mesha: 0,
  Vrishabha: 1,
  Mithuna: 2,
  Karka: 3,
  Simha: 4,
  Kanya: 5,
  Tula: 6,
  Vrischika: 7,
  Dhanu: 8,
  Makara: 9,
  Kumbha: 10,
  Meena: 11,
};

export function lordOfRashi(rashi: string): GrahaId {
  const i = RASHI_INDEX[rashi] ?? 0;
  return RASHI_LORDS[i];
}

export const DUSTHANA = new Set([6, 8, 12]);
export const UPACHAYA = new Set([3, 6, 10, 11]);

const LIFE_LABEL: Record<number, string> = {
  1: 'how you show up and first impressions',
  2: 'money, speech, and values',
  3: 'courage, peers, and everyday hustle',
  4: 'home, family base, and private mood',
  5: 'creative work, romance, play, and mentoring',
  6: 'routines, health habits, and daily problems',
  7: 'one-to-one relationships and contracts',
  8: 'shared resources, intimacy, and big resets',
  9: 'beliefs, teachers, and the bigger why',
  10: 'career and public reputation',
  11: 'friends, networks, and future goals',
  12: 'rest, solitude, and quiet recharge',
};


export function houseToneFlag(house: number): {
  flag: 'dusthana' | 'upachaya' | 'neutral';
  note: string;
} {
  if (DUSTHANA.has(house) && UPACHAYA.has(house)) {
    // house 6 is both
    return {
      flag: 'dusthana',
      note: 'Routines and rivals mix challenge and growth — skill under friction, not doom.',
    };
  }
  if (DUSTHANA.has(house)) {
    const life = LIFE_LABEL[house] || 'that life area';
    return {
      flag: 'dusthana',
      note: `${life.charAt(0).toUpperCase() + life.slice(1)} can be a pressure zone — meet it as training, not as a verdict.`,
    };
  }
  if (UPACHAYA.has(house)) {
    const life = LIFE_LABEL[house] || 'that life area';
    return {
      flag: 'upachaya',
      note: `${life.charAt(0).toUpperCase() + life.slice(1)} tends to improve with effort — gains grow when you show up repeatedly.`,
    };
  }
  return {
    flag: 'neutral',
    note: '',
  };
}

export function lagneshaInHouseText(
  lagLord: GrahaId,
  house: number,
): { body: string; advice: string } {
  const gb = grahaBhavaRule(lagLord, house);
  const tone = houseToneFlag(house);
  const life = LIFE_LABEL[house] || 'a core life theme';
  const body = `${lagLord} steers your outer style and leans into ${life}${gb ? `. ${gb.lifeArea}` : '.'}${tone.note ? ' ' + tone.note : ''}`;
  const advice =
    gb?.advice ||
    `Follow where ${lagLord} invests energy in ${life}; that is a primary behavioural engine.`;
  return { body, advice };
}

export function moonLordInHouseText(
  moonRashi: string,
  moonLordHouse: number,
  moonLord: GrahaId,
): { body: string; advice: string } {
  const gb = grahaBhavaRule(moonLord, moonLordHouse);
  const tone = houseToneFlag(moonLordHouse);
  const life = LIFE_LABEL[moonLordHouse] || 'daily life';
  const body = `${moonLord} steers your Moon sign and leans into ${life}${gb ? `. ${gb.lifeArea}` : '.'}${tone.note ? ' ' + tone.note : ''}`;
  const advice =
    gb?.advice ||
    `Tend ${life} to steady your emotional weather.`;
  return { body, advice };
}

/** Atmakaraka-lite: highest degree-in-sign among planets (excl. nodes by default) */
export function atmakarakaLite(
  placements: { id: GrahaId; degree: number }[],
  includeNodes = false,
): { id: GrahaId; degree: number } | null {
  const pool = placements.filter((p) =>
    includeNodes ? true : p.id !== 'Rahu' && p.id !== 'Ketu',
  );
  if (!pool.length) return null;
  let best = pool[0];
  for (const p of pool) {
    if (p.degree > best.degree) best = p;
  }
  return best;
}

export function atmakarakaWording(id: GrahaId, degree: number): {
  body: string;
  advice: string;
} {
  return {
    body: `A quiet signature in your chart: ${id} sits furthest into its sign. Many readers treat that as a life lesson you keep practising — what you keep learning to master — not a ranking of worth.`,
    advice: `Watch how ${id} themes keep returning. Practise the warm, useful version of ${id}, not the stereotype.`,
  };
}

/**
 * Navamsha (D9) from sidereal longitude — each sign divided into 9 parts of 3°20'.
 * Mapping: odd signs start from Mesha sequence; even signs start from Libra sequence
 * (Parashara / common Lahiri navamsha).
 */
export function navamshaRashiIndex(sidLon: number): number {
  const lon = ((sidLon % 360) + 360) % 360;
  const sign = Math.floor(lon / 30);
  const into = lon % 30;
  const pada = Math.min(8, Math.floor(into / (30 / 9))); // 0..8
  const odd = sign % 2 === 0; // Mesha=0 odd in 1-based; 0-based even index = odd sign
  // Odd signs (Mesha, Mithuna, …): navamsha starts at Mesha (0)
  // Even signs (Vrishabha, Karka, …): navamsha starts at Tula (6)
  const start = odd ? 0 : 6;
  return (start + pada) % 12;
}

export function navamshaRashiName(sidLon: number, rashiNames: string[]): string {
  return rashiNames[navamshaRashiIndex(sidLon)] || 'Mesha';
}
