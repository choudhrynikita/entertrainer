
import { Settings2, UserRound } from 'lucide-react';

export type MainView = 'dial' | 'today';

interface TopBarProps {
  utc: string;
  local: string;
  placeLabel?: string;
  view: MainView;
  onViewChange: (v: MainView) => void;
  youEnabled: boolean;
  onOpenYou: () => void;
  onOpenConfig: () => void;
}

export function TopBar({
  utc,
  local,
  placeLabel,
  view,
  onViewChange,
  youEnabled,
  onOpenYou,
  onOpenConfig,
}: TopBarProps) {
  return (
    <header className="ac-topbar shrink-0 px-4 pt-3 pb-2 flex items-start justify-between gap-2 border-b border-white/10">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-[12px] font-semibold tracking-[0.3em] text-gold uppercase">
            AstroClock
          </h1>
          <div
            className="inline-flex items-center rounded-full ac-seg p-0.5 text-[10px] uppercase tracking-wider min-h-10"
            role="tablist"
            aria-label="Main view"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === 'dial'}
              onClick={() => onViewChange('dial')}
              className={`rounded-full px-3.5 min-h-9 transition ${
                view === 'dial' ? 'ac-seg-active' : 'ac-seg-idle'
              }`}
            >
              Dial
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'today'}
              onClick={() => onViewChange('today')}
              className={`rounded-full px-3.5 min-h-9 transition ${
                view === 'today' ? 'ac-seg-active' : 'ac-seg-idle'
              }`}
            >
              Today
            </button>
          </div>
        </div>
        <div className="mt-1.5 font-mono text-[11px] leading-snug text-mist/80 space-y-0.5">
          <div>
            UTC <span className="text-mist">{utc}</span>
          </div>
          <div>
            LOC <span className="text-mist">{local}</span>
          </div>
          {placeLabel ? (
            <div className="text-mist/45 truncate normal-case tracking-normal font-sans text-[10px]">
              @ {placeLabel}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onOpenYou}
          disabled={!youEnabled}
          title={
            youEnabled
              ? 'You — lived time and day note'
              : 'Save birth details to unlock You'
          }
          className={`ac-glass ac-touch rounded-xl px-2.5 py-2 active:scale-95 transition flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider ${
            youEnabled
              ? 'text-gold'
              : 'text-mist/30 opacity-60 cursor-not-allowed'
          }`}
          aria-label="You"
        >
          <UserRound className="w-4 h-4" />
          <span>You</span>
        </button>
        <button
          type="button"
          onClick={onOpenConfig}
          className="ac-glass ac-touch rounded-xl p-2.5 active:scale-95 transition flex items-center justify-center"
          aria-label="Config"
        >
          <Settings2 className="w-5 h-5 text-gold" />
        </button>
      </div>
    </header>
  );
}
