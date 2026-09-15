<script setup lang="ts">
import type { Root } from 'react-dom/client'
import '@astroclock/styles/astroclock.css'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'AstroClock · Engage',
  description: 'Birth place and time. A live dial. What today is doing.',
  ogUrl: 'https://entertrainer.in/engage/astroclock',
})

useHead({
  htmlAttrs: { style: 'background:#0B0C10;height:100%' },
  bodyAttrs: { style: 'background:#0B0C10;margin:0;height:100%;overscroll-behavior:none' },
  meta: [{ name: 'theme-color', content: '#0B0C10' }],
})

const host = ref<HTMLElement | null>(null)
let root: Root | null = null

onMounted(async () => {
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

<style>
html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
  background: #0b0c10;
}
.astroclock-host {
  min-height: 100dvh;
  height: 100%;
  background: #0b0c10;
}
</style>
