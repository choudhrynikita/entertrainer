<script setup lang="ts">
import type { Root } from 'react-dom/client'
import '@astroclock/styles/astroclock.css'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'AstroClock · Engage',
  description: 'Birth place and time. A live dial. What today is doing.',
  ogUrl: 'https://entertrainer.in/engage/astroclock',
})

/*
  Entertrainer's main.css uses `html { font-size: 1px }` (rem == px).
  Tailwind utilities on this island assume a normal 16px rem.
  useHead style for first paint + class-gated CSS + JS important safety net.
  NEVER bare `html { font-size }` in unscoped CSS — Vite keeps chunks linked.
*/
useHead({
  htmlAttrs: {
    style: 'background:#0B0C10;height:100%;font-size:16px',
  },
  bodyAttrs: {
    style: 'background:#0B0C10;margin:0;height:100%;overscroll-behavior:none',
  },
  meta: [
    { name: 'theme-color', content: '#0B0C10' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/astroclock-icon.svg' },
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/astroclock-icon-192.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/astroclock-icon-192.png' },
  ],
})

const host = ref<HTMLElement | null>(null)
let root: Root | null = null
let prevNuxtHeight = ''
let prevNuxtMargin = ''
let prevNuxtBg = ''
/** Prior inline font-size from before AstroClock (not useHead's first-paint 16px). */
let prevHtmlFontSize: string | null = null
let prevHtmlFontSizePriority = ''
let hadAstroclockRem = false

onMounted(async () => {
  const html = document.documentElement
  const existing = html.style.getPropertyValue('font-size')
  const existingPri = html.style.getPropertyPriority('font-size')
  // useHead already sets font-size:16px for first paint — do not treat that as "prior"
  // to restore on leave (would keep Engage at rem=16px).
  if (existing && !(existing === '16px' && existingPri !== 'important')) {
    prevHtmlFontSize = existing
    prevHtmlFontSizePriority = existingPri
  } else {
    prevHtmlFontSize = null
    prevHtmlFontSizePriority = ''
  }
  hadAstroclockRem = html.classList.contains('astroclock-rem')
  html.classList.add('astroclock-rem')
  html.style.setProperty('font-size', '16px', 'important')

  const nuxt = document.getElementById('__nuxt')
  if (nuxt) {
    prevNuxtHeight = nuxt.style.height
    prevNuxtMargin = nuxt.style.margin
    prevNuxtBg = nuxt.style.background
    nuxt.style.height = '100%'
    nuxt.style.margin = '0'
    nuxt.style.background = '#0b0c10'
  }

  if (!host.value) return
  const [{ createRoot }, { createElement }, { AstroClockApp }] = await Promise.all([
    import('react-dom/client'),
    import('react'),
    import('@astroclock/components/AstroClockApp'),
  ])
  root = createRoot(host.value)
  root.render(createElement(AstroClockApp))
})

onUnmounted(() => {
  root?.unmount()
  root = null

  const html = document.documentElement
  if (!hadAstroclockRem) html.classList.remove('astroclock-rem')
  html.style.removeProperty('font-size')
  if (prevHtmlFontSize != null) {
    html.style.setProperty('font-size', prevHtmlFontSize, prevHtmlFontSizePriority || undefined)
  }

  const nuxt = document.getElementById('__nuxt')
  if (nuxt) {
    nuxt.style.height = prevNuxtHeight
    nuxt.style.margin = prevNuxtMargin
    nuxt.style.background = prevNuxtBg
  }
})
</script>

<template>
  <div
    ref="host"
    id="astroclock-host"
    class="astroclock-host"
    aria-live="polite"
  />
</template>

<style scoped>
.astroclock-host {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  height: 100svh;
  margin: 0;
  background: #0b0c10;
  overflow: hidden;
}
</style>
