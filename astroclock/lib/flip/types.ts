export type DialFace =
  | 'sky'
  | 'bauhaus'
  | 'flipping-to-bauhaus'
  | 'flipping-to-sky';

/** Staggered mechanical morph duration (ms). */
export const FLIP_MS = 980;

export function isFlipping(face: DialFace): boolean {
  return face === 'flipping-to-bauhaus' || face === 'flipping-to-sky';
}

/** Geeky HUD visible on sky and while restoring from metal back. */
export function showGeekyHud(face: DialFace): boolean {
  return face === 'sky' || face === 'flipping-to-sky';
}

/** Date + mini day-stats dock on settled reverse / metal clock face. */
export function showReverseDock(face: DialFace): boolean {
  return face === 'bauhaus';
}
