
import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  DEG,
  GRAHAS,
  RASHIS,
  TWO_PI,
  type GrahaId,
  type LonMap,
  type PlanetMap,
  type SpeedMap,
  absShortest,
  ascendant,
  computePlanets,
  computeSpeeds,
  findAspect,
  julianDay,
  lahiriAyanamsha,
  lst,
  norm360,
} from '@astroclock/lib/astro';

export interface FrameCache {
  planets: PlanetMap;
  speeds: SpeedMap;
  asc: { tropical: number; sidereal: number };
  jd: number;
  date: Date;
  aya: number;
  lstH: number;
}

interface ClockCanvasProps {
  simTime: number;
  lat: number;
  lon: number;
  natalLons: LonMap | null;
  natalLerp: number;
  selected: GrahaId | null;
  visible: boolean;
  onFrame: (cache: FrameCache) => void;
  onNatalLerpTick: (t: number) => void;
  /** Tap or swipe on the dial — morph to the metal reverse. */
  onEmptyTap?: () => void;
  /** Expose the live canvas for WebGL front-face texturing. */
  onCanvasEl?: (el: HTMLCanvasElement | null) => void;
}

function lonToAngle(lon: number): number {
  return norm360(lon) * DEG - Math.PI / 2;
}


function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

/** Deterministic starfield — rebuilt when canvas size changes. */
function buildStarfield(w: number, h: number, seed = 42) {
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  const n = Math.max(48, Math.floor((w * h) / 14000));
  const stars: { x: number; y: number; r: number; a: number }[] = [];
  for (let i = 0; i < n; i++) {
    stars.push({
      x: rand() * w,
      y: rand() * h,
      r: 0.4 + rand() * 1.4,
      a: 0.12 + rand() * 0.45,
    });
  }
  return stars;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ClockCanvas({
  simTime,
  lat,
  lon,
  natalLons,
  natalLerp,
  selected,
  visible,
  onFrame,
  onNatalLerpTick,
  onEmptyTap,
  onCanvasEl,
}: ClockCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const starsRef = useRef<{ x: number; y: number; r: number; a: number }[]>([]);
  const reduceMotionRef = useRef(false);
  const simTimeRef = useRef(simTime);
  const propsRef = useRef({
    lat,
    lon,
    natalLons,
    natalLerp,
    selected,
    visible,
    onFrame,
    onNatalLerpTick,
  });

  simTimeRef.current = simTime;
  propsRef.current = {
    lat,
    lon,
    natalLons,
    natalLerp,
    selected,
    visible,
    onFrame,
    onNatalLerpTick,
  };

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    starsRef.current = buildStarfield(w, h);
    reduceMotionRef.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    const parent = canvasRef.current?.parentElement;
    const ro = parent && typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => resize())
      : null;
    if (parent && ro) ro.observe(parent);
    return () => {
      window.removeEventListener('resize', resize);
      ro?.disconnect();
    };
  }, [resize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawRing = (
      cx: number,
      cy: number,
      r: number,
      color: string,
      width: number,
    ) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TWO_PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    };

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const p = propsRef.current;
      if (!p.visible) return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.46;
      const nowMs = simTimeRef.current;

      ctx.clearRect(0, 0, w, h);

      const reduceMotion = reduceMotionRef.current;
      const date = new Date(nowMs);
      const jd = julianDay(date);
      const lstH = lst(jd, p.lon);
      const asc = ascendant(lstH, p.lat, jd);
      const planets = computePlanets(jd);
      const speeds = computeSpeeds(jd);
      const aya = lahiriAyanamsha(jd);

      if (p.natalLerp < 1) {
        // parent owns lerp timing; we just report cache
      }

      const natal = p.natalLons;
      const rRashi = R * 0.98;
      const rNak = R * 0.86;
      const rGear = R * 0.74;
      const rPlanet = R * 0.58;
      const rNatal = R * 0.42;
      const rHub = R * 0.14;

      /* --- 0. Deep field + starfield + vignette + gold halo --- */
      const field = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
      field.addColorStop(0, '#141622');
      field.addColorStop(0.45, '#0B0C10');
      field.addColorStop(1, '#05060A');
      ctx.fillStyle = field;
      ctx.fillRect(0, 0, w, h);

      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        // Keep stars outside the dial slightly brighter; dim inside rings
        const dist = Math.hypot(st.x - cx, st.y - cy);
        const inside = dist < R * 1.05 ? 0.35 : 1;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, TWO_PI);
        ctx.fillStyle = `rgba(224,226,236,${st.a * inside})`;
        ctx.fill();
      }

      const halo = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.22);
      halo.addColorStop(0, 'rgba(212,175,55,0)');
      halo.addColorStop(0.55, 'rgba(212,175,55,0.07)');
      halo.addColorStop(0.85, 'rgba(212,175,55,0.14)');
      halo.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.22, 0, TWO_PI);
      ctx.fill();

      const vg = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.28);
      vg.addColorStop(0, 'rgba(11,12,16,0)');
      vg.addColorStop(0.7, 'rgba(5,6,10,0.25)');
      vg.addColorStop(1, 'rgba(0,0,0,0.72)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      /* Outer bezel */
      ctx.beginPath();
      ctx.arc(cx, cy, rRashi + 6, 0, TWO_PI);
      ctx.strokeStyle = 'rgba(212,175,55,0.22)';
      ctx.lineWidth = 5;
      ctx.stroke();
      drawRing(cx, cy, rRashi + 3.5, 'rgba(240,215,140,0.35)', 1.25);
      drawRing(cx, cy, rRashi + 8.5, 'rgba(212,175,55,0.12)', 1);

      /* Dial plate wash */
      const plate = ctx.createRadialGradient(cx, cy, rHub, cx, cy, rRashi);
      plate.addColorStop(0, 'rgba(20,24,36,0.55)');
      plate.addColorStop(0.55, 'rgba(12,14,20,0.28)');
      plate.addColorStop(1, 'rgba(11,12,16,0.05)');
      ctx.beginPath();
      ctx.arc(cx, cy, rRashi, 0, TWO_PI);
      ctx.fillStyle = plate;
      ctx.fill();

      /* --- 1. Rashi ring --- */
      drawRing(cx, cy, rRashi, 'rgba(212,175,55,0.28)', 1.4);
      for (let i = 0; i < 12; i++) {
        const lon0 = i * 30;
        for (let d = 0; d < 30; d++) {
          const a = lonToAngle(lon0 + d);
          const major = d === 0;
          const mid = d % 5 === 0;
          const len = major ? 12 : mid ? 7 : 3.5;
          const p1 = polar(cx, cy, rRashi, a);
          const p2 = polar(cx, cy, rRashi - len, a);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = major
            ? 'rgba(240,215,140,0.85)'
            : mid
              ? 'rgba(212,175,55,0.38)'
              : 'rgba(224,226,236,0.1)';
          ctx.lineWidth = major ? 1.8 : mid ? 1 : 0.7;
          ctx.stroke();
        }
        const amid = lonToAngle(lon0 + 15);
        const lp = polar(cx, cy, rRashi - 20, amid);
        ctx.save();
        ctx.translate(lp.x, lp.y);
        ctx.rotate(amid + Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(212,175,55,0.35)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = 'rgba(240,215,140,0.92)';
        ctx.font = '600 10px Inter, system-ui, sans-serif';
        ctx.fillText(RASHIS[i].glyph, 0, -5);
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(100,181,246,0.72)';
        ctx.font = '600 7.5px Inter, system-ui, sans-serif';
        ctx.fillText(RASHIS[i].en, 0, 7);
        ctx.restore();
      }

      /* --- 2. Nakshatra ring --- */
      drawRing(cx, cy, rNak, 'rgba(100,181,246,0.22)', 1.15);
      drawRing(cx, cy, rNak - 9, 'rgba(100,181,246,0.08)', 1);
      const nakSpan = 360 / 27;
      for (let i = 0; i < 27; i++) {
        const lon0 = i * nakSpan;
        const a = lonToAngle(lon0);
        const p1 = polar(cx, cy, rNak + 2.5, a);
        const p2 = polar(cx, cy, rNak - 9, a);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = 'rgba(100,181,246,0.42)';
        ctx.lineWidth = 1.05;
        ctx.stroke();
        for (let pd = 1; pd <= 4; pd++) {
          const pa = lonToAngle(lon0 + (nakSpan / 4) * pd - nakSpan / 8);
          const dp = polar(cx, cy, rNak - 4.5, pa);
          ctx.beginPath();
          ctx.arc(dp.x, dp.y, 1.15, 0, TWO_PI);
          ctx.fillStyle = 'rgba(100,181,246,0.5)';
          ctx.fill();
        }
      }

      /* --- 3. Gear escapement (calmed under reduced motion) --- */
      const tSec = nowMs / 1000;
      const gearRot = reduceMotion ? 0 : (tSec * 0.05) % TWO_PI;
      const teeth = 48;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(gearRot);
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const a0 = (i / teeth) * TWO_PI;
        const a1 = ((i + 0.42) / teeth) * TWO_PI;
        const a2 = ((i + 0.58) / teeth) * TWO_PI;
        const a3 = ((i + 1) / teeth) * TWO_PI;
        const rOut = rGear;
        const rIn = rGear - 6.5;
        if (i === 0) ctx.moveTo(rIn * Math.cos(a0), rIn * Math.sin(a0));
        ctx.lineTo(rOut * Math.cos(a1), rOut * Math.sin(a1));
        ctx.lineTo(rOut * Math.cos(a2), rOut * Math.sin(a2));
        ctx.lineTo(rIn * Math.cos(a3), rIn * Math.sin(a3));
      }
      ctx.closePath();
      const gearFill = ctx.createRadialGradient(0, 0, rGear * 0.35, 0, 0, rGear);
      gearFill.addColorStop(0, 'rgba(212,175,55,0.02)');
      gearFill.addColorStop(1, 'rgba(212,175,55,0.07)');
      ctx.fillStyle = gearFill;
      ctx.fill();
      ctx.strokeStyle = 'rgba(212,175,55,0.2)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(reduceMotion ? 0 : -gearRot * 1.55);
      for (let arm = 0; arm < 3; arm++) {
        const aa = arm * (TWO_PI / 3);
        ctx.beginPath();
        ctx.moveTo(rHub * 0.9 * Math.cos(aa), rHub * 0.9 * Math.sin(aa));
        ctx.lineTo((rGear - 16) * Math.cos(aa), (rGear - 16) * Math.sin(aa));
        ctx.strokeStyle = 'rgba(224,226,236,0.1)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        const tip = {
          x: (rGear - 16) * Math.cos(aa),
          y: (rGear - 16) * Math.sin(aa),
        };
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 2.6, 0, TWO_PI);
        ctx.fillStyle = 'rgba(212,175,55,0.35)';
        ctx.fill();
      }
      ctx.restore();
      drawRing(cx, cy, rGear - 11, 'rgba(255,255,255,0.05)', 1);

      /* --- 4. Aspect beams (alpha capped, softer) --- */
      const sel = p.selected;
      const pulse = reduceMotion
        ? 0.55
        : 0.45 + 0.28 * Math.sin(tSec * 2.4);
      for (let i = 0; i < GRAHAS.length; i++) {
        for (let j = i + 1; j < GRAHAS.length; j++) {
          const a = GRAHAS[i];
          const b = GRAHAS[j];
          if (sel && sel !== a.id && sel !== b.id) continue;
          const hit = findAspect(
            planets[a.id].sidereal,
            planets[b.id].sidereal,
          );
          if (!hit) continue;
          const pa = polar(cx, cy, rPlanet, lonToAngle(planets[a.id].sidereal));
          const pb = polar(cx, cy, rPlanet, lonToAngle(planets[b.id].sidereal));
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          const hard = hit.angle === 90 || hit.angle === 180;
          const alpha = Math.min(
            0.32,
            (hard ? 0.1 : 0.08) + pulse * 0.16 * hit.tight,
          );
          ctx.strokeStyle = hard
            ? `rgba(229,115,115,${alpha})`
            : `rgba(129,199,132,${alpha})`;
          ctx.lineWidth = sel ? 1.6 : 0.9;
          ctx.stroke();
        }
      }

      /* --- 4b. natal↔transit aspects --- */
      if (natal) {
        for (const g of GRAHAS) {
          for (const t of GRAHAS) {
            if (sel && sel !== g.id && sel !== t.id) continue;
            const hit = findAspect(natal[g.id], planets[t.id].sidereal);
            if (!hit) continue;
            if (g.id === t.id && absShortest(natal[g.id], planets[t.id].sidereal) < 1) {
              continue;
            }
            const pa = polar(cx, cy, rNatal, lonToAngle(natal[g.id]));
            const pb = polar(
              cx,
              cy,
              rPlanet,
              lonToAngle(planets[t.id].sidereal),
            );
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            const hard = hit.angle === 90 || hit.angle === 180;
            const alpha = Math.min(
              0.22,
              (hard ? 0.06 : 0.05) + pulse * 0.1 * hit.tight,
            );
            ctx.strokeStyle = hard
              ? `rgba(229,115,115,${alpha})`
              : `rgba(100,181,246,${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.setLineDash([3, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      /* --- 5. Natal markers --- */
      if (natal) {
        for (const g of GRAHAS) {
          const lonN = natal[g.id];
          const ang = lonToAngle(lonN);
          const p1 = polar(cx, cy, rNatal + 6, ang);
          const p2 = polar(cx, cy, rNatal - 4, ang);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = g.color;
          ctx.globalAlpha = 0.32 + 0.28 * (p.natalLerp < 1 ? p.natalLerp : 1);
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
          const pg = polar(cx, cy, rNatal, ang);
          const glow = ctx.createRadialGradient(pg.x, pg.y, 0, pg.x, pg.y, 9);
          glow.addColorStop(0, g.color + '55');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(pg.x, pg.y, 9, 0, TWO_PI);
          ctx.fill();
        }
        drawRing(cx, cy, rNatal, 'rgba(255,255,255,0.07)', 1);
      }

      /* --- 6. Transit planetary hands --- */
      for (const g of GRAHAS) {
        const lonP = planets[g.id].sidereal;
        const ang = lonToAngle(lonP);
        const isSel = sel === g.id;
        const tip = polar(cx, cy, rPlanet, ang);
        const basePt = polar(cx, cy, rHub + 4, ang);
        const tipR = isSel ? 7.5 : 5.2;
        const glowR = isSel ? 16 : 11;
        const selPulse = isSel
          ? reduceMotion
            ? 1
            : 0.75 + 0.25 * Math.sin(tSec * 3.2)
          : 1;

        ctx.beginPath();
        ctx.moveTo(basePt.x, basePt.y);
        ctx.lineTo(tip.x, tip.y);
        ctx.strokeStyle = g.color;
        ctx.globalAlpha = (isSel ? 1 : sel ? 0.22 : 0.82) * selPulse;
        ctx.lineWidth = isSel ? 2.4 : 1.45;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.lineCap = 'butt';

        const tipGlow = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, glowR);
        tipGlow.addColorStop(0, g.color + (isSel ? '99' : '55'));
        tipGlow.addColorStop(0.45, g.color + '22');
        tipGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = tipGlow;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, glowR, 0, TWO_PI);
        ctx.fill();

        if (isSel && !reduceMotion) {
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, tipR + 4 + 2 * Math.sin(tSec * 3.2), 0, TWO_PI);
          ctx.strokeStyle = g.color + '66';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(tip.x, tip.y, tipR, 0, TWO_PI);
        ctx.fillStyle = g.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(11,12,16,0.85)';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.fillStyle = '#0B0C10';
        ctx.font = `600 ${isSel ? 9 : 7}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(g.symbol, tip.x, tip.y + 0.5);

        if (speeds[g.id] < -0.01) {
          const rp = polar(cx, cy, rPlanet + 12, ang);
          ctx.fillStyle = '#E57373';
          ctx.font = '600 7px Inter, system-ui, sans-serif';
          ctx.fillText('R', rp.x, rp.y);
        }
      }

      /* --- 7. Jewel hub — LST --- */
      const msFrac = (nowMs % 1000) / 1000;
      const secFrac = (date.getUTCSeconds() + msFrac) / 60;
      const lstFrac = (lstH % 24) / 24;

      const hubOuter = ctx.createRadialGradient(cx - rHub * 0.25, cy - rHub * 0.3, 0, cx, cy, rHub * 1.15);
      hubOuter.addColorStop(0, 'rgba(240,215,140,0.35)');
      hubOuter.addColorStop(0.4, 'rgba(212,175,55,0.18)');
      hubOuter.addColorStop(0.75, 'rgba(16,18,26,0.98)');
      hubOuter.addColorStop(1, 'rgba(100,181,246,0.22)');
      ctx.beginPath();
      ctx.arc(cx, cy, rHub, 0, TWO_PI);
      ctx.fillStyle = hubOuter;
      ctx.fill();
      drawRing(cx, cy, rHub, 'rgba(240,215,140,0.55)', 1.6);
      drawRing(cx, cy, rHub - 3.5, 'rgba(212,175,55,0.25)', 1);

      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, TWO_PI);
      ctx.fillStyle = '#D4AF37';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - 1, cy - 1.2, 1.4, 0, TWO_PI);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fill();

      const secAlpha = reduceMotion
        ? 0.55
        : 0.45 + 0.25 * Math.sin(msFrac * TWO_PI);
      ctx.beginPath();
      ctx.arc(cx, cy, rHub - 5, -Math.PI / 2, -Math.PI / 2 + secFrac * TWO_PI);
      ctx.strokeStyle = `rgba(100,181,246,${secAlpha})`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.lineCap = 'butt';

      const lstAng = -Math.PI / 2 + lstFrac * TWO_PI;
      const lstP = polar(cx, cy, rHub - 2.2, lstAng);
      ctx.beginPath();
      ctx.arc(lstP.x, lstP.y, 2.6, 0, TWO_PI);
      ctx.fillStyle = '#F0D78C';
      ctx.fill();

      /* --- 8. Refined Lagna marker --- */
      const lagAng = lonToAngle(asc.sidereal);
      const lagInner = polar(cx, cy, rRashi - 1, lagAng);
      const lagMid = polar(cx, cy, rRashi + 5, lagAng);
      const lagTip = polar(cx, cy, rRashi + 12, lagAng);
      const lagL = polar(cx, cy, rRashi + 5, lagAng - 0.07);
      const lagR = polar(cx, cy, rRashi + 5, lagAng + 0.07);
      ctx.beginPath();
      ctx.moveTo(lagInner.x, lagInner.y);
      ctx.lineTo(lagMid.x, lagMid.y);
      ctx.strokeStyle = 'rgba(129,199,132,0.85)';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lagTip.x, lagTip.y);
      ctx.lineTo(lagL.x, lagL.y);
      ctx.lineTo(lagR.x, lagR.y);
      ctx.closePath();
      ctx.fillStyle = '#81C784';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lagMid.x, lagMid.y, 2.2, 0, TWO_PI);
      ctx.fillStyle = 'rgba(129,199,132,0.9)';
      ctx.fill();
      ctx.lineCap = 'butt';

      p.onFrame({ planets, speeds, asc, jd, date, aya, lstH });
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const gestureRef = useRef<number | null>(null);
  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (e.isPrimary === false) return;
    gestureRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (gestureRef.current !== e.pointerId) return;
    gestureRef.current = null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* ignore */
    }
    onEmptyTap?.();
  };
  const onPointerCancel = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (gestureRef.current !== e.pointerId) return;
    gestureRef.current = null;
  };

  useEffect(() => {
    onCanvasEl?.(canvasRef.current);
    return () => onCanvasEl?.(null);
  }, [onCanvasEl]);

  return (
    <canvas
      ref={canvasRef}
      id="clockCanvas"
      className="touch-none block w-full h-full"
      aria-label="Sky dial — tap or swipe to transform"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    />
  );
}
