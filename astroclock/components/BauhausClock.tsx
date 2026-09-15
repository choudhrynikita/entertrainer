import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  STRETCH_COLOR,
  coalesceStretchSegments,
  sampleLocalDayQualities,
  type StretchSegment,
} from '@astroclock/lib/astro/hourQuality';

interface BauhausClockProps {
  simTime: number;
  visible: boolean;
  onFlipBack: () => void;
}

const GOLD = '#D4AF37';
const INK = '#0B0C10';
const FACE = '#161822';
const FACE_EDGE = 'rgba(255,255,255,0.08)';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function hourAngle24(h: number, m = 0, s = 0): number {
  /* 24h mapped around circle; 0 at 12 o'clock, clockwise. */
  const frac = (h + m / 60 + s / 3600) / 24;
  return frac * Math.PI * 2 - Math.PI / 2;
}

function polar(cx: number, cy: number, r: number, a: number) {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function BauhausClock({ simTime, visible, onFlipBack }: BauhausClockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const simRef = useRef(simTime);
  const visibleRef = useRef(visible);
  const segsRef = useRef<StretchSegment[]>([]);
  const dayKeyRef = useRef('');
  const reduceRef = useRef(false);

  simRef.current = simTime;
  visibleRef.current = visible;

  const dayLabel = useMemo(() => {
    const d = new Date(simTime);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    const month = d.toLocaleString(undefined, { month: 'short' });
    const prefix = sameDay ? 'Today' : d.toLocaleString(undefined, { weekday: 'short' });
    return `${prefix} · ${month} ${d.getDate()}`;
  }, [simTime]);

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
    reduceRef.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    const parent = canvasRef.current?.parentElement;
    const ro =
      parent && typeof ResizeObserver !== 'undefined'
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

    const ensureDay = (ms: number) => {
      const d = new Date(ms);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (key === dayKeyRef.current && segsRef.current.length) return;
      dayKeyRef.current = key;
      segsRef.current = coalesceStretchSegments(sampleLocalDayQualities(ms, 24));
    };

    const drawHand = (
      cx: number,
      cy: number,
      angle: number,
      length: number,
      width: number,
      color: string,
      rounded = true,
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineCap = rounded ? 'round' : 'butt';
      ctx.lineWidth = width;
      ctx.moveTo(-length * 0.12, 0);
      ctx.lineTo(length, 0);
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (!visibleRef.current) return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;

      const ms = simRef.current;
      ensureDay(ms);
      const date = new Date(ms);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const msFrac = date.getMilliseconds() / 1000;

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);

      /* Soft plate shadow */
      ctx.beginPath();
      ctx.arc(cx, cy + 3, R * 1.02, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fill();

      /* Matte charcoal face */
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = FACE;
      ctx.fill();
      ctx.strokeStyle = FACE_EDGE;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      /* Inner ring */
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.92, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212,175,55,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* Hour marks — Bauhaus geometry */
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        if (i === 0 || i === 6) {
          /* XII at 12 and 6 */
          const p = polar(cx, cy, R * 0.72, a);
          ctx.save();
          ctx.fillStyle = GOLD;
          ctx.font = `600 ${Math.max(11, R * 0.09)}px ui-sans-serif, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('XII', p.x, p.y);
          ctx.restore();
        } else if (i === 3 || i === 9) {
          const inner = polar(cx, cy, R * 0.78, a);
          const outer = polar(cx, cy, R * 0.88, a);
          ctx.beginPath();
          ctx.moveTo(inner.x, inner.y);
          ctx.lineTo(outer.x, outer.y);
          ctx.strokeStyle = GOLD;
          ctx.lineWidth = Math.max(3.5, R * 0.028);
          ctx.lineCap = 'butt';
          ctx.stroke();
        } else {
          const inner = polar(cx, cy, R * 0.8, a);
          const outer = polar(cx, cy, R * 0.88, a);
          ctx.beginPath();
          ctx.moveTo(inner.x, inner.y);
          ctx.lineTo(outer.x, outer.y);
          ctx.strokeStyle = GOLD;
          ctx.lineWidth = Math.max(1.2, R * 0.01);
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      /* Day-quality ribbon ring (outside face) */
      const rRibbon = R * 1.06;
      const ribbonW = Math.max(4, R * 0.035);
      const segs = segsRef.current;
      for (const seg of segs) {
        const a0 = hourAngle24(seg.startHour);
        const a1 = hourAngle24(seg.endHour === 24 ? 24 : seg.endHour);
        ctx.beginPath();
        ctx.arc(cx, cy, rRibbon, a0, a1, false);
        ctx.strokeStyle = STRETCH_COLOR[seg.stretch];
        ctx.lineWidth = ribbonW;
        ctx.lineCap = 'butt';
        ctx.stroke();
      }

      /* 6-o'clock pointer (gold triangle into ribbon) */
      {
        const tip = polar(cx, cy, rRibbon + ribbonW * 0.9, Math.PI / 2);
        const baseL = polar(cx, cy, rRibbon - ribbonW * 0.2, Math.PI / 2 - 0.06);
        const baseR = polar(cx, cy, rRibbon - ribbonW * 0.2, Math.PI / 2 + 0.06);
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(baseL.x, baseL.y);
        ctx.lineTo(baseR.x, baseR.y);
        ctx.closePath();
        ctx.fillStyle = GOLD;
        ctx.fill();
      }

      /* Traveling "now" bead (24h position) */
      {
        const aNow = hourAngle24(hours, minutes, seconds + msFrac);
        const bead = polar(cx, cy, rRibbon, aNow);
        const curStretch =
          segs.find((s) => hours >= s.startHour && hours < s.endHour)?.stretch ||
          'mid';
        ctx.beginPath();
        ctx.arc(bead.x, bead.y, Math.max(4, ribbonW * 0.85), 0, Math.PI * 2);
        ctx.fillStyle = STRETCH_COLOR[curStretch];
        ctx.fill();
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      /* Hands — local civil time of simTime */
      const sec = seconds + (reduceRef.current ? 0 : msFrac);
      const minAngle =
        ((minutes + sec / 60) / 60) * Math.PI * 2 - Math.PI / 2;
      const hourAngle =
        (((hours % 12) + minutes / 60 + sec / 3600) / 12) * Math.PI * 2 -
        Math.PI / 2;
      const secAngle = (sec / 60) * Math.PI * 2 - Math.PI / 2;

      drawHand(cx, cy, hourAngle, R * 0.48, Math.max(5, R * 0.045), GOLD, true);
      drawHand(cx, cy, minAngle, R * 0.72, Math.max(1.6, R * 0.012), GOLD, true);
      drawHand(cx, cy, secAngle, R * 0.78, Math.max(0.8, R * 0.006), GOLD, true);

      /* Hub */
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(3.5, R * 0.028), 0, Math.PI * 2);
      ctx.fillStyle = GOLD;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1.5, R * 0.012), 0, Math.PI * 2);
      ctx.fillStyle = INK;
      ctx.fill();
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="absolute inset-0 min-h-0">
      <div className="ac-dial-square absolute inset-0 w-full h-full">
        <div className="ac-dial-square-inner">
          <canvas
            ref={canvasRef}
            className="touch-none block"
            aria-label="Day clock face"
            onPointerDown={(e) => {
              e.preventDefault();
              onFlipBack();
            }}
          />
        </div>
      </div>
      <div
        className="ac-bauhaus-chrome absolute bottom-0 left-0 right-0 px-3 pb-2 pt-1 text-center pointer-events-none z-[1]"
        data-ac-bauhaus-chrome
      >
        <div className="text-[11px] text-mist/70 tracking-wide">{dayLabel}</div>
        <div className="text-[9px] text-mist/45 mt-0.5 uppercase tracking-wider">
          Good · Mid · Hard stretches of the day.
        </div>
        <div className="mt-1.5 pointer-events-auto inline-flex">
          <button
            type="button"
            onClick={onFlipBack}
            className="ac-chip rounded-full px-3 py-1.5 min-h-8 text-[10px] uppercase tracking-wider text-gold"
          >
            Sky dial
          </button>
        </div>
      </div>
    </div>
  );
}
