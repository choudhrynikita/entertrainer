/**
 * In-place dual-face tile flip: each piece rotates ~180° around its own center.
 * Parallax = staggered delay only — no scatter / fly-apart translation.
 */
import {
  FLIP_STAGGER_MS,
  FLIP_TOTAL_MS,
  type FlipDirection,
} from './types';

const EASE = 'cubic-bezier(0.37, 0, 0.63, 1)'; /* ease-in-out — readable mid-flip */
const TILE_MS = 860;
const Z_PULSE = 4; /* ≤8px optional depth pulse */

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

function snapshotCanvas(root: HTMLElement | null): string {
  if (!root) return '';
  const canvas = root.querySelector('canvas');
  if (!canvas || canvas.width <= 0 || canvas.height <= 0) return '';
  try {
    return canvas.toDataURL('image/jpeg', 0.88);
  } catch {
    return '';
  }
}

function makeOverlayRoot(stage: HTMLElement): HTMLElement {
  const root = document.createElement('div');
  root.className = 'ac-cascade-overlay ac-inplace-overlay';
  root.setAttribute('aria-hidden', 'true');
  const sr = stage.getBoundingClientRect();
  Object.assign(root.style, {
    position: 'fixed',
    left: `${sr.left}px`,
    top: `${sr.top}px`,
    width: `${sr.width}px`,
    height: `${sr.height}px`,
    perspective: '1400px',
    perspectiveOrigin: '50% 42%',
    pointerEvents: 'none',
    zIndex: '80',
    overflow: 'visible',
  });
  document.body.appendChild(root);
  return root;
}

function faceStyles(extra: Record<string, string> = {}): Record<string, string> {
  /* Do NOT set overflow:hidden here — it breaks backface-visibility in Chromium. */
  return {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: 'inherit',
    ...extra,
  };
}

/** Dual-face tile locked to its home seat — rotateY only (+ tiny Z pulse). */
function makeDualTile(opts: {
  overlay: HTMLElement;
  left: number;
  top: number;
  width: number;
  height: number;
  frontBg: string;
  backBg: string;
  borderRadius?: string;
  zIndex?: number;
  className?: string;
}): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = `ac-inplace-tile ${opts.className ?? ''}`.trim();
  Object.assign(wrap.style, {
    position: 'absolute',
    left: `${opts.left}px`,
    top: `${opts.top}px`,
    width: `${Math.max(opts.width, 4)}px`,
    height: `${Math.max(opts.height, 4)}px`,
    margin: '0',
    transformStyle: 'preserve-3d',
    WebkitTransformStyle: 'preserve-3d',
    transformOrigin: '50% 50%',
    willChange: 'transform',
    zIndex: String(opts.zIndex ?? 2),
    borderRadius: opts.borderRadius ?? '3px',
  });

  const front = document.createElement('div');
  front.className = 'ac-inplace-face ac-inplace-front';
  Object.assign(front.style, faceStyles({
    transform: 'rotateY(0deg) translateZ(1px)',
    boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.22)',
  }));
  applyBg(front, opts.frontBg);

  const back = document.createElement('div');
  back.className = 'ac-inplace-face ac-inplace-back';
  Object.assign(back.style, faceStyles({
    transform: 'rotateY(180deg) translateZ(1px)',
    boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.18)',
  }));
  applyBg(back, opts.backBg);

  wrap.appendChild(front);
  wrap.appendChild(back);
  /* Default: front visible, back hidden until flip (to-sky overrides via WAAPI fill:both). */
  back.style.opacity = '0';
  opts.overlay.appendChild(wrap);
  return wrap;
}

function cropBg(
  url: string,
  fullW: number,
  fullH: number,
  col: number,
  row: number,
  cols: number,
  rows: number,
  fallback: string,
  cssVar?: '--ac-sky-shot' | '--ac-bau-shot',
): string {
  if (!url || fullW <= 0 || fullH <= 0) return fallback;
  const tw = fullW / cols;
  const th = fullH / rows;
  return JSON.stringify({
    image: cssVar ? `var(${cssVar})` : `url(${url})`,
    position: `${-col * tw}px ${-row * th}px`,
    size: `${fullW}px ${fullH}px`,
    repeat: 'no-repeat',
  });
}

