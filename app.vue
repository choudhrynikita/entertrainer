<script setup lang="ts">
// Design reminder — The Learning Atlas course is a self-contained, evidence-led player.
import { useThemeStore } from '~/stores/theme'
import { getSocialImage, getSocialPreview, SITE_URL } from '~/content/social-previews'

/**
 * The publication shell.
 *
 * Masthead at the top, the page in the middle, the footer at the bottom, and
 * an ordinary document scroll through all three. The previous shell was built
 * around a WebGL front page: a preloader gate, a floating hamburger, a section
 * ladder, and every interior route rendered `position: fixed` with its own
 * scroll container. That is the right architecture for a stage and the wrong
 * one for a publication — it meant no page could be longer than the viewport
 * without inventing its own scrolling, and the browser's own scroll
 * restoration, find-in-page and anchor links all had to be worked around.
 *
 * Two kinds of route render without the chrome: the self-contained artifacts
 * (the fifteen lab sketches, the glass lab) and the Strong module, which is a
 * course with its own player bar and its own exit. Wrapping either in a
 * masthead would be putting a magazine spine on a thing that is not a page.
 * The two immersive e-learning routes use the same rule: their compact course
 * bar is the entire learning chrome, so public navigation and footer content
 * must never surround an active course screen.
 */
const r = useRoute()
const theme = useThemeStore()
const siteSettings = useSiteSettings()
const showPreloader = ref(
  !(
    r.path.startsWith('/engage/pictune') ||
    r.path.startsWith('/engage/astroclock') ||
    r.path.startsWith('/engage/read-my-mind')
  )
)

function onPreloaderComplete() {
  showPreloader.value = false
}
const socialPreview = computed(() => getSocialPreview(r.path))
const socialImage = computed(() => getSocialImage(socialPreview.value))

useSeoMeta({
  title: () => socialPreview.value.title,
  description: () => socialPreview.value.description,
  ogType: () => socialPreview.value.type ?? 'website',
  ogTitle: () => socialPreview.value.title,
  ogDescription: () => socialPreview.value.description,
  ogUrl: () => `${SITE_URL}${r.path}`,
  ogImage: () => socialImage.value,
  ogImageAlt: () => socialPreview.value.imageAlt ?? `Entertrainer preview: ${socialPreview.value.title}`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => socialPreview.value.title,
  twitterDescription: () => socialPreview.value.description,
  twitterImage: () => socialImage.value,
  twitterImageAlt: () => socialPreview.value.imageAlt ?? `Entertrainer preview: ${socialPreview.value.title}`
})

useHead({
  link: () => [{ key: 'canonical', rel: 'canonical', href: `${SITE_URL}${r.path}` }]
})

// `/lab` itself is an index page and keeps the chrome; `/lab/g07` is an
// artifact and does not.
const bare = computed(() =>
  r.path.startsWith('/lab/') ||
  r.path.startsWith('/glass-lab') ||
  r.path.startsWith('/my-work/strong') ||
  r.path.startsWith('/my-work/sewa-chronicles') ||
  r.path.startsWith('/courses/ai-atlas') ||
  r.path.startsWith('/instructional-design') ||
  r.path.startsWith('/engage/read-my-mind') ||
  r.path.startsWith('/engage/pictune') ||
  r.path.startsWith('/engage/astroclock')
)

onMounted(() => {
  theme.init()
  siteSettings.hydrate()
})
onBeforeUnmount(() => theme.dispose())
</script>

<template>
  <div id="app-root">
    <EdPreloader v-if="showPreloader" @complete="onPreloaderComplete" />
    <EdDailyWordSplash v-if="!bare" />
    <EdSettingsPanel />
    <div v-show="!showPreloader" :inert="showPreloader ? '' : undefined">
      <template v-if="bare">
        <NuxtPage />
      </template>

      <template v-else>
        <EdMasthead />
        <main id="main" tabindex="-1">
          <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
        </main>
        <EdFooter />
      </template>

      <div class="u-grain" aria-hidden="true" />
    </div>
  </div>
</template>

<style>
#app-root { min-height: 100dvh; background: var(--paper); display: flex; flex-direction: column; }
#main { flex: 1; }

/* One page transition, and it is nearly nothing: a short fade with a few
   pixels of travel. A publication should feel like turning to a page, not like
   operating a machine — and every millisecond spent animating a route change
   is a millisecond the reader is looking at neither page. */
.page-enter-active { transition: opacity var(--dur-mid) var(--ease-out), transform var(--dur-mid) var(--ease-out); }
.page-leave-active { transition: opacity var(--dur-fast) var(--ease-in); }
.page-enter-from { opacity: 0; transform: translateY(8rem); }
.page-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .page-enter-active, .page-leave-active { transition: opacity 120ms linear; }
  .page-enter-from { transform: none; }
}
html[data-reduce-motion="on"] .page-enter-active,
html[data-reduce-motion="on"] .page-leave-active { transition: opacity 120ms linear; }
html[data-reduce-motion="on"] .page-enter-from { transform: none; }
</style>
