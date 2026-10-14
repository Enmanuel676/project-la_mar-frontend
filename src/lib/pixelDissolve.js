// Efecto de aparición/desaparición en píxeles: una máscara CSS (un SVG con las
// celdas visibles) oculta el elemento celda a celda, y un canvas superpuesto
// (.pixel-card__fx) pinta "chispas" de color en el borde de la transición.

const CELL = 14
const STEPS = 28
const EDGE = 0.12
const HUES = ['103,253,225', '255,181,157', '246,221,217']
const MAX_SCROLL_BLUR = 1.6
const FULL_MASK = 'linear-gradient(#000, #000)'

// Posición vertical (fracción del viewport) del centro del elemento donde
// empieza/termina de aparecer (in) y de desaparecer (out).
const DESKTOP_RANGE = { inFrom: 1, inTo: 0.6, outFrom: 0.3, outTo: -0.05 }
const MOBILE_RANGE = { inFrom: 0.95, inTo: 0.72, outFrom: 0.28, outTo: 0.08 }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value)

export function createSurface(el, fx, { fromTop = false } = {}) {
  return { el, fx, fromTop, grid: null, cache: {}, key: null, blur: null, state: null }
}

function buildGrid(surface) {
  const w = surface.el.offsetWidth
  const h = surface.el.offsetHeight
  const cols = Math.max(1, Math.ceil(w / CELL))
  const rows = Math.max(1, Math.ceil(h / CELL))
  const thresholds = new Float32Array(cols * rows)
  const hue = new Uint8Array(cols * rows)

  for (let row = 0; row < rows; row++) {
    const bias = surface.fromTop
      ? row / Math.max(1, rows - 1)
      : (rows - 1 - row) / Math.max(1, rows - 1)
    for (let col = 0; col < cols; col++) {
      thresholds[row * cols + col] = bias * 0.72 + Math.random() * 0.28
      hue[row * cols + col] = Math.floor(Math.random() * HUES.length)
    }
  }

  surface.grid = { w, h, cols, rows, t: thresholds, hue }
  surface.cache = {}
  surface.key = null
  surface.fx.width = w
  surface.fx.height = h
}

function ensureGrid(surface) {
  const { grid, el } = surface
  if (!grid || grid.w !== el.offsetWidth || Math.abs(grid.h - el.offsetHeight) > CELL) {
    buildGrid(surface)
  }
}

function cellAlpha(threshold, reveal, conceal) {
  const hi = reveal * 1.12
  const lo = conceal * 1.12 - EDGE
  if (threshold >= hi || threshold < lo) return 0
  const distance = Math.min(hi - threshold, threshold - lo)
  return distance < EDGE ? 0.35 + (distance / EDGE) * 0.5 : 1
}

// Rectángulo que cubre las celdas `from`…`to` (sin incluir) de una fila, como trazo SVG.
const cellRun = (from, to, row) =>
  `M${from * CELL} ${row * CELL}h${(to - from) * CELL}v${CELL}h${(from - to) * CELL}z`

// La máscara es un SVG y no un PNG: generar el texto es casi gratis, mientras que
// codificar un PNG (canvas.toDataURL) bloqueaba el hilo principal en cada paso nuevo y
// trababa el scroll en móviles. Además el SVG queda nítido a cualquier densidad de píxeles.
function maskFor(surface, revealStep, concealStep) {
  const cacheKey = `${revealStep}_${concealStep}`
  if (surface.cache[cacheKey]) return surface.cache[cacheKey]

  const { grid } = surface
  const reveal = revealStep / STEPS
  const conceal = concealStep / STEPS

  // Un trazo por nivel de opacidad; las celdas seguidas de una fila con la misma
  // opacidad se juntan en un solo rectángulo.
  const paths = new Map()
  for (let row = 0; row < grid.rows; row++) {
    let start = 0
    let level = null
    for (let col = 0; col <= grid.cols; col++) {
      const alpha = col < grid.cols ? cellAlpha(grid.t[row * grid.cols + col], reveal, conceal) : 0
      const next = alpha > 0 ? alpha.toFixed(2) : null
      if (next === level) continue
      if (level !== null) paths.set(level, (paths.get(level) ?? '') + cellRun(start, col, row))
      level = next
      start = col
    }
  }

  let shapes = ''
  paths.forEach((d, alpha) => {
    shapes += `<path fill-opacity="${alpha}" d="${d}"/>`
  })
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${grid.w}" height="${grid.h}" viewBox="0 0 ${grid.w} ${grid.h}" ` +
    `preserveAspectRatio="none" shape-rendering="crispEdges">${shapes}</svg>`
  const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  surface.cache[cacheKey] = mask
  return mask
}

