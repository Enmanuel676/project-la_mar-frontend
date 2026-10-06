import { useEffect, useState } from 'react'
import FacetsGallery from '../../components/FacetsGallery/FacetsGallery'
import PageLoader from '../../components/PageLoader/PageLoader'
import PrivateSalon from '../../components/PrivateSalon/PrivateSalon'
import ProductHeader from '../../components/ProductHeader/ProductHeader'
import RingScrollVideo from '../../components/RingScrollVideo/RingScrollVideo'
import { ATELIER_IMAGE, PRESENCE_IMAGE } from '../../data/content'
import { detectNetworkTier } from '../../lib/networkTier'
import { ringFrames } from '../../lib/ringFrames'
import './Home.css'

const HOME_KEY_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQXIsmsDfPF-ZURNG1rSt_Tbk6Ju2nWt3AVi7J9YywoIimiLEnsRSM8UdgWQ6eVG2qPc8KR_JJK513_EsBPC_lC8d7hb8lBUzMJYbjAW230XB6FIj_HKc8J8o7ctTBgH44PGKGtWUHaAxnZxL6_RpXoFXtcRx5pHwGgiaL90nEsSSX5Xh_suNx6h6-Yr-z5GZW-lH1nuJeMLw6kaO3N7bLZzVm16yzY1rKYSKos1-Gk7uVqABGf3hucAODP5NfApJQXA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBeZtz4sNGF2MLUE8fUkKTI49hqQq6FvsgS2EYC1dVomUsaSY7HnFI6902DNjY3wNibjqGnIup5Z5QUf00e3F38vnyCz-DNN1is6MTICn3RjnA0ctX8zomQ7G0KjQlUhrq1QcknIm6EiAZyHxIlV10WIo5-TvTuievaXK_KVmB6hxNX7uPHhoJwX6fyr-gSieTUOGyHscixovwK5_fl3JkqLkWDw_qHl1FyI7CdQ37tHz1K1LjsID68P__Id5oVe0Aetg',
  ATELIER_IMAGE,
  PRESENCE_IMAGE,
]

// El cargador se quita en cuanto todo está listo. Si no, a los 3 s, siempre que el
// anillo ya tenga lo mínimo para verse bien; si aún no lo tiene se espera por él, como
// mucho hasta los 6 s (lo que falte se sigue descargando con la página ya visible).
const LOADER_DEFAULT_MS = 3000
const LOADER_MAX_MS = 6000
// Lo mínimo: uno de cada cuatro fotogramas. Se descargan de grueso a fino, así que con
// eso la animación ya se recorre entera.
const MIN_FRAMES = 1 / 4

function preloadImages(urls) {
  return Promise.all(
    urls.map((url) => {
      if (!url) return Promise.resolve()
      return new Promise((resolve) => {
        const img = new Image()
        img.src = url
        if (img.complete) {
          resolve()
        } else {
          img.onload = () => resolve()
          img.onerror = () => resolve()
        }
      })
    }),
  )
}

function documentReady() {
  return document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))
}

// Página de inicio (landing): presentación del anillo con el video por scroll.
function Home() {
  const [tier, setTier] = useState(() => ringFrames.getTier())
  // Al volver a Inicio con el anillo ya en memoria no hace falta el cargador.
  const [isLoading, setIsLoading] = useState(() => !ringFrames.isLoaded(MIN_FRAMES))

  useEffect(() => {
    let cancelled = false
    const timers = []
    const wait = (ms) => new Promise((resolve) => timers.push(setTimeout(resolve, ms)))
    const hideLoader = () => {
      if (!cancelled) setIsLoading(false)
    }

    wait(LOADER_MAX_MS).then(hideLoader)
    const defaultTimeUp = wait(LOADER_DEFAULT_MS)

    // Mientras se ve el cargador se mide la conexión y, con el primer resultado, se
    // descarga la versión del anillo que le corresponde.
    detectNetworkTier().then((detected) => {
      if (cancelled) return
      ringFrames.selectTier(detected)
      setTier(detected)
      Promise.race([
        // Todo listo: el anillo completo, la página y las imágenes clave.
        Promise.all([ringFrames.whenReady(), documentReady(), preloadImages(HOME_KEY_IMAGES)]),
        // Pasaron los 3 s y el anillo ya tiene lo mínimo.
        Promise.all([defaultTimeUp, ringFrames.whenReady(MIN_FRAMES)]),
      ]).then(hideLoader)
    })

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <ProductHeader />
      {/* Lo que descarga imágenes se monta después de medir: esas descargas le quitarían
          ancho de banda a la medición y saldría más baja de lo real. */}
      {tier && (
        <>
          <RingScrollVideo />
          <FacetsGallery />
          <PrivateSalon />
        </>
      )}
    </>
  )
}

export default Home
