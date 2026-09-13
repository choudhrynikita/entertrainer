import { zlibSync, unzlibSync } from "fflate";
import { crc32 } from "./crc32";
import { PNG_CHUNK } from "./protocol";

const PNG_SIG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

function be32(n: number): Uint8Array {
  return new Uint8Array([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);
}

function readBe32(b: Uint8Array, o: number): number {
  return ((b[o]! << 24) | (b[o + 1]! << 16) | (b[o + 2]! << 8) | (b[o + 3]!)) >>> 0;
}

function concat(parts: Uint8Array[]): Uint8Array {
  let len = 0;
  for (const p of parts) len += p.length;
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type);
  const crcBuf = new Uint8Array(typeBytes.length + data.length);
  crcBuf.set(typeBytes, 0);
  crcBuf.set(data, typeBytes.length);
  const crc = crc32(crcBuf);
  return concat([be32(data.length), typeBytes, data, be32(crc)]);
}

function latin1(s: string): Uint8Array {
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff;
  return out;
}

function textChunk(key: string, value: string): Uint8Array {
  const k = latin1(key);
  const v = latin1(value);
  const data = new Uint8Array(k.length + 1 + v.length);
  data.set(k, 0);
  data[k.length] = 0;
  data.set(v, k.length + 1);
  return chunk("tEXt", data);
}

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

export interface DecodedPng {
  width: number;
  height: number;
  rgb: Uint8Array;
  text: Record<string, string>;
  payload: Uint8Array | null;
}

export function encodePngRgb(
  width: number,
  height: number,
  rgb: Uint8Array,
  text: Record<string, string> = {},
  payload?: Uint8Array,
): Uint8Array {
  if (rgb.length !== width * height * 3) {
    throw new Error(`RGB length ${rgb.length} != ${width}×${height}×3`);
  }
  const raw = new Uint8Array(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const dst = y * (1 + width * 3);
    raw[dst] = 0;
    raw.set(rgb.subarray(y * width * 3, (y + 1) * width * 3), dst + 1);
  }
  const compressed = zlibSync(raw, { level: 9 });

  const ihdr = new Uint8Array(13);
  ihdr.set(be32(width), 0);
  ihdr.set(be32(height), 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const parts: Uint8Array[] = [PNG_SIG, chunk("IHDR", ihdr)];
  for (const [k, v] of Object.entries(text)) {
    if (!k || k.length > 79) continue;
    parts.push(textChunk(k, v));
  }
  if (payload && payload.length) {
    parts.push(chunk(PNG_CHUNK, zlibSync(payload, { level: 9 })));
  }
  parts.push(chunk("IDAT", compressed));
  parts.push(chunk("IEND", new Uint8Array(0)));
  return concat(parts);
}

export function decodePngRgb(bytes: Uint8Array): DecodedPng {
  for (let i = 0; i < 8; i++) {
    if (bytes[i] !== PNG_SIG[i]) throw new Error("Not a PNG (bad signature)");
  }
  let o = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idats: Uint8Array[] = [];
  const text: Record<string, string> = {};
  let payload: Uint8Array | null = null;

  while (o + 12 <= bytes.length) {
    const len = readBe32(bytes, o);
    const type = String.fromCharCode(bytes[o + 4]!, bytes[o + 5]!, bytes[o + 6]!, bytes[o + 7]!);
    const data = bytes.subarray(o + 8, o + 8 + len);
    if (type === "IHDR") {
      width = readBe32(data, 0);
      height = readBe32(data, 4);
      bitDepth = data[8]!;
      colorType = data[9]!;
    } else if (type === "IDAT") {
      idats.push(data);
    } else if (type === "tEXt") {
      const z = data.indexOf(0);
      if (z > 0) {
        const key = String.fromCharCode(...data.subarray(0, z));
        const val = String.fromCharCode(...data.subarray(z + 1));
        text[key] = val;
      }
    } else if (type === PNG_CHUNK) {
      try {
        payload = unzlibSync(data);
      } catch {
        payload = null;
      }
    } else if (type === "IEND") {
      break;
    }
    o += 12 + len;
  }

  if (!width || !height) throw new Error("PNG missing IHDR");
  if (bitDepth !== 8) throw new Error(`Unsupported PNG bit depth ${bitDepth}`);
  if (colorType !== 2 && colorType !== 6) {
    throw new Error(`Unsupported PNG color type ${colorType} (need RGB)`);
  }

  const inflated = unzlibSync(concat(idats));
  const bpp = colorType === 6 ? 4 : 3;
  const stride = width * bpp;
  const rgb = new Uint8Array(width * height * 3);
  const recon = new Uint8Array(stride);
  const prev = new Uint8Array(stride);
  let src = 0;

  for (let y = 0; y < height; y++) {
    const filter = inflated[src++]!;
    const row = inflated.subarray(src, src + stride);
    src += stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? recon[x - bpp]! : 0;
      const b = prev[x]!;
      const c = x >= bpp ? prev[x - bpp]! : 0;
      let v = row[x]!;
      if (filter === 1) v = (v + a) & 255;
      else if (filter === 2) v = (v + b) & 255;
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (filter === 4) v = (v + paeth(a, b, c)) & 255;
      else if (filter !== 0) throw new Error(`Unknown PNG filter ${filter}`);
      recon[x] = v;
    }
    for (let x = 0; x < width; x++) {
      const di = (y * width + x) * 3;
      const si = x * bpp;
      rgb[di] = recon[si]!;
      rgb[di + 1] = recon[si + 1]!;
      rgb[di + 2] = recon[si + 2]!;
    }
    prev.set(recon);
  }

  return { width, height, rgb, text, payload };
}

export function isPng(bytes: Uint8Array): boolean {
  if (bytes.length < 8) return false;
  for (let i = 0; i < 8; i++) if (bytes[i] !== PNG_SIG[i]) return false;
  return true;
}
