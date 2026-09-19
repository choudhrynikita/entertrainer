import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  STRETCH_COLOR,
  coalesceStretchSegments,
  sampleLocalDayQualities,
  type DayStretch,
  type StretchSegment,
} from '@astroclock/lib/astro/hourQuality';
import { FLIP_MS, type DialFace } from '@astroclock/lib/flip/types';

interface MetalClock3DProps {
  simTime: number;
  visible: boolean;
  face: DialFace;
  /** Live sky dial canvas — sampled onto the front plate when a flip starts. */
  skyCanvas: HTMLCanvasElement | null;
  interactive?: boolean;
  onFlipBack: () => void;
}

const GOLD = 0xd4af37;
const GUNMETAL = 0x1a1c24;
const FACE = 0x12131a;
const INK = 0x0b0c10;

/** Ease in-out cubic */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function hourAngle24(h: number, m = 0, s = 0): number {
  const frac = (h + m / 60 + s / 3600) / 24;
  return frac * Math.PI * 2;
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
  /* TorusGeometry already lies in XY (faces camera). Clock 0h at +Y, CW → -Z rot. */
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
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, bodyLen, depth),
    mat,
  );
  /* Pivot at hub: tip at +length, tail at -length*tail. */
  body.position.y = (length * (1 - tail)) / 2;
  /* Slight bevel feel via tapered tip */
  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(width * 0.55, length * 0.08, 6),
    mat,
  );
  tip.position.y = length * 0.96;
  g.add(body, tip);
  return g;
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
  from: number;
  to: number;
  start: number;
  duration: number;
  settleFace: 'sky' | 'bauhaus';
};

