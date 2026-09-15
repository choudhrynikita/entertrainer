export type DialFace =
  | 'sky'
  | 'bauhaus'
  | 'flipping-to-bauhaus'
  | 'flipping-to-sky';

export type FlipDirection = 'to-bauhaus' | 'to-sky';

/** Total choreography length (ms). Cap ~1.2–1.8s. */
export const FLIP_TOTAL_MS = 1500;
export const FLIP_REDUCED_MS = 280;
export const FLIP_STAGGER_MS = 58;
