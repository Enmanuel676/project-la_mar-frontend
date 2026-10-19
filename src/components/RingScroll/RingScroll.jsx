import { useLayoutEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/pixelDissolve'
import { ringFrames } from '../../lib/ringFrames'
import AboutMeCard from '../cards/AboutMeCard/AboutMeCard'
import CraftCard from '../cards/CraftCard/CraftCard'
import LocationCard from '../cards/LocationCard/LocationCard'
import AppraisalCard from '../cards/AppraisalCard/AppraisalCard'
import './RingScroll.css'

// Constante de tiempo (ms) con la que el anillo alcanza al scroll. Al contar en tiempo
// y no en frames, el giro va suave a 60 o a 120 Hz, con respuesta ágil sin desfase notable.
const SMOOTHING_MS = 45
// Dos fotogramas listos más separados que esto (mientras se descargan los de en medio) no se
// mezclan para evitar doble silueta: se muestra el más cercano.
const MAX_BLEND_GAP = 4

/**
 * Fondo "ring scroll": el anillo gira según el scroll de la sección, con las
 * tarjetas de información flotando encima. En lugar de mover el tiempo de un
 * <video> (cada salto obliga a buscar y decodificar, y en móviles se traba),
 * se dibuja en un canvas el fotograma que toca de una secuencia de imágenes
 * ya decodificadas, fundido con el siguiente según la posición exacta: el giro
 * avanza continuo entre fotograma y fotograma. La secuencia es la versión que
 * Inicio eligió según la velocidad de conexión (ringFrames.selectTier) antes de
 * montar este componente.
 */
function RingScroll() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const glintRef = useRef(null)

  // useLayoutEffect: el primer fotograma se dibuja antes de que el navegador pinte.
  useLayoutEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const glint = glintRef.current
    const ctx = canvas.getContext('2d')
    const count = ringFrames.getCount()
    const smoothing = prefersReducedMotion() ? 0 : SMOOTHING_MS
    let frameId = null
    let drawnKey = null
    let lastProgress = null
    let sectionVisible = false

    // Métricas del scroll cacheadas para evitar layout thrashing (getBoundingClientRect) en cada frame
    let sectionTop = 0
    let scrollableHeight = 1

    const updateMetrics = () => {
      if (!section || !canvas) return
      const rect = section.getBoundingClientRect()
      sectionTop = rect.top + window.scrollY
      scrollableHeight = Math.max(1, section.offsetHeight - window.innerHeight)
      ringFrames.setView(canvas.clientWidth, canvas.clientHeight)
    }

    let resizeTimer = null
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(updateMetrics, 150)
    })
    updateMetrics()
    resizeObserver.observe(canvas)
    window.addEventListener('resize', updateMetrics, { passive: true })

    const getScrollProgress = () => {
      if (scrollableHeight <= 0) return 0
      return Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollableHeight))
    }

    // Posición objetivo en fotogramas (con decimales), según el scroll.
    const getTarget = () => getScrollProgress() * (count - 1)

    // Fotograma listo más cercano a `position` (-1 si aún no hay ninguno).
    const nearest = (position) => {
      const [below, above] = ringFrames.neighbors(position)
      if (below === -1 || above === -1) return below === -1 ? above : below
      return position - below <= above - position ? below : above
    }

    // Dibuja la posición `position`: fotograma base y, si los vecinos están listos,
    // fundido lineal continuo sin cortes bruscos por velocidad ni escalones perceptibles.
    const draw = (position) => {
      const [below, above] = ringFrames.neighbors(position)
      const gap = above - below
      let base = nearest(position)
      let top = -1
      let mix = 0

      if (below !== -1 && above !== -1 && gap > 0 && gap <= MAX_BLEND_GAP) {
        mix = (position - below) / gap
        base = below
        if (mix > 0.005) top = above
      }

      if (base === -1) return

      // Clave con precisión de 128 pasos para evitar redibujados innecesarios con la página quieta
      const mixKey = top === -1 ? 0 : Math.round(mix * 128) / 128
      const key = `${ringFrames.getVersion()}:${base}:${top}:${mixKey}`
      if (key === drawnKey) return
      drawnKey = key

      const crop = ringFrames.getCrop()
      if (crop && (canvas.width !== crop.width || canvas.height !== crop.height)) {
        canvas.width = crop.width
        canvas.height = crop.height
      }

      const baseImg = ringFrames.get(base)
      if (!baseImg) return

      ctx.globalAlpha = 1
      ctx.drawImage(baseImg, 0, 0)

      if (top !== -1 && mix > 0.005) {
        const topImg = ringFrames.get(top)
        if (topImg) {
          ctx.globalAlpha = mix
          ctx.drawImage(topImg, 0, 0)
        }
      }
    }

    // Versión low: una imagen fija, sin scroll motion.
    if (count === 1) {
      ringFrames.load(0)
      draw(0)
      const unsubscribe = ringFrames.subscribe(() => draw(0))
      return () => {
        unsubscribe()
        resizeObserver.disconnect()
        window.removeEventListener('resize', updateMetrics)
        clearTimeout(resizeTimer)
      }
    }

    let current = getTarget()
    let lastTime = null
    ringFrames.load(Math.round(current))
    draw(current)

    const unsubscribeFrames = ringFrames.subscribe(() => {
      if (!frameId && sectionVisible) draw(current)
    })

    const tick = (now) => {
      const target = getTarget()
      const elapsed = lastTime === null ? 0 : now - lastTime
      lastTime = now

      current = smoothing ? current + (target - current) * (1 - Math.exp(-elapsed / smoothing)) : target
      if (Math.abs(target - current) < 0.005) {
        current = target
      }

      draw(current)

      // Brillo continuo a lo largo del scroll sin saltos de ángulo
      const progress = count > 1 ? current / (count - 1) : 0
      if (progress !== lastProgress) {
        lastProgress = progress
        glint.style.transform = `translate3d(${(-60 * progress).toFixed(2)}%, 0, 0)`
      }

      // El bucle solo sigue corriendo mientras la posición no se haya estabilizado
      if (Math.abs(target - current) > 0.001) {
        frameId = requestAnimationFrame(tick)
      } else {
        frameId = null
      }
    }

    const startTick = () => {
      if (!frameId && sectionVisible) {
        lastTime = performance.now()
        frameId = requestAnimationFrame(tick)
      }
    }

    window.addEventListener('scroll', startTick, { passive: true })

    const observer = new IntersectionObserver(
      ([entry]) => {
        sectionVisible = entry.isIntersecting
        if (sectionVisible) {
          updateMetrics()
          current = getTarget()
          draw(current)
          startTick()
        } else if (frameId) {
          cancelAnimationFrame(frameId)
          frameId = null
        }
      },
      { rootMargin: '25% 0px' },
    )
    observer.observe(section)

    return () => {
      unsubscribeFrames()
      if (frameId) cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', startTick)
      window.removeEventListener('resize', updateMetrics)
      observer.disconnect()
      resizeObserver.disconnect()
      clearTimeout(resizeTimer)
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
          <AboutMeCard />
        </div>
        <div className="ring-scroll__slot ring-scroll__slot--end">
          <CraftCard />
        </div>
        <div className="ring-scroll__slot ring-scroll__slot--start">
          <LocationCard />
        </div>
        <div className="ring-scroll__slot ring-scroll__slot--end">
          <AppraisalCard />
        </div>
      </div>
    </section>
  )
}

export default RingScroll
