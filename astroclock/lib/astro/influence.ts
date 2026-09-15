import type { GrahaId } from './constants';
import {
  adviceFromFrags,
  collectPlacementFrags,
  stitchParagraphs,
  grahaRashiRule,
  grahaBhavaRule,
  nakshatraRule,
  aspectRule,
  ASPECT_GRAHA_FLAVOUR,
  retrogradeRule,
  dashaPairRule,
  type Frag,
} from './rules';

/** Sanskrit rashi key -> everyday English sign name */
export const SIGN_EN: Record<string, string> = {
  Mesha: 'Aries',
  Vrishabha: 'Taurus',
  Mithuna: 'Gemini',
  Karka: 'Cancer',
  Simha: 'Leo',
  Kanya: 'Virgo',
  Tula: 'Libra',
  Vrischika: 'Scorpio',
  Dhanu: 'Sagittarius',
  Makara: 'Capricorn',
  Kumbha: 'Aquarius',
  Meena: 'Pisces',
};

export function signEn(rashi: string): string {
  return SIGN_EN[rashi] || rashi;
}

/** House topics in everyday life language */
export const HOUSE_LIFE: Record<number, string> = {
  1: 'how you show up, your body-energy, and first impressions',
  2: 'money habits, speech, and what you treat as valuable',
  3: 'courage, siblings/peers, short trips, and everyday hustle',
  4: 'home, family base, private mood, and feeling settled',
  5: 'creativity, romance, play, kids/mentees, and speculative bets',
  6: 'work routines, health habits, rivals, and daily problem-solving',
  7: 'one-to-one relationships, contracts, and mirroring with others',
  8: 'shared resources, intimacy, research, and big life resets',
  9: 'beliefs, teachers, long journeys, and the bigger “why”',
  10: 'career, public reputation, and what you are known for',
  11: 'friends, networks, gains, and future-facing goals',
  12: 'rest, solitude, endings, travel abroad, and quiet recharge',
};

const GRAHA_PLAIN: Record<GrahaId, string> = {
  Sun: 'your drive to be seen and lead — identity and vitality',
  Moon: 'your moods, needs, and emotional safety',
  Mars: 'your courage, anger, and how you push for what you want',
  Mercury: 'how you think, talk, learn, and negotiate',
  Jupiter: 'growth, luck-with-meaning, teachers, and generosity',
  Venus: 'love, taste, pleasure, and how you bond',
  Saturn: 'responsibility, delays that teach, and long-game structure',
  Rahu: 'ambition for novelty, shortcuts, and unfamiliar wins',
  Ketu: 'what you release, simplify, or trust as quiet gut clarity',
};

const SIGN_STYLE: Record<string, string> = {
  Mesha: 'direct, fast to start, and competitive when motivated',
  Vrishabha: 'steady, sensory, and loyal once committed',
  Mithuna: 'curious, talkative, and mentally restless',
  Karka: 'protective, feeling-led, and home-oriented',
  Simha: 'warm, proud, and creative when appreciated',
  Kanya: 'precise, helpful, and quietly critical of mess',
  Tula: 'diplomatic, fairness-seeking, and partnership-minded',
  Vrischika: 'intense, private, and all-or-nothing with trust',
  Dhanu: 'big-picture, restless for meaning, and horizon-hungry',
  Makara: 'ambitious, reserved, and built for the long climb',
  Kumbha: 'independent, future-minded, and friendship-forward',
  Meena: 'empathic, imaginative, and porous around other people',
};

const NAK_PLAIN: Record<string, string> = {
  Ashwini: 'quick to start and keen to fix things on the move',
  Bharani: 'able to hold pressure until something real is born',
  Krittika: 'sharp-eyed, cutting through fog to what matters',
  Rohini: 'growth-focused once a beautiful target is chosen',
  Mrigashira: 'always seeking, sniffing options, rarely fully still',
  Ardra: 'clears through storms — tear-down before rebuild',
  Punarvasu: 'bounces back and finds a second chance',
  Pushya: 'steady caregiver energy; timing and nourishment matter',
  Ashlesha: 'reads undercurrents; intimacy needs clear ethics',
  Magha: 'carries a sense of legacy and rightful presence',
  'Purva Phalguni': 'leans toward pleasure, creativity, and social warmth',
  'Uttara Phalguni': 'builds lasting alliances through reliable help',
  Hasta: 'clever with hands, craft, and practical problem-solving',
  Chitra: 'designs beauty into form; hates unfinished ugliness',
  Swati: 'needs room to move; freedom keeps the mind kind',
  Vishakha: 'can chase two goals — choose which summit gets heat',
  Anuradha: 'loyal in orbit around people and causes that matter',
  Jyeshtha: 'protective of earned skill and quiet rank',
  Mula: 'digs to the root; honesty before polish',
  'Purva Ashadha': 'bold early push — declare, then prove',
  'Uttara Ashadha': 'wins that last, through structure and allies',
  Shravana: 'learns by listening deeply before speaking',
  Dhanishta: 'syncs with rhythm, teams, and timed bursts',
  Shatabhisha: 'finds odd, systems-level fixes others miss',
  'Purva Bhadrapada': 'fires up for ideals worth a real edge',
  'Uttara Bhadrapada': 'patient depth; wisdom from the long wait',
  Revati: 'shepherds people across the finish line gently',
};

