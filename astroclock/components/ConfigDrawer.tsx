
import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import { PRESETS, type BirthConfig } from '@astroclock/lib/astro';

interface GeocodeHit {
  displayName: string;
  lat: number;
  lon: number;
  type?: string;
}

interface ConfigDrawerProps {
  open: boolean;
  draft: BirthConfig;
  onChange: (next: BirthConfig) => void;
  onClose: () => void;
  onSave: () => void;
  onReset: () => void;
}

const PRESET_ORDER = ['delhi', 'tokyo', 'london', 'newyork', 'sf'] as const;

export function ConfigDrawer({
  open,
  draft,
  onChange,
  onClose,
  onSave,
  onReset,
}: ConfigDrawerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = <K extends keyof BirthConfig>(key: K, value: BirthConfig[K]) => {
    onChange({ ...draft, [key]: value });
  };

  const applyPreset = (key: string) => {
    const p = PRESETS[key];
    if (!p) return;
    onChange({
      ...draft,
      preset: key,
      lat: p.lat,
      lon: p.lon,
      placeLabel: p.label,
    });
    setQuery('');
    setResults([]);
  };

  const selectHit = (hit: GeocodeHit) => {
    const short =
      hit.displayName.split(',').slice(0, 3).join(',').trim() ||
      hit.displayName;
    onChange({
      ...draft,
      preset: 'search',
      lat: hit.lat,
      lon: hit.lon,
      placeLabel: short,
    });
    setQuery('');
    setResults([]);
  };

  const runSearch = useCallback(async (q: string) => {
    abortRef.current?.abort();
    if (q.trim().length < 2) {
      setResults([]);
      setSearching(false);
      setSearchErr(null);
      return;
    }
    const ac = new AbortController();
    abortRef.current = ac;
    setSearching(true);
    setSearchErr(null);
    try {
      const res = await fetch(
        `/api/astroclock/geocode?q=${encodeURIComponent(q.trim())}`,
        { signal: ac.signal },
      );
      if (!res.ok) throw new Error('search failed');
      const data = (await res.json()) as { results?: GeocodeHit[] };
      if (!ac.signal.aborted) {
        setResults(data.results || []);
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setSearchErr('Search unavailable');
      setResults([]);
    } finally {
      if (!ac.signal.aborted) setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open, runSearch]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setSearchErr(null);
      abortRef.current?.abort();
    }
  }, [open]);

  const placeShown =
    draft.placeLabel ||
    PRESETS[draft.preset]?.label ||
    (draft.preset === 'search' || draft.preset === 'manual'
      ? 'Custom'
      : draft.preset);

  return (
    <>
      <div
        className={`absolute inset-0 bg-black/50 z-40 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`config-drawer absolute top-0 right-0 bottom-0 w-[88%] max-w-sm z-50 glass overflow-y-auto ${
          open ? 'open' : ''
        }`}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gold">
              Identity
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <label className="block text-xs space-y-1">
            <span className="text-mist/60">Name</span>
            <input
              type="text"
              placeholder="Your name"
              maxLength={40}
              value={draft.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-gold/50"
            />
          </label>

          <label className="block text-xs space-y-1">
            <span className="text-mist/60">Birth date</span>
            <input
              type="date"
              value={draft.date}
              onChange={(e) => set('date', e.target.value)}
              className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-gold/50 font-mono"
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            <label className="block text-xs space-y-1">
              <span className="text-mist/60">Hour</span>
              <input
                type="number"
                min={0}
                max={23}
                value={draft.h}
                onChange={(e) => set('h', Number(e.target.value))}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-2 py-2.5 text-sm outline-none focus:border-gold/50 font-mono"
              />
            </label>
            <label className="block text-xs space-y-1">
              <span className="text-mist/60">Min</span>
              <input
                type="number"
                min={0}
                max={59}
                value={draft.m}
                onChange={(e) => set('m', Number(e.target.value))}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-2 py-2.5 text-sm outline-none focus:border-gold/50 font-mono"
              />
            </label>
            <label className="block text-xs space-y-1">
              <span className="text-mist/60">Sec</span>
              <input
                type="number"
                min={0}
                max={59}
                value={draft.s}
                onChange={(e) => set('s', Number(e.target.value))}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-2 py-2.5 text-sm outline-none focus:border-gold/50 font-mono"
              />
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-mist/60">Birth place</span>
              {placeShown && (
                <span className="text-[10px] text-gold/80 flex items-center gap-1 max-w-[60%] truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {placeShown}
                </span>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mist/40" />
              <input
                type="search"
                placeholder="Search any place worldwide…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                className="w-full rounded-lg bg-black/40 border border-white/10 pl-9 pr-9 py-2.5 text-sm outline-none focus:border-gold/50"
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gold animate-spin" />
              )}
            </div>
            {searchErr && (
              <p className="text-[10px] text-rose">{searchErr}</p>
            )}
            {results.length > 0 && (
              <ul className="rounded-lg border border-white/10 bg-black/60 max-h-44 overflow-y-auto divide-y divide-white/5">
                {results.map((hit) => (
                  <li key={`${hit.lat},${hit.lon},${hit.displayName}`}>
                    <button
                      type="button"
                      onClick={() => selectHit(hit)}
                      className="w-full text-left px-3 py-2.5 hover:bg-white/5 active:bg-gold/10 transition"
                    >
                      <div className="text-[11px] text-mist leading-snug line-clamp-2">
                        {hit.displayName}
                      </div>
                      <div className="font-mono text-[9px] text-mist/40 mt-0.5">
                        {hit.lat.toFixed(4)}°, {hit.lon.toFixed(4)}°
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {PRESET_ORDER.map((key) => {
                const p = PRESETS[key];
                const active = draft.preset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPreset(key)}
                    className={`ac-chip rounded-full px-2.5 py-1 text-[10px] ${
                      active ? 'active' : ''
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...draft,
                    preset: 'manual',
                    placeLabel: draft.placeLabel || 'Manual',
                  })
                }
                className={`ac-chip rounded-full px-2.5 py-1 text-[10px] ${
                  draft.preset === 'manual' || draft.preset === 'search'
                    ? 'active'
                    : ''
                }`}
              >
                Manual
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="block text-xs space-y-1">
              <span className="text-mist/60">Latitude°</span>
              <input
                type="number"
                step="0.0001"
                value={draft.lat}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    lat: Number(e.target.value),
                    preset:
                      draft.preset === 'search' ? 'search' : 'manual',
                  })
                }
                className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-gold/50 font-mono"
              />
            </label>
            <label className="block text-xs space-y-1">
              <span className="text-mist/60">Longitude°</span>
              <input
                type="number"
                step="0.0001"
                value={draft.lon}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    lon: Number(e.target.value),
                    preset:
                      draft.preset === 'search' ? 'search' : 'manual',
                  })
                }
                className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-gold/50 font-mono"
              />
            </label>
          </div>

          <p className="text-[10px] text-mist/40 leading-relaxed">
            Demo birth (Delhi 1990-01-01 12:00) until you save. Place search via
            OpenStreetMap Nominatim. Sidereal Lahiri · Whole-sign houses · Dial:
            Mesha at top (0°). Birth H:M:S treated as UTC for offline
            determinism.
          </p>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onSave}
              className="flex-1 rounded-xl bg-gold/90 text-ink font-semibold text-sm py-3 active:scale-[0.98] transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-xl ac-chip px-4 py-3 text-sm text-mist/70"
            >
              Reset
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
