// Velocidad de conexión del visitante: decide qué versión del anillo se descarga en
// Inicio (las versiones están en lib/ringFrames.js). Se mide una sola vez por carga de
// página, en segundo plano mientras se ve el cargador, y vale el primer resultado.

// Umbrales de velocidad de bajada, en Mbps.
const NORMAL_MIN_MBPS = 1.25 // 5 Mbps o más: el giro completo
const MEDIUM_MIN_MBPS = 0.6 // de 2 a 5 Mbps: la versión ligera; por debajo, la imagen fija
// Si no se pudo medir (sin red, archivo no encontrado), la versión intermedia.
const FALLBACK_TIER = 'medium'

// Archivo de prueba: 192 KB de bytes aleatorios. No se pueden comprimir, así que se
// mide lo que de verdad viaja por la red.
const PROBE_URL = `${import.meta.env.BASE_URL}network-probe.bin`
// Tope de la medición: si la descarga no ha terminado, se calcula con lo que haya llegado.
const MEASURE_TIMEOUT_MS = 1500
// Antes de medir se espera a que terminen las descargas que la página ya empezó (logo,
// fuentes): se repartirían el ancho de banda con la prueba y saldría más baja de lo real.
// Como mucho este tiempo: en una conexión lenta tardan, y la medición lo notará igual.
const PAGE_DOWNLOADS_WAIT_MS = 1000

let detection = null

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function pageDownloadsDone() {
  const pendingImages = [...document.images]
    .filter((img) => !img.complete)
    .map(
      (img) =>
        new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true })
          img.addEventListener('error', resolve, { once: true })
        }),
    )
  return Promise.all([document.fonts.ready, ...pendingImages])
}

function tierFromMbps(mbps) {
  if (mbps >= NORMAL_MIN_MBPS) return 'normal'
  if (mbps >= MEDIUM_MIN_MBPS) return 'medium'
  return 'low'
}

// Descarga el archivo de prueba sin caché y calcula los Mbps desde que llega la respuesta
// hasta el último byte, así la latencia no cuenta como lentitud. Devuelve null si falla.
function measureMbps() {
  return new Promise((resolve) => {
    const controller = new AbortController()
    let responseAt = null
    let bytes = 0

    const resolveMbps = () => {
      if (responseAt === null) {
        resolve(0)
        return
      }
      const seconds = (performance.now() - responseAt) / 1000
      resolve(seconds > 0 ? (bytes * 8) / seconds / 1e6 : Infinity)
    }

    // Se calcula con lo que haya llegado y se corta la descarga para no quitarle
    // ancho de banda a los fotogramas.
    const timer = setTimeout(() => {
      resolveMbps()
      controller.abort()
    }, MEASURE_TIMEOUT_MS)

    fetch(PROBE_URL, { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        responseAt = performance.now()
        const reader = response.body.getReader()
        for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
          bytes += chunk.value.byteLength
        }
        clearTimeout(timer)
        resolveMbps()
      })
      .catch(() => {
        clearTimeout(timer)
        resolve(null)
      })
  })
}

// Una sola medición por carga de página: en desarrollo StrictMode monta los efectos dos
// veces, y dos descargas de prueba a la vez se repartirían el ancho de banda.
export function detectNetworkTier() {
  if (!detection) {
    const pageSettled = Promise.race([pageDownloadsDone(), delay(PAGE_DOWNLOADS_WAIT_MS)])
    detection = pageSettled.then(measureMbps).then((mbps) => {
      const tier = mbps === null ? FALLBACK_TIER : tierFromMbps(mbps)
      if (import.meta.env.DEV) console.info(`Conexión: ${mbps?.toFixed(1) ?? '?'} Mbps → ${tier}`)
      return tier
    })
  }
  return detection
}
