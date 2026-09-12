import { TARGET_RATE } from "./protocol";
import { fadeEdges, floatToInt16, int16ToFloat, mixToMono, resample } from "./audio";

/** Residual vector quantizer — SoundStream-shaped, analytic codebooks (no giant weight file). */
export const CODEC_RATE = 8000;
export const FRAME = 320; // 40 ms @ 8 kHz — speech-rate, 30s fits the mosaic
export const BANDS = 4;
export const BAND = Math.floor(FRAME / 2 / BANDS);
export const CODEBOOK = 256;
export const BYTES_PER_FRAME = BANDS * 2;
export const BITS_PER_SEC = BYTES_PER_FRAME * (CODEC_RATE / FRAME) * 8;

const SHAPES: Float32Array[] = [];
const COS = new Float64Array(FRAME * FRAME);

(function init() {
  for (let k = 0; k < FRAME; k++) {
    for (let n = 0; n < FRAME; n++) COS[k * FRAME + n] = Math.cos((Math.PI / FRAME) * (n + 0.5) * k);
  }
  for (let i = 0; i < CODEBOOK; i++) {
    const v = new Float32Array(BAND);
    let nrg = 0;
    for (let k = 0; k < BAND; k++) {
      const env = Math.exp((-k * ((i % 9) + 1)) / 18);
      const osc = Math.sin((Math.PI * (i + 1) * (k + 0.5)) / CODEBOOK);
      const noise = (((i * 1103515245 + k * 12345) >>> 0) / 0xffffffff - 0.5) * 0.35;
      v[k] = env * osc + noise;
      nrg += v[k]! * v[k]!;
    }
    const inv = 1 / Math.sqrt(nrg || 1);
    for (let k = 0; k < BAND; k++) v[k]! *= inv;
    SHAPES.push(v);
  }
})();

function dctFrame(x: Float32Array): Float64Array {
  const X = new Float64Array(FRAME);
  for (let k = 0; k < FRAME; k++) {
    let s = 0;
    for (let n = 0; n < FRAME; n++) s += x[n]! * COS[k * FRAME + n]!;
    X[k] = s;
  }
  return X;
}

function idctFrame(X: Float64Array): Float32Array {
  const x = new Float32Array(FRAME);
  const scale = 2 / FRAME;
  for (let n = 0; n < FRAME; n++) {
    let s = 0.5 * X[0]!;
    for (let k = 1; k < FRAME; k++) s += X[k]! * COS[k * FRAME + n]!;
    x[n] = s * scale;
  }
  return x;
}

function nearest(band: Float64Array): { idx: number; gain: number } {
  let best = 0;
  let bestDot = -1e15;
  for (let i = 0; i < CODEBOOK; i++) {
    const s = SHAPES[i]!;
    let dot = 0;
    for (let k = 0; k < BAND; k++) dot += band[k]! * s[k]!;
    if (dot > bestDot) {
      bestDot = dot;
      best = i;
    }
  }
  return { idx: best, gain: bestDot };
}

function quantGain(g: number): number {
  const mag = Math.min(15, Math.max(0, Math.round(Math.log2(1 + Math.abs(g)) * 2)));
  const sign = g < 0 ? 8 : 0;
  return sign | (mag & 7);
}

function dequantGain(q: number): number {
  const sign = q & 8 ? -1 : 1;
  const mag = q & 7;
  return sign * (2 ** (mag / 2) - 1);
}

export function encodeRvq(pcm: Int16Array, sampleRate: number): Uint8Array {
  const f = int16ToFloat(pcm);
  const mono = mixToMono(f, 1);
  const at8 = fadeEdges(resample(mono, sampleRate, CODEC_RATE), CODEC_RATE, 8);
  const frames = Math.max(1, Math.floor(at8.length / FRAME));
  const out = new Uint8Array(2 + frames * BYTES_PER_FRAME);
  new DataView(out.buffer).setUint16(0, frames, true);
  const win = new Float32Array(FRAME);
  for (let i = 0; i < frames; i++) {
    win.set(at8.subarray(i * FRAME, i * FRAME + FRAME));
    const spec = dctFrame(win);
    const o = 2 + i * BYTES_PER_FRAME;
    for (let b = 0; b < BANDS; b++) {
      const slice = spec.subarray(b * BAND, (b + 1) * BAND);
      const { idx, gain } = nearest(slice);
      out[o + b * 2] = idx;
      out[o + b * 2 + 1] = quantGain(gain);
    }
  }
  return out;
}

export function decodeRvq(bytes: Uint8Array): { pcm: Int16Array; sampleRate: number } {
  if (bytes.length < 2) return { pcm: new Int16Array(0), sampleRate: TARGET_RATE };
  const frames = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint16(0, true);
  const pcm8 = new Float32Array(frames * FRAME);
  const spec = new Float64Array(FRAME);
  for (let i = 0; i < frames; i++) {
    spec.fill(0);
    const o = 2 + i * BYTES_PER_FRAME;
    if (o + BYTES_PER_FRAME > bytes.length) break;
    for (let b = 0; b < BANDS; b++) {
      const idx = bytes[o + b * 2]!;
      const g = dequantGain(bytes[o + b * 2 + 1]!);
      const shape = SHAPES[idx]!;
      for (let k = 0; k < BAND; k++) spec[b * BAND + k] = g * shape[k]!;
    }
    pcm8.set(idctFrame(spec), i * FRAME);
  }
  const up = fadeEdges(resample(pcm8, CODEC_RATE, TARGET_RATE), TARGET_RATE, 8);
  return { pcm: floatToInt16(up), sampleRate: TARGET_RATE };
}

export function rvqDurationMs(bytes: Uint8Array): number {
  if (bytes.length < 2) return 0;
  const frames = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint16(0, true);
  return Math.round((frames * FRAME * 1000) / CODEC_RATE);
}
