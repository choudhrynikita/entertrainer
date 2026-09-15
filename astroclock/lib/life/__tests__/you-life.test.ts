import { describe, expect, it } from 'vitest';
import { computeLivedSpan } from '../livedSpan';
import { LIFE_FACTS, factForUnit, allFactStrings } from '../lifeFacts';
import {
  DAY_MESSAGES,
  dayMessageBankSize,
  pickDayMessage,
  allDayMessageStrings,
} from '../dayMessages';
import {
  MOMENT_ADVICE,
  momentAdviceBankSize,
  allMomentAdviceStrings,
  pickMomentAdvice,
  categoryForMoment,
} from '../momentAdvice';
import { findBannedHits } from '../../astro/rules/prose';

describe('livedSpan calendar math', () => {
  it('counts exact Y/M/D/h/m/s across month boundaries', () => {
    const birth = new Date(Date.UTC(2000, 0, 31, 12, 0, 0)); // Jan 31
    const now = new Date(Date.UTC(2000, 2, 1, 13, 30, 45)); // Mar 1 13:30:45
    const s = computeLivedSpan(birth, now);
    // Jan 31 → Mar 1 = 1 month + 1 day (Feb has 29 in 2000), +1h30m45s
    expect(s.years).toBe(0);
    expect(s.months).toBe(1);
    expect(s.days).toBe(1);
    expect(s.hours).toBe(1);
    expect(s.minutes).toBe(30);
    expect(s.seconds).toBe(45);
  });

  it('handles multi-year span', () => {
    const birth = new Date(Date.UTC(1990, 5, 15, 8, 0, 0));
    const now = new Date(Date.UTC(2026, 5, 15, 8, 0, 5));
    const s = computeLivedSpan(birth, now);
    expect(s.years).toBe(36);
    expect(s.months).toBe(0);
    expect(s.days).toBe(0);
    expect(s.hours).toBe(0);
    expect(s.minutes).toBe(0);
    expect(s.seconds).toBe(5);
  });
});

describe('life facts + day messages banks', () => {
  it('has ≥8 facts per unit', () => {
    for (const [u, bank] of Object.entries(LIFE_FACTS)) {
      expect(bank.length, u).toBeGreaterThanOrEqual(8);
    }
  });

  it('day message bank ≥40 lines', () => {
    expect(dayMessageBankSize()).toBeGreaterThanOrEqual(40);
  });

  it('fact + message picks are deterministic', () => {
    const d = new Date('2026-09-16T12:00:00Z');
    expect(factForUnit('years', d, 'x').text).toBe(
      factForUnit('years', d, 'x').text,
    );
    expect(pickDayMessage('tense', d).text).toBe(
      pickDayMessage('tense', d).text,
    );
  });

  it('visitor copy passes banned-prose gate', () => {
    for (const s of [...allFactStrings(), ...allDayMessageStrings()]) {
      expect(findBannedHits(s), s.slice(0, 80)).toEqual([]);
    }
  });

  it('climate categories all have lines', () => {
    for (const k of ['tense', 'fluid', 'peak', 'quiet', 'volatile'] as const) {
      expect(DAY_MESSAGES[k].length).toBeGreaterThanOrEqual(8);
    }
  });
});

describe('moment advice bank', () => {
  it('bank ≥70 lines across outcome categories', () => {
    expect(momentAdviceBankSize()).toBeGreaterThanOrEqual(70);
    for (const [k, bank] of Object.entries(MOMENT_ADVICE)) {
      expect(bank.length, k).toBeGreaterThanOrEqual(8);
    }
  });

  it('picks are deterministic for same sim + insights stub', () => {
    const insights = {
      moon: { waxing: true },
      dasha: { maha: 'Venus', antar: 'Sun', tone: '' },
      aspects: [],
      climate: 'fluid',
    } as any;
    const t = Date.parse('2026-09-16T10:30:00+05:30');
    expect(pickMomentAdvice(t, insights).text).toBe(
      pickMomentAdvice(t, insights).text,
    );
  });

  it('category reacts to soft/hard pressure', () => {
    expect(categoryForMoment('fluid', 4, 0, true, 11)).toBe('soft_ask');
    expect(categoryForMoment('tense', 0, 4, true, 11)).toBe('hard_brace');
    expect(categoryForMoment('peak', 1, 1, true, 11)).toBe('peak_push');
  });

  it('visitor moment-advice copy passes banned-prose gate', () => {
    for (const s of allMomentAdviceStrings()) {
      expect(findBannedHits(s), s.slice(0, 80)).toEqual([]);
    }
  });
});