export interface InfluenceAspect {
  other: GrahaId;
  label: string;
  orb: number;
  motion: 'applying' | 'separating' | 'exact';
  kind: 'transit' | 'natal';
}

export interface AdviceBlock {
  title: string;
  /** 2–5 concrete, agency-oriented suggestions */
  items: string[];
  cites: string[];
}

export interface InfluenceInput {
  graha: GrahaId;
  rashi: string;
  house: number;
  nakshatra?: string;
  speed: number;
  /** Natal placement of same graha, if known */
  natal?: { rashi: string; house: number } | null;
  aspects: InfluenceAspect[];
  dasha?: { maha: string; antar: string } | null;
  isDemo: boolean;
}

export interface InfluenceReading {
  meansForYou: string;
  influencingNow: string;
  changing: string;
  advice: AdviceBlock;
  cites: string[];
}

function motionLife(m: InfluenceAspect['motion']): string {
  if (m === 'applying') return 'building toward a peak';
  if (m === 'separating') return 'easing after a peak — integrate what already happened';
  return 'right on the nose — loud right now';
}

function aspectLife(label: string): string {
  if (label === 'conjunct' || label.includes('conjunct'))
    return 'mixing voices closely';
  if (label === 'trine' || label === 'sextile') return 'offering easier cooperation';
  if (label === 'square') return 'creating productive friction';
  if (label === 'oppose') return 'facing off against';
  return `linking (${label})`;
}


function buildInfluenceAdvice(input: InfluenceInput): AdviceBlock {
  const { graha, rashi, house, speed, aspects, dasha, natal, isDemo } = input;
  const frags: Frag[] = collectPlacementFrags({
    graha,
    rashi,
    house,
    nakshatra: input.nakshatra,
    retrograde: speed < -0.01,
  }).filter((f) => f.text && (f.specificity >= 48)); // prefer advice-ish

  // Prefer advice fields over temperament for the advice block
  const gr = grahaRashiRule(graha, rashi);
  const gb = grahaBhavaRule(graha, house);
  const adviceFrags: Frag[] = [];
  if (gr) adviceFrags.push({ text: gr.advice, specificity: 55, cite: `${graha} in ${rashi}` });
  if (gb) adviceFrags.push({ text: gb.advice, specificity: 58, cite: `House ${house}` });
  if (input.nakshatra) {
    const nk = nakshatraRule(input.nakshatra);
    if (nk) adviceFrags.push({ text: nk.advice, specificity: 62, cite: input.nakshatra });
  }
  if (speed < -0.01) {
    const rr = retrogradeRule(graha);
    if (rr) adviceFrags.push({ text: rr.advice, specificity: 64, cite: `${graha} R` });
  }

  const hard = aspects.filter((a) => a.label === 'square' || a.label === 'oppose');
  const soft = aspects.filter(
    (a) => a.label === 'trine' || a.label === 'sextile' || a.label === 'conjunct',
  );
  if (hard.length > 0) {
    const h = hard[0];
    const ar = aspectRule(h.label);
    adviceFrags.push({
      text: ar?.advice || `With ${graha} ${h.label} ${h.other}, pause before reacting; choose a precise response.`,
      specificity: 66,
      cite: `${graha} ${h.label} ${h.other}`,
    });
  } else if (soft.length > 0) {
    const s = soft[0];
    const ar = aspectRule(s.label);
    adviceFrags.push({
      text: ar?.advice || `${graha} linking softly with ${s.other} — good moment to collaborate or ask.`,
      specificity: 60,
      cite: `${graha} ${s.label} ${s.other}`,
    });
  }

  if (dasha && (dasha.maha === graha || dasha.antar === graha)) {
    const dp = dashaPairRule(dasha.maha, dasha.antar);
    adviceFrags.push({
      text: dp?.advice || `${graha} is a period lord — practice its better habits rather than fearing the stereotype.`,
      specificity: 57,
      cite: `Period ${dasha.maha}/${dasha.antar}`,
    });
  }

  if (!isDemo && natal) {
    const ngb = grahaBhavaRule(graha, natal.house);
    adviceFrags.push({
      text: ngb
        ? `Natal ${graha} in house ${natal.house}: keep that long-term theme in view. ${ngb.advice}`
        : `Your natal ${graha} lives in house ${natal.house} — keep that long-term theme in view while the sky colours it.`,
      specificity: 50,
      cite: `Natal house ${natal.house}`,
    });
  }

  void frags;
  return adviceFromFrags(
    'Advice for this placement / transit',
    adviceFrags,
    5,
  );
}


