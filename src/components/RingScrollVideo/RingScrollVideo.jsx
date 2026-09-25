import { useLayoutEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/pixelDissolve'
import { ringAngle } from '../../lib/ringAngle'
import { FRAME_COUNT, ringFrames } from '../../lib/ringFrames'
import AtelierCard from '../cards/AtelierCard/AtelierCard'
import PresenceCard from '../cards/PresenceCard/PresenceCard'
import ProvenanceCard from '../cards/ProvenanceCard/ProvenanceCard'
import SpecsCard from '../cards/SpecsCard/SpecsCard'
import './RingScrollVideo.css'

/**
 * Fondo "ring scroll": el anillo gira según el scroll de la sección, con las
 * tarjetas de información flotando encima. En lugar de mover el tiempo de un
 * <video> (cada salto obliga a buscar y decodificar, y en móviles se traba),
 * se dibuja en un canvas el fotograma que toca de una secuencia de imágenes
 * ya decodificadas.
 */
function RingScrollVideo() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const glintRef = useRef(null)

  // useLayoutEffect: el primer fotograma se dibuja antes de que el navegador pinte.
  useLayoutEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const glint = glintRef.current
    const ctx = canvas.getContext('2d')
    const ease = prefersReducedMotion() ? 1 : 0.18
    let frameId = null
    let drawn = -1
    let lastAngle = null

    const getScrollProgress = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      return scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / scrollable))
    }

    // Si el usuario eligió una faceta, manda ese ángulo; si no, el scroll.
    // Devuelve la posición en fotogramas (con decimales).
    const getTarget = () => {
      const manual = ringAngle.getManual()
      return manual === null
        ? getScrollProgress() * (FRAME_COUNT - 1)
        : (manual / 360) * FRAME_COUNT
    }

    // Mientras el fotograma pedido se descarga se muestra el más cercano ya listo.
    const draw = (index) => {
      const ready = ringFrames.nearestReady(index)
      if (ready === -1 || ready === drawn) return
      const img = ringFrames.get(ready)
      if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
      }
      ctx.drawImage(img, 0, 0)
      drawn = ready
    }

    // Si los fotogramas ya estaban en memoria (se vuelve de otra página), el
    // anillo aparece dibujado desde el primer pintado.
    let current = getTarget()
    ringFrames.load(Math.round(current))
    draw(Math.round(current))

    const tick = () => {
      const target = getTarget()
      current += (target - current) * ease
      if (Math.abs(target - current) < 0.01) current = target
      draw(Math.round(current))

      // Solo se escribe en el DOM cuando el ángulo cambia de verdad.
      const angle = ((current / FRAME_COUNT) * 360) % 360
      if (angle !== lastAngle) {
        lastAngle = angle
        ringAngle.set(angle)
        // Mover el brillo con transform lo deja en la GPU, sin repintar cada frame.
        glint.style.transform = `translate3d(${(-60 * (1 - angle / 360)).toFixed(2)}%, 0, 0)`
      }

      frameId = requestAnimationFrame(tick)
    }

    // El bucle solo corre mientras la sección está cerca de la pantalla; al
    // volver se coloca directamente en su sitio en vez de girar hasta él.
    const observer = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frameId)
        frameId = null
        if (entry.isIntersecting) {
          current = getTarget()
          frameId = requestAnimationFrame(tick)
        }
      },
      { rootMargin: '25% 0px' },
    )
    observer.observe(section)

    const onScroll = () => ringAngle.clearManual()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="ring-scroll"
    >
      <div className="ring-scroll__stage">
        <div className="ring-scroll__frame">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Anillo El Abismo Verde en rotación - Alta Joyería"
            className="ring-scroll__canvas"
          />
          <div ref={glintRef} className="ring-scroll__glint" />
        </div>
      </div>

      <div className="ring-scroll__cards">
        <div className="ring-scroll__slot ring-scroll__slot--start">
          <ProvenanceCard />
        </div>
        <div className="ring-scroll__slot ring-scroll__slot--end">
          <PresenceCard />
        </div>
        <div className="ring-scroll__slot ring-scroll__slot--start">
          <AtelierCard />
        </div>
        <div className="ring-scroll__slot ring-scroll__slot--end">
          <SpecsCard />
        </div>
      </div>
    </section>
  )
}

export default RingScrollVideo
