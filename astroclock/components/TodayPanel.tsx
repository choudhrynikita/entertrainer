
import type { GrahaId } from '@astroclock/lib/astro';
import type { TodayInsights } from '@astroclock/lib/astro/insights';
import { signEn } from '@astroclock/lib/astro/influence';

interface TodayPanelProps {
  insights: TodayInsights;
  onSelectGraha?: (id: GrahaId) => void;
}

function fmtHours(h: number | null): string {
  if (h == null || !Number.isFinite(h)) return '—';
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 48) return `${h.toFixed(1)}h`;
  return `${(h / 24).toFixed(1)}d`;
}

const TONE_BORDER: Record<string, string> = {
  sky: 'border-sky/30',
  soft: 'border-jade/30',
  hard: 'border-rose/40',
  spotlight: 'border-gold/40',
  dasha: 'border-gold/25',
  quiet: 'border-white/10',
};

const CLIMATE_COLOR: Record<string, string> = {
  tense: 'text-rose',
  fluid: 'text-jade',
  peak: 'text-gold',
  quiet: 'text-mist/60',
  volatile: 'text-rose',
};

export function TodayPanel({ insights, onSelectGraha }: TodayPanelProps) {
  const {
    dasha,
    moon,
    lagna,
    retrogrades,
    aspects,
    hrs,
    climate,
    climateNote,
    daySummary,
    dayAdvice,
    cards,
  } = insights;

  return (
    <div className="h-full overflow-y-auto px-3 py-3 space-y-3 pb-6">
      <div className="flex items-end justify-between gap-2 px-0.5">
        <div>
          <h2 className="text-[11px] font-semibold tracking-[0.3em] uppercase text-gold">
            Today
          </h2>
          <p className="text-[10px] text-mist/45 mt-0.5">
            Live sky · rule-based · not fate
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg text-gold leading-none">{hrs}</div>
          <div
            className={`text-[10px] uppercase tracking-wider ${CLIMATE_COLOR[climate] || 'text-mist/60'}`}
          >
            {climate}
          </div>
        </div>
      </div>

      <p className="text-[10px] text-mist/40 -mt-1 px-0.5">{climateNote}</p>

      <article className="ac-chip rounded-xl px-3 py-3 space-y-2 border border-gold/20">
        <h3 className="text-[11px] font-semibold tracking-wide text-gold">
          Today’s summary
        </h3>
        {daySummary.split(/\n\n+/).map((para, i) => (
          <p key={i} className="text-[12px] text-mist/80 leading-[1.65]">
            {para}
          </p>
        ))}
      </article>

      <article className="ac-chip rounded-xl px-3 py-3 space-y-2 border border-jade/25">
        <h3 className="text-[11px] font-semibold tracking-wide text-jade">
          {dayAdvice.title}
        </h3>
        <ul className="space-y-2">
          {dayAdvice.items.map((item, i) => (
            <li
              key={i}
              className="text-[12px] text-mist/80 leading-[1.65] pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-jade/70"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1 pt-0.5">
          {dayAdvice.cites.map((c) => (
            <span
              key={c}
              className="text-[8px] font-mono text-mist/35 border border-white/5 rounded px-1.5 py-0.5"
            >
              {c}
            </span>
          ))}
        </div>
      </article>

      <section className="space-y-2">
        <h3 className="text-[9px] uppercase tracking-[0.2em] text-mist/50 px-0.5">
          Live changes
        </h3>

        <div className="ac-chip rounded-xl px-3 py-2.5 space-y-1">
          <div className="flex justify-between gap-2 text-[10px]">
            <span className="text-mist/50">Period</span>
            <span className="text-gold font-medium">{dasha.maha}</span>
          </div>
          <div className="flex justify-between gap-2 text-[10px]">
            <span className="text-mist/50">Sub-period</span>
            <span className="text-sky font-medium">{dasha.antar}</span>
          </div>
          {dasha.tone && (
            <p className="text-[10px] text-mist/55 leading-snug pt-0.5">
              {dasha.tone}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelectGraha?.('Moon')}
          className="ac-chip rounded-xl px-3 py-2.5 space-y-1.5 w-full text-left"
        >
          <div className="flex justify-between items-baseline gap-2">
            <span className="text-[9px] uppercase tracking-wider text-mist/50">
              Moon
            </span>
            <span className="text-[10px] text-mist/70">
              {moon.waxing ? 'waxing' : 'waning'}
            </span>
          </div>
          <div className="text-sm font-medium">
            {signEn(moon.rashi)}{' '}
            <span className="text-mist/50 font-normal text-xs">·</span>{' '}
            {moon.nakshatra}{' '}
            <span className="text-gold/80 text-xs">p{moon.pada}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-mist/55 font-mono">
            <div>
              → nak{' '}
              <span className="text-mist">{fmtHours(moon.hoursToNextNak)}</span>
            </div>
            <div>
              → sign{' '}
              <span className="text-mist">
                {fmtHours(moon.hoursToNextRashi)}
              </span>
            </div>
          </div>
        </button>

        <div className="ac-chip rounded-xl px-3 py-2.5 space-y-1">
          <div className="flex justify-between items-baseline gap-2">
            <span className="text-[9px] uppercase tracking-wider text-mist/50">
              Rising now
            </span>
            {lagna.changedVs2h && (
              <span className="text-[9px] text-jade">
                flipped vs ~2h · was {signEn(lagna.prevRashi)}
              </span>
            )}
          </div>
          <div className="text-sm font-medium text-jade">
            {signEn(lagna.rashi)}{' '}
            <span className="font-mono text-xs text-mist/70">
              {lagna.degree.toFixed(1)}°
            </span>
          </div>
        </div>

        <div className="ac-chip rounded-xl px-3 py-2.5">
          <div className="text-[9px] uppercase tracking-wider text-mist/50 mb-1.5">
            Retrograde today
          </div>
          {retrogrades.length === 0 ? (
            <p className="text-[11px] text-mist/45">None marked R</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {retrogrades.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectGraha?.(id)}
                  className="ac-chip retro rounded-full px-2 py-0.5 text-[10px]"
                >
                  {id} R
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ac-chip rounded-xl px-3 py-2.5 space-y-1.5">
          <div className="text-[9px] uppercase tracking-wider text-mist/50">
            Aspects forming
          </div>
          {aspects.length === 0 ? (
            <p className="text-[11px] text-mist/45">No tight aspects in orb</p>
          ) : (
            <ul className="space-y-1.5">
              {aspects.map((a) => (
                <li key={`${a.kind}-${a.a}-${a.b}-${a.angle}`}>
                  <button
                    type="button"
                    onClick={() => onSelectGraha?.(a.a)}
                    className="w-full flex items-center justify-between gap-2 text-[11px] text-left rounded-lg hover:bg-white/5 px-1 py-0.5 -mx-1"
                  >
                    <span className="truncate">
                      <span className="text-mist/40 text-[9px] uppercase mr-1">
                        {a.kind === 'natal' ? 'n↔t' : 't↔t'}
                      </span>
                      {a.a}{' '}
                      <span className="text-gold/70">{a.label}</span> {a.b}
                    </span>
                    <span className="font-mono text-[9px] text-mist/45 shrink-0">
                      {a.orb.toFixed(1)}° {a.motion.slice(0, 3)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ac-chip rounded-xl px-3 py-2.5">
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
          <p className="text-[10px] text-mist/45 mt-1.5 capitalize">
            Climate · {climate}
          </p>
        </div>
      </section>

      <section className="space-y-2 pt-1">
        <h3 className="text-[9px] uppercase tracking-[0.2em] text-mist/50 px-0.5">
          Cues · tap for detail
        </h3>
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            disabled={!c.graha || !onSelectGraha}
            onClick={() => c.graha && onSelectGraha?.(c.graha)}
            className={`ac-chip rounded-xl px-3 py-2.5 border w-full text-left ${TONE_BORDER[c.tone] || 'border-white/10'} ${c.graha ? 'hover:bg-white/5' : ''}`}
          >
            <h4 className="text-[11px] font-medium text-mist">{c.title}</h4>
            <p className="text-[10px] text-mist/60 leading-[1.6] mt-1">
              {c.body}
            </p>
          </button>
        ))}
      </section>
    </div>
  );
}
