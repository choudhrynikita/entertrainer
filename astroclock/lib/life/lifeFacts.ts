/**
 * Curated "fantastic facts" for each lived-span unit.
 * Orders of magnitude are science-ish; marked approx where needed.
 * Rotation is deterministic by UTC day + unit — no Math.random in render.
 */
import type { SpanUnit } from './livedSpan';

export interface LifeFact {
  text: string;
  /** True when numbers are order-of-magnitude / population averages */
  approx?: boolean;
}

const YEARS: LifeFact[] = [
  {
    text: 'In one year your heart beats about 35–40 million times (resting adult pace).',
    approx: true,
  },
  {
    text: 'Earth finishes one full orbit of the Sun — about 940 million km of path.',
    approx: true,
  },
  {
    text: 'You take roughly 8 million breaths in a year at quiet waking rates.',
    approx: true,
  },
  {
    text: 'Your hair grows about 15 cm on average — a slow, stubborn tape measure.',
    approx: true,
  },
  {
    text: 'The Moon completes about 13 orbits of Earth while you age one year.',
    approx: true,
  },
  {
    text: 'Light from the Sun takes ~8 minutes to reach you — every day of that year.',
    approx: true,
  },
  {
    text: 'A healthy adult walks the equivalent of a few thousand kilometres if active.',
    approx: true,
  },
  {
    text: 'Saturn advances only about 12° along the ecliptic in a calendar year.',
    approx: true,
  },
  {
    text: 'Your skeleton fully remakes itself over roughly a decade — one year is a slice.',
    approx: true,
  },
  {
    text: 'Global sea level rises on the order of a few millimetres in a typical year.',
    approx: true,
  },
  {
    text: 'You blink several million times a year without noticing most of them.',
    approx: true,
  },
  {
    text: 'Jupiter moves about 30° — one zodiac sign — in roughly a year.',
    approx: true,
  },
];

const MONTHS: LifeFact[] = [
  {
    text: 'The Moon’s phases repeat about every 29.5 days — close to a calendar month.',
    approx: true,
  },
  {
    text: 'Your skin surface renews on a multi-week cycle; a month covers much of it.',
    approx: true,
  },
  {
    text: 'A typical adult heart does on the order of 3 million beats in a month.',
    approx: true,
  },
  {
    text: 'Earth travels roughly 80 million km along its orbit in 30 days.',
    approx: true,
  },
  {
    text: 'Fingernails grow about 3–4 mm in a month on average.',
    approx: true,
  },
  {
    text: 'The ISS completes on the order of 450 orbits of Earth in a month.',
    approx: true,
  },
  {
    text: 'You produce litres of saliva — enough to fill a small water cooler jug.',
    approx: true,
  },
  {
    text: 'A full lunar cycle and a bit more fit inside most calendar months.',
    approx: true,
  },
  {
    text: 'Mercury can zip through a whole sign of the sky in under a month when direct.',
    approx: true,
  },
  {
    text: 'Many houseplants put on a visible flush of new leaves in a single month.',
    approx: true,
  },
  {
    text: 'Your red blood cells live about 4 months — a month is a quarter of that life.',
    approx: true,
  },
  {
    text: 'Tides rise and fall twice a day; a month holds about 60 high tides.',
    approx: true,
  },
];

const DAYS: LifeFact[] = [
  {
    text: 'Earth spins once — you travel with it at ~1670 km/h at the equator.',
    approx: true,
  },
  {
    text: 'You blink roughly 15,000–20,000 times in a waking day.',
    approx: true,
  },
  {
    text: 'Your heart beats about 100,000 times in 24 hours at a calm average.',
    approx: true,
  },
  {
    text: 'You take on the order of 20,000 breaths in a day.',
    approx: true,
  },
  {
    text: 'Light could circle Earth about 7.5 times in one second — a day holds 86,400 of those.',
    approx: true,
  },
  {
    text: 'The Moon drifts about 13° east against the stars each day.',
    approx: true,
  },
  {
    text: 'A healthy gut microbiome turns over continuously — a day reshapes its mix.',
    approx: true,
  },
  {
    text: 'Your liver can process a surprising load of metabolites before tomorrow.',
    approx: true,
  },
  {
    text: 'Sunlight takes eight minutes to arrive; every sunrise is already “old” light.',
    approx: true,
  },
  {
    text: 'Most adults make about 1–2 litres of urine in a day — boring, vital plumbing.',
    approx: true,
  },
  {
    text: 'Neurons fire on the order of trillions of spikes across a busy day.',
    approx: true,
  },
  {
    text: 'The International Space Station passes overhead many times while you sleep and wake.',
    approx: true,
  },
];

