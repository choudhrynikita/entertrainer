import { describe, expect, it } from 'vitest';
import { FIXTURE_CHARTS } from '../__fixtures__/charts';
import { computeNatalProfile, natalLonMap, buildProfileSummaryEssay } from '../profile';
import { computeTodayInsights } from '../insights';
import { computeInfluence } from '../influence';
import { findBannedHits, hasBannedProse } from '../rules/prose';
import { stitchParagraphs } from '../rules/compose';
import {
  WELCOME_COPY,
  TOUR_STEP_IDS,
  ONBOARD_KEY,
} from '@astroclock/components/WelcomeTour';
import { NAKSHATRA_RULES } from '../rules/nakshatra';

/** Negative fixture — the exact bad style the user rejected */
const BAD_EXAMPLE =
  'Swati pada 4 adds a ripening completion... Star-texture Swati... Personal spotlight: transit Mercury is oppose your natal Sun (0.4°, separating)... opposition to natal sets up a temporary mirror — relate, do not declare war When Rahu is in the link...';

describe('Design lane — prose must be human-readable', () => {
  it('negative fixture (user bad example) trips banned detector', () => {
    expect(hasBannedProse(BAD_EXAMPLE)).toBe(true);
    expect(findBannedHits(BAD_EXAMPLE).length).toBeGreaterThan(0);
  });

  it('stitchParagraphs never concatenates without punctuation', () => {
    const out = stitchParagraphs(
      [
        { text: 'You need room to move', specificity: 50 },
        { text: 'finish one loop today', specificity: 40 },
      ],
      { perPara: 2, maxFrags: 4 },
    );
    expect(out).toMatch(/move\./i);
    expect(out).not.toMatch(/move finish/i);
  });

  it('nakshatra/pada strings avoid mechanic templates', () => {
    for (const [name, r] of Object.entries(NAKSHATRA_RULES)) {
      expect(r.temperament.toLowerCase()).not.toMatch(/star-texture/);
      for (const p of r.pada) {
        expect(p.toLowerCase()).not.toMatch(/adds an? (initiatory|ripening|stabilising)/);
        expect(p.toLowerCase()).not.toMatch(/ripening completion/);
        expect(findBannedHits(p).filter((h) => !h.includes('°'))).toEqual([]);
      }
      void name;
    }
  });

  for (const fx of FIXTURE_CHARTS) {
    it(`${fx.id}: Profile/Today/Advice pass banned-prose gate`, () => {
      const profile = computeNatalProfile(fx.birth, new Date('2026-09-15T12:00:00Z'))!;
      for (const sample of [
        profile.summary,
        ...profile.advice.items,
        ...profile.sections.map((s) => s.body),
      ]) {
        const hits = findBannedHits(sample);
        expect(hits, `banned in profile: ${hits} :: ${sample.slice(0, 120)}`).toEqual([]);
      }

      const today = computeTodayInsights(
        new Date('2026-09-15T12:00:00Z'),
        fx.birth,
        natalLonMap(fx.birth),
      );
      for (const sample of [
        today.daySummary,
        today.climateNote,
        ...today.dayAdvice.items,
        ...today.cards.map((c) => `${c.title}. ${c.body}`),
      ]) {
        const hits = findBannedHits(sample);
        expect(hits, `banned in today: ${hits} :: ${sample.slice(0, 120)}`).toEqual([]);
      }

      // Planet-tap influence reading for Moon + a personal planet
      for (const graha of ['Moon', 'Mars'] as const) {
        const reading = computeInfluence({
          graha,
          rashi: 'Kumbha',
          house: 9,
          nakshatra: 'Shatabhisha',
          speed: graha === 'Moon' ? 13 : 0.5,
          natal: { rashi: 'Simha', house: 3 },
          aspects: [
            {
              other: 'Rahu',
              label: 'trine',
              orb: 1.2,
              motion: 'applying',
              kind: 'natal',
            },
          ],
          dasha: { maha: 'Saturn', antar: 'Ketu' },
          isDemo: false,
        });
        for (const sample of [
          reading.meansForYou,
          reading.influencingNow,
          reading.changing,
          ...reading.advice.items,
        ]) {
          const hits = findBannedHits(sample);
          expect(
            hits,
            `banned in influence ${graha}: ${hits} :: ${sample.slice(0, 140)}`,
          ).toEqual([]);
          expect(sample.toLowerCase()).not.toMatch(/personal theme is lit/);
          expect(sample.toLowerCase()).not.toMatch(/colour the exchange/);
          expect(sample.toLowerCase()).not.toMatch(/sky-link/);
          expect(sample.toLowerCase()).not.toMatch(/sideways knowing/);
          expect(sample.toLowerCase()).not.toMatch(/chapter flavour/);
          expect(sample.toLowerCase()).not.toMatch(/treat it as weather/);
          expect(sample.toLowerCase()).not.toMatch(/flowing easily/);
        }
      }

      // jargon density: Lagnesha / Gochaara should not dominate body
      const body = profile.summary + ' ' + today.daySummary;
      const jargon = (body.match(/\b(Lagnesha|Gochaara|gochara|pada|subplot)\b/gi) || [])
        .length;
      expect(jargon).toBeLessThanOrEqual(1);
    });
  }

  it('tap-influence reading is plain English', () => {
    const fx = FIXTURE_CHARTS[0];
    const reading = computeInfluence({
      graha: 'Moon',
      rashi: 'Kumbha',
      house: 9,
      nakshatra: 'Shatabhisha',
      speed: 13,
      natal: { rashi: 'Kumbha', house: 9 },
      aspects: [],
      dasha: { maha: 'Saturn', antar: 'Ketu' },
      isDemo: false,
    });
    for (const sample of [
      reading.meansForYou,
      reading.influencingNow,
      reading.changing,
      ...reading.advice.items,
    ]) {
      expect(findBannedHits(sample)).toEqual([]);
    }
  });
});

