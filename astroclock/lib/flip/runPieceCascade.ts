/**
 * Segment cascade: clone HUD actors + sky dial tile slices into a perspective
 * overlay, WAAPI them toward (or from) the Bauhaus silhouette, then tear down.
 * Originals stay in layout (visibility:hidden) so nothing jumps.
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
    perspective: '1200px',
    perspectiveOrigin: '50% 40%',
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
    width: `${r.width}px`,
    height: `${r.height}px`,
    margin: '0',
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    willChange: 'transform, opacity, filter',
    transformOrigin: '50% 50%',
    zIndex: '2',
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
      url = canvas.toDataURL('image/jpeg', 0.75);
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
        width: `${tw + 0.6}px`,
        height: `${th + 0.6}px`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity, filter',
        transformOrigin: '50% 50%',
        borderRadius: '3px',
        boxShadow:
          'inset 0 0 0 1px rgba(212,175,55,0.14), 0 2px 8px rgba(0,0,0,0.35)',
        backgroundColor: '#12141c',
        zIndex: '1',
        overflow: 'hidden',
      });
      if (url) {
        tile.style.backgroundImage = `url(${url})`;
        tile.style.backgroundSize = `${skyRect.width}px ${skyRect.height}px`;
        tile.style.backgroundPosition = `-${col * tw}px -${row * th}px`;
      } else {
        const g = 16 + ((row * cols + col) % 6) * 4;
        tile.style.background = `linear-gradient(145deg, rgb(${g},${g + 2},${g + 10}), #0B0C10)`;
      }
      overlay.appendChild(tile);
      tiles.push(tile);
    }
  }
  return tiles;
}

function targetPoint(
  stageRect: DOMRect,
  index: number,
  total: number,
  kind: 'hud' | 'sky',
): { x: number; y: number; rotY: number; rotX: number; z: number; scale: number } {
  const cx = stageRect.width * 0.5;
  const cy = stageRect.height * 0.36;
  const t = total <= 1 ? 0 : index / (total - 1);
  if (kind === 'sky') {
    const angle = -Math.PI / 2 + t * Math.PI * 2 * 0.9;
    const r = Math.min(stageRect.width, stageRect.height) * (0.2 + (index % 3) * 0.045);
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r * 0.92,
      rotY: 180 + (index % 2 === 0 ? 28 : -28),
      rotX: 52 + (index % 3) * 10,
      z: -36 - (index % 4) * 14,
      scale: 0.26 + (index % 3) * 0.05,
    };
  }
  const slot = index % 12;
  const angle = -Math.PI / 2 + (slot / 12) * Math.PI * 2;
  const r = Math.min(stageRect.width, stageRect.height) * (0.07 + (index < 2 ? 0.03 : 0.17));
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r * 0.88,
    rotY: 180 + (index % 2 === 0 ? 42 : -42),
    rotX: 68,
    z: -18 - index * 5,
    scale: index < 2 ? 0.4 : index < 9 ? 0.2 : 0.32,
  };
}

function animateClone(
  clone: HTMLElement,
  from: { left: number; top: number; w: number; h: number },
  to: ReturnType<typeof targetPoint>,
  delay: number,
  direction: FlipDirection,
  duration: number,
): Animation {
  const dx = to.x - from.left - from.w / 2;
  const dy = to.y - from.top - from.h / 2;
  const midX = dx * 0.45;
  const midY = dy * 0.45 - 28;

  const atRest = {
    transform: 'translate3d(0px,0px,0px) rotateX(0deg) rotateY(0deg) scale(1)',
    opacity: '1',
    filter: 'brightness(1) blur(0px)',
  };
  const atClock = {
    transform: `translate3d(${dx}px, ${dy}px, ${to.z}px) rotateX(${to.rotX}deg) rotateY(${to.rotY}deg) scale(${to.scale})`,
    opacity: '0',
    filter: 'brightness(1.4) blur(1.2px)',
  };
  const mid = {
    transform: `translate3d(${midX}px, ${midY}px, 90px) rotateX(38deg) rotateY(${direction === 'to-bauhaus' ? 100 : -100}deg) scale(0.7)`,
    opacity: '0.9',
    filter: 'brightness(1.6) blur(0.45px)',
    offset: 0.42,
  };

  const keyframes =
    direction === 'to-bauhaus'
      ? [atRest, mid, atClock]
      : [atClock, { ...mid, offset: 0.42 }, atRest];

  return clone.animate(keyframes, {
    duration,
    delay,
    easing: EASE,
    fill: 'forwards',
  });
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
      ? spawnSkyTiles(canvas, skyLayer, overlay, stageRect, 4, 3)
      : [];

  const cx = stageRect.width / 2;
  const cy = stageRect.height * 0.36;
  const ranked = skyTiles
    .map((tile) => {
      const r = tile.getBoundingClientRect();
      const tx = r.left - stageRect.left + r.width / 2;
      const ty = r.top - stageRect.top + r.height / 2;
      return { tile, dist: Math.hypot(tx - cx, ty - cy) };
    })
    .sort((a, b) => b.dist - a.dist);

  for (const a of hudActors) {
    a.style.visibility = 'hidden';
    a.style.pointerEvents = 'none';
    hidden.push(a);
  }
  if (skyLayer) {
    skyLayer.style.visibility = 'hidden';
    hidden.push(skyLayer);
  }

  if (bauhausLayer) {
    bauhausLayer.style.transformOrigin = '50% 40%';
    if (direction === 'to-bauhaus') {
      animations.push(
        bauhausLayer.animate(
          [
            {
              opacity: 0,
              transform: 'scale(0.52) rotateY(-52deg) translateZ(-90px)',
              filter: 'brightness(1.7)',
            },
            {
              opacity: 1,
              transform: 'scale(1) rotateY(0deg) translateZ(0px)',
              filter: 'brightness(1)',
            },
          ],
          {
            duration: FLIP_TOTAL_MS * 0.7,
            delay: FLIP_TOTAL_MS * 0.3,
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
              transform: 'scale(0.58) rotateY(46deg) translateZ(-70px)',
              filter: 'brightness(1.5)',
            },
          ],
          {
            duration: FLIP_TOTAL_MS * 0.52,
            delay: 0,
            easing: EASE,
            fill: 'forwards',
          },
        ),
      );
    }
  }

  hudActors.forEach((el, i) => {
    const order = Number(el.dataset.acOrder ?? i);
    const clone = cloneHudActor(el, overlay!, stageRect);
    const r = rectOf(el);
    const from = {
      left: r.left - stageRect.left,
      top: r.top - stageRect.top,
      w: r.width,
      h: r.height,
    };
    const to = targetPoint(stageRect, order, Math.max(hudActors.length, 12), 'hud');
    const delay =
      direction === 'to-bauhaus'
        ? order * FLIP_STAGGER_MS
        : (hudActors.length - 1 - order) * FLIP_STAGGER_MS + 140;
    animations.push(
      animateClone(clone, from, to, delay, direction, FLIP_TOTAL_MS * 0.78),
    );
  });

  ranked.forEach((item, rank) => {
    const r = item.tile.getBoundingClientRect();
    const from = {
      left: r.left - stageRect.left,
      top: r.top - stageRect.top,
      w: r.width,
      h: r.height,
    };
    const to = targetPoint(stageRect, rank, ranked.length, 'sky');
    const delay =
      direction === 'to-bauhaus'
        ? rank * (FLIP_STAGGER_MS * 0.62)
        : (ranked.length - 1 - rank) * (FLIP_STAGGER_MS * 0.62) + 90;
    animations.push(
      animateClone(item.tile, from, to, delay, direction, FLIP_TOTAL_MS * 0.7),
    );
  });

  if (direction === 'to-sky' && skyLayer) {
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        skyLayer.style.visibility = '';
      }, FLIP_TOTAL_MS * 0.7),
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
          const id = window.setTimeout(r, 48);
          timers.push(id);
        }),
    )
    .then(() => finish());

  timers.push(window.setTimeout(() => finish(), FLIP_TOTAL_MS + 240));

  return {
    cancel: () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      animations.forEach((a) => a.cancel());
      overlay?.remove();
      for (const el of hidden) {
        el.style.visibility = '';
        el.style.pointerEvents = '';
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
