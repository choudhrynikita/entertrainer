import { ALIGN, CANVAS, CENTER, FINDER, PALETTE, QUIET } from "./protocol";
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
  isSeparator,
  isTiming,
  keyIndex,
} from "./grid";

function setPx(rgba: Uint8ClampedArray, w: number, x: number, y: number, rgb: readonly [number, number, number]) {
  if (x < 0 || y < 0 || x >= w || y >= w) return;
  const o = (y * w + x) * 4;
  rgba[o] = rgb[0];
  rgba[o + 1] = rgb[1];
  rgba[o + 2] = rgb[2];
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

function drawPt(rgba: Uint8ClampedArray, w: number, cx: number, cy: number, s: number) {
  const gold = PALETTE[2]!;
  const ink = PALETTE[0]!;
  fillCircle(rgba, w, cx, cy, s * 0.92, ink);
  fillCircle(rgba, w, cx, cy, s * 0.92, gold);
  fillCircle(rgba, w, cx, cy, s * 0.78, ink);
  const x = cx - s * 0.42;
  const y = cy - s * 0.4;
  fillRect(rgba, w, x, y, s * 0.18, s * 0.82, gold, 2);
  fillRect(rgba, w, x, y, s * 0.72, s * 0.18, gold, 2);
  const r = s * 0.28;
  const ox = x + s * 0.52;
  const oy = y + s * 0.48;
  for (let a = 0; a < 360; a++) {
    const rad = (a * Math.PI) / 180;
    const px = Math.round(ox + Math.cos(rad) * r);
    const py = Math.round(oy + Math.sin(rad) * r);
    for (let t = -1; t <= 1; t++) {
      setPx(rgba, w, px + t, py, gold);
      setPx(rgba, w, px, py + t, gold);
    }
  }
}

export function renderGrid(symbols: Uint8Array, n: number): {
  rgba: Uint8ClampedArray;
  width: number;
  height: number;
  module: number;
} {
  const cells = n + QUIET * 2;
  const width = CANVAS;
  const module = width / cells;
  const rgba = new Uint8ClampedArray(width * width * 4);
  const ink = PALETTE[0]!;
  fillRect(rgba, width, 0, 0, width, width, ink);

  const origin = QUIET * module;
  const solid = module < 12;

  const cellRect = (x: number, y: number) => {
    const x0 = Math.round(origin + x * module);
    const y0 = Math.round(origin + y * module);
    const x1 = Math.round(origin + (x + 1) * module);
    const y1 = Math.round(origin + (y + 1) * module);
    return [x0, y0, x1 - x0, y1 - y0] as const;
  };

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let color = symbols[y * n + x] ?? 0;
      let reserved = false;
      if (isFinder(x, y, n)) {
        const lx = x < FINDER ? x : x - (n - FINDER);
        const ly = y < FINDER ? y : y - (n - FINDER);
        color = finderColor(lx, ly);
        reserved = true;
      } else if (isSeparator(x, y, n)) {
        color = 0;
        reserved = true;
      } else if (isAlign(x, y, n)) {
        const a0 = n - ALIGN - 2;
        color = alignColor(x - a0, y - a0);
        reserved = true;
      } else if (isTiming(x, y, n)) {
        color = (x + y) % 2 === 0 ? 2 : 0;
        reserved = true;
      } else if (isKey(x, y, n)) {
        color = keyIndex(x, y, n);
        reserved = true;
      } else if (isFormat(x, y, n)) {
        color = formatSymbol(n, formatIndex(x, y, n));
        reserved = true;
      } else if (isCenter(x, y, n)) {
        continue;
      }
      const rgb = PALETTE[color] ?? ink;
      const [px, py, pw, ph] = cellRect(x, y);
      if (reserved || solid) {
        fillRect(rgba, width, px, py, pw, ph, rgb);
      } else {
        const inset = Math.max(1, Math.round(module * 0.08));
        fillRect(
          rgba,
          width,
          px + inset,
          py + inset,
          pw - inset * 2,
          ph - inset * 2,
          rgb,
          Math.round(module * 0.28),
        );
      }
    }
  }

  const c0 = Math.floor((n - CENTER) / 2);
  const ccx = origin + (c0 + CENTER / 2) * module;
  const ccy = origin + (c0 + CENTER / 2) * module;
  drawPt(rgba, width, ccx, ccy, (CENTER * module) / 2);

  const gold = PALETTE[2]!;
  const frame = Math.round(origin) - 3;
  const span = Math.round(n * module) + 6;
  fillRect(rgba, width, frame, frame, span, 2, gold);
  fillRect(rgba, width, frame, frame + span - 2, span, 2, gold);
  fillRect(rgba, width, frame, frame, 2, span, gold);
  fillRect(rgba, width, frame + span - 2, frame, 2, span, gold);

  return { rgba, width, height: width, module };
}
