/**
 * Volumetric AstroClock sky dial (Three.js) with morph into metal day-clock reverse.
 * Planet / Lagna angles use the same lonToAngle + computePlanets math as ClockCanvas.
 */
import { useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  DEG,
  GRAHAS,
  RASHIS,
  TWO_PI,
  type GrahaId,
  type LonMap,
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
import {
  STRETCH_COLOR,
  coalesceStretchSegments,
  sampleLocalDayQualities,
  type DayStretch,
  type StretchSegment,
} from '@astroclock/lib/astro/hourQuality';
import { FLIP_MS, type DialFace } from '@astroclock/lib/flip/types';
import type { FrameCache } from './ClockCanvas';

export interface SkyClock3DProps {
  simTime: number;
  lat: number;
  lon: number;
  natalLons: LonMap | null;
  natalLerp: number;
  selected: GrahaId | null;
  visible: boolean;
  face: DialFace;
  interactive?: boolean;
  onFrame: (cache: FrameCache) => void;
  /** Sky-face tap/swipe — morph to the metal reverse. */
  onEmptyTap?: () => void;
  onFlipBack: () => void;
}

const GOLD = 0xd4af37;
const GUNMETAL = 0x1a1c24;
const FACE = 0x12131a;
const INK = 0x0b0c10;
const R = 1.55;
const DEPTH = 0.22;

/** Match ClockCanvas: 0° sidereal at 12 o'clock. */
function lonToAngle(lon: number): number {
  return norm360(lon) * DEG - Math.PI / 2;
}

/**
 * Canvas Y grows down; Three.js Y grows up.
 * Same lonToAngle → (cos θ · r, −sin θ · r) in Three XY.
 */
function polar3(r: number, angle: number): THREE.Vector3 {
  return new THREE.Vector3(Math.cos(angle) * r, -Math.sin(angle) * r, 0);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Layer-local 0..1 with start/end delays on global morph t (grace + precision). */
function stagger01(t: number, start: number, end: number): number {
  if (end <= start) return t >= end ? 1 : 0;
  if (t <= start) return 0;
  if (t >= end) return 1;
  return easeInOutCubic((t - start) / (end - start));
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function hourAngle24(h: number, m = 0, s = 0): number {
  const frac = (h + m / 60 + s / 3600) / 24;
  return frac * Math.PI * 2;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function makeGold(roughness = 0.28, metalness = 0.92): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: GOLD,
    metalness,
    roughness,
    clearcoat: 0.55,
    clearcoatRoughness: 0.22,
    envMapIntensity: 1.35,
  });
}

function makeGunmetal(roughness = 0.38, metalness = 0.85): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: GUNMETAL,
    metalness,
    roughness,
    envMapIntensity: 1.1,
  });
}

function makeFaceMat(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: FACE,
    metalness: 0.45,
    roughness: 0.52,
    envMapIntensity: 0.7,
  });
}

function makeStretchMat(stretch: DayStretch): THREE.MeshPhysicalMaterial {
  const hex = STRETCH_COLOR[stretch];
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(hex),
    metalness: 0.88,
    roughness: 0.32,
    clearcoat: 0.4,
    clearcoatRoughness: 0.25,
    envMapIntensity: 1.2,
  });
}

function makeGlassRing(color: number, opacity = 0.55): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.15,
    roughness: 0.18,
    transmission: 0.35,
    thickness: 0.4,
    transparent: true,
    opacity,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.2,
    side: THREE.DoubleSide,
  });
}

function makeArcRing(
  radius: number,
  tube: number,
  startRad: number,
  sweep: number,
  mat: THREE.Material,
): THREE.Mesh {
  const seg = Math.max(8, Math.ceil(48 * (Math.abs(sweep) / (Math.PI * 2))));
  const geo = new THREE.TorusGeometry(radius, tube, 10, seg, Math.abs(sweep));
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.z = -startRad;
  return mesh;
}

function makeHand(
  length: number,
  width: number,
  depth: number,
  mat: THREE.Material,
  tail = 0.14,
): THREE.Group {
  const g = new THREE.Group();
  const bodyLen = length * (1 + tail);
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, bodyLen, depth), mat);
  body.position.y = (length * (1 - tail)) / 2;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(width * 0.55, length * 0.08, 6), mat);
  tip.position.y = length * 0.96;
  g.add(body, tip);
  return g;
}

