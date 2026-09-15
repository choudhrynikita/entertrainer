
import { GRAHAS, type GrahaId, type SpeedMap } from '@astroclock/lib/astro';

interface HUDProps {
  maha: string;
  antar: string;
  tithi: string;
  lagna: string;
  speeds: SpeedMap | null;
  selected: GrahaId | null;
  hrs: number;
  live: boolean;
  scrubHours: number;
  scrubLabel: string;
  onSelect: (id: GrahaId) => void;
  onToggleLive: () => void;
  onScrub: (hours: number) => void;
}

export function HUD({
  maha,
  antar,
  tithi,
  lagna,
  speeds,
  selected,
  hrs,
  live,
  scrubHours,
  scrubLabel,
  onSelect,
  onToggleLive,
  onScrub,
}: HUDProps) {
  return (
    <footer className="shrink-0 border-t border-white/10 glass max-h-[42vh] overflow-y-auto">
      <div className="px-3 py-2 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="chip rounded-lg px-2.5 py-2">
            <div className="text-mist/50 uppercase tracking-wider text-[9px]">
              Mahadasha
            </div>
            <div className="font-medium text-gold truncate">{maha}</div>
            <div className="text-mist/50 uppercase tracking-wider text-[9px] mt-1">
              Antardasha
            </div>
            <div className="font-medium text-sky truncate">{antar}</div>
          </div>
          <div className="chip rounded-lg px-2.5 py-2">
            <div className="text-mist/50 uppercase tracking-wider text-[9px]">
              Tithi
            </div>
            <div className="font-medium truncate">{tithi}</div>
            <div className="text-mist/50 uppercase tracking-wider text-[9px] mt-1">
              Lagna
            </div>
            <div className="font-medium text-jade truncate">{lagna}</div>
          </div>
        </div>

        <div
          className="flex gap-1.5 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: 'none' }}
        >
          {GRAHAS.map((g) => {
            const sp = speeds?.[g.id] ?? 0;
            const active = selected === g.id;
            const retro = sp < -0.01;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelect(g.id)}
                className={`chip graha-chip shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium flex items-center gap-1 ${
                  active ? 'active' : ''
                } ${retro ? 'retro' : ''}`}
              >
                <span style={{ color: g.color }}>{g.symbol}</span>
                <span>{g.id.slice(0, 2)}</span>
                <span className="font-mono text-[8px] opacity-70">
                  {sp >= 0 ? 'D' : 'R'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="chip rounded-lg px-2.5 py-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] uppercase tracking-wider text-mist/50">
              Harmonic Resonance
            </span>
            <span className="font-mono text-sm text-gold">{hrs}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="score-bar h-full rounded-full bg-gradient-to-r from-sky via-gold to-jade"
              style={{ width: `${hrs}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pb-1">
          <button
            type="button"
            onClick={onToggleLive}
            className={`chip rounded-lg px-3 py-2 text-[10px] font-semibold tracking-wider uppercase shrink-0 ${
              live ? 'active' : ''
            }`}
          >
            Live Tick
          </button>
          <div className="flex-1 min-w-0">
            <input
              type="range"
              min={-72}
              max={72}
              value={scrubHours}
              step={0.25}
              onChange={(e) => onScrub(Number(e.target.value))}
              className="scrub w-full h-1.5 appearance-none rounded-full bg-white/10 outline-none"
            />
            <div className="flex justify-between text-[8px] text-mist/40 font-mono mt-0.5">
              <span>−3d</span>
              <span>{scrubLabel}</span>
              <span>+3d</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
