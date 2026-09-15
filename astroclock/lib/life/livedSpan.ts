/**
 * Precise calendar span since birth — years/months/days via calendar walk,
 * then hours/minutes/seconds from the leftover. Not crude day/365.
 */

export interface LivedSpan {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Total ms (clamped ≥ 0) */
  totalMs: number;
}

export type SpanUnit = keyof Omit<LivedSpan, 'totalMs'>;

const UNITS: SpanUnit[] = [
  'years',
  'months',
  'days',
  'hours',
  'minutes',
  'seconds',
];

export const SPAN_UNITS = UNITS;

export const UNIT_LABEL: Record<SpanUnit, { short: string; long: string }> = {
  years: { short: 'Y', long: 'years' },
  months: { short: 'M', long: 'months' },
  days: { short: 'D', long: 'days' },
  hours: { short: 'h', long: 'hours' },
  minutes: { short: 'm', long: 'minutes' },
  seconds: { short: 's', long: 'seconds' },
};

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/** Add calendar months in UTC, clamping day to end-of-month. */
function addUtcMonths(d: Date, months: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + months;
  const day = d.getUTCDate();
  const ty = y + Math.floor(m / 12);
  const tm = ((m % 12) + 12) % 12;
  const dim = daysInMonth(ty, tm);
  const td = Math.min(day, dim);
  return new Date(
    Date.UTC(
      ty,
      tm,
      td,
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds(),
      d.getUTCMilliseconds(),
    ),
  );
}

/**
 * Calendar-accurate Y/M/D from birth → now, then h/m/s from residual.
 * Both dates interpreted in UTC (matches birthDateObj / BirthConfig).
 * Matches common age arithmetic (month clamp + leftover days).
 */
export function computeLivedSpan(birth: Date, now: Date = new Date()): LivedSpan {
  const totalMs = Math.max(0, now.getTime() - birth.getTime());
  if (totalMs === 0 || now.getTime() < birth.getTime()) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
    };
  }

  let years = now.getUTCFullYear() - birth.getUTCFullYear();
  let anchor = addUtcMonths(birth, years * 12);
  if (anchor.getTime() > now.getTime()) {
    years -= 1;
    anchor = addUtcMonths(birth, years * 12);
  }

  let months = 0;
  // Walk months (max 11)
  while (months < 12) {
    const next = addUtcMonths(anchor, months + 1);
    if (next.getTime() > now.getTime()) break;
    months += 1;
  }
  anchor = addUtcMonths(anchor, months);

  let remMs = now.getTime() - anchor.getTime();
  const dayMs = 24 * 3600 * 1000;
  const days = Math.floor(remMs / dayMs);
  remMs -= days * dayMs;
  const hours = Math.floor(remMs / 3_600_000);
  remMs -= hours * 3_600_000;
  const minutes = Math.floor(remMs / 60_000);
  remMs -= minutes * 60_000;
  const seconds = Math.floor(remMs / 1000);

  return { years, months, days, hours, minutes, seconds, totalMs };
}

/** Pad for chronograph display */
export function padSpan(n: number, width = 2): string {
  return String(Math.max(0, n | 0)).padStart(width, '0');
}
