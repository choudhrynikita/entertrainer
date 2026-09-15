import {
  ASPECT_ANGLES,
  ASPECT_ORB,
  DEG,
  GRAHAS,
  type GrahaId,
  type LonMap,
  type MeanKey,
  type PlanetMap,
  type SpeedMap,
  NAKSHATRAS,
  RASHIS,
  TITHI_NAMES,
} from './constants';
import {
  absShortest,
  centuriesJ2000,
  lahiriAyanamsha,
  norm360,
  shortestArc,
} from './math';

export interface MeanElements {
  sun: number;
  moon: number;
  mercury: number;
  venus: number;
  mars: number;
  jupiter: number;
  saturn: number;
  rahu: number;
  ketu: number;
}

/** Mean anomaly / longitude helpers (degrees) */
export function meanElements(jd: number): MeanElements {
  const T = centuriesJ2000(jd);

  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * DEG) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * DEG) +
    0.000289 * Math.sin(3 * M * DEG);
  const sun = norm360(L0 + C);

  const Lp = norm360(
    218.3164477 +
      481267.88123421 * T -
      0.0015786 * T * T +
      (T * T * T) / 538841 -
      (T * T * T * T) / 65194000,
  );
  const D = norm360(
    297.8501921 +
      445267.1114034 * T -
      0.0018819 * T * T +
      (T * T * T) / 545868 -
      (T * T * T * T) / 113065000,
  );
  const Mm = norm360(
    134.9633964 +
      477198.8675055 * T +
      0.0087414 * T * T +
      (T * T * T) / 69699 -
      (T * T * T * T) / 14712000,
  );
  const F = norm360(
    93.272095 +
      483202.0175233 * T -
      0.0036539 * T * T -
      (T * T * T) / 3526000 +
      (T * T * T * T) / 863310000,
  );
  const Ms = M;

  let moonLon =
    Lp +
    6.289 * Math.sin(Mm * DEG) +
    1.274 * Math.sin((2 * D - Mm) * DEG) +
    0.658 * Math.sin(2 * D * DEG) +
    0.214 * Math.sin(2 * Mm * DEG) -
    0.186 * Math.sin(Ms * DEG) -
    0.114 * Math.sin(2 * F * DEG) +
    0.059 * Math.sin((2 * D - 2 * Mm) * DEG) +
    0.057 * Math.sin((2 * D - Ms - Mm) * DEG) +
    0.053 * Math.sin((2 * D + Mm) * DEG) +
    0.046 * Math.sin((2 * D - Ms) * DEG) +
    0.041 * Math.sin((Ms - Mm) * DEG) -
    0.035 * Math.sin(D * DEG) -
    0.031 * Math.sin((Ms + Mm) * DEG);
  moonLon = norm360(moonLon);

  const mercL = norm360(252.250906 + 149474.0722491 * T + 0.00030397 * T * T);
  const mercM = norm360(174.7948 + 149472.5153 * T);
  const mercury = norm360(
    mercL +
      23.44 * Math.sin(mercM * DEG) +
      2.9818 * Math.sin(2 * mercM * DEG) +
      0.5255 * Math.sin(3 * mercM * DEG) +
      0.1058 * Math.sin(4 * mercM * DEG) +
      0.0241 * Math.sin(5 * mercM * DEG),
  );

  const venL = norm360(181.979801 + 58519.2130302 * T + 0.00031014 * T * T);
  const venM = norm360(50.4161 + 58517.8039 * T);
  const venus = norm360(
    venL + 0.7758 * Math.sin(venM * DEG) + 0.0033 * Math.sin(2 * venM * DEG),
  );

  const marL = norm360(355.433 + 19141.6964471 * T + 0.00031052 * T * T);
  const marM = norm360(19.373 + 19139.8585 * T);
  const mars = norm360(
    marL +
      10.6912 * Math.sin(marM * DEG) +
      0.6228 * Math.sin(2 * marM * DEG) +
      0.0503 * Math.sin(3 * marM * DEG) +
      0.0046 * Math.sin(4 * marM * DEG),
  );

  const jupL = norm360(34.351519 + 3036.886997 * T + 0.0002233 * T * T);
  const jupM = norm360(19.895 + 3034.692 * T);
  const jupiter = norm360(
    jupL +
      5.555 * Math.sin(jupM * DEG) +
      0.1683 * Math.sin(2 * jupM * DEG) +
      0.0071 * Math.sin(3 * jupM * DEG),
  );

  const satL = norm360(50.077444 + 1223.5110686 * T + 0.00051908 * T * T);
  const satM = norm360(317.0207 + 1222.1138 * T);
  const saturn = norm360(
    satL +
      6.406 * Math.sin(satM * DEG) +
      0.223 * Math.sin(2 * satM * DEG) +
      0.01 * Math.sin(3 * satM * DEG),
  );

  const Omega = norm360(
    125.0445479 -
      1934.1362891 * T +
      0.0020754 * T * T +
      (T * T * T) / 467441 -
      (T * T * T * T) / 60616000,
  );
  const rahu = Omega;
  const ketu = norm360(Omega + 180);

  return { sun, moon: moonLon, mercury, venus, mars, jupiter, saturn, rahu, ketu };
}

