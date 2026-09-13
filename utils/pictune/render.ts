import { ALIGN, CANVAS, CENTER, DATA_BASE, FINDER, GOLD, INK, PAPER, QUIET, tone } from "./protocol";
import {
  alignColor,
  finderColor,
  formatIndex,
  formatSymbol,
  isAlign,
  isCenter,
  isFinder,
  isFormat,
  isKey,
  isOutside,
  isSeparator,
  isTiming,
  keyIndex,
} from "./grid";

function setPx(
  rgba: Uint8ClampedArray,
  w: number,
  x: number,
  y: number,
  rgb: readonly [number, number, number],
  a = 255,
) {
  if (x < 0 || y < 0 || x >= w || y >= w) return;
  const o = (y * w + x) * 4;
  if (a >= 255) {
    rgba[o] = rgb[0];
    rgba[o + 1] = rgb[1];
    rgba[o + 2] = rgb[2];
    rgba[o + 3] = 255;
    return;
  }
  const u = a / 255;
  rgba[o] = Math.round(rgba[o]! * (1 - u) + rgb[0] * u);
  rgba[o + 1] = Math.round(rgba[o + 1]! * (1 - u) + rgb[1] * u);
  rgba[o + 2] = Math.round(rgba[o + 2]! * (1 - u) + rgb[2] * u);
  rgba[o + 3] = 255;
}

function fillRect(
  rgba: Uint8ClampedArray,
  w: number,
  x0: number,
  y0: number,
  bw: number,
  bh: number,
  rgb: readonly [number, number, number],
  r = 0,
) {
  const x1 = x0 + bw;
  const y1 = y0 + bh;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (r > 0) {
        const dx = x < x0 + r ? x0 + r - x : x >= x1 - r ? x - (x1 - r - 1) : 0;
        const dy = y < y0 + r ? y0 + r - y : y >= y1 - r ? y - (y1 - r - 1) : 0;
        if (dx > 0 && dy > 0 && dx * dx + dy * dy > r * r) continue;
      }
      setPx(rgba, w, x, y, rgb);
    }
  }
}

function fillCircle(
  rgba: Uint8ClampedArray,
  w: number,
  cx: number,
  cy: number,
  rad: number,
  rgb: readonly [number, number, number],
) {
  const r2 = rad * rad;
  const x0 = Math.max(0, Math.floor(cx - rad));
  const y0 = Math.max(0, Math.floor(cy - rad));
  const x1 = Math.min(w - 1, Math.ceil(cx + rad));
  const y1 = Math.min(w - 1, Math.ceil(cy + rad));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      if (dx * dx + dy * dy <= r2) setPx(rgba, w, x, y, rgb);
    }
  }
}

function strokeCircle(
  rgba: Uint8ClampedArray,
  w: number,
  cx: number,
  cy: number,
  rad: number,
  thickness: number,
  rgb: readonly [number, number, number],
) {
  const outer = (rad + thickness * 0.5) * (rad + thickness * 0.5);
  const inner = Math.max(0, rad - thickness * 0.5);
  const inner2 = inner * inner;
  const x0 = Math.max(0, Math.floor(cx - rad - thickness));
  const y0 = Math.max(0, Math.floor(cy - rad - thickness));
  const x1 = Math.min(w - 1, Math.ceil(cx + rad + thickness));
  const y1 = Math.min(w - 1, Math.ceil(cy + rad + thickness));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 <= outer && d2 >= inner2) setPx(rgba, w, x, y, rgb);
    }
  }
}

/** Engage listing mark: note head + stem + flag. */
function drawNote(
  rgba: Uint8ClampedArray,
  w: number,
  cx: number,
  cy: number,
  s: number,
  rgb: readonly [number, number, number],
) {
  const rot = (-18 * Math.PI) / 180;
  const hx = cx - s * 0.12;
  const hy = cy + s * 0.22;
  const rx = s * 0.28;
  const ry = s * 0.195;
  const x0 = Math.floor(hx - rx * 1.4);
  const y0 = Math.floor(hy - ry * 1.4);
  const x1 = Math.ceil(hx + rx * 1.4);
  const y1 = Math.ceil(hy + ry * 1.4);
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = x + 0.5 - hx;
      const dy = y + 0.5 - hy;
      const lx = dx * cos + dy * sin;
      const ly = -dx * sin + dy * cos;
      if ((lx * lx) / (rx * rx) + (ly * ly) / (ry * ry) <= 1) setPx(rgba, w, x, y, rgb);
    }
  }
  const stemW = Math.max(2, Math.round(s * 0.09));
  const stemH = s * 0.72;
  const sx = cx + s * 0.12;
  const sy = cy - s * 0.48;
  fillRect(rgba, w, Math.round(sx), Math.round(sy), stemW, Math.round(stemH), rgb, 1);
  const flagR = s * 0.28;
  for (let a = -20; a <= 95; a++) {
    const rad = (a * Math.PI) / 180;
    const px = Math.round(sx + stemW + Math.cos(rad) * flagR);
    const py = Math.round(sy + 4 + Math.sin(rad) * flagR * 0.7);
    for (let t = -Math.ceil(s * 0.04); t <= Math.ceil(s * 0.04); t++) {
      setPx(rgba, w, px + t, py, rgb);
      setPx(rgba, w, px, py + t, rgb);
    }
  }
}

