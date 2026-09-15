
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

interface Hit {
  id: GrahaId;
  angle: number;
  r: number;
  cx: number;
  cy: number;
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
  onSelect: (id: GrahaId) => void;
  onNatalLerpTick: (t: number) => void;
}

function lonToAngle(lon: number): number {
  return norm360(lon) * DEG - Math.PI / 2;
}

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
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
  onSelect,
  onNatalLerpTick,
}: ClockCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitRef = useRef<Hit[] | null>(null);
  const rafRef = useRef<number>(0);
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
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
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

      const vg = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.15);
      vg.addColorStop(0, 'rgba(20,22,30,0.0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

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

      /* --- 1. Rashi ring --- */
      drawRing(cx, cy, rRashi, 'rgba(255,255,255,0.12)', 1.2);
      for (let i = 0; i < 12; i++) {
        const lon0 = i * 30;
        for (let d = 0; d < 30; d++) {
          const a = lonToAngle(lon0 + d);
          const major = d === 0;
          const mid = d % 5 === 0;
          const len = major ? 10 : mid ? 6 : 3;
          const p1 = polar(cx, cy, rRashi, a);
          const p2 = polar(cx, cy, rRashi - len, a);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = major
            ? 'rgba(212,175,55,0.55)'
            : mid
              ? 'rgba(255,255,255,0.2)'
              : 'rgba(255,255,255,0.08)';
          ctx.lineWidth = major ? 1.5 : 0.7;
          ctx.stroke();
        }
        const amid = lonToAngle(lon0 + 15);
        const lp = polar(cx, cy, rRashi - 18, amid);
        ctx.save();
        ctx.translate(lp.x, lp.y);
        ctx.rotate(amid + Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(212,175,55,0.7)';
        ctx.font = '600 9px Inter, sans-serif';
        ctx.fillText(RASHIS[i].glyph, 0, -5);
        ctx.fillStyle = 'rgba(224,226,236,0.55)';
        ctx.font = '600 7px Inter, sans-serif';
        ctx.fillText(RASHIS[i].en, 0, 6);
        ctx.restore();
      }

      /* --- 2. Nakshatra ring --- */
      drawRing(cx, cy, rNak, 'rgba(100,181,246,0.15)', 1);
      const nakSpan = 360 / 27;
      for (let i = 0; i < 27; i++) {
        const lon0 = i * nakSpan;
        const a = lonToAngle(lon0);
        const p1 = polar(cx, cy, rNak + 2, a);
        const p2 = polar(cx, cy, rNak - 8, a);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = 'rgba(100,181,246,0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
        for (let pd = 1; pd <= 4; pd++) {
          const pa = lonToAngle(lon0 + (nakSpan / 4) * pd - nakSpan / 8);
          const dp = polar(cx, cy, rNak - 4, pa);
          ctx.beginPath();
          ctx.arc(dp.x, dp.y, 1.1, 0, TWO_PI);
          ctx.fillStyle = 'rgba(100,181,246,0.45)';
          ctx.fill();
        }
      }

      /* --- 3. Gear escapement --- */
      const tSec = nowMs / 1000;
      const gearRot = (tSec * 0.08) % TWO_PI;
      const teeth = 48;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(gearRot);
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const a0 = (i / teeth) * TWO_PI;
        const a1 = ((i + 0.45) / teeth) * TWO_PI;
        const a2 = ((i + 0.55) / teeth) * TWO_PI;
        const a3 = ((i + 1) / teeth) * TWO_PI;
        const rOut = rGear;
        const rIn = rGear - 7;
        if (i === 0) ctx.moveTo(rIn * Math.cos(a0), rIn * Math.sin(a0));
        ctx.lineTo(rOut * Math.cos(a1), rOut * Math.sin(a1));
        ctx.lineTo(rOut * Math.cos(a2), rOut * Math.sin(a2));
        ctx.lineTo(rIn * Math.cos(a3), rIn * Math.sin(a3));
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(212,175,55,0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(212,175,55,0.04)';
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-gearRot * 1.7);
      for (let arm = 0; arm < 3; arm++) {
        const aa = arm * (TWO_PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo((rGear - 14) * Math.cos(aa), (rGear - 14) * Math.sin(aa));
        ctx.strokeStyle = 'rgba(224,226,236,0.12)';
        ctx.lineWidth = 2;
        ctx.stroke();
        const tip = {
          x: (rGear - 14) * Math.cos(aa),
          y: (rGear - 14) * Math.sin(aa),
        };
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 3, 0, TWO_PI);
        ctx.fillStyle = 'rgba(212,175,55,0.4)';
        ctx.fill();
      }
      ctx.restore();
      drawRing(cx, cy, rGear - 10, 'rgba(255,255,255,0.06)', 1);

      /* --- 4. Aspect beams transit↔transit --- */
      const sel = p.selected;
      const pulse = 0.45 + 0.35 * Math.sin(tSec * 3);
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
          const col =
            hit.angle === 90 || hit.angle === 180
              ? `rgba(229,115,115,${0.15 + pulse * 0.25 * hit.tight})`
              : `rgba(129,199,132,${0.12 + pulse * 0.22 * hit.tight})`;
          ctx.strokeStyle = col;
          ctx.lineWidth = sel ? 1.8 : 1;
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
            // skip exact same body self-conjunction clutter unless selected
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
            const col =
              hit.angle === 90 || hit.angle === 180
                ? `rgba(229,115,115,${0.08 + pulse * 0.12 * hit.tight})`
                : `rgba(100,181,246,${0.08 + pulse * 0.14 * hit.tight})`;
            ctx.strokeStyle = col;
            ctx.lineWidth = 0.8;
            ctx.setLineDash([3, 3]);
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
          ctx.globalAlpha = 0.35 + 0.25 * (p.natalLerp < 1 ? p.natalLerp : 1);
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
          const pg = polar(cx, cy, rNatal, ang);
          const glow = ctx.createRadialGradient(pg.x, pg.y, 0, pg.x, pg.y, 8);
          glow.addColorStop(0, g.color + '66');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(pg.x, pg.y, 8, 0, TWO_PI);
          ctx.fill();
        }
        drawRing(cx, cy, rNatal, 'rgba(255,255,255,0.06)', 1);
      }

      /* --- 6. Transit planetary hands --- */
      for (const g of GRAHAS) {
        const lonP = planets[g.id].sidereal;
        const ang = lonToAngle(lonP);
        const isSel = sel === g.id;
        const tip = polar(cx, cy, rPlanet, ang);
        const basePt = polar(cx, cy, rHub + 4, ang);

        ctx.beginPath();
        ctx.moveTo(basePt.x, basePt.y);
        ctx.lineTo(tip.x, tip.y);
        ctx.strokeStyle = g.color;
        ctx.globalAlpha = isSel ? 1 : sel ? 0.25 : 0.85;
        ctx.lineWidth = isSel ? 2.5 : 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(tip.x, tip.y, isSel ? 7 : 5, 0, TWO_PI);
        ctx.fillStyle = g.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(11,12,16,0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#0B0C10';
        ctx.font = `600 ${isSel ? 9 : 7}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(g.symbol, tip.x, tip.y + 0.5);

        if (speeds[g.id] < -0.01) {
          const rp = polar(cx, cy, rPlanet + 11, ang);
          ctx.fillStyle = '#E57373';
          ctx.font = '600 7px Inter';
          ctx.fillText('R', rp.x, rp.y);
        }
      }

      /* --- 7. Center hub — LST --- */
      const msFrac = (nowMs % 1000) / 1000;
      const secFrac = (date.getUTCSeconds() + msFrac) / 60;
      const lstFrac = (lstH % 24) / 24;

      const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rHub);
      hubGrad.addColorStop(0, 'rgba(212,175,55,0.25)');
      hubGrad.addColorStop(0.6, 'rgba(20,22,30,0.95)');
      hubGrad.addColorStop(1, 'rgba(100,181,246,0.2)');
      ctx.beginPath();
      ctx.arc(cx, cy, rHub, 0, TWO_PI);
      ctx.fillStyle = hubGrad;
      ctx.fill();
      drawRing(cx, cy, rHub, 'rgba(212,175,55,0.4)', 1.5);

      ctx.beginPath();
      ctx.arc(cx, cy, rHub - 4, -Math.PI / 2, -Math.PI / 2 + secFrac * TWO_PI);
      ctx.strokeStyle = `rgba(100,181,246,${0.5 + 0.3 * Math.sin(msFrac * TWO_PI)})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      const lstAng = -Math.PI / 2 + lstFrac * TWO_PI;
      const lstP = polar(cx, cy, rHub - 2, lstAng);
      ctx.beginPath();
      ctx.arc(lstP.x, lstP.y, 2.5, 0, TWO_PI);
      ctx.fillStyle = '#D4AF37';
      ctx.fill();

      const lagAng = lonToAngle(asc.sidereal);
      const lagInner = polar(cx, cy, rRashi + 1, lagAng);
      const lagP = polar(cx, cy, rRashi + 4, lagAng);
      ctx.beginPath();
      ctx.moveTo(lagInner.x, lagInner.y);
      ctx.lineTo(lagP.x, lagP.y);
      ctx.strokeStyle = '#81C784';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(lagP.x, lagP.y, 3, 0, TWO_PI);
      ctx.fillStyle = '#81C784';
      ctx.fill();

      hitRef.current = GRAHAS.map((g) => ({
        id: g.id,
        angle: lonToAngle(planets[g.id].sidereal),
        r: rPlanet,
        cx,
        cy,
      }));

      p.onFrame({ planets, speeds, asc, jd, date, aya, lstH });
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const hitTest = (clientX: number, clientY: number): GrahaId | null => {
    const hits = hitRef.current;
    const canvas = canvasRef.current;
    if (!hits || !canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    let best: GrahaId | null = null;
    let bestDist = Infinity;
    for (const h of hits) {
      const tip = polar(h.cx, h.cy, h.r, h.angle);
      const dist = Math.hypot(x - tip.x, y - tip.y);
      const dx = x - h.cx;
      const dy = y - h.cy;
      const r = Math.hypot(dx, dy);
      const ang = Math.atan2(dy, dx);
      let dAng = Math.abs(ang - h.angle);
      if (dAng > Math.PI) dAng = TWO_PI - dAng;
      const onRing = Math.abs(r - h.r) < 28 && dAng < 0.18;
      if (dist < 28 || onRing) {
        const score = dist < 28 ? dist : dAng * 50;
        if (score < bestDist) {
          bestDist = score;
          best = h.id;
        }
      }
    }
    return best;
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const id = hitTest(e.clientX, e.clientY);
    if (id) onSelect(id);
  };

  return (
    <canvas
      ref={canvasRef}
      id="clockCanvas"
      className="touch-none block w-full h-full"
      onPointerDown={onPointerDown}
    />
  );
}
