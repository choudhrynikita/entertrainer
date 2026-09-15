import {
  GRAHAS,
  type BirthConfig,
  type GrahaId,
  type LonMap,
  type PlanetMap,
  type SpeedMap,
} from './constants';
import { absShortest, ascendant, julianDay, lst, norm360 } from './math';
import {
  computePlanets,
  computeSpeeds,
  computeTithi,
  findAspect,
  harmonicScore,
  nakshatraInfo,
  rashiIndex,
  rashiName,
  wholeSignHouse,
} from './planets';
import { vimshottari } from './dasha';
import { signEn, HOUSE_LIFE, type AdviceBlock } from './influence';
import {
  adviceFromFrags,
  collectDayAdviceFrags,
  collectDayFrags,
  stitchParagraphs,
  dashaPairRule,
  nakshatraRule,
  grahaRashiRule,
  weekdayFromDate,
  computeYoga,
  computeKarana,
  orbBand,
  orbBandWording,
  detectCombustion,
  combustionWording,
  moonSpeedNote,
  dayVolumeFromAspectCount,
  yogaWording,
  karanaWording,
  type Frag,
} from './rules';

const PERSONAL: GrahaId[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];

const ASPECT_LABEL: Record<number, string> = {
  0: 'conjunct',
  60: 'sextile',
  90: 'square',
  120: 'trine',
  180: 'oppose',
};

const NAK_THEMES: Record<string, string> = {
  Ashwini: 'quick-start, fix-it energy',
  Bharani: 'hold pressure until something real lands',
  Krittika: 'cut clean and sharpen focus',
  Rohini: 'grow and attract around a chosen target',
  Mrigashira: 'seek, scan, stay curious',
  Ardra: 'storm clarity — tear then rebuild',
  Punarvasu: 'renew and return with a second chance',
  Pushya: 'steady care and right timing',
  Ashlesha: 'read undercurrents carefully',
  Magha: 'legacy mood and rightful presence',
  'Purva Phalguni': 'play, pleasure, creative ease',
  'Uttara Phalguni': 'ally, contract, help that sticks',
  Hasta: 'skillful hands and practical craft',
  Chitra: 'design beauty into form',
  Swati: 'independent wind — keep room to move',
  Vishakha: 'aim — pick which goal gets the heat',
  Anuradha: 'loyal orbit around people and causes',
  Jyeshtha: 'protect earned skill',
  Mula: 'dig to the root',
  'Purva Ashadha': 'bold early push',
  'Uttara Ashadha': 'wins that last through structure',
  Shravana: 'listen deep before speaking',
  Dhanishta: 'rhythm, teams, timed bursts',
  Shatabhisha: 'odd, systems-level healing',
  'Purva Bhadrapada': 'fierce idealism — aim the fire',
  'Uttara Bhadrapada': 'patient depth',
  Revati: 'shepherd the last stretch gently',
};

const RASHI_MOOD: Record<string, string> = {
  Mesha: 'initiating and a bit martial',
  Vrishabha: 'steady, sensory, loyalty-seeking',
  Mithuna: 'talkative, dual, idea-hungry',
  Karka: 'protective and tide-sensitive',
  Simha: 'warm, proud, creative',
  Kanya: 'precise, useful, quietly critical',
  Tula: 'harmony-seeking and relational',
  Vrischika: 'intense and all-or-nothing',
  Dhanu: 'meaning-hungry and horizon-facing',
  Makara: 'sober, ambitious, endurance-minded',
  Kumbha: 'future-minded and friendship-toned',
  Meena: 'empathic, imaginal, porous',
};

const DASHA_TONE: Record<string, string> = {
  Sun: 'identity heat and visibility',
  Moon: 'mood currents and care loops',
  Mars: 'drive, cut-through, decisive force',
  Mercury: 'ideas, messages, and skill traffic',
  Jupiter: 'growth, teaching, and trust',
  Venus: 'bond, art, and desire-harmony',
  Saturn: 'long grind and sober accountability',
  Rahu: 'hunger for the unconventional',
  Ketu: 'release, simplify, quiet gut clarity',
};

export type ClimateLabel = 'tense' | 'fluid' | 'peak' | 'quiet' | 'volatile';

export interface AspectHit {
  a: GrahaId;
  b: GrahaId;
  angle: number;
  label: string;
  orb: number;
  kind: 'transit' | 'natal';
  motion: 'applying' | 'separating' | 'exact';
}

