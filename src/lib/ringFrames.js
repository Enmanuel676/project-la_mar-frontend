// Fotogramas del anillo (public/ring-frames/, generados con scripts/build-ring-frames.py).
// Hay una versión por velocidad de conexión: Inicio elige una con selectTier() (ver
// lib/networkTier.js) y solo se descarga esa. Se descargan una sola vez por sesión y se
// quedan en memoria a nivel de módulo: al volver a Inicio desde otra página se dibujan
// al instante, sin volver a descargar nada.
//
// Dibujar un fotograma que no está decodificado obliga a decodificarlo en ese momento,
// en el hilo principal: en escritorio apenas se nota, pero en un móvil cada uno se come
// el frame entero y el giro se traba. Cómo se guardan depende del escenario (setView):
// - 'bitmap' (móvil en vertical): ya decodificados (ImageBitmap, fuera del hilo
//   principal) y recortados a la franja que se ve. Si aun así no caben todos en
//   MAX_BITMAP_BYTES, se guarda uno de cada dos: RingScroll mezcla los vecinos y
//   se ve casi igual que el que falta.
// - 'image' (escritorio): <img> completos; el navegador decide cuáles mantiene
//   decodificados, y volver a decodificar uno ahí es rápido.

const FRAMES_URL = `${import.meta.env.BASE_URL}ring-frames/`
const MAX_IN_FLIGHT = 6
// Tamaño de todos los fotogramas (SIZE en scripts/build-ring-frames.py).
const FRAME_WIDTH = 1280
const FRAME_HEIGHT = 720
// Memoria para fotogramas decodificados (4 bytes por píxel). Un móvil en vertical ve
// unos 450×720 px de cada uno: los 240 ocuparían ~310 MB, uno de cada dos sí cabe.
const MAX_BITMAP_BYTES = 200 * 1024 * 1024
// El recorte deja un 25 % de margen para absorber cambios de viewport (menú móvil, barra de dirección).
const CROP_MARGIN = 1.25

// Carpeta y número de fotogramas de cada versión.
const SEQUENCES = {
  // El giro completo del anillo.
  normal: { dir: 'normal-network', count: 240 },
  // El brillo de la gema: 3.71 s de video, uno de cada 4 fotogramas.
  medium: { dir: 'medium-network', count: 23 },
  // Una sola imagen fija, sin scroll motion.
  low: { dir: 'low-network', count: 1 },
}

let tier = null
let sequence = null
let view = null
// Pasa a false si el navegador falla al crear un ImageBitmap: se sigue con <img>.
let bitmapsWork = typeof createImageBitmap === 'function'
// Cómo se guardan: { mode, step, crop, visible }. Hasta conocer el escenario solo se descarga.
let plan = null
let resolvePlan
const planReady = new Promise((resolve) => {
  resolvePlan = resolve
})
let blobs = [] // promesa del archivo comprimido de cada fotograma
let frames = [] // fotograma listo para dibujar (ImageBitmap o <img>) o null
let status = [] // 0 = pendiente, 1 = en curso, 2 = terminado (listo o con error)
let order = null
let inFlight = 0
let doneCount = 0
// Cambia al rehacer los fotogramas con otro plan: lo que estaba en curso se descarta.
let generation = 0
const listeners = new Set()

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

const frameUrl = (index) => `${FRAMES_URL}${sequence.dir}/${String(index).padStart(3, '0')}.webp`

// Primero el fotograma pedido, luego uno de cada 16 y después se rellenan los
// huecos: el anillo ya gira completo (a saltos) antes de terminar la descarga.
function loadOrder(first) {
  const order = [first]
  for (let step = 16; step >= 1; step /= 2) {
    for (let i = 0; i < sequence.count; i += step) order.push(i)
  }
  return [...new Set(order)]
}

// Rectángulo centrado en el fotograma. Medidas pares: así el centro cae justo en el del
// fotograma y el recorte se ve exactamente donde se vería el fotograma entero.
function centered(width, height) {
  const w = Math.min(FRAME_WIDTH, 2 * Math.ceil(width / 2))
  const h = Math.min(FRAME_HEIGHT, 2 * Math.ceil(height / 2))
  return { x: (FRAME_WIDTH - w) / 2, y: (FRAME_HEIGHT - h) / 2, width: w, height: h }
}

const covers = (outer, inner) =>
  inner.x >= outer.x &&
  inner.y >= outer.y &&
  inner.x + inner.width <= outer.x + outer.width &&
  inner.y + inner.height <= outer.y + outer.height

// El lienzo escala los fotogramas como object-fit: cover, así que de cada uno solo se
// ve la franja central `visible`; en un móvil en vertical, menos de la mitad.
function planFor(width, height) {
  const scale = Math.max(width / FRAME_WIDTH, height / FRAME_HEIGHT)
  const visible = centered(width / scale, height / scale)
  const crop = centered((width / scale) * CROP_MARGIN, (height / scale) * CROP_MARGIN)
  if (bitmapsWork) {
    for (const step of [1, 2]) {
      const bytes = Math.ceil(sequence.count / step) * crop.width * crop.height * 4
      if (bytes <= MAX_BITMAP_BYTES) return { mode: 'bitmap', step, crop, visible }
    }
  }
  return { mode: 'image', step: 1, crop: centered(FRAME_WIDTH, FRAME_HEIGHT), visible }
}

