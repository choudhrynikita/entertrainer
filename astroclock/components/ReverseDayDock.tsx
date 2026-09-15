/**
 * Compact reverse-face dock: weekday/date + one moment-precise advice line.
 * Shown under the metal/plain clock — not the geeky Mahadasha HUD.
 */
import { useMemo } from 'react';
import type { ClimateLabel, TodayInsights } from '@astroclock/lib/astro/insights';
import { pickMomentAdvice } from '@astroclock/lib/life/momentAdvice';

const CLIMATE_TONE: Record<ClimateLabel, string> = {
  peak: 'text-jade',
  fluid: 'text-sky',
  quiet: 'text-mist/70',
  tense: 'text-amber-200/90',
  volatile: 'text-rose-300/90',
};

interface ReverseDayDockProps {
  simTime: number;
  insights: TodayInsights;
  tithi: string;
  interactive: boolean;
  onSky: () => void;
}

export function ReverseDayDock({
  simTime,
  insights,
  interactive,
  onSky,
}: ReverseDayDockProps) {
  const dateLine = useMemo(() => {
    const d = new Date(simTime);
    const tz = 'Asia/Kolkata';
    const weekday = d.toLocaleString('en-IN', { weekday: 'long', timeZone: tz });
    const month = d.toLocaleString('en-IN', { month: 'short', timeZone: tz });
    const day = Number(d.toLocaleString('en-IN', { day: 'numeric', timeZone: tz }));
    const year = Number(d.toLocaleString('en-IN', { year: 'numeric', timeZone: tz }));
    const now = new Date();
    const sameDay =
      d.toLocaleDateString('en-CA', { timeZone: tz }) ===
      now.toLocaleDateString('en-CA', { timeZone: tz });
    return {
      title: sameDay ? `Today · ${weekday}` : weekday,
      sub: `${month} ${day}, ${year}`,
    };
  }, [simTime]);

  const advice = useMemo(
    () => pickMomentAdvice(simTime, insights),
    [simTime, insights],
  );

  return (
    <footer
      className="ac-hud ac-reverse-dock shrink-0 border-t border-white/10 ac-glass"
      data-ac-reverse-dock
    >
      <div className="ac-hud-stage px-2.5 py-1.5 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-mist/90 truncate leading-snug">
              {dateLine.title}
            </div>
            <div className="text-[10px] text-mist/50 font-mono tracking-wide">
              {dateLine.sub}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (interactive) onSky();
            }}
            disabled={!interactive}
            className="ac-chip rounded-full px-3 py-1.5 min-h-8 text-[10px] uppercase tracking-wider text-gold border border-gold/35 shrink-0 pointer-events-auto"
          >
            Sky dial
          </button>
        </div>

        <div className="ac-moment-advice min-w-0">
          <p className="text-[12px] leading-snug text-mist/90 font-medium">
            {advice.text}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`text-[9px] uppercase tracking-wider ${CLIMATE_TONE[advice.climate]}`}
            >
              {advice.climateTag}
            </span>
            <span className="text-mist/30 text-[9px]">·</span>
            <span className="text-[9px] text-mist/45 uppercase tracking-wider">
              This hour
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
