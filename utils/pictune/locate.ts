import { FINDER, MAX_GRID, MIN_GRID, PALETTE, nearestPalette, QUIET } from "./protocol";
import { PicTuneError } from "./protocol";
import { finderColor, formatSymbol, isKey, isTiming, keyIndex } from "./grid";

export interface Finder {
  x: number;
  y: number;
  size: number;
}

type Quad = { tl: Finder; tr: Finder; bl: Finder };

function lum(rgba: Uint8ClampedArray, w: number, x: number, y: number): number {
  const o = (y * w + x) * 4;
  return 0.299 * rgba[o]! + 0.587 * rgba[o + 1]! + 0.114 * rgba[o + 2]!;
}

function dark(rgba: Uint8ClampedArray, w: number, x: number, y: number): boolean {
  return lum(rgba, w, x, y) < 96;
}

function ratioOk(runs: number[]): boolean {
  const total = runs[0]! + runs[1]! + runs[2]! + runs[3]! + runs[4]!;
  if (total < 7) return false;
  const m = total / 7;
  const tol = m * 0.7;
  return (
    Math.abs(runs[0]! - m) < tol &&
    Math.abs(runs[1]! - m) < tol &&
    Math.abs(runs[2]! - 3 * m) < tol * 2 &&
    Math.abs(runs[3]! - m) < tol &&
    Math.abs(runs[4]! - m) < tol
  );
}

function cluster(finders: Finder[]): Finder[] {
  const out: Finder[] = [];
  for (const f of finders) {
    const hit = out.find((o) => Math.hypot(o.x - f.x, o.y - f.y) < Math.min(o.size, f.size) * 0.22);
    if (hit) {
      const n = 2;
      hit.x = (hit.x + f.x) / n;
      hit.y = (hit.y + f.y) / n;
      hit.size = Math.max(hit.size, f.size);
    } else out.push({ ...f });
  }
  return out;
}

function orderFinders(a: Finder, b: Finder, c: Finder): [Finder, Finder, Finder] {
  const d = (p: Finder, q: Finder) => Math.hypot(p.x - q.x, p.y - q.y);
  const ab = d(a, b),
    ac = d(a, c),
    bc = d(b, c);
  let tl: Finder, other1: Finder, other2: Finder;
  if (ab >= ac && ab >= bc) {
    tl = c;
    other1 = a;
    other2 = b;
  } else if (ac >= ab && ac >= bc) {
    tl = b;
    other1 = a;
    other2 = c;
  } else {
    tl = a;
    other1 = b;
    other2 = c;
  }
  const cross = (other1.x - tl.x) * (other2.y - tl.y) - (other1.y - tl.y) * (other2.x - tl.x);
  const tr = cross > 0 ? other1 : other2;
  const bl = cross > 0 ? other2 : other1;
  return [tl, tr, bl];
}

function scoreFinder(rgba: Uint8ClampedArray, w: number, h: number, f: Finder): number {
  const m = f.size / 7;
  const x0 = f.x - 3.5 * m;
  const y0 = f.y - 3.5 * m;
  let ok = 0;
  for (let ly = 0; ly < 7; ly++) {
    for (let lx = 0; lx < 7; lx++) {
      const xx = Math.round(x0 + (lx + 0.5) * m);
      const yy = Math.round(y0 + (ly + 0.5) * m);
      if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
      const expectDark = finderColor(lx, ly) === 0;
      if (dark(rgba, w, xx, yy) === expectDark) ok++;
    }
  }
  return ok / 49;
}

function sampleRgb(
  rgba: Uint8ClampedArray,
  w: number,
  h: number,
  x: number,
  y: number,
): [number, number, number] {
  if (x < 0 || y < 0 || x >= w - 1 || y >= h - 1) {
    const xx = Math.max(0, Math.min(w - 1, Math.round(x)));
    const yy = Math.max(0, Math.min(h - 1, Math.round(y)));
    const o = (yy * w + xx) * 4;
    return [rgba[o]!, rgba[o + 1]!, rgba[o + 2]!];
  }
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const at = (xx: number, yy: number) => {
    const o = (yy * w + xx) * 4;
    return [rgba[o]!, rgba[o + 1]!, rgba[o + 2]!] as const;
  };
  const p00 = at(x0, y0);
  const p10 = at(x0 + 1, y0);
  const p01 = at(x0, y0 + 1);
  const p11 = at(x0 + 1, y0 + 1);
  const mix = (a: number, b: number, t: number) => a * (1 - t) + b * t;
  return [
    mix(mix(p00[0], p10[0], fx), mix(p01[0], p11[0], fx), fy),
    mix(mix(p00[1], p10[1], fx), mix(p01[1], p11[1], fx), fy),
    mix(mix(p00[2], p10[2], fx), mix(p01[2], p11[2], fx), fy),
  ];
}

