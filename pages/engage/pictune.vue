<script setup lang="ts">
import { TARGET_RATE, type PicTuneHeader } from '~/utils/pictune/protocol'
import { makePicTune, openPicTuneFile, pngBlobUrl } from '~/utils/pictune/client'
import { decodeAudioFile, prepareVoice, synthJingle } from '~/utils/pictune/audio'
import { downloadBytes, getAudioContext, playPcm, stopPlayback, unlockAudio } from '~/utils/pictune/playback'
import { startVoiceCapture, type VoiceCapture } from '~/utils/pictune/record'
import { holdableSeconds } from '~/utils/pictune/codec'
import { useThemeStore } from '~/stores/theme'

definePageMeta({ ssr: false })

useSeoMeta({
  title: 'pictune · Engage',
  description: 'A pictune is a picture you can hear. Print it, screenshot it, send it.',
  ogUrl: 'https://entertrainer.in/engage/pictune',
})

type Tab = 'make' | 'play'
type VoiceTake = { pcm: Int16Array; sampleRate: number; durationMs: number }
type Glyph = {
  png: Uint8Array
  url: string
  width: number
  height: number
  header: PicTuneHeader
  pcm: Int16Array
  sampleRate: number
}

const theme = useThemeStore()
const tab = ref<Tab>('make')
const voice = shallowRef<VoiceTake | null>(null)
const glyph = shallowRef<Glyph | null>(null)
const opened = shallowRef<(Glyph & { crcOk: boolean }) | null>(null)
const busy = ref<string | null>(null)
const error = ref<string | null>(null)
const recState = ref<'idle' | 'recording' | 'denied'>('idle')
const recMs = ref(0)
const recLevel = ref(0)
const playing = ref(false)
const stopping = ref(false)

const capture = shallowRef<VoiceCapture | null>(null)
const audioInput = ref<HTMLInputElement | null>(null)
const playInput = ref<HTMLInputElement | null>(null)
const maxMs = holdableSeconds() * 1000
const makeReady = computed(() => Boolean(voice.value && !glyph.value && recState.value !== 'recording'))

function clock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

function setVoiceFromPcm(pcm: Float32Array, sampleRate: number, channels: number) {
  const prep = prepareVoice(pcm, sampleRate, channels, holdableSeconds())
  voice.value = { pcm: prep.pcm, sampleRate: prep.sampleRate, durationMs: prep.durationMs }
  if (glyph.value?.url.startsWith('blob:')) URL.revokeObjectURL(glyph.value.url)
  glyph.value = null
}

async function onAudio(file: File) {
  error.value = null
  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const decoded = await decodeAudioFile(bytes, file.name, (buf) => getAudioContext().decodeAudioData(buf))
    if (decoded.pcm.length < decoded.sampleRate * 0.3) {
      error.value = 'that clip is too short.'
      return
    }
    setVoiceFromPcm(decoded.pcm, decoded.sampleRate, decoded.channels)
  } catch (err) {
    error.value = err instanceof Error ? err.message : "couldn't read that clip."
  }
}

async function finishCapture(cap: VoiceCapture) {
  if (stopping.value) return
  stopping.value = true
  recState.value = 'idle'
  capture.value = null
  try {
    const result = await cap.stop()
    if (result.pcm.length < result.sampleRate * 0.3) {
      error.value = 'that was too short.'
      return
    }
    setVoiceFromPcm(result.pcm, result.sampleRate, 1)
  } catch (err) {
    error.value = err instanceof Error ? err.message : "couldn't save that take."
  } finally {
    stopping.value = false
  }
}

async function toggleRecord() {
  error.value = null
  await unlockAudio()
  if (recState.value === 'recording') {
    const cap = capture.value
    if (cap) await finishCapture(cap)
    return
  }
  try {
    const cap = await startVoiceCapture({
      onLevel: (v) => { recLevel.value = v },
      onTick: (ms) => {
        recMs.value = ms
        if (ms >= maxMs && capture.value) void finishCapture(capture.value)
      },
    })
    capture.value = cap
    recMs.value = 0
    voice.value = null
    if (glyph.value?.url.startsWith('blob:')) URL.revokeObjectURL(glyph.value.url)
    glyph.value = null
    recState.value = 'recording'
  } catch {
    recState.value = 'denied'
    error.value = 'mic is blocked. use a clip instead.'
  }
}