function applyBg(el: HTMLElement, spec: string) {
  if (spec.startsWith('{')) {
    try {
      const o = JSON.parse(spec) as {
        image: string;
        position: string;
        size: string;
        repeat: string;
      };
      el.style.backgroundImage = o.image;
      el.style.backgroundPosition = o.position;
      el.style.backgroundSize = o.size;
      el.style.backgroundRepeat = o.repeat;
      return;
    } catch {
      /* fall through */
    }
  }
  el.style.background = spec;
}

function spawnDialGrid(opts: {
  overlay: HTMLElement;
  stageRect: DOMRect;
  dialEl: HTMLElement;
  skyUrl: string;
  bauUrl: string;
  cols: number;
  rows: number;
}): { tiles: HTMLElement[]; delays: number[] } {
  const { overlay, stageRect, dialEl, skyUrl, bauUrl, cols, rows } = opts;
  const dr = rectOf(dialEl);
  const tiles: HTMLElement[] = [];
  const delays: number[] = [];
  const tw = dr.width / cols;
  const th = dr.height / rows;
  const cx = cols / 2 - 0.5;
  const cy = rows / 2 - 0.5;

  type Cell = { col: number; row: number; ring: number };
  const cells: Cell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const ring = Math.max(Math.abs(col - cx), Math.abs(row - cy));
      cells.push({ col, row, ring });
    }
  }
  /* Outer ring leads (Transformers peel), inner trails. */
  cells.sort((a, b) => a.ring - b.ring || a.row - b.row || a.col - b.col);

  const maxRing = cells.reduce((m, c) => Math.max(m, c.ring), 0) || 1;

  cells.forEach((cell, i) => {
    const { col, row, ring } = cell;
    const left = dr.left - stageRect.left + col * tw;
    const top = dr.top - stageRect.top + row * th;
    const g = 18 + ((row * cols + col) % 5) * 4;
    const skyFallback = `linear-gradient(145deg, rgb(${g + 12},${g + 10},${g + 28}), #0B0C10)`;
    const bauFallback = `linear-gradient(160deg, #1a1c28, #12141c ${40 + (i % 4) * 8}%, #161822)`;

    const tile = makeDualTile({
      overlay,
      left,
      top,
      width: tw + 0.6,
      height: th + 0.6,
      frontBg: cropBg(skyUrl, dr.width, dr.height, col, row, cols, rows, skyFallback, '--ac-sky-shot'),
      backBg: cropBg(bauUrl, dr.width, dr.height, col, row, cols, rows, bauFallback, '--ac-bau-shot'),
      borderRadius: '2px',
      zIndex: 2,
      className: 'ac-inplace-dial',
    });
    tiles.push(tile);
    /* Ring-index stagger ~55–70ms */
    delays.push(Math.round((ring / maxRing) * (FLIP_STAGGER_MS * (cols + rows) * 0.55) + (i % 3) * 8));
  });

  return { tiles, delays };
}

/** Rim arc tiles — front = sky rim crop, back = ribbon-colored wedge. */
function spawnRimTiles(opts: {
  overlay: HTMLElement;
  stageRect: DOMRect;
  dialEl: HTMLElement;
  skyUrl: string;
  count: number;
}): { tiles: HTMLElement[]; delays: number[] } {
  const { overlay, stageRect, dialEl, skyUrl, count } = opts;
  const dr = rectOf(dialEl);
  const cx = dr.left - stageRect.left + dr.width / 2;
  const cy = dr.top - stageRect.top + dr.height / 2;
  const R = Math.min(dr.width, dr.height) * 0.48;
  const ribbon = ['#81C784', '#D4AF37', '#E57373', '#81C784', '#D4AF37', '#E57373', '#81C784', '#D4AF37', '#E57373', '#D4AF37'];
  const tiles: HTMLElement[] = [];
  const delays: number[] = [];

  for (let i = 0; i < count; i++) {
    const a0 = -Math.PI / 2 + (i / count) * Math.PI * 2;
    const a1 = -Math.PI / 2 + ((i + 1) / count) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const sizeW = R * 0.42;
    const sizeH = R * 0.28;
    const left = cx + Math.cos(am) * R * 0.92 - sizeW / 2;
    const top = cy + Math.sin(am) * R * 0.92 - sizeH / 2;

    const skyFallback = 'linear-gradient(90deg, rgba(212,175,55,0.3), #161822)';
    let frontBg = skyFallback;
    if (skyUrl) {
      /* Approximate rim crop from dial snapshot */
      const fx = (Math.cos(am) * 0.42 + 0.5) * dr.width;
      const fy = (Math.sin(am) * 0.42 + 0.5) * dr.height;
      frontBg = `url(${skyUrl}) ${-(fx - sizeW / 2)}px ${-(fy - sizeH / 2)}px / ${dr.width}px ${dr.height}px no-repeat`;
    }
    const backBg = `linear-gradient(90deg, ${ribbon[i % ribbon.length]}cc, ${ribbon[i % ribbon.length]}66)`;

    const tile = makeDualTile({
      overlay,
      left,
      top,
      width: sizeW,
      height: sizeH,
      frontBg,
      backBg,
      borderRadius: '4px',
      zIndex: 3,
      className: 'ac-inplace-rim',
    });

    tiles.push(tile);
    delays.push(i * Math.round(FLIP_STAGGER_MS * 0.5));
  }
  return { tiles, delays };
}

