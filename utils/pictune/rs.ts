/**
 * Reed–Solomon over GF(256), primitive 0x11d.
 * Systematic blocks of 255: K data + NSYM parity. Corrects floor(NSYM/2) bytes.
 * Encoder/decoder follow the Wikiversity RS-for-coders construction.
 */
export const RS_N = 255;
export const RS_NSYM = 64;
export const RS_K = RS_N - RS_NSYM;

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

(function init() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]!;
})();

function mul(a: number, b: number): number {
  if (!a || !b) return 0;
  return EXP[LOG[a]! + LOG[b]!]!;
}

function inverse(a: number): number {
  if (!a) throw new Error("gf inverse 0");
  return EXP[255 - LOG[a]!]!;
}

function polyMul(p: number[], q: number[]): number[] {
  const r = new Array(p.length + q.length - 1).fill(0);
  for (let j = 0; j < q.length; j++) {
    for (let i = 0; i < p.length; i++) r[i + j]! ^= mul(p[i]!, q[j]!);
  }
  return r;
}

function polyEval(p: number[] | Uint8Array, x: number): number {
  let y = p[0]!;
  for (let i = 1; i < p.length; i++) y = mul(y, x) ^ p[i]!;
  return y;
}

function polyScale(p: number[], x: number): number[] {
  return p.map((c) => mul(c, x));
}

function polyAdd(p: number[], q: number[]): number[] {
  const r = new Array(Math.max(p.length, q.length)).fill(0);
  for (let i = 0; i < p.length; i++) r[i + r.length - p.length]! ^= p[i]!;
  for (let i = 0; i < q.length; i++) r[i + r.length - q.length]! ^= q[i]!;
  return r;
}

let GEN: number[] | null = null;
function generator(): number[] {
  if (GEN) return GEN;
  let g = [1];
  for (let i = 0; i < RS_NSYM; i++) g = polyMul(g, [1, EXP[i]!]);
  GEN = g;
  return g;
}

export function rsEncodeBlock(data: Uint8Array): Uint8Array {
  if (data.length !== RS_K) throw new Error("rs data length");
  const gen = generator();
  const out = new Uint8Array(RS_N);
  out.set(data);
  for (let i = 0; i < RS_K; i++) {
    const coef = out[i]!;
    if (!coef) continue;
    for (let j = 0; j < gen.length; j++) out[i + j]! ^= mul(gen[j]!, coef);
  }
  const block = new Uint8Array(RS_N);
  block.set(data);
  block.set(out.subarray(RS_K), RS_K);
  return block;
}

function syndromes(msg: Uint8Array): number[] {
  const syn = [0];
  let all = 0;
  for (let i = 0; i < RS_NSYM; i++) {
    const s = polyEval(msg, EXP[i]!);
    syn.push(s);
    all |= s;
  }
  return all ? syn : [];
}

function errorLocator(synd: number[]): number[] | null {
  let errLoc = [1];
  let oldLoc = [1];
  for (let i = 0; i < RS_NSYM; i++) {
    let delta = synd[i + 1]!;
    for (let j = 1; j < errLoc.length; j++) {
      delta ^= mul(errLoc[errLoc.length - 1 - j]!, synd[i + 1 - j]!);
    }
    oldLoc = oldLoc.concat([0]);
    if (delta !== 0) {
      if (oldLoc.length > errLoc.length) {
        const newLoc = polyScale(oldLoc, delta);
        oldLoc = polyScale(errLoc, inverse(delta));
        errLoc = newLoc;
      }
      errLoc = polyAdd(errLoc, polyScale(oldLoc, delta));
    }
  }
  while (errLoc.length && errLoc[0] === 0) errLoc.shift();
  const errs = errLoc.length - 1;
  if (errs <= 0 || errs * 2 > RS_NSYM) return null;
  return errLoc;
}

function findErrors(errLoc: number[], nmess: number): number[] | null {
  const errs = errLoc.length - 1;
  const pos: number[] = [];
  for (let i = 0; i < nmess; i++) {
    if (polyEval(errLoc, EXP[i]!) === 0) pos.push((i + nmess - 1) % nmess);
  }
  if (pos.length !== errs) return null;
  return pos;
}

function errorMags(synd: number[], pos: number[]): number[] | null {
  const n = pos.length;
  const X = pos.map((p) => EXP[(RS_N - 1 - p) % 255]!);
  const A: number[][] = [];
  const y: number[] = [];
  for (let j = 0; j < n; j++) {
    const row = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let v = 1;
      for (let k = 0; k < j; k++) v = mul(v, X[i]!);
      row[i] = v;
    }
    A.push(row);
    y.push(synd[j + 1]!);
  }
  for (let i = 0; i < n; i++) {
    let piv = i;
    while (piv < n && A[piv]![i] === 0) piv++;
    if (piv === n) return null;
    [A[i], A[piv]] = [A[piv]!, A[i]!];
    [y[i], y[piv]] = [y[piv]!, y[i]!];
    const invP = inverse(A[i]![i]!);
    for (let c = i; c < n; c++) A[i]![c] = mul(A[i]![c]!, invP);
    y[i] = mul(y[i]!, invP);
    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const f = A[r]![i]!;
      if (!f) continue;
      for (let c = i; c < n; c++) A[r]![c]! ^= mul(f, A[i]![c]!);
      y[r]! ^= mul(f, y[i]!);
    }
  }
  return y;
}

export function rsDecodeBlock(block: Uint8Array): Uint8Array | null {
  if (block.length !== RS_N) return null;
  const copy = Array.from(block);
  const syn = syndromes(block);
  if (!syn.length) return block.slice(0, RS_K);
  const loc = errorLocator(syn);
  if (!loc) return null;
  const pos = findErrors(loc, RS_N);
  if (!pos) return null;
  const mag = errorMags(syn, pos);
  if (!mag) return null;
  for (let i = 0; i < pos.length; i++) copy[pos[i]!]! ^= mag[i]!;
  const check = syndromes(Uint8Array.from(copy));
  if (check.length) return null;
  return Uint8Array.from(copy.slice(0, RS_K));
}

export function interleave(blocks: Uint8Array[]): Uint8Array {
  const n = blocks.length;
  const out = new Uint8Array(n * RS_N);
  for (let i = 0; i < RS_N; i++) {
    for (let b = 0; b < n; b++) out[i * n + b] = blocks[b]![i]!;
  }
  return out;
}

export function deinterleave(bytes: Uint8Array, nBlocks: number): Uint8Array[] {
  const blocks = Array.from({ length: nBlocks }, () => new Uint8Array(RS_N));
  for (let i = 0; i < RS_N; i++) {
    for (let b = 0; b < nBlocks; b++) {
      const o = i * nBlocks + b;
      blocks[b]![i] = o < bytes.length ? bytes[o]! : 0;
    }
  }
  return blocks;
}