function paintSparkles(surface, reveal, conceal) {
  const { grid } = surface
  const ctx = surface.fx.getContext('2d')
  ctx.clearRect(0, 0, grid.w, grid.h)
  if ((reveal >= 1 && conceal <= 0) || reveal <= 0 || conceal >= 1) return

  for (let i = 0; i < grid.t.length; i++) {
    const alpha = cellAlpha(grid.t[i], reveal, conceal)
    if (alpha <= 0 || alpha >= 1) continue
    ctx.fillStyle = `rgba(${HUES[grid.hue[i]]},${(0.9 - alpha * 0.6).toFixed(2)})`
    ctx.fillRect((i % grid.cols) * CELL, Math.floor(i / grid.cols) * CELL, CELL - 1, CELL - 1)
  }
}

function setMask(el, mask) {
  el.style.webkitMaskImage = mask
  el.style.maskImage = mask
}

function setBlur(surface, px) {
  const rounded = Math.round(px * 10) / 10
  if (surface.blur === rounded) return
  surface.blur = rounded
  surface.el.style.filter = `blur(${rounded}px)`
}

/**
 * Dibuja el estado del efecto. `reveal` y `conceal` van de 0 a 1.
 * Devuelve 'hidden', 'partial' o 'full'.
 */
export function renderSurface(surface, reveal, conceal = 0, extraBlur = 0) {
  ensureGrid(surface)
  return paintSurface(surface, reveal, conceal, extraBlur)
}

// renderSurface sin medir el elemento: quien la llama ya puso la rejilla al día.
function paintSurface(surface, reveal, conceal, extraBlur) {
  const revealStep = Math.round(clamp01(reveal) * STEPS)
  const concealStep = Math.round(clamp01(conceal) * STEPS)
  const hidden = revealStep === 0 || concealStep === STEPS
  const full = revealStep === STEPS && concealStep === 0
  const state = hidden ? 'hidden' : full ? 'full' : 'partial'

  setBlur(surface, hidden ? 0 : Math.min(4, (1 - reveal) * 4 + conceal * 4 + extraBlur))

  const key = `${revealStep}_${concealStep}`
  if (key === surface.key) return state
  surface.key = key

  if (hidden) {
    setMask(surface.el, maskFor(surface, 0, 0))
    paintSparkles(surface, 0, 0)
  } else {
    setMask(surface.el, full ? FULL_MASK : maskFor(surface, revealStep, concealStep))
    paintSparkles(surface, revealStep / STEPS, concealStep / STEPS)
  }
  return state
}

// Un único bucle rAF compartido anima todos los elementos ligados al scroll.
const scrollSurfaces = new Set()
let frameId = null
let lastScrollY = 0
let scrollBlur = 0
let mobileQuery = null

function tick() {
  const vh = window.innerHeight
  const delta = Math.abs(window.scrollY - lastScrollY)
  lastScrollY = window.scrollY
  scrollBlur += (Math.min(MAX_SCROLL_BLUR, delta * 0.04) - scrollBlur) * 0.2

  mobileQuery ??= window.matchMedia('(max-width: 767px)')
  const range = mobileQuery.matches ? MOBILE_RANGE : DESKTOP_RANGE

  // Primero se mide todo y después se escribe: intercalarlo obligaría al navegador a
  // recalcular los estilos una vez por tarjeta en cada frame.
  const centers = []
  scrollSurfaces.forEach((surface) => {
    ensureGrid(surface)
    const rect = surface.el.getBoundingClientRect()
    centers.push((rect.top + rect.bottom) / 2)
  })

  let index = 0
  scrollSurfaces.forEach((surface) => {
    const center = centers[index++]
    const state = paintSurface(
      surface,
      clamp01((vh * range.inFrom - center) / (vh * (range.inFrom - range.inTo))),
      clamp01((vh * range.outFrom - center) / (vh * (range.outFrom - range.outTo))),
      scrollBlur,
    )
    if (state === surface.state) return
    surface.state = state
    surface.el.classList.toggle('is-hidden', state === 'hidden')
    surface.el.style.pointerEvents = state === 'full' ? '' : 'none'
  })

  frameId = scrollSurfaces.size ? requestAnimationFrame(tick) : null
}

/** Liga el efecto a la posición de scroll del elemento. Devuelve la limpieza. */
export function attachScrollDissolve(el, fx) {
  if (prefersReducedMotion()) return () => {}

  const surface = createSurface(el, fx)
  scrollSurfaces.add(surface)
  if (!frameId) {
    lastScrollY = window.scrollY
    frameId = requestAnimationFrame(tick)
  }

  return () => {
    scrollSurfaces.delete(surface)
    el.classList.remove('is-hidden')
    el.style.filter = ''
    el.style.pointerEvents = ''
    setMask(el, '')
  }
}
