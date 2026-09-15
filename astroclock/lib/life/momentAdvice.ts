/**
 * One best phrase for *this* sim moment — reverse dock, not day-stats.
 * Deterministic from climate-at-hour + aspect pressure + soft lunar/period tone.
 * WhatsApp-to-a-friend voice; actionable in the next hour.
 */
import type { ClimateLabel, TodayInsights } from '@astroclock/lib/astro/insights';
import { qualityAt, type DayStretch } from '@astroclock/lib/astro/hourQuality';
import { hashString } from './lifeFacts';

/** Outcome buckets mapped to real in-app climates / pressure. */
export type MomentAdviceCategory =
  | 'peak_push'
  | 'fluid_finish'
  | 'quiet_tend'
  | 'tense_trim'
  | 'volatile_hold'
  | 'soft_ask'
  | 'hard_brace'
  | 'wax_open'
  | 'wane_close';

export interface MomentAdvicePick {
  category: MomentAdviceCategory;
  text: string;
  climate: ClimateLabel;
  stretch: DayStretch;
  climateTag: string;
}

const CLIMATE_TAG: Record<ClimateLabel, string> = {
  peak: 'Peak flow',
  fluid: 'Smooth',
  quiet: 'Quiet',
  tense: 'Tense',
  volatile: 'Volatile',
};

const PEAK_PUSH: string[] = [
  'Energy’s here — send the thing you’ve been polishing, then stop fiddling.',
  'Ask for the meeting in the next hour. Visibility’s on your side.',
  'Pick one worthy target and give it a clean 40 minutes. No second tabs.',
  'Put your name on work you actually care about before the heat cools.',
  'Make the call you’ve rehearsed. Keep it under five minutes.',
  'Ship a small version. Peak days still need an end time.',
  'Lead with one clear ask, not a speech. People hear both.',
  'Book the hard conversation inside this window — don’t save it for tonight.',
  'Celebrate one small win out loud, then move to the next brick.',
  'Point the heat at craft, not at proving a point in chat.',
];

const FLUID_FINISH: string[] = [
  'Flow’s friendly — close one open thread before you start three.',
  'Reply to the useful person first. Soft-no the shiny distraction.',
  'Write the decision down while the conversation’s still warm.',
  'Finish the draft sitting in your notes. Momentum likes a finish line.',
  'Share one load with someone who said they’re free. Follow through.',
  'Connect, then commit — charm without a next step fades by evening.',
  'Use the ease on something real: a send, a book, a fixed bug.',
  'Stay light on your feet, heavy on the promise you already made.',
  'Creativity’s online. Cut one paragraph and hit send.',
  'Give the day one finish line by dinner. Protect it.',
];

const QUIET_TEND: string[] = [
  'Soft hour — clear one private corner before you open the inbox.',
  'Do the boring important thing. That’s the unlock today.',
  'A calm block of deep work beats another half-start.',
  'Tend one relationship with a short, honest check-in.',
  'Rest without apologising, then do one maintenance task.',
  'Read, walk, or cook something simple. Rebuild the base.',
  'Low volume, high care. Finish the admin you’ve been dodging.',
  'Let the loud stuff wait. Protect this quiet for one real page.',
  'Water, stretch, then one focused task. Skip the heroic plan.',
  'You don’t need a breakthrough. You need a steady next step.',
];

const TENSE_TRIM: string[] = [
  'Pressure’s up — shrink the goal and finish that smaller thing.',
  'One clear next step beats a perfect plan. Name it out loud.',
  'Protect your focus like it’s scarce. Mute one noisy thread.',
  'Say the hard thing kindly, then stop explaining.',
  'Win the next hour, not the whole day.',
  'Pick one friction and sand it down. Leave the rest.',
  'A short walk and water still count as strategy right now.',
  'You’re allowed to do less and still be solid.',
  'Breathe once, then move. Motion beats rumination this hour.',
  'If it feels tight, cut the agenda to three bullets max.',
];

const VOLATILE_HOLD: string[] = [
  'Sky’s jumpy — don’t send angry. Draft, wait twenty minutes, then decide.',
  'Hold your centre. Skip drama that isn’t yours.',
  'Anchor in body first: food, stretch, then one decision.',
  'Expect a wobble. Keep the values; rewrite the steps.',
  'Small routine now: water, calendar check, one inbox pass.',
  'Say “not now” to the spark that wants a fight.',
  'Survive first, optimise later. That’s wisdom, not quitting.',
  'Choose calm people for the next conversation.',
  'Don’t make a permanent choice in temporary weather.',
  'Pack patience, not a hard script. Plans can flex.',
];

const SOFT_ASK: string[] = [
  'Soft links are open — ask for the favour you’ve been delaying.',
  'Good hour to reconnect. Send the short “thinking of you” note.',
  'Pitch the collaboration while goodwill’s thick.',
  'Invite someone into the problem. Two heads beat one stuck loop.',
  'Schedule the coffee or call for this week while yeses come easy.',
  'Thank someone specifically. Soft sky likes concrete gratitude.',
  'Offer help once, clearly. Don’t over-promise.',
  'Trade a favour for a favour. Keep it small and real.',
  'Ask the clarifying question you’ve been sitting on.',
  'Share credit out loud. Relationships compound on hours like this.',
];

