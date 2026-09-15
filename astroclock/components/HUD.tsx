
import { GRAHAS, type GrahaId, type SpeedMap } from '@astroclock/lib/astro';
import type { DialFace } from '@astroclock/lib/flip/types';

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
  face?: DialFace;
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
  face = 'sky',
  onSelect,
  onToggleLive,
  onScrub,
}: HUDProps) {
  const locked =
    face === 'flipping-to-bauhaus' || face === 'flipping-to-sky';

  return (
    <footer
      className="ac-hud shrink-0 border-t border-white/10 ac-glass max-h-[32vh] overflow-y-auto"
      aria-hidden={locked}
      data-face={face}
    >
      <div className="ac-hud-stage px-2.5 py-1.5 space-y-1.5">
        <div
          className="grid grid-cols-2 gap-1.5 text-[11px]"
        >
          <div className="ac-chip rounded-lg px-2 py-1.5">
            <div className="text-mist/55 uppercase tracking-wider text-[9px]">
              Mahadasha
            </div>
            <div className="font-medium text-gold truncate text-[12px] leading-snug">
              {maha}
            </div>
            <div className="text-mist/55 uppercase tracking-wider text-[9px] mt-1">
              Antardasha
            </div>
            <div className="font-medium text-sky truncate text-[12px] leading-snug">
              {antar}
            </div>
          </div>
          <div className="ac-chip rounded-lg px-2 py-1.5">
            <div className="text-mist/55 uppercase tracking-wider text-[9px]">
              Tithi
            </div>
            <div className="font-medium truncate text-[12px] leading-snug">
              {tithi}
            </div>
            <div className="text-mist/55 uppercase tracking-wider text-[9px] mt-1">
              Lagna
            </div>
            <div className="font-medium text-jade truncate text-[12px] leading-snug">
              {lagna}
            </div>
          </div>
        </div>

        <div
          className="flex gap-1 overflow-x-auto"
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
                disabled={locked}
                className={`ac-chip graha-chip shrink-0 rounded-full px-2 py-1 min-h-8 text-[10px] font-medium flex items-center gap-0.5 ${
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

        <div
          className="ac-chip rounded-lg px-2 py-1.5"
        >
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[9px] uppercase tracking-wider text-mist/55">
              Harmonic Resonance
            </span>
            <span className="font-mono text-sm text-gold">{hrs}</span>
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="score-bar h-full rounded-full bg-gradient-to-r from-sky via-gold to-jade"
              style={{ width: `${hrs}%` }}
            />
          </div>
        </div>

        <div
          className="flex items-center gap-1.5"
        >
          <button
            type="button"
            onClick={onToggleLive}
            disabled={locked}
            className={`ac-chip rounded-lg px-2.5 py-2 min-h-10 text-[10px] font-semibold tracking-wider uppercase shrink-0 ${
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
              disabled={locked}
              onChange={(e) => onScrub(Number(e.target.value))}
              className="scrub w-full h-2 appearance-none rounded-full bg-white/10 outline-none"
            />
            <div className="flex justify-between text-[8px] text-mist/45 font-mono mt-0.5">
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