export function computeInfluence(input: InfluenceInput): InfluenceReading {
  const { graha, rashi, house, speed, natal, aspects, dasha, isDemo } = input;
  const sign = signEn(rashi);
  const style = SIGN_STYLE[rashi] || 'coloured by its current sign';
  const life = HOUSE_LIFE[house] || 'a live area of day-to-day life';
  const grahaPlain = GRAHA_PLAIN[graha];
  const gr = grahaRashiRule(graha, rashi);
  const gb = grahaBhavaRule(graha, house);
  const nk = input.nakshatra ? nakshatraRule(input.nakshatra) : null;
  const rr = speed < -0.01 ? retrogradeRule(graha) : null;
  const nakBit = nk
    ? ` ${nk.temperament}`
    : input.nakshatra && NAK_PLAIN[input.nakshatra]
      ? ` Under ${input.nakshatra}, the mood leans toward being ${NAK_PLAIN[input.nakshatra]}.`
      : '';

  const cites: string[] = [
    `${graha} in ${sign}`,
    `House ${house}`,
  ];
  if (input.nakshatra) cites.push(input.nakshatra);
  if (speed < -0.01) cites.push('Retrograde');

  const placementFrags: Frag[] = collectPlacementFrags({
    graha,
    rashi,
    house,
    nakshatra: input.nakshatra,
    retrograde: speed < -0.01,
  });

  let meansForYou: string;
  if (isDemo || !natal) {
    const stitched = stitchParagraphs(
      [
        {
          text: gr?.temperament || `Right now ${graha} is travelling through ${sign}, where it tends to act ${style}.`,
          specificity: 50,
        },
        { text: `In plain terms, ${graha} rules ${grahaPlain}.${nakBit}`, specificity: 40 },
        {
          text: 'Without your birth chart saved, this is general sky context — useful for mood and timing, not a personal reading.',
          specificity: 20,
        },
      ],
      { perPara: 2, maxFrags: 4 },
    );
    meansForYou = stitched;
  } else {
    const nSign = signEn(natal.rashi);
    const nLife = HOUSE_LIFE[natal.house] || 'a core life theme';
    const ngb = grahaBhavaRule(graha, natal.house);
    const ngr = grahaRashiRule(graha, natal.rashi);
    meansForYou = stitchParagraphs(
      [
        {
          text: ngr?.temperament || `In your birth chart, ${graha} sits in ${nSign} and speaks especially through ${nLife}.`,
          specificity: 70,
        },
        {
          text: ngb?.lifeArea || `That is the long-term setting for ${grahaPlain}.`,
          specificity: 65,
        },
        {
          text: gr?.temperament || `Today the same planet is moving through ${sign}, adding a ${sign.toLowerCase()} mood (${style}) to that natal theme.`,
          specificity: 55,
        },
        { text: nakBit.trim(), specificity: 60 },
      ].filter((f) => f.text),
      { perPara: 2, maxFrags: 6 },
    );
    cites.push(`Natal ${graha} in ${nSign}, house ${natal.house}`);
  }

  const influencingNow = stitchParagraphs(
    [
      {
        text: gb?.lifeArea || `In the current sky, ${graha} is highlighting ${life}.`,
        specificity: 70,
      },
      {
        text: 'Expect more notice, decisions, or emotional charge around that area. Act where attention is already pulling; don’t invent drama elsewhere.',
        specificity: 40,
      },
      {
        text: rr
          ? rr.temperament
          : `${graha} is moving direct, so the impulse leans outward — act, speak, or show up in that life area.`,
        specificity: 55,
      },
    ],
    { perPara: 2, maxFrags: 4 },
  );
  void placementFrags;

  const changeBits: string[] = [];
  const top = aspects.slice(0, 3);
  if (top.length === 0) {
    changeBits.push(
      `No tight contacts involving ${graha} right now — nothing loud is pressing this planet right now — focus on its life area and keep moves simple.`,
    );
  } else {
    for (const a of top) {
      const ar = aspectRule(a.label);
      const flavour = ASPECT_GRAHA_FLAVOUR[graha] || '';
      const verb = aspectLife(a.label);
      const whoPlain = a.kind === 'natal' ? `your ${a.other}` : `${a.other}`;
      const natalNote =
        a.kind === 'natal' && ar?.natalTransitNote ? ` ${ar.natalTransitNote}` : '';
      const otherTheme = GRAHA_PLAIN[a.other as GrahaId] || a.other;
      const thisTheme = GRAHA_PLAIN[graha] || graha;
      const pairHint =
        a.kind === 'natal'
          ? `${graha} (${thisTheme}) is ${verb} ${a.other} in your chart (${otherTheme}). Expect both to show up in mood and decisions — pick one concrete response, not a spiral.`
          : `${graha} is ${verb} ${whoPlain} in the sky. That mix can colour talk and choices — keep the next move small and clear.`;
      changeBits.push(
        `${pairHint}${natalNote}`.replace(/\s+/g, ' ').trim(),
      );
    }
  }
  if (dasha && (dasha.maha === graha || dasha.antar === graha)) {
    const dp = dashaPairRule(dasha.maha, dasha.antar);
    changeBits.push(
      dp
        ? `${dp.tone} ${dp.advice}`
        : `${graha} is also a period lord right now (${dasha.maha} / ${dasha.antar}), so those themes run louder this period — practise the useful habit, skip the dramatic version.`,
    );
    cites.push(`Period: ${dasha.maha}/${dasha.antar}`);
  } else if (dasha && dasha.maha !== '—') {
    const dp = dashaPairRule(dasha.maha, dasha.antar);
    changeBits.push(
      dp
        ? `Background period: ${dp.tone}`
        : `Background period: a ${dasha.maha} stretch shaped by ${dasha.antar} — that still affects the month even when ${graha} is not the headline.`,
    );
  }

  const advice = buildInfluenceAdvice(input);

  return {
    meansForYou,
    influencingNow,
    changing: changeBits.join(' '),
    advice,
    cites,
  };
}

