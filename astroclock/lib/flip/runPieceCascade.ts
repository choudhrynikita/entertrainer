/**
 * True 3D AstroClock morph flip (not tile mosaic):
 *  - Circular back plate rotateY 180° (sky ↔ Bauhaus)
 *  - Concentric rings rotateZ while colors morph
 *  - Hands/aspect rays rotate + merge into Bauhaus H/M/S
 *  - Bottom decks flip upward row-by-row (rotateX)
 * Top bar is outside this stage and never flips.
 */
import {
  FLIP_STAGGER_MS,
  FLIP_TOTAL_MS,
  type FlipDirection,
} from './types';

const EASE = 'cubic-bezier(0.37, 0, 0.63, 1)';
const PLATE_MS = 980;
const RING_MS = 1100;
const HAND_MS = 1050;
const DECK_MS = 720;
const GOLD = '#D4AF37';
const FACE = '#161822';
const INK = '#0B0C10';
const RIBBON = ['#81C784', '#D4AF37', '#E57373'];

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
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch {
    return '';
  }
}

function dialTarget(
  skyLayer: HTMLElement | null,
  bauhausLayer: HTMLElement | null,
): HTMLElement | null {
  const bauInner =
    bauhausLayer?.querySelector('.ac-dial-square-inner') as HTMLElement | null;
  if (bauInner && bauInner.clientWidth > 0) return bauInner;
  const skyInner =
    skyLayer?.querySelector('.ac-dial-square-inner') as HTMLElement | null;
  if (skyInner) return skyInner;
  return (
    (skyLayer?.querySelector('canvas')?.parentElement as HTMLElement | null) ||
    skyLayer ||
    bauhausLayer
  );
}

function makeOverlay(stage: HTMLElement, hudRoot: HTMLElement | null): HTMLElement {
  const root = document.createElement('div');
  root.className = 'ac-cascade-overlay ac-clock-flip-overlay';
  root.setAttribute('aria-hidden', 'true');
  const sr = stage.getBoundingClientRect();
  let height = sr.height;
  if (hudRoot) {
    const hr = hudRoot.getBoundingClientRect();
    height = Math.max(height, hr.bottom - sr.top + 8);
  }
  Object.assign(root.style, {
    position: 'fixed',
    left: `${sr.left}px`,
    top: `${sr.top}px`,
    width: `${sr.width}px`,
    height: `${height}px`,
    perspective: '1600px',
    perspectiveOrigin: '50% 38%',
    pointerEvents: 'none',
    zIndex: '80',
    overflow: 'visible',
  });
  document.body.appendChild(root);
  return root;
}

