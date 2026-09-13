export function bilinearResize(
  src: Uint8ClampedArray,
  sw: number,
  sh: number,
  dw: number,
  dh: number,
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(dw * dh * 4);
  const xRatio = (sw - 1) / Math.max(1, dw - 1);
  const yRatio = (sh - 1) / Math.max(1, dh - 1);
  for (let y = 0; y < dh; y++) {
    const fy = y * yRatio;
    const y0 = Math.floor(fy);
    const y1 = Math.min(sh - 1, y0 + 1);
    const wy = fy - y0;
    for (let x = 0; x < dw; x++) {
      const fx = x * xRatio;
      const x0 = Math.floor(fx);
      const x1 = Math.min(sw - 1, x0 + 1);
      const wx = fx - x0;
      const o = (y * dw + x) * 4;
      for (let c = 0; c < 4; c++) {
        const p00 = src[(y0 * sw + x0) * 4 + c]!;
        const p10 = src[(y0 * sw + x1) * 4 + c]!;
        const p01 = src[(y1 * sw + x0) * 4 + c]!;
        const p11 = src[(y1 * sw + x1) * 4 + c]!;
        const top = p00 * (1 - wx) + p10 * wx;
        const bot = p01 * (1 - wx) + p11 * wx;
        out[o + c] = Math.round(top * (1 - wy) + bot * wy);
      }
    }
  }
  return out;
}

/** WhatsApp-ish: 4:2:0 chroma and coarse luma. */
export function jpegish(rgba: Uint8ClampedArray, w: number, h: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(rgba.length);
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      let ys = 0,
        cbs = 0,
        crs = 0,
        n = 0;
      const pix: number[] = [];
      for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const xx = Math.min(w - 1, x + dx);
          const yy = Math.min(h - 1, y + dy);
          const o = (yy * w + xx) * 4;
          const r = rgba[o]!,
            g = rgba[o + 1]!,
            b = rgba[o + 2]!;
          const Y = 0.299 * r + 0.587 * g + 0.114 * b;
          pix.push(Y, r, g, b, o);
          ys += Y;
          cbs += 0.564 * (b - Y);
          crs += 0.713 * (r - Y);
          n++;
        }
      }
      const cb = cbs / n;
      const cr = crs / n;
      for (let i = 0; i < 4; i++) {
        const Y = Math.round(pix[i * 5]! / 8) * 8;
        const o = pix[i * 5 + 4]!;
        const r = Math.max(0, Math.min(255, Y + 1.403 * cr));
        const g = Math.max(0, Math.min(255, Y - 0.344 * cb - 0.714 * cr));
        const b = Math.max(0, Math.min(255, Y + 1.773 * cb));
        out[o] = r;
        out[o + 1] = g;
        out[o + 2] = b;
        out[o + 3] = 255;
      }
    }
  }
  return out;
}

export function boxBlur(rgba: Uint8ClampedArray, w: number, h: number, radius = 1): Uint8ClampedArray {
  if (radius <= 0) return rgba;
  const out = new Uint8ClampedArray(rgba.length);
  const r = radius;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let R = 0,
        G = 0,
        B = 0,
        n = 0;
      for (let dy = -r; dy <= r; dy++) {
        const yy = Math.max(0, Math.min(h - 1, y + dy));
        for (let dx = -r; dx <= r; dx++) {
          const xx = Math.max(0, Math.min(w - 1, x + dx));
          const o = (yy * w + xx) * 4;
          R += rgba[o]!;
          G += rgba[o + 1]!;
          B += rgba[o + 2]!;
          n++;
        }
      }
      const o = (y * w + x) * 4;
      out[o] = R / n;
      out[o + 1] = G / n;
      out[o + 2] = B / n;
      out[o + 3] = 255;
    }
  }
  return out;
}
