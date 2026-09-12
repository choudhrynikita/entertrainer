import { encodePngRgb } from "./png";
import { protect, recover } from "./ecc";
import { dataCapacityBytes, gridForBytes, bytesToSymbols, symbolsToBytes } from "./grid";
import { findFinders, sampleGrid } from "./locate";
import {
  HEADER_BYTES,
  HOLD_SECONDS,
  MAX_GRID,
  PicTuneError,
  packHeader,
  payloadCrc,
  unpackHeader,
  type PicTuneHeader,
} from "./protocol";
import { renderGrid } from "./render";
import { decodeRvq, encodeRvq, rvqDurationMs, BITS_PER_SEC } from "./rvq";

export interface EncodeOutput {
  png: Uint8Array;
  rgba: Uint8ClampedArray;
  width: number;
  height: number;
  header: PicTuneHeader;
  n: number;
}

export interface DecodeOutput {
  pcm: Int16Array;
  header: PicTuneHeader;
  width: number;
  height: number;
  crcOk: boolean;
  rgba: Uint8ClampedArray;
}

export function pngFromRgba(rgba: Uint8ClampedArray | Uint8Array, width: number, height: number): Uint8Array {
  const rgb = new Uint8Array(width * height * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
    rgb[j] = rgba[i]!;
    rgb[j + 1] = rgba[i + 1]!;
    rgb[j + 2] = rgba[i + 2]!;
  }
  return encodePngRgb(width, height, rgb, { Software: "PicTune", "PT-Magic": "PICTUNE4" });
}

export function rgbaFromRgb(rgb: Uint8Array, width: number, height: number): Uint8ClampedArray {
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, j = 0; i < rgb.length; i += 3, j += 4) {
    rgba[j] = rgb[i]!;
    rgba[j + 1] = rgb[i + 1]!;
    rgba[j + 2] = rgb[i + 2]!;
    rgba[j + 3] = 255;
  }
  return rgba;
}

export function holdableSeconds(): number {
  const cap = dataCapacityBytes(MAX_GRID);
  const inner = Math.floor(cap / 2) - 8;
  const payload = Math.max(0, inner - HEADER_BYTES);
  return Math.min(HOLD_SECONDS, payload / (BITS_PER_SEC / 8));
}

export function encodePicTune(input: { pcm: Int16Array; sampleRate: number }): EncodeOutput {
  const rvq = encodeRvq(input.pcm, input.sampleRate);
  const header = packHeader({
    sampleRate: input.sampleRate,
    frameCount: input.pcm.length,
    crc32: payloadCrc(rvq),
    durationMs: rvqDurationMs(rvq),
    payloadBytes: rvq.length,
  });
  const blob = new Uint8Array(HEADER_BYTES + rvq.length);
  blob.set(header, 0);
  blob.set(rvq, HEADER_BYTES);
  const wrapped = protect(blob);
  const n = gridForBytes(wrapped.length);
  if (!n) throw new PicTuneError("that take is too long for a pictune.");
  const symbols = bytesToSymbols(wrapped, n);
  const img = renderGrid(symbols, n);
  return {
    png: pngFromRgba(img.rgba, img.width, img.height),
    rgba: img.rgba,
    width: img.width,
    height: img.height,
    header: unpackHeader(header),
    n,
  };
}

export function decodePicTune(
  rgba: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
): DecodeOutput {
  const copy = rgba instanceof Uint8ClampedArray ? rgba : new Uint8ClampedArray(rgba);
  const finders = findFinders(copy, width, height);
  const { grid, n } = sampleGrid(copy, width, height, finders);
  const raw = symbolsToBytes(grid, n, dataCapacityBytes(n));
  const blob = recover(raw);
  if (!blob) throw new PicTuneError("couldn't hear this pictune. try the original image.");
  const header = unpackHeader(blob);
  const rvq = blob.subarray(HEADER_BYTES, HEADER_BYTES + header.payloadBytes);
  const crcOk = payloadCrc(rvq) === header.crc32;
  const { pcm } = decodeRvq(rvq);
  return { pcm, header, width, height, crcOk, rgba: copy };
}