describe('Design lane — welcome + tour contracts', () => {
  it('welcome copy has compass / will / passion project spirit', () => {
    const c = WELCOME_COPY.toLowerCase();
    expect(c).toMatch(/compass/);
    expect(c).toMatch(/pathfinder/);
    expect(c).toMatch(/will/);
    expect(c).toMatch(/stars/);
    expect(c).toMatch(/passion project|geek/);
    expect(c).toMatch(/indian philosophy|astrology/);
  });

  it('tour steps: setup → dial → today → you; onboard flag key', () => {
    expect(TOUR_STEP_IDS).toEqual([
      'welcome',
      'setup',
      'dial',
      'today',
      'you',
    ]);
    expect(ONBOARD_KEY).toBe('astroclock-onboarded-v1');
  });
});


describe('Design lane — Capricorn rising / Leo Moon summary essay', () => {
  it('forced Capricorn rising + Leo Moon is grammatical, actionable, and ban-free', () => {
    const summary = buildProfileSummaryEssay({
      lagRashi: 'Makara',
      moonRashi: 'Simha',
      moonNak: 'Magha',
      moonPada: 2,
      lagLord: 'Saturn',
      lagLordHouse: 5,
    });

    // Structure: 2–3 paragraphs
    const paras = summary.split(/\n\n+/).filter(Boolean);
    expect(paras.length).toBeGreaterThanOrEqual(2);
    expect(paras.length).toBeLessThanOrEqual(3);

    // Banned slogans from the failing fixture + metaphor soup
    expect(findBannedHits(summary)).toEqual([]);
    expect(summary.toLowerCase()).not.toMatch(/rising ruler/);
    expect(summary.toLowerCase()).not.toMatch(/lights up/);
    expect(summary.toLowerCase()).not.toMatch(/long road/);
    expect(summary.toLowerCase()).not.toMatch(/negotiate daily/);
    expect(summary.toLowerCase()).not.toMatch(/neither should win/);
    expect(summary.toLowerCase()).not.toMatch(/appearance and feeling/);
    expect(summary).not.toMatch(/mood should\s*[—–-]/);
    expect(summary.toLowerCase()).not.toMatch(/road show/);
    expect(summary.toLowerCase()).not.toMatch(/star-texture/);
    expect(summary.toLowerCase()).not.toMatch(/pada\s*\d/);
    expect(summary.toLowerCase()).not.toMatch(/braid/);
    expect(summary.toLowerCase()).not.toMatch(/sediment/);
    expect(summary.toLowerCase()).not.toMatch(/witness/);
    expect(summary.toLowerCase()).not.toMatch(/curriculum/);
    expect(summary.toLowerCase()).not.toMatch(/outer style invests/);
    expect(summary.toLowerCase()).not.toMatch(/meet the world by climbing/);

    // Basic grammatical English checks
    expect(summary).toMatch(/^[A-Z]/); // starts with capital
    expect(summary).toMatch(/\.(\n\n|$)/); // has sentence endings
    expect(summary).not.toMatch(/\w\s+—\s*[a-z]*\s*$/); // no dangling em-dash tails
    // Readable life lean + instructions-adjacent
    expect(summary).toMatch(/creative work, romance, play, and mentoring/i);
    expect(summary).toMatch(/small steady output|long route/i);
    // Leo Moon actionable cue
    expect(summary.toLowerCase()).toMatch(/recognition|feedback|applause|noticed|overlooked/);
    // Capricorn outer: concrete behaviour, not metaphor climb
    expect(summary.toLowerCase()).toMatch(/earn respect|finishing hard|reliability|results speak/);
    // You… voice
    expect(summary).toMatch(/\bYou\b/);
  });

  it('negative Capricorn/Leo fixture still trips the detector', () => {
    const bad =
      'You climb with structure... Rising in Capricorn with a Leo Moon means appearance and feeling negotiate daily... when the Capricorn mask leads and when the Leo mood should — neither should win every argument. Blend earned endurance with generous presence. Your rising ruler (Saturn) sits in the area of creativity... Saturn lights up creativity, play, and romance. That’s where you take the long road show most clearly.';
    expect(hasBannedProse(bad)).toBe(true);
    expect(findBannedHits(bad).length).toBeGreaterThan(0);
  });
});

