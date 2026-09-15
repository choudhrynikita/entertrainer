import {
  GRAHAS,
  NAKSHATRAS,
  type BirthConfig,
  type GrahaId,
  type LonMap,
} from './constants';
import { ascendant, julianDay, lst } from './math';
import {
  computePlanets,
  computeSpeeds,
  nakshatraInfo,
  rashiIndex,
  rashiName,
  wholeSignHouse,
} from './planets';
import { vimshottari } from './dasha';
import {
  HOUSE_LIFE,
  PLANET_SIGN_PLAIN,
  signEn,
  type AdviceBlock,
} from './influence';
import {
  adviceFromFrags,
  collectProfileAdviceFrags,
  grahaRashiRule,
  nakshatraRule,
  grahaBhavaRule,
  dashaPairRule,
  lagnaMoonBlend,
  detectYogas,
  atmakarakaLite,
  atmakarakaWording,
  lordOfRashi,
} from './rules';
import { lonMapFromPlanets } from './planets';

const RASHI_LORDS: GrahaId[] = [
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

/** Rising-sign outer style — how they meet the world (plain English) */
const LAGNA_OUTER_STYLE: Record<string, string> = {
  Mesha:
    'You start before the committee finishes talking. People read you as direct, warm under pressure, and impatient with vague plans. When nothing needs doing, restlessness shows — channel it into one clear next step instead of picking fights with the silence.',
  Vrishabha:
    'You build trust slowly and keep what you value. Others notice calm loyalty and a good sense for comfort; you are not quick to pivot. Once you commit, follow through — and say no early when a change would scrap something you still care about.',
  Mithuna:
    'You collect people, routes, and ideas. Conversation is how you think, and boredom hits harder than hard work. Finish one thread before opening three more, or you leave people unsure what you meant.',
  Karka:
    'Belonging matters more than applause. You read rooms through feeling, and you protect your people. When home feels safe you are generous; when it does not, you pull back — name what would restore trust instead of going silent.',
  Simha:
    'Being overlooked feels personal. You lead with creative warmth and want your effort noticed. Ask for clear feedback in private, put your name on work you care about, and do not bet your whole mood on applause.',
  Kanya:
    'Mess and vagueness bother you. You help through competence, and quiet precision is how you show care. Soften critique with one kind line, and pick one useful fix instead of rewriting the whole system.',
  Tula:
    'You weigh options and keep the peace. Unfairness lands in your body before you argue. Name your preference before you negotiate, and do not swallow discord just to keep the room pretty.',
  Vrischika:
    'You go deep or not at all. Trust is earned, not assumed, and half-measures frustrate you. Ask for honesty early, and put intensity into one loyal project instead of testing everyone.',
  Dhanu:
    'You aim past the near field — meaning, humour, and a wider horizon keep you kind. Petty loops make you irritable. Book learning or travel that widens the frame, and leave one small duty finished so freedom does not become avoidance.',
  Makara:
    'You earn respect by finishing hard things over time. You do not trust flashy talk; reliability outranks charm. Let results speak, schedule rest so the climb is not a cage, and soften after respect is already clear.',
  Kumbha:
    'You bond through ideas, odd allies, and future plans more than traditional romance theatre. Detachment can be a shield. Pick one group or cause to show up for regularly so belonging has a real address.',
  Meena:
    'You absorb atmospheres — empathy and imagination are gifts and costs. Art, quiet service, and sanctuary suit you when feet stay on the ground. Choose company the way you choose climate, and keep one daily task that proves you delivered.',
};

const MOON_SIGN: Record<string, string> = {
  Mesha:
    'Feelings arrive as urges to act, speak, or start. Sitting still with raw mood feels like holding heat. Move the energy into one clean action, then cool down before hard talks.',
  Vrishabha:
    'You settle when comfort, beauty, and reliability are secured. Abrupt change can feel like theft. Slow the pivot, keep one sensory anchor (food, music, routine), and revise only with proof.',
  Mithuna:
    'Talk, novelty, and mental companionship regulate your mood. Emotions shift when the conversation does. Check whether you are flirting with ideas or with people — then finish one chat before opening another.',
  Karka:
    'Sensitivity runs deep; other people’s weather enters easily. Caregiving and being cared for are lifelong themes. Secure your base before leading, and say when you need care instead of absorbing every room.',
  Simha:
    'You feel strongest when people notice your effort. Kindness comes easily when you feel respected. Public criticism or being overlooked can knock your mood harder than you let on — so ask for clear feedback in private, and don’t bet your whole day on applause.',
  Kanya:
    'You sort feelings into categories. Care shows as usefulness and quiet critique more than melodrama. Chaos in someone’s habits frays the bond — offer one practical repair instead of a storm of fixes.',
  Tula:
    'Harmony-seeking runs deep; relational weather often dictates inner weather. Beauty and fairness are emotional medicine. Name unfairness early, and state one preference before you smooth everything over.',
  Vrischika:
    'Feelings are all-or-nothing — loyalty, jealousy, deep resets. Surface calm may hide undertow. Choose honesty over half-open doors, and give trust time instead of testing people.',
  Dhanu:
    'Mood expands toward meaning. Boredom or dogma collapses the emotional sky. Keep a horizon (belief, travel, teaching, humour that widens the frame), and exit one petty loop on purpose.',
  Makara:
    'Affect is reserved and durable. Safety is earned through competence and time, not instant confession. Show commitment as endurance, schedule softness so you do not bottle feelings until they land heavy.',
  Kumbha:
    'Care can feel friendship-toned. You may feel odd in private and lucid in groups. Seek egalitarian bonds and quirky needs openly — possessive romance usually backfires.',
  Meena:
    'Empathy is diffuse; dreams, music, and compassion blur self and other. Beautiful for art and healing; costly without boundaries. Choose company carefully, and keep one clear edge so you do not dissolve.',
};

const NAK_MIND: Record<string, string> = {
  Ashwini: 'Your mind likes swift starts — begin, then correct in motion instead of waiting for perfect plans.',
  Bharani: 'You hold creative pressure until something real can be delivered — set a finish date so the wait does not stall you.',
  Krittika: 'You cut through fog; aim the clarity at the problem, not at the person, or it scorches trust.',
  Rohini: 'Once fascinated, you grow and attract around a chosen target — pick one, then feed it daily.',
  Mrigashira: 'You hunt options; stillness is rare until the trail is sniffed — shortlist two choices and decide by tonight.',
  Ardra: 'Insight often arrives after a storm — tear down what is broken, then rebuild one piece before the next critique.',
  Punarvasu: 'You bounce back; second chances feel native — take the retry, and change one habit so the loop closes.',
  Pushya: 'You nourish on schedule; care and timing steady the mind — keep meal, rest, and check-in times sacred.',
  Ashlesha: 'You read undercurrents; keep ethics tight in intimacy — ask before you dig, and do not use secrets as leverage.',
  Magha: 'You think about legacy and rightful presence — claim credit cleanly, then share the spotlight.',
  'Purva Phalguni': 'Pleasure and creative ease loosen the mind — finish one delight instead of collecting unfinished fun.',
  'Uttara Phalguni': 'You think in lasting alliances and help that sticks — offer one concrete assist and keep the promise.',
  Hasta: 'Skillful, hands-on cleverness wants a job — fix something tangible today.',
  Chitra: 'You design beauty into form; unfinished ugliness irritates — close one craft loop before starting a new sketch.',
  Swati: 'Independence keeps you kind; cages make you sharp — negotiate room to move before you snap.',
  Vishakha: 'You can chase dual goals — pick which summit gets heat this week and park the other.',
  Anuradha: 'Loyalty in orbit around people and causes regulates you — show up for one person or project on schedule.',
  Jyeshtha: 'You protect earned skill and quiet rank — mentor once, and refuse status games that waste the craft.',
  Mula: 'You dig to roots; honesty before polish — ask the hard question, then offer one practical next step.',
  'Purva Ashadha': 'Bold early push — declare the aim, then prove it with one delivered result.',
  'Uttara Ashadha': 'You prefer wins that last, through structure and allies — build the team and the checklist together.',
  Shravana: 'You learn by listening deeply before speaking — take notes first, then reply with one clear point.',
  Dhanishta: 'Rhythm and teamwork unlock you — time your bursts with others and keep the beat.',
  Shatabhisha: 'You spot system fixes others miss — try one practical experiment, measure it, then explain it in plain words.',
  'Purva Bhadrapada': 'Ideals can fire you past comfort — aim the heat at one reform, not at everyone.',
  'Uttara Bhadrapada': 'Patient depth suits you — bring one insight to the surface and act on it this week.',
  Revati: 'You shepherd people across finish lines gently — help someone complete, then rest.',
};


/** Life-area labels for summary (no "house N" in body) */
const SUMMARY_LIFE: Record<number, string> = {
  1: 'how you show up, body-energy, and first impressions',
  2: 'money habits, speech, and what you treat as valuable',
  3: 'courage, siblings and peers, short trips, and everyday hustle',
  4: 'home, family base, private mood, and feeling settled',
  5: 'creative work, romance, play, and mentoring',
  6: 'work routines, health habits, rivals, and daily problem-solving',
  7: 'one-to-one relationships, contracts, and fair exchange',
  8: 'shared resources, intimacy, research, and big life resets',
  9: 'beliefs, teachers, long journeys, and the bigger why',
  10: 'career, public reputation, and what you are known for',
  11: 'friends, networks, gains, and future-facing goals',
  12: 'rest, solitude, endings, travel abroad, and quiet recharge',
};

const LEAN_OPENER: Record<string, string> = {
  Sun: 'A clear Sun-led streak shows up most',
  Moon: 'A Moon-led care streak shows up most',
  Mars: 'A Mars-led drive shows up most',
  Mercury: 'A Mercury-led mind shows up most',
  Jupiter: 'A Jupiter-led stretch shows up most',
  Venus: 'A Venus-led soft streak shows up most',
  Saturn: 'A serious, patient streak shows up most',
  Rahu: 'A hunger for the unfamiliar shows up most',
  Ketu: 'A simplify-and-release streak shows up most',
};

const LEAN_TIP: Record<string, string> = {
  Sun: 'own one visible contribution, then share credit',
  Moon: 'ask for care early and keep one soothing routine',
  Mars: 'put heat into one clean contest, not a public fight',
  Mercury: 'finish one conversation or draft before opening another',
  Jupiter: 'teach or expand one idea without overpromising',
  Venus: 'invest in comfort and fair bonding, not people-pleasing',
  Saturn: 'small steady output beats big dramatic starts',
  Rahu: 'try the new path with a time-box and a mentor check',
  Ketu: 'drop one extra obligation and keep the lesson',
};

function softPadaNuance(pada: number): string {
  if (pada === 1) return 'Early under this Moon, you often prefer to begin before you polish.';
  if (pada === 2) return 'Under this Moon, you often prefer to consolidate what already works.';
  if (pada === 3) return 'Under this Moon, you often prefer to refine under a little pressure.';
  return 'Under this Moon, you often prefer to close loops and advise rather than restart.';
}

/**
 * Structured Profile summary essay — 2–3 short paragraphs:
 * 1 outer style (Lagna), 2 inner weather (Moon + nak), 3 where life leans (rising-lord life area).
 * Exported for design tests with forced rashis.
 */
export function buildProfileSummaryEssay(args: {
  lagRashi: string;
  moonRashi: string;
  moonNak: string;
  moonPada: number;
  lagLord: GrahaId;
  lagLordHouse: number;
  lagLordRetro?: boolean;
}): string {
  const outer =
    LAGNA_OUTER_STYLE[args.lagRashi] ||
    `You meet the world with a ${signEn(args.lagRashi)} tone — distinctive, readable, and hard to fake.`;

  const moonBase = MOON_SIGN[args.moonRashi] || `Emotionally you carry a ${signEn(args.moonRashi)} climate.`;
  const nakBit = NAK_MIND[args.moonNak] || '';
  const padaBit = softPadaNuance(args.moonPada);
  const inner = [moonBase, nakBit, padaBit].filter(Boolean).join(' ');

  const life = SUMMARY_LIFE[args.lagLordHouse] || 'a core life theme';
  const tip = LEAN_TIP[args.lagLord] || 'show up steadily and check results weekly';
  const opener = LEAN_OPENER[args.lagLord] || `A ${args.lagLord} streak shows up most`;
  let lean = `${opener} in ${life}. You’ll do better taking the long route there — ${tip}.`;
  if (args.lagLordRetro) {
    lean += ' Because that planet turns inward first, revisit and revise the theme privately before you show the result.';
  }

  return [outer, inner, lean].join('\n\n');
}

const SUN_DRIVE: Record<string, string> = {
  Mesha: 'Vitality peaks when you pioneer. Identity forges in clean contests, not waiting rooms.',
  Vrishabha: 'You shine by building and keeping — body, craft, and valued things steady the will.',
  Mithuna: 'Dialogue and learning loops fuel you. Too many channels scatter the signal.',
  Karka: 'Home base and emotional weather power the will. Protect the harbour, then lead.',
  Simha: 'Centre-stage creative leadership is fuel. Authentic shine includes lifting others.',
  Kanya: 'Craft mastery and useful service keep you lit. Keep a signature even in humility.',
  Tula: 'Fair exchange and aesthetic partnership feed vitality. Strengthen your own preferences.',
  Vrischika: 'Crisis alchemy and intimate power renew you. Motive integrity is the real test.',
  Dhanu: 'Belief quests and far aims wake the will. Avoid dogma that freezes the quest.',
  Makara: 'Achievement architecture and earned status sustain you. Soften so the climb is not a cage.',
  Kumbha: 'Innovators and future tribes wake your will. Still belong somewhere specific.',
  Meena: 'Imagination and compassionate cause immerse you. Keep a daily vessel so you do not dissolve.',
};

export interface ProfilePlacement {
  id: GrahaId;
  lon: number;
  rashi: string;
  degree: number;
  house: number;
  nakshatra: string;
  pada: number;
  retrograde: boolean;
}

export interface ProfileSection {
  id: string;
  title: string;
  body: string;
  cites: string[];
}

export interface NatalProfile {
  name: string;
  placeLabel?: string;
  birthSummary: string;
  /** Plain-English character sketch (1–3 short paragraphs) */
  summary: string;
  /** Practical habits / relational / work-style tips */
  advice: AdviceBlock;
  lagna: { rashi: string; degree: number; lord: GrahaId };
  moon: { rashi: string; nakshatra: string; pada: number; house: number };
  sun: { rashi: string; nakshatra: string; pada: number; house: number };
  grahas: ProfilePlacement[];
  dominant: string[];
  sections: ProfileSection[];
  dasha: { maha: string; antar: string };
}

function nakLord(nakIndex: number): GrahaId {
  const lords: GrahaId[] = [
    'Ketu',
    'Venus',
    'Sun',
    'Moon',
    'Mars',
    'Rahu',
    'Jupiter',
    'Saturn',
    'Mercury',
  ];
  return lords[nakIndex % 9];
}

function citeGraha(p: ProfilePlacement): string {
  const r = p.retrograde ? ' R' : '';
  return `${p.id} in ${signEn(p.rashi)}, ${p.house}th${r}`;
}

function houseWeight(grahas: ProfilePlacement[]): Map<number, number> {
  const w = new Map<number, number>();
  const weight: Partial<Record<GrahaId, number>> = {
    Sun: 3,
    Moon: 3,
    Mars: 2,
    Mercury: 2,
    Jupiter: 2,
    Venus: 2,
    Saturn: 2,
    Rahu: 1.5,
    Ketu: 1.5,
  };
  for (const g of grahas) {
    w.set(g.house, (w.get(g.house) || 0) + (weight[g.id] || 1));
  }
  return w;
}

function buildSummary(args: {
  lagRashi: string;
  moon: ProfilePlacement;
  lagLord: GrahaId;
  lagLordP: ProfilePlacement;
}): string {
  return buildProfileSummaryEssay({
    lagRashi: args.lagRashi,
    moonRashi: args.moon.rashi,
    moonNak: args.moon.nakshatra,
    moonPada: args.moon.pada,
    lagLord: args.lagLord,
    lagLordHouse: args.lagLordP.house,
    lagLordRetro: args.lagLordP.retrograde,
  });
}

function buildProfileAdvice(args: {
  lagRashi: string;
  moon: ProfilePlacement;
  sun: ProfilePlacement;
  lagLord: GrahaId;
  lagLordP: ProfilePlacement;
  grahas: ProfilePlacement[];
  topHouses: number[];
}): AdviceBlock {
  const stressOcc = args.grahas.filter((g) => [6, 8, 12].includes(g.house));
  const stressHouses = [...new Set(stressOcc.map((g) => g.house))].sort();
  const frags = collectProfileAdviceFrags({
    lagna: args.lagRashi,
    moonRashi: args.moon.rashi,
    moonHouse: args.moon.house,
    moonNak: args.moon.nakshatra,
    moonPada: args.moon.pada,
    sunRashi: args.sun.rashi,
    sunHouse: args.sun.house,
    lagLord: args.lagLord,
    lagLordRashi: args.lagLordP.rashi,
    lagLordHouse: args.lagLordP.house,
    lagLordRetro: args.lagLordP.retrograde,
    stressHouse: stressHouses[0],
  });
  if (args.topHouses[0] && !stressHouses.length) {
    const h = args.topHouses[0];
    const gb = grahaBhavaRule(args.lagLord, h);
    if (gb) {
      frags.push({
        text: `Your loudest life area leans toward ${SUMMARY_LIFE[h] || HOUSE_LIFE[h] || 'daily focus'} — ${gb.advice}`,
        specificity: 48,
        cite: `Loud area ${h}`,
      });
    }
  }
  return adviceFromFrags(
    'Advice for how to work with your nature',
    frags,
    5,
  );
}


export function computeNatalProfile(
  birth: BirthConfig,
  nowDate: Date = new Date(),
): NatalProfile | null {
  if (birth.isDemo) return null;

  const birthDt = new Date(
    Date.UTC(
      +birth.date.slice(0, 4),
      +birth.date.slice(5, 7) - 1,
      +birth.date.slice(8, 10),
      +birth.h,
      +birth.m,
      +birth.s,
    ),
  );
  const jd = julianDay(birthDt);
  const planets = computePlanets(jd);
  const speeds = computeSpeeds(jd);
  const lat = +birth.lat;
  const lon = +birth.lon;
  const asc = ascendant(lst(jd, lon), lat, jd);
  const lagRashi = rashiName(asc.sidereal);
  const lagDeg = asc.sidereal % 30;
  const lagLord = RASHI_LORDS[rashiIndex(asc.sidereal)];

  const grahas: ProfilePlacement[] = GRAHAS.map((g) => {
    const lonS = planets[g.id].sidereal;
    const nak = nakshatraInfo(lonS);
    return {
      id: g.id,
      lon: lonS,
      rashi: rashiName(lonS),
      degree: lonS % 30,
      house: wholeSignHouse(lonS, asc.sidereal),
      nakshatra: nak.name,
      pada: nak.pada,
      retrograde: speeds[g.id] < -0.01,
    };
  });

  const byId = Object.fromEntries(grahas.map((g) => [g.id, g])) as Record<
    GrahaId,
    ProfilePlacement
  >;
  const moon = byId.Moon;
  const sun = byId.Sun;
  const lagLordP = byId[lagLord];
  const moonNakIdx = NAKSHATRAS.indexOf(
    moon.nakshatra as (typeof NAKSHATRAS)[number],
  );
  const moonNakLord = nakLord(moonNakIdx >= 0 ? moonNakIdx : 0);

  const weights = houseWeight(grahas);
  const topHouses = [...weights.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([h]) => h);

  const dominant: string[] = [
    `Rising ${signEn(lagRashi)} (ruled by ${lagLord})`,
    `Moon ${signEn(moon.rashi)} · ${moon.nakshatra}`,
    `Sun ${signEn(sun.rashi)}`,
    `Loud life areas: ${topHouses.map((h) => `${h}`).join(', ')}`,
    `Moon-star tone lord: ${moonNakLord}`,
  ];

  let dasha = { maha: '—', antar: '—' };
  try {
    const d = vimshottari(birthDt, nowDate);
    dasha = { maha: d.maha, antar: d.antar };
  } catch {
    /* ignore */
  }

  const lonMap = lonMapFromPlanets(planets);
  const yogaHits = detectYogas(lonMap);
  const ak = atmakarakaLite(grahas.map((g) => ({ id: g.id, degree: g.degree })));
  const mLord = lordOfRashi(moon.rashi);
  const mLordP = byId[mLord];

  const summary = buildSummary({
    lagRashi,
    moon,
    lagLord,
    lagLordP,
  });

  const advice = buildProfileAdvice({
    lagRashi,
    moon,
    sun,
    lagLord,
    lagLordP,
    grahas,
    topHouses,
  });

  const sections: ProfileSection[] = [];

  const blendNote = lagnaMoonBlend(lagRashi, moon.rashi) || '';
  const lagLordHouse = grahaBhavaRule(lagLord, lagLordP.house);
  const lifeLean = SUMMARY_LIFE[lagLordP.house] || HOUSE_LIFE[lagLordP.house] || 'a core life theme';
  sections.push({
    id: 'essence',
    title: 'How you come across',
    body: `${LAGNA_OUTER_STYLE[lagRashi] || ''} ${blendNote} A ${lagLord} streak shows up most in ${lifeLean}${lagLordP.retrograde ? ' — and because it turns inward first, revisit and revise privately before you show the result.' : '.'}${lagLordHouse ? ' ' + lagLordHouse.lifeArea : ''}`,
    cites: [
      `Rising ${signEn(lagRashi)} ${lagDeg.toFixed(1)}°`,
      `Moon in ${signEn(moon.rashi)}, house ${moon.house}`,
      citeGraha(lagLordP),
    ],
  });

  const moonNakRule = nakshatraRule(moon.nakshatra, moon.pada);
  const moonSignRule = grahaRashiRule('Moon', moon.rashi);
  const moonHouseRule = grahaBhavaRule('Moon', moon.house);
  const padaNote =
    moonNakRule?.padaNote ||
    (moon.pada === 1
      ? 'You’re in a beginning mood under this Moon — start before you polish.'
      : moon.pada === 2
        ? 'You’re in a steadying mood — consolidate what already works.'
        : moon.pada === 3
          ? 'You’re in a craft mood — refine under a little pressure.'
          : 'You’re in a finishing mood — close loops and advise rather than restart.');

  sections.push({
    id: 'mind',
    title: 'Mind & emotions',
    body: `${moonSignRule?.temperament || MOON_SIGN[moon.rashi] || ''} ${moonHouseRule?.lifeArea || `In the house of ${HOUSE_LIFE[moon.house] || 'daily life'}, feelings show up first.`} ${moonNakRule?.temperament || `${NAK_MIND[moon.nakshatra] || 'Your Moon has a distinctive habit.'}`} ${padaNote} Emotionally, stories your heart rehearses often lean toward ${moonNakLord}-toned themes — notice when that planet’s habits show up in mood.`,
    cites: [
      `Moon in ${signEn(moon.rashi)}, house ${moon.house}`,
      `${moon.nakshatra} (part ${moon.pada})`,
      `Tone lord ${moonNakLord}`,
    ],
  });

  const sunSignRule = grahaRashiRule('Sun', sun.rashi);
  const sunHouseRule = grahaBhavaRule('Sun', sun.house);
  const sunNakRule = nakshatraRule(sun.nakshatra, sun.pada);
  sections.push({
    id: 'drive',
    title: 'Drive & vitality',
    body: `${sunSignRule?.temperament || SUN_DRIVE[sun.rashi] || ''} ${sunHouseRule?.lifeArea || `The Sun in the house of ${HOUSE_LIFE[sun.house] || 'focus'} marks where identity heat concentrates.`} ${sunNakRule?.temperament || `${sun.nakshatra} shapes how you prefer to show up and renew your sense of self — use that method on purpose.`}`,
    cites: [
      `Sun in ${signEn(sun.rashi)}, house ${sun.house} · ${sun.nakshatra}`,
    ],
  });

  const merc = byId.Mercury;
  const ven = byId.Venus;
  const mars = byId.Mars;
  const mercLine =
    grahaRashiRule('Mercury', merc.rashi)?.temperament ||
    PLANET_SIGN_PLAIN.Mercury?.[merc.rashi] ||
    `Mercury in ${signEn(merc.rashi)} shapes how you talk and decide`;
  const venLine =
    grahaRashiRule('Venus', ven.rashi)?.temperament ||
    PLANET_SIGN_PLAIN.Venus?.[ven.rashi] ||
    `Venus in ${signEn(ven.rashi)} shapes what you want and how you bond`;
  const marsLine =
    grahaRashiRule('Mars', mars.rashi)?.temperament ||
    PLANET_SIGN_PLAIN.Mars?.[mars.rashi] ||
    `Mars in ${signEn(mars.rashi)} shapes how you push and compete`;

  sections.push({
    id: 'behaviour',
    title: 'Behavioural style',
    body: `${lagLord} in ${signEn(lagLordP.rashi)} (area of ${HOUSE_LIFE[lagLordP.house] || 'focus'}) is a primary behavioural engine${lagLordP.retrograde ? ' — retrograde means you may rehearse the same lesson until style ripens' : ''}. Mercury: ${mercLine}; that shows in ${HOUSE_LIFE[merc.house] || 'daily life'}. Venus: ${venLine}; routed through ${HOUSE_LIFE[ven.house] || 'relating'}. Mars: ${marsLine}; spent on ${HOUSE_LIFE[mars.house] || 'effort'}. Together they describe how you move, argue, desire, and decide on ordinary days.`,
    cites: [
      citeGraha(lagLordP),
      citeGraha(merc),
      citeGraha(ven),
      citeGraha(mars),
    ],
  });

  const jup = byId.Jupiter;
  const h7occupants = grahas.filter((g) => g.house === 7).map((g) => g.id);
  const lord7 = RASHI_LORDS[(rashiIndex(asc.sidereal) + 6) % 12];
  const relBody = h7occupants.length
    ? `Your one-to-one house hosts ${h7occupants.join(', ')} — partners and open counterparts often mirror those tones. Venus in ${signEn(ven.rashi)} (house of ${HOUSE_LIFE[ven.house]}) sets pleasure and bonding style; Jupiter in ${signEn(jup.rashi)} (house of ${HOUSE_LIFE[jup.house]}) expands grace, teachers, and ethical stretch${jup.retrograde ? ' — Jupiter retrograde turns faith inward and revises mentors' : ''}. Treat partners as practice partners, not verdicts on your worth.`
    : `Your one-to-one house is empty of planets — relationships often activate through the ruler of that house (${lord7}) rather than crowded conjunctions. Venus in ${signEn(ven.rashi)} (house of ${HOUSE_LIFE[ven.house]}) sets bonding style; Jupiter in ${signEn(jup.rashi)} (house of ${HOUSE_LIFE[jup.house]}) expands grace and counsel${jup.retrograde ? ' — Jupiter retrograde turns faith inward' : ''}. Absence is quieter staging, not missing destiny.`;

  sections.push({
    id: 'relational',
    title: 'Relational / outer life',
    body: relBody,
    cites: [
      `7th from rising ${signEn(lagRashi)}`,
      citeGraha(ven),
      citeGraha(jup),
      ...(h7occupants.length
        ? h7occupants.map((id) => citeGraha(byId[id]))
        : [`7th ruler ${lord7}`]),
    ],
  });

  const sat = byId.Saturn;
  const rahu = byId.Rahu;
  const ketu = byId.Ketu;
  let growth = `Saturn in ${signEn(sat.rashi)} (house of ${HOUSE_LIFE[sat.house]}) asks for time-discipline there — delay as teacher, not punishment. Rahu in ${signEn(rahu.rashi)} (house of ${HOUSE_LIFE[rahu.house]}) hungers toward unfamiliar mastery; Ketu in ${signEn(ketu.rashi)} (house of ${HOUSE_LIFE[ketu.house]}) releases or distills the opposite axis.`;
  if (mars.house === 1 || mars.house === 8 || mars.house === 12) {
    growth += ` Mars in house ${mars.house} sharpens heat in self, crisis, or withdrawal zones — aim it into clean effort.`;
  } else if (mars.retrograde) {
    growth += ' Mars retrograde turns assertion inward first — strategize before you strike.';
  } else {
    growth += ` Mars in the house of ${HOUSE_LIFE[mars.house]} supplies courage that wants a worthy contest.`;
  }
  growth +=
    ' Meet pressure as training: Saturn teaches duration, Rahu appetite, Ketu release, Mars directed heat.';

  sections.push({
    id: 'growth',
    title: 'Pressures & growth',
    body: growth,
    cites: [citeGraha(sat), citeGraha(rahu), citeGraha(ketu), citeGraha(mars)],
  });

  if (ak) {
    const aw = atmakarakaWording(ak.id, ak.degree);
    sections.push({
      id: 'atmakaraka',
      title: 'A quiet signature',
      body: `${aw.body} ${aw.advice}`,
      cites: [`AK ${ak.id}`],
    });
  }

  if (mLordP) {
    const mlLife = SUMMARY_LIFE[mLordP.house] || HOUSE_LIFE[mLordP.house] || 'daily life';
    sections.push({
      id: 'moon-lord',
      title: 'What steadies the heart',
      body: `${mLord} steers your ${signEn(moon.rashi)} Moon and shows up most in ${mlLife}. When feelings get loud, do one practical thing in that area first.`,
      cites: [citeGraha(mLordP)],
    });
  }

  const pair = dashaPairRule(dasha.maha, dasha.antar);
  if (yogaHits.length) {
    sections.push({
      id: 'yogas',
      title: 'Notable patterns',
      body: yogaHits.map((y) => `${y.body} ${y.advice}`).join(' '),
      cites: yogaHits.map((y) => y.id),
    });
  }

  sections.push({
    id: 'dasha',
    title: 'This period of life',
    body: pair
      ? `${pair.tone} ${pair.advice} Treat this as a period focus across your chart — not a rewrite of who you are.`
      : `You’re in a ${dasha.maha} period, and ${dasha.antar} is shaping the near weeks. Treat this as a period focus — not a rewrite of who you are. Practise the better habits of this period rather than fearing a stereotype.`,
    cites: [`Period ${dasha.maha}`, `Sub-period ${dasha.antar}`],
  });

  const place =
    birth.placeLabel || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;

  return {
    name: birth.name || 'Native',
    placeLabel: birth.placeLabel,
    birthSummary: `${birth.date} ${String(birth.h).padStart(2, '0')}:${String(birth.m).padStart(2, '0')}:${String(birth.s).padStart(2, '0')} UTC · ${place}`,
    summary,
    advice,
    lagna: { rashi: lagRashi, degree: lagDeg, lord: lagLord },
    moon: {
      rashi: moon.rashi,
      nakshatra: moon.nakshatra,
      pada: moon.pada,
      house: moon.house,
    },
    sun: {
      rashi: sun.rashi,
      nakshatra: sun.nakshatra,
      pada: sun.pada,
      house: sun.house,
    },
    grahas,
    dominant,
    sections,
    dasha,
  };
}

export function natalLonMap(birth: BirthConfig): LonMap {
  const birthDt = new Date(
    Date.UTC(
      +birth.date.slice(0, 4),
      +birth.date.slice(5, 7) - 1,
      +birth.date.slice(8, 10),
      +birth.h,
      +birth.m,
      +birth.s,
    ),
  );
  const pl = computePlanets(julianDay(birthDt));
  const out = {} as LonMap;
  for (const g of GRAHAS) out[g.id] = pl[g.id].sidereal;
  return out;
}

