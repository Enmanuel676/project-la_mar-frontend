import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/pixelDissolve'
import { ringAngle } from '../lib/ringAngle'
import AtelierCard from './cards/AtelierCard'
import PresenceCard from './cards/PresenceCard'
import ProvenanceCard from './cards/ProvenanceCard'
import SpecsCard from './cards/SpecsCard'

// BASE_URL respeta el `base` de vite.config.js (necesario en GitHub Pages).
const VIDEO_SRC = `${import.meta.env.BASE_URL}ring-scroll.mp4`

/**
 * Video de fondo "ring scroll": el anillo gira según el scroll de la sección
 * (el tiempo del video se mueve con el scroll en vez de reproducirse solo),
 * con las tarjetas de información flotando encima.
 */
function RingScrollVideo() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const glintRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    const glint = glintRef.current
    const instant = prefersReducedMotion()
    let current = 0
    let frameId = null
    let blobUrl = null
    let cancelled = false

    // Cargar el video completo en memoria hace que saltar de un frame a otro
    // sea inmediato (sin peticiones de rango al servidor en cada seek).
    fetch(VIDEO_SRC)
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(res.statusText))))
      .then((blob) => {
        if (cancelled) return
        const time = video.currentTime
        blobUrl = URL.createObjectURL(blob)
        video.src = blobUrl
        video.currentTime = time
      })
      .catch(() => {})

    const getDuration = () =>
      Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 10

    const getScrollProgress = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      return scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / scrollable))
    }

    // Si el usuario eligió una faceta, manda ese ángulo; si no, el scroll.
    const getTargetTime = () => {
      const manual = ringAngle.getManual()
      return manual === null
        ? getScrollProgress() * (getDuration() - 0.05)
        : (manual / 360) * getDuration()
    }

    const tick = () => {
      const target = getTargetTime()
      current += (target - current) * (instant ? 1 : 0.18)
      if (Math.abs(target - current) < 0.001) current = target

      if (!video.seeking && video.readyState >= 1 && Math.abs(video.currentTime - current) > 1 / 60) {
        video.currentTime = current
      }

      const angle = ((current / getDuration()) * 3git reset --soft HEAD~160) % 360
      ringAngle.set(angle)
      glint.style.setProperty('--glint', `${(100 - (angle / 360) * 100).toFixed(1)}%`)

      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)

    const onScroll = () => ringAngle.clearManual()
    window.addEventListener('scroll', onScroll, { passive: true })

    // iOS Safari no deja mover currentTime hasta un play() iniciado por el usuario.
    const unlock = () => {
      video
        .play()
        ?.then(() => video.pause())
        .catch(() => {})
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('touchstart', unlock, { passive: true })

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', unlock)
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full min-h-[300vh] md:min-h-[380vh] px-margin-mobile md:px-margin"
    >
      <div className="sticky top-20 h-[calc(100svh-5rem)] w-screen ml-[calc(50%-50vw)] pointer-events-none">
        <div className="ring-video-frame absolute inset-0">
          <video
            ref={videoRef}
            aria-label="Bague L'Abysse Vert en rotation - Haute Joaillerie"
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            src={VIDEO_SRC}
          />
          <div ref={glintRef} className="ring-video-glint absolute inset-0 pointer-events-none" />
        </div>
      </div>

      <div className="relative z-30 pointer-events-none -mt-[calc(100svh-5rem)] pt-[45svh] md:pt-0 flex flex-col gap-y-[30svh] md:gap-y-72 pb-[30svh] md:pb-64">
        <div className="w-full flex justify-center md:justify-start">
          <ProvenanceCard />
        </div>
        <div className="w-full flex justify-center md:justify-end">
          <PresenceCard />
        </div>
        <div className="w-full flex justify-center md:justify-start">
          <AtelierCard />
        </div>
        <div className="w-full flex justify-center md:justify-end">
          <SpecsCard />
        </div>
      </div>
    </section>
  )
}

export default RingScrollVideo
