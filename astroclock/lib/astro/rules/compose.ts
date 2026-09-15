import type { GrahaId } from '../constants';
import { grahaRashiRule } from './rashiGraha';
import { nakshatraRule } from './nakshatra';
import { grahaBhavaRule } from './grahaBhava';
import { aspectRule, ASPECT_BAND } from './aspects';
import { dashaPairRule } from './dasha';
import { tithiRule } from './tithiMoon';
import { lagnaMoonBlend } from './lagnaMoonBlend';
import { retrogradeRule } from './retrograde';
import { grahaNakshatraRule } from './grahaNakshatra';
import { aspectPairRule } from './aspectPairs';
import { dashaBhavaRule, dashaRashiRule } from './dashaBhava';
import { gocharaHouseRule } from './gochara';
import { houseToneFlag } from './classical';
import {
  ensureSentence,
  joinSentences,
  paragraphsFromSentences,
  scrubMechanic,
  aspectLifeVerb,
} from './prose';

export interface AdviceBlock {
  title: string;
  items: string[];
  cites: string[];
}

export interface Frag {
  text: string;
  /** Higher = more specific / preferred */
  specificity: number;
  cite?: string;
  /** If true, text is already advice-shaped */
  kind?: 'life' | 'advice';
}

function normalizeKey(text: string): string {
  return scrubMechanic(text)
    .slice(0, 64)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenOverlap(a: string, b: string): number {
  const ta = new Set(a.split(' ').filter((w) => w.length > 3));
  const tb = b.split(' ').filter((w) => w.length > 3);
  if (!ta.size || !tb.length) return 0;
  let hit = 0;
  for (const w of tb) if (ta.has(w)) hit++;
  return hit / Math.max(ta.size, tb.length);
}

export function pickMostSpecific(frags: Frag[], max = 8): Frag[] {
  const sorted = [...frags]
    .map((f) => ({ ...f, text: scrubMechanic(f.text || '') }))
    .filter((f) => f.text && f.text.trim().length > 12)
    .sort((a, b) => b.specificity - a.specificity);
  const out: Frag[] = [];
  const seen = new Set<string>();
  for (const f of sorted) {
    const key = normalizeKey(f.text);
    if (!key || seen.has(key)) continue;
    let tooClose = false;
    for (const prev of out) {
      if (tokenOverlap(normalizeKey(prev.text), key) > 0.5) {
        tooClose = true;
        break;
      }
    }
    if (tooClose) continue;
    seen.add(key);
    out.push({ ...f, text: ensureSentence(f.text) });
    if (out.length >= max) break;
  }
  return out;
}

/** Stitch into short paragraphs: 2–3 sentences each, proper punctuation */
export function stitchParagraphs(
  frags: Frag[],
  opts?: { perPara?: number; maxFrags?: number; maxChars?: number },
): string {
  const max = opts?.maxFrags ?? 9;
  const per = opts?.perPara ?? 3;
  const maxChars = opts?.maxChars ?? 1100;
  const picked = pickMostSpecific(frags, max);
  if (!picked.length) return '';
  return paragraphsFromSentences(
    picked.map((f) => f.text),
    per,
    maxChars,
  );
}

export function adviceFromFrags(
  title: string,
  frags: Frag[],
  maxItems = 5,
): AdviceBlock {
  const picked = pickMostSpecific(
    frags.map((f) => ({ ...f, kind: f.kind || 'advice' })),
    maxItems,
  );
  const cites = [
    ...new Set(picked.map((f) => f.cite).filter(Boolean) as string[]),
  ].slice(0, 6);
  return {
    title,
    items: picked.map((f) => ensureSentence(f.text)),
    cites,
  };
}

export function collectPlacementFrags(args: {
  graha: GrahaId;
  rashi: string;
  house: number;
  nakshatra?: string;
  pada?: number;
  retrograde?: boolean;
}): Frag[] {
  const frags: Frag[] = [];
  // Prefer graha×nak everyday lines when available
  if (args.nakshatra) {
    const gn = grahaNakshatraRule(args.graha, args.nakshatra);
    if (gn) {
      frags.push({
        text: gn.temperament,
        specificity: 72,
        cite: `${args.graha}·${args.nakshatra}`,
        kind: 'life',
      });
      frags.push({
        text: gn.advice,
        specificity: 71,
        cite: `${args.graha}·${args.nakshatra}`,
        kind: 'advice',
      });
    }
    const nk = nakshatraRule(args.nakshatra, args.pada);
    if (nk) {
      frags.push({
        text: nk.temperament,
        specificity: 60,
        cite: args.nakshatra,
        kind: 'life',
      });
      frags.push({
        text: nk.advice,
        specificity: 58,
        cite: args.nakshatra,
        kind: 'advice',
      });
      if (nk.padaNote) {
        frags.push({
          text: nk.padaNote,
          specificity: 70,
          cite: `${args.nakshatra} p${args.pada}`,
          kind: 'life',
        });
      }
    }
  }
  const gr = grahaRashiRule(args.graha, args.rashi);
  if (gr) {
    frags.push({
      text: gr.temperament,
      specificity: 50,
      cite: `${args.graha} in ${args.rashi}`,
      kind: 'life',
    });
    frags.push({
      text: gr.advice,
      specificity: 48,
      cite: `${args.graha} in ${args.rashi}`,
      kind: 'advice',
    });
  }
  const gb = grahaBhavaRule(args.graha, args.house);
  if (gb) {
    const tone = houseToneFlag(args.house);
    frags.push({
      text: gb.lifeArea + (tone.note ? ' ' + tone.note : ''),
      specificity: 55,
      cite: `House ${args.house}`,
      kind: 'life',
    });
    frags.push({
      text: gb.advice,
      specificity: 52,
      cite: `${args.graha} house ${args.house}`,
      kind: 'advice',
    });
  }
  if (args.retrograde) {
    const rr = retrogradeRule(args.graha);
    if (rr) {
      frags.push({
        text: rr.temperament,
        specificity: 65,
        cite: `${args.graha} R`,
        kind: 'life',
      });
      frags.push({
        text: rr.advice,
        specificity: 64,
        cite: `${args.graha} R`,
        kind: 'advice',
      });
    }
  }
  return frags;
}

export function collectGocharaFrags(args: {
  transitGraha: GrahaId;
  natalHouse: number;
  aspectToNatal?: { natal: GrahaId; label: string };
}): Frag[] {
  const frags: Frag[] = [];
  const gh = gocharaHouseRule(args.transitGraha, args.natalHouse);
  if (gh) {
    frags.push({
      text: gh.lifeChapter,
      specificity: 74,
      cite: `t${args.transitGraha}→h${args.natalHouse}`,
      kind: 'life',
    });
    frags.push({
      text: gh.advice,
      specificity: 73,
      cite: `t${args.transitGraha}→h${args.natalHouse}`,
      kind: 'advice',
    });
  }
  if (args.aspectToNatal) {
    const pair = aspectPairRule(
      args.transitGraha,
      args.aspectToNatal.natal,
      args.aspectToNatal.label,
    );
    if (pair) {
      frags.push({
        text: pair.lifeMeaning,
        specificity: 76,
        cite: `${args.transitGraha}-${args.aspectToNatal.natal}`,
        kind: 'life',
      });
      frags.push({
        text: pair.advice,
        specificity: 75,
        cite: `${args.transitGraha}-${args.aspectToNatal.natal}`,
        kind: 'advice',
      });
    } else {
      const verb = aspectLifeVerb(args.aspectToNatal.label);
      frags.push({
        text: `${args.transitGraha} is ${verb} themes tied to your ${args.aspectToNatal.natal}: expect that mix in mood, talk, and choices. Take one concrete step; don’t dramatize.`,
        specificity: 66,
        cite: args.aspectToNatal.label,
        kind: 'life',
      });
    }
  }
  return frags;
}

export function collectProfileFrags(args: {
  lagna: string;
  moonRashi: string;
  moonHouse: number;
  moonNak: string;
  moonPada: number;
  sunRashi: string;
  sunHouse: number;
  lagLord: GrahaId;
  lagLordRashi: string;
  lagLordHouse: number;
  lagLordRetro?: boolean;
  dashaMaha?: string;
  dashaAntar?: string;
  dashaLordHouse?: number;
  dashaLordRashi?: string;
  extra?: Frag[];
}): Frag[] {
  const frags: Frag[] = [];
  const blend = lagnaMoonBlend(args.lagna, args.moonRashi);
  if (blend) {
    frags.push({
      text: blend,
      specificity: 80,
      cite: `Rising ${args.lagna} · Moon ${args.moonRashi}`,
      kind: 'life',
    });
  }
  frags.push(
    ...collectPlacementFrags({
      graha: 'Moon',
      rashi: args.moonRashi,
      house: args.moonHouse,
      nakshatra: args.moonNak,
      pada: args.moonPada,
    }),
  );
  frags.push(
    ...collectPlacementFrags({
      graha: 'Sun',
      rashi: args.sunRashi,
      house: args.sunHouse,
    }),
  );
  frags.push(
    ...collectPlacementFrags({
      graha: args.lagLord,
      rashi: args.lagLordRashi,
      house: args.lagLordHouse,
      retrograde: args.lagLordRetro,
    }),
  );
  if (args.dashaMaha && args.dashaAntar && args.dashaMaha !== '—') {
    const dp = dashaPairRule(args.dashaMaha, args.dashaAntar);
    if (dp) {
      frags.push({
        text: dp.tone,
        specificity: 45,
        cite: `${args.dashaMaha}/${args.dashaAntar}`,
        kind: 'life',
      });
    }
    if (args.dashaLordHouse) {
      const db = dashaBhavaRule(args.dashaMaha, args.dashaLordHouse);
      if (db)
        frags.push({
          text: db.tone,
          specificity: 78,
          cite: `${args.dashaMaha} h${args.dashaLordHouse}`,
          kind: 'life',
        });
    }
    if (args.dashaLordRashi) {
      const dr = dashaRashiRule(args.dashaMaha, args.dashaLordRashi);
      if (dr)
        frags.push({
          text: dr.tone,
          specificity: 77,
          cite: `${args.dashaMaha} ${args.dashaLordRashi}`,
          kind: 'life',
        });
    }
  }
  if (args.extra?.length) frags.push(...args.extra);
  return frags;
}

export function collectProfileAdviceFrags(args: {
  lagna: string;
  moonRashi: string;
  moonHouse: number;
  moonNak: string;
  moonPada: number;
  sunRashi: string;
  sunHouse: number;
  lagLord: GrahaId;
  lagLordRashi: string;
  lagLordHouse: number;
  lagLordRetro?: boolean;
  stressHouse?: number;
  dashaMaha?: string;
  dashaLordHouse?: number;
  dashaLordRashi?: string;
  extra?: Frag[];
}): Frag[] {
  const frags: Frag[] = [];
  const moonGR = grahaRashiRule('Moon', args.moonRashi);
  if (moonGR)
    frags.push({
      text: moonGR.advice,
      specificity: 60,
      cite: `Moon ${args.moonRashi}`,
      kind: 'advice',
    });
  const sunGR = grahaRashiRule('Sun', args.sunRashi);
  if (sunGR)
    frags.push({
      text: sunGR.advice,
      specificity: 55,
      cite: `Sun ${args.sunRashi}`,
      kind: 'advice',
    });
  const lordGB = grahaBhavaRule(args.lagLord, args.lagLordHouse);
  if (lordGB)
    frags.push({
      text: lordGB.advice,
      specificity: 58,
      cite: `${args.lagLord} house ${args.lagLordHouse}`,
      kind: 'advice',
    });
  const moonGB = grahaBhavaRule('Moon', args.moonHouse);
  if (moonGB)
    frags.push({
      text: moonGB.advice,
      specificity: 57,
      cite: `Moon house ${args.moonHouse}`,
      kind: 'advice',
    });
  const nk = nakshatraRule(args.moonNak, args.moonPada);
  if (nk) {
    frags.push({
      text: nk.advice,
      specificity: 65,
      cite: args.moonNak,
      kind: 'advice',
    });
    if (nk.padaNote)
      frags.push({
        text: nk.padaNote,
        specificity: 70,
        cite: `pada ${args.moonPada}`,
        kind: 'advice',
      });
  }
  const gn = grahaNakshatraRule('Moon', args.moonNak);
  if (gn)
    frags.push({
      text: gn.advice,
      specificity: 72,
      cite: `Moon·${args.moonNak}`,
      kind: 'advice',
    });
  if (args.lagLordRetro) {
    const rr = retrogradeRule(args.lagLord);
    if (rr)
      frags.push({
        text: rr.advice,
        specificity: 68,
        cite: `${args.lagLord} R`,
        kind: 'advice',
      });
  }
  if (args.stressHouse) {
    const stress = grahaBhavaRule('Saturn', args.stressHouse);
    const tone = houseToneFlag(args.stressHouse);
    if (stress) {
      frags.push({
        text: `There’s pressure in a classic challenge zone. ${stress.advice}${tone.note ? ' ' + tone.note : ''}`,
        specificity: 50,
        cite: `Stress area ${args.stressHouse}`,
        kind: 'advice',
      });
    }
  }
  const lordGR = grahaRashiRule(args.lagLord, args.lagLordRashi);
  if (lordGR)
    frags.push({
      text: lordGR.advice,
      specificity: 52,
      cite: `Rising lord ${args.lagLord}`,
      kind: 'advice',
    });
  if (args.dashaMaha && args.dashaLordHouse) {
    const db = dashaBhavaRule(args.dashaMaha, args.dashaLordHouse);
    if (db)
      frags.push({
        text: db.advice,
        specificity: 76,
        cite: `dasha ${args.dashaMaha} h${args.dashaLordHouse}`,
        kind: 'advice',
      });
  }
  if (args.dashaMaha && args.dashaLordRashi) {
    const dr = dashaRashiRule(args.dashaMaha, args.dashaLordRashi);
    if (dr)
      frags.push({
        text: dr.advice,
        specificity: 75,
        cite: `dasha ${args.dashaMaha} ${args.dashaLordRashi}`,
        kind: 'advice',
      });
  }
  if (args.extra?.length) frags.push(...args.extra);
  return frags;
}

export function collectDayFrags(args: {
  moonRashi: string;
  moonNak: string;
  moonPada?: number;
  waxing: boolean;
  tithiName?: string;
  paksha?: 'Shukla' | 'Krishna';
  lagna: string;
  climate?: 'tense' | 'fluid' | 'peak' | 'quiet' | 'volatile';
  climateNote?: string;
  soft?: number;
  hard?: number;
  retrogrades?: GrahaId[];
  dashaMaha?: string;
  dashaAntar?: string;
  aspectLabel?: string;
  aspectGraha?: GrahaId;
  aspectOther?: GrahaId;
  natalAspectLabel?: string;
  natalAspectPair?: { transit: GrahaId; natal: GrahaId; label: string };
  gochara?: { graha: GrahaId; house: number }[];
  extra?: Frag[];
}): Frag[] {
  const frags: Frag[] = [];
  const nk = nakshatraRule(args.moonNak, args.moonPada);
  if (nk) {
    frags.push({
      text: nk.temperament,
      specificity: 70,
      cite: args.moonNak,
      kind: 'life',
    });
    if (nk.padaNote) {
      frags.push({
        text: nk.padaNote,
        specificity: 75,
        cite: `pada ${args.moonPada}`,
        kind: 'life',
      });
    }
  }
  const gn = grahaNakshatraRule('Moon', args.moonNak);
  if (gn) {
    frags.push({
      text: gn.temperament,
      specificity: 73,
      cite: `Moon·${args.moonNak}`,
      kind: 'life',
    });
  }
  const moonR = grahaRashiRule('Moon', args.moonRashi);
  if (moonR) {
    frags.push({
      text: moonR.temperament,
      specificity: 55,
      cite: `Moon ${args.moonRashi}`,
      kind: 'life',
    });
  }
  const paksha = args.paksha || (args.waxing ? 'Shukla' : 'Krishna');
  const tr = tithiRule(
    args.tithiName || (args.waxing ? 'Purnima' : 'Amavasya'),
    paksha,
  );
  frags.push({
    text: tr.colour,
    specificity: 50,
    cite: args.tithiName || paksha,
    kind: 'life',
  });
  if (tr.pakshaColour) {
    frags.push({
      text: tr.pakshaColour,
      specificity: 45,
      cite: paksha,
      kind: 'life',
    });
  }
  if (args.climateNote) {
    frags.push({
      text: args.climateNote,
      specificity: 40,
      cite: 'climate',
      kind: 'life',
    });
  }
  if (args.soft != null && args.hard != null) {
    const band =
      args.hard > args.soft + 1
        ? ASPECT_BAND.hard
        : args.soft > args.hard + 1
          ? ASPECT_BAND.soft
          : ASPECT_BAND.mixed;
    frags.push({
      text: band.lifeMeaning,
      specificity: 42,
      cite: 'aspect band',
      kind: 'life',
    });
  }
  if (args.retrogrades?.length) {
    for (const g of args.retrogrades.slice(0, 2)) {
      const rr = retrogradeRule(g);
      if (rr)
        frags.push({
          text: rr.temperament,
          specificity: 60,
          cite: `${g} R`,
          kind: 'life',
        });
    }
  }
  if (args.dashaMaha && args.dashaAntar && args.dashaMaha !== '—') {
    const dp = dashaPairRule(args.dashaMaha, args.dashaAntar);
    if (dp) {
      frags.push({
        text: dp.tone,
        specificity: 58,
        cite: `${args.dashaMaha}/${args.dashaAntar}`,
        kind: 'life',
      });
    }
  }
  if (args.aspectGraha && args.aspectOther && args.aspectLabel) {
    const pair = aspectPairRule(
      args.aspectGraha,
      args.aspectOther,
      args.aspectLabel,
    );
    if (pair) {
      frags.push({
        text: pair.lifeMeaning,
        specificity: 78,
        cite: `${args.aspectGraha}-${args.aspectOther}`,
        kind: 'life',
      });
    } else {
      const verb = aspectLifeVerb(args.aspectLabel);
      frags.push({
        text: `${args.aspectGraha} is ${verb} ${args.aspectOther} in the sky — expect that mix in conversations and decisions today.`,
        specificity: 62,
        cite: args.aspectLabel,
        kind: 'life',
      });
    }
  }
  if (args.natalAspectPair) {
    const p = args.natalAspectPair;
    const pair = aspectPairRule(p.transit, p.natal, p.label);
    if (pair) {
      frags.push({
        text: pair.lifeMeaning,
        specificity: 79,
        cite: `${p.transit}-${p.natal}`,
        kind: 'life',
      });
    } else {
      const verb = aspectLifeVerb(p.label);
      frags.push({
        text: `${p.transit} is ${verb} themes tied to your ${p.natal}: expect sharper charge there today. Respond with one concrete step, not drama.`,
        specificity: 77,
        cite: `${p.transit}→${p.natal}`,
        kind: 'life',
      });
    }
  }
  if (args.gochara?.length) {
    for (const g of args.gochara.slice(0, 2)) {
      frags.push(
        ...collectGocharaFrags({
          transitGraha: g.graha,
          natalHouse: g.house,
        }),
      );
    }
  }
  const blend = lagnaMoonBlend(args.lagna, args.moonRashi);
  if (blend) {
    const short = blend.split(/[—.]/)[0].trim();
    if (short) {
      frags.push({
        text: `How you meet the day: ${short}.`,
        specificity: 35,
        cite: 'lagna/moon',
        kind: 'life',
      });
    }
  }
  if (args.extra?.length) frags.push(...args.extra);
  return frags;
}

export function collectDayAdviceFrags(args: {
  moonRashi: string;
  moonNak: string;
  moonPada?: number;
  waxing: boolean;
  tithiName?: string;
  paksha?: 'Shukla' | 'Krishna';
  climate?: 'tense' | 'fluid' | 'peak' | 'quiet' | 'volatile';
  soft?: number;
  hard?: number;
  retrogrades?: GrahaId[];
  dashaMaha?: string;
  dashaAntar?: string;
  aspectLabel?: string;
  aspectGraha?: GrahaId;
  aspectOther?: GrahaId;
  natalHit?: boolean;
  natalAspectPair?: { transit: GrahaId; natal: GrahaId; label: string };
  gochara?: { graha: GrahaId; house: number }[];
  extra?: Frag[];
}): Frag[] {
  const frags: Frag[] = [];
  const nk = nakshatraRule(args.moonNak, args.moonPada);
  if (nk)
    frags.push({
      text: nk.advice,
      specificity: 70,
      cite: args.moonNak,
      kind: 'advice',
    });
  const gn = grahaNakshatraRule('Moon', args.moonNak);
  if (gn)
    frags.push({
      text: gn.advice,
      specificity: 72,
      cite: `Moon·${args.moonNak}`,
      kind: 'advice',
    });
  const moonR = grahaRashiRule('Moon', args.moonRashi);
  if (moonR)
    frags.push({
      text: moonR.advice,
      specificity: 55,
      cite: `Moon ${args.moonRashi}`,
      kind: 'advice',
    });
  const paksha = args.paksha || (args.waxing ? 'Shukla' : 'Krishna');
  const tr = tithiRule(
    args.tithiName || (args.waxing ? 'Purnima' : 'Amavasya'),
    paksha,
  );
  frags.push({ text: tr.advice, specificity: 50, cite: 'tithi', kind: 'advice' });
  if (tr.pakshaAdvice)
    frags.push({
      text: tr.pakshaAdvice,
      specificity: 48,
      cite: paksha,
      kind: 'advice',
    });
  if (args.soft != null && args.hard != null) {
    const band =
      args.hard > args.soft + 1
        ? ASPECT_BAND.hard
        : args.soft > args.hard + 1
          ? ASPECT_BAND.soft
          : ASPECT_BAND.mixed;
    frags.push({
      text: band.advice,
      specificity: 45,
      cite: 'climate',
      kind: 'advice',
    });
  }
  if (args.retrogrades?.length) {
    const rr = retrogradeRule(args.retrogrades[0]);
    if (rr)
      frags.push({
        text: rr.advice,
        specificity: 60,
        cite: `${args.retrogrades[0]} R`,
        kind: 'advice',
      });
  }
  if (args.dashaMaha && args.dashaAntar && args.dashaMaha !== '—') {
    const dp = dashaPairRule(args.dashaMaha, args.dashaAntar);
    if (dp)
      frags.push({
        text: dp.advice,
        specificity: 58,
        cite: 'dasha',
        kind: 'advice',
      });
  }
  if (args.aspectGraha && args.aspectOther && args.aspectLabel) {
    const pair = aspectPairRule(
      args.aspectGraha,
      args.aspectOther,
      args.aspectLabel,
    );
    if (pair)
      frags.push({
        text: pair.advice,
        specificity: 78,
        cite: `${args.aspectGraha}-${args.aspectOther}`,
        kind: 'advice',
      });
  }
  if (args.natalAspectPair) {
    const p = args.natalAspectPair;
    const pair = aspectPairRule(p.transit, p.natal, p.label);
    if (pair) {
      frags.push({
        text: pair.advice,
        specificity: 79,
        cite: `${p.transit}-${p.natal}`,
        kind: 'advice',
      });
    } else {
      frags.push({
        text: 'A familiar life theme is active today — take one concrete step; don’t treat it as fate.',
        specificity: 52,
        cite: 'natal hit',
        kind: 'advice',
      });
    }
  } else if (args.natalHit) {
    frags.push({
      text: 'A familiar life theme is active today — take one concrete step; don’t treat it as fate.',
      specificity: 52,
      cite: 'natal hit',
      kind: 'advice',
    });
  }
  if (args.gochara?.length) {
    const g0 = args.gochara[0];
    const gh = gocharaHouseRule(g0.graha, g0.house);
    if (gh)
      frags.push({
        text: gh.advice,
        specificity: 74,
        cite: `gochara ${g0.graha}`,
        kind: 'advice',
      });
  }
  if (args.extra?.length) frags.push(...args.extra);
  return frags;
}

export {
  grahaRashiRule,
  nakshatraRule,
  grahaBhavaRule,
  aspectRule,
  dashaPairRule,
  tithiRule,
  lagnaMoonBlend,
  retrogradeRule,
  grahaNakshatraRule,
  aspectPairRule,
  dashaBhavaRule,
  dashaRashiRule,
  gocharaHouseRule,
  joinSentences,
  ensureSentence,
  scrubMechanic,
};