const HOURS: LifeFact[] = [
  {
    text: 'Your heart beats roughly 4,000–5,000 times in a quiet hour.',
    approx: true,
  },
  {
    text: 'Earth rotates 15° of longitude — one time zone’s worth — each hour.',
    approx: true,
  },
  {
    text: 'You blink several hundred to a thousand times in an hour of open eyes.',
    approx: true,
  },
  {
    text: 'Light from the Moon (reflected Sun) is about 1.3 seconds old when you see it.',
    approx: true,
  },
  {
    text: 'A commercial jet can cover ~800–900 km in an hour in cruise.',
    approx: true,
  },
  {
    text: 'Your kidneys filter on the order of 7 litres of blood in an hour.',
    approx: true,
  },
  {
    text: 'The ISS travels about 27,600 km in one hour — roughly once around Earth.',
    approx: true,
  },
  {
    text: 'A slow walk covers about 4–5 km; an hour of walking is a real errand.',
    approx: true,
  },
  {
    text: 'Bees can visit hundreds of flowers in an hour of good forage.',
    approx: true,
  },
  {
    text: 'Your stomach can empty a light meal in roughly an hour or two.',
    approx: true,
  },
  {
    text: 'Sound in air travels about 1,235 km in an hour — thunder’s slow cousin.',
    approx: true,
  },
  {
    text: 'A typical adult brain uses about 20 W continuously — a dim bulb, all hour.',
    approx: true,
  },
];

const MINUTES: LifeFact[] = [
  {
    text: 'Your heart beats about 60–100 times in a resting minute.',
    approx: true,
  },
  {
    text: 'You blink roughly 15–20 times in a minute of conversation.',
    approx: true,
  },
  {
    text: 'Light travels about 18 million km in one minute — to the Sun and a bit more.',
    approx: true,
  },
  {
    text: 'Earth rotates about 0.25° in a minute — 27 km at the equator.',
    approx: true,
  },
  {
    text: 'A healthy adult takes about 12–20 breaths in a calm minute.',
    approx: true,
  },
  {
    text: 'Blood can lap the body on the order of once a minute at rest.',
    approx: true,
  },
  {
    text: 'A hummingbird’s wings may beat thousands of times in a minute.',
    approx: true,
  },
  {
    text: 'The ISS covers roughly 460 km in sixty seconds.',
    approx: true,
  },
  {
    text: 'Neurons can fire dozens of times per second — thousands of spikes a minute.',
    approx: true,
  },
  {
    text: 'A kettle of water can go from tap-cold to boil in a few minutes on a stove.',
    approx: true,
  },
  {
    text: 'Your eyes make tiny microsaccades several times a second — hundreds a minute.',
    approx: true,
  },
  {
    text: 'Raindrops fall on the order of a few metres per second — a minute of weather.',
    approx: true,
  },
];

const SECONDS: LifeFact[] = [
  {
    text: 'Light travels ~300,000 km — enough to reach the Moon in ~1.3 seconds.',
    approx: true,
  },
  {
    text: 'Your heart completes roughly one beat in under a second at rest.',
    approx: true,
  },
  {
    text: 'A nerve signal can cross from spine to toe in a few hundredths of a second.',
    approx: true,
  },
  {
    text: 'Earth moves ~30 km along its orbit every second.',
    approx: true,
  },
  {
    text: 'Sound in air covers about 343 metres in one second at room temperature.',
    approx: true,
  },
  {
    text: 'A blink lasts about 100–400 milliseconds — a fraction of a second.',
    approx: true,
  },
  {
    text: 'The ISS travels ~7.6 km in a single second.',
    approx: true,
  },
  {
    text: 'A photon from a nearby lamp hits your eye almost “now” — nanoseconds late.',
    approx: true,
  },
  {
    text: 'A housefly’s wings can beat hundreds of times in one second.',
    approx: true,
  },
  {
    text: 'Your auditory system can tell apart clicks a few milliseconds apart.',
    approx: true,
  },
  {
    text: 'Lightning heats air to tens of thousands of °C in a split second.',
    approx: true,
  },
  {
    text: 'A camera shutter at 1/1000 s freezes motion your eye would smear.',
    approx: true,
  },
];

export const LIFE_FACTS: Record<SpanUnit, LifeFact[]> = {
  years: YEARS,
  months: MONTHS,
  days: DAYS,
  hours: HOURS,
  minutes: MINUTES,
  seconds: SECONDS,
};

/** Simple stable hash for deterministic picks */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** UTC calendar day key YYYY-MM-DD */
export function utcDayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Pick today’s fact for a unit. Same day+unit → same fact.
 * Optional salt (e.g. birth date) diversifies across people without flicker.
 */
export function factForUnit(
  unit: SpanUnit,
  day: Date = new Date(),
  salt = '',
): LifeFact {
  const bank = LIFE_FACTS[unit];
  const key = `${utcDayKey(day)}|${unit}|${salt}`;
  const idx = hashString(key) % bank.length;
  return bank[idx];
}

/** All visitor-visible fact strings (for PR / copy gate) */
export function allFactStrings(): string[] {
  return (Object.keys(LIFE_FACTS) as SpanUnit[]).flatMap((u) =>
    LIFE_FACTS[u].map((f) => f.text),
  );
}