/** Plain-English planet-in-sign lines for profile sections */
export const PLANET_SIGN_PLAIN: Partial<
  Record<GrahaId, Record<string, string>>
> = {
  Mercury: {
    Mesha: 'you speak blunt and fast; ideas land as sparks',
    Vrishabha: 'you think slowly and stick to opinions once set',
    Mithuna: 'your mind multitasks; wit is native oxygen',
    Karka: 'you think in feeling-tones and rich memory',
    Simha: 'you phrase things dramatically; opinions perform',
    Kanya: 'you analyse, edit, and make useful lists',
    Tula: 'you weigh both sides out loud before choosing',
    Vrischika: 'you ask probing questions and use strategic silence',
    Dhanu: 'you talk big-picture; meaning beats trivia',
    Makara: 'you argue in structured, professional tones',
    Kumbha: 'you think in systems and oddball vocabulary',
    Meena: 'you think poetically; intuition outruns the syllabus',
  },
  Venus: {
    Mesha: 'you pursue what you want; romance has a spark of conquest',
    Vrishabha: 'you love through loyalty, comfort, and sensory beauty',
    Mithuna: 'affection thrives on exchange, flirtation, and variety',
    Karka: 'you nurture; love feels like emotional home-cooking',
    Simha: 'you show love with warmth, pride, and generous gestures',
    Kanya: 'you care by being useful — service as love language',
    Tula: 'partnership is an art; fairness and harmony matter',
    Vrischika: 'bonds run intense and transformative',
    Dhanu: 'you love freedom and shared ideals on the road',
    Makara: 'affection is committed, sober, and long-game',
    Kumbha: 'you bond as friends first; unconventional is fine',
    Meena: 'love goes soft, idealistic, and a little boundary-blurry',
  },
  Mars: {
    Mesha: 'you assert directly; competition wakes you up',
    Vrishabha: 'you push with stubborn endurance, not flash',
    Mithuna: 'drive scatters into arguments and short hustles',
    Karka: 'anger and action flare when home or feelings are poked',
    Simha: 'courage wants a stage; pride fuels the fight',
    Kanya: 'you fight through precise craft and daily effort',
    Tula: 'you assert via negotiation and charm more than blunt force',
    Vrischika: 'will is strategic and intense under a calm surface',
    Dhanu: 'you crusade for beliefs and far-off targets',
    Makara: 'ambition is disciplined; you climb like it is combat',
    Kumbha: 'you fight for groups and causes more than ego wins',
    Meena: 'drive can diffuse into sacrifice or escape unless aimed',
  },
};