function sampleLum(rgba: Uint8ClampedArray, w: number, h: number, x: number, y: number): number {
  const [r, g, b] = sampleRgb(rgba, w, h, x, y);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function cellMeanLum(
  rgba: Uint8ClampedArray,
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): number {
  const xa = Math.max(0, Math.floor(x0 + 0.5));
  const xb = Math.min(w - 1, Math.ceil(x1 - 0.5) - 1);
  const ya = Math.max(0, Math.floor(y0 + 0.5));
  const yb = Math.min(h - 1, Math.ceil(y1 - 0.5) - 1);
  if (xb < xa || yb < ya) return sampleLum(rgba, w, h, (x0 + x1) / 2, (y0 + y1) / 2);
  let s = 0;
  let n = 0;
  const step = Math.max(1, Math.floor(Math.min(xb - xa, yb - ya) / 4));
  for (let y = ya; y <= yb; y += step) {
    for (let x = xa; x <= xb; x += step) {
      s += lum(rgba, w, x, y);
      n++;
    }
  }
  return n ? s / n : 0;
}

/** Mean-of-cell finder score — shift-sensitive, unlike center-pixel probes. */
function areaFinder(rgba: Uint8ClampedArray, w: number, h: number, f: Finder): number {
  const m = f.size / 7;
  const x0 = f.x - 3.5 * m;
  const y0 = f.y - 3.5 * m;
  let s = 0;
  for (let ly = 0; ly < 7; ly++) {
    for (let lx = 0; lx < 7; lx++) {
      const mean = cellMeanLum(rgba, w, h, x0 + lx * m, y0 + ly * m, x0 + (lx + 1) * m, y0 + (ly + 1) * m);
      s += finderColor(lx, ly) === 0 ? 80 - mean : mean - 80;
    }
  }
  return s;
}

type Run = { dark: boolean; count: number; start: number };

function collectRuns(
  rgba: Uint8ClampedArray,
  w: number,
  h: number,
  fixed: number,
  horizontal: boolean,
): Run[] {
  const limit = horizontal ? w : h;
  const isDark = (t: number) => (horizontal ? dark(rgba, w, t, fixed) : dark(rgba, w, fixed, t));
  const runs: Run[] = [];
  if (limit <= 0) return runs;
  let last = isDark(0);
  let count = 1;
  let start = 0;
  for (let t = 1; t < limit; t++) {
    const d = isDark(t);
    if (d === last) count++;
    else {
      runs.push({ dark: last, count, start });
      last = d;
      start = t;
      count = 1;
    }
  }
  runs.push({ dark: last, count, start });
  return runs;
}

function bestRingCenter(runs: Run[], expectedModule: number, near: number): number | null {
  let best: number | null = null;
  let bestD = Infinity;
  for (let i = 0; i + 4 < runs.length; i++) {
    const slice = runs.slice(i, i + 5);
    const counts = slice.map((r) => r.count);
    if (!ratioOk(counts)) continue;
    const total = counts[0]! + counts[1]! + counts[2]! + counts[3]! + counts[4]!;
    const m = total / 7;
    if (Math.abs(m - expectedModule) > expectedModule * 0.35) continue;
    const mid = slice[0]!.start + counts[0]! + counts[1]! + counts[2]! / 2;
    const d = Math.abs(mid - near) + Math.abs(m - expectedModule) * 3;
    if (d < bestD) {
      bestD = d;
      best = mid;
    }
  }
  return best;
}

/** Re-lock a finder to the 1:1:3:1:1 ring at the known module pitch. */
function snapFinder(rgba: Uint8ClampedArray, w: number, h: number, f: Finder, module: number): Finder {
  let x = f.x;
  let y = f.y;
  for (let pass = 0; pass < 3; pass++) {
    const row = collectRuns(rgba, w, h, Math.max(0, Math.min(h - 1, Math.round(y))), true);
    const cx = bestRingCenter(row, module, x);
    if (cx != null) x = cx;
    const col = collectRuns(rgba, w, h, Math.max(0, Math.min(w - 1, Math.round(x))), false);
    const cy = bestRingCenter(col, module, y);
    if (cy != null) y = cy;
  }
  const snapped: Finder = { x, y, size: module * FINDER };
  let best = snapped;
  let bestS = areaFinder(rgba, w, h, snapped);
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      if (dx === 0 && dy === 0) continue;
      const cand = { x: x + dx, y: y + dy, size: snapped.size };
      const s = areaFinder(rgba, w, h, cand);
      if (s > bestS) {
        bestS = s;
        best = cand;
      }
    }
  }
  for (let dy = -1; dy <= 1; dy += 0.5) {
    for (let dx = -1; dx <= 1; dx += 0.5) {
      const cand = { x: best.x + dx, y: best.y + dy, size: best.size };
      const s = areaFinder(rgba, w, h, cand);
      if (s > bestS) {
        bestS = s;
        best = cand;
      }
    }
  }
  return best;
}