function paperFill(rgba: Uint8ClampedArray, w: number) {
  for (let y = 0; y < w; y++) {
    for (let x = 0; x < w; x++) {
      const n =
        (((x * 374761 + y * 668265) >>> 0) % 17) - 8;
      const v: [number, number, number] = [
        Math.max(0, Math.min(255, PAPER[0] + n)),
        Math.max(0, Math.min(255, PAPER[1] + n)),
        Math.max(0, Math.min(255, PAPER[2] + n * 0.6)),
      ];
      setPx(rgba, w, x, y, v);
    }
  }
}

export function renderGrid(
  symbols: Uint8Array,
  n: number,
  energy?: Float32Array,
): {
  rgba: Uint8ClampedArray;
  width: number;
  height: number;
  module: number;
} {
  const cells = n + QUIET * 2;
  const width = CANVAS;
  const module = width / cells;
  const rgba = new Uint8ClampedArray(width * width * 4);
  paperFill(rgba, width);

  const origin = QUIET * module;
  const discCx = origin + (n / 2) * module;
  const discCy = origin + (n / 2) * module;
  const discR = (n * 0.5 - 1.1) * module;

  fillCircle(rgba, width, discCx, discCy, discR + module * 0.85, INK);
  fillCircle(rgba, width, discCx, discCy, discR + module * 0.55, GOLD);
  fillCircle(rgba, width, discCx, discCy, discR + module * 0.18, [32, 28, 24]);

  const cellRect = (x: number, y: number) => {
    const x0 = Math.round(origin + x * module);
    const y0 = Math.round(origin + y * module);
    const x1 = Math.round(origin + (x + 1) * module);
    const y1 = Math.round(origin + (y + 1) * module);
    return [x0, y0, x1 - x0, y1 - y0] as const;
  };

  const goldInk = (on: boolean): readonly [number, number, number] => (on ? GOLD : INK);

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const [px, py, pw, ph] = cellRect(x, y);
      let rgb: readonly [number, number, number] | null = null;
      if (isFinder(x, y, n)) {
        const lx = x < FINDER ? x : x - (n - FINDER);
        const ly = y < FINDER ? y : y - (n - FINDER);
        rgb = goldInk(finderColor(lx, ly) === 1);
      } else if (isSeparator(x, y, n)) {
        rgb = INK;
      } else if (isAlign(x, y, n)) {
        const a0 = n - ALIGN - 2;
        rgb = goldInk(alignColor(x - a0, y - a0) === 1);
      } else if (isTiming(x, y, n)) {
        rgb = goldInk((x + y) % 2 === 0);
      } else if (isKey(x, y, n)) {
        const ki = keyIndex(x, y, n);
        rgb = tone(DATA_BASE[ki]!, 0.5);
      } else if (isFormat(x, y, n)) {
        rgb = tone(DATA_BASE[formatSymbol(n, formatIndex(x, y, n))]!, 0.5);
      } else if (isCenter(x, y, n)) {
        continue;
      } else if (isOutside(x, y, n)) {
        continue;
      } else {
        const sym = symbols[y * n + x] ?? 0;
        const e = energy ? energy[y * n + x]! : 0.5;
        const light = 0.28 + 0.44 * Math.max(0, Math.min(1, e));
        rgb = tone(DATA_BASE[sym & 3]!, light);
      }
      if (!rgb) continue;
      const inset = Math.max(1, Math.round(module * 0.06));
      fillRect(
        rgba,
        width,
        px + inset,
        py + inset,
        pw - inset * 2,
        ph - inset * 2,
        rgb,
        Math.round(module * 0.22),
      );
    }
  }

  const c0 = Math.floor((n - CENTER) / 2);
  const ccx = origin + (c0 + CENTER / 2) * module;
  const ccy = origin + (c0 + CENTER / 2) * module;
  const cr = (CENTER * module) / 2;
  fillCircle(rgba, width, ccx, ccy, cr, PAPER);
  strokeCircle(rgba, width, ccx, ccy, cr * 0.92, Math.max(2, module * 0.18), GOLD);
  drawNote(rgba, width, ccx, ccy, cr * 0.95, INK);

  strokeCircle(rgba, width, discCx, discCy, discR * 0.985, 1.5, [40, 36, 30]);

  return { rgba, width, height: width, module };
}
