// Fotogramas del giro del anillo (public/ring-frames/, generados desde el video
// con scripts/build-ring-frames.py). Se descargan una sola vez por sesión y se
// quedan en memoria a nivel de módulo: al volver a Inicio desde otra página se
// dibujan al instante, sin volver a descargar nada.

export const FRAME_COUNT = 240
const FRAMES_URL = `${import.meta.env.BASE_URL}ring-frames/`
const MAX_IN_FLIGHT = 6

const frames = new Array(FRAME_COUNT).fill(null)
let queue = null
let inFlight = 0

const frameUrl = (index) => `${FRAMES_URL}${String(index).padStart(3, '0')}.webp`

// Primero el fotograma pedido, luego uno de cada 16 y después se rellenan los
// huecos: el anillo ya gira completo (a saltos) antes de terminar la descarga.
function loadOrder(first) {
  const order = [first]
  for (let step = 16; step >= 1; step /= 2) {
    for (let i = 0; i < FRAME_COUNT; i += step) order.push(i)
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
      })
      .catch(() => {})
      .finally(() => {
        inFlight--
        pump()
      })
  }
}

export const ringFrames = {
  // Empieza la descarga (solo la primera vez) dando prioridad a `first`.
  load(first = 0) {
    if (queue) return
    queue = loadOrder(first)
    pump()
  },
  get: (index) => frames[index],
  // Índice del fotograma ya cargado más cercano a `index` (-1 si no hay ninguno).
  nearestReady(index) {
    for (let d = 0; d < FRAME_COUNT; d++) {
      if (frames[index - d]) return index - d
      if (frames[index + d]) return index + d
    }
    return -1
  },
}