function makeMap(q: Quad, n: number) {
  const originOff = (FINDER - 1) / 2;
  const br = { x: q.tr.x + (q.bl.x - q.tl.x), y: q.tr.y + (q.bl.y - q.tl.y) };
  return (mx: number, my: number) => {
    const u = (mx - originOff) / (n - FINDER);
    const v = (my - originOff) / (n - FINDER);
    const x = (1 - v) * ((1 - u) * q.tl.x + u * q.tr.x) + v * ((1 - u) * q.bl.x + u * br.x);
    const y = (1 - v) * ((1 - u) * q.tl.y + u * q.tr.y) + v * ((1 - u) * q.bl.y + u * br.y);
    return [x, y] as const;
  };
}

function scoreTiming(rgba: Uint8ClampedArray, w: number, h: number, q: Quad, n: number): number {
  const map = makeMap(q, n);
  let ok = 0;
  let tot = 0;
  const probe = (mx: number, my: number) => {
    if (!isTiming(mx, my, n)) return;
    const [cx, cy] = map(mx, my);
    const expectDark = (mx + my) % 2 === 1;
    tot++;
    if (sampleLum(rgba, w, h, cx, cy) < 96 === expectDark) ok++;
  };
  for (let i = FINDER + 1; i < n - FINDER; i++) {
    probe(i, 6);
    probe(6, i);
  }
  return tot ? ok / tot : 0;
}

function scoreFormat(rgba: Uint8ClampedArray, w: number, h: number, q: Quad, n: number): number {
  const map = makeMap(q, n);
  let ok = 0;
  for (let i = 0; i < 6; i++) {
    const expect = formatSymbol(n, i);
    const [ax, ay] = map(8 + i, 7);
    const [bx, by] = map(n - 14 + i, 7);
    if (nearestPalette(...sampleRgb(rgba, w, h, ax, ay)) === expect) ok++;
    if (nearestPalette(...sampleRgb(rgba, w, h, bx, by)) === expect) ok++;
  }
  return ok / 12;
}

function lockQuad(rgba: Uint8ClampedArray, w: number, h: number, q: Quad, n: number): Quad {
  const combo = (cand: Quad) => scoreTiming(rgba, w, h, cand, n) * 2 + scoreFormat(rgba, w, h, cand, n);
  let best = q;
  let bestS = combo(q);
  if (bestS > 2.85) return best;
  const nudge = (f: Finder, dx: number, dy: number): Finder => ({ x: f.x + dx, y: f.y + dy, size: f.size });
  const keys = ["tl", "tr", "bl"] as const;
  for (const key of keys) {
    let local = best;
    let localS = bestS;
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        if (dx === 0 && dy === 0) continue;
        const cand: Quad = { ...best, [key]: nudge(best[key], dx, dy) };
        const s = combo(cand);
        if (s > localS) {
          localS = s;
          local = cand;
        }
      }
    }
    best = local;
    bestS = localS;
    if (bestS > 2.85) break;
  }
  return best;
}