export function MetalClock3D({
  simTime,
  visible,
  face,
  skyCanvas,
  interactive = true,
  onFlipBack,
}: MetalClock3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef(simTime);
  const visibleRef = useRef(visible);
  const faceRef = useRef(face);
  const skyRef = useRef(skyCanvas);
  const interactiveRef = useRef(interactive);
  const syncFrontRef = useRef<(() => void) | null>(null);
  const renderOnceRef = useRef<(() => void) | null>(null);
  const beginFlipRef = useRef<((to: 'bauhaus' | 'sky') => void) | null>(null);

  simRef.current = simTime;
  visibleRef.current = visible;
  faceRef.current = face;
  skyRef.current = skyCanvas;
  interactiveRef.current = interactive;

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

  const showChrome = face === 'bauhaus';
  const stageActive = face !== 'sky';

  useLayoutEffect(() => {
    if (face === 'sky') return;
    const metal = (window as unknown as {
      __acMetal?: { forceResize?: () => void };
    }).__acMetal;
    metal?.forceResize?.();
    if (face === 'flipping-to-bauhaus') {
      syncFrontRef.current?.();
      beginFlipRef.current?.('bauhaus');
      renderOnceRef.current?.();
    } else if (face === 'flipping-to-sky') {
      syncFrontRef.current?.();
      beginFlipRef.current?.('sky');
      renderOnceRef.current?.();
    }
  }, [face]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(0, 0, 6.2);
    camera.lookAt(0, 0, 0);

    /* Studio env for PBR reflections */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTex = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envTex;
    room.dispose?.();
    track({ dispose: () => envTex.dispose() });
    track({ dispose: () => pmrem.dispose() });

    /* Lights — soft product-render key / fill / rim */
    scene.add(new THREE.AmbientLight(0xfff6e8, 0.42));
    const key = new THREE.DirectionalLight(0xfff2dc, 1.55);
    key.position.set(3.2, 4.5, 5.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xa8b4ff, 0.45);
    fill.position.set(-4.5, 1.2, 2.5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffd78a, 0.7);
    rim.position.set(-1.5, 2.2, -4.5);
    scene.add(rim);
    const spark = new THREE.PointLight(0xffe6a8, 1.1, 12, 2);
    spark.position.set(1.8, 2.4, 3.2);
    scene.add(spark);

    const flipGroup = new THREE.Group();
    scene.add(flipGroup);

    const R = 1.55;
    const DEPTH = 0.22;
    const goldMat = track(makeGold());
    const goldSoft = track(makeGold(0.42, 0.85));
    const gunMat = track(makeGunmetal());
    const faceMat = track(makeFaceMat());
    const stretchMats: Record<DayStretch, THREE.MeshPhysicalMaterial> = {
      good: track(makeStretchMat('good')),
      mid: track(makeStretchMat('mid')),
      hard: track(makeStretchMat('hard')),
    };

    /* ── Front: sky dial as canvas texture on a metal-edged disc ── */
    const frontGroup = new THREE.Group();
    frontGroup.position.z = DEPTH * 0.5 + 0.01;

    const frontBezel = new THREE.Mesh(
      track(new THREE.TorusGeometry(R * 0.98, 0.055, 14, 96)),
      goldMat,
    );
    frontGroup.add(frontBezel);

    const frontPlateGeo = track(new THREE.CircleGeometry(R * 0.95, 96));
    const bakeCanvas = document.createElement('canvas');
    bakeCanvas.width = 8;
    bakeCanvas.height = 8;
    const frontTex = track(new THREE.CanvasTexture(bakeCanvas));
    frontTex.colorSpace = THREE.SRGBColorSpace;
    frontTex.flipY = true;
    frontTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const frontMat = track(
      new THREE.MeshBasicMaterial({
        map: frontTex,
        toneMapped: false,
      }),
    );
    const frontPlate = new THREE.Mesh(frontPlateGeo, frontMat);
    frontGroup.add(frontPlate);

    /* Edge of front disc so mid-flip shows thickness */
    const frontRim = new THREE.Mesh(
      track(new THREE.CylinderGeometry(R * 0.97, R * 0.97, DEPTH * 0.35, 64, 1, true)),
      gunMat,
    );
    frontRim.rotation.x = Math.PI / 2;
    frontRim.position.z = -DEPTH * 0.12;
    frontGroup.add(frontRim);

    flipGroup.add(frontGroup);

    /* ── Back: volumetric Bauhaus metal clock (faces -Z until flipped) ── */
    const backGroup = new THREE.Group();
    backGroup.rotation.y = Math.PI;
    backGroup.position.z = -DEPTH * 0.5;

    /* Case body — thick gunmetal drum */
    const caseBody = new THREE.Mesh(
      track(new THREE.CylinderGeometry(R * 1.02, R * 1.04, DEPTH, 96)),
      gunMat,
    );
    caseBody.rotation.x = Math.PI / 2;
    backGroup.add(caseBody);

    /* Outer gold bezel (proud lip) */
    const bezel = new THREE.Mesh(
      track(new THREE.TorusGeometry(R * 1.01, 0.07, 16, 96)),
      goldMat,
    );
    bezel.position.z = DEPTH * 0.28;
    backGroup.add(bezel);

    /* Inner step ring */
    const step = new THREE.Mesh(
      track(new THREE.TorusGeometry(R * 0.92, 0.028, 12, 80)),
      goldSoft,
    );
    step.position.z = DEPTH * 0.32;
    backGroup.add(step);

    /* Face plate */
    const facePlate = new THREE.Mesh(
      track(new THREE.CylinderGeometry(R * 0.9, R * 0.9, 0.04, 96)),
      faceMat,
    );
    facePlate.rotation.x = Math.PI / 2;
    facePlate.position.z = DEPTH * 0.18;
    backGroup.add(facePlate);

    /* Subtle recessed inner ring */
    const innerRing = new THREE.Mesh(
      track(new THREE.TorusGeometry(R * 0.78, 0.012, 8, 72)),
      goldSoft,
    );
    innerRing.position.z = DEPTH * 0.36;
    backGroup.add(innerRing);

    /* Hour markers */
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

    /* Day-quality ribbon (metallic outer segments) */
    const ribbonGroup = new THREE.Group();
    ribbonGroup.position.z = DEPTH * 0.34;
    const ribbonR = R * 1.12;
    const ribbonTube = 0.055;
    backGroup.add(ribbonGroup);

    /* 6-o'clock gold pointer into ribbon */
    const pointer = new THREE.Mesh(
      track(new THREE.ConeGeometry(0.05, 0.12, 3)),
      goldMat,
    );
    pointer.rotation.z = Math.PI;
    pointer.position.set(0, -(ribbonR + 0.02), DEPTH * 0.4);
    backGroup.add(pointer);

    /* Now bead */
    const bead = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.055, 20, 16)),
      stretchMats.mid,
    );
    bead.position.z = DEPTH * 0.42;
    backGroup.add(bead);

    /* Hands */
    const handsZ = DEPTH * 0.42;
    const hourHand = makeHand(R * 0.42, 0.07, 0.035, goldMat, 0.16);
    hourHand.position.z = handsZ;
    const minHand = makeHand(R * 0.62, 0.038, 0.028, goldMat, 0.14);
    minHand.position.z = handsZ + 0.01;
    const secHand = makeHand(R * 0.7, 0.014, 0.018, goldSoft, 0.18);
    secHand.position.z = handsZ + 0.02;
    backGroup.add(hourHand, minHand, secHand);

    /* Hub stack */
    const hubOuter = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.08, 0.09, 0.06, 24)),
      goldMat,
    );
    hubOuter.rotation.x = Math.PI / 2;
    hubOuter.position.z = handsZ + 0.03;
    const hubInner = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16)),
      track(
        new THREE.MeshStandardMaterial({
          color: INK,
          metalness: 0.4,
          roughness: 0.55,
        }),
      ),
    );
    hubInner.rotation.x = Math.PI / 2;
    hubInner.position.z = handsZ + 0.055;
    backGroup.add(hubOuter, hubInner);

    flipGroup.add(backGroup);

    /* Soft ground shadow disc for volume cue */
    const shadow = new THREE.Mesh(
      track(new THREE.CircleGeometry(R * 1.15, 64)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.35,
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

    const syncFrontTexture = () => {
      const src = skyRef.current;
      if (!src || src.width < 2 || src.height < 2) return;
      const w = src.width;
      const h = src.height;
      if (bakeCanvas.width !== w || bakeCanvas.height !== h) {
        bakeCanvas.width = w;
        bakeCanvas.height = h;
      }
      const ctx = bakeCanvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'copy';
      try {
        ctx.drawImage(src, 0, 0, w, h);
      } catch (err) {
        console.warn('[MetalClock3D] sky bake failed', err);
        return;
      }
      frontTex.image = bakeCanvas;
      frontTex.colorSpace = THREE.SRGBColorSpace;
      frontTex.needsUpdate = true;
      frontMat.needsUpdate = true;
    };

    let flipAnim: FlipAnim | null = null;
    let lastFace: DialFace = faceRef.current;
    /* Settled rotations: sky/front = 0, bauhaus/back = π */
    flipGroup.rotation.y =
      face === 'bauhaus' || face === 'flipping-to-bauhaus' ? Math.PI : 0;

    const beginFlip = (to: 'bauhaus' | 'sky') => {
      syncFrontTexture();
      if (reduceMotion) {
        flipGroup.rotation.y = to === 'bauhaus' ? Math.PI : 0;
        flipGroup.rotation.x = 0;
        flipGroup.position.z = 0;
        flipAnim = null;
        lastFace = to === 'bauhaus' ? 'flipping-to-bauhaus' : 'flipping-to-sky';
        return;
      }
      /* Restart only if not already animating toward the same face */
      if (flipAnim && flipAnim.settleFace === to) return;
      if (to === 'bauhaus') {
        flipAnim = {
          from: 0,
          to: Math.PI,
          start: performance.now(),
          duration: FLIP_MS,
          settleFace: 'bauhaus',
        };
        lastFace = 'flipping-to-bauhaus';
      } else {
        flipAnim = {
          from: Math.PI,
          to: Math.PI * 2,
          start: performance.now(),
          duration: FLIP_MS,
          settleFace: 'sky',
        };
        lastFace = 'flipping-to-sky';
      }
      flipGroup.rotation.y = flipAnim.from;
    };

    /* Respond to face changes from parent — animate only on flipping-* */
    const onFace = (f: DialFace) => {
      if (f === lastFace) return;
      lastFace = f;
      if (f === 'flipping-to-bauhaus') beginFlip('bauhaus');
      else if (f === 'flipping-to-sky') beginFlip('sky');
      else if (f === 'bauhaus' && !flipAnim) {
        flipGroup.rotation.y = Math.PI;
        flipGroup.rotation.x = 0;
        flipGroup.position.z = 0;
      } else if (f === 'sky' && !flipAnim) {
        flipGroup.rotation.y = 0;
        flipGroup.rotation.x = 0;
        flipGroup.position.z = 0;
      }
    };

    const resize = () => {
      /* Size to the square dial canvas, not the full stage — avoids ellipse squash. */
      const w = canvas.clientWidth || host.clientWidth;
      const h = canvas.clientHeight || host.clientHeight;
      if (w < 2 || h < 2) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      /* Frame ~R=1.55 + ribbon/bezel with small margin; keep optical center. */
      const fit = 3.65;
      const dist = fit / Math.tan((camera.fov * Math.PI) / 360);
      camera.position.set(0, 0, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => resize())
        : null;
    if (ro) {
      ro.observe(host);
      const square = canvas.parentElement;
      if (square) ro.observe(square);
    }
    window.addEventListener('resize', resize);

    rebuildRibbon(simRef.current);
    syncFrontTexture();
    syncFrontRef.current = syncFrontTexture;
    beginFlipRef.current = beginFlip;
    renderOnceRef.current = () => {
      onFace(faceRef.current);
      renderer.render(scene, camera);
    };
    /* Test/audit hook — read-only metrics for Playwright visual audits */
    (window as unknown as { __acMetal?: object }).__acMetal = {
      getRotationY: () => flipGroup.rotation.y,
      getFlipProgress: () => {
        if (!flipAnim) return null;
        return Math.min(1, (performance.now() - flipAnim.start) / flipAnim.duration);
      },
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
    };

    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);

      onFace(faceRef.current);

      if (!visibleRef.current && faceRef.current === 'sky') return;

      const ms = simRef.current;
      rebuildRibbon(ms);
      const date = new Date(ms);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const msFrac = reduceMotion ? 0 : date.getMilliseconds() / 1000;
      const sec = seconds + msFrac;

      /* Clockwise from +Y */
      hourHand.rotation.z =
        -(((hours % 12) + minutes / 60 + sec / 3600) / 12) * Math.PI * 2;
      minHand.rotation.z = -((minutes + sec / 60) / 60) * Math.PI * 2;
      secHand.rotation.z = -(sec / 60) * Math.PI * 2;

      const aNow = hourAngle24(hours, minutes, sec);
      bead.position.x = Math.sin(aNow) * ribbonR;
      bead.position.y = Math.cos(aNow) * ribbonR;
      const curStretch =
        segs.find((s) => hours >= s.startHour && hours < s.endHour)?.stretch ||
        'mid';
      bead.material = stretchMats[curStretch];

      if (flipAnim) {
        const t = Math.min(1, (performance.now() - flipAnim.start) / flipAnim.duration);
        const e = easeInOutCubic(t);
        /* Keep sky bake fresh while the front is still visible. */
        if (flipAnim.settleFace === 'bauhaus' && e < 0.55) syncFrontTexture();
        flipGroup.rotation.y = flipAnim.from + (flipAnim.to - flipAnim.from) * e;
        /* Specular drama: slight pitch during tumble */
        flipGroup.rotation.x = Math.sin(e * Math.PI) * 0.12;
        flipGroup.position.z = Math.sin(e * Math.PI) * 0.35;
        if (t >= 1) {
          flipGroup.rotation.y = flipAnim.settleFace === 'bauhaus' ? Math.PI : 0;
          flipGroup.rotation.x = 0;
          flipGroup.position.z = 0;
          flipAnim = null;
        }
      } else {
        flipGroup.rotation.x *= 0.85;
        flipGroup.position.z *= 0.85;
      }

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      syncFrontRef.current = null;
      beginFlipRef.current = null;
      renderOnceRef.current = null;
      try {
        delete (window as unknown as { __acMetal?: object }).__acMetal;
      } catch {
        /* ignore */
      }
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ro?.disconnect();
      for (const m of ribbonMeshes) m.geometry.dispose();
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

  const handleBack = () => {
    if (!interactiveRef.current) return;
    onFlipBack();
  };

  return (
    <div
      ref={hostRef}
      className={`ac-metal3d absolute inset-0 min-h-0 ${
        stageActive ? 'ac-metal3d--active' : 'ac-metal3d--idle'
      }`}
      aria-hidden={!stageActive}
    >
      <div className="ac-dial-square absolute inset-0 w-full h-full">
        <div className="ac-dial-square-inner">
          <canvas
            ref={canvasRef}
            className="touch-none block ac-canvas-layer ac-metal3d-canvas"
            aria-label="Metal day clock — tap or swipe to return to sky dial"
            onPointerDown={(e) => {
              if (e.isPrimary === false) return;
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {
                /* ignore */
              }
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              try {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }
              } catch {
                /* ignore */
              }
              if (face === 'bauhaus') handleBack();
            }}
          />
        </div>
      </div>
      <div
        className={`ac-bauhaus-chrome absolute bottom-0 left-0 right-0 px-3 pb-3 pt-1 text-center pointer-events-none z-[1] ${
          showChrome ? 'ac-bauhaus-chrome--in' : 'ac-bauhaus-chrome--out'
        }`}
        data-ac-bauhaus-chrome
      >
        <div className="text-[11px] text-mist/75 tracking-wide">{dayLabel}</div>
        <div className="text-[9px] text-mist/42 mt-0.5 uppercase tracking-[0.14em]">
          Good · Mid · Hard stretches of the day
        </div>
        <div className="mt-2 pointer-events-auto inline-flex">
          <button
            type="button"
            onClick={handleBack}
            disabled={!interactive || !showChrome}
            className="ac-chip rounded-full px-3.5 py-1.5 min-h-8 text-[10px] uppercase tracking-wider text-gold border border-gold/35"
          >
            Sky dial
          </button>
        </div>
      </div>
    </div>
  );
}
