import { crc32 } from "./crc32";

export const MAGIC = "PICTUNE5";
export const VERSION = 5;
export const HEADER_BYTES = 48;
export const TARGET_RATE = 16000;
export const CANVAS = 1600;
export const HOLD_SECONDS = 30;
export const QUIET = 4;
export const FINDER = 7;
export const ALIGN = 5;
export const CENTER = 13;
export const BITS = 2;
export const MIN_GRID = 56;
export const MAX_GRID = 200;
export const PNG_CHUNK = "ptA5";

export class PicTuneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PicTuneError";
  }
}

export const INK: readonly [number, number, number] = [16, 16, 18];
export const PAPER: readonly [number, number, number] = [246, 241, 230];
export const GOLD: readonly [number, number, number] = [255, 212, 59];

/** Four chroma-separated data hues. Lightness is free for the painting. */
export const DATA_BASE: readonly (readonly [number, number, number])[] = [
  [255, 212, 59], // gold
  [224, 49, 49], // crimson
  [15, 166, 122], // teal
  [37, 99, 235], // blue
];

export interface PicTuneHeader {
  magic: string;
  version: number;
  sampleRate: number;
  channels: 1;
  frameCount: number;
  crc32: number;
  durationMs: number;
  payloadBytes: number;
}

export function packHeader(h: {
  sampleRate: number;
  frameCount: number;
  crc32: number;
  durationMs: number;
  payloadBytes: number;
}): Uint8Array {
  const buf = new Uint8Array(HEADER_BYTES);
  const view = new DataView(buf.buffer);
  for (let i = 0; i < 8; i++) buf[i] = MAGIC.charCodeAt(i);
  view.setUint8(8, VERSION);
  view.setUint8(9, 1);
  view.setUint16(10, h.sampleRate, true);
  view.setUint32(12, h.frameCount, true);
  view.setUint32(16, h.crc32, true);
  view.setUint32(20, h.durationMs, true);
  view.setUint32(24, h.payloadBytes, true);
  return buf;
}

export function unpackHeader(bytes: Uint8Array): PicTuneHeader {
  if (bytes.length < HEADER_BYTES) throw new PicTuneError("this isn't a pictune.");
  const magic = String.fromCharCode(...bytes.subarray(0, 8));
  if (magic === "PICTUNE1" || magic === "PICTUNE2" || magic === "PICTUNE3" || magic === "PICTUNE4") {
    throw new PicTuneError("this pictune is from an older studio — make a new one.");
  }
  if (magic !== MAGIC) throw new PicTuneError("this isn't a pictune.");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const version = view.getUint8(8);
  if (version !== VERSION) throw new PicTuneError("this pictune is from a newer studio.");
  const sampleRate = view.getUint16(10, true);
  const frameCount = view.getUint32(12, true);
  const sum = view.getUint32(16, true);
  const durationMs = view.getUint32(20, true);
  const payloadBytes = view.getUint32(24, true);
  if (!sampleRate || !payloadBytes) throw new PicTuneError("this pictune looks empty.");
  return {
    magic,
    version,
    sampleRate,
    channels: 1,
    frameCount,
    crc32: sum,
    durationMs,
    payloadBytes,
  };
}

export function payloadCrc(bytes: Uint8Array): number {
  return crc32(bytes);
}

function chroma(r: number, g: number, b: number): [number, number] {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  return [0.564 * (b - y), 0.713 * (r - y)];
}

/** Classify by chrominance only — lightness is the painting, not the data. */
export function chromaSymbol(
  r: number,
  g: number,
  b: number,
  bases: readonly (readonly [number, number, number])[] = DATA_BASE,
): number {
  const [cb, cr] = chroma(r, g, b);
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < bases.length; i++) {
    const p = bases[i]!;
    const [pcb, pcr] = chroma(p[0], p[1], p[2]);
    const d = (cb - pcb) * (cb - pcb) + (cr - pcr) * (cr - pcr);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

export function tone(
  base: readonly [number, number, number],
  light: number,
): [number, number, number] {
  const t = Math.max(0, Math.min(1, light));
  if (t >= 0.5) {
    const u = (t - 0.5) * 2 * 0.42;
    return [
      Math.round(base[0] + (255 - base[0]) * u),
      Math.round(base[1] + (248 - base[1]) * u),
      Math.round(base[2] + (236 - base[2]) * u),
    ];
  }
  const u = (0.5 - t) * 2 * 0.58;
  return [
    Math.round(base[0] + (18 - base[0]) * u),
    Math.round(base[1] + (16 - base[1]) * u),
    Math.round(base[2] + (14 - base[2]) * u),
  ];
}

export function nearestPalette(
  r: number,
  g: number,
  b: number,
  palette: readonly (readonly [number, number, number])[] = DATA_BASE,
): number {
  return chromaSymbol(r, g, b, palette);
}
