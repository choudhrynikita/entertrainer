export type DialFace =
  | 'sky'
  | 'bauhaus'
  | 'flipping-to-bauhaus'
  | 'flipping-to-sky';

/** Clean card flip duration (ms). Calm ~0.85s. */
export const FLIP_MS = 850;

export function isFlipping(face: DialFace): boolean {
  return face === 'flipping-to-bauhaus' || face === 'flipping-to-sky';
}

export function showGeekyHud(face: DialFace): boolean {
  return face === 'sky' || face === 'flipping-to-sky';
}
