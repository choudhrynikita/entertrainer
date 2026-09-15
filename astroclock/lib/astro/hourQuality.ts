/**
 * Deterministic hour-of-day quality for the Bauhaus ribbon.
 * Reuses the same soft/hard + harmonic climate rules as Today insights — no LLM.
 */
import { GRAHAS, type PlanetMap } from './constants';
import { absShortest, julianDay } from './math';
import { computePlanets, findAspect, harmonicScore } from './planets';
import type { ClimateLabel } from './insights';

export type DayStretch = 'good' | 'mid' | 'hard';

export interface HourQualitySample {
  /** Local clock hour 0–23 */
  hour: number;
  stretch: DayStretch;
  climate: ClimateLabel;
}

export interface StretchSegment {
  stretch: DayStretch;
  /** Inclusive start hour */
  startHour: number;
  /** Exclusive end hour (may be 24) */
  endHour: number;
}

export const STRETCH_COLOR: Record<DayStretch, string> = {
  good: '#81C784',
  mid: '#D4AF37',
  hard: '#E57373',
};

export function stretchFromClimate(climate: ClimateLabel): DayStretch {
  if (climate === 'peak' || climate === 'fluid') return 'good';
  if (climate === 'quiet') return 'mid';
  return 'hard';
}

function climateFrom(
  hrs: number,
  soft: number,
  hard: number,
  exactHard: number,
): ClimateLabel {
  if (exactHard >= 2 || (hard >= 4 && soft <= 1)) return 'volatile';
  if (soft + hard <= 1) return 'quiet';
  if (hrs >= 72 && soft >= hard) return 'peak';
  if (hard > soft + 1) return 'tense';
  return 'fluid';
}

function countSoftHard(planets: PlanetMap): {
  soft: number;
  hard: number;
  exactHard: number;
} {
  let soft = 0;
  let hard = 0;
  let exactHard = 0;
  const ids = GRAHAS.map((g) => g.id);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i];
      const b = ids[j];
      const asp = findAspect(planets[a].sidereal, planets[b].sidereal);
      if (!asp) continue;
      const trueOrb = Math.abs(
        absShortest(planets[a].sidereal, planets[b].sidereal) - asp.angle,
      );
      if (trueOrb > 3) continue;
      if (asp.angle === 60 || asp.angle === 120 || asp.angle === 0) soft++;
      else {
        hard++;
        if (trueOrb < 1) exactHard++;
      }
    }
  }
  return { soft, hard, exactHard };
}

/** Sky climate + stretch band at an absolute instant. */
export function qualityAt(date: Date): {
  climate: ClimateLabel;
  stretch: DayStretch;
} {
  const jd = julianDay(date);
  const planets = computePlanets(jd);
  const { soft, hard, exactHard } = countSoftHard(planets);
  const hrs = harmonicScore(planets);
  const climate = climateFrom(hrs, soft, hard, exactHard);
  return { climate, stretch: stretchFromClimate(climate) };
}

/**
 * Sample each local hour of the civil day containing `simMs`
 * (browser-local calendar day of the sim timestamp).
 */
export function sampleLocalDayQualities(
  simMs: number,
  steps = 24,
): HourQualitySample[] {
  const d = new Date(simMs);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const out: HourQualitySample[] = [];
  const n = Math.max(1, Math.min(48, steps | 0));
  for (let h = 0; h < n; h++) {
    const t = new Date(start.getTime() + (h + 0.5) * (24 / n) * 3600 * 1000);
    const q = qualityAt(t);
    out.push({
      hour: Math.floor((h * 24) / n),
      stretch: q.stretch,
      climate: q.climate,
    });
  }
  return out;
}

/** Merge consecutive same-stretch hours into ribbon arcs. */
export function coalesceStretchSegments(
  samples: HourQualitySample[],
): StretchSegment[] {
  if (!samples.length) return [];
  const segs: StretchSegment[] = [];
  let cur: StretchSegment = {
    stretch: samples[0].stretch,
    startHour: 0,
    endHour: 1,
  };
  for (let i = 1; i < samples.length; i++) {
    if (samples[i].stretch === cur.stretch) {
      cur.endHour = i + 1;
    } else {
      segs.push(cur);
      cur = { stretch: samples[i].stretch, startHour: i, endHour: i + 1 };
    }
  }
  segs.push(cur);
  return segs;
}
