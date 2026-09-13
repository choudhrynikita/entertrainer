let ctx: AudioContext | null = null;
let source: AudioBufferSourceNode | null = null;
let playing = false;

export function getAudioContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export async function unlockAudio(): Promise<AudioContext> {
  const audioCtx = getAudioContext();
  if (audioCtx.state === "suspended") await audioCtx.resume();
  return audioCtx;
}

export function pcmToAudioBuffer(
  audioCtx: AudioContext,
  pcm: Int16Array,
  sampleRate: number,
  channels = 1,
): AudioBuffer {
  const frames = Math.max(1, Math.floor(pcm.length / channels));
  const buf = audioCtx.createBuffer(channels, frames, sampleRate);
  let peak = 1e-6;
  for (let i = 0; i < pcm.length; i++) peak = Math.max(peak, Math.abs(pcm[i]!));
  const g = Math.min(3.2, 0.92 / (peak / 32768));
  for (let c = 0; c < channels; c++) {
    const data = buf.getChannelData(c);
    for (let i = 0; i < frames; i++) data[i] = ((pcm[i * channels + c] ?? 0) / 32768) * g;
  }
  return buf;
}

export async function playPcm(pcm: Int16Array, sampleRate: number, onEnded?: () => void): Promise<void> {
  stopPlayback();
  if (!pcm.length) {
    onEnded?.();
    return;
  }
  const audioCtx = await unlockAudio();
  const buf = pcmToAudioBuffer(audioCtx, pcm, sampleRate, 1);
  const node = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  gain.gain.value = 1;
  node.buffer = buf;
  node.connect(gain);
  gain.connect(audioCtx.destination);
  node.onended = () => {
    playing = false;
    source = null;
    onEnded?.();
  };
  source = node;
  playing = true;
  node.start();
}

export function stopPlayback(): void {
  if (source) {
    try {
      source.stop();
    } catch {
      /* already stopped */
    }
    try {
      source.disconnect();
    } catch {
      /* already down */
    }
    source = null;
  }
  playing = false;
}

export function isPlaying(): boolean {
  return playing;
}

export function downloadBytes(bytes: Uint8Array, filename: string, mime: string): void {
  const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([copy], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