describe('P3 snapshot bands', () => {
  for (const fx of FIXTURE_CHARTS) {
    it(`${fx.id}: summary/advice length bands`, () => {
      const profile = computeNatalProfile(fx.birth, new Date('2026-09-15T12:00:00Z'))!;
      expect(profile.summary.length).toBeGreaterThan(100);
      expect(profile.summary.length).toBeLessThan(2000);
      expect(profile.advice.items.length).toBeGreaterThanOrEqual(1);
      expect(profile.advice.items.length).toBeLessThanOrEqual(8);

      const today = computeTodayInsights(
        new Date('2026-09-15T12:00:00Z'),
        fx.birth,
        natalLonMap(fx.birth),
      );
      expect(today.daySummary.length).toBeGreaterThan(80);
      expect(today.daySummary.length).toBeLessThan(2000);
      expect(today.dayAdvice.items.length).toBeGreaterThanOrEqual(1);
    });
  }
});

describe('Design lane — ban new fluff phrases across generators', () => {
  const FLUFF = [
    /personal theme is lit/i,
    /colour the exchange/i,
    /sky-link/i,
    /sideways knowing/i,
    /already know some things sideways/i,
    /chapter flavour/i,
    /treat it as weather/i,
    /appetite for the new turns into a private research/i,
    /flowing easily/i,
    /set the weather/i,
  ];

  it('rule-bank samples stay fluff-free', async () => {
    const { ASPECT_PAIRS } = await import('../rules/aspectPairs');
    const { ASPECT_GRAHA_FLAVOUR, ASPECT_RULES } = await import('../rules/aspects');
    const { RETROGRADE_RULES } = await import('../rules/retrograde');
    const { DASHA_PAIR } = await import('../rules/dasha');
    const { GRAHA_BHAVA } = await import('../rules/grahaBhava');

    const samples: string[] = [
      ...Object.values(ASPECT_RULES).flatMap((r) => [
        r.lifeMeaning,
        r.advice,
        r.natalTransitNote,
      ]),
      ...Object.values(ASPECT_GRAHA_FLAVOUR),
      ...Object.values(RETROGRADE_RULES).flatMap((r) => [r.temperament, r.advice]),
      ASPECT_PAIRS['Mars_Saturn']?.trine.lifeMeaning ?? '',
      ASPECT_PAIRS['Rahu_Moon']?.trine.lifeMeaning ?? '',
      DASHA_PAIR['Sun_Ketu']?.tone ?? '',
      DASHA_PAIR['Saturn_Rahu']?.tone ?? '',
      GRAHA_BHAVA.Ketu[1].lifeArea,
      GRAHA_BHAVA.Moon[4].lifeArea,
    ];
    for (const sample of samples) {
      for (const re of FLUFF) {
        expect(sample, sample.slice(0, 120)).not.toMatch(re);
      }
      expect(findBannedHits(sample)).toEqual([]);
    }
  });

  it('welcome copy stays compass/will without soft weather slogans', () => {
    const c = WELCOME_COPY;
    expect(c.toLowerCase()).toMatch(/compass/);
    expect(c.toLowerCase()).not.toMatch(/sketches weather/);
    for (const re of FLUFF) {
      expect(c).not.toMatch(re);
    }
  });
});

