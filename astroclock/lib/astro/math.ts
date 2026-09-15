import { DEG, RAD } from './constants';

/** Julian Day Number (UTC) from Date — Meeus */
export function julianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const D =
    date.getUTCDate() +
    (date.getUTCHours() +
      (date.getUTCMinutes() +
        (date.getUTCSeconds() + date.getUTCMilliseconds() / 1000) / 60) /
        60) /
      24;
  let Y = y;
  let M = m;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
}

/** Centuries from J2000.0 */
export function centuriesJ2000(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

/** Greenwich Mean Sidereal Time in hours (Meeus approx) */
export function gmst(jd: number): number {
  const T = centuriesJ2000(jd);
  let gst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  gst = ((gst % 360) + 360) % 360;
  return gst / 15;
}

/** Local Sidereal Time in hours */
export function lst(jd: number, lonDeg: number): number {
  return (((gmst(jd) + lonDeg / 15) % 24) + 24) % 24;
}

/** Mean obliquity of ecliptic (degrees) — IAU approx */
export function obliquity(jd: number): number {
  const T = centuriesJ2000(jd);
  return 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
}

/**
 * Lahiri ayanamsha (degrees).
 * ~24.20° in 2025 with linear/quadratic fit.
 */
export function lahiriAyanamsha(jd: number): number {
  const T = centuriesJ2000(jd);
  return 23.852708 + 1.39697148 * T + 0.0003086 * T * T;
}

export function norm360(x: number): number {
  return ((x % 360) + 360) % 360;
}

export function shortestArc(a: number, b: number): number {
  let d = norm360(a - b);
  if (d > 180) d -= 360;
  return d;
}

export function absShortest(a: number, b: number): number {
  return Math.abs(shortestArc(a, b));
}

/** Tropical → sidereal */
export function toSidereal(tropLon: number, jd: number): number {
  return norm360(tropLon - lahiriAyanamsha(jd));
}

/**
 * Ascendant (tropical) from LST hours & latitude, then convert to sidereal.
 */
export function ascendant(
  lstHours: number,
  latDeg: number,
  jd: number,
): { tropical: number; sidereal: number } {
  const eps = obliquity(jd) * DEG;
  const ramc = lstHours * 15 * DEG;
  const phi = latDeg * DEG;
  const y = Math.cos(ramc);
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  let ascTrop = Math.atan2(y, x) * RAD;
  ascTrop = norm360(ascTrop);
  return {
    tropical: ascTrop,
    sidereal: toSidereal(ascTrop, jd),
  };
}

export function clamp(n: number, a: number, b: number): number {
  const v = Number.isFinite(n) ? n : a;
  return Math.max(a, Math.min(b, v));
}