function faceStyles(extra: Record<string, string> = {}): Record<string, string> {
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

function civilHandAngles(ms: number): { hour: number; minute: number; second: number } {
  const d = new Date(ms);
  const sec = d.getSeconds() + d.getMilliseconds() / 1000;
  const minute = d.getMinutes() + sec / 60;
  const hour = (d.getHours() % 12) + minute / 60;
  return {
    hour: (hour / 12) * 360,
    minute: (minute / 60) * 360,
    second: (sec / 60) * 360,
  };
}

/** Sky-side “aspect rays” — colorful, shorter, offset from civil hands. */
function skyRayAngles(ms: number): { hour: number; minute: number; second: number } {
  const civil = civilHandAngles(ms);
  return {
    hour: (civil.hour + 48) % 360,
    minute: (civil.minute + 112) % 360,
    second: (civil.second + 196) % 360,
  };
}

function spawnClockRig(opts: {
  overlay: HTMLElement;
  stageRect: DOMRect;
  dialEl: HTMLElement;
  skyUrl: string;
  bauUrl: string;
  direction: FlipDirection;
  bucket: Animation[];
}): HTMLElement {
  const { overlay, stageRect, dialEl, skyUrl, bauUrl, direction, bucket } = opts;
  const dr = rectOf(dialEl);
  const size = Math.min(dr.width, dr.height);
  const left = dr.left - stageRect.left + (dr.width - size) / 2;
  const top = dr.top - stageRect.top + (dr.height - size) / 2;

  const toBau = direction === 'to-bauhaus';
  const plateStart = toBau ? 0 : 180;
  const plateEnd = toBau ? 180 : 360;

  const rig = document.createElement('div');
  rig.className = 'ac-clock-rig';
  Object.assign(rig.style, {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${size}px`,
    height: `${size}px`,
    transformStyle: 'preserve-3d',
    WebkitTransformStyle: 'preserve-3d',
    transformOrigin: '50% 50%',
    zIndex: '4',
  });

  /* —— Dual-face circular plate (true rotateY 180) —— */
  const plate = document.createElement('div');
  plate.className = 'ac-clock-plate';
  Object.assign(plate.style, {
    position: 'absolute',
    inset: '0',
    borderRadius: '50%',
    transformStyle: 'preserve-3d',
    WebkitTransformStyle: 'preserve-3d',
    transformOrigin: '50% 50%',
    boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
    willChange: 'transform',
  });

  const front = document.createElement('div');
  front.className = 'ac-clock-face ac-clock-face-sky';
  Object.assign(front.style, faceStyles({
    borderRadius: '50%',
    transform: 'rotateY(0deg) translateZ(1.5px)',
    background: skyUrl
      ? `center / cover no-repeat url(${skyUrl})`
      : `radial-gradient(circle at 50% 42%, #1c2030, ${INK})`,
    boxShadow: `inset 0 0 0 1.5px rgba(212,175,55,0.28)`,
    overflow: 'hidden',
  }));

  const back = document.createElement('div');
  back.className = 'ac-clock-face ac-clock-face-bau';
  Object.assign(back.style, faceStyles({
    borderRadius: '50%',
    transform: 'rotateY(180deg) translateZ(1.5px)',
    background: bauUrl
      ? `center / cover no-repeat url(${bauUrl})`
      : `radial-gradient(circle at 50% 45%, ${FACE}, ${INK})`,
    boxShadow: `inset 0 0 0 1.5px rgba(212,175,55,0.22)`,
    overflow: 'hidden',
  }));

  plate.appendChild(front);
  plate.appendChild(back);
  if (!toBau) {
    front.style.opacity = '0';
    back.style.opacity = '1';
  } else {
    front.style.opacity = '1';
    back.style.opacity = '0';
  }

  /* Opacity swap at meridian so neither face reads mirrored. */
  bucket.push(
    front.animate(
      toBau
        ? [
            { opacity: 1, offset: 0 },
            { opacity: 1, offset: 0.48 },
            { opacity: 0, offset: 0.52 },
            { opacity: 0, offset: 1 },
          ]
        : [
            { opacity: 0, offset: 0 },
            { opacity: 0, offset: 0.48 },
            { opacity: 1, offset: 0.52 },
            { opacity: 1, offset: 1 },
          ],
      { duration: PLATE_MS, delay: 40, easing: 'linear', fill: 'both' },
    ),
  );
  bucket.push(
    back.animate(
      toBau
        ? [
            { opacity: 0, offset: 0 },
            { opacity: 0, offset: 0.48 },
            { opacity: 1, offset: 0.52 },
            { opacity: 1, offset: 1 },
          ]
        : [
            { opacity: 1, offset: 0 },
            { opacity: 1, offset: 0.48 },
            { opacity: 0, offset: 0.52 },
            { opacity: 0, offset: 1 },
          ],
      { duration: PLATE_MS, delay: 40, easing: 'linear', fill: 'both' },
    ),
  );

  bucket.push(
    plate.animate(
      [
        {
          transform: `rotateX(0deg) rotateY(${plateStart}deg) translateZ(0px)`,
          filter: 'brightness(1)',
          offset: 0,
        },
        {
          transform: `rotateX(8deg) rotateY(${plateStart + (plateEnd - plateStart) * 0.28}deg) translateZ(28px)`,
          filter: 'brightness(1.2)',
          offset: 0.28,
        },
        {
          transform: `rotateX(12deg) rotateY(${(plateStart + plateEnd) / 2}deg) translateZ(42px)`,
          filter: 'brightness(1.35)',
          offset: 0.5,
        },
        {
          transform: `rotateX(6deg) rotateY(${plateStart + (plateEnd - plateStart) * 0.72}deg) translateZ(24px)`,
          filter: 'brightness(1.18)',
          offset: 0.72,
        },
        {
          transform: `rotateX(0deg) rotateY(${plateEnd}deg) translateZ(0px)`,
          filter: 'brightness(1)',
          offset: 1,
        },
      ],
      { duration: PLATE_MS, delay: 20, easing: EASE, fill: 'both' },
    ),
  );

  /* Soft under-plate ghost — keeps circle readable when plate is edge-on */
  const ghost = document.createElement('div');
  ghost.className = 'ac-clock-ghost';
  Object.assign(ghost.style, {
    position: 'absolute',
    inset: '4%',
    borderRadius: '50%',
    background: skyUrl
      ? `center / cover no-repeat url(${skyUrl})`
      : `radial-gradient(circle, #1a1e2a, ${INK})`,
    filter: 'blur(1.5px) brightness(0.55)',
    opacity: '0.55',
    zIndex: '1',
    pointerEvents: 'none',
  });
  bucket.push(
    ghost.animate(
      toBau
        ? [
            { opacity: 0.55, offset: 0 },
            { opacity: 0.35, offset: 0.5 },
            { opacity: 0, offset: 1 },
          ]
        : [
            { opacity: 0, offset: 0 },
            { opacity: 0.3, offset: 0.45 },
            { opacity: 0.55, offset: 1 },
          ],
      { duration: PLATE_MS, delay: 20, easing: 'linear', fill: 'both' },
    ),
  );
  rig.appendChild(ghost);

  rig.appendChild(plate);

  /* —— Concentric rings (rotate while plate flips; colors morph to ribbon) —— */
  const ringSpecs = [
    { r: 0.98, w: 0.028, spin: toBau ? 140 : -140, delay: 0, colorFrom: 'rgba(212,175,55,0.55)', colorTo: RIBBON[0] },
    { r: 0.82, w: 0.018, spin: toBau ? -95 : 95, delay: 55, colorFrom: 'rgba(129,199,132,0.45)', colorTo: RIBBON[1] },
    { r: 0.64, w: 0.014, spin: toBau ? 70 : -70, delay: 110, colorFrom: 'rgba(229,115,115,0.4)', colorTo: RIBBON[2] },
  ];

  for (const spec of ringSpecs) {
    const ring = document.createElement('div');
    ring.className = 'ac-clock-ring';
    const inset = ((1 - spec.r) / 2) * 100;
    Object.assign(ring.style, {
      position: 'absolute',
      left: `${inset}%`,
      top: `${inset}%`,
      width: `${spec.r * 100}%`,
      height: `${spec.r * 100}%`,
      borderRadius: '50%',
      border: `${Math.max(2, size * spec.w)}px solid ${toBau ? spec.colorFrom : spec.colorTo}`,
      boxSizing: 'border-box',
      pointerEvents: 'none',
      transformStyle: 'preserve-3d',
      zIndex: '6',
      opacity: '0.92',
    });
    bucket.push(
      ring.animate(
        [
          {
            transform: `rotateZ(0deg) translateZ(8px)`,
            borderColor: toBau ? spec.colorFrom : spec.colorTo,
            opacity: 0.95,
            offset: 0,
          },
          {
            transform: `rotateZ(${spec.spin * 0.55}deg) translateZ(22px)`,
            borderColor: GOLD,
            opacity: 1,
            offset: 0.45,
          },
          {
            transform: `rotateZ(${spec.spin}deg) translateZ(6px)`,
            borderColor: toBau ? spec.colorTo : spec.colorFrom,
            opacity: toBau ? 0.55 : 0.9,
            offset: 1,
          },
        ],
        {
          duration: RING_MS,
          delay: spec.delay,
          easing: EASE,
          fill: 'both',
        },
      ),
    );
    rig.appendChild(ring);
  }

  /* —— Hands / aspect rays → Bauhaus H/M/S —— */
  const now = Date.now();
  const fromA = toBau ? skyRayAngles(now) : civilHandAngles(now);
  const toA = toBau ? civilHandAngles(now) : skyRayAngles(now);
  const handDefs = [
    {
      key: 'hour' as const,
      fromLen: toBau ? 0.38 : 0.48,
      toLen: toBau ? 0.48 : 0.38,
      width: Math.max(4, size * 0.038),
      colorFrom: '#E57373',
      colorTo: GOLD,
    },
    {
      key: 'minute' as const,
      fromLen: toBau ? 0.55 : 0.72,
      toLen: toBau ? 0.72 : 0.55,
      width: Math.max(1.6, size * 0.012),
      colorFrom: '#81C784',
      colorTo: GOLD,
    },
    {
      key: 'second' as const,
      fromLen: toBau ? 0.62 : 0.78,
      toLen: toBau ? 0.78 : 0.62,
      width: Math.max(0.9, size * 0.006),
      colorFrom: GOLD,
      colorTo: GOLD,
    },
  ];

  const handsLayer = document.createElement('div');
  handsLayer.className = 'ac-clock-hands';
  Object.assign(handsLayer.style, {
    position: 'absolute',
    inset: '0',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '8',
    transformStyle: 'preserve-3d',
  });

  for (const h of handDefs) {
    const pivot = document.createElement('div');
    pivot.className = `ac-clock-hand-pivot ac-clock-hand-${h.key}`;
    Object.assign(pivot.style, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '0',
      height: '0',
      transformOrigin: '0 0',
      willChange: 'transform',
    });

    /* Bar along +X; rotate(civilDeg - 90) matches canvas hands (0° = 12 o'clock). */
    const bar = document.createElement('div');
    bar.className = 'ac-clock-hand-bar';
    const len0 = size * h.fromLen;
    const len1 = size * h.toLen;
    Object.assign(bar.style, {
      position: 'absolute',
      left: `${-len0 * 0.12}px`,
      top: `${-h.width / 2}px`,
      width: `${len0}px`,
      height: `${h.width}px`,
      borderRadius: `${h.width}px`,
      background: toBau ? h.colorFrom : h.colorTo,
      boxShadow: '0 0 8px rgba(0,0,0,0.35)',
      willChange: 'width, background, left',
    });

    const a0 = fromA[h.key];
    const a1 = toA[h.key];
    let delta = a1 - a0;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    const mid = a0 + delta * 0.5;

    bucket.push(
      pivot.animate(
        [
          { transform: `rotate(${a0 - 90}deg) translateZ(12px)`, offset: 0 },
          { transform: `rotate(${mid - 90}deg) translateZ(28px)`, offset: 0.5 },
          { transform: `rotate(${a0 + delta - 90}deg) translateZ(10px)`, offset: 1 },
        ],
        { duration: HAND_MS, delay: 80, easing: EASE, fill: 'both' },
      ),
    );
    bucket.push(
      bar.animate(
        [
          {
            width: `${len0}px`,
            left: `${-len0 * 0.12}px`,
            background: toBau ? h.colorFrom : h.colorTo,
            offset: 0,
          },
          {
            width: `${(len0 + len1) / 2}px`,
            left: `${-((len0 + len1) / 2) * 0.12}px`,
            background: GOLD,
            offset: 0.5,
          },
          {
            width: `${len1}px`,
            left: `${-len1 * 0.12}px`,
            background: toBau ? h.colorTo : h.colorFrom,
            offset: 1,
          },
        ],
        { duration: HAND_MS, delay: 80, easing: EASE, fill: 'both' },
      ),
    );
    pivot.appendChild(bar);
    handsLayer.appendChild(pivot);
  }

  /* Hub */
  const hub = document.createElement('div');
  Object.assign(hub.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${Math.max(7, size * 0.04)}px`,
    height: `${Math.max(7, size * 0.04)}px`,
    marginLeft: `${-Math.max(7, size * 0.04) / 2}px`,
    marginTop: `${-Math.max(7, size * 0.04) / 2}px`,
    borderRadius: '50%',
    background: GOLD,
    zIndex: '9',
    boxShadow: `0 0 0 ${Math.max(1.5, size * 0.008)}px ${INK}`,
  });
  handsLayer.appendChild(hub);
  rig.appendChild(handsLayer);

    /* Fade morph hands out near end so live Bauhaus canvas hands take over cleanly */
  bucket.push(
    handsLayer.animate(
      toBau
        ? [
            { opacity: 1, offset: 0 },
            { opacity: 1, offset: 0.72 },
            { opacity: 0, offset: 1 },
          ]
        : [
            { opacity: 0, offset: 0 },
            { opacity: 0.35, offset: 0.2 },
            { opacity: 1, offset: 0.45 },
            { opacity: 1, offset: 0.78 },
            { opacity: 0, offset: 1 },
          ],
      { duration: HAND_MS + 120, delay: 40, easing: 'linear', fill: 'both' },
    ),
  );

  overlay.appendChild(rig);
  return rig;
}

function deckBackStyle(label: string, order: number): string {
  if (order === 0) {
    return `linear-gradient(180deg, ${FACE}, #12141c)`;
  }
  if (order === 1) {
    return `linear-gradient(90deg, ${RIBBON[0]}33, ${FACE} 40%, ${RIBBON[1]}33 70%, ${RIBBON[2]}33)`;
  }
  if (order === 2) {
    return `linear-gradient(180deg, #12141c, ${FACE})`;
  }
  return `linear-gradient(180deg, ${FACE}, ${INK})`;
  void label;
}

function spawnDeckRows(opts: {
  overlay: HTMLElement;
  stageRect: DOMRect;
  hudRoot: HTMLElement;
  direction: FlipDirection;
  bucket: Animation[];
}): number {
  const rows = Array.from(
    opts.hudRoot.querySelectorAll<HTMLElement>('[data-ac-deck-row]'),
  );
  if (!rows.length) return 0;

  const toBau = opts.direction === 'to-bauhaus';
  let maxEnd = 0;

  rows.forEach((el, i) => {
    const order = Number(el.dataset.acDeckOrder ?? i);
    const label = el.dataset.acDeckBack ?? '';
    const r = rectOf(el);
    const delay = toBau
      ? 160 + order * FLIP_STAGGER_MS
      : 80 + (rows.length - 1 - order) * FLIP_STAGGER_MS;

    const wrap = document.createElement('div');
    wrap.className = 'ac-deck-flip';
    Object.assign(wrap.style, {
      position: 'absolute',
      left: `${r.left - opts.stageRect.left}px`,
      top: `${r.top - opts.stageRect.top}px`,
      width: `${Math.max(r.width, 8)}px`,
      height: `${Math.max(r.height, 8)}px`,
      transformStyle: 'preserve-3d',
      WebkitTransformStyle: 'preserve-3d',
      /* Center hinge + lift → readable upward flip toward camera */
      transformOrigin: '50% 50%',
      willChange: 'transform',
      zIndex: String(12 - order),
      borderRadius: getComputedStyle(el).borderRadius || '10px',
    });

    const front = document.createElement('div');
    front.className = 'ac-deck-face ac-deck-front';
    const clone = el.cloneNode(true) as HTMLElement;
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    clone.style.width = '100%';
    clone.style.height = '100%';
    clone.style.margin = '0';
    clone.style.pointerEvents = 'none';
    Object.assign(front.style, faceStyles({
      transform: 'rotateX(0deg) translateZ(1px)',
      background: 'rgba(18,20,28,0.96)',
      boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
      overflow: 'hidden',
      borderRadius: 'inherit',
    }));
    front.appendChild(clone);

    const back = document.createElement('div');
    back.className = 'ac-deck-face ac-deck-back';
    Object.assign(back.style, faceStyles({
      /* rotateX(180) so after parent rotateX(-180) it reads upright */
      transform: 'rotateX(180deg) translateZ(1px)',
      background: deckBackStyle(label, order),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
      borderRadius: 'inherit',
    }));
    if (label) {
      const lab = document.createElement('div');
      lab.textContent = label;
      lab.style.cssText =
        'font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(224,226,236,0.7);text-align:center;padding:6px;font-weight:600';
      back.appendChild(lab);
    }

    wrap.appendChild(front);
    wrap.appendChild(back);
    if (toBau) {
      back.style.opacity = '0';
      front.style.opacity = '1';
    } else {
      back.style.opacity = '1';
      front.style.opacity = '0';
    }
    opts.overlay.appendChild(wrap);

    const startX = toBau ? 0 : -180;
    const endX = toBau ? -180 : -360;

    opts.bucket.push(
      front.animate(
        toBau
          ? [
              { opacity: 1, offset: 0 },
              { opacity: 1, offset: 0.48 },
              { opacity: 0, offset: 0.52 },
              { opacity: 0, offset: 1 },
            ]
          : [
              { opacity: 0, offset: 0 },
              { opacity: 0, offset: 0.48 },
              { opacity: 1, offset: 0.52 },
              { opacity: 1, offset: 1 },
            ],
        { duration: DECK_MS, delay, easing: 'linear', fill: 'both' },
      ),
    );
    opts.bucket.push(
      back.animate(
        toBau
          ? [
              { opacity: 0, offset: 0 },
              { opacity: 0, offset: 0.48 },
              { opacity: 1, offset: 0.52 },
              { opacity: 1, offset: 1 },
            ]
          : [
              { opacity: 1, offset: 0 },
              { opacity: 1, offset: 0.48 },
              { opacity: 0, offset: 0.52 },
              { opacity: 0, offset: 1 },
            ],
        { duration: DECK_MS, delay, easing: 'linear', fill: 'both' },
      ),
    );

    opts.bucket.push(
      wrap.animate(
        [
          {
            transform: `translateY(0px) rotateX(${startX}deg) translateZ(0px)`,
            filter: 'brightness(1)',
            offset: 0,
          },
          {
            transform: `translateY(-10px) rotateX(${(startX + endX) / 2}deg) translateZ(36px)`,
            filter: 'brightness(1.3)',
            offset: 0.5,
          },
          {
            transform: `translateY(0px) rotateX(${endX}deg) translateZ(0px)`,
            filter: 'brightness(1)',
            offset: 1,
          },
        ],
        { duration: DECK_MS, delay, easing: EASE, fill: 'both' },
      ),
    );

    maxEnd = Math.max(maxEnd, delay + DECK_MS);
  });

  return maxEnd;
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
  overlay = makeOverlay(stage, hudRoot);

  const skyUrl = snapshotCanvas(skyLayer);
  const bauUrl = snapshotCanvas(bauhausLayer);
  const dialEl = dialTarget(skyLayer, bauhausLayer);

  if (dialEl) {
    spawnClockRig({
      overlay,
      stageRect,
      dialEl,
      skyUrl,
      bauUrl,
      direction,
      bucket: animations,
    });
  }

  const deckEnd = hudRoot
    ? spawnDeckRows({
        overlay,
        stageRect,
        hudRoot,
        direction,
        bucket: animations,
      })
    : 0;

  /* Hide live layers — rig + decks carry the morph. */
  if (skyLayer) {
    skyLayer.style.visibility = 'hidden';
    hidden.push(skyLayer);
  }
  if (hudRoot) {
    hudRoot.style.visibility = 'hidden';
    hudRoot.style.pointerEvents = 'none';
    hidden.push(hudRoot);
  }

  if (bauhausLayer) {
    if (direction === 'to-bauhaus') {
      bauhausLayer.style.visibility = 'visible';
      animations.push(
        bauhausLayer.animate(
          [
            { opacity: 0, filter: 'brightness(1.15)' },
            { opacity: 0, offset: 0.55 },
            { opacity: 1, filter: 'brightness(1)', offset: 1 },
          ],
          {
            duration: PLATE_MS,
            delay: 80,
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
            { opacity: 0, filter: 'brightness(1.12)' },
          ],
          {
            duration: Math.round(PLATE_MS * 0.55),
            delay: 30,
            easing: EASE,
            fill: 'both',
          },
        ),
      );
    }
  }

  if (direction === 'to-sky' && skyLayer) {
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        skyLayer.style.visibility = '';
      }, Math.round(FLIP_TOTAL_MS * 0.68)),
    );
  }
  if (direction === 'to-sky' && hudRoot) {
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        hudRoot.style.visibility = '';
        hudRoot.style.pointerEvents = '';
      }, Math.round(FLIP_TOTAL_MS * 0.74)),
    );
  }

  const totalBudget = Math.max(FLIP_TOTAL_MS, deckEnd + 100, PLATE_MS + 200);

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

  timers.push(window.setTimeout(() => finish(), totalBudget + 140));

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
