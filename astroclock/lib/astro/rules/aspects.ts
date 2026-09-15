export type AspectLabel = 'conjunct' | 'sextile' | 'square' | 'trine' | 'oppose';

export interface AspectRule {
  softHard: 'soft' | 'hard' | 'mixed';
  lifeMeaning: string;
  advice: string;
  natalTransitNote: string;
}

export const ASPECT_RULES: Record<AspectLabel, AspectRule> = {
  conjunct: {
    softHard: 'mixed',
    lifeMeaning: 'Two voices are mixing closely — themes blend and get louder.',
    advice: 'Name whose need is whose before you act on the mix.',
    natalTransitNote: 'A familiar life theme is active for a short window — tend it with one concrete step; don’t panic.',
  },
  sextile: {
    softHard: 'soft',
    lifeMeaning: 'There’s easier cooperation available if you make a small move.',
    advice: 'Reach out or polish something already warm.',
    natalTransitNote: 'A growth edge is lightly available — lean in with one small action, don’t force.',
  },
  square: {
    softHard: 'hard',
    lifeMeaning: 'There’s useful friction that wants precision under pressure.',
    advice: 'Pause before reacting; choose a precise response over drama.',
    natalTransitNote: 'A growth edge is pressed — use technique over theatre.',
  },
  trine: {
    softHard: 'soft',
    lifeMeaning: 'Support is easier to access — you might underuse it if you coast.',
    advice: 'Ship what’s ready and collaborate while the glide lasts.',
    natalTransitNote: 'An easier channel is open — use it for one real deliverable.',
  },
  oppose: {
    softHard: 'hard',
    lifeMeaning: 'It can feel like a polar debate — both sides hold data.',
    advice: 'Hear the other side before you dig in.',
    natalTransitNote: 'A familiar life theme is mirrored back — relate and negotiate; don’t turn it into a fight.',
  },
};

export const ASPECT_GRAHA_FLAVOUR: Record<string, string> = {
  Sun: 'Visibility and vitality are in play — show up warmly and leave room for others.',
  Moon: 'Moods and needs are in play — check care and a soft landing first.',
  Mars: 'Drive and heat are in play — be brave without theatre.',
  Mercury: 'Talk and thinking are in play — aim wit at understanding.',
  Jupiter: 'Meaning and growth are in play — stay curious, not preachy.',
  Venus: 'Bond and harmony are in play — practise kindness on purpose.',
  Saturn: 'Time and accountability are in play — one sober step beats a speech.',
  Rahu: 'Appetite for the new is in play — curiosity with a reality check.',
  Ketu: 'Simplifying and quiet gut clarity are in play — share insight without vanishing.',
};

export const ASPECT_BAND = {
  soft: { lifeMeaning: 'The sky favours cooperation and polish today.', advice: 'Prefer alliance and finish what’s already warm.' },
  hard: { lifeMeaning: 'The sky favours precision under pressure over drama.', advice: 'Tighten scope; pause before sharp turns in conversation.' },
  mixed: { lifeMeaning: 'The day mixes push and ease — alternate honestly.', advice: 'Name friction, then use any soft window to repair.' },
} as const;

export function aspectRule(label: string): AspectRule | null {
  return ASPECT_RULES[label as AspectLabel] ?? null;
}
