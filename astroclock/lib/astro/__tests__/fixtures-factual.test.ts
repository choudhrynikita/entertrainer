import { describe, expect, it } from 'vitest';
import { FIXTURE_CHARTS, DELHI_PUBLIC_BALLPARK } from '../__fixtures__/charts';
import { julianDay, ascendant, lst, absShortest } from '../math';
import {
  computePlanets,
  nakshatraInfo,
  rashiName,
  wholeSignHouse,
  findAspect,
} from '../planets';
import { vimshottari } from '../dasha';
import { NAKSHATRAS, GRAHAS, type GrahaId } from '../constants';
import { computeNatalProfile } from '../profile';
import { computeTodayInsights } from '../insights';
import { natalLonMap } from '../profile';

const NAK_LORDS: GrahaId[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

function birthDate(b: (typeof FIXTURE_CHARTS)[0]['birth']) {
  return new Date(
    Date.UTC(+b.date.slice(0, 4), +b.date.slice(5, 7) - 1, +b.date.slice(8, 10), b.h, b.m, b.s),
  );
}

describe('Factual lane — fixture expected bands', () => {
  for (const fx of FIXTURE_CHARTS) {
    it(`${fx.id}: planet longs finite; Moon nak + Lagna + dasha lord match bands`, () => {
      const dt = birthDate(fx.birth);
      const jd = julianDay(dt);
      const pl = computePlanets(jd);
      for (const g of GRAHAS) {
        expect(Number.isFinite(pl[g.id].sidereal)).toBe(true);
        expect(pl[g.id].sidereal).toBeGreaterThanOrEqual(0);
        expect(pl[g.id].sidereal).toBeLessThan(360);
      }
      const moon = pl.Moon.sidereal;
      const nak = nakshatraInfo(moon);
      expect(nak.name).toBe(fx.expect.moonNak);
      expect(nak.pada).toBe(fx.expect.moonPada);
      expect(rashiName(moon)).toBe(fx.expect.moonRashi);
      expect(rashiName(pl.Sun.sidereal)).toBe(fx.expect.sunRashi);

      const asc = ascendant(lst(jd, fx.birth.lon), fx.birth.lat, jd);
      expect(rashiName(asc.sidereal)).toBe(fx.expect.lagna);

      const nakIdx = NAKSHATRAS.indexOf(nak.name as (typeof NAKSHATRAS)[number]);
      expect(NAK_LORDS[nakIdx % 9]).toBe(fx.expect.dashaLordFromMoonNak);

      const d = vimshottari(dt, new Date('2026-09-15T12:00:00Z'));
      expect(typeof d.maha).toBe('string');
      expect(typeof d.antar).toBe('string');
      expect(d.maha.length).toBeGreaterThan(2);
    });
  }

  it('Delhi fixture within public ephemeris ballpark (FACTCHECK)', () => {
    const fx = FIXTURE_CHARTS[0];
    const jd = julianDay(birthDate(fx.birth));
    const pl = computePlanets(jd);
    expect(pl.Sun.sidereal).toBeGreaterThanOrEqual(DELHI_PUBLIC_BALLPARK.sunSidMin);
    expect(pl.Sun.sidereal).toBeLessThanOrEqual(DELHI_PUBLIC_BALLPARK.sunSidMax);
    expect(pl.Moon.sidereal).toBeGreaterThanOrEqual(DELHI_PUBLIC_BALLPARK.moonSidMin);
    expect(pl.Moon.sidereal).toBeLessThanOrEqual(DELHI_PUBLIC_BALLPARK.moonSidMax);
    expect(rashiName(pl.Sun.sidereal)).toBe(DELHI_PUBLIC_BALLPARK.sunRashi);
    expect(rashiName(pl.Moon.sidereal)).toBe(DELHI_PUBLIC_BALLPARK.moonRashi);
  });

  it('gochara house index math is consistent', () => {
    const fx = FIXTURE_CHARTS[0];
    const jd = julianDay(birthDate(fx.birth));
    const pl = computePlanets(jd);
    const asc = ascendant(lst(jd, fx.birth.lon), fx.birth.lat, jd);
    const h = wholeSignHouse(pl.Moon.sidereal, asc.sidereal);
    expect(h).toBeGreaterThanOrEqual(1);
    expect(h).toBeLessThanOrEqual(12);
    // Moon in Kumbha, Lagna Mithuna → house 9
    expect(h).toBe(9);
  });

  it('aspect angles match findAspect when within orb', () => {
    const a = 10;
    const b = 10 + 90;
    const asp = findAspect(a, b);
    expect(asp?.angle).toBe(90);
    expect(Math.abs(absShortest(a, b) - 90)).toBeLessThan(0.01);
  });
});

describe('Factual lane — advice + profile non-empty; cites match chart', () => {
  for (const fx of FIXTURE_CHARTS) {
    it(`${fx.id}: profile + today advice ≥1; summary non-empty`, () => {
      const profile = computeNatalProfile(fx.birth, new Date('2026-09-15T12:00:00Z'));
      expect(profile).not.toBeNull();
      expect(profile!.summary.length).toBeGreaterThan(80);
      expect(profile!.advice.items.length).toBeGreaterThanOrEqual(1);
      expect(profile!.moon.nakshatra).toBe(fx.expect.moonNak);
      expect(profile!.lagna.rashi).toBe(fx.expect.lagna);

      const natal = natalLonMap(fx.birth);
      const today = computeTodayInsights(
        new Date('2026-09-15T12:00:00Z'),
        fx.birth,
        natal,
      );
      expect(today.daySummary.length).toBeGreaterThan(60);
      expect(today.dayAdvice.items.length).toBeGreaterThanOrEqual(1);
    });
  }
});
