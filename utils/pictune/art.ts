import { int16ToFloat } from "./audio";

/** Per-module energy 0..1 from a polar spectrogram of the take. */
export function polarEnergy(pcm: Int16Array, sampleRate: number, n: number): Float32Array {
  const f = int16ToFloat(pcm);
  const frames = 96;
  const bins = 40;
  const spec = stft(f, sampleRate, frames, bins);
  const out = new Float32Array(n * n);
  const cx = (n - 1) / 2;
  const cy = (n - 1) / 2;
  const maxR = n * 0.5;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy) / maxR;
      let theta = Math.atan2(dy, dx);
      if (theta < 0) theta += Math.PI * 2;
      const t = theta / (Math.PI * 2);
      const freq = Math.min(1, Math.max(0, (r - 0.14) / 0.8));
      const logF = Math.pow(freq, 0.72);
      out[y * n + x] = sampleBilinear(spec, frames, bins, t * (frames - 1), logF * (bins - 1));
    }
  }
  return out;
}

function stft(pcm: Float32Array, rate: number, frames: number, bins: number): Float32Array {
  const out = new Float32Array(frames * bins);
  const n = pcm.length;
  const hop = Math.max(1, Math.floor(n / frames));
  const win = Math.max(32, Math.floor(rate * 0.04));
  let peak = 1e-6;
  for (let t = 0; t < frames; t++) {
    const origin = Math.min(n - 1, t * hop);
    for (let b = 0; b < bins; b++) {
      const freq = 80 * Math.pow((rate * 0.42) / 80, b / Math.max(1, bins - 1));
      const w = (2 * Math.PI * freq) / rate;
      let re = 0;
      let im = 0;
      const half = win / 2;
      for (let k = 0; k < win; k++) {
        const i = origin + k - half;
        if (i < 0 || i >= n) continue;
        const hann = 0.5 - 0.5 * Math.cos((2 * Math.PI * k) / win);
        const s = pcm[i]! * hann;
        re += s * Math.cos(w * k);
        im += s * Math.sin(w * k);
      }
      const mag = Math.log1p(Math.hypot(re, im));
      out[t * bins + b] = mag;
      if (mag > peak) peak = mag;
    }
  }
  const inv = 1 / peak;
  for (let i = 0; i < out.length; i++) out[i]! *= inv;
  return out;
}

function sampleBilinear(spec: Float32Array, frames: number, bins: number, t: number, f: number): number {
  const t0 = Math.max(0, Math.min(frames - 1, Math.floor(t)));
  const t1 = Math.min(frames - 1, t0 + 1);
  const f0 = Math.max(0, Math.min(bins - 1, Math.floor(f)));
  const f1 = Math.min(bins - 1, f0 + 1);
  const wt = t - t0;
  const wf = f - f0;
  const a = spec[t0 * bins + f0]!;
  const b = spec[t0 * bins + f1]!;
  const c = spec[t1 * bins + f0]!;
  const d = spec[t1 * bins + f1]!;
  return (a * (1 - wf) + b * wf) * (1 - wt) + (c * (1 - wf) + d * wf) * wt;
}
