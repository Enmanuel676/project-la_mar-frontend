// Fotogramas del anillo (public/ring-frames/, generados con scripts/build-ring-frames.py).
// Hay una versión por velocidad de conexión: Inicio elige una con selectTier() (ver
// lib/networkTier.js) y solo se descarga esa. Se descargan una sola vez por sesión y se
// quedan en memoria a nivel de módulo: al volver a Inicio desde otra página se dibujan
// al instante, sin volver a descargar nada.

const FRAMES_URL = `${import.meta.env.BASE_URL}ring-frames/`
const MAX_IN_FLIGHT = 6

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
let frames = []
let queue = null
let inFlight = 0
let loadedCount = 0
let listeners = []

function notifyListeners() {
  for (const listener of listeners) {
    listener(loadedCount)
  }
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

function pump() {
  while (inFlight < MAX_IN_FLIGHT && queue.length) {
    const index = queue.shift()
    const img = new Image()
    img.src = frameUrl(index)
    inFlight++
    // decode() deja la imagen decodificada: dibujarla después no bloquea el scroll.
    img
      .decode()
      .then(() => {
        frames[index] = img
        loadedCount++
        notifyListeners()
      })
      .catch(() => {
        loadedCount++
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
  },
  getTier: () => tier,
  // Fotogramas de la versión elegida (0 mientras no haya una).
  getCount: () => frames.length,
  // Empieza la descarga (solo la primera vez) dando prioridad a `first`.
  load(first = 0) {
    if (queue || !sequence) return
    queue = loadOrder(first)
    pump()
  },
  get: (index) => frames[index],
  // Índice del fotograma ya cargado más cercano a `index` (-1 si no hay ninguno).
  nearestReady(index) {
    for (let d = 0; d < frames.length; d++) {
      if (frames[index - d]) return index - d
      if (frames[index + d]) return index + d
    }
    return -1
  },
  // ¿Ya se descargó esa fracción de los fotogramas? (1 = todos)
  isLoaded(fraction = 1) {
    return frames.length > 0 && loadedCount >= Math.ceil(frames.length * fraction)
  },
  getLoadedCount() {
    return loadedCount
  },
  // Se resuelve cuando ya están descargados y decodificados esa fracción de los
  // fotogramas (1 = todos).
  whenReady(fraction = 1) {
    ringFrames.load(0)
    return new Promise((resolve) => {
      const check = () => {
        if (!ringFrames.isLoaded(fraction)) return
        listeners = listeners.filter((l) => l !== check)
        resolve()
      }
      listeners.push(check)
      check()
    })
  },
}
