import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// AstroClock is a React island under /engage/astroclock.
// Do NOT use @vitejs/plugin-react here: Nuxt 3.17 pins Vite 6, but
// plugin-react@5 resolves top-level Vite 8 / Rolldown and injects
// builtin:vite-react-refresh-wrapper, which crashes DEV with
// "Missing field moduleType" (File: [object Object]).
// Compile .tsx via Vite's esbuild JSX transform instead; HMR refresh
// for the island is unnecessary (full remount on edit is fine).
function astroclockReactJsx() {
  return {
    name: 'astroclock-react-jsx',
    // After @vitejs/plugin-vue-jsx (Nuxt unshifts it), restore esbuild
    // coverage for the React island. vue-jsx sets `esbuild.include` to
    // /\.ts$/ only, which would otherwise leave .tsx untransformed once
    // we exclude astroclock/ from the Vue JSX plugin.
    config() {
      return {
        esbuild: {
          jsx: 'automatic',
          jsxImportSource: 'react',
          include: /\.ts$|(?:^|[\\/])astroclock[\\/].*\.[jt]sx$/,
        },
        optimizeDeps: {
          esbuildOptions: {
            jsx: 'automatic',
            jsxImportSource: 'react',
          },
        },
      }
    },
  }
}

export default defineNuxtConfig({
  devtools: { enabled: false },
  // @vueuse/motion is gone with the reveal composable it powered: every
  // entrance on the site is now CSS (see .u-reveal / .t-fade-up in main.css),
  // which cannot leave content invisible when JavaScript is slow or an
  // observer never fires.
  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],
  // Faces first, then the system that uses them.
  css: ['~/assets/css/fonts.css', '~/assets/css/main.css'],
  runtimeConfig: {
    // Server-only — set via GIPHY_API_KEY env var (Vercel project settings).
    // When absent, /api/giphy serves a curated fallback manifest.
    giphyApiKey: process.env.GIPHY_API_KEY || '',
    // Server-only — set via MAILERLITE_API_KEY env var (Vercel project settings).
    // When absent, /api/newsletter-subscribe reports itself unconfigured so
    // the widget can fall back to the mailto flow instead of breaking.
    mailerliteApiKey: process.env.MAILERLITE_API_KEY || '',
    // Server-only — GROQ_API_KEY / GEMINI_API_KEY (+ optional model overrides).
    // Powers /api/compose/generate. Defaults: groq/compound, gemini-3.5-flash-lite.
    // Never expose to client.
    groqApiKey: process.env.GROQ_API_KEY || '',
    groqModel: process.env.GROQ_MODEL || 'groq/compound',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    // Server-only — Gemini image model for /compose imageSource=gemini.
    geminiImageModel: process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image',
    // Server-only — Gamma standalone image API (X-API-KEY). Never expose to client.
    gammaApiKey: process.env.GAMMA_API_KEY || '',
    // Server-only — persist /compose publishes via GitHub Contents API so Vercel
    // redeploys with content/composed-posts.json. Prefer COMPOSE_GITHUB_TOKEN;
    // fall back to GITHUB_TOKEN. Never expose to the client.
    composeGithubToken: process.env.COMPOSE_GITHUB_TOKEN || '',
    githubToken: process.env.GITHUB_TOKEN || '',
    composeGithubRepo: process.env.COMPOSE_GITHUB_REPO || 'the-entertrainer/entertrainer',
    composeGithubBranch: process.env.COMPOSE_GITHUB_BRANCH || 'main',
    // Optional stronger compose API gate (defaults to client gate keyword if unset)
    composeApiSecret: process.env.COMPOSE_API_SECRET || ''
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Entertrainer',
      script: [
        {
          // Stamp theme before first paint: session override, else OS.
          // Never localStorage — reopen always follows prefers-color-scheme.
          // stores/theme.ts owns it from mount onwards.
          innerHTML: `(function(){try{if(sessionStorage.getItem('et-preloader-done')==='1')document.documentElement.dataset.preloader='done'}catch(e){}try{var s=sessionStorage.getItem('et-theme-session');if(s==='dark'||s==='light'){document.documentElement.dataset.theme=s;return}}catch(e){}try{localStorage.removeItem('et-theme')}catch(e){}document.documentElement.dataset.theme=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';})();`
        }
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Naveen Jose makes lessons, useful little tools, and clearer ways into complicated things.' },
        { name: 'theme-color', content: '#0B0B0C', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#FFFFFF', media: '(prefers-color-scheme: light)' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Entertrainer' },
        { name: 'msapplication-TileColor', content: '#161618' },
		{ name: 'msapplication-TileImage', content: '/mstile-150x150.png' },
        // Site identity only. Route-specific previews are declared by each
        // page through useSeoMeta so pasted links never inherit the home card.
        { property: 'og:site_name', content: 'Entertrainer' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
		{ rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#FFD43B' },
        // Two preloads. Archivo sets every interface string and Fraunces
        // sets the headline, so those two are on the critical path for the
        // first screen; the reading serif, the mono and every latin-ext cut
        // are requested by the CSS when something actually needs them.
        { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous',
          href: '/fonts/webfonts/archivo-var-latin.woff2' },
        { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: 'anonymous',
          href: '/fonts/webfonts/fraunces-var-latin.woff2' },
        // Four faces, four jobs, all SIL OFL and all self-hosted. They are
        // the closest open equivalents to the reference publication's
        // commercial stack — see the substitution table in
        // assets/css/fonts.css:
        //
        //   Fraunces       display — masthead, headlines, card titles
        //   Archivo        interface — navigation, buttons, labels, tool UI
        //   Source Serif 4 reading — decks, body copy, anything with a measure
        //   IBM Plex Mono  metadata — categories, counts, stamps, indices
      ]
    },
    pageTransition: false,
    layoutTransition: false
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Entertrainer',
      short_name: 'Entertrainer',
      description: 'Lessons, useful little tools, and clear explanations by Naveen Jose.',
      theme_color: '#FFFFFF',
      background_color: '#FFFFFF',
      display: 'standalone',
      orientation: 'any',
      scope: '/',
      start_url: '/',
		icons: [
		  { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
		  { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
		  { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
		],
      shortcuts: [
        {
          name: 'StoryGen — Storyboard Studio',
          short_name: 'StoryGen',
          description: 'Design instructional storyboards on an infinite canvas',
          url: '/tools/storygen',
          icons: [{ src: '/storygen-icon-192.png', sizes: '192x192', type: 'image/png' }]
        },
        {
          name: 'Cadence — Training Calendar',
          short_name: 'Cadence',
          description: 'Turn a list of topics into a ready-to-present monthly training calendar',
          url: '/tools/cadence',
          icons: [{ src: '/cadence-icon-192.png', sizes: '192x192', type: 'image/png' }]
        },
        {
          name: 'EasyMCQ — Distractor Generator',
          short_name: 'EasyMCQ',
          description: 'Turn correct answers into brilliant, plausible wrong options',
          url: '/tools/easymcq',
          icons: [{ src: '/easymcq-icon-192.png', sizes: '192x192', type: 'image/png' }]
        },
        {
          name: 'Draftly — Email Polisher',
          short_name: 'Draftly',
          description: 'Turn messy drafts into clear, professional emails',
          url: '/tools/better-emails',
          icons: [{ src: '/draftly-icon-192.png', sizes: '192x192', type: 'image/png' }]
        }
        ,
        {
          name: 'Dialogue — Comics from your pocket',
          short_name: 'Dialogue',
          description: 'Vertical webcomic studio for phones',
          url: '/dialogue/',
          icons: [{ src: '/dialogue/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
        },
        {
          name: 'AstroClock — Sidereal Dial',
          short_name: 'AstroClock',
          description: 'Birth place and time. A live dial. What today is doing.',
          url: '/engage/astroclock',
          icons: [{ src: '/astroclock-icon-192.png', sizes: '192x192', type: 'image/png' }]
        }
      ]
    },
    workbox: {
      // A new deploy's service worker must take over immediately — without
      // this, an open tab (or an installed PWA) can keep serving every JS
      // chunk from the PREVIOUS deploy indefinitely, since the browser only
      // swaps controllers once all old-SW-controlled tabs close naturally.
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/api\//],
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      runtimeCaching: [
        {
          urlPattern: /^\/api\/.*/,
          handler: 'NetworkOnly',
        },
        // The publication's own faces are precached by globPatterns above —
        // they are first-party files now. What is left on a CDN is the Strong
        // module's Inter, which is the only remote font request on the site.
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: { cacheName: 'remote-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
        }
      ]
    },
    client: { installPrompt: false },
    devOptions: { enabled: false }
  },
  // Social crawlers read the server response and do not wait for the client
  // bundle. Route rendering makes each page's useSeoMeta values visible in the
  // first response, so pasted links describe the page being shared.
  ssr: true,
  routeRules: {
    '/tools/training-cal-gen': { redirect: { to: '/tools/cadence', statusCode: 301 } },
    '/tools/storyforge-id': { redirect: { to: '/tools/storygen', statusCode: 301 } },
    // Trailing slash required so static /dialogue/index.html assets resolve under /dialogue/.
    '/dialogue': { redirect: { to: '/dialogue/', statusCode: 308 } },
    // Educate section removed — keep old links from 404ing.
    '/educate': { redirect: { to: '/', statusCode: 301 } },
    '/educate/**': { redirect: { to: '/', statusCode: 301 } },
    // PicTune removed — keep old links from 404ing.
    '/engage/pictune': { redirect: { to: '/engage', statusCode: 301 } },
    // Games renamed to Engage.
    '/games': { redirect: { to: '/engage', statusCode: 301 } },
    '/games/**': { redirect: { to: '/engage/**', statusCode: 301 } },
  },
  alias: {
    '@astroclock': fileURLToPath(new URL('./astroclock', import.meta.url)),
  },
  vite: {
    // Keep Vue JSX off the React island. Every .tsx in this repo is AstroClock.
    vueJsx: {
      exclude: /(?:^|[\\/])astroclock[\\/]/,
    },
    plugins: [
      astroclockReactJsx(),
      // Tailwind only processes files under astroclock/ via @source in CSS.
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'lucide-react',
      ],
    },
  },
  // Ensure .tsx under astroclock compiles with the React JSX transform.
  typescript: {
    tsConfig: {
      compilerOptions: {
        jsx: 'react-jsx',
      },
    },
  },
  nitro: {
    preset: 'vercel',
    externals: {
      // Keep Playwright deps external in case the pw backup is ever re-enabled
      external: ['playwright-core', '@sparticuz/chromium', 'satori', '@resvg/resvg-js', 'pdf-lib'],
    },
    vercel: {
      functions: {
        maxDuration: 60,
      },
    },
  }
})
