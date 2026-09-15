/**
 * Segment cascade: HUD actors + sky dial tiles as 3D panels.
 * Trajectories keep faces readable (avoid full edge-on) with a wave stagger.
 */
import {
  FLIP_STAGGER_MS,
  FLIP_TOTAL_MS,
  type FlipDirection,
} from './types';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export interface CascadeHandles {
  cancel: () => void;
  done: Promise<void>;
}

export interface RunCascadeOpts {
  stage: HTMLElement;
  direction: FlipDirection;
  skyLayer: HTMLElement | null;
  bauhausLayer: HTMLElement | null;
  hudRoot: HTMLElement | null;
  onComplete?: () => void;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function rectOf(el: Element): DOMRect {
  return el.getBoundingClientRect();
}

function makeOverlayRoot(stage: HTMLElement): HTMLElement {
  const root = document.createElement('div');
  root.className = 'ac-cascade-overlay';
  root.setAttribute('aria-hidden', 'true');
  const sr = stage.getBoundingClientRect();
  Object.assign(root.style, {
    position: 'fixed',
    left: `${sr.left}px`,
    top: `${sr.top}px`,
    width: `${sr.width}px`,
    height: `${sr.height}px`,
    perspective: '1280px',
    perspectiveOrigin: '50% 38%',
    pointerEvents: 'none',
    zIndex: '80',
    overflow: 'visible',
  });
  document.body.appendChild(root);
  return root;
}

function cloneHudActor(
  source: HTMLElement,
  overlay: HTMLElement,
  stageRect: DOMRect,
): HTMLElement {
  const r = rectOf(source);
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  clone.setAttribute('aria-hidden', 'true');
  clone.classList.add('ac-cascade-clone');
  Object.assign(clone.style, {
    position: 'absolute',
    left: `${r.left - stageRect.left}px`,
    top: `${r.top - stageRect.top}px`,
    width: `${Math.max(r.width, 8)}px`,
    height: `${Math.max(r.height, 8)}px`,
    margin: '0',
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    willChange: 'transform, opacity, filter',
    transformOrigin: '50% 50%',
    zIndex: '3',
    boxShadow: '0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.2)',
  });
  overlay.appendChild(clone);
  return clone;
}

function spawnSkyTiles(
  canvas: HTMLCanvasElement | null,
  skyLayer: HTMLElement,
  overlay: HTMLElement,
  stageRect: DOMRect,
  cols: number,
  rows: number,
): HTMLElement[] {
  const skyRect = rectOf(skyLayer);
  const tiles: HTMLElement[] = [];
  let url = '';
  try {
    if (canvas && canvas.width > 0 && canvas.height > 0) {
      url = canvas.toDataURL('image/jpeg', 0.82);
    }
  } catch {
    url = '';
  }

  const tw = skyRect.width / cols;
  const th = skyRect.height / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile = document.createElement('div');
      tile.className = 'ac-cascade-sky-tile ac-cascade-clone';
      const left = skyRect.left - stageRect.left + col * tw;
      const top = skyRect.top - stageRect.top + row * th;
      Object.assign(tile.style, {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${tw + 0.8}px`,
        height: `${th + 0.8}px`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity, filter',
        transformOrigin: '50% 50%',
        borderRadius: '4px',
        boxShadow:
          'inset 0 0 0 1px rgba(212,175,55,0.28), 0 4px 14px rgba(0,0,0,0.4)',
        backgroundColor: '#161822',
        zIndex: '1',
        overflow: 'hidden',
      });
      if (url) {
        tile.style.backgroundImage = `url(${url})`;
        tile.style.backgroundSize = `${skyRect.width}px ${skyRect.height}px`;
        tile.style.backgroundPosition = `-${col * tw}px -${row * th}px`;
      } else {
        const g = 20 + ((row * cols + col) % 6) * 5;
        tile.style.background = `linear-gradient(145deg, rgb(${g + 10},${g + 8},${g}), #0B0C10)`;
      }
      overlay.appendChild(tile);
      tiles.push(tile);
    }
  }
  return tiles;
}

/** Synthetic rim wedges — metal panels peeling off the dial ring. */
function spawnRimWedges(
  skyLayer: HTMLElement,
  overlay: HTMLElement,
  stageRect: DOMRect,
  count: number,
): HTMLElement[] {
  const skyRect = rectOf(skyLayer);
  const cx = skyRect.left - stageRect.left + skyRect.width / 2;
  const cy = skyRect.top - stageRect.top + skyRect.height / 2;
  const R = Math.min(skyRect.width, skyRect.height) * 0.42;
  const wedges: HTMLElement[] = [];
  for (let i = 0; i < count; i++) {
    const a0 = -Math.PI / 2 + (i / count) * Math.PI * 2;
    const a1 = -Math.PI / 2 + ((i + 1) / count) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const w = document.createElement('div');
    w.className = 'ac-cascade-rim ac-cascade-clone';
    const size = R * 0.55;
    Object.assign(w.style, {
      position: 'absolute',
      left: `${cx + Math.cos(am) * R * 0.82 - size / 2}px`,
      top: `${cy + Math.sin(am) * R * 0.82 - size / 2}px`,
      width: `${size}px`,
      height: `${size * 0.42}px`,
      borderRadius: '3px',
      background:
        'linear-gradient(90deg, rgba(212,175,55,0.35), rgba(22,24,34,0.92), rgba(212,175,55,0.2))',
      boxShadow:
        'inset 0 0 0 1px rgba(212,175,55,0.45), 0 2px 10px rgba(0,0,0,0.5)',
      transform: `rotate(${(am * 180) / Math.PI + 90}deg)`,
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden',
      willChange: 'transform, opacity, filter',
      zIndex: '2',
    });
    overlay.appendChild(w);
    wedges.push(w);
  }
  return wedges;
}

function targetPoint(
  stageRect: DOMRect,
  index: number,
  total: number,
  kind: 'hud' | 'sky' | 'rim',
): { x: number; y: number; rotY: number; rotX: number; z: number; scale: number } {
  const cx = stageRect.width * 0.5;
  const cy = stageRect.height * 0.34;
  const t = total <= 1 ? 0 : index / (total - 1);
  if (kind === 'rim') {
    const angle = -Math.PI / 2 + t * Math.PI * 2;
    const r = Math.min(stageRect.width, stageRect.height) * 0.28;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      rotY: index % 2 === 0 ? 62 : -62,
      rotX: 28,
      z: 40,
      scale: 0.55,
    };
  }
  if (kind === 'sky') {
    const angle = -Math.PI / 2 + t * Math.PI * 2 * 0.85;
    const r = Math.min(stageRect.width, stageRect.height) * (0.12 + (index % 3) * 0.05);
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r * 0.9,
      rotY: index % 2 === 0 ? 58 : -58,
      rotX: 32 + (index % 3) * 6,
      z: 20 - (index % 4) * 8,
      scale: 0.38 + (index % 3) * 0.04,
    };
  }
  const slot = index % 12;
  const angle = -Math.PI / 2 + (slot / 12) * Math.PI * 2;
  const r = Math.min(stageRect.width, stageRect.height) * (0.06 + (index < 2 ? 0.04 : 0.18));
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r * 0.88,
    rotY: index % 2 === 0 ? 48 : -48,
    rotX: 36,
    z: 30 - index * 3,
    scale: index < 2 ? 0.48 : index < 9 ? 0.28 : 0.4,
  };
}