export interface InsightCard {
  id: string;
  tone: 'sky' | 'soft' | 'hard' | 'spotlight' | 'dasha' | 'quiet';
  title: string;
  body: string;
  /** Optional graha to open on tap */
  graha?: GrahaId;
}

export interface TodayInsights {
  dasha: { maha: string; antar: string; tone: string };
  moon: {
    rashi: string;
    nakshatra: string;
    pada: number;
    waxing: boolean;
    hoursToNextNak: number | null;
    hoursToNextRashi: number | null;
  };
  lagna: {
    rashi: string;
    degree: number;
    changedVs2h: boolean;
    prevRashi: string;
  };
  retrogrades: GrahaId[];
  aspects: AspectHit[];
  hrs: number;
  climate: ClimateLabel;
  climateNote: string;
  /** Multi-paragraph plain-English day write-up */
  daySummary: string;
  /** Practical suggestions for this sim moment */
  dayAdvice: AdviceBlock;
  cards: InsightCard[];
  isDemoNatal: boolean;
  panchanga?: {
    weekday: string;
    yoga: string;
    karana: string;
  };
  dayVolume?: 'quiet' | 'balanced' | 'loud';
  combustion?: { graha: GrahaId; combust: boolean; sep: number }[];
}

function hoursToBoundary(
  currentLon: number,
  speedDegPerDay: number,
  boundaryEvery: number,
): number | null {
  if (Math.abs(speedDegPerDay) < 1e-6) return null;
  const lon = norm360(currentLon);
  const into = lon % boundaryEvery;
  if (speedDegPerDay > 0) {
    const rem = boundaryEvery - into;
    return (rem / speedDegPerDay) * 24;
  }
  const rem = into === 0 ? boundaryEvery : into;
  return (rem / Math.abs(speedDegPerDay)) * 24;
}

function aspectMotion(
  lonA: number,
  lonB: number,
  speedA: number,
  speedB: number,
  angle: number,
): 'applying' | 'separating' | 'exact' {
  const rel = speedA - speedB;
  const dNow = Math.abs(absShortest(lonA, lonB) - angle);
  if (dNow < 0.15) return 'exact';
  const dLater = Math.abs(absShortest(lonA + rel / 24, lonB) - angle);
  if (Math.abs(dNow - dLater) < 1e-4) return 'exact';
  return dLater < dNow ? 'applying' : 'separating';
}

function collectTransitAspects(
  planets: PlanetMap,
  speeds: SpeedMap,
): AspectHit[] {
  const hits: AspectHit[] = [];
  const ids = GRAHAS.map((g) => g.id);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i];
      const b = ids[j];
      const asp = findAspect(planets[a].sidereal, planets[b].sidereal);
      if (!asp) continue;
      const orb = absShortest(planets[a].sidereal, planets[b].sidereal);
      const trueOrb = Math.abs(orb - asp.angle);
      if (trueOrb > 3) continue;
      hits.push({
        a,
        b,
        angle: asp.angle,
        label: ASPECT_LABEL[asp.angle] || `${asp.angle}°`,
        orb: trueOrb,
        kind: 'transit',
        motion: aspectMotion(
          planets[a].sidereal,
          planets[b].sidereal,
          speeds[a],
          speeds[b],
          asp.angle,
        ),
      });
    }
  }
  hits.sort((x, y) => x.orb - y.orb);
  return hits.slice(0, 8);
}

function collectNatalHits(
  transit: PlanetMap,
  natal: LonMap,
  speeds: SpeedMap,
): AspectHit[] {
  const hits: AspectHit[] = [];
  for (const t of PERSONAL) {
    for (const n of GRAHAS) {
      const asp = findAspect(transit[t].sidereal, natal[n.id]);
      if (!asp) continue;
      const trueOrb = Math.abs(
        absShortest(transit[t].sidereal, natal[n.id]) - asp.angle,
      );
      if (trueOrb > 2.5) continue;
      hits.push({
        a: t,
        b: n.id,
        angle: asp.angle,
        label: ASPECT_LABEL[asp.angle] || `${asp.angle}°`,
        orb: trueOrb,
        kind: 'natal',
        motion: aspectMotion(
          transit[t].sidereal,
          natal[n.id],
          speeds[t],
          0,
          asp.angle,
        ),
      });
    }
  }
  hits.sort((x, y) => x.orb - y.orb);
  return hits.slice(0, 6);
}