const HARD_BRACE: string[] = [
  'Hard edges in the sky — delay big bets; do the reversible work.',
  'Don’t argue the principle in chat. Save it for a calmer slot.',
  'Lower the bar, keep the integrity. Ship the safe version.',
  'Ask for help sooner than pride wants.',
  'One kind act toward yourself still moves the needle.',
  'Endure cleanly. Don’t wreck tomorrow’s options tonight.',
  'If tempers rise, step out for five minutes before you reply.',
  'Stick to facts and next steps. Skip the courtroom speech.',
  'Protect sleep and food before you renegotiate anything major.',
  'Hard hour: checklist mode. Tick three small boxes and stop.',
];

const WAX_OPEN: string[] = [
  'Moon’s building — start the thing you’d rather keep as a fantasy.',
  'Good stretch to plant a habit: one rep, not a manifesto.',
  'Say yes to a useful beginning. Soft-no the endless research.',
  'Open the doc. First ugly paragraph still counts.',
  'Invite progress, not perfection. Waxing likes motion.',
  'Tell one person the plan so it leaves your head.',
  'Add one concrete milestone to the calendar for this week.',
  'Buy the ticket / book the slot / block the hour. Make it real.',
  'Start the conversation you’ve been outlining in notes.',
  'Small public commitment beats another private rehearsal.',
];

const WANE_CLOSE: string[] = [
  'Moon’s easing — close loops. Archive, unsubscribe, send the overdue reply.',
  'Good hour to finish, not to launch. Tie one ribbon.',
  'Drop one commitment that only lives as guilt.',
  'Clean the desk or the desktop. Closing needs a clear surface.',
  'Return the borrowed thing. Pay the small bill. Clear friction.',
  'Write the wrap-up note while the chapter’s still fresh.',
  'Cancel or reschedule the meeting that shouldn’t happen.',
  'Trim the list. Keep three; park the rest for next week.',
  'End one half-finished chat with a clear next step or a kind no.',
  'Waning sky: harvest what’s done. Don’t plant three new trees.',
];

export const MOMENT_ADVICE: Record<MomentAdviceCategory, string[]> = {
  peak_push: PEAK_PUSH,
  fluid_finish: FLUID_FINISH,
  quiet_tend: QUIET_TEND,
  tense_trim: TENSE_TRIM,
  volatile_hold: VOLATILE_HOLD,
  soft_ask: SOFT_ASK,
  hard_brace: HARD_BRACE,
  wax_open: WAX_OPEN,
  wane_close: WANE_CLOSE,
};

function aspectSoftHard(insights: TodayInsights): { soft: number; hard: number } {
  let soft = 0;
  let hard = 0;
  for (const a of insights.aspects) {
    if (a.kind === 'natal') continue;
    if (a.angle === 60 || a.angle === 120 || a.angle === 0) soft++;
    else hard++;
  }
  return { soft, hard };
}

/** Map climate + pressure + lunar tone → outcome category. */
export function categoryForMoment(
  climate: ClimateLabel,
  soft: number,
  hard: number,
  waxing: boolean,
  hour: number,
): MomentAdviceCategory {
  const pressure = soft - hard;
  // Strong aspect skew can override climate for this hour.
  if (pressure >= 2 && (climate === 'fluid' || climate === 'peak' || climate === 'quiet')) {
    return 'soft_ask';
  }
  if (pressure <= -2 && (climate === 'tense' || climate === 'volatile' || climate === 'quiet')) {
    return 'hard_brace';
  }
  // Quiet hours lean lunar open/close on the half-day.
  if (climate === 'quiet') {
    if (hour >= 5 && hour < 14) return waxing ? 'wax_open' : 'quiet_tend';
    return waxing ? 'quiet_tend' : 'wane_close';
  }
  switch (climate) {
    case 'peak':
      return 'peak_push';
    case 'fluid':
      return waxing ? 'fluid_finish' : hour >= 18 ? 'wane_close' : 'fluid_finish';
    case 'tense':
      return 'tense_trim';
    case 'volatile':
      return 'volatile_hold';
    default:
      return 'quiet_tend';
  }
}

export function pickMomentAdvice(
  simTime: number,
  insights: TodayInsights,
): MomentAdvicePick {
  const when = new Date(simTime);
  const q = qualityAt(when);
  const { soft, hard } = aspectSoftHard(insights);
  const hour = when.getHours();
  const waxing = insights.moon?.waxing ?? true;
  const category = categoryForMoment(q.climate, soft, hard, waxing, hour);
  const bank = MOMENT_ADVICE[category];
  const dashaSalt = `${insights.dasha?.maha || ''}/${insights.dasha?.antar || ''}`;
  // Bucket to ~20 min so advice stays stable while scrubbing slowly, flips on real shifts.
  const slot = Math.floor(when.getTime() / (20 * 60 * 1000));
  const key = `${slot}|${category}|${q.climate}|${soft}|${hard}|${dashaSalt}|${waxing ? 'w' : 'k'}`;
  const idx = hashString(key) % bank.length;
  return {
    category,
    text: bank[idx],
    climate: q.climate,
    stretch: q.stretch,
    climateTag: CLIMATE_TAG[q.climate],
  };
}

/** All visitor-visible moment-advice lines (for PR / copy gate). */
export function allMomentAdviceStrings(): string[] {
  return (Object.keys(MOMENT_ADVICE) as MomentAdviceCategory[]).flatMap(
    (k) => MOMENT_ADVICE[k],
  );
}

export function momentAdviceBankSize(): number {
  return allMomentAdviceStrings().length;
}