function hudBackBackground(piece: string | undefined, order: number): string {
  const GOLD = '#D4AF37';
  const FACE = '#161822';
  if (piece === 'maha' || order === 0) {
    return `linear-gradient(180deg, ${FACE}, #12141c), linear-gradient(90deg, transparent 20%, ${GOLD}33 50%, transparent 80%)`;
  }
  if (piece === 'tithi' || order === 1) {
    return `linear-gradient(180deg, ${FACE}, #12141c)`;
  }
  if (piece?.startsWith('graha') || (order >= 2 && order <= 8)) {
    const colors = ['#81C784', '#D4AF37', '#E57373'];
    const c = colors[order % 3];
    return `linear-gradient(135deg, ${c}55, ${FACE})`;
  }
  if (piece === 'harmonic' || order === 9) {
    return `linear-gradient(180deg, #12141c, ${FACE})`;
  }
  if (piece === 'live' || order === 10) {
    return `linear-gradient(180deg, ${FACE}, #0B0C10)`;
  }
  /* scrub → sky dial strip */
  return `linear-gradient(180deg, ${FACE} 0%, #12141c 100%)`;
}

function spawnHudTiles(opts: {
  overlay: HTMLElement;
  stageRect: DOMRect;
  hudRoot: HTMLElement;
  pageRect: DOMRect;
}): { tiles: HTMLElement[]; delays: number[] } {
  const actors = Array.from(
    opts.hudRoot.querySelectorAll<HTMLElement>('[data-ac-actor]'),
  );
  const tiles: HTMLElement[] = [];
  const delays: number[] = [];

  /* Overlay is stage-sized; HUD sits below stage — extend overlay via fixed page coords. */
  actors.forEach((el, i) => {
    const order = Number(el.dataset.acOrder ?? i);
    const r = rectOf(el);
    const left = r.left - opts.stageRect.left;
    const top = r.top - opts.stageRect.top;

    const wrap = document.createElement('div');
    wrap.className = 'ac-inplace-tile ac-inplace-hud';
    Object.assign(wrap.style, {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      width: `${Math.max(r.width, 8)}px`,
      height: `${Math.max(r.height, 8)}px`,
      transformStyle: 'preserve-3d',
      WebkitTransformStyle: 'preserve-3d',
      transformOrigin: '50% 50%',
      willChange: 'transform, opacity',
      zIndex: '5',
      borderRadius: getComputedStyle(el).borderRadius || '8px',
    });

    const front = document.createElement('div');
    front.className = 'ac-inplace-face ac-inplace-front';
    const clone = el.cloneNode(true) as HTMLElement;
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    clone.style.width = '100%';
    clone.style.height = '100%';
    clone.style.margin = '0';
    clone.style.pointerEvents = 'none';
    Object.assign(front.style, faceStyles({
      transform: 'rotateY(0deg) translateZ(1px)',
      background: 'rgba(18,20,28,0.95)',
      boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
    }));
    front.appendChild(clone);

    const back = document.createElement('div');
    back.className = 'ac-inplace-face ac-inplace-back';
    const piece = el.dataset.piece;
    Object.assign(back.style, faceStyles({
      transform: 'rotateY(180deg) translateZ(1px)',
      background: hudBackBackground(piece, order),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
    }));
    const label = document.createElement('div');
    label.style.cssText =
      'font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(224,226,236,0.55);text-align:center;padding:4px';
    if (piece === 'maha' || order === 0) label.textContent = 'Today';
    else if (piece === 'tithi' || order === 1) label.textContent = 'Stretches';
    else if (piece === 'harmonic' || order === 9) label.textContent = 'Good · Mid · Hard';
    else if (piece === 'live' || order === 10) label.textContent = 'Sky';
    else if (piece === 'scrub' || order === 11) label.textContent = 'Sky dial';
    else label.textContent = '';
    back.appendChild(label);

    wrap.appendChild(front);
    wrap.appendChild(back);
    back.style.opacity = '0';
    opts.overlay.appendChild(wrap);
    tiles.push(wrap);
    delays.push(90 + order * FLIP_STAGGER_MS);
  });

  void opts.pageRect;
  return { tiles, delays };
}

