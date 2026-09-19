<script setup lang="ts">
import type { Root } from 'react-dom/client'
definePageMeta({ layout: false })
useSeoMeta({
  title: 'Velocity · Engage',
  description: 'The speeds you already have — Earth spin, solar orbit, galactic ride, CMB frame.',
  ogUrl: 'https://entertrainer.in/engage/velocity',
})
const THEME_BG = { dark: '#0B0C10', light: '#F4F1EA' } as const
function currentTheme(): 'dark' | 'light' {
  if (!import.meta.client) return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}
function themeBg() { return THEME_BG[currentTheme()] }
useHead({
  htmlAttrs: { style: () => `background:${themeBg()};height:100%;font-size:16px` },
  bodyAttrs: { style: () => `background:${themeBg()};margin:0;height:100%;overscroll-behavior:none` },
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/velocity-icon.svg' }],
})
const host = ref<HTMLElement | null>(null)
let root: Root | null = null
onMounted(async () => {
  const html = document.documentElement
  html.classList.add('velocity-rem')
  html.style.setProperty('font-size', '16px', 'important')
  if (!host.value) return
  const [{ createRoot }, { createElement }, { VelocityApp }] = await Promise.all([
    import('react-dom/client'),
    import('react'),
    import('@velocity/VelocityApp'),
  ])
  root = createRoot(host.value)
  root.render(createElement(VelocityApp))
})
onUnmounted(() => {
  root?.unmount()
  document.documentElement.classList.remove('velocity-rem')
})
</script>
<template>
  <div ref="host" id="velocity-host" class="velocity-host" />
</template>
<style scoped>
.velocity-host { position: fixed; inset: 0; width: 100%; height: 100dvh; margin: 0; background: #0b0c10; overflow: hidden; }
:global(html[data-theme='light']) .velocity-host { background: #f4f1ea; }
</style>