function climateFrom(
  hrs: number,
  soft: number,
  hard: number,
  exactHard: number,
): { climate: ClimateLabel; note: string } {
  if (exactHard >= 2 || (hard >= 4 && soft <= 1)) {
    return {
      climate: 'volatile',
      note: 'Several hard edges at once — keep scope small and technique high.',
    };
  }
  if (soft + hard <= 1) {
    return {
      climate: 'quiet',
      note: 'Sparse sky — good for deep work, weak for forced pivots.',
    };
  }
  if (hrs >= 72 && soft >= hard) {
    return {
      climate: 'peak',
      note: 'Soft links are loud — ship what is ready and collaborate.',
    };
  }
  if (hard > soft + 1) {
    return {
      climate: 'tense',
      note: 'Friction dominates — precision under pressure beats drama.',
    };
  }
  return {
    climate: 'fluid',
    note: 'Easier traffic — prefer alliance and polish over confrontation.',
  };
}

function buildDaySummary(args: {
  moonNak: string;
  moonRashi: string;
  moonPada: number;
  waxing: boolean;
  tithiName: string;
  paksha: 'Shukla' | 'Krishna';
  lagRashi: string;
  changedVs2h: boolean;
  prevRashi: string;
  soft: number;
  hard: number;
  climate: ClimateLabel;
  climateNote: string;
  retrogrades: GrahaId[];
  dasha: { maha: string; antar: string };
  hrs: number;
  natalHits: AspectHit[];
  transitAspects: AspectHit[];
  isDemo: boolean;
  extraFrags?: Frag[];
}): string {
  const topAsp = args.transitAspects[0];
  const natalHit = args.natalHits[0];
  const frags = collectDayFrags({
    moonRashi: args.moonRashi,
    moonNak: args.moonNak,
    moonPada: args.moonPada,
    waxing: args.waxing,
    tithiName: args.tithiName,
    paksha: args.paksha,
    lagna: args.lagRashi,
    climate: args.climate,
    climateNote: args.climateNote,
    soft: args.soft,
    hard: args.hard,
    retrogrades: args.retrogrades,
    dashaMaha: args.dasha.maha,
    dashaAntar: args.dasha.antar,
    aspectLabel: topAsp?.label,
    aspectGraha: topAsp?.a,
    aspectOther: topAsp?.b,
    natalAspectPair: natalHit
      ? { transit: natalHit.a, natal: natalHit.b, label: natalHit.label }
      : undefined,
  });

  const lagEn = signEn(args.lagRashi);
  const lagBit = args.changedVs2h
    ? `How you meet the next few hours just shifted — from a ${signEn(args.prevRashi)} feel into ${lagEn}.`
    : `How you meet the next stretch of hours has a ${lagEn} colour.`;
  frags.push({ text: lagBit, specificity: 38, cite: `Rising ${lagEn}` });

  let texture: string;
  if (args.climate === 'volatile') {
    texture = 'The day feels volatile — a few sharp edges at once. Keep scope small and refuse to panic.';
  } else if (args.climate === 'quiet') {
    texture = 'The day feels quiet — good for deep work, weak for forced pivots.';
  } else if (args.climate === 'peak') {
    texture = 'The day has an easy peak feel — ship what’s ready and collaborate.';
  } else if (args.climate === 'tense') {
    texture = 'The day carries contested edges — precision under pressure beats drama.';
  } else {
    texture = 'The day is relatively fluid — prefer alliance and polish over confrontation.';
  }
  frags.push({ text: texture, specificity: 36, cite: `HRS ${args.hrs}` });

  if (!args.isDemo && natalHit) {
    const verb =
      natalHit.label === 'oppose'
        ? 'sitting across from'
        : natalHit.label === 'conjunct'
          ? 'meeting closely'
          : natalHit.label === 'square'
            ? 'pressing on'
            : natalHit.label === 'trine'
              ? 'working smoothly with'
              : natalHit.label === 'sextile'
                ? 'gently supporting'
                : 'linking with';
    frags.push({
      text: `${natalHit.a} is ${verb} themes tied to your ${natalHit.b}: expect sharper charge there today. Take one concrete step; don’t dramatize.`,
      specificity: 67,
      cite: `t${natalHit.a}→n${natalHit.b}`,
    });
  } else if (args.isDemo) {
    frags.push({
      text: 'Save your birth details if you want these notes to name which of your life themes are active today.',
      specificity: 20,
      cite: 'demo',
    });
  }

  frags.push({
    text: 'None of this decides your day for you. Use it to choose scope and next steps, not to outsource judgment.',
    specificity: 15,
    cite: 'agency',
  });

  if (args.extraFrags?.length) frags.push(...args.extraFrags);

  const stitched = stitchParagraphs(frags, { perPara: 2, maxFrags: 12, maxChars: 1600 });
  return stitched || `Emotional tone today sits in ${signEn(args.moonRashi)} (${args.moonNak}). Expect needs to show there; keep the next step small.`;
}




