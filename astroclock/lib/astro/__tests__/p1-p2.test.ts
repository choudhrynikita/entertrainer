import { describe, expect, it } from 'vitest';
import {
  computeYoga,
  computeKarana,
  weekdayFromDate,
  orbBand,
  detectCombustion,
  dayVolumeFromAspectCount,
  moonSpeedNote,
} from '../rules/moment';
import {
  detectGajaKesari,
  detectBudhaAditya,
  detectKemadrumaLite,
  detectYogas,
} from '../rules/yogas';
import {
  atmakarakaLite,
  navamshaRashiIndex,
  houseToneFlag,
  lordOfRashi,
} from '../rules/classical';
import { FIXTURE_CHARTS } from '../__fixtures__/charts';
import { julianDay } from '../math';
import { computePlanets, lonMapFromPlanets } from '../planets';
import { computeTodayInsights } from '../insights';
import { natalLonMap, computeNatalProfile } from '../profile';
import type { LonMap } from '../constants';

describe('P1 moment sharpness', () => {
  it('weekday / yoga / karana computable from Sun/Moon', () => {
    expect(weekdayFromDate(new Date('2026-09-15T12:00:00Z'))).toBe('Tuesday');
    const y = computeYoga(0, 0);
    expect(y.name).toBeTruthy();
    const k = computeKarana(10, 0);
    expect(k.name).toBeTruthy();
  });

  it('orb bands and day volume', () => {
    expect(orbBand(0.2)).toBe('exact');
    expect(orbBand(1.5)).toBe('tight');
    expect(orbBand(4)).toBe('wide');
    expect(dayVolumeFromAspectCount(0).volume).toBe('quiet');
    expect(dayVolumeFromAspectCount(6).volume).toBe('loud');
  });

  it('combustion detects near-Sun Mercury/Venus', () => {
    const hits = detectCombustion(100, { Mercury: 105, Venus: 150, Mars: 200 });
    expect(hits.some((h) => h.graha === 'Mercury')).toBe(true);
    expect(moonSpeedNote(15)).toMatch(/fast/i);
  });

  it('today summary includes panchanga when present', () => {
    const fx = FIXTURE_CHARTS[0];
    const today = computeTodayInsights(
      new Date('2026-09-15T12:00:00Z'),
      fx.birth,
      natalLonMap(fx.birth),
    );
    expect(today.panchanga?.weekday).toBeTruthy();
    expect(today.dayVolume).toBeTruthy();
    expect(today.daySummary.length).toBeGreaterThan(40);
  });
});

describe('P2 classical depth', () => {
  it('yoga detectors on synthetic + fixtures', () => {
    const close: LonMap = {
      Sun: 10,
      Moon: 10,
      Mars: 100,
      Mercury: 12, // Budha-Aditya
      Jupiter: 100, // ~90 from Moon? Moon 10, Jup 100 = 90 → Gaja
      Venus: 200,
      Saturn: 220,
      Rahu: 300,
      Ketu: 120,
    };
    expect(detectBudhaAditya(close)).toBeTruthy();
    expect(detectGajaKesari(close)).toBeTruthy();

    const isolated: LonMap = {
      Sun: 0,
      Moon: 0,
      Mars: 90,
      Mercury: 120,
      Jupiter: 150,
      Venus: 180,
      Saturn: 210,
      Rahu: 240,
      Ketu: 60,
    };
    expect(detectKemadrumaLite(isolated)).toBeTruthy();

    for (const fx of FIXTURE_CHARTS) {
      const dt = new Date(
        Date.UTC(
          +fx.birth.date.slice(0, 4),
          +fx.birth.date.slice(5, 7) - 1,
          +fx.birth.date.slice(8, 10),
          fx.birth.h,
          fx.birth.m,
          fx.birth.s,
        ),
      );
      const lons = lonMapFromPlanets(computePlanets(julianDay(dt)));
      const hits = detectYogas(lons);
      expect(Array.isArray(hits)).toBe(true);
    }
  });

  it('atmakaraka-lite picks highest degree; navamsha maps; house tones', () => {
    const ak = atmakarakaLite([
      { id: 'Sun', degree: 12 },
      { id: 'Moon', degree: 28 },
      { id: 'Mars', degree: 5 },
      { id: 'Rahu', degree: 29 },
    ]);
    expect(ak?.id).toBe('Moon'); // nodes excluded
    expect(navamshaRashiIndex(0)).toBe(0); // Mesha 0° → first navamsha Mesha
    expect(houseToneFlag(8).flag).toBe('dusthana');
    expect(houseToneFlag(11).flag).toBe('upachaya');
    expect(lordOfRashi('Simha')).toBe('Sun');
  });

  it('profile includes classical spice without crashing', () => {
    const fx = FIXTURE_CHARTS[0];
    const profile = computeNatalProfile(fx.birth)!;
    expect(profile.summary.length).toBeGreaterThan(50);
  });
});
