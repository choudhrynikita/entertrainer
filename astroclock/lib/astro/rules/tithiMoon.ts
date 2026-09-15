export interface TithiRule {
  colour: string;
  advice: string;
}

export const TITHI_RULES: Record<string, TithiRule> = {
  Pratipada: {
    colour: 'Fresh-start lunar day — beginnings want a light touch.',
    advice: 'Plant one small intention; do not overplant.',
  },
  Dwitiya: {
    colour: 'Early-building lunar day — momentum is young.',
    advice: 'Add one brick to yesterday’s start.',
  },
  Tritiya: {
    colour: 'Effort-warming lunar day — skill likes practice.',
    advice: 'Practice a craft rep; small mastery counts.',
  },
  Chaturthi: {
    colour: 'Obstacle-aware lunar day — stubborn focus helps.',
    advice: 'Name one blocker and work around it cleanly.',
  },
  Panchami: {
    colour: 'Creative-intelligence lunar day — learning sparks.',
    advice: 'Study or draft something curious.',
  },
  Shashthi: {
    colour: 'Courage-edged lunar day — competitive spark without war.',
    advice: 'Take one brave micro-step; skip grand battles.',
  },
  Saptami: {
    colour: 'Vitality-forward lunar day — purpose wants motion.',
    advice: 'Align action with a clear why.',
  },
  Ashtami: {
    colour: 'Intensity-deep lunar day — emotions run thicker.',
    advice: 'Go gently with moods; depth without drama.',
  },
  Navami: {
    colour: 'Determination lunar day — finishing heat rises.',
    advice: 'Close a loop that has been waiting.',
  },
  Dashami: {
    colour: 'Duty-clear lunar day — dharma in small acts.',
    advice: 'Do the right small thing you already know.',
  },
  Ekadashi: {
    colour: 'Restraint-subtle lunar day — clarity loves less.',
    advice: 'Fast from one distraction; clarity follows.',
  },
  Dwadashi: {
    colour: 'Nourishment lunar day — replenish after restraint.',
    advice: 'Replenish body and bonds thoughtfully.',
  },
  Trayodashi: {
    colour: 'Refinement lunar day — polish signals care.',
    advice: 'Polish one detail that signals care.',
  },
  Chaturdashi: {
    colour: 'Edge-before-culmination lunar day — tidy loose ends.',
    advice: 'Tidy loose ends; avoid last-minute chaos.',
  },
  Purnima: {
    colour: 'Full-illumination lunar day — visibility peaks.',
    advice: 'Share, celebrate, or complete in the open — then rest.',
  },
  Amavasya: {
    colour: 'Quiet-reset lunar day — seed darkness, not forced launch.',
    advice: 'Release and rest; plant silently, do not force launch.',
  },
};

export const PAKSHA_RULES = {
  Shukla: {
    colour: 'Waxing (bright) fortnight — appetite and visibility tend to grow.',
    advice: 'Lean into starts, visibility, and nourishment more than hard cuts.',
  },
  Krishna: {
    colour: 'Waning (dark) fortnight — editing and release often feel smarter than launching.',
    advice: 'Prefer finishing, releasing, and quiet repair over big openings.',
  },
} as const;

export function tithiRule(tithiName: string, paksha?: 'Shukla' | 'Krishna'): { colour: string; advice: string; pakshaColour?: string; pakshaAdvice?: string } {
  const t = TITHI_RULES[tithiName] || { colour: 'lunar day colour', advice: 'Work with the Moon’s day-tone gently.' };
  const p = paksha ? PAKSHA_RULES[paksha] : undefined;
  return { colour: t.colour, advice: t.advice, pakshaColour: p?.colour, pakshaAdvice: p?.advice };
}