function buildDayAdvice(args: {
  moonNak: string;
  moonRashi: string;
  moonPada: number;
  waxing: boolean;
  tithiName: string;
  paksha: 'Shukla' | 'Krishna';
  climate: ClimateLabel;
  retrogrades: GrahaId[];
  dasha: { maha: string; antar: string };
  hrs: number;
  soft: number;
  hard: number;
  natalHits: AspectHit[];
  transitAspects: AspectHit[];
  isDemo: boolean;
  extraFrags?: Frag[];
}): AdviceBlock {
  const topAsp = args.transitAspects[0];
  const frags = collectDayAdviceFrags({
    moonRashi: args.moonRashi,
    moonNak: args.moonNak,
    moonPada: args.moonPada,
    waxing: args.waxing,
    tithiName: args.tithiName,
    paksha: args.paksha,
    climate: args.climate,
    soft: args.soft,
    hard: args.hard,
    retrogrades: args.retrogrades,
    dashaMaha: args.dasha.maha,
    dashaAntar: args.dasha.antar,
    aspectLabel: topAsp?.label,
    aspectGraha: topAsp?.a,
    aspectOther: topAsp?.b,
    natalHit: !args.isDemo && args.natalHits.length > 0,
    extra: args.extraFrags,
  });
  return adviceFromFrags('Advice for today', frags, 6);
}


function buildCards(args: {
  moonNak: string;
  moonRashi: string;
  soft: number;
  hard: number;
  natalHits: AspectHit[];
  dasha: { maha: string; antar: string };
  natal: LonMap | null;
  transit: PlanetMap;
  isDemo: boolean;
  climate: ClimateLabel;
}): InsightCard[] {
  const cards: InsightCard[] = [];

  const nkRule = nakshatraRule(args.moonNak);
  const moonRule = grahaRashiRule('Moon', args.moonRashi);
  cards.push({
    id: 'moon-nak',
    tone: 'sky',
    title: `Moon · ${args.moonNak}`,
    body: `${nkRule?.temperament || NAK_THEMES[args.moonNak] || 'lunar mood'} ${moonRule?.temperament || `In ${signEn(args.moonRashi)}: ${RASHI_MOOD[args.moonRashi] || 'sign tone'}.`} Do one small thing that matches the mood; skip inventing extra drama.`,
    graha: 'Moon',
  });

  if (args.soft > args.hard + 1) {
    cards.push({
      id: 'texture-soft',
      tone: 'soft',
      title: 'Day texture · fluid',
      body: `${args.soft} soft vs ${args.hard} hard contacts — prefer collaboration and finish what’s ready; skip picking a fight.`,
    });
  } else if (args.hard > args.soft + 1) {
    cards.push({
      id: 'texture-hard',
      tone: 'hard',
      title: 'Day texture · edged',
      body: `${args.hard} hard vs ${args.soft} soft contacts — precision under pressure; pause before sharp turns in talk.`,
    });
  } else if (args.soft + args.hard <= 1) {
    cards.push({
      id: 'texture-quiet',
      tone: 'quiet',
      title: 'Day texture · quiet',
      body: 'Few exact contacts — sparse sky. Deep work yes; forced pivots no.',
    });
  } else {
    cards.push({
      id: 'texture-mixed',
      tone: 'sky',
      title: 'Day texture · mixed',
      body: `${args.soft} soft · ${args.hard} hard contacts — alternate push and ease; name the main thread once.`,
    });
  }

  if (args.isDemo || !args.natal) {
    cards.push({
      id: 'nudge-birth',
      tone: 'quiet',
      title: 'Transit sky only',
      body: 'Save birth data to see which of your life themes are active and how period lords are hit.',
    });
  } else {
    for (const hit of args.natalHits.slice(0, 3)) {
      const conj = hit.angle === 0;
      cards.push({
        id: `spot-${hit.a}-${hit.b}-${hit.angle}`,
        tone: 'spotlight',
        title: conj
          ? `Spotlight · ${hit.a} on your ${hit.b}`
          : `Hit · ${hit.a} ${hit.label} your ${hit.b}`,
        body: `${hit.a} is activating themes tied to your ${hit.b} — expect sharper charge there today. Take one concrete step; don’t dramatize.`,
        graha: hit.a,
      });
    }

    const maha = args.dasha.maha as GrahaId;
    const antar = args.dasha.antar as GrahaId;
    const lords = [maha, antar].filter((x, i, a) => a.indexOf(x) === i);
    let dashaCardAdded = false;
    for (const lord of lords) {
      if (dashaCardAdded || !args.natal[lord]) continue;
      for (const t of PERSONAL) {
        const toLord = findAspect(args.transit[t].sidereal, args.natal[lord]);
        if (
          toLord &&
          Math.abs(
            absShortest(args.transit[t].sidereal, args.natal[lord]) -
              toLord.angle,
          ) <= 2.5
        ) {
          cards.push({
            id: `dasha-${t}-${lord}`,
            tone: 'dasha',
            title: `Period echo · ${lord}`,
            body: `Transit ${t} is activating your period lord ${lord} — that life theme gets louder. Practise its better habit today; skip the stereotype.`,
            graha: t,
          });
          dashaCardAdded = true;
          break;
        }
      }
    }
  }

  if (args.climate === 'volatile') {
    cards.push({
      id: 'vol',
      tone: 'hard',
      title: 'Volatile window',
      body: 'Multiple exact hard aspects — tighten scope; skip theatre.',
    });
  }

  const seen = new Set<string>();
  return cards
    .filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    })
    .slice(0, 7);
}