export function findFinders(rgba: Uint8ClampedArray, w: number, h: number): Finder[] {
  const raw: Finder[] = [];
  const step = Math.max(1, Math.floor(Math.min(w, h) / 400));

  const pushRing = (cx: number, cy: number, size: number) => {
    if (cx < 8 || cy < 8 || cx >= w - 8 || cy >= h - 8) return;
    raw.push({ x: cx, y: cy, size });
  };

  for (let y = 0; y < h; y += step) {
    const runs = [0, 0, 0, 0, 0];
    let state = 0;
    let last = dark(rgba, w, 0, y);
    for (let x = 0; x < w; x++) {
      const d = dark(rgba, w, x, y);
      if (d === last) {
        runs[state]!++;
        continue;
      }
      if (state === 4) {
        if (ratioOk(runs)) {
          const total = runs[0]! + runs[1]! + runs[2]! + runs[3]! + runs[4]!;
          const cx = x - total + runs[0]! + runs[1]! + runs[2]! / 2;
          const module = total / 7;
          const colRuns = collectRuns(rgba, w, h, Math.max(0, Math.min(w - 1, Math.round(cx))), false);
          const cy = bestRingCenter(colRuns, module, y);
          if (cy != null) pushRing(cx, cy, total);
        }
        runs[0] = runs[1]!;
        runs[1] = runs[2]!;
        runs[2] = runs[3]!;
        runs[3] = runs[4]!;
        runs[4] = 1;
        last = d;
        continue;
      } else {
        state++;
        runs[state] = 1;
      }
      last = d;
    }
  }

  for (let x = 0; x < w; x += step) {
    const runs = [0, 0, 0, 0, 0];
    let state = 0;
    let last = dark(rgba, w, x, 0);
    for (let y = 0; y < h; y++) {
      const d = dark(rgba, w, x, y);
      if (d === last) {
        runs[state]!++;
        continue;
      }
      if (state === 4) {
        if (ratioOk(runs)) {
          const total = runs[0]! + runs[1]! + runs[2]! + runs[3]! + runs[4]!;
          const cy = y - total + runs[0]! + runs[1]! + runs[2]! / 2;
          const module = total / 7;
          const rowRuns = collectRuns(rgba, w, h, Math.max(0, Math.min(h - 1, Math.round(cy))), true);
          const cx = bestRingCenter(rowRuns, module, x);
          if (cx != null) pushRing(cx, cy, total);
        }
        runs[0] = runs[1]!;
        runs[1] = runs[2]!;
        runs[2] = runs[3]!;
        runs[3] = runs[4]!;
        runs[4] = 1;
        last = d;
        continue;
      } else {
        state++;
        runs[state] = 1;
      }
      last = d;
    }
  }

  const grouped = cluster(raw)
    .map((f) => ({ ...f, s: scoreFinder(rgba, w, h, f) }))
    .filter((f) => f.size > 14 && f.s > 0.72)
    .sort((a, b) => b.s - a.s || b.size - a.size);

  const pickCorners = (list: Array<Finder & { s: number }>): Finder[] | null => {
    const m = Math.min(w, h) * 0.3;
    const inBox = (f: Finder, x0: number, y0: number, x1: number, y1: number) =>
      f.x >= x0 && f.x < x1 && f.y >= y0 && f.y < y1;
    const boxes = [
      list.filter((f) => inBox(f, 0, 0, m, m) && f.s > 0.85),
      list.filter((f) => inBox(f, w - m, 0, w, m) && f.s > 0.85),
      list.filter((f) => inBox(f, 0, h - m, m, h) && f.s > 0.85),
    ];
    if (boxes.some((b) => !b.length)) return null;
    let best: Finder[] | null = null;
    let bestScore = Infinity;
    for (const tl of boxes[0]!.slice(0, 4)) {
      for (const tr of boxes[1]!.slice(0, 4)) {
        for (const bl of boxes[2]!.slice(0, 4)) {
          const mean = (tl.size + tr.size + bl.size) / 3;
          if ([tl, tr, bl].some((f) => Math.abs(f.size - mean) > mean * 0.25)) continue;
          const dx = Math.hypot(tr.x - tl.x, tr.y - tl.y);
          const dy = Math.hypot(bl.x - tl.x, bl.y - tl.y);
          const ratio = dx / (dy || 1);
          const score = Math.abs(1 - ratio) + Math.abs(tl.size - tr.size) / mean + Math.abs(tl.size - bl.size) / mean;
          if (score < bestScore) {
            bestScore = score;
            best = [tl, tr, bl];
          }
        }
      }
    }
    return best;
  };

  const pickTriple = (list: Finder[]): Finder[] | null => {
    if (list.length < 3) return null;
    let best: Finder[] | null = null;
    let bestScore = 1.2;
    const top = list.slice(0, 10);
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        for (let k = j + 1; k < top.length; k++) {
          const [tl, tr, bl] = orderFinders(top[i]!, top[j]!, top[k]!);
          const mean = (tl.size + tr.size + bl.size) / 3;
          if ([tl, tr, bl].some((f) => Math.abs(f.size - mean) > mean * 0.45)) continue;
          const dx = Math.hypot(tr.x - tl.x, tr.y - tl.y);
          const dy = Math.hypot(bl.x - tl.x, bl.y - tl.y);
          if (dx < 40 || dy < 40) continue;
          const angle =
            ((tr.x - tl.x) * (bl.x - tl.x) + (tr.y - tl.y) * (bl.y - tl.y)) / (dx * dy || 1);
          const ratio = dx / (dy || 1);
          const span = Math.min(dx, dy) / Math.min(w, h);
          const score = Math.abs(angle) * 4 + Math.abs(1 - ratio) + (span < 0.35 ? 2 : 0);
          if (score < bestScore) {
            bestScore = score;
            best = [tl, tr, bl];
          }
        }
      }
    }
    return best;
  };

  const completePair = (a: Finder, b: Finder): Finder[] | null => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    if (Math.hypot(dx, dy) < 40) return null;
    const size = (a.size + b.size) / 2;
    const guesses: Finder[] = [
      { x: a.x - dy, y: a.y + dx, size },
      { x: a.x + dy, y: a.y - dx, size },
      { x: b.x - dy, y: b.y + dx, size },
      { x: b.x + dy, y: b.y - dx, size },
    ];
    let best: Finder | null = null;
    let bestS = 0.58;
    for (const g of guesses) {
      if (g.x < 8 || g.y < 8 || g.x >= w - 8 || g.y >= h - 8) continue;
      if (Math.hypot(g.x - a.x, g.y - a.y) < size || Math.hypot(g.x - b.x, g.y - b.y) < size) continue;
      const s = scoreFinder(rgba, w, h, g);
      if (s > bestS) {
        bestS = s;
        best = g;
      }
    }
    return best ? orderFinders(a, b, best) : null;
  };

  const corners = pickCorners(grouped);
  if (corners) return corners;
  const triple = pickTriple(grouped);
  if (triple) return triple;

  let pair: [Finder, Finder] | null = null;
  let far = 0;
  const top = grouped.slice(0, 6);
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      const d = Math.hypot(top[i]!.x - top[j]!.x, top[i]!.y - top[j]!.y);
      if (d > far) {
        far = d;
        pair = [top[i]!, top[j]!];
      }
    }
  }
  if (pair) {
    const done = completePair(pair[0], pair[1]);
    if (done) return done;
  }
  return grouped.slice(0, 3);
}

