/**
 * Compact reverse-face dock: weekday/date + mini day-stats (deterministic insights).
 * Shown under the metal/plain clock — not the geeky Mahadasha HUD.
 */
import { useMemo } from 'react';
import {
  STRETCH_COLOR,
  coalesceStretchSegments,
  sampleLocalDayQualities,
  stretchFromClimate,
  type DayStretch,
} from '@astroclock/lib/astro/hourQuality';
import type { ClimateLabel, TodayInsights } from '@astroclock/lib/astro/insights';

const CLIMATE_EN: Record<ClimateLabel, string> = {
  peak: 'Peak flow',
  fluid: 'Smooth',
  quiet: 'Quiet',
  tense: 'Tense',
  volatile: 'Volatile',
};

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

function aspectSoftHard(insights: TodayInsights): { soft: number; hard: number } {
  let soft = 0;
  let hard = 0;
  for (const a of insights.aspects) {
    if (a.kind === 'natal') continue;
    if (a.angle === 60 || a.angle === 120 || a.angle === 0) soft++;
    else hard++;
  }
  return { soft, hard };
}

function stretchHours(simMs: number): Record<DayStretch, number> {
  const segs = coalesceStretchSegments(sampleLocalDayQualities(simMs, 24));
  const out: Record<DayStretch, number> = { good: 0, mid: 0, hard: 0 };
  for (const s of segs) {
    out[s.stretch] += Math.max(0, s.endHour - s.startHour);
  }
  return out;
}

export function ReverseDayDock({
  simTime,
  insights,
  tithi,
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

  const hours = useMemo(() => stretchHours(simTime), [simTime]);
  const totalH = Math.max(1, hours.good + hours.mid + hours.hard);
  const { soft, hard } = useMemo(() => aspectSoftHard(insights), [insights]);
  const climate = insights.climate;
  const stretch = stretchFromClimate(climate);
  const harmonic = Math.round(insights.hrs);

  const segs = useMemo(() => {
    return coalesceStretchSegments(sampleLocalDayQualities(simTime, 24));
  }, [simTime]);

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

        {/* Mini 24h stretch arc */}
        <div
          className="ac-day-mini-arc flex h-2 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10"
          aria-hidden
        >
          {segs.map((s, i) => {
            const w = ((s.endHour - s.startHour) / 24) * 100;
            return (
              <div
                key={`${s.stretch}-${s.startHour}-${i}`}
                style={{
                  width: `${w}%`,
                  background: STRETCH_COLOR[s.stretch],
                  opacity: s.stretch === 'mid' ? 0.85 : 0.95,
                }}
                title={`${s.stretch} ${s.startHour}–${s.endHour}h`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[8px] text-mist/40 uppercase tracking-wider px-0.5">
          <span>0h</span>
          <span className="text-mist/55">
            <span style={{ color: STRETCH_COLOR.good }}>Good</span>
            {' · '}
            <span style={{ color: STRETCH_COLOR.mid }}>Mid</span>
            {' · '}
            <span style={{ color: STRETCH_COLOR.hard }}>Hard</span>
          </span>
          <span>24h</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`ac-chip rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider ${CLIMATE_TONE[climate]}`}
          >
            {CLIMATE_EN[climate]}
            <span className="text-mist/35 normal-case tracking-normal ml-1">
              · {stretch}
            </span>
          </span>
          <span className="ac-chip rounded-full px-2 py-0.5 text-[9px] text-mist/75 font-mono">
            Harmonic {harmonic}
          </span>
          <span className="ac-chip rounded-full px-2 py-0.5 text-[9px] text-mist/75">
            Soft {soft}
            <span className="text-mist/35 mx-0.5">·</span>
            Hard {hard}
          </span>
          <span className="ac-chip rounded-full px-2 py-0.5 text-[9px] text-mist/70 truncate max-w-[42%]">
            {tithi}
          </span>
        </div>

        <div className="flex gap-1.5 text-[8px] font-mono text-mist/40">
          <span style={{ color: STRETCH_COLOR.good }}>{hours.good}h good</span>
          <span className="text-mist/25">·</span>
          <span style={{ color: STRETCH_COLOR.mid }}>{hours.mid}h mid</span>
          <span className="text-mist/25">·</span>
          <span style={{ color: STRETCH_COLOR.hard }}>{hours.hard}h hard</span>
          <span className="text-mist/25">·</span>
          <span>{Math.round((hours.good / totalH) * 100)}% ease</span>
        </div>
      </div>
    </footer>
  );
}