const release = (frame) => frame?.close?.()

function updatePlan() {
  if (!sequence || !view) return
  const next = planFor(view.width, view.height)
  if (!plan) {
    plan = next
    resolvePlan()
  } else if (next.mode !== plan.mode || !covers(plan.crop, next.visible)) {
    rebuild(next)
  }
}

// Vuelve a decodificar con otro plan los fotogramas ya descargados (al girar el móvil,
// el recorte vertical ya no cubre lo que se ve).
function rebuild(next) {
  generation++
  plan = next
  // Conservar temporalmente los fotogramas anteriores para que la pantalla no parpadee en negro
  const prevFrames = [...frames]
  status.fill(0)
  doneCount = 0
  for (let i = 0; i < prevFrames.length; i++) {
    if (prevFrames[i]) frames[i] = prevFrames[i]
  }
  notifyListeners()
  if (order) pump()
}

function decode(blob, { mode, crop }) {
  if (mode === 'bitmap') return createImageBitmap(blob, crop.x, crop.y, crop.width, crop.height)
  const img = new Image()
  img.src = URL.createObjectURL(blob)
  // decode() deja la imagen decodificada antes de dibujarla por primera vez.
  return img
    .decode()
    .then(() => img)
    .finally(() => URL.revokeObjectURL(img.src))
}

// Descarga un fotograma (puede empezar antes de conocer el escenario) y lo decodifica.
// Devuelve false si al final no hace falta: no entra en el plan o el plan cambió.
async function processFrame(index, gen) {
  blobs[index] ??= fetch(frameUrl(index)).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.blob()
  })
  const blob = await blobs[index]
  await planReady
  if (gen !== generation || index % plan.step) return false
  const frame = await decode(blob, plan).catch((error) => {
    if (plan.mode === 'bitmap' && gen === generation) {
      bitmapsWork = false
      updatePlan()
    }
    throw error
  })
  if (gen !== generation) {
    release(frame)
    return false
  }
  if (frames[index] && frames[index] !== frame) {
    release(frames[index])
  }
  frames[index] = frame
  return true
}

function pump() {
  while (inFlight < MAX_IN_FLIGHT) {
    const step = plan ? plan.step : 1
    const index = order.find((i) => status[i] === 0 && i % step === 0)
    if (index === undefined) return
    const gen = generation
    status[index] = 1
    inFlight++
    processFrame(index, gen)
      // Uno que falla cuenta como terminado: en su lugar se dibujan sus vecinos.
      .catch(() => true)
      .then((done) => {
        if (gen !== generation) return
        status[index] = done ? 2 : 0
        if (done) doneCount++
        notifyListeners()
      })
      .finally(() => {
        inFlight--
        pump()
      })
  }
}

export const ringFrames = {
  // Elige la versión que se va a descargar. Solo cuenta la primera vez: se mantiene
  // durante toda la sesión.
  selectTier(name) {
    if (sequence) return
    tier = name
    sequence = SEQUENCES[name]
    frames = new Array(sequence.count).fill(null)
    status = new Array(sequence.count).fill(0)
    blobs = new Array(sequence.count)
    updatePlan()
  },
  getTier: () => tier,
  // Fotogramas de la versión elegida (0 mientras no haya una).
  getCount: () => frames.length,
  // Tamaño del escenario en px CSS: decide cómo se guardan los fotogramas (ver arriba).
  setView(width, height) {
    if (!width || !height) return
    view = { width, height }
    updatePlan()
  },
  // Empieza la descarga (solo la primera vez) dando prioridad a `first`.
  load(first = 0) {
    if (order || !sequence) return
    order = loadOrder(first)
    pump()
  },
  get: (index) => frames[index],
  // Parte del fotograma que guardan los listos (en px): el tamaño del lienzo.
  getCrop: () => plan?.crop ?? null,
  // Cambia cada vez que se rehacen los fotogramas: hay que volver a dibujar.
  getVersion: () => generation,
  // Índices de los fotogramas listos más cercanos a `position` (con decimales), por
  // debajo y por encima; -1 si no hay ninguno de ese lado.
  neighbors(position) {
    let below = Math.min(frames.length - 1, Math.floor(position))
    while (below >= 0 && !frames[below]) below--
    let above = Math.max(0, Math.ceil(position))
    while (above < frames.length && !frames[above]) above++
    return [below, above < frames.length ? above : -1]
  },
  // ¿Ya está lista esa fracción de los fotogramas que se van a usar? (1 = todos)
  isLoaded(fraction = 1) {
    return plan !== null && doneCount >= Math.ceil(Math.ceil(frames.length / plan.step) * fraction)
  },
  // Avisa cada vez que termina un fotograma o se rehacen todos. Devuelve la baja.
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  // Se resuelve cuando ya están descargados y decodificados esa fracción de los
  // fotogramas (1 = todos).
  whenReady(fraction = 1) {
    ringFrames.load(0)
    return new Promise((resolve) => {
      const check = () => {
        if (!ringFrames.isLoaded(fraction)) return
        listeners.delete(check)
        resolve()
      }
      listeners.add(check)
      check()
    })
  },
}
