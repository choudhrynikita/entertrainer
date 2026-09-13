import { crc32 } from "./crc32";
import { RS_K, RS_N, deinterleave, interleave, rsDecodeBlock, rsEncodeBlock } from "./rs";

export function protect(bytes: Uint8Array): Uint8Array {
  const inner = new Uint8Array(8 + bytes.length);
  const view = new DataView(inner.buffer);
  view.setUint32(0, bytes.length, true);
  view.setUint32(4, crc32(bytes), true);
  inner.set(bytes, 8);
  const nBlocks = Math.max(1, Math.ceil(inner.length / RS_K));
  const padded = new Uint8Array(nBlocks * RS_K);
  padded.set(inner);
  const blocks: Uint8Array[] = [];
  for (let i = 0; i < nBlocks; i++) {
    blocks.push(rsEncodeBlock(padded.subarray(i * RS_K, (i + 1) * RS_K)));
  }
  return interleave(blocks);
}

function recoverExact(bytes: Uint8Array, nBlocks: number): Uint8Array | null {
  if (nBlocks < 1 || bytes.length < nBlocks * RS_N) return null;
  const blocks = deinterleave(bytes.subarray(0, nBlocks * RS_N), nBlocks);
  const inner = new Uint8Array(nBlocks * RS_K);
  for (let i = 0; i < nBlocks; i++) {
    const data = rsDecodeBlock(blocks[i]!);
    if (!data) return null;
    inner.set(data, i * RS_K);
  }
  const view = new DataView(inner.buffer);
  const L = view.getUint32(0, true);
  if (L <= 0 || L > inner.length - 8) return null;
  const payload = inner.subarray(8, 8 + L);
  if (crc32(payload) !== view.getUint32(4, true)) return null;
  return payload.slice();
}

export function recover(bytes: Uint8Array): Uint8Array | null {
  const maxN = Math.floor(bytes.length / RS_N);
  for (let nBlocks = maxN; nBlocks >= 1; nBlocks--) {
    const got = recoverExact(bytes, nBlocks);
    if (got) return got;
  }
  return null;
}
