import { useEffect, useRef, useState } from 'react'
import { createEngine, type VelocityEngine } from './engine'
import {
  SCALES,
  type ScaleId,
  type SpeedUnit,
  NEXT_UNIT,
  formatSpeed,
  speedForScale,
  latHemisphere,
} from './scales'
import './velocity.css'

const UNIT_KEY = 'velocity-unit-v1'
const THEME_KEY = 'velocity-theme-v1'
const LAT_KEY = 'velocity-lat-v1'

export function VelocityApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<VelocityEngine | null>(null)
  const [scale, setScale] = useState<ScaleId>('earth')
  const [unit, setUnit] = useState<SpeedUnit>('km/h')
  const [lat, setLat] = useState(28.6)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [ready, setReady] = useState(false)
  const [story, setStory] = useState(false)
  const [hint, setHint] = useState('Tap the globe. Swipe the dock.')

  useEffect(() => {
    try {
      const u = localStorage.getItem(UNIT_KEY) as SpeedUnit | null
      if (u && NEXT_UNIT[u]) setUnit(u)
      const th = localStorage.getItem(THEME_KEY)
      if (th === 'light' || th === 'dark') setTheme(th)
      const l = Number(localStorage.getItem(LAT_KEY))
      if (Number.isFinite(l)) setLat(l)
      else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (p) => setLat(p.coords.latitude),
          () => {},
          { maximumAge: 86400000, timeout: 4000 },
        )
      }
    } catch { /* */ }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(THEME_KEY, theme) } catch { /* */ }
  }, [theme])

  useEffect(() => {
    try { localStorage.setItem(UNIT_KEY, unit) } catch { /* */ }
  }, [unit])

  useEffect(() => {
    try { localStorage.setItem(LAT_KEY, String(lat)) } catch { /* */ }
  }, [lat])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const eng = createEngine({
      canvas,
      lat,
      scale,
      theme,
      onReady: () => setReady(true),
      onTapBody: () => setStory(true),
      onLat: (v) => setLat(Math.round(v * 10) / 10),
    })
    engineRef.current = eng
    return () => {
      eng.dispose()
      engineRef.current = null
    }
  }, [])

  useEffect(() => { engineRef.current?.setScale(scale) }, [scale])
  useEffect(() => { engineRef.current?.setLat(lat) }, [lat])
  useEffect(() => { engineRef.current?.setTheme(theme) }, [theme])

  useEffect(() => {
    setHint(scale === 'earth' ? 'Drag the gold pin. Tap for the story.' : 'Drag to turn. Tap the body for the story.')
    const id = window.setTimeout(() => setHint(''), 4200)
    return () => window.clearTimeout(id)
  }, [scale])

  const def = SCALES.find((s) => s.id === scale)!
  const kms = speedForScale(scale, lat)

  return (
    <div className="vel-root" data-theme={theme}>
      <canvas ref={canvasRef} className="vel-canvas" aria-label="Velocity scene" />
      {!ready && <div className="vel-boot">Velocity</div>}
      <header className="vel-hud">
        <button type="button" className="vel-mark" onClick={() => setStory(true)} aria-label="Open story">
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <path d="M6 26 L16 6 L26 26 L20 26 L16 16 L12 26 Z" fill="currentColor" />
          </svg>
        </button>
        <button type="button" className="vel-speed" onClick={() => setUnit((u) => NEXT_UNIT[u])}>
          <span className="vel-kicker">{def.kicker}</span>
          <strong>{formatSpeed(kms, unit)}</strong>
        </button>
        <button type="button" className="vel-theme" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>
      {hint && <p className="vel-hint">{hint}</p>}
      <nav className="vel-dock" aria-label="Scales">
        {SCALES.map((s) => (
          <button key={s.id} type="button" className={s.id === scale ? 'is-on' : ''} onClick={() => { setScale(s.id); setStory(false) }}>
            {s.name}
          </button>
        ))}
      </nav>
      <aside className={`vel-sheet ${story ? 'is-open' : ''}`} aria-hidden={!story}>
        <h1>{def.name}</h1>
        <p className="vel-meta">{latHemisphere(lat)} · {formatSpeed(kms, unit)}</p>
        {scale === 'earth' && (
          <label className="vel-lat">Latitude
            <input type="range" min={-80} max={80} step={0.5} value={lat} onChange={(e) => setLat(Number(e.target.value))} />
          </label>
        )}
        {def.story.map((p) => (<p key={p.slice(0, 24)}>{p}</p>))}
        <p className="vel-credit">Earth textures via NASA Blue Marble / three-globe. Sun courtesy of NASA SDO when the feed is reachable.</p>
        <button type="button" className="vel-close" onClick={() => setStory(false)}>Close</button>
      </aside>
    </div>
  )
}
