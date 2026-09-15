import { defineStore } from 'pinia'

export type Theme = 'dark' | 'light'

/** Lasting key — cleared on init so reopen always follows the OS. */
const LEGACY_KEY = 'et-theme'
/** Explicit override for this tab/session only. */
const SESSION_KEY = 'et-theme-session'

/**
 * Theme follows the OS on every fresh open / new tab.
 * A manual toggle sticks only for the browsing session (sessionStorage),
 * then reopen resets to prefers-color-scheme.
 */
export const useThemeStore = defineStore('theme', {
  state: () => ({ theme: 'light' as Theme, explicit: false }),
  getters: {
    isDark: (state) => state.theme === 'dark'
  },
  actions: {
    _mq: null as MediaQueryList | null,
    _mqListener: null as ((e: MediaQueryListEvent) => void) | null,
    _animTimer: 0 as any,

    set(t: Theme, animate = true) {
      this.theme = t
      if (!import.meta.client) return
      const el = document.documentElement
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if (animate && !reduce) {
        el.classList.add('theme-anim')
        clearTimeout(this._animTimer)
        this._animTimer = window.setTimeout(() => el.classList.remove('theme-anim'), 520)
      }
      el.dataset.theme = t
    },

    toggle() {
      this.explicit = true
      const next: Theme = this.theme === 'dark' ? 'light' : 'dark'
      if (import.meta.client) {
        try { sessionStorage.setItem(SESSION_KEY, next) } catch {}
        try { localStorage.removeItem(LEGACY_KEY) } catch {}
      }
      this.set(next)
      // Keep following OS only when not explicit — once toggled, session owns it.
      this._detachMq()
    },

    _detachMq() {
      if (this._mq && this._mqListener) {
        this._mq.removeEventListener('change', this._mqListener)
        this._mqListener = null
        this._mq = null
      }
    },

    _attachMq() {
      this._detachMq()
      this._mq = window.matchMedia('(prefers-color-scheme: dark)')
      this._mqListener = (e) => {
        if (!this.explicit) this.set(e.matches ? 'dark' : 'light')
      }
      this._mq.addEventListener('change', this._mqListener)
    },

    init() {
      if (!import.meta.client) return
      // Migrate: never restore lasting localStorage preference.
      try { localStorage.removeItem(LEGACY_KEY) } catch {}

      let session: string | null = null
      try { session = sessionStorage.getItem(SESSION_KEY) } catch {}

      if (session === 'dark' || session === 'light') {
        this.explicit = true
        this.set(session, false)
        return
      }

      this.explicit = false
      this._attachMq()
      this.set(this._mq!.matches ? 'dark' : 'light', false)
    },

    dispose() {
      this._detachMq()
    }
  }
})
