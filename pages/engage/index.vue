<script setup lang="ts">
useSeoMeta({
  title: 'Engage · Entertrainer',
  description: 'Short games and little detours — The Mind Reader and AstroClock.',
  ogUrl: 'https://entertrainer.in/engage',
})

const MIND_READER_SYMBOLS = [
  '<circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="7" r="2.2" fill="currentColor"/>',
  '<path d="m12 2 8 4.7v9.6L12 21l-8-4.7V6.7L12 2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  '<path d="M4 18a11 11 0 0 1 16 0M7 14a7 7 0 0 1 10 0M10 10a3 3 0 0 1 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
  '<path d="m12 2 1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8L12 2Z" fill="currentColor"/>'
]
</script>

<template>
  <div class="engage">
    <EdStageHero
      variant="orbits"
      title="Engage"
      title-id="engage-title"
    />

    <ol class="engage__grid">
      <li class="u-reveal">
        <NuxtLink to="/engage/read-my-mind" class="engage__card engage__card--mind-reader">
          <span class="engage__icon engage__icon--mind-reader" aria-hidden="true">
            <i v-for="(symbol, i) in MIND_READER_SYMBOLS" :key="i"><svg viewBox="0 0 24 24" aria-hidden="true" v-html="symbol"></svg></i>
          </span>
          <span class="engage__card-text">
            <strong class="engage__card-name">The Mind Reader</strong>
            <span class="engage__card-blurb">Pick a number. Two small moves. One mark.</span>
          </span>
          <span class="engage__card-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </span>
        </NuxtLink>
      </li>
      <li class="u-reveal">
        <NuxtLink to="/engage/astroclock" class="engage__card engage__card--astroclock">
          <span class="engage__icon engage__icon--astroclock" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="34" height="34" fill="none" aria-hidden="true">
              <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="1.6" opacity="0.35"/>
              <circle cx="24" cy="24" r="15.5" stroke="currentColor" stroke-width="2.2"/>
              <circle cx="24" cy="24" r="10.5" stroke="#64B5F6" stroke-width="1.3" opacity="0.85"/>
              <g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <line x1="24" y1="5.5" x2="24" y2="9.2"/>
                <line x1="24" y1="38.8" x2="24" y2="42.5"/>
                <line x1="5.5" y1="24" x2="9.2" y2="24"/>
                <line x1="38.8" y1="24" x2="42.5" y2="24"/>
                <line x1="11.2" y1="11.2" x2="13.8" y2="13.8"/>
                <line x1="34.2" y1="34.2" x2="36.8" y2="36.8"/>
                <line x1="36.8" y1="11.2" x2="34.2" y2="13.8"/>
                <line x1="13.8" y1="34.2" x2="11.2" y2="36.8"/>
              </g>
              <g fill="#64B5F6" opacity="0.9">
                <circle cx="24" cy="13.5" r="1.1"/>
                <circle cx="31.5" cy="16.8" r="0.95"/>
                <circle cx="34.5" cy="24" r="1.1"/>
                <circle cx="31.5" cy="31.2" r="0.95"/>
                <circle cx="24" cy="34.5" r="1.1"/>
                <circle cx="16.5" cy="31.2" r="0.95"/>
                <circle cx="13.5" cy="24" r="1.1"/>
                <circle cx="16.5" cy="16.8" r="0.95"/>
              </g>
              <line x1="24" y1="24" x2="24" y2="12.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
              <circle cx="24" cy="12.5" r="1.8" fill="#64B5F6"/>
              <circle cx="24" cy="24" r="3.2" fill="currentColor"/>
              <circle cx="24" cy="24" r="1.35" fill="var(--accent)"/>
            </svg>
          </span>
          <span class="engage__card-text">
            <strong class="engage__card-name">AstroClock</strong>
            <span class="engage__card-blurb">Birth place and time. A live dial. What today is doing.</span>
          </span>
          <span class="engage__card-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </span>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.engage {
  min-height: calc(100dvh - 74rem);
  max-width: var(--shell-wide);
  margin: 0 auto;
  padding: clamp(24rem, 4vw, 56rem) var(--shell-gutter);
}

.engage__grid {
  list-style: none;
  margin: clamp(20rem, 3vw, 32rem) 0 0;
  padding: 0;
  display: grid;
  gap: 10rem;
}

.engage__card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) 20rem;
  align-items: center;
  gap: clamp(16rem, 2.5vw, 24rem);
  padding: 20rem 22rem;
  border: var(--stroke) solid var(--line);
  border-radius: var(--radius-m);
  background: var(--paper);
  transition: background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
}

@media (hover: hover) {
  .engage__card:hover { background: var(--paper-2); border-color: var(--ink); transform: translateX(3rem); }
  .engage__card:hover .engage__card-arrow { transform: translate(2rem, -2rem); }
}

.engage__card:focus-visible {
  outline: 3rem solid var(--focus);
  outline-offset: 3rem;
}

.engage__icon {
  position: relative;
  flex-shrink: 0;
  width: 52rem;
  height: 52rem;
  padding: 9rem;
  box-sizing: border-box;
  border-radius: var(--radius-s);
  background: var(--accent);
  color: var(--accent-ink);
  border: var(--stroke) solid var(--ink);
}

.engage__icon--mind-reader {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  padding: 7rem;
  color: var(--accent-ink);
  background: var(--accent);
}

.engage__icon--mind-reader i { display: grid; place-items: center; color: var(--accent-ink); }
.engage__icon--mind-reader i:nth-child(2n) { color: var(--accent-ink); }
.engage__icon--mind-reader i:nth-child(3n) { color: var(--accent-ink); }
.engage__icon--mind-reader svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.engage__icon--astroclock {
  display: grid;
  place-items: center;
  padding: 7rem;
  color: var(--accent-ink);
  background: var(--accent);
}
.engage__icon--astroclock svg {
  display: block;
  width: 100%;
  height: 100%;
}

.engage__card-text {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4rem 12rem;
  min-width: 0;
}

.engage__card-name { font: 600 19rem/1.2 var(--font-display); flex-shrink: 0; }
.engage__card-blurb { flex: 1 1 260rem; min-width: 0; font-size: 14rem; line-height: 1.4; color: var(--muted); }
.engage__card-arrow { color: var(--muted); transition: transform var(--dur-fast) var(--ease-out); }

@media (max-width: 640px) {
  .engage__card { align-items: start; gap: 14rem; }
  .engage__card-arrow { align-self: center; }
}

@media (prefers-reduced-motion: reduce) {
  .engage__card, .engage__card-arrow { transition: none; }
  .engage__card:hover { transform: none; }
}
</style>