function animateClone(
  clone: HTMLElement,
  from: { left: number; top: number; w: number; h: number },
  to: ReturnType<typeof targetPoint>,
  delay: number,
  direction: FlipDirection,
  duration: number,
  baseRotate = 0,
): Animation {
  const dx = to.x - from.left - from.w / 2;
  const dy = to.y - from.top - from.h / 2;
  const midX = dx * 0.4;
  const midY = dy * 0.35 - 36;
  const sign = dx >= 0 ? 1 : -1;

  const atRest = {
    transform: `translate3d(0px,0px,0px) rotateZ(${baseRotate}deg) rotateX(0deg) rotateY(0deg) scale(1)`,
    opacity: '1',
    filter: 'brightness(1) blur(0px)',
  };
  /* Stay readable — never hit ~90° edge-on while still opaque. */
  const mid = {
    transform: `translate3d(${midX}px, ${midY}px, 110px) rotateZ(${baseRotate}deg) rotateX(22deg) rotateY(${sign * 48}deg) scale(0.82)`,
    opacity: '1',
    filter: 'brightness(1.55) blur(0.35px)',
    offset: 0.38,
  };
  const atClock = {
    transform: `translate3d(${dx}px, ${dy}px, ${to.z}px) rotateZ(${baseRotate}deg) rotateX(${to.rotX}deg) rotateY(${to.rotY}deg) scale(${to.scale})`,
    opacity: '0',
    filter: 'brightness(1.25) blur(0.8px)',
  };

  const keyframes =
    direction === 'to-bauhaus'
      ? [atRest, mid, atClock]
      : [atClock, { ...mid, offset: 0.4 }, atRest];

  return clone.animate(keyframes, {
    duration,
    delay,
    easing: EASE,
    fill: 'forwards',
  });
}