function keysLookValid(observed: readonly (readonly [number, number, number])[]): boolean {
  for (let i = 0; i < 8; i++) {
    const p = observed[i]!;
    if (nearestPalette(p[0], p[1], p[2], PALETTE) !== i) return false;
  }
  return true;
}

export function sampleGrid(
  rgba: Uint8ClampedArray,
  w: number,
  h: number,
  finders: Finder[],
): { grid: Uint8Array; n: number } {
  if (finders.length < 3) throw new PicTuneError("couldn't read this pictune. try a clearer photo.");
  const [tl0, tr0, bl0] = orderFinders(finders[0]!, finders[1]!, finders[2]!);
  const side = Math.hypot(tr0.x - tl0.x, tr0.y - tl0.y);

  const ranked: { cand: number; finder: number; size: number; module: number }[] = [];
  let bestFinder = 0;
  for (let cand = MIN_GRID; cand <= MAX_GRID; cand += 8) {
    const module = side / (cand - FINDER);
    const size = module * FINDER;
    const s =
      scoreFinder(rgba, w, h, { x: tl0.x, y: tl0.y, size }) +
      scoreFinder(rgba, w, h, { x: tr0.x, y: tr0.y, size }) +
      scoreFinder(rgba, w, h, { x: bl0.x, y: bl0.y, size });
    ranked.push({ cand, finder: s, size, module });
    if (s > bestFinder) bestFinder = s;
  }
  const pool = ranked.filter((r) => r.finder >= bestFinder - 0.15 && r.finder >= 2.2);
  if (!pool.length) throw new PicTuneError("couldn't lock onto this pictune.");

  let bestN = 0;
  let bestScore = -1;
  let bestQ: Quad | null = null;
  for (const r of pool) {
    const q = {
      tl: snapFinder(rgba, w, h, tl0, r.module),
      tr: snapFinder(rgba, w, h, tr0, r.module),
      bl: snapFinder(rgba, w, h, bl0, r.module),
    };
    const ts = scoreTiming(rgba, w, h, q, r.cand);
    const fs = scoreFormat(rgba, w, h, q, r.cand);
    const score = ts * 2 + fs + r.finder * 0.05;
    if (score > bestScore) {
      bestScore = score;
      bestN = r.cand;
      bestQ = q;
    }
  }
  if (!bestN || !bestQ || bestScore < 1.4) throw new PicTuneError("couldn't lock onto this pictune.");

  const q = lockQuad(rgba, w, h, bestQ, bestN);
  const gridN = bestN;
  const map = makeMap(q, gridN);
  const module = side / (gridN - FINDER);

  const rgbGrid = new Float32Array(gridN * gridN * 3);
  const core = Math.max(0.35, module * 0.1);
  for (let my = 0; my < gridN; my++) {
    for (let mx = 0; mx < gridN; mx++) {
      const [cx, cy] = map(mx, my);
      let r = 0,
        g = 0,
        b = 0,
        c = 0;
      const pts = [
        [cx, cy],
        [cx - core, cy],
        [cx + core, cy],
        [cx, cy - core],
        [cx, cy + core],
      ];
      for (const [sx, sy] of pts) {
        const [rr, gg, bb] = sampleRgb(rgba, w, h, sx, sy);
        r += rr;
        g += gg;
        b += bb;
        c++;
      }
      const o = (my * gridN + mx) * 3;
      rgbGrid[o] = r / c;
      rgbGrid[o + 1] = g / c;
      rgbGrid[o + 2] = b / c;
    }
  }

  const observed: [number, number, number][] = PALETTE.map((p) => [p[0], p[1], p[2]]);
  const acc = Array.from({ length: 8 }, () => [0, 0, 0, 0]);
  for (let my = 0; my < gridN; my++) {
    for (let mx = 0; mx < gridN; mx++) {
      if (!isKey(mx, my, gridN)) continue;
      const ki = keyIndex(mx, my, gridN);
      const o = (my * gridN + mx) * 3;
      acc[ki]![0] += rgbGrid[o]!;
      acc[ki]![1] += rgbGrid[o + 1]!;
      acc[ki]![2] += rgbGrid[o + 2]!;
      acc[ki]![3] += 1;
    }
  }
  for (let i = 0; i < 8; i++) {
    const a = acc[i]!;
    if (a[3]! >= 2) {
      observed[i] = [a[0]! / a[3]!, a[1]! / a[3]!, a[2]! / a[3]!];
    }
  }
  const palette = keysLookValid(observed) ? observed : PALETTE;

  const grid = new Uint8Array(gridN * gridN);
  for (let i = 0; i < gridN * gridN; i++) {
    grid[i] = nearestPalette(rgbGrid[i * 3]!, rgbGrid[i * 3 + 1]!, rgbGrid[i * 3 + 2]!, palette);
  }
  void QUIET;
  return { grid, n: gridN };
}
