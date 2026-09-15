
import { Settings2, UserRound } from 'lucide-react';

export type MainView = 'dial' | 'today';

interface TopBarProps {
  utc: string;
  local: string;
  placeLabel?: string;
  view: MainView;
  onViewChange: (v: MainView) => void;
  profileEnabled: boolean;
  onOpenProfile: () => void;
  onOpenConfig: () => void;
}

export function TopBar({
  utc,
  local,
  placeLabel,
  view,
  onViewChange,
  profileEnabled,
  onOpenProfile,
  onOpenConfig,
}: TopBarProps) {
  return (
    <header className="shrink-0 px-4 pt-3 pb-2 flex items-start justify-between gap-2 border-b border-white/10">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-[11px] font-semibold tracking-[0.35em] text-gold uppercase">
            AstroClock
          </h1>
          <div
            className="inline-flex rounded-full ac-chip p-0.5 text-[9px] uppercase tracking-wider"
            role="tablist"
            aria-label="Main view"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === 'dial'}
              onClick={() => onViewChange('dial')}
              className={`rounded-full px-2.5 py-1 transition ${
                view === 'dial' ? 'bg-gold/20 text-gold' : 'text-mist/50'
              }`}
            >
              Dial
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'today'}
              onClick={() => onViewChange('today')}
              className={`rounded-full px-2.5 py-1 transition ${
                view === 'today' ? 'bg-gold/20 text-gold' : 'text-mist/50'
              }`}
            >
              Today
            </button>
          </div>
        </div>
        <div className="mt-1 font-mono text-[10px] leading-tight text-mist/80 space-y-0.5">
          <div>
            UTC <span className="text-mist">{utc}</span>
          </div>
          <div>
            LOC <span className="text-mist">{local}</span>
          </div>
          {placeLabel ? (
            <div className="text-mist/45 truncate normal-case tracking-normal font-sans text-[9px]">
              @ {placeLabel}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onOpenProfile}
          disabled={!profileEnabled}
          title={
            profileEnabled
              ? 'Natal profile'
              : 'Save birth details to unlock Profile'
          }
          className={`ac-glass rounded-xl px-2.5 py-2 active:scale-95 transition flex items-center gap-1 text-[9px] uppercase tracking-wider ${
            profileEnabled
              ? 'text-gold'
              : 'text-mist/30 opacity-60 cursor-not-allowed'
          }`}
          aria-label="Profile"
        >
          <UserRound className="w-4 h-4" />
          <span>Profile</span>
        </button>
        <button
          type="button"
          onClick={onOpenConfig}
          className="ac-glass rounded-xl p-2.5 active:scale-95 transition"
          aria-label="Config"
        >
          <Settings2 className="w-5 h-5 text-gold" />
        </button>
      </div>
    </header>
  );
}