export function computeTodayInsights(
  simDate: Date,
  birth: BirthConfig,
  natalLons: LonMap | null,
): TodayInsights {
  const jd = julianDay(simDate);
  const planets = computePlanets(jd);
  const speeds = computeSpeeds(jd);
  const lat = +birth.lat;
  const lon = +birth.lon;

  const asc = ascendant(lst(jd, lon), lat, jd);
  const lagDeg = asc.sidereal % 30;
  const lagRashi = rashiName(asc.sidereal);

  const jd2h = jd - 2 / 24;
  const asc2h = ascendant(lst(jd2h, lon), lat, jd2h);
  const prevRashi = rashiName(asc2h.sidereal);
  const changedVs2h = rashiIndex(asc.sidereal) !== rashiIndex(asc2h.sidereal);

  const moonLon = planets.Moon.sidereal;
  const nak = nakshatraInfo(moonLon);
  const moonRashi = rashiName(moonLon);
  const tithi = computeTithi(moonLon, planets.Sun.sidereal);
  const waxing = tithi.paksha === 'Shukla';

  const moonSpeed = speeds.Moon;
  const hoursToNextNak = hoursToBoundary(moonLon, moonSpeed, 360 / 27);
  const hoursToNextRashi = hoursToBoundary(moonLon, moonSpeed, 30);

  let dasha = { maha: '—', antar: '—', tone: '' };
  try {
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
    const d = vimshottari(birthDt, simDate);
    const pair = dashaPairRule(d.maha, d.antar);
    dasha = {
      maha: d.maha,
      antar: d.antar,
      tone: pair
        ? pair.tone
        : `${DASHA_TONE[d.maha] || 'period'} · ${d.antar}: ${DASHA_TONE[d.antar] || '—'}`,
    };
  } catch {
    /* keep defaults */
  }

  const retrogrades = GRAHAS.filter((g) => speeds[g.id] < -0.01).map(
    (g) => g.id,
  );

  const transitAspects = collectTransitAspects(planets, speeds);
  const natalHits =
    natalLons && !birth.isDemo
      ? collectNatalHits(planets, natalLons, speeds)
      : [];

  let soft = 0;
  let hard = 0;
  let exactHard = 0;
  for (const h of transitAspects) {
    if (h.angle === 60 || h.angle === 120 || h.angle === 0) soft++;
    else {
      hard++;
      if (h.orb < 1) exactHard++;
    }
  }

  const hrs = harmonicScore(planets);
  const { climate, note } = climateFrom(hrs, soft, hard, exactHard);


  const extraFrags: Frag[] = [];
  const weekday = weekdayFromDate(simDate);
  const yoga = computeYoga(planets.Sun.sidereal, planets.Moon.sidereal);
  const karana = computeKarana(planets.Moon.sidereal, planets.Sun.sidereal);
  extraFrags.push({
    text: `It’s ${weekday}. ${yogaWording(yoga.name)}`,
    specificity: 44,
    cite: 'panchanga',
  });

  const vol = dayVolumeFromAspectCount(transitAspects.length);
  extraFrags.push({ text: vol.life, specificity: 43, cite: 'day volume' });

  const moonNote = moonSpeedNote(speeds.Moon);
  if (moonNote) extraFrags.push({ text: moonNote, specificity: 47, cite: 'Moon speed' });

  const combustHits = detectCombustion(planets.Sun.sidereal, {
    Mercury: planets.Mercury.sidereal,
    Venus: planets.Venus.sidereal,
    Mars: planets.Mars.sidereal,
  });
  for (const h of combustHits.slice(0, 2)) {
    const w = combustionWording(h);
    extraFrags.push({ text: w.life, specificity: 69, cite: `${h.graha} beams` });
  }

  if (changedVs2h) {
    extraFrags.push({
      text: `How you meet the next stretch just shifted — from a ${signEn(prevRashi)} feel into ${signEn(lagRashi)}.`,
      specificity: 64,
      cite: 'hourly lagna',
    });
  }

  for (const a of transitAspects.slice(0, 2)) {
    const band = orbBand(a.orb);
    const ow = orbBandWording(band);
    extraFrags.push({
      text: ow.life,
      specificity: 61,
      cite: `orb ${a.a}-${a.b}`,
    });
  }

  let gocharaList: { graha: GrahaId; house: number }[] = [];
  if (natalLons && !birth.isDemo) {
    const birthDtG = new Date(Date.UTC(+birth.date.slice(0, 4), +birth.date.slice(5, 7) - 1, +birth.date.slice(8, 10), +birth.h, +birth.m, +birth.s));
    const natalJd = julianDay(birthDtG);
    const natalAsc = ascendant(lst(natalJd, lon), lat, natalJd);
    for (const g of PERSONAL) {
      gocharaList.push({ graha: g, house: wholeSignHouse(planets[g].sidereal, natalAsc.sidereal) });
    }
    for (const g of gocharaList.slice(0, 2)) {
      const life = HOUSE_LIFE[g.house] || 'a live area of day-to-day life';
      extraFrags.push({
        text: `${g.graha} is highlighting ${life} for a while. Keep the next step small and concrete; don’t over-read a temporary spotlight.`,
        specificity: 71,
        cite: `gochara ${g.graha}`,
      });
    }
  }

  const daySummary = buildDaySummary({
    moonNak: nak.name,
    moonRashi,
    moonPada: nak.pada,
    waxing,
    tithiName: tithi.name,
    paksha: (tithi.paksha === 'Shukla' ? 'Shukla' : 'Krishna'),
    lagRashi,
    changedVs2h,
    prevRashi,
    soft,
    hard,
    climate,
    climateNote: note,
    retrogrades,
    dasha,
    hrs,
    natalHits,
    transitAspects,
    isDemo: !!birth.isDemo,
    extraFrags,
  });

  const dayAdvice = buildDayAdvice({
    moonNak: nak.name,
    moonRashi,
    moonPada: nak.pada,
    waxing,
    tithiName: tithi.name,
    paksha: (tithi.paksha === 'Shukla' ? 'Shukla' : 'Krishna'),
    climate,
    retrogrades,
    dasha,
    hrs,
    soft,
    hard,
    natalHits,
    transitAspects,
    isDemo: !!birth.isDemo,
    extraFrags,
  });

  const cards = buildCards({
    moonNak: nak.name,
    moonRashi,
    soft,
    hard,
    natalHits,
    dasha,
    natal: natalLons,
    transit: planets,
    isDemo: !!birth.isDemo,
    climate,
  });

  return {
    dasha,
    moon: {
      rashi: moonRashi,
      nakshatra: nak.name,
      pada: nak.pada,
      waxing,
      hoursToNextNak,
      hoursToNextRashi,
    },
    lagna: {
      rashi: lagRashi,
      degree: lagDeg,
      changedVs2h,
      prevRashi,
    },
    retrogrades,
    aspects: [...transitAspects.slice(0, 5), ...natalHits.slice(0, 3)],
    hrs,
    climate,
    climateNote: note,
    daySummary,
    dayAdvice,
    cards,
    isDemoNatal: !!birth.isDemo,
    panchanga: { weekday, yoga: yoga.name, karana: karana.name },
    dayVolume: vol.volume,
    combustion: combustHits.map((h) => ({ graha: h.graha, combust: h.combust, sep: h.sep })),
  };
}