function makeLabelSprite(
  lines: { text: string; color: string; size: number }[],
  scale: number,
): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 128);
  let y = 44;
  for (const line of lines) {
    ctx.font = `600 ${line.size}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = line.color;
    ctx.shadowColor = 'rgba(212,175,55,0.35)';
    ctx.shadowBlur = 8;
    ctx.fillText(line.text, 128, y);
    y += line.size * 0.85;
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  const spr = new THREE.Sprite(mat);
  spr.scale.set(scale, scale * 0.5, 1);
  spr.userData.dispose = () => {
    tex.dispose();
    mat.dispose();
  };
  return spr;
}

function makeSymbolSprite(symbol: string, color: string, size = 0.18): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = '#0B0C10';
  ctx.beginPath();
  ctx.arc(64, 64, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = '600 64px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 64, 68);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  const spr = new THREE.Sprite(mat);
  spr.scale.set(size, size, 1);
  spr.userData.dispose = () => {
    tex.dispose();
    mat.dispose();
  };
  return spr;
}

function makeNumeralPlane(label: string, size: number): THREE.Mesh {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = '#D4AF37';
  ctx.font = '600 72px "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 64, 68);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
  mesh.userData.dispose = () => {
    tex.dispose();
    mat.dispose();
  };
  return mesh;
}

type FlipAnim = {
  start: number;
  duration: number;
  settleFace: 'sky' | 'bauhaus';
  morphFrom: number;
  morphTo: number;
};

type LayerMorphSnapshot = {
  bezel: number;
  rashi: number;
  nak: number;
  gear: number;
  aspects: number;
  planets: number;
  hub: number;
  back: number;
  ribbon: number;
  hands: number;
};

type PlanetParts = {
  id: GrahaId;
  arm: THREE.Mesh;
  bead: THREE.Mesh;
  glow: THREE.Mesh;
  sprite: THREE.Sprite;
  retro: THREE.Sprite | null;
  color: THREE.Color;
};

export function SkyClock3D({
  simTime,
  lat,
  lon,
  natalLons,
  natalLerp,
  selected,
  visible,
  face,
  interactive = true,
  onFrame,
  onEmptyTap,
  onFlipBack,
}: SkyClock3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef(simTime);
  const latRef = useRef(lat);
  const lonRef = useRef(lon);
  const natalRef = useRef(natalLons);
  const natalLerpRef = useRef(natalLerp);
  const selectedRef = useRef(selected);
  const visibleRef = useRef(visible);
  const faceRef = useRef(face);
  const interactiveRef = useRef(interactive);
  const onFrameRef = useRef(onFrame);
  const onEmptyTapRef = useRef(onEmptyTap);
  const onFlipBackRef = useRef(onFlipBack);
  const beginFlipRef = useRef<((to: 'bauhaus' | 'sky') => void) | null>(null);
  const renderOnceRef = useRef<(() => void) | null>(null);

  simRef.current = simTime;
  latRef.current = lat;
  lonRef.current = lon;
  natalRef.current = natalLons;
  natalLerpRef.current = natalLerp;
  selectedRef.current = selected;
  visibleRef.current = visible;
  faceRef.current = face;
  interactiveRef.current = interactive;
  onFrameRef.current = onFrame;
  onEmptyTapRef.current = onEmptyTap;
  onFlipBackRef.current = onFlipBack;

  const stageInteractive =
    face === 'sky' || face === 'bauhaus' || face === 'flipping-to-sky';

  useLayoutEffect(() => {
    if (face === 'flipping-to-bauhaus') {
      beginFlipRef.current?.('bauhaus');
      renderOnceRef.current?.();
    } else if (face === 'flipping-to-sky') {
      beginFlipRef.current?.('sky');
      renderOnceRef.current?.();
    }
  }, [face]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const reduceMotion = prefersReducedMotion();
    let disposed = false;
    let raf = 0;
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(obj: T): T => {
      disposables.push(obj);
      return obj;
    };

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      /* Needed so screenshot/pixel audits can sample after rAF settle. */
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(0, 0, 6.2);
    camera.lookAt(0, 0, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTex = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envTex;
    room.dispose?.();
    track({ dispose: () => envTex.dispose() });
    track({ dispose: () => pmrem.dispose() });

    scene.add(new THREE.AmbientLight(0xfff6e8, 0.38));
    const key = new THREE.DirectionalLight(0xfff2dc, 1.45);
    key.position.set(3.2, 4.5, 5.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xa8b4ff, 0.55);
    fill.position.set(-4.5, 1.2, 2.5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffd78a, 0.65);
    rim.position.set(-1.5, 2.2, -4.5);
    scene.add(rim);
    const spark = new THREE.PointLight(0xffe6a8, 1.0, 12, 2);
    spark.position.set(1.8, 2.4, 3.2);
    scene.add(spark);

    const flipGroup = new THREE.Group();
    scene.add(flipGroup);

    const goldMat = track(makeGold());
    const goldSoft = track(makeGold(0.42, 0.85));
    const gunMat = track(makeGunmetal());
    const faceMat = track(makeFaceMat());
    const stretchMats: Record<DayStretch, THREE.MeshPhysicalMaterial> = {
      good: track(makeStretchMat('good')),
      mid: track(makeStretchMat('mid')),
      hard: track(makeStretchMat('hard')),
    };

    /* Radii — fractional match to ClockCanvas (R_canvas * 0.98 etc. → world R) */
    const rRashi = R * 0.98;
    const rNak = R * 0.86;
    const rGear = R * 0.74;
    const rPlanet = R * 0.58;
    const rNatal = R * 0.42;
    const rHub = R * 0.14;

    /* ═══════════════ SKY FACE (volumetric) ═══════════════ */
    const skyGroup = new THREE.Group();
    skyGroup.position.z = DEPTH * 0.5 + 0.01;

    /* Soft starfield / back plate */
    const backPlate = new THREE.Mesh(
      track(new THREE.CircleGeometry(R * 1.35, 64)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0x05060a,
          transparent: true,
          opacity: 0.92,
          depthWrite: false,
        }),
      ),
    );
    backPlate.position.z = -0.08;
    skyGroup.add(backPlate);

    const starGeo = track(new THREE.BufferGeometry());
    {
      const n = 180;
      const pos = new Float32Array(n * 3);
      const col = new Float32Array(n * 3);
      let s = 42 >>> 0;
      const rand = () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 0xffffffff;
      };
      for (let i = 0; i < n; i++) {
        const a = rand() * TWO_PI;
        const rr = R * (0.55 + rand() * 0.95);
        pos[i * 3] = Math.cos(a) * rr;
        pos[i * 3 + 1] = Math.sin(a) * rr;
        pos[i * 3 + 2] = -0.06 - rand() * 0.04;
        const b = 0.55 + rand() * 0.45;
        col[i * 3] = b;
        col[i * 3 + 1] = b;
        col[i * 3 + 2] = b + 0.05;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    }
    const stars = new THREE.Points(
      starGeo,
      track(
        new THREE.PointsMaterial({
          size: 0.025,
          vertexColors: true,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      ),
    );
    skyGroup.add(stars);

    /* Outer gold bezel (volumetric torus) */
    const skyBezel = new THREE.Mesh(
      track(new THREE.TorusGeometry(rRashi + 0.04, 0.048, 16, 96)),
      goldMat,
    );
    skyGroup.add(skyBezel);
    const skyBezelInner = new THREE.Mesh(
      track(new THREE.TorusGeometry(rRashi + 0.01, 0.018, 12, 80)),
      goldSoft,
    );
    skyBezelInner.position.z = 0.01;
    skyGroup.add(skyBezelInner);

    /* Dial plate wash */
    const plate = new THREE.Mesh(
      track(new THREE.CircleGeometry(rRashi, 96)),
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0x10141e,
          metalness: 0.55,
          roughness: 0.62,
          transparent: true,
          opacity: 0.55,
          envMapIntensity: 0.55,
        }),
      ),
    );
    plate.position.z = -0.02;
    skyGroup.add(plate);

    /* Case rim thickness */
    const skyRim = new THREE.Mesh(
      track(new THREE.CylinderGeometry(rRashi + 0.02, rRashi + 0.02, DEPTH * 0.4, 64, 1, true)),
      gunMat,
    );
    skyRim.rotation.x = Math.PI / 2;
    skyRim.position.z = -DEPTH * 0.15;
    skyGroup.add(skyRim);

    /* Rashi ring + ticks + labels */
    const rashiGroup = new THREE.Group();
    rashiGroup.position.z = 0.02;
    skyGroup.add(rashiGroup);

    const rashiTor = new THREE.Mesh(
      track(new THREE.TorusGeometry(rRashi, 0.012, 10, 96)),
      track(makeGlassRing(0xd4af37, 0.7)),
    );
    rashiGroup.add(rashiTor);

    const tickMatMajor = track(
      new THREE.MeshStandardMaterial({
        color: 0xf0d78c,
        metalness: 0.85,
        roughness: 0.28,
        emissive: 0xf0d78c,
        emissiveIntensity: 0.15,
      }),
    );
    const tickMatMid = track(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.7,
        roughness: 0.4,
      }),
    );
    const tickMatMinor = track(
      new THREE.MeshStandardMaterial({
        color: 0xe0e2ec,
        metalness: 0.3,
        roughness: 0.55,
        transparent: true,
        opacity: 0.35,
      }),
    );

    for (let i = 0; i < 12; i++) {
      const lon0 = i * 30;
      for (let d = 0; d < 30; d++) {
        const a = lonToAngle(lon0 + d);
        const major = d === 0;
        const mid = d % 5 === 0;
        const len = major ? 0.14 : mid ? 0.08 : 0.04;
        const w = major ? 0.018 : mid ? 0.01 : 0.006;
        const tick = new THREE.Mesh(
          track(new THREE.BoxGeometry(w, len, 0.02)),
          major ? tickMatMajor : mid ? tickMatMid : tickMatMinor,
        );
        const p = polar3(rRashi - len / 2, a);
        tick.position.copy(p);
        tick.position.z = 0.01;
        tick.rotation.z = a; /* align along radius in canvas sense → rotate by a with Y flip */
        /* Box local Y is along length; canvas ticks go inward along angle.
           After Y-flip polar, inward is toward origin along -polar direction.
           rotation.z = atan2(y,x) for radial alignment: */
        tick.rotation.z = Math.atan2(p.y, p.x) + Math.PI / 2;
        rashiGroup.add(tick);
      }
      const amid = lonToAngle(lon0 + 15);
      const lp = polar3(rRashi - 0.22, amid);
      const label = makeLabelSprite(
        [
          { text: RASHIS[i].glyph, color: 'rgba(240,215,140,0.98)', size: 42 },
          { text: RASHIS[i].en, color: 'rgba(100,181,246,0.9)', size: 28 },
        ],
        0.38,
      );
      label.position.copy(lp);
      label.position.z = 0.04;
      rashiGroup.add(label);
      disposables.push({ dispose: () => label.userData.dispose?.() });
    }

    /* Nakshatra ring */
    const nakGroup = new THREE.Group();
    nakGroup.position.z = 0.025;
    skyGroup.add(nakGroup);
    const nakTor = new THREE.Mesh(
      track(new THREE.TorusGeometry(rNak, 0.01, 8, 96)),
      track(makeGlassRing(0x64b5f6, 0.55)),
    );
    nakGroup.add(nakTor);
    const nakInner = new THREE.Mesh(
      track(new THREE.TorusGeometry(rNak - 0.1, 0.006, 8, 72)),
      track(makeGlassRing(0x64b5f6, 0.25)),
    );
    nakGroup.add(nakInner);

    const nakTickMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x64b5f6,
        metalness: 0.4,
        roughness: 0.45,
        emissive: 0x64b5f6,
        emissiveIntensity: 0.12,
      }),
    );
    const nakSpan = 360 / 27;
    for (let i = 0; i < 27; i++) {
      const lon0 = i * nakSpan;
      const a = lonToAngle(lon0);
      const tick = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.01, 0.11, 0.015)),
        nakTickMat,
      );
      const p = polar3(rNak - 0.04, a);
      tick.position.copy(p);
      tick.rotation.z = Math.atan2(p.y, p.x) + Math.PI / 2;
      nakGroup.add(tick);
      for (let pd = 1; pd <= 4; pd++) {
        const pa = lonToAngle(lon0 + (nakSpan / 4) * pd - nakSpan / 8);
        const dp = polar3(rNak - 0.05, pa);
        const dot = new THREE.Mesh(
          track(new THREE.SphereGeometry(0.012, 8, 6)),
          nakTickMat,
        );
        dot.position.copy(dp);
        dot.position.z = 0.01;
        nakGroup.add(dot);
      }
    }

    /* Gear escapement */
    const gearGroup = new THREE.Group();
    gearGroup.position.z = 0.015;
    skyGroup.add(gearGroup);
    const teeth = 48;
    const gearShape = new THREE.Shape();
    for (let i = 0; i < teeth; i++) {
      const a0 = (i / teeth) * TWO_PI;
      const a1 = ((i + 0.42) / teeth) * TWO_PI;
      const a2 = ((i + 0.58) / teeth) * TWO_PI;
      const a3 = ((i + 1) / teeth) * TWO_PI;
      const rOut = rGear;
      const rIn = rGear - 0.075;
      const pts = [
        [rIn * Math.cos(a0), rIn * Math.sin(a0)],
        [rOut * Math.cos(a1), rOut * Math.sin(a1)],
        [rOut * Math.cos(a2), rOut * Math.sin(a2)],
        [rIn * Math.cos(a3), rIn * Math.sin(a3)],
      ];
      if (i === 0) gearShape.moveTo(pts[0][0], pts[0][1]);
      else gearShape.lineTo(pts[0][0], pts[0][1]);
      gearShape.lineTo(pts[1][0], pts[1][1]);
      gearShape.lineTo(pts[2][0], pts[2][1]);
      gearShape.lineTo(pts[3][0], pts[3][1]);
    }
    gearShape.closePath();
    const gearGeo = track(
      new THREE.ExtrudeGeometry(gearShape, {
        depth: 0.035,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.006,
        bevelSegments: 2,
      }),
    );
    const gearMesh = new THREE.Mesh(
      gearGeo,
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0xd4af37,
          metalness: 0.9,
          roughness: 0.35,
          transparent: true,
          opacity: 0.16,
          clearcoat: 0.4,
          envMapIntensity: 1.1,
          side: THREE.DoubleSide,
        }),
      ),
    );
    gearMesh.position.z = -0.018;
    gearGroup.add(gearMesh);

    const spokeGroup = new THREE.Group();
    gearGroup.add(spokeGroup);
    for (let arm = 0; arm < 3; arm++) {
      const aa = arm * (TWO_PI / 3);
      const spoke = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.01, 0.01, rGear - 0.2, 6)),
        track(
          new THREE.MeshStandardMaterial({
            color: 0xe0e2ec,
            metalness: 0.5,
            roughness: 0.45,
            transparent: true,
            opacity: 0.25,
          }),
        ),
      );
      spoke.rotation.z = aa;
      spoke.position.set(
        Math.cos(aa) * (rGear - 0.2) * 0.5,
        Math.sin(aa) * (rGear - 0.2) * 0.5,
        0.02,
      );
      spokeGroup.add(spoke);
      const tip = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.03, 10, 8)),
        goldSoft,
      );
      tip.position.set(Math.cos(aa) * (rGear - 0.18), Math.sin(aa) * (rGear - 0.18), 0.025);
      spokeGroup.add(tip);
    }

    /* Aspect beams — thin tubes updated each frame */
    const aspectGroup = new THREE.Group();
    aspectGroup.position.z = 0.03;
    skyGroup.add(aspectGroup);
    const aspectPool: THREE.Mesh[] = [];
    const softAspectMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x81c784,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    );
    const hardAspectMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xe57373,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    );
    const natalAspectMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x64b5f6,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      }),
    );

    const ensureAspect = (i: number, mat: THREE.Material) => {
      while (aspectPool.length <= i) {
        const m = new THREE.Mesh(track(new THREE.CylinderGeometry(0.006, 0.006, 1, 5)), mat);
        m.visible = false;
        aspectGroup.add(m);
        aspectPool.push(m);
      }
      const mesh = aspectPool[i];
      mesh.material = mat;
      return mesh;
    };

    const placeBeam = (mesh: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3, opacity: number) => {
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dir = b.clone().sub(a);
      const len = dir.length();
      mesh.visible = len > 0.01;
      if (!mesh.visible) return;
      mesh.position.copy(mid);
      mesh.position.z = 0.03;
      mesh.scale.set(1, len, 1);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize(),
      );
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = opacity;
    };

    /* Natal markers */
    const natalGroup = new THREE.Group();
    natalGroup.position.z = 0.028;
    skyGroup.add(natalGroup);
    const natalParts: {
      id: GrahaId;
      tick: THREE.Mesh;
      glow: THREE.Mesh;
    }[] = [];
    for (const g of GRAHAS) {
      const col = new THREE.Color(g.color);
      const tick = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.02, 0.12, 0.02)),
        track(
          new THREE.MeshStandardMaterial({
            color: col,
            metalness: 0.4,
            roughness: 0.4,
            transparent: true,
            opacity: 0.45,
            emissive: col,
            emissiveIntensity: 0.2,
          }),
        ),
      );
      const glow = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.06, 12, 10)),
        track(
          new THREE.MeshBasicMaterial({
            color: col,
            transparent: true,
            opacity: 0.2,
            depthWrite: false,
          }),
        ),
      );
      natalGroup.add(tick, glow);
      natalParts.push({ id: g.id, tick, glow });
    }
    const natalRing = new THREE.Mesh(
      track(new THREE.TorusGeometry(rNatal, 0.006, 8, 64)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.08,
        }),
      ),
    );
    natalGroup.add(natalRing);

    /* Planet arms + beads */
    const planetGroup = new THREE.Group();
    planetGroup.position.z = 0.04;
    skyGroup.add(planetGroup);
    const planets: PlanetParts[] = [];
    for (const g of GRAHAS) {
      const col = new THREE.Color(g.color);
      const arm = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.012, 0.008, 1, 6)),
        track(
          new THREE.MeshStandardMaterial({
            color: col,
            metalness: 0.55,
            roughness: 0.35,
            emissive: col,
            emissiveIntensity: 0.12,
          }),
        ),
      );
      const bead = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.055, 16, 12)),
        track(
          new THREE.MeshPhysicalMaterial({
            color: col,
            metalness: 0.65,
            roughness: 0.25,
            clearcoat: 0.7,
            clearcoatRoughness: 0.2,
            emissive: col,
            emissiveIntensity: 0.18,
            envMapIntensity: 1.3,
          }),
        ),
      );
      const glow = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.12, 12, 10)),
        track(
          new THREE.MeshBasicMaterial({
            color: col,
            transparent: true,
            opacity: 0.22,
            depthWrite: false,
          }),
        ),
      );
      const sprite = makeSymbolSprite(g.symbol, '#0B0C10', 0.14);
      disposables.push({ dispose: () => sprite.userData.dispose?.() });
      planetGroup.add(arm, bead, glow, sprite);
      planets.push({
        id: g.id,
        arm,
        bead,
        glow,
        sprite,
        retro: null,
        color: col,
      });
    }

    /* Jewel hub */
    const hubGroup = new THREE.Group();
    hubGroup.position.z = 0.05;
    skyGroup.add(hubGroup);
    const hubOuter = new THREE.Mesh(
      track(new THREE.SphereGeometry(rHub, 32, 24)),
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0x10121a,
          metalness: 0.85,
          roughness: 0.28,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
          emissive: 0xd4af37,
          emissiveIntensity: 0.08,
          envMapIntensity: 1.4,
        }),
      ),
    );
    hubGroup.add(hubOuter);
    const hubRing = new THREE.Mesh(
      track(new THREE.TorusGeometry(rHub * 0.92, 0.012, 10, 48)),
      goldMat,
    );
    hubGroup.add(hubRing);
    const hubCore = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.045, 16, 12)),
      goldMat,
    );
    hubGroup.add(hubCore);
    const lstBead = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.028, 12, 10)),
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0xf0d78c,
          metalness: 0.9,
          roughness: 0.2,
          emissive: 0xf0d78c,
          emissiveIntensity: 0.35,
        }),
      ),
    );
    hubGroup.add(lstBead);
    const secArc = new THREE.Mesh(
      track(new THREE.TorusGeometry(rHub * 0.72, 0.01, 8, 48, Math.PI * 0.5)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0x64b5f6,
          transparent: true,
          opacity: 0.65,
        }),
      ),
    );
    hubGroup.add(secArc);

    /* Lagna marker */
    const lagnaGroup = new THREE.Group();
    lagnaGroup.position.z = 0.06;
    skyGroup.add(lagnaGroup);
    const lagnaCone = new THREE.Mesh(
      track(new THREE.ConeGeometry(0.045, 0.12, 3)),
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0x81c784,
          metalness: 0.5,
          roughness: 0.3,
          emissive: 0x81c784,
          emissiveIntensity: 0.35,
          clearcoat: 0.5,
        }),
      ),
    );
    const lagnaStem = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 6)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0x81c784,
          metalness: 0.45,
          roughness: 0.35,
          emissive: 0x81c784,
          emissiveIntensity: 0.2,
        }),
      ),
    );
    const lagnaGem = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.025, 12, 10)),
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0x81c784,
          metalness: 0.6,
          roughness: 0.25,
          emissive: 0x81c784,
          emissiveIntensity: 0.4,
        }),
      ),
    );
    lagnaGroup.add(lagnaCone, lagnaStem, lagnaGem);

    flipGroup.add(skyGroup);

    /* ═══════════════ BAUHAUS / METAL REVERSE ═══════════════ */
    const backGroup = new THREE.Group();
    /* Face camera — morph rearranges layers in place (not a solid π coin flip). */
    backGroup.rotation.y = 0;
    backGroup.position.z = DEPTH * 0.02;

    const caseBody = new THREE.Mesh(
      track(new THREE.CylinderGeometry(R * 1.02, R * 1.04, DEPTH, 96)),
      gunMat,
    );
    caseBody.rotation.x = Math.PI / 2;
    backGroup.add(caseBody);

    const bezel = new THREE.Mesh(
      track(new THREE.TorusGeometry(R * 1.01, 0.07, 16, 96)),
      goldMat,
    );
    bezel.position.z = DEPTH * 0.28;
    backGroup.add(bezel);

    const step = new THREE.Mesh(
      track(new THREE.TorusGeometry(R * 0.92, 0.028, 12, 80)),
      goldSoft,
    );
    step.position.z = DEPTH * 0.32;
    backGroup.add(step);

    const facePlate = new THREE.Mesh(
      track(new THREE.CylinderGeometry(R * 0.9, R * 0.9, 0.04, 96)),
      faceMat,
    );
    facePlate.rotation.x = Math.PI / 2;
    facePlate.position.z = DEPTH * 0.18;
    backGroup.add(facePlate);

    const innerRing = new THREE.Mesh(
      track(new THREE.TorusGeometry(R * 0.78, 0.012, 8, 72)),
      goldSoft,
    );
    innerRing.position.z = DEPTH * 0.36;
    backGroup.add(innerRing);

    const markerGroup = new THREE.Group();
    markerGroup.position.z = DEPTH * 0.38;
    for (let i = 0; i < 12; i++) {
      const a = -(i / 12) * Math.PI * 2;
      const isCardinal = i % 3 === 0;
      if (i === 0) {
        const n = makeNumeralPlane('XII', 0.28);
        n.position.set(0, R * 0.62, 0);
        markerGroup.add(n);
        disposables.push({ dispose: () => n.userData.dispose?.() });
      } else if (i === 6) {
        const n = makeNumeralPlane('VI', 0.26);
        n.position.set(0, -R * 0.62, 0);
        markerGroup.add(n);
        disposables.push({ dispose: () => n.userData.dispose?.() });
      } else {
        const w = isCardinal ? 0.055 : 0.022;
        const h = isCardinal ? 0.14 : 0.09;
        const m = new THREE.Mesh(
          track(new THREE.BoxGeometry(w, h, 0.03)),
          isCardinal ? goldMat : goldSoft,
        );
        m.position.set(Math.sin(a) * R * 0.72, Math.cos(a) * R * 0.72, 0);
        m.rotation.z = -a;
        markerGroup.add(m);
      }
    }
    backGroup.add(markerGroup);

    const ribbonGroup = new THREE.Group();
    ribbonGroup.position.z = DEPTH * 0.34;
    const ribbonR = R * 1.12;
    const ribbonTube = 0.055;
    backGroup.add(ribbonGroup);

    const pointer = new THREE.Mesh(
      track(new THREE.ConeGeometry(0.05, 0.12, 3)),
      goldMat,
    );
    pointer.rotation.z = Math.PI;
    pointer.position.set(0, -(ribbonR + 0.02), DEPTH * 0.4);
    backGroup.add(pointer);

    const bead = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.055, 20, 16)),
      stretchMats.mid,
    );
    bead.position.z = DEPTH * 0.42;
    backGroup.add(bead);

    const handsZ = DEPTH * 0.42;
    const hourHand = makeHand(R * 0.42, 0.07, 0.035, goldMat, 0.16);
    hourHand.position.z = handsZ;
    const minHand = makeHand(R * 0.62, 0.038, 0.028, goldMat, 0.14);
    minHand.position.z = handsZ + 0.01;
    const secHand = makeHand(R * 0.7, 0.014, 0.018, goldSoft, 0.18);
    secHand.position.z = handsZ + 0.02;
    backGroup.add(hourHand, minHand, secHand);

    const hubOuterB = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.08, 0.09, 0.06, 24)),
      goldMat,
    );
    hubOuterB.rotation.x = Math.PI / 2;
    hubOuterB.position.z = handsZ + 0.03;
    const hubInnerB = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16)),
      track(
        new THREE.MeshStandardMaterial({
          color: INK,
          metalness: 0.4,
          roughness: 0.55,
        }),
      ),
    );
    hubInnerB.rotation.x = Math.PI / 2;
    hubInnerB.position.z = handsZ + 0.055;
    backGroup.add(hubOuterB, hubInnerB);

    flipGroup.add(backGroup);

    const shadow = new THREE.Mesh(
      track(new THREE.CircleGeometry(R * 1.15, 64)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.32,
          depthWrite: false,
        }),
      ),
    );
    shadow.position.z = -DEPTH * 0.85;
    flipGroup.add(shadow);

    let segs: StretchSegment[] = [];
    let dayKey = '';
    const ribbonMeshes: THREE.Mesh[] = [];

    const rebuildRibbon = (ms: number) => {
      const d = new Date(ms);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (key === dayKey && ribbonMeshes.length) return;
      dayKey = key;
      segs = coalesceStretchSegments(sampleLocalDayQualities(ms, 24));
      for (const m of ribbonMeshes) {
        ribbonGroup.remove(m);
        m.geometry.dispose();
      }
      ribbonMeshes.length = 0;
      for (const seg of segs) {
        const a0 = hourAngle24(seg.startHour);
        const a1 = hourAngle24(seg.endHour === 24 ? 24 : seg.endHour);
        let sweep = a1 - a0;
        if (sweep <= 0) sweep += Math.PI * 2;
        const mesh = makeArcRing(ribbonR, ribbonTube, a0, sweep, stretchMats[seg.stretch]);
        ribbonGroup.add(mesh);
        ribbonMeshes.push(mesh);
      }
    };

    /* Morph / flip state — staggered layers, not one rigid coin */
    let morphT = face === 'bauhaus' || face === 'flipping-to-bauhaus' ? 1 : 0;
    let flipAnim: FlipAnim | null = null;
    let lastFace: DialFace = faceRef.current;
    let layerSnap: LayerMorphSnapshot = {
      bezel: morphT,
      rashi: morphT,
      nak: morphT,
      gear: morphT,
      aspects: morphT,
      planets: morphT,
      hub: morphT,
      back: morphT,
      ribbon: morphT,
      hands: morphT,
    };
    flipGroup.rotation.y = 0;
    flipGroup.rotation.x = 0;
    flipGroup.position.z = 0;

    const applyMorph = (tRaw: number) => {
      const t = clamp01(tRaw);
      morphT = t;
      /* Parallax delays: outer lead → hub last → reverse ribbon/hands in */
      const tBezel = stagger01(t, 0.0, 0.38);
      const tRashi = stagger01(t, 0.03, 0.44);
      const tNak = stagger01(t, 0.09, 0.5);
      const tGear = stagger01(t, 0.13, 0.54);
      const tAspect = stagger01(t, 0.17, 0.48);
      const tPlanet = stagger01(t, 0.22, 0.64);
      const tHub = stagger01(t, 0.34, 0.74);
      const tBack = stagger01(t, 0.4, 0.82);
      const tRibbon = stagger01(t, 0.48, 0.9);
      const tHands = stagger01(t, 0.54, 0.98);
      layerSnap = {
        bezel: tBezel,
        rashi: tRashi,
        nak: tNak,
        gear: tGear,
        aspects: tAspect,
        planets: tPlanet,
        hub: tHub,
        back: tBack,
        ribbon: tRibbon,
        hands: tHands,
      };

      /* Outer bezel / rashi lead */
      skyBezel.scale.setScalar(1 + tBezel * 0.1);
      skyBezel.rotation.x = tBezel * 0.55;
      skyBezel.visible = tBezel < 0.97;
      skyBezelInner.scale.setScalar(Math.max(0.05, 1 - tBezel * 0.98));
      skyBezelInner.visible = tBezel < 0.94;
      skyRim.scale.setScalar(Math.max(0.08, 1 - tBezel * 0.95));
      skyRim.visible = tBezel < 0.96;

      rashiGroup.rotation.x = tRashi * 0.95;
      rashiGroup.rotation.z = tRashi * 0.42;
      rashiGroup.position.z = 0.02 - tRashi * 0.12;
      rashiGroup.scale.setScalar(Math.max(0.04, 1 - tRashi * 0.97));
      rashiGroup.visible = tRashi < 0.98;

      /* Nak / gear next */
      nakGroup.rotation.x = -tNak * 1.1;
      nakGroup.rotation.y = tNak * 0.25;
      nakGroup.scale.setScalar(Math.max(0.04, 1 - tNak * 0.98));
      nakGroup.visible = tNak < 0.98;

      gearGroup.rotation.z = tGear * 2.6;
      gearGroup.position.z = -tGear * 0.22;
      gearGroup.scale.setScalar(Math.max(0.04, 1 - tGear * 0.98));
      gearGroup.visible = tGear < 0.98;

      /* Aspect tubes / planet arms */
      aspectGroup.visible = tAspect < 0.92;
      aspectGroup.scale.setScalar(Math.max(0.04, 1 - tAspect * 1.05));
      natalGroup.visible = tAspect < 0.85;
      natalGroup.scale.setScalar(Math.max(0.04, 1 - tAspect * 1.05));

      planetGroup.scale.setScalar(Math.max(0.04, 1 - tPlanet * 0.96));
      planetGroup.position.z = tPlanet * -0.08;
      planetGroup.visible = tPlanet < 0.98;

      /* Hub last → merges toward clock hands */
      hubGroup.scale.setScalar(Math.max(0.12, 1 - tHub * 0.82));
      hubGroup.position.z = tHub * 0.04;
      hubGroup.visible = tHub < 0.97;
      lagnaGroup.visible = tHub < 0.88;
      lagnaGroup.scale.setScalar(Math.max(0.04, 1 - tHub * 1.15));

      skyGroup.traverse((obj) => {
        if (obj instanceof THREE.Points) {
          const m = obj.material as THREE.PointsMaterial;
          m.opacity = 0.55 * (1 - stagger01(t, 0.05, 0.45));
        }
      });
      plate.visible = tRashi < 0.85;
      stars.visible = tBezel < 0.7;
      backPlate.visible = tBezel < 0.88;

      /* Reverse face elements stagger in */
      backGroup.visible = tBack > 0.02;
      backGroup.scale.setScalar(0.72 + 0.28 * tBack);
      backGroup.position.z = DEPTH * 0.02 + (1 - tBack) * -0.06;
      caseBody.scale.setScalar(0.9 + 0.1 * tBack);
      bezel.scale.setScalar(0.85 + 0.15 * tBack);
      step.scale.setScalar(0.85 + 0.15 * tBack);
      facePlate.scale.setScalar(0.88 + 0.12 * tBack);
      innerRing.scale.setScalar(0.8 + 0.2 * tBack);

      ribbonGroup.scale.setScalar(0.35 + 0.65 * tRibbon);
      ribbonGroup.rotation.z = (1 - tRibbon) * 0.55;
      ribbonGroup.position.z = DEPTH * 0.34 + (1 - tRibbon) * 0.1;
      ribbonGroup.visible = tRibbon > 0.02;

      markerGroup.scale.setScalar(0.55 + 0.45 * tBack);
      markerGroup.position.z = DEPTH * 0.38 + (1 - tBack) * 0.1;
      markerGroup.visible = tBack > 0.05;

      hourHand.scale.setScalar(0.2 + 0.8 * tHands);
      minHand.scale.setScalar(0.2 + 0.8 * tHands);
      secHand.scale.setScalar(0.15 + 0.85 * tHands);
      hourHand.visible = tHands > 0.04;
      minHand.visible = tHands > 0.04;
      secHand.visible = tHands > 0.04;
      hubOuterB.scale.setScalar(0.35 + 0.65 * tHands);
      hubInnerB.scale.setScalar(0.35 + 0.65 * tHands);
      bead.scale.setScalar(0.25 + 0.75 * tRibbon);
      pointer.scale.setScalar(0.25 + 0.75 * tRibbon);

      /* Hard hide sky when fully metal */
      if (t >= 0.985) skyGroup.visible = false;
      else skyGroup.visible = true;
      if (t <= 0.015) {
        skyGroup.visible = true;
        backGroup.visible = false;
      }
    };

    const settlePose = () => {
      flipGroup.rotation.y = 0;
      flipGroup.rotation.x = 0;
      flipGroup.position.z = 0;
    };

    const beginFlip = (to: 'bauhaus' | 'sky') => {
      if (reduceMotion) {
        settlePose();
        applyMorph(to === 'bauhaus' ? 1 : 0);
        flipAnim = null;
        lastFace = to === 'bauhaus' ? 'flipping-to-bauhaus' : 'flipping-to-sky';
        return;
      }
      if (flipAnim && flipAnim.settleFace === to) return;
      flipAnim = {
        start: performance.now(),
        duration: FLIP_MS,
        settleFace: to,
        morphFrom: morphT,
        morphTo: to === 'bauhaus' ? 1 : 0,
      };
      lastFace = to === 'bauhaus' ? 'flipping-to-bauhaus' : 'flipping-to-sky';
    };

    const onFace = (f: DialFace) => {
      if (f === lastFace) return;
      lastFace = f;
      if (f === 'flipping-to-bauhaus') beginFlip('bauhaus');
      else if (f === 'flipping-to-sky') beginFlip('sky');
      else if (f === 'bauhaus' && !flipAnim) {
        settlePose();
        applyMorph(1);
      } else if (f === 'sky' && !flipAnim) {
        settlePose();
        applyMorph(0);
      }
    };

    applyMorph(morphT);

    const resize = () => {
      /* Square dial: size from .ac-dial-square-inner; never use stage w/h
         aspect (that squashes the circle when host is tall). */
      const square = canvas.parentElement;
      const rawW = square?.clientWidth || canvas.clientWidth || host.clientWidth || 0;
      const rawH = square?.clientHeight || canvas.clientHeight || host.clientHeight || 0;
      const side = Math.round(Math.min(rawW, rawH) || Math.max(rawW, rawH) || 0);
      if (side < 2) return;
      renderer.setSize(side, side, false);
      camera.aspect = 1;
      const fit = 3.65;
      const dist = fit / Math.tan((camera.fov * Math.PI) / 360);
      camera.position.set(0, 0, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => resize()) : null;
    if (ro) {
      ro.observe(host);
      const square = canvas.parentElement;
      if (square) ro.observe(square);
    }
    window.addEventListener('resize', resize);

    rebuildRibbon(simRef.current);
    beginFlipRef.current = beginFlip;
    renderOnceRef.current = () => {
      onFace(faceRef.current);
      renderer.render(scene, camera);
    };

    /* Live planet angle cache for accuracy audit */
    const lastPlanetAngles: Record<string, number> = {};
    let lastLagnaAngle = 0;
    let lastAspectPairs: { a: string; b: string; angle: number }[] = [];
    let lastJd = 0;
    let breathe = 0;

    (window as unknown as { __acSky3d?: object }).__acSky3d = {
      getRotationY: () => flipGroup.rotation.y,
      getMorphT: () => morphT,
      getLayerMorphs: () => ({ ...layerSnap }),
      getFlipProgress: () => {
        if (!flipAnim) return null;
        return Math.min(1, (performance.now() - flipAnim.start) / flipAnim.duration);
      },
      getPlanetAngles: () => ({ ...lastPlanetAngles }),
      getLagnaAngle: () => lastLagnaAngle,
      getAspectPairs: () => lastAspectPairs.slice(),
      getJd: () => lastJd,
      getHandAngles: () => ({
        hourZ: hourHand.rotation.z,
        minZ: minHand.rotation.z,
        secZ: secHand.rotation.z,
      }),
      getSize: () => ({
        canvas: { w: canvas.clientWidth, h: canvas.clientHeight },
        drawingBuffer: {
          w: renderer.domElement.width,
          h: renderer.domElement.height,
        },
        aspect: camera.aspect,
      }),
      forceResize: () => resize(),
      /** Expected canvas-space angles (lonToAngle) for comparison */
      expectedFromMath: (ms?: number) => {
        const date = new Date(ms ?? simRef.current);
        const jd = julianDay(date);
        const planets = computePlanets(jd);
        const lstH = lst(jd, lonRef.current);
        const asc = ascendant(lstH, latRef.current, jd);
        const angles: Record<string, number> = {};
        for (const g of GRAHAS) {
          angles[g.id] = lonToAngle(planets[g.id].sidereal);
        }
        const pairs: { a: string; b: string; angle: number }[] = [];
        for (let i = 0; i < GRAHAS.length; i++) {
          for (let j = i + 1; j < GRAHAS.length; j++) {
            const hit = findAspect(
              planets[GRAHAS[i].id].sidereal,
              planets[GRAHAS[j].id].sidereal,
            );
            if (hit) pairs.push({ a: GRAHAS[i].id, b: GRAHAS[j].id, angle: hit.angle });
          }
        }
        return {
          jd,
          lagna: lonToAngle(asc.sidereal),
          planets: angles,
          aspects: pairs,
        };
      },
    };

    const transformFromGesture = () => {
      if (!interactiveRef.current) return;
      const f = faceRef.current;
      if (f === 'bauhaus') onFlipBackRef.current();
      else if (f === 'sky') onEmptyTapRef.current?.();
    };

    /* Dial gestures do one thing: transform. Tap and swipe both flip.
       Planet picking is HUD / Today — never the face itself. */
    let gesture: { id: number } | null = null;
    const onPointerDown = (e: PointerEvent) => {
      if (!interactiveRef.current || e.isPrimary === false) return;
      const f = faceRef.current;
      if (f !== 'sky' && f !== 'bauhaus') return;
      gesture = { id: e.pointerId };
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    const endGesture = (e: PointerEvent) => {
      if (!gesture || e.pointerId !== gesture.id) return;
      gesture = null;
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }
      transformFromGesture();
    };
    const onPointerCancel = (e: PointerEvent) => {
      if (!gesture || e.pointerId !== gesture.id) return;
      gesture = null;
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* ignore */
      }
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', endGesture);
    canvas.addEventListener('pointercancel', onPointerCancel);

    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);

      onFace(faceRef.current);

      const f = faceRef.current;
      if (!visibleRef.current && f === 'sky') return;

      const ms = simRef.current;
      const date = new Date(ms);
      const jd = julianDay(date);
      lastJd = jd;
      const lstH = lst(jd, lonRef.current);
      const asc = ascendant(lstH, latRef.current, jd);
      const planetMap = computePlanets(jd);
      const speeds = computeSpeeds(jd);
      const aya = lahiriAyanamsha(jd);
      const sel = selectedRef.current;
      const natal = natalRef.current;
      const tSec = ms / 1000;
      breathe = reduceMotion ? 0 : Math.sin(tSec * 0.7) * 0.012;

      /* Idle breathe on sky */
      if (morphT < 0.5 && !reduceMotion) {
        skyGroup.scale.setScalar(1 + breathe);
        skyBezel.rotation.z = tSec * 0.015;
      }

      /* Gear spin */
      if (!reduceMotion) {
        gearMesh.rotation.z = (tSec * 0.05) % TWO_PI;
        spokeGroup.rotation.z = -((tSec * 0.05 * 1.55) % TWO_PI);
      }

      /* Planets */
      const pulse = reduceMotion ? 0.55 : 0.45 + 0.28 * Math.sin(tSec * 2.4);
      lastAspectPairs = [];
      let aspectIdx = 0;

      for (const p of planets) {
        const lonP = planetMap[p.id].sidereal;
        const ang = lonToAngle(lonP);
        lastPlanetAngles[p.id] = ang;
        const tip = polar3(rPlanet, ang);
        const base = polar3(rHub + 0.05, ang);
        const isSel = sel === p.id;
        const dim = sel && !isSel;

        /* Morph: arms drift toward hour-hand clock angle */
        let useAng = ang;
        let useR = rPlanet;
        if (morphT > 0) {
          const date2 = new Date(ms);
          const hours = date2.getHours();
          const minutes = date2.getMinutes();
          const targetClock =
            -(((hours % 12) + minutes / 60) / 12) * Math.PI * 2;
          /* Convert clock rotZ (from +Y CW) to our polar angle */
          const clockPolar = -Math.PI / 2 - targetClock;
          useAng = ang + (clockPolar - ang) * morphT * 0.85;
          useR = rPlanet * (1 - morphT * 0.55);
          tip.copy(polar3(useR, useAng));
          base.copy(polar3(rHub + 0.05, useAng));
        }

        const mid = tip.clone().add(base).multiplyScalar(0.5);
        const len = tip.distanceTo(base);
        p.arm.position.copy(mid);
        p.arm.position.z = 0.02;
        p.arm.scale.set(isSel ? 1.35 : dim ? 0.6 : 1, len, 1);
        p.arm.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          tip.clone().sub(base).normalize(),
        );
        (p.arm.material as THREE.MeshStandardMaterial).opacity = dim ? 0.25 : 1;
        (p.arm.material as THREE.MeshStandardMaterial).transparent = dim;

        p.bead.position.copy(tip);
        p.bead.position.z = 0.05;
        const tipR = isSel ? 1.25 : 1;
        p.bead.scale.setScalar(tipR * (1 - morphT * 0.5));
        p.glow.position.copy(tip);
        p.glow.position.z = 0.04;
        (p.glow.material as THREE.MeshBasicMaterial).opacity =
          (isSel ? 0.35 : 0.18) * (1 - morphT);
        p.sprite.position.copy(tip);
        p.sprite.position.z = 0.08;
        p.sprite.scale.setScalar((isSel ? 0.16 : 0.13) * (1 - morphT * 0.6));
        p.sprite.visible = morphT < 0.75;

        if (speeds[p.id] < -0.01 && morphT < 0.5) {
          if (!p.retro) {
            p.retro = makeSymbolSprite('R', '#E57373', 0.1);
            planetGroup.add(p.retro);
            disposables.push({ dispose: () => p.retro?.userData.dispose?.() });
          }
          const rp = polar3(rPlanet + 0.14, ang);
          p.retro.position.copy(rp);
          p.retro.position.z = 0.08;
          p.retro.visible = true;
        } else if (p.retro) {
          p.retro.visible = false;
        }
      }

      /* Aspects */
      for (let i = 0; i < GRAHAS.length; i++) {
        for (let j = i + 1; j < GRAHAS.length; j++) {
          const a = GRAHAS[i];
          const b = GRAHAS[j];
          if (sel && sel !== a.id && sel !== b.id) continue;
          const hit = findAspect(planetMap[a.id].sidereal, planetMap[b.id].sidereal);
          if (!hit) continue;
          lastAspectPairs.push({ a: a.id, b: b.id, angle: hit.angle });
          const hard = hit.angle === 90 || hit.angle === 180;
          const alpha = Math.min(
            0.32,
            (hard ? 0.1 : 0.08) + pulse * 0.16 * hit.tight,
          ) * (1 - morphT);
          const mesh = ensureAspect(aspectIdx++, hard ? hardAspectMat : softAspectMat);
          placeBeam(
            mesh,
            polar3(rPlanet, lonToAngle(planetMap[a.id].sidereal)),
            polar3(rPlanet, lonToAngle(planetMap[b.id].sidereal)),
            alpha,
          );
        }
      }

      if (natal && morphT < 0.5) {
        for (const g of GRAHAS) {
          for (const t of GRAHAS) {
            if (sel && sel !== g.id && sel !== t.id) continue;
            const hit = findAspect(natal[g.id], planetMap[t.id].sidereal);
            if (!hit) continue;
            if (
              g.id === t.id &&
              absShortest(natal[g.id], planetMap[t.id].sidereal) < 1
            ) {
              continue;
            }
            const hard = hit.angle === 90 || hit.angle === 180;
            const alpha =
              Math.min(0.22, (hard ? 0.06 : 0.05) + pulse * 0.1 * hit.tight) *
              (1 - morphT);
            const mesh = ensureAspect(
              aspectIdx++,
              hard ? hardAspectMat : natalAspectMat,
            );
            placeBeam(
              mesh,
              polar3(rNatal, lonToAngle(natal[g.id])),
              polar3(rPlanet, lonToAngle(planetMap[t.id].sidereal)),
              alpha,
            );
          }
        }
      }
      for (let k = aspectIdx; k < aspectPool.length; k++) {
        aspectPool[k].visible = false;
      }

      /* Natal markers */
      if (natal) {
        natalGroup.visible = morphT < 0.45;
        const alpha = 0.32 + 0.28 * (natalLerpRef.current < 1 ? natalLerpRef.current : 1);
        for (const np of natalParts) {
          const ang = lonToAngle(natal[np.id]);
          const p = polar3(rNatal, ang);
          np.tick.position.copy(p);
          np.tick.rotation.z = Math.atan2(p.y, p.x) + Math.PI / 2;
          (np.tick.material as THREE.MeshStandardMaterial).opacity = alpha * (1 - morphT);
          np.glow.position.copy(p);
          (np.glow.material as THREE.MeshBasicMaterial).opacity =
            0.22 * alpha * (1 - morphT);
        }
      } else {
        natalGroup.visible = false;
      }

      /* Lagna */
      const lagAng = lonToAngle(asc.sidereal);
      lastLagnaAngle = lagAng;
      const lagP = polar3(rRashi + 0.06, lagAng);
      lagnaCone.position.copy(lagP);
      lagnaCone.position.z = 0.05;
      /* Point outward */
      const out = lagP.clone().normalize();
      lagnaCone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), out);
      const midLag = polar3(rRashi + 0.01, lagAng);
      lagnaStem.position.copy(midLag);
      lagnaStem.position.z = 0.04;
      lagnaStem.quaternion.copy(lagnaCone.quaternion);
      lagnaGem.position.copy(polar3(rRashi + 0.01, lagAng));
      lagnaGem.position.z = 0.05;

      /* Hub LST bead + sec arc */
      const msFrac = (ms % 1000) / 1000;
      const secFrac = (date.getUTCSeconds() + msFrac) / 60;
      const lstFrac = (lstH % 24) / 24;
      const lstAng = -Math.PI / 2 + lstFrac * TWO_PI;
      /* Canvas polar for hub uses same formula; Three needs Y flip */
      lstBead.position.set(
        Math.cos(lstAng) * (rHub - 0.025),
        -Math.sin(lstAng) * (rHub - 0.025),
        0.06,
      );
      secArc.geometry.dispose();
      secArc.geometry = new THREE.TorusGeometry(
        rHub * 0.72,
        0.01,
        8,
        48,
        Math.max(0.05, secFrac * TWO_PI),
      );
      secArc.rotation.z = Math.PI / 2; /* start at 12 o'clock */
      (secArc.material as THREE.MeshBasicMaterial).opacity = reduceMotion
        ? 0.55
        : 0.45 + 0.25 * Math.sin(msFrac * TWO_PI);

      /* Bauhaus hands / ribbon */
      rebuildRibbon(ms);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const msF = reduceMotion ? 0 : date.getMilliseconds() / 1000;
      const sec = seconds + msF;
      hourHand.rotation.z =
        -(((hours % 12) + minutes / 60 + sec / 3600) / 12) * Math.PI * 2;
      minHand.rotation.z = -((minutes + sec / 60) / 60) * Math.PI * 2;
      secHand.rotation.z = -(sec / 60) * Math.PI * 2;
      const aNow = hourAngle24(hours, minutes, sec);
      bead.position.x = Math.sin(aNow) * ribbonR;
      bead.position.y = Math.cos(aNow) * ribbonR;
      const curStretch =
        segs.find((s) => hours >= s.startHour && hours < s.endHour)?.stretch || 'mid';
      bead.material = stretchMats[curStretch];

      /* Staggered mechanical morph — slight group tilt only (not a solid coin) */
      if (flipAnim) {
        const t = Math.min(1, (performance.now() - flipAnim.start) / flipAnim.duration);
        /* Linear global clock so layer delays stay visible; each layer eases itself */
        const morphNow =
          flipAnim.morphFrom + (flipAnim.morphTo - flipAnim.morphFrom) * t;
        applyMorph(morphNow);
        const dir = flipAnim.morphTo > flipAnim.morphFrom ? 1 : -1;
        const sway = Math.sin(t * Math.PI);
        flipGroup.rotation.y = sway * 0.28 * dir;
        flipGroup.rotation.x = sway * 0.07;
        flipGroup.position.z = sway * 0.2;
        if (t >= 1) {
          settlePose();
          applyMorph(flipAnim.morphTo);
          flipAnim = null;
        }
      } else {
        flipGroup.rotation.y *= 0.82;
        flipGroup.rotation.x *= 0.85;
        flipGroup.position.z *= 0.85;
      }

      onFrameRef.current({
        planets: planetMap,
        speeds,
        asc,
        jd,
        date,
        aya,
        lstH,
      });

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      beginFlipRef.current = null;
      renderOnceRef.current = null;
      try {
        delete (window as unknown as { __acSky3d?: object }).__acSky3d;
      } catch {
        /* ignore */
      }
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', endGesture);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('resize', resize);
      ro?.disconnect();
      for (const m of ribbonMeshes) m.geometry.dispose();
      secArc.geometry.dispose();
      scene.environment = null;
      renderer.dispose();
      for (const d of disposables) {
        try {
          d.dispose();
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`ac-sky3d absolute inset-0 min-h-0 ac-sky3d--active`}
      data-face={face}
    >
      <div className="ac-dial-square absolute inset-0 w-full h-full">
        <div className="ac-dial-square-inner">
          <canvas
            ref={canvasRef}
            className="touch-none block ac-canvas-layer ac-sky3d-canvas"
            aria-label={
              face === 'bauhaus'
                ? 'Metal day clock — tap or swipe to return to sky dial'
                : 'Sky dial — tap or swipe to transform'
            }
            style={{ pointerEvents: stageInteractive ? 'auto' : 'none' }}
          />
        </div>
      </div>
      {/* Reverse dock (date + mini stats + Sky dial) lives in AstroClockApp HUD stack */}
    </div>
  );
}