async function makeGlyph(take: VoiceTake) {
  busy.value = 'making…'
  error.value = null
  try {
    const out = await makePicTune({ pcm: take.pcm, sampleRate: take.sampleRate })
    if (glyph.value?.url.startsWith('blob:')) URL.revokeObjectURL(glyph.value.url)
    glyph.value = {
      png: out.png,
      url: pngBlobUrl(out.png),
      width: out.width,
      height: out.height,
      header: out.header,
      pcm: take.pcm,
      sampleRate: take.sampleRate,
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "couldn't make that pictune."
  } finally {
    busy.value = null
  }
}

async function trySample() {
  busy.value = 'making a sample…'
  error.value = null
  try {
    const pcm = synthJingle(4)
    const take: VoiceTake = {
      pcm,
      sampleRate: TARGET_RATE,
      durationMs: Math.round((pcm.length / TARGET_RATE) * 1000),
    }
    voice.value = take
    const out = await makePicTune({ pcm, sampleRate: TARGET_RATE })
    if (glyph.value?.url.startsWith('blob:')) URL.revokeObjectURL(glyph.value.url)
    glyph.value = {
      png: out.png,
      url: pngBlobUrl(out.png),
      width: out.width,
      height: out.height,
      header: out.header,
      pcm,
      sampleRate: TARGET_RATE,
    }
    tab.value = 'make'
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'sample failed.'
  } finally {
    busy.value = null
  }
}

async function onPlayFile(file: File) {
  error.value = null
  busy.value = 'opening…'
  try {
    const dec = await openPicTuneFile(file)
    if (opened.value?.url.startsWith('blob:')) URL.revokeObjectURL(opened.value.url)
    opened.value = {
      png: new Uint8Array(await file.arrayBuffer()),
      url: dec.url,
      width: dec.width,
      height: dec.height,
      header: dec.header,
      pcm: dec.pcm,
      sampleRate: TARGET_RATE,
      crcOk: dec.crcOk,
    }
    tab.value = 'play'
  } catch (err) {
    error.value = err instanceof Error ? err.message : "this isn't a pictune."
  } finally {
    busy.value = null
  }
}

async function togglePlay(take: VoiceTake | Glyph) {
  if (playing.value) {
    stopPlayback()
    playing.value = false
    return
  }
  playing.value = true
  await playPcm(take.pcm, take.sampleRate, () => { playing.value = false })
}

function switchTab(next: Tab) {
  tab.value = next
  error.value = null
  stopPlayback()
  playing.value = false
}

onBeforeUnmount(() => {
  stopPlayback()
  void capture.value?.stop()
  for (const url of [glyph.value?.url, opened.value?.url]) {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
  }
})
</script>

<template>
  <div class="pt">
    <div class="pt__phone">
      <header class="pt__head">
        <NuxtLink to="/engage" class="pt__brand" aria-label="pictune, back to Engage">
          <span class="pt__mark" aria-hidden="true">
            <EdPictuneMark />
          </span>
          <span>pictune</span>
        </NuxtLink>
        <button
          type="button"
          class="pt__theme"
          :aria-label="`Switch to ${theme.theme === 'dark' ? 'light' : 'dark'} mode`"
          @click="theme.toggle()"
        >
          <svg v-if="theme.theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8" />
            <path d="M12 3v1.5M12 19.5V21M4.6 4.6l1.1 1.1M18.3 18.3l1.1 1.1M3 12h1.5M19.5 12H21M4.6 19.4l1.1-1.1M18.3 5.7l1.1-1.1" fill="none" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17 13.5A6.5 6.5 0 1 1 10.5 7 5 5 0 0 0 17 13.5Z" fill="none" stroke="currentColor" stroke-width="1.8" />
          </svg>
        </button>
      </header>

      <input
        ref="audioInput"
        type="file"
        accept="audio/*,.wav,.mp3,.m4a,.ogg,.webm"
        class="pt__file"
        @change="(e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) void onAudio(f); (e.target as HTMLInputElement).value = '' }"
      >
      <input
        ref="playInput"
        type="file"
        accept="image/*"
        class="pt__file"
        @change="(e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) void onPlayFile(f); (e.target as HTMLInputElement).value = '' }"
      >

      <main class="pt__main">
        <template v-if="tab === 'make'">
          <button
            type="button"
            class="pt__well"
            :class="{ 'pt__well--tap': recState === 'denied' && !glyph }"
            @click="glyph ? togglePlay(glyph) : recState === 'denied' && !glyph ? audioInput?.click() : undefined"
          >
            <img v-if="glyph" :src="glyph.url" alt="">
            <span v-else>your pictune</span>
          </button>

          <p v-if="recState === 'recording'" class="pt__clock">{{ clock(recMs) }}</p>
          <p v-else-if="voice && !glyph" class="pt__ready">{{ clock(voice.durationMs) }}</p>

          <template v-if="glyph">
            <button
              type="button"
              class="pt__play"
              :aria-label="playing ? 'pause' : 'play'"
              @click="void togglePlay(glyph)"
            >
              <svg v-if="playing" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6" y="5" width="4.5" height="14" rx="1.2" fill="currentColor" />
                <rect x="13.5" y="5" width="4.5" height="14" rx="1.2" fill="currentColor" />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5L8 5.5Z" fill="currentColor" />
              </svg>
            </button>
            <button type="button" class="pt__cta" @click="downloadBytes(glyph.png, 'pictune.png', 'image/png')">
              save pictune
            </button>
            <p class="pt__hint">print it, screenshot it, send it</p>
          </template>
          <template v-else-if="makeReady">
            <button type="button" class="pt__cta" :disabled="Boolean(busy)" @click="void makeGlyph(voice!)">
              {{ busy ?? 'make pictune' }}
            </button>
            <button type="button" class="pt__ghost" @click="void toggleRecord()">record again</button>
            <button type="button" class="pt__ghost" @click="audioInput?.click()">or use a clip</button>
          </template>
          <template v-else>
            <button
              type="button"
              class="pt__rec"
              :aria-label="recState === 'recording' ? 'stop' : 'record'"
              @click="void toggleRecord()"
            >
              <span
                class="pt__orb"
                :class="{ 'pt__orb--live': recState === 'recording' }"
                :style="recState === 'recording' ? { transform: `scale(${1 + recLevel * 0.1})` } : undefined"
              >
                <span class="pt__orb-core" :class="{ 'pt__orb-core--stop': recState === 'recording' }" />
              </span>
              <span class="pt__rec-label">{{ recState === 'recording' ? 'stop' : 'record' }}</span>
            </button>
            <p v-if="recState !== 'recording'" class="pt__hint">up to {{ Math.round(holdableSeconds()) }} seconds</p>
            <button v-if="recState !== 'recording'" type="button" class="pt__ghost" @click="audioInput?.click()">or use a clip</button>
            <button v-if="recState !== 'recording'" type="button" class="pt__ghost" @click="void trySample()">{{ busy ?? 'or try a sample' }}</button>
          </template>
        </template>

        <template v-else>
          <button type="button" class="pt__well" @click="opened ? togglePlay(opened) : playInput?.click()">
            <img v-if="opened" :src="opened.url" alt="">
            <span v-else>{{ busy ?? 'open a pictune' }}</span>
          </button>
          <template v-if="opened">
            <button
              type="button"
              class="pt__play"
              :aria-label="playing ? 'pause' : 'play'"
              @click="void togglePlay(opened)"
            >
              <svg v-if="playing" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6" y="5" width="4.5" height="14" rx="1.2" fill="currentColor" />
                <rect x="13.5" y="5" width="4.5" height="14" rx="1.2" fill="currentColor" />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5L8 5.5Z" fill="currentColor" />
              </svg>
            </button>
            <p class="pt__meta">{{ clock(opened.header.durationMs) }}</p>
          </template>
        </template>

        <p v-if="error" class="pt__error">{{ error }}</p>
      </main>

      <nav class="pt__tabs">
        <button type="button" class="pt__tab" :class="{ 'pt__tab--on': tab === 'make' }" @click="switchTab('make')">
          <span class="pt__dot" />
          make
        </button>
        <button type="button" class="pt__tab" :class="{ 'pt__tab--on': tab === 'play' }" @click="switchTab('play')">
          <span class="pt__dot" />
          play
        </button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.pt {
  --pt-paper: var(--paper);
  --pt-ink: var(--ink);
  --pt-accent: var(--accent);
  --pt-accent-fg: var(--accent-ink);
  --pt-surface: var(--paper-2);
  --pt-muted: var(--muted);
  --pt-line: var(--line);
  position: fixed;
  inset: 0;
  z-index: 40;
  background: var(--pt-paper);
  color: var(--pt-ink);
  font-family: var(--font-ui);
  font-weight: 500;
  display: flex;
  justify-content: center;
}
.pt__phone {
  width: 100%;
  max-width: 390px;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: max(12px, env(safe-area-inset-top)) 24px env(safe-area-inset-bottom);
  box-sizing: border-box;
}
.pt__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.pt__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--pt-ink);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: lowercase;
}
.pt__mark {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: var(--pt-accent);
  color: var(--pt-accent-fg);
}
.pt__mark :deep(svg) { width: 20px; height: 20px; display: block; }
.pt__theme {
  width: 44px;
  height: 44px;
  border: 0;
  background: none;
  color: var(--pt-muted);
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
}
.pt__theme svg { width: 20px; height: 20px; }
.pt__theme:hover { color: var(--pt-ink); }
.pt__file {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
.pt__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 0;
  padding: 8px 0;
}
.pt__well {
  width: 100%;
  height: min(400px, 48dvh);
  overflow: hidden;
  border-radius: 22px;
  background: var(--pt-surface);
  color: var(--pt-muted);
  font-size: 14px;
  border: 0;
  padding: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.pt__well--tap { cursor: pointer; }
.pt__well img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
  box-sizing: border-box;
  display: block;
}
.pt__clock {
  margin: 0;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
.pt__ready {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.pt__meta, .pt__hint {
  margin: 0;
  font-size: 13px;
  color: var(--pt-muted);
  font-variant-numeric: tabular-nums;
  text-align: center;
}
.pt__hint { font-size: 12px; }
.pt__cta {
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: 999px;
  background: var(--pt-accent);
  color: var(--pt-accent-fg);
  font: 500 16px/1 var(--font-ui);
  cursor: pointer;
}
.pt__cta:disabled { opacity: 0.4; }
.pt__ghost {
  border: 0;
  background: none;
  color: var(--pt-muted);
  font: 500 14px/1 var(--font-ui);
  cursor: pointer;
  padding: 8px;
  min-height: 44px;
}
.pt__ghost:hover { color: var(--pt-ink); }
.pt__rec {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
}
.pt__orb {
  width: 84px;
  height: 84px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 2px var(--pt-ink);
  display: grid;
  place-items: center;
}
.pt__orb--live {
  box-shadow: inset 0 0 0 2px var(--pt-accent);
  animation: pt-pulse 1.1s ease-in-out infinite;
}
.pt__orb-core {
  width: 62px;
  height: 62px;
  border-radius: 999px;
  background: var(--pt-accent);
  transition: border-radius 150ms, width 150ms, height 150ms;
}
.pt__orb-core--stop {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}
.pt__rec-label {
  font-size: 14px;
  color: var(--pt-muted);
}
.pt__play {
  width: 72px;
  height: 72px;
  border: 1px solid var(--pt-line);
  border-radius: 999px;
  background: var(--pt-surface);
  color: var(--pt-ink);
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
}
.pt__play svg { width: 24px; height: 24px; }
.pt__error {
  margin: 0;
  text-align: center;
  font-size: 13px;
  color: var(--danger);
}
.pt__tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 84px;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}
.pt__tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 0;
  background: none;
  color: var(--pt-muted);
  font: 500 12px/1 var(--font-ui);
  letter-spacing: 0.04em;
  cursor: pointer;
}
.pt__tab--on { color: var(--pt-accent); }
.pt__dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--pt-muted) 40%, transparent);
}
.pt__tab--on .pt__dot { background: var(--pt-accent); }

@keyframes pt-pulse {
  0%, 100% { box-shadow: inset 0 0 0 2px var(--pt-accent), 0 0 0 0 rgb(255 212 59 / 0.35); }
  50% { box-shadow: inset 0 0 0 2px var(--pt-accent), 0 0 0 12px rgb(255 212 59 / 0); }
}

@media (prefers-reduced-motion: reduce) {
  .pt__orb--live { animation: none; }
  .pt__orb-core { transition: none; }
}
</style>
