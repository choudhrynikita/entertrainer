import {
  DEMO_BIRTH,
  PRESETS,
  STORAGE_KEY,
  type BirthConfig,
} from '@astroclock/lib/astro/constants';

export function loadConfig(): BirthConfig {
  if (typeof window === 'undefined') return { ...DEMO_BIRTH };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEMO_BIRTH };
    const data = JSON.parse(raw) as Partial<BirthConfig>;
    if (data && data.date) {
      const merged: BirthConfig = { ...DEMO_BIRTH, ...data, isDemo: false };
      if (!merged.placeLabel) {
        const preset = PRESETS[merged.preset];
        merged.placeLabel = preset?.label || undefined;
      }
      return merged;
    }
  } catch {
    /* ignore */
  }
  return { ...DEMO_BIRTH };
}

export function saveConfig(birth: BirthConfig): void {
  const payload = {
    name: birth.name || '',
    date: birth.date,
    h: +birth.h,
    m: +birth.m,
    s: +birth.s,
    preset: birth.preset,
    lat: +birth.lat,
    lon: +birth.lon,
    placeLabel: birth.placeLabel || '',
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function birthDateObj(b: BirthConfig): Date {
  const [Y, Mo, D] = b.date.split('-').map(Number);
  return new Date(Date.UTC(Y, Mo - 1, D, +b.h, +b.m, +b.s));
}