function measureLocal(el: HTMLElement, stageRect: DOMRect) {
  const r = el.getBoundingClientRect();
  return {
    left: r.left - stageRect.left,
    top: r.top - stageRect.top,
    w: r.width,
    h: r.height,
  };
}

export function runPieceCascade(opts: RunCascadeOpts): CascadeHandles {
  const { stage, direction, skyLayer, bauhausLayer, hudRoot, onComplete } = opts;
  const animations: Animation[] = [];
  let overlay: HTMLElement | null = null;
  let cancelled = false;
  const hidden: HTMLElement[] = [];
  const timers: number[] = [];

  const finish = () => {
    if (cancelled) return;
    cancelled = true;
    overlay?.remove();
    overlay = null;
    for (const el of hidden) {
      el.style.visibility = '';
      el.style.pointerEvents = '';
      el.style.opacity = '';
    }
    if (bauhausLayer) {
      bauhausLayer.style.opacity = '';
      bauhausLayer.style.transform = '';
      bauhausLayer.style.filter = '';
      bauhausLayer.style.transformOrigin = '';
    }
    onComplete?.();
  };

  if (prefersReducedMotion()) {
    const t = window.setTimeout(finish, 20);
    timers.push(t);
    return {
      cancel: () => {
        cancelled = true;
        timers.forEach((id) => window.clearTimeout(id));
      },
      done: Promise.resolve(),
    };
  }

  const stageRect = rectOf(stage);
  overlay = makeOverlayRoot(stage);

  const hudActors = hudRoot
    ? Array.from(hudRoot.querySelectorAll<HTMLElement>('[data-ac-actor]'))
    : [];

  const canvas = skyLayer?.querySelector('canvas') as HTMLCanvasElement | null;
  const skyTiles =
    skyLayer != null
      ? spawnSkyTiles(canvas, skyLayer, overlay, stageRect, 5, 4)
      : [];
  const rimWedges =
    skyLayer != null ? spawnRimWedges(skyLayer, overlay, stageRect, 10) : [];

  const cx = stageRect.width / 2;
  const cy = stageRect.height * 0.34;
  const ranked = skyTiles
    .map((tile) => {
      const r = tile.getBoundingClientRect();
      const tx = r.left - stageRect.left + r.width / 2;
      const ty = r.top - stageRect.top + r.height / 2;
      return { tile, dist: Math.hypot(tx - cx, ty - cy) };
    })
    .sort((a, b) => b.dist - a.dist);

  if (skyLayer) {
    skyLayer.style.visibility = 'hidden';
    hidden.push(skyLayer);
  }

  if (bauhausLayer) {
    bauhausLayer.style.transformOrigin = '50% 38%';
    if (direction === 'to-bauhaus') {
      animations.push(
        bauhausLayer.animate(
          [
            {
              opacity: 0,
              transform: 'scale(0.62) rotateY(-36deg) translateZ(-70px)',
              filter: 'brightness(1.65)',
            },
            {
              opacity: 0.35,
              transform: 'scale(0.82) rotateY(-12deg) translateZ(-20px)',
              filter: 'brightness(1.3)',
              offset: 0.45,
            },
            {
              opacity: 1,
              transform: 'scale(1) rotateY(0deg) translateZ(0px)',
              filter: 'brightness(1)',
            },
          ],
          {
            duration: FLIP_TOTAL_MS * 0.78,
            delay: FLIP_TOTAL_MS * 0.22,
            easing: EASE,
            fill: 'forwards',
          },
        ),
      );
    } else {
      animations.push(
        bauhausLayer.animate(
          [
            {
              opacity: 1,
              transform: 'scale(1) rotateY(0deg)',
              filter: 'brightness(1)',
            },
            {
              opacity: 0,
              transform: 'scale(0.7) rotateY(38deg) translateZ(-50px)',
              filter: 'brightness(1.45)',
            },
          ],
          {
            duration: FLIP_TOTAL_MS * 0.5,
            delay: 0,
            easing: EASE,
            fill: 'forwards',
          },
        ),
      );
    }
  }

  /* Rim leads the wave (outer metal). */
  rimWedges.forEach((el, i) => {
    const from = measureLocal(el, stageRect);
    const to = targetPoint(stageRect, i, rimWedges.length, 'rim');
    const delay =
      direction === 'to-bauhaus'
        ? i * (FLIP_STAGGER_MS * 0.55)
        : (rimWedges.length - 1 - i) * (FLIP_STAGGER_MS * 0.55) + 60;
    const baseRot = Number.parseFloat(el.style.transform.replace(/[^\d.-]/g, '')) || 0;
    /* extract rotate deg from inline if present */
    const m = /rotate\((-?[\d.]+)deg\)/.exec(el.style.transform);
    const base = m ? Number(m[1]) : 0;
    animations.push(
      animateClone(el, from, to, delay, direction, FLIP_TOTAL_MS * 0.72, base),
    );
  });

  ranked.forEach((item, rank) => {
    const from = measureLocal(item.tile, stageRect);
    const to = targetPoint(stageRect, rank, ranked.length, 'sky');
    const delay =
      direction === 'to-bauhaus'
        ? 80 + rank * (FLIP_STAGGER_MS * 0.58)
        : (ranked.length - 1 - rank) * (FLIP_STAGGER_MS * 0.58) + 100;
    animations.push(
      animateClone(item.tile, from, to, delay, direction, FLIP_TOTAL_MS * 0.74),
    );
  });

  hudActors.forEach((el, i) => {
    const order = Number(el.dataset.acOrder ?? i);
    const clone = cloneHudActor(el, overlay!, stageRect);
    const from = measureLocal(el, stageRect);
    const to = targetPoint(stageRect, order, Math.max(hudActors.length, 12), 'hud');
    const delay =
      direction === 'to-bauhaus'
        ? 120 + order * FLIP_STAGGER_MS
        : (hudActors.length - 1 - order) * FLIP_STAGGER_MS + 160;
    animations.push(
      animateClone(clone, from, to, delay, direction, FLIP_TOTAL_MS * 0.8),
    );
  });

  /* Hide HUD chrome after clones are measured/positioned. */
  if (hudRoot) {
    hudRoot.style.visibility = 'hidden';
    hudRoot.style.pointerEvents = 'none';
    hidden.push(hudRoot);
  }

  if (direction === 'to-sky' && skyLayer) {
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        skyLayer.style.visibility = '';
      }, FLIP_TOTAL_MS * 0.68),
    );
  }
  if (direction === 'to-sky' && hudRoot) {
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        hudRoot.style.visibility = '';
        hudRoot.style.pointerEvents = '';
      }, FLIP_TOTAL_MS * 0.75),
    );
  }

  const done = Promise.all(
    animations.map(
      (a) =>
        new Promise<void>((resolve) => {
          a.addEventListener('finish', () => resolve());
          a.addEventListener('cancel', () => resolve());
        }),
    ),
  )
    .then(
      () =>
        new Promise<void>((r) => {
          const id = window.setTimeout(r, 40);
          timers.push(id);
        }),
    )
    .then(() => finish());

  timers.push(window.setTimeout(() => finish(), FLIP_TOTAL_MS + 260));

  return {
    cancel: () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      animations.forEach((a) => a.cancel());
      overlay?.remove();
      for (const el of hidden) {
        el.style.visibility = '';
        el.style.pointerEvents = '';
        el.style.opacity = '';
      }
      if (bauhausLayer) {
        bauhausLayer.style.opacity = '';
        bauhausLayer.style.transform = '';
        bauhausLayer.style.filter = '';
        bauhausLayer.style.transformOrigin = '';
      }
    },
    done: done.then(() => undefined),
  };
}
