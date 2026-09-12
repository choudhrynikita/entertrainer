import { crc32 } from "./crc32";

export const MAGIC = "PICTUNE4";
export const VERSION = 4;
export const HEADER_BYTES = 48;
export const TARGET_RATE = 16000;
export const CANVAS = 1600;
export const HOLD_SECONDS = 30;
export const QUIET = 4;
export const FINDER = 7;
export const ALIGN = 5;
export const CENTER = 11;
export const BITS = 3;
export const MIN_GRID = 64;
export const MAX_GRID = 216;
export const RS_DATA = 96;
export const RS_SYM = 32;
export const RS_BLOCK = RS_DATA + RS_SYM;

export class PicTuneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PicTuneError";
  }
}

/** 8 Lab-separated colors. Index is a 3-bit symbol. */
export const PALETTE: readonly (readonly [number, number, number])[] = [
  [11, 11, 12], // ink
  [242, 242, 244], // paper
  [255, 212, 59], // gold
  [37, 99, 235], // blue
  [224, 49, 49], // red
  [15, 166, 122], // teal
  [253, 126, 20], // orange
  [34, 184, 207], // cyan
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
  if (magic === "PICTUNE1" || magic === "PICTUNE2" || magic === "PICTUNE3") {
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

export function nearestPalette(
  r: number,
  g: number,
  b: number,
  palette: readonly (readonly [number, number, number])[] = PALETTE,
): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < palette.length; i++) {
    const p = palette[i]!;
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const py = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
    const cb = 0.564 * (b - y);
    const cr = 0.713 * (r - y);
    const pcb = 0.564 * (p[2] - py);
    const pcr = 0.713 * (p[0] - py);
    const d =
      (y - py) * (y - py) * 0.6 + (cb - pcb) * (cb - pcb) * 1.6 + (cr - pcr) * (cr - pcr) * 1.6;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}
