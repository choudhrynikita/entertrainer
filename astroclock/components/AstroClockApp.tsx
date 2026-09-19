
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEMO_BIRTH,
  GRAHAS,
  PRESETS,
  type BirthConfig,
  type GrahaId,
  type LonMap,
  clamp,
  computeInfluence,
  computePlanets,
  computeTithi,
  computeTodayInsights,
  computeNatalProfile,
  stretchFromClimate,
  harmonicScore,
  julianDay,
  lonMapFromPlanets,
  nakshatraInfo,
  norm360,
  rashiName,
  shortestArc,
  signEn,
  vimshottari,
  wholeSignHouse,
} from '@astroclock/lib/astro';
import { birthDateObj, clearConfig, loadConfig, saveConfig } from '@astroclock/lib/storage';
import { formatMsClock, scrubHint } from '@astroclock/lib/format';
import { TopBar, type MainView } from './TopBar';
import { ClockCanvas, type FrameCache } from './ClockCanvas';
import { SkyClock3D } from './SkyClock3D';
import { MetalClock3D } from './MetalClock3D';
import { HUD } from './HUD';
import { ReverseDayDock } from './ReverseDayDock';
import {
  FLIP_MS,
  isFlipping,
  showGeekyHud,
  showReverseDock,
  type DialFace,
} from '@astroclock/lib/flip/types';
import { ConfigDrawer } from './ConfigDrawer';
import { PlanetDrawer, type PlanetDetail } from './PlanetDrawer';
import { TodayPanel } from './TodayPanel';
import { YouDrawer } from './YouDrawer';
import { WelcomeTour } from './WelcomeTour';

const LERP_MS = 700;

