/**
 * Day message bank keyed by ClimateLabel (+ optional stretch overlay).
 * Pick deterministically from date + climate — never Math.random on render.
 */
import type { ClimateLabel } from '@astroclock/lib/astro/insights';
import type { DayStretch } from '@astroclock/lib/astro/hourQuality';
import { hashString, utcDayKey } from './lifeFacts';

export type DayMessageCategory =
  | ClimateLabel
  | 'good'
  | 'mid'
  | 'hard';

/** Maps climate → primary message category (stretch can soft-override). */
export function categoryFromClimate(
  climate: ClimateLabel,
  stretch?: DayStretch,
): DayMessageCategory {
  // Prefer climate axes; stretch only tips peak/fluid toward good tone when set.
  if (stretch === 'good' && (climate === 'peak' || climate === 'fluid')) {
    return 'good';
  }
  if (stretch === 'hard' && (climate === 'tense' || climate === 'volatile')) {
    return 'hard';
  }
  if (stretch === 'mid' && climate === 'quiet') {
    return 'mid';
  }
  return climate;
}

const TENSE: string[] = [
  'Pressure’s up — one clear next step beats a perfect plan.',
  'If the day feels tight, shrink the goal and finish that.',
  'You don’t have to win the whole day. Win the next hour.',
  'Hard edges soften when you name what you can actually control.',
  'Breathe once, then move. Motion beats rumination today.',
  'Protect your focus like it’s scarce — because it is.',
  'A short walk and a glass of water still count as strategy.',
  'Say the hard thing kindly, then stop explaining.',
  'You’re allowed to do less and still be solid.',
  'Pick one friction and sand it down. Leave the rest.',
];

const FLUID: string[] = [
  'Things can move — ride the ease without scattering it.',
  'Good flow day: finish one thread before opening three.',
  'Your timing’s friendlier than usual. Use it on something real.',
  'Connect, then commit. Charm without a follow-through fades.',
  'Let conversations lead, but write the decision down.',
  'Momentum likes a finish line. Give it one by evening.',
  'Share the load — people are more available than you think.',
  'Stay light on your feet, heavy on the promise you already made.',
  'Creativity’s online. Ship a small version today.',
  'Say yes to the useful invitation; soft-no the shiny distraction.',
];

const PEAK: string[] = [
  'Energy’s high — point it at one worthy target.',
  'You’re lit. Don’t burn the house; light the path.',
  'Visibility’s up. Put your name on work you actually care about.',
  'Lead with warmth, not volume. People hear both.',
  'This is a good day to ask. Clarity loves courage.',
  'Celebrate a small win out loud — it compounds.',
  'Channel the heat into craft, not into proving a point.',
  'Show up early for yourself. The rest follows.',
  'Make the call you’ve been rehearsing in your head.',
  'Peak days still need water, food, and an end time.',
];

const QUIET: string[] = [
  'Soft day — permission to go gentle without going nowhere.',
  'Quiet isn’t empty. It’s room to hear yourself.',
  'Do the maintenance tasks your future self will thank you for.',
  'Rest is productive when you stop apologising for it.',
  'A calm hour of deep work beats a loud day of half-starts.',
  'Tend one relationship with a short, honest check-in.',
  'Let the inbox wait; clear one private corner first.',
  'Low volume, high care. That’s enough for today.',
  'Read, walk, or cook something simple. Rebuild the base.',
  'You don’t need a breakthrough. You need a steady page.',
];

const VOLATILE: string[] = [
  'Sky’s jumpy — hold your centre; don’t chase every spark.',
  'Expect plot twists. Pack patience, not a hard script.',
  'If plans wobble, keep the values and rewrite the steps.',
  'Don’t text angry. Draft, sleep one hour, then send.',
  'Volatility loves company. Choose calm people today.',
  'Anchor in body: food, stretch, sleep window. Then decide.',
  'You’re not the weather. You’re the person walking through it.',
  'Small routines are life rafts when the day surges.',
  'Say “not now” to drama that isn’t yours.',
  'Survive first, optimise later. That’s wisdom, not quitting.',
];

const GOOD: string[] = [
  'Green-light stretch — push the thing you’ve been ready for.',
  'Favourable hours ahead. Book the hard conversation inside them.',
  'Luck likes preparation. You’ve got both today — use them.',
  'Make the generous move while the window’s open.',
  'Good stretch: teach someone one thing you already know.',
];

const MID: string[] = [
  'Even keel — steady output beats heroic bursts.',
  'Middle gear is fine. Keep the rhythm, skip the drama.',
  'Neither peak nor pit — a workhorse day. Honour it.',
  'Do the boring important thing. That’s the unlock.',
  'Balanced hours: split focus between people and tasks fairly.',
];

const HARD: string[] = [
  'Rough stretch — lower the bar, keep the integrity.',
  'Hard hours pass. Don’t make permanent choices in temporary weather.',
  'Ask for help sooner than pride wants.',
  'One kind act toward yourself still moves the needle.',
  'Endure cleanly. Tomorrow inherits what you don’t wreck today.',
];

export const DAY_MESSAGES: Record<DayMessageCategory, string[]> = {
  tense: TENSE,
  fluid: FLUID,
  peak: PEAK,
  quiet: QUIET,
  volatile: VOLATILE,
  good: GOOD,
  mid: MID,
  hard: HARD,
};

export interface DayMessagePick {
  category: DayMessageCategory;
  text: string;
  climate: ClimateLabel;
  stretch?: DayStretch;
}

export function pickDayMessage(
  climate: ClimateLabel,
  day: Date = new Date(),
  stretch?: DayStretch,
): DayMessagePick {
  const category = categoryFromClimate(climate, stretch);
  const bank = DAY_MESSAGES[category];
  const key = `${utcDayKey(day)}|${category}|${climate}`;
  const idx = hashString(key) % bank.length;
  return {
    category,
    text: bank[idx],
    climate,
    stretch,
  };
}

/** All visitor-visible day-message lines (for PR / copy gate) */
export function allDayMessageStrings(): string[] {
  return (Object.keys(DAY_MESSAGES) as DayMessageCategory[]).flatMap(
    (k) => DAY_MESSAGES[k],
  );
}

export function dayMessageBankSize(): number {
  return allDayMessageStrings().length;
}
