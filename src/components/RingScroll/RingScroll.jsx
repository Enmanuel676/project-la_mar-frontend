import { useLayoutEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/pixelDissolve'
import { ringFrames } from '../../lib/ringFrames'
import AboutMeCard from '../cards/AboutMeCard/AboutMeCard'
import CraftCard from '../cards/CraftCard/CraftCard'
import LocationCard from '../cards/LocationCard/LocationCard'
import AppraisalCard from '../cards/AppraisalCard/AppraisalCard'
import './RingScroll.css'

// Constante de tiempo (ms) con la que el anillo alcanza al scroll. Al contar en tiempo
// y no en frames, el giro va igual de suave a 60 o a 120 Hz, y sin acelerones cuando
// el móvil se salta un frame.
const SMOOTHING_MS = 85
// Dos fotogramas listos más separados que esto (aún se descargan los de en medio) no se
// mezclan, porque se vería el anillo doble: se muestra solo el más cercano.
const MAX_BLEND_GAP = 4
// Con el scroll quieto este tiempo, el anillo se asienta en un fotograma exacto.
const SETTLE_MS = 150

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
    let lastAngle = null

    // El tamaño del escenario decide cómo se guardan los fotogramas (ringFrames.setView).
    // Cambia al girar el móvil: se avisa cuando termina de cambiar.
    const updateView = () => ringFrames.setView(canvas.clientWidth, canvas.clientHeight)
    let resizeTimer = null
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(updateView, 150)
    })
    updateView()
    resizeObserver.observe(canvas)

    const getScrollProgress = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      return scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / scrollable))
    }

    // Posición objetivo en fotogramas (con decimales), según el scroll.
    const getTarget = () => getScrollProgress() * (count - 1)

    // Fotograma listo más cercano a `position` (-1 si aún no hay ninguno).
    const nearest = (position) => {
      const [below, above] = ringFrames.neighbors(position)
      if (below === -1 || above === -1) return below === -1 ? above : below
      return position - below <= above - position ? below : above
    }

    // Dibuja la posición `position` (en fotogramas, con decimales): el fotograma listo
    // de debajo y, encima, el de arriba con la opacidad que le toca. Mientras se
    // descargan los de en medio se muestra el más cercano ya listo. Solo se funden si
    // el giro avanza menos que el hueco entre ellos en cada frame (`movement`): más
    // rápido ya cambia de fotograma en cada frame, y fundir obligaría a decodificar
    // dos <img> nuevos por frame en escritorio.
    const draw = (position, movement = 0) => {
      const [below, above] = ringFrames.neighbors(position)
      const gap = above - below
      let base = nearest(position)
      let top = -1
      let mix = 0
      if (below !== -1 && above !== -1 && gap > 0 && gap <= MAX_BLEND_GAP && movement < gap) {
        // En 64 pasos: no se redibuja por diferencias que no se ven.
        mix = Math.round(((position - below) / gap) * 64) / 64
        base = mix === 1 ? above : below
        if (mix > 0 && mix < 1) top = above
      }
      if (base === -1) return
      const key = `${ringFrames.getVersion()}:${base}:${top}:${top === -1 ? 0 : mix}`
      if (key === drawnKey) return
      drawnKey = key

      const crop = ringFrames.getCrop()
      if (canvas.width !== crop.width || canvas.height !== crop.height) {
        canvas.width = crop.width
        canvas.height = crop.height
      }
      ctx.globalAlpha = 1
      ctx.drawImage(ringFrames.get(base), 0, 0)
      if (top !== -1) {
        ctx.globalAlpha = mix
        ctx.drawImage(ringFrames.get(top), 0, 0)
      }
    }

    // Versión low: una imagen fija, sin scroll motion. Se dibuja en cuanto llega
    // (o antes del primer pintado, si ya estaba en memoria) y otra vez si se rehace.
    if (count === 1) {
      ringFrames.load(0)
      draw(0)
      const unsubscribe = ringFrames.subscribe(() => draw(0))
      return () => {
        unsubscribe()
        resizeObserver.disconnect()
        clearTimeout(resizeTimer)
      }
    }

    // Si los fotogramas ya estaban en memoria (se vuelve de otra página), el
    // anillo aparece dibujado desde el primer pintado.
    let current = getTarget()
    let lastTime = null
    let lastTarget = null
    let movedAt = 0
    ringFrames.load(Math.round(current))
    draw(current)
    const unsubscribeFrames = ringFrames.subscribe(() => draw(current))

    const tick = (now) => {
      let target = getTarget()
      if (target !== lastTarget) {
        lastTarget = target
        movedAt = now
      } else if (now - movedAt > SETTLE_MS) {
        // Quieto: se asienta en un fotograma exacto en vez de en la mezcla de dos.
        const settled = nearest(target)
        if (settled !== -1) target = settled
      }
      const elapsed = lastTime === null ? 0 : now - lastTime
      lastTime = now
      const previous = current
      current = smoothing ? current + (target - current) * (1 - Math.exp(-elapsed / smoothing)) : target
      if (Math.abs(target - current) < 0.01) current = target
      draw(current, Math.abs(current - previous))

      // Solo se escribe en el DOM cuando el ángulo cambia de verdad.
      const angle = ((current / count) * 360) % 360
      if (angle !== lastAngle) {
        lastAngle = angle
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
          lastTime = null
          frameId = requestAnimationFrame(tick)
        }
      },
      { rootMargin: '25% 0px' },
    )
    observer.observe(section)

    return () => {
      unsubscribeFrames()
      cancelAnimationFrame(frameId)
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