function animateInPlace(
  tile: HTMLElement,
  delay: number,
  direction: FlipDirection,
  duration: number,
  bucket: Animation[],
  baseRotZ = 0,
): Animation {
  const zPrefix = baseRotZ ? `rotateZ(${baseRotZ}deg) ` : '';
  const startY = direction === 'to-bauhaus' ? 0 : 180;
  const endY = direction === 'to-bauhaus' ? 180 : 360;
  const midY = (startY + endY) / 2;

  const front = tile.querySelector('.ac-inplace-front') as HTMLElement | null;
  const back = tile.querySelector('.ac-inplace-back') as HTMLElement | null;

  /* Opacity crossfade at the edge-on moment — avoids mirrored front bleed
     when backface-visibility flakes under WAAPI compositing. */
  if (front && back) {
    /* Hard swap at the meridian — never leave both faces transparent
       (that read as empty gold wireframes / fake scatter). */
    const frontOut =
      direction === 'to-bauhaus'
        ? [
            { opacity: '1', offset: 0 },
            { opacity: '1', offset: 0.49 },
            { opacity: '0', offset: 0.5 },
            { opacity: '0', offset: 1 },
          ]
        : [
            { opacity: '0', offset: 0 },
            { opacity: '0', offset: 0.49 },
            { opacity: '1', offset: 0.5 },
            { opacity: '1', offset: 1 },
          ];
    const backIn =
      direction === 'to-bauhaus'
        ? [
            { opacity: '0', offset: 0 },
            { opacity: '0', offset: 0.49 },
            { opacity: '1', offset: 0.5 },
            { opacity: '1', offset: 1 },
          ]
        : [
            { opacity: '1', offset: 0 },
            { opacity: '1', offset: 0.49 },
            { opacity: '0', offset: 0.5 },
            { opacity: '0', offset: 1 },
          ];
    bucket.push(front.animate(frontOut, { duration, delay, easing: 'linear', fill: 'both' }));
    bucket.push(back.animate(backIn, { duration, delay, easing: 'linear', fill: 'both' }));
  }

  const keyframes = [
    {
      transform: `${zPrefix}translateZ(0px) rotateY(${startY}deg)`,
      filter: 'brightness(1)',
      offset: 0,
    },
    {
      transform: `${zPrefix}translateZ(${Z_PULSE}px) rotateY(${midY}deg)`,
      filter: 'brightness(1.35)',
      offset: 0.5,
    },
    {
      transform: `${zPrefix}translateZ(0px) rotateY(${endY}deg)`,
      filter: 'brightness(1)',
      offset: 1,
    },
  ];

  return tile.animate(keyframes, {
    duration,
    delay,
    easing: EASE,
    fill: 'both',
  });
}

