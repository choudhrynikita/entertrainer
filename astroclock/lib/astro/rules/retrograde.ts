import type { GrahaId } from '../constants';

export interface RetroRule {
  temperament: string;
  advice: string;
}

export const RETROGRADE_RULES: Record<GrahaId, RetroRule> = {
  Sun: {
    temperament: 'Identity themes turn inward — you may revisit how you want to be seen before pushing outward.',
    advice: 'Rehearse presence privately first; then share the spotlight.',
  },
  Moon: {
    temperament: 'Feelings loop and re-digest — moods want a second look before you decide.',
    advice: 'Journal or talk it through once; don’t force a fresh emotional launch.',
  },
  Mars: {
    temperament: 'Drive turns inward first — strategy before strike.',
    advice: 'Plan the effort, then act once. Skip audience fights.',
  },
  Mercury: {
    temperament: 'Thinking rewrites itself — messages want an edit pass.',
    advice: 'Draft, wait a beat, then send the short clear version.',
  },
  Jupiter: {
    temperament: 'Faith and teachers get an inward review — beliefs want updating.',
    advice: 'Question kindly; learn before you lecture.',
  },
  Venus: {
    temperament: 'Bond and taste get re-evaluated — desire looks in the mirror.',
    advice: 'Choose kindness on purpose; renegotiate harmony out loud.',
  },
  Saturn: {
    temperament: 'Responsibility feels heavier and more internal — time asks for honesty.',
    advice: 'One sober step beats a grand promise. Leave room to breathe.',
  },
  Rahu: {
    temperament: 'You’re more likely to research big changes privately than announce them.',
    advice: 'Investigate options with a timer; wait before publicly committing.',
  },
  Ketu: {
    temperament: 'Release and simplify go quieter — insight arrives as gut clarity, not a speech.',
    advice: 'Drop one extra obligation; keep the lesson and stay in the room.',
  },
};

export function retrogradeRule(graha: GrahaId): RetroRule | null {
  return RETROGRADE_RULES[graha] ?? null;
}
