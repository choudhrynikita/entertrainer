import * as THREE from 'three'
import type { ScaleId } from './scales'

const NASA_DAY = 'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg'
const NASA_NIGHT = 'https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg'
const NASA_BUMP = 'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png'
const SDO_SUN = 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0304.jpg'

export interface CreateEngineOpts {
  canvas: HTMLCanvasElement
  lat: number
  scale: ScaleId
  theme: 'dark' | 'light'
  onReady?: () => void
  onTapBody?: () => void
  onLat?: (lat: number) => void
}

export interface VelocityEngine {
  setScale: (s: ScaleId) => void
  setLat: (lat: number) => void
  setTheme: (t: 'dark' | 'light') => void
  dispose: () => void
}

function softParticle(): THREE.Texture {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function spiralGalaxy(): THREE.Points {
  const N = 4200
  const pos = new Float32Array(N * 3)
  const col = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const arm = i % 4
    const r = Math.pow(Math.random(), 0.55) * 18
    const a = arm * (Math.PI / 2) + r * 0.38 + (Math.random() - 0.5) * 0.28
    pos[i * 3] = Math.cos(a) * r
    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4
    pos[i * 3 + 2] = Math.sin(a) * r
    col[i * 3] = 0.9; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 0.75
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.09, vertexColors: true, map: softParticle(), transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }))
  pts.rotation.x = 0.35
  return pts
}

export function createEngine(opts: CreateEngineOpts): VelocityEngine {
  const renderer = new THREE.WebGLRenderer({ canvas: opts.canvas, antialias: true })
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(opts.theme === 'light' ? '#E8E2D6' : '#07080C')
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200)
  camera.position.set(0, 0.4, 6.2)
  const clock = new THREE.Clock()
  const loader = new THREE.TextureLoader()
  const groups: Record<ScaleId, THREE.Group> = { earth: new THREE.Group(), sun: new THREE.Group(), galaxy: new THREE.Group(), cosmos: new THREE.Group() }
  Object.values(groups).forEach((g) => { g.visible = false; scene.add(g) })
  let scale: ScaleId = opts.scale
  let disposed = false
  let pinLat = opts.lat
  scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x1a140c, 0.55))
  const key = new THREE.DirectionalLight(0xfff4e0, 1.35)
  key.position.set(-4, 2, 3)
  scene.add(key)
  const earthMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, roughness: 0.72 })
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1.35, 64, 48), earthMat)
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.42, 32, 24), new THREE.MeshBasicMaterial({ color: 0x64b5f6, transparent: true, opacity: 0.12, side: THREE.BackSide }))
  const equator = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.006, 8, 96), new THREE.MeshBasicMaterial({ color: 0xd4af37 }))
  equator.rotation.x = Math.PI / 2
  const pin = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), new THREE.MeshBasicMaterial({ color: 0xd4af37 }))
  groups.earth.add(earth, atmo, equator, pin)
  loader.load(NASA_DAY, (t) => { t.colorSpace = THREE.SRGBColorSpace; earthMat.map = t; earthMat.color.set(0xffffff); earthMat.needsUpdate = true })
  loader.load(NASA_NIGHT, (t) => { t.colorSpace = THREE.SRGBColorSpace; earthMat.emissiveMap = t; earthMat.emissive = new THREE.Color(0x334466); earthMat.needsUpdate = true })
  loader.load(NASA_BUMP, (t) => { earthMat.bumpMap = t; earthMat.bumpScale = 0.04 })
  const sunMat = new THREE.MeshStandardMaterial({ color: 0xffcc66, emissive: 0xffaa33, emissiveIntensity: 0.85 })
  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.1, 48, 32), sunMat)
  const earthBead = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: 0x64b5f6 }))
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.008, 8, 96), new THREE.MeshBasicMaterial({ color: 0xd4af37 }))
  orbit.rotation.x = Math.PI / 2
  groups.sun.add(sun, orbit, earthBead)
  loader.load(SDO_SUN, (t) => { t.colorSpace = THREE.SRGBColorSpace; sunMat.map = t; sunMat.color.set(0xffffff) }, undefined, () => {})
  groups.galaxy.add(spiralGalaxy())
  groups.cosmos.add(spiralGalaxy())
  function placePin() {
    const phi = THREE.MathUtils.degToRad(90 - pinLat)
    pin.position.setFromSphericalCoords(1.38, phi, THREE.MathUtils.degToRad(77.2))
  }
  placePin()
  function show(s: ScaleId) {
    scale = s
    ;(Object.keys(groups) as ScaleId[]).forEach((k) => { groups[k].visible = k === s })
    if (s === 'earth') camera.position.set(0, 0.35, 4.6)
    if (s === 'sun') camera.position.set(0, 1.2, 7)
    if (s === 'galaxy') camera.position.set(0, 6, 16)
    if (s === 'cosmos') camera.position.set(0, 2, 22)
    camera.lookAt(0, 0, 0)
  }
  show(scale)
  let dragging = false, lastX = 0, lastY = 0, moved = 0
  const onDown = (e: PointerEvent) => { dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY }
  const onMove = (e: PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - lastX, dy = e.clientY - lastY
    lastX = e.clientX; lastY = e.clientY; moved += Math.abs(dx) + Math.abs(dy)
    if (scale === 'earth') { pinLat = Math.max(-80, Math.min(80, pinLat - dy * 0.18)); placePin(); opts.onLat?.(pinLat) }
    else { groups[scale].rotation.y += dx * 0.006; groups[scale].rotation.x += dy * 0.004 }
  }
  const onUp = () => { dragging = false; if (moved < 8) opts.onTapBody?.() }
  opts.canvas.addEventListener('pointerdown', onDown)
  opts.canvas.addEventListener('pointermove', onMove)
  opts.canvas.addEventListener('pointerup', onUp)
  const ro = new ResizeObserver(() => {
    const w = opts.canvas.clientWidth || 1, h = opts.canvas.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  })
  ro.observe(opts.canvas)
  const tReady = window.setTimeout(() => opts.onReady?.(), 900)
  renderer.setAnimationLoop(() => {
    if (disposed) return
    const t = clock.getElapsedTime()
    if (groups.earth.visible) earth.rotation.y = t * 0.06
    if (groups.sun.visible) {
      sun.rotation.y = t * 0.03
      earthBead.position.set(Math.cos(t * 0.22) * 2.4, 0, Math.sin(t * 0.22) * 2.4)
    }
    if (groups.galaxy.visible) groups.galaxy.rotation.y = t * 0.015
    if (groups.cosmos.visible) groups.cosmos.rotation.y = t * 0.008
    renderer.render(scene, camera)
  })
  return {
    setScale: show,
    setLat(v) { pinLat = v; placePin() },
    setTheme(th) { scene.background = new THREE.Color(th === 'light' ? '#E8E2D6' : '#07080C') },
    dispose() {
      disposed = true
      window.clearTimeout(tReady)
      renderer.setAnimationLoop(null)
      ro.disconnect()
      opts.canvas.removeEventListener('pointerdown', onDown)
      opts.canvas.removeEventListener('pointermove', onMove)
      opts.canvas.removeEventListener('pointerup', onUp)
      renderer.dispose()
    },
  }
}