/** All graha sidereal longitudes + tropical for reference */
export function computePlanets(jd: number): PlanetMap {
  const el = meanElements(jd);
  const aya = lahiriAyanamsha(jd);
  const out = {} as PlanetMap;
  for (const g of GRAHAS) {
    const trop = el[g.meanKey as MeanKey];
    out[g.id] = {
      tropical: trop,
      sidereal: norm360(trop - aya),
    };
  }
  return out;
}

/** Speed °/day via finite difference (~1 hour) */
export function computeSpeeds(jd: number): SpeedMap {
  const dt = 1 / 24;
  const p0 = computePlanets(jd);
  const p1 = computePlanets(jd + dt);
  const speeds = {} as SpeedMap;
  for (const g of GRAHAS) {
    const dLon = shortestArc(p1[g.id].sidereal, p0[g.id].sidereal);
    speeds[g.id] = dLon * 24;
  }
  if (speeds.Rahu > 0) speeds.Rahu = -Math.abs(speeds.Rahu);
  if (speeds.Ketu > 0) speeds.Ketu = -Math.abs(speeds.Ketu);
  return speeds;
}

export function rashiIndex(sidLon: number): number {
  return Math.floor(norm360(sidLon) / 30) % 12;
}

export function rashiName(sidLon: number): string {
  return RASHIS[rashiIndex(sidLon)].sa;
}

export function nakshatraInfo(sidLon: number): {
  index: number;
  name: string;
  pada: number;
} {
  const lon = norm360(sidLon);
  const span = 360 / 27;
  const idx = Math.floor(lon / span) % 27;
  const pada = Math.floor((lon % span) / (span / 4)) + 1;
  return { index: idx, name: NAKSHATRAS[idx], pada };
}

export function computeTithi(
  moonSid: number,
  sunSid: number,
): { num: number; name: string; paksha: string; label: string } {
  const diff = norm360(moonSid - sunSid);
  const num = Math.floor(diff / 12) + 1;
  const paksha = num <= 15 ? 'Shukla' : 'Krishna';
  const name = TITHI_NAMES[num - 1];
  return { num, name, paksha, label: `${paksha} ${name}` };
}

/** Whole-sign house 1–12 from planet sidereal & Lagna sidereal */
export function wholeSignHouse(planetSid: number, lagnaSid: number): number {
  const pSign = rashiIndex(planetSid);
  const lSign = rashiIndex(lagnaSid);
  return ((pSign - lSign + 12) % 12) + 1;
}

/** Harmonic Resonance Score 0–100 from aspect density + angular harmony */
export function harmonicScore(planets: PlanetMap): number {
  const ids = GRAHAS.map((g) => g.id);
  let score = 40;
  let soft = 0;
  let hard = 0;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const d = absShortest(planets[ids[i]].sidereal, planets[ids[j]].sidereal);
      for (const a of ASPECT_ANGLES) {
        if (Math.abs(d - a) <= ASPECT_ORB) {
          if (a === 60 || a === 120 || a === 0) soft++;
          else hard++;
          const tight = 1 - Math.abs(d - a) / ASPECT_ORB;
          score += tight * (a === 0 || a === 120 ? 4 : a === 60 ? 3 : 2);
        }
      }
    }
  }
  score += soft * 1.5 - hard * 0.5;
  const ms = absShortest(planets.Moon.sidereal, planets.Sun.sidereal);
  if (Math.abs(ms - 180) < 8 || ms < 8) score += 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function lonMapFromPlanets(planets: PlanetMap): LonMap {
  const next = {} as LonMap;
  for (const g of GRAHAS) next[g.id] = planets[g.id].sidereal;
  return next;
}

export function findAspect(
  a: number,
  b: number,
): { angle: number; tight: number } | null {
  const d = absShortest(a, b);
  for (const ang of ASPECT_ANGLES) {
    if (Math.abs(d - ang) <= ASPECT_ORB) {
      return { angle: ang, tight: 1 - Math.abs(d - ang) / ASPECT_ORB };
    }
  }
  return null;
}

export type { GrahaId, LonMap, PlanetMap, SpeedMap };