function dialSnapshotTarget(
  skyLayer: HTMLElement | null,
  bauhausLayer: HTMLElement | null,
): HTMLElement | null {
  const bauInner =
    bauhausLayer?.querySelector('.ac-dial-square-inner') as HTMLElement | null;
  if (bauInner) return bauInner;
  const skyInner =
    skyLayer?.querySelector('.ac-dial-square-inner') as HTMLElement | null;
  if (skyInner) return skyInner;
  const canvas =
    (skyLayer?.querySelector('canvas') as HTMLElement | null) ||
    (bauhausLayer?.querySelector('canvas') as HTMLElement | null);
  return canvas?.parentElement ?? skyLayer ?? bauhausLayer;
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
      bauhausLayer.style.visibility = '';
      bauhausLayer.style.filter = '';
    }
    if (skyLayer) {
      skyLayer.style.opacity = '';
      skyLayer.style.visibility = '';
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

  /* Extend overlay downward to cover HUD clones that sit below the stage. */
  if (hudRoot) {
    const hr = rectOf(hudRoot);
    const bottom = hr.bottom - stageRect.top;
    if (bottom > stageRect.height) {
      overlay.style.height = `${bottom + 8}px`;
    }
  }

  const skyUrl = snapshotCanvas(skyLayer);
  const bauUrl = snapshotCanvas(bauhausLayer);
  const dialEl = dialSnapshotTarget(skyLayer, bauhausLayer);
  if (skyUrl) overlay.style.setProperty('--ac-sky-shot', `url(${skyUrl})`);
  if (bauUrl) overlay.style.setProperty('--ac-bau-shot', `url(${bauUrl})`);

  const dialPack =
    dialEl != null
      ? spawnDialGrid({
          overlay,
          stageRect,
          dialEl,
          skyUrl,
          bauUrl,
          cols: 4,
          rows: 4,
        })
      : { tiles: [] as HTMLElement[], delays: [] as number[] };

  const rimPack =
    dialEl != null
      ? spawnRimTiles({
          overlay,
          stageRect,
          dialEl,
          skyUrl,
          count: 10,
        })
      : { tiles: [] as HTMLElement[], delays: [] as number[] };

  const hudPack = hudRoot
    ? spawnHudTiles({
        overlay,
        stageRect,
        hudRoot,
        pageRect: stageRect,
      })
    : { tiles: [] as HTMLElement[], delays: [] as number[] };

  /* Hide live layers — tiles carry the mosaic. */
  if (skyLayer) {
    skyLayer.style.visibility = 'hidden';
    hidden.push(skyLayer);
  }
  if (hudRoot) {
    hudRoot.style.visibility = 'hidden';
    hudRoot.style.pointerEvents = 'none';
    hidden.push(hudRoot);
  }

  /* Bauhaus sits under tiles without whole-layer rotateY (that squashed the circle). */
  if (bauhausLayer) {
    if (direction === 'to-bauhaus') {
      bauhausLayer.style.visibility = 'visible';
      animations.push(
        bauhausLayer.animate(
          [
            { opacity: 0, filter: 'brightness(1.2)' },
            { opacity: 1, filter: 'brightness(1)', offset: 1 },
          ],
          {
            duration: TILE_MS,
            delay: Math.round(FLIP_TOTAL_MS * 0.35),
            easing: EASE,
            fill: 'both',
          },
        ),
      );
    } else {
      animations.push(
        bauhausLayer.animate(
          [
            { opacity: 1, filter: 'brightness(1)' },
            { opacity: 0, filter: 'brightness(1.15)' },
          ],
          {
            duration: Math.round(TILE_MS * 0.7),
            delay: 40,
            easing: EASE,
            fill: 'both',
          },
        ),
      );
    }
  }

  const play = (
    tiles: HTMLElement[],
    delays: number[],
    reverseDelays: boolean,
  ) => {
    const n = tiles.length;
    tiles.forEach((tile, i) => {
      const d = reverseDelays
        ? (delays[n - 1 - i] ?? (n - 1 - i) * FLIP_STAGGER_MS)
        : (delays[i] ?? i * FLIP_STAGGER_MS);
      const base =
        (tile as HTMLElement & { __baseRot?: number }).__baseRot ?? 0;
      animations.push(animateInPlace(tile, d, direction, TILE_MS, animations, base));
    });
  };

  const reverse = direction === 'to-sky';
  /* Rim leads outward peel; dial wave; HUD trails. */
  play(rimPack.tiles, rimPack.delays, reverse);
  play(dialPack.tiles, dialPack.delays, reverse);
  play(
    hudPack.tiles,
    hudPack.delays,
    reverse,
  );

  if (direction === 'to-sky' && skyLayer) {
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        skyLayer.style.visibility = '';
      }, Math.round(FLIP_TOTAL_MS * 0.72)),
    );
  }
  if (direction === 'to-sky' && hudRoot) {
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        hudRoot.style.visibility = '';
        hudRoot.style.pointerEvents = '';
      }, Math.round(FLIP_TOTAL_MS * 0.78)),
    );
  }

  const maxDelay = Math.max(
    0,
    ...rimPack.delays,
    ...dialPack.delays,
    ...hudPack.delays,
  );
  const totalBudget = Math.max(FLIP_TOTAL_MS, maxDelay + TILE_MS + 80);

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

  timers.push(window.setTimeout(() => finish(), totalBudget + 120));

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
        bauhausLayer.style.visibility = '';
        bauhausLayer.style.filter = '';
      }
      if (skyLayer) {
        skyLayer.style.opacity = '';
        skyLayer.style.visibility = '';
      }
    },
    done: done.then(() => undefined),
  };
}
