import { decodePngRgb, isPng } from "./png";
import {
  decodeFromPayload,
  decodePicTune,
  encodePicTune,
  pngFromRgba,
  rgbaFromRgb,
  type DecodeOutput,
  type EncodeOutput,
} from "./codec";
import { PicTuneError } from "./protocol";

function blobUrl(bytes: Uint8Array, mime: string): string {
  const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return URL.createObjectURL(new Blob([copy], { type: mime }));
}

async function rasterize(file: Blob): Promise<{ rgba: Uint8ClampedArray; width: number; height: number }> {
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    bitmap = await rasterizeViaImage(file);
  }
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    bitmap.close();
    throw new PicTuneError("couldn't open that image.");
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { rgba: data.data, width: canvas.width, height: canvas.height };
}

async function rasterizeViaImage(file: Blob): Promise<ImageBitmap> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new PicTuneError("couldn't open that image."));
      el.src = url;
    });
    return await createImageBitmap(img);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function makePicTune(input: { pcm: Int16Array; sampleRate: number }): Promise<EncodeOutput> {
  return encodePicTune(input);
}

export async function openPicTuneFile(file: File): Promise<DecodeOutput & { url: string }> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = file.type || "image/png";
  const url = blobUrl(bytes, mime);
  const errors: string[] = [];

  if (isPng(bytes)) {
    try {
      const png = decodePngRgb(bytes);
      const rgba = rgbaFromRgb(png.rgb, png.width, png.height);
      if (png.payload && png.payload.length > 8) {
        try {
          const dec = decodeFromPayload(png.payload, rgba, png.width, png.height);
          return { ...dec, url };
        } catch (err) {
          errors.push(err instanceof Error ? err.message : "chunk");
        }
      }
      const dec = decodePicTune(rgba, png.width, png.height);
      return { ...dec, url };
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "png");
    }
  }

  try {
    const raster = await rasterize(file);
    const dec = decodePicTune(raster.rgba, raster.width, raster.height);
    return { ...dec, url };
  } catch (err) {
    errors.push(err instanceof Error ? err.message : "image");
    URL.revokeObjectURL(url);
    throw new PicTuneError(errors[0] || "this isn't a pictune.");
  }
}

export function pngBlobUrl(png: Uint8Array): string {
  return blobUrl(png, "image/png");
}

export { pngFromRgba };
