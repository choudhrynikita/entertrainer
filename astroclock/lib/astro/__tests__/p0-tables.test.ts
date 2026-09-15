import { describe, expect, it } from 'vitest';
import { NAKSHATRAS } from '../constants';
import {
  NAKSHATRA_RULES,
  nakshatraPadaCount,
  grahaNakshatraCount,
  GRAHA_NAKSHATRA,
  aspectPairCount,
  gocharaHouseCount,
  dashaBhavaCount,
  dashaRashiCount,
  collectPlacementFrags,
  collectDayFrags,
  collectProfileFrags,
} from '../rules';

describe('P0 table completeness (code lane)', () => {
  it('has 27 nakshatras × 4 unique padas = 108', () => {
    expect(Object.keys(NAKSHATRA_RULES)).toHaveLength(27);
    expect(nakshatraPadaCount()).toBe(108);
    const all = Object.values(NAKSHATRA_RULES).flatMap((r) => [...r.pada]);
    expect(new Set(all).size).toBe(108);
  });

  it('has 9×27 graha×nakshatra = 243', () => {
    expect(grahaNakshatraCount()).toBe(243);
    for (const g of Object.keys(GRAHA_NAKSHATRA)) {
      expect(Object.keys(GRAHA_NAKSHATRA[g as keyof typeof GRAHA_NAKSHATRA])).toHaveLength(27);
    }
  });

  it('has aspect pairs × 5 aspects (≥20×5)', () => {
    expect(aspectPairCount()).toBeGreaterThanOrEqual(100);
  });

  it('has gochara 9×12 and dasha bhava/rashi tables', () => {
    expect(gocharaHouseCount()).toBe(108);
    expect(dashaBhavaCount()).toBe(108);
    expect(dashaRashiCount()).toBe(108);
  });

  it('collectors return min counts', () => {
    const place = collectPlacementFrags({
      graha: 'Moon',
      rashi: 'Kumbha',
      house: 9,
      nakshatra: 'Shatabhisha',
      pada: 1,
    });
    expect(place.length).toBeGreaterThanOrEqual(4);
    const day = collectDayFrags({
      moonRashi: 'Kumbha',
      moonNak: 'Shatabhisha',
      moonPada: 1,
      waxing: true,
      lagna: 'Mithuna',
      soft: 2,
      hard: 1,
    });
    expect(day.length).toBeGreaterThanOrEqual(3);
    const prof = collectProfileFrags({
      lagna: 'Mithuna',
      moonRashi: 'Kumbha',
      moonHouse: 9,
      moonNak: 'Shatabhisha',
      moonPada: 1,
      sunRashi: 'Dhanu',
      sunHouse: 7,
      lagLord: 'Mercury',
      lagLordRashi: 'Makara',
      lagLordHouse: 8,
      dashaMaha: 'Saturn',
      dashaAntar: 'Ketu',
      dashaLordHouse: 6,
      dashaLordRashi: 'Makara',
    });
    expect(prof.length).toBeGreaterThanOrEqual(5);
  });

  it('every nakshatra name in constants has a rule', () => {
    for (const n of NAKSHATRAS) {
      expect(NAKSHATRA_RULES[n]).toBeTruthy();
    }
  });
});