export function AstroClockApp() {
  const [birth, setBirth] = useState<BirthConfig>({ ...DEMO_BIRTH });
  const [draft, setDraft] = useState<BirthConfig>({ ...DEMO_BIRTH });
  const [hydrated, setHydrated] = useState(false);
  /** Flat 2D sky fallback (reduced-motion or ?sky=2d). Default = volumetric 3D. */
  const [useFlatSky, setUseFlatSky] = useState(false);
  const [live, setLive] = useState(true);
  const [scrubHours, setScrubHours] = useState(0);
  const [simTime, setSimTime] = useState(() => Date.now());
  const [selected, setSelected] = useState<GrahaId | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [youOpen, setYouOpen] = useState(false);
  const [view, setView] = useState<MainView>('dial');
  const [face, setFace] = useState<DialFace>('sky');
  const flipTimerRef = useRef<number | null>(null);
  const [skyCanvas, setSkyCanvas] = useState<HTMLCanvasElement | null>(null);
  const [visible, setVisible] = useState(true);
  const [natalLons, setNatalLons] = useState<LonMap | null>(null);
  const [natalLerp, setNatalLerp] = useState(1);
  const [hrsDisplay, setHrsDisplay] = useState(0);
  const [utc, setUtc] = useState('--:--:--.---');
  const [local, setLocal] = useState('--:--:--.---');
  const [maha, setMaha] = useState('—');
  const [antar, setAntar] = useState('—');
  const [tithi, setTithi] = useState('—');
  const [lagna, setLagna] = useState('—');
  const [speeds, setSpeeds] = useState<FrameCache['speeds'] | null>(null);
  const [detail, setDetail] = useState<PlanetDetail | null>(null);

  const natalLerpFrom = useRef<LonMap | null>(null);
  const natalLerpTo = useRef<LonMap | null>(null);
  const natalLerpStart = useRef(0);
  const lastHud = useRef(0);
  const cacheRef = useRef<FrameCache | null>(null);

  const recomputeNatal = useCallback((b: BirthConfig, animate: boolean) => {
    const bd = birthDateObj(b);
    const jd = julianDay(bd);
    const pl = computePlanets(jd);
    const next = lonMapFromPlanets(pl);

    if (animate && natalLons) {
      natalLerpFrom.current = { ...natalLons };
      natalLerpTo.current = next;
      natalLerpStart.current = performance.now();
      setNatalLerp(0);
    } else {
      setNatalLons(next);
      setNatalLerp(1);
      natalLerpFrom.current = null;
      natalLerpTo.current = null;
    }
  }, [natalLons]);

  useEffect(() => {
    const cfg = loadConfig();
    setBirth(cfg);
    setDraft(cfg);
    setHydrated(true);
    const bd = birthDateObj(cfg);
    const jd = julianDay(bd);
    setNatalLons(lonMapFromPlanets(computePlanets(jd)));
    setNatalLerp(1);
    try {
      const q = new URLSearchParams(window.location.search);
      const force2d = q.get('sky') === '2d';
      const force3d = q.get('sky') === '3d';
      const reduce =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      /* Default = volumetric 3D. Flat only for ?sky=2d or reduced-motion
         (unless ?sky=3d overrides — headless audits / force-volumetric). */
      setUseFlatSky(force2d || (reduce && !force3d));
    } catch {
      setUseFlatSky(false);
    }
  }, []);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (view !== 'dial') {
      if (flipTimerRef.current != null) {
        window.clearTimeout(flipTimerRef.current);
        flipTimerRef.current = null;
      }
      setFace('sky');
    }
  }, [view]);

  useEffect(() => {
    return () => {
      if (flipTimerRef.current != null) {
        window.clearTimeout(flipTimerRef.current);
        flipTimerRef.current = null;
      }
    };
  }, []);

  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const runCleanFlip = useCallback(
    (to: 'bauhaus' | 'sky') => {
      if (flipTimerRef.current != null) {
        window.clearTimeout(flipTimerRef.current);
        flipTimerRef.current = null;
      }
      if (prefersReducedMotion()) {
        setFace(to);
        return;
      }
      setFace(to === 'bauhaus' ? 'flipping-to-bauhaus' : 'flipping-to-sky');
      /* Nudge canvases after layout so both faces paint before mid-flip. */
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
      flipTimerRef.current = window.setTimeout(() => {
        flipTimerRef.current = null;
        setFace(to);
      }, FLIP_MS);
    },
    [prefersReducedMotion],
  );

  const flipToBauhaus = useCallback(() => {
    if (face !== 'sky') return;
    runCleanFlip('bauhaus');
  }, [face, runCleanFlip]);

  const flipToSky = useCallback(() => {
    if (face !== 'bauhaus') return;
    runCleanFlip('sky');
  }, [face, runCleanFlip]);

  /* Keep TopBar clocks alive when dial canvas is not painting. */
  useEffect(() => {
    if (view === 'dial') return;
    const tick = () => {
      const d = new Date(simTime);
      setUtc(formatMsClock(d, true));
      setLocal(formatMsClock(d, false));
    };
    tick();
    if (!live || !visible) return;
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [view, simTime, live, visible]);

  /* After display:none → block / flip, force layout so canvases recover size. */
  useEffect(() => {
    if (view !== 'dial') return;
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    return () => cancelAnimationFrame(id);
  }, [view, face]);

  useEffect(() => {
    if (!live || !visible) return;
    let id = 0;
    const tick = () => {
      setSimTime(Date.now() + scrubHours * 3600 * 1000);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [live, scrubHours, visible]);

  useEffect(() => {
    if (natalLerp >= 1 || !natalLerpFrom.current || !natalLerpTo.current) return;
    let id = 0;
    const tick = () => {
      const elapsed = performance.now() - natalLerpStart.current;
      const t = Math.min(1, elapsed / LERP_MS);
      if (t >= 1 && natalLerpTo.current) {
        setNatalLons(natalLerpTo.current);
        setNatalLerp(1);
        natalLerpFrom.current = null;
        natalLerpTo.current = null;
        return;
      }
      const s = t * t * (3 - 2 * t);
      const from = natalLerpFrom.current!;
      const to = natalLerpTo.current!;
      const out = {} as LonMap;
      for (const g of GRAHAS) {
        const a = from[g.id];
        const b = to[g.id];
        const d = shortestArc(b, a);
        out[g.id] = norm360(a + d * s);
      }
      setNatalLons(out);
      setNatalLerp(t);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [natalLerp]);

  const currentNatal = natalLons;

  const placeLabel = useMemo(() => {
    if (birth.placeLabel) return birth.placeLabel;
    return PRESETS[birth.preset]?.label;
  }, [birth.placeLabel, birth.preset]);

  const todayInsights = useMemo(() => {
    return computeTodayInsights(new Date(simTime), birth, currentNatal);
  }, [simTime, birth, currentNatal]);

  const natalProfile = useMemo(() => {
    if (birth.isDemo) return null;
    return computeNatalProfile(birth, new Date(simTime));
  }, [birth, simTime]);

  const openDetailFor = useCallback(
    (id: GrahaId, cache: FrameCache) => {
      const g = GRAHAS.find((x) => x.id === id)!;
      const lon = cache.planets[id].sidereal;
      const nak = nakshatraInfo(lon);
      const house = wholeSignHouse(lon, cache.asc.sidereal);
      const sp = cache.speeds[id];
      const rashi = rashiName(lon);

      const natalG = natalProfile?.grahas.find((x) => x.id === id);
      const aspectHits = todayInsights.aspects
        .filter((a) => a.a === id || a.b === id)
        .map((a) => ({
          other: (a.a === id ? a.b : a.a) as GrahaId,
          label: a.label,
          orb: a.orb,
          motion: a.motion,
          kind: a.kind,
        }));

      const influence = computeInfluence({
        graha: id,
        rashi,
        house,
        nakshatra: nak.name,
        speed: sp,
        natal: natalG
          ? { rashi: natalG.rashi, house: natalG.house }
          : null,
        aspects: aspectHits,
        dasha: {
          maha: todayInsights.dasha.maha,
          antar: todayInsights.dasha.antar,
        },
        isDemo: !!birth.isDemo,
      });

      setDetail({
        graha: g,
        lon,
        rashi: `${signEn(rashi)} ${(lon % 30).toFixed(2)}°`,
        nak: nak.name,
        pada: nak.pada,
        house,
        speed: sp,
        influence,
      });
      setDetailOpen(true);
    },
    [birth.isDemo, natalProfile, todayInsights],
  );

  const handleSelect = useCallback(
    (id: GrahaId) => {
      if (selected === id) {
        setSelected(null);
        setDetailOpen(false);
      } else {
        setSelected(id);
        if (cacheRef.current) openDetailFor(id, cacheRef.current);
      }
    },
    [selected, openDetailFor],
  );

  const onFrame = useCallback(
    (cache: FrameCache) => {
      cacheRef.current = cache;
      const now = performance.now();
      if (now - lastHud.current < 50) return;
      lastHud.current = now;

      setUtc(formatMsClock(cache.date, true));
      setLocal(formatMsClock(cache.date, false));

      const th = computeTithi(
        cache.planets.Moon.sidereal,
        cache.planets.Sun.sidereal,
      );
      setTithi(`${th.num}. ${th.label}`);

      const lagDeg = cache.asc.sidereal % 30;
      setLagna(`${rashiName(cache.asc.sidereal)} ${lagDeg.toFixed(1)}°`);

      try {
        const dasha = vimshottari(birthDateObj(birth), cache.date);
        setMaha(dasha.maha + (birth.isDemo ? ' ·demo' : ''));
        setAntar(dasha.antar);
      } catch {
        setMaha('—');
        setAntar('—');
      }

      setSpeeds(cache.speeds);

      const hrs = harmonicScore(cache.planets);
      setHrsDisplay((prev) => {
        const next = prev + (hrs - prev) * 0.12;
        return Math.round(next * 10) / 10;
      });

      if (selected && detailOpen) {
        openDetailFor(selected, cache);
      }
    },
    [birth, selected, detailOpen, openDetailFor],
  );

  const showSim = !live || Math.abs(scrubHours) > 0.01;

  const simLabel = useMemo(() => {
    return new Date(simTime).toISOString().replace('T', ' ').slice(0, 19) + 'Z';
  }, [simTime]);

  const handleScrub = (hours: number) => {
    setScrubHours(hours);
    const isLive = Math.abs(hours) < 0.01;
    setLive(isLive);
    if (!isLive) {
      setSimTime(Date.now() + hours * 3600 * 1000);
    }
  };

  const handleToggleLive = () => {
    if (!live || Math.abs(scrubHours) > 0.01) {
      setLive(true);
      setScrubHours(0);
      setSimTime(Date.now());
    } else {
      setLive(false);
    }
  };

  const openConfig = () => {
    setDraft({ ...birth });
    setConfigOpen(true);
  };

  const handleSave = () => {
    const next: BirthConfig = {
      name: draft.name.trim() || 'Native',
      date: draft.date || '1990-01-01',
      h: clamp(+draft.h, 0, 23),
      m: clamp(+draft.m, 0, 59),
      s: clamp(+draft.s, 0, 59),
      preset: draft.preset,
      lat: +draft.lat,
      lon: +draft.lon,
      placeLabel: draft.placeLabel,
      isDemo: false,
    };
    setBirth(next);
    saveConfig(next);
    recomputeNatal(next, true);
    setConfigOpen(false);
  };

  const handleReset = () => {
    const demo = { ...DEMO_BIRTH };
    setBirth(demo);
    setDraft(demo);
    clearConfig();
    recomputeNatal(demo, true);
    setYouOpen(false);
  };

  const handleOpenYou = () => {
    setYouOpen(true);
  };

  if (!hydrated) {
    return (
      <div className="astroclock-root bg-ink text-mist flex items-center justify-center">
        <div className="text-gold/70 text-xs tracking-[0.3em] uppercase">
          AstroClock
        </div>
      </div>
    );
  }

  return (
    <div className="astroclock-root bg-ink text-mist">
      <TopBar
        utc={utc}
        local={local}
        placeLabel={placeLabel}
        view={view}
        onViewChange={setView}
        youEnabled={true}
        onOpenYou={handleOpenYou}
        onOpenConfig={openConfig}
      />

      <main className="flex-1 relative min-h-0 flex flex-col">
        {/* display:none when off-dial — opacity-0 can leave GPU ghosts on Safari. */}
        <div
          className={`flex-1 min-h-0 relative flex flex-col ${view === 'dial' ? '' : 'hidden'}`}
          aria-hidden={view !== 'dial'}
          data-face={face}
        >
          <div
            className={`ac-flip-stage flex-1 min-h-0 relative ${
              isFlipping(face) ? 'ac-flip-stage--locked' : ''
            }`}
          >
            {/* Default: volumetric Three.js sky dial + morph to metal reverse */}
            {!useFlatSky && (
              <SkyClock3D
                simTime={simTime}
                lat={+birth.lat}
                lon={+birth.lon}
                natalLons={currentNatal}
                natalLerp={natalLerp}
                selected={selected}
                visible={visible && view === 'dial'}
                face={face}
                interactive={face === 'sky' || face === 'bauhaus'}
                onFrame={onFrame}
                onEmptyTap={face === 'sky' ? flipToBauhaus : undefined}
                onFlipBack={flipToSky}
              />
            )}
            {/* Reduced-motion / fallback: 2D ClockCanvas + MetalClock3D tumble */}
            {useFlatSky && (
              <>
                <div
                  className={`ac-sky-layer ${
                    face === 'sky'
                      ? 'ac-sky-layer--in'
                      : face === 'flipping-to-bauhaus'
                        ? 'ac-sky-layer--exit'
                        : 'ac-sky-layer--out'
                  }`}
                  aria-hidden={face !== 'sky'}
                >
                  <div className="ac-dial-square absolute inset-0 w-full h-full">
                    <div className="ac-dial-square-inner">
                      <ClockCanvas
                        simTime={simTime}
                        lat={+birth.lat}
                        lon={+birth.lon}
                        natalLons={currentNatal}
                        natalLerp={natalLerp}
                        selected={selected}
                        visible={visible && view === 'dial'}
                        onFrame={onFrame}
                        onNatalLerpTick={() => {}}
                        onEmptyTap={face === 'sky' ? flipToBauhaus : undefined}
                        onCanvasEl={setSkyCanvas}
                      />
                    </div>
                  </div>
                </div>
                <MetalClock3D
                  simTime={simTime}
                  visible={visible && view === 'dial'}
                  face={face}
                  skyCanvas={skyCanvas}
                  interactive={face === 'bauhaus'}
                  onFlipBack={flipToSky}
                />
              </>
            )}
          </div>
          {showSim && view === 'dial' && face === 'sky' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 ac-glass rounded-full px-3 py-1 text-[10px] font-mono text-gold/90 fade-in z-10 pointer-events-none">
              SIM <span>{simLabel}</span>
            </div>
          )}
          {view === 'dial' && (
            <div className="ac-hud-dock-stack shrink-0" data-ac-dock-stack>
              <div
                className={`ac-hud-host ${
                  showGeekyHud(face) ? 'ac-hud-host--in' : 'ac-hud-host--out'
                }`}
                aria-hidden={!showGeekyHud(face)}
              >
                <HUD
                  maha={maha}
                  antar={antar}
                  tithi={tithi}
                  lagna={lagna}
                  speeds={speeds}
                  selected={selected}
                  hrs={Math.round(hrsDisplay)}
                  live={live}
                  scrubHours={scrubHours}
                  scrubLabel={scrubHint(scrubHours)}
                  face={face}
                  onSelect={handleSelect}
                  onToggleLive={handleToggleLive}
                  onScrub={handleScrub}
                />
              </div>
              <div
                className={`ac-hud-host ac-reverse-dock-host ${
                  showReverseDock(face) ? 'ac-hud-host--in' : 'ac-hud-host--out'
                }`}
                aria-hidden={!showReverseDock(face)}
              >
                <ReverseDayDock
                  simTime={simTime}
                  insights={todayInsights}
                  tithi={tithi}
                  interactive={face === 'bauhaus'}
                  onSky={flipToSky}
                />
              </div>
            </div>
          )}
        </div>
        {view === 'today' && (
          <div className="today-surface overflow-hidden">
            <TodayPanel insights={todayInsights} onSelectGraha={handleSelect} />
          </div>
        )}
      </main>

      {view === 'today' && (
        <footer className="ac-hud shrink-0 border-t border-white/10 ac-glass px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleLive}
              className={`ac-chip rounded-lg px-3 py-2 text-[10px] font-semibold tracking-wider uppercase shrink-0 ${
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
                onChange={(e) => handleScrub(Number(e.target.value))}
                className="scrub w-full h-1.5 appearance-none rounded-full bg-white/10 outline-none"
              />
              <div className="flex justify-between text-[8px] text-mist/40 font-mono mt-0.5">
                <span>−3d</span>
                <span>{scrubHint(scrubHours)}</span>
                <span>+3d</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      <PlanetDrawer
        open={detailOpen}
        detail={detail}
        onClose={() => {
          setDetailOpen(false);
          setSelected(null);
        }}
      />

      <ConfigDrawer
        open={configOpen}
        draft={draft}
        onChange={setDraft}
        onClose={() => setConfigOpen(false)}
        onSave={handleSave}
        onReset={handleReset}
      />

      <WelcomeTour
        onOpenConfig={() => setConfigOpen(true)}
        onGoToday={() => setView('today')}
        onOpenYou={() => setYouOpen(true)}
      />
      <YouDrawer
        open={youOpen}
        birth={birth}
        profile={natalProfile}
        isDemo={!!birth.isDemo}
        climate={todayInsights.climate}
        stretch={stretchFromClimate(todayInsights.climate)}
        onClose={() => setYouOpen(false)}
        onOpenConfig={openConfig}
      />
    </div>
  );
}
