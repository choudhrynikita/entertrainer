/** P2 — small classical yoga set (plain English) */

import type { GrahaId, LonMap } from '../constants';
import { absShortest } from '../math';

export interface YogaHit {
  id: string;
  title: string;
  body: string;
  advice: string;
}

function angleBetween(a: number, b: number): number {
  return absShortest(a, b);
}

/** Gaja Kesari-like: Jupiter–Moon angle near 90 or 180 (or same sign / trine-ish) */
export function detectGajaKesari(lons: LonMap): YogaHit | null {
  const d = angleBetween(lons.Jupiter, lons.Moon);
  const hit =
    Math.abs(d - 90) <= 8 ||
    Math.abs(d - 180) <= 8 ||
    Math.abs(d - 120) <= 8 ||
    d <= 8;
  if (!hit) return null;
  return {
    id: 'gaja-kesari-lite',
    title: 'Jupiter–Moon grace (Gaja Kesari-like)',
    body: `Jupiter and Moon are linked by a classic supportive angle. People often read this as emotional wisdom with room to grow — mind and meaning on speaking terms.`,
    advice:
      'Lean into teaching, mentoring, or generous listening while this pattern is natal; do not confuse grace with permission to lecture.',
  };
}

/** Budha-Aditya: Mercury near Sun */
export function detectBudhaAditya(lons: LonMap): YogaHit | null {
  const d = angleBetween(lons.Mercury, lons.Sun);
  if (d > 12) return null;
  return {
    id: 'budha-aditya-lite',
    title: 'Sun–Mercury clarity (Budha-Aditya-like)',
    body: `Mercury sits close to the Sun — thinking and identity heat share a desk. Speech can be vivid and purposeful when ego does not drown the edit.`,
    advice:
      'Write the short clear version; let pride serve the message, not the other way around.',
  };
}

/** Kemadruma-lite: Moon isolated — no planet within ~30° (excl. Sun/nodes soft) */
export function detectKemadrumaLite(lons: LonMap): YogaHit | null {
  const moon = lons.Moon;
  const others: GrahaId[] = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const near = others.filter((g) => angleBetween(lons[g], moon) <= 30);
  if (near.length > 0) return null;
  return {
    id: 'kemadruma-lite',
    title: 'Moon standing alone (Kemadruma-lite)',
    body: 'The Moon has little planetary company nearby — feelings can feel self-sourced. Classical texts warn of isolation; modern reading: you may need to build emotional scaffolding on purpose.',
    advice:
      'Schedule harbour deliberately — friend, ritual, or quiet craft — so solitude does not become exile.',
  };
}

export function detectYogas(lons: LonMap): YogaHit[] {
  const hits: YogaHit[] = [];
  const gk = detectGajaKesari(lons);
  if (gk) hits.push(gk);
  const ba = detectBudhaAditya(lons);
  if (ba) hits.push(ba);
  const km = detectKemadrumaLite(lons);
  if (km) hits.push(km);
  return hits;
}
