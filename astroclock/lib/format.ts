export function formatMsClock(d: Date, utc: boolean): string {
  const h = utc ? d.getUTCHours() : d.getHours();
  const m = utc ? d.getUTCMinutes() : d.getMinutes();
  const s = utc ? d.getUTCSeconds() : d.getSeconds();
  const ms = d.getMilliseconds();
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${p(h)}:${p(m)}:${p(s)}.${p(ms, 3)}`;
}

export function scrubHint(hours: number): string {
  if (Math.abs(hours) < 0.01) return 'now';
  if (Math.abs(hours) < 24) return (hours > 0 ? '+' : '') + hours.toFixed(1) + 'h';
  return (hours > 0 ? '+' : '') + (hours / 24).toFixed(1) + 'd';
}
