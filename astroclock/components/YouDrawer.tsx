import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { NatalProfile } from '@astroclock/lib/astro/profile';
import type { ClimateLabel } from '@astroclock/lib/astro/insights';
import type { DayStretch } from '@astroclock/lib/astro/hourQuality';
import { signEn } from '@astroclock/lib/astro/influence';
import type { BirthConfig } from '@astroclock/lib/astro/constants';
import { birthDateObj } from '@astroclock/lib/storage';
import {
  SPAN_UNITS,
  UNIT_LABEL,
  computeLivedSpan,
  padSpan,
  type LivedSpan,
  type SpanUnit,
} from '@astroclock/lib/life/livedSpan';
import { factForUnit } from '@astroclock/lib/life/lifeFacts';
import { pickDayMessage } from '@astroclock/lib/life/dayMessages';

interface YouDrawerProps {
  open: boolean;
  birth: BirthConfig;
  profile: NatalProfile | null;
  isDemo: boolean;
  climate: ClimateLabel;
  stretch?: DayStretch;
  /** Prefer live now; pass sim date only if You should follow scrub */
  messageDate?: Date;
  onClose: () => void;
  onOpenConfig: () => void;
}

function useLivedSpan(birth: Date, active: boolean): LivedSpan {
  const [span, setSpan] = useState(() => computeLivedSpan(birth, new Date()));

  useEffect(() => {
    if (!active) return;
    const tick = () => setSpan(computeLivedSpan(birth, new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [birth, active]);

  return span;
}

export function YouDrawer({
  open,
  birth,
  profile,
  isDemo,
  climate,
  stretch,
  messageDate,
  onClose,
  onOpenConfig,
}: YouDrawerProps) {
  const birthDt = useMemo(() => birthDateObj(birth), [birth]);
  const span = useLivedSpan(birthDt, open);
  const [expandedUnit, setExpandedUnit] = useState<SpanUnit | null>(null);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) {
      setExpandedUnit(null);
      setInsightsOpen(false);
      setOpenSections({});
    }
  }, [open]);

  const dayKey = (messageDate ?? new Date()).toISOString().slice(0, 10);
  const dayRef = useMemo(() => {
    if (messageDate) return messageDate;
    // Noon UTC on calendar day — stable for fact/message hashing
    return new Date(`${dayKey}T12:00:00.000Z`);
  }, [messageDate, dayKey]);

  const dayMsg = useMemo(
    () => pickDayMessage(climate, dayRef, stretch),
    [climate, stretch, dayRef],
  );

  const salt = birth.date || 'demo';

  const expandedFact = useMemo(() => {
    if (!expandedUnit) return null;
    return factForUnit(expandedUnit, dayRef, salt);
  }, [expandedUnit, dayRef, salt]);

  const toggleUnit = (u: SpanUnit) => {
    setExpandedUnit((cur) => (cur === u ? null : u));
  };

  const toggleSection = (id: string) => {
    setOpenSections((s) => ({ ...s, [id]: !s[id] }));
  };

  const displayName =
    profile?.name || (isDemo ? 'Demo' : birth.name || 'You');

  return (
    <>
      <div
        className={`absolute inset-0 ac-scrim z-[55] transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`absolute inset-x-0 bottom-0 top-[8%] z-[60] glass panel-solid rounded-t-2xl overflow-hidden flex flex-col drawer ${
          open ? 'open' : 'pointer-events-none'
        }`}
        role="dialog"
        aria-label="You"
      >
        <div className="shrink-0 flex items-start justify-between gap-3 px-4 pt-4 pb-2 border-b border-white/10">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.25em] text-gold/80">
              You
            </p>
            <h2 className="text-base font-semibold text-mist truncate mt-0.5">
              {displayName}
            </h2>
            {profile?.birthSummary ? (
              <p className="text-[10px] text-mist/45 font-mono mt-0.5 leading-snug">
                {profile.birthSummary}
              </p>
            ) : isDemo ? (
              <p className="text-[10px] text-mist/45 mt-0.5 leading-snug">
                Demo birth · save yours in Identity
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 shrink-0 min-h-11 min-w-11 flex items-center justify-center"
            aria-label="Close You"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-6 pb-10">
          {/* Hero chronograph */}
          <section className="ac-chrono" aria-label="Time lived since birth">
            <p className="text-[9px] uppercase tracking-[0.28em] text-mist/40 text-center mb-3">
              Lived
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {SPAN_UNITS.map((unit) => {
                const val = span[unit];
                const wide = unit === 'years' ? 2 : 2;
                const active = expandedUnit === unit;
                return (
                  <button
                    type="button"
                    key={unit}
                    onClick={() => toggleUnit(unit)}
                    className={`ac-chrono-cell rounded-xl px-2 py-3 text-center transition active:scale-[0.98] ${
                      active ? 'ac-chrono-cell-on' : ''
                    }`}
                    aria-expanded={active}
                    aria-label={`${val} ${UNIT_LABEL[unit].long}. Tap for a fact.`}
                  >
                    <div className="font-mono text-[1.35rem] leading-none text-gold tabular-nums tracking-tight">
                      {unit === 'years'
                        ? String(val)
                        : padSpan(val, wide)}
                    </div>
                    <div className="mt-1.5 text-[8px] uppercase tracking-[0.2em] text-mist/45">
                      {UNIT_LABEL[unit].long}
                    </div>
                  </button>
                );
              })}
            </div>

            {expandedUnit && expandedFact && (
              <div
                className="mt-3 ac-chip rounded-xl px-3.5 py-3 fade-in border border-gold/25"
                role="status"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold/80 mb-1.5">
                  {UNIT_LABEL[expandedUnit].long}
                </p>
                <p className="text-[13px] text-mist/85 leading-[1.6]">
                  {expandedFact.text}
                </p>
                {expandedFact.approx ? (
                  <p className="text-[9px] text-mist/35 mt-2">
                    Approximate · order of magnitude
                  </p>
                ) : null}
              </div>
            )}
          </section>

          {/* Day message */}
          <section className="ac-day-msg rounded-xl px-4 py-4" aria-label="Day message">
            <p className="text-[9px] uppercase tracking-[0.25em] text-mist/40 mb-2">
              How you might feel
            </p>
            <p className="text-[14px] text-mist/90 leading-[1.65] font-medium">
              {dayMsg.text}
            </p>
            <p className="text-[9px] text-mist/30 mt-2.5 font-mono uppercase tracking-wider">
              {dayMsg.climate}
              {dayMsg.stretch ? ` · ${dayMsg.stretch}` : ''}
            </p>
          </section>

          {/* More insights — collapsed */}
          <section className="space-y-2">
            <button
              type="button"
              onClick={() => setInsightsOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-2 ac-chip rounded-xl px-3.5 py-3 min-h-11"
              aria-expanded={insightsOpen}
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold/90">
                More insights
              </span>
              <ChevronDown
                className={`w-4 h-4 text-mist/50 transition-transform ${
                  insightsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {insightsOpen && (
              <div className="space-y-3 fade-in pt-1">
                {isDemo || !profile ? (
                  <div className="ac-chip rounded-xl px-4 py-6 text-center space-y-3">
                    <p className="text-sm text-mist/80">
                      Save your birth details to unlock a placement-accurate
                      reading.
                    </p>
                    <p className="text-[10px] text-mist/45 leading-relaxed">
                      Readings come from your rising sign, Moon, Sun, and planet
                      houses — rule tables, not chat fluff.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenConfig();
                      }}
                      className="rounded-xl bg-gold/90 text-ink font-semibold text-sm px-5 py-2.5 min-h-11"
                    >
                      Open Identity
                    </button>
                  </div>
                ) : (
                  <>
                    <InsightRow
                      id="summary"
                      title="How you come across"
                      open={!!openSections.summary}
                      onToggle={() => toggleSection('summary')}
                    >
                      {profile.summary.split(/\n\n+/).map((para, i) => (
                        <p
                          key={i}
                          className="text-[12px] text-mist/80 leading-[1.65]"
                        >
                          {para}
                        </p>
                      ))}
                    </InsightRow>

                    <InsightRow
                      id="advice"
                      title={profile.advice.title}
                      open={!!openSections.advice}
                      onToggle={() => toggleSection('advice')}
                    >
                      <ul className="space-y-2">
                        {profile.advice.items.map((item, i) => (
                          <li
                            key={i}
                            className="text-[12px] text-mist/80 leading-[1.65] pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-jade/70"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </InsightRow>

                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div className="ac-chip rounded-lg px-2 py-2">
                        <div className="text-mist/45 uppercase tracking-wider text-[8px]">
                          Rising
                        </div>
                        <div className="text-jade font-medium">
                          {signEn(profile.lagna.rashi)}
                        </div>
                        <div className="font-mono text-mist/50">
                          {profile.lagna.degree.toFixed(1)}° · {profile.lagna.lord}
                        </div>
                      </div>
                      <div className="ac-chip rounded-lg px-2 py-2">
                        <div className="text-mist/45 uppercase tracking-wider text-[8px]">
                          Moon
                        </div>
                        <div className="font-medium">
                          {signEn(profile.moon.rashi)}
                        </div>
                        <div className="text-mist/50 truncate">
                          {profile.moon.nakshatra} p{profile.moon.pada}
                        </div>
                      </div>
                      <div className="ac-chip rounded-lg px-2 py-2">
                        <div className="text-mist/45 uppercase tracking-wider text-[8px]">
                          Sun
                        </div>
                        <div className="text-gold font-medium">
                          {signEn(profile.sun.rashi)}
                        </div>
                        <div className="text-mist/50 truncate">
                          {profile.sun.nakshatra}
                        </div>
                      </div>
                    </div>

                    <InsightRow
                      id="themes"
                      title="Dominant themes"
                      open={!!openSections.themes}
                      onToggle={() => toggleSection('themes')}
                    >
                      <ul className="space-y-0.5">
                        {profile.dominant.map((d) => (
                          <li key={d} className="text-[11px] text-mist/75">
                            · {d}
                          </li>
                        ))}
                      </ul>
                    </InsightRow>

                    {profile.sections.map((sec) => (
                      <InsightRow
                        key={sec.id}
                        id={sec.id}
                        title={sec.title}
                        open={!!openSections[sec.id]}
                        onToggle={() => toggleSection(sec.id)}
                      >
                        <p className="text-[11px] text-mist/75 leading-[1.65]">
                          {sec.body}
                        </p>
                      </InsightRow>
                    ))}

                    <p className="text-[9px] text-mist/30 leading-relaxed px-1">
                      Deterministic reading from whole-sign houses + Lahiri
                      sidereal. Approximate ephemeris — for reflection, not
                      professional judgment.
                    </p>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </aside>
    </>
  );
}

function InsightRow({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <article className="ac-chip rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-3 min-h-11 text-left"
        aria-expanded={open}
        aria-controls={`you-insight-${id}`}
      >
        <h3 className="text-[11px] font-semibold tracking-wide text-gold">
          {title}
        </h3>
        <ChevronDown
          className={`w-3.5 h-3.5 text-mist/40 shrink-0 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div
          id={`you-insight-${id}`}
          className="px-3.5 pb-3 space-y-2 border-t border-white/5 pt-2"
        >
          {children}
        </div>
      )}
    </article>
  );
}
