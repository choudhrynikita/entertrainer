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
  Put the override in useHead (cleared on leave) + a JS safety net —
  NEVER in an unscoped <style> block: Vite keeps page CSS chunks linked
  after client navigations, which would leave Engage at 16× scale.
*/
useHead({
  htmlAttrs: {
    style: 'background:#0B0C10;height:100%;font-size:16px',
  },
  bodyAttrs: {
    style: 'background:#0B0C10;margin:0;height:100%;overscroll-behavior:none',
  },
  meta: [{ name: 'theme-color', content: '#0B0C10' }],
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

onMounted(async () => {
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
  min-height: 100dvh;
  height: 100%;
  width: 100%;
  background: #0b0c10;
}
</style>
