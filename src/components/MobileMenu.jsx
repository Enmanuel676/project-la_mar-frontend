import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NAV_LINKS } from '../data/content'
import { createSurface, prefersReducedMotion, renderSurface } from '../lib/pixelDissolve'

const ANIMATION_MS = 520

function MobileMenu({ open, onClose, returnFocusRef }) {
  const panelRef = useRef(null)
  const fxRef = useRef(null)
  const firstLinkRef = useRef(null)
  const anim = useRef({ surface: null, progress: 0, target: 0, raf: null, last: 0 })
  const [prevOpen, setPrevOpen] = useState(open)
  const [closing, setClosing] = useState(false)
  const [visible, setVisible] = useState(false)

  // Al cerrarse, el panel sigue montado hasta terminar la animación de salida.
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (!open) setClosing(true)
  }
  const shown = open || closing

  useEffect(() => {
    const state = anim.current
    state.surface = createSurface(panelRef.current, fxRef.current, { fromTop: true })
    return () => {
      cancelAnimationFrame(state.raf)
      state.raf = null
    }
  }, [])

  const animateTo = useCallback((target) => {
    const state = anim.current
    state.target = target
    const finish = () => {
      if (state.target === 0) {
        setClosing(false)
        setVisible(false)
      }
    }

    if (prefersReducedMotion()) {
      state.progress = target
      renderSurface(state.surface, target)
      finish()
      return
    }
    if (state.raf) return

    state.last = 0
    const step = (now) => {
      const dt = state.last ? now - state.last : 16
      state.last = now
      const direction = state.target > state.progress ? 1 : -1
      state.progress = Math.min(1, Math.max(0, state.progress + (direction * dt) / ANIMATION_MS))
      renderSurface(state.surface, state.progress)
      if (state.progress !== state.target) {
        state.raf = requestAnimationFrame(step)
        return
      }
      state.raf = null
      finish()
    }
    state.raf = requestAnimationFrame(step)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    if (anim.current.progress === 0) renderSurface(anim.current.surface, 0)
    const frame = requestAnimationFrame(() => setVisible(true))
    animateTo(1)
    firstLinkRef.current?.focus({ preventScroll: true })
    return () => cancelAnimationFrame(frame)
  }, [open, animateTo])

  useEffect(() => {
    if (open || anim.current.target !== 1) return
    animateTo(0)
    returnFocusRef.current?.focus({ preventScroll: true })
  }, [open, animateTo, returnFocusRef])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onResize = (event) => event.matches && onClose()
    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onResize)
    }
  }, [open, onClose])

  return (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      className={`menu-overlay fixed inset-0 z-40 items-center justify-center px-margin-mobile ${
        shown ? 'flex' : 'hidden'
      }${open && visible ? ' is-open' : ''}`}
    >
      <div className="menu-scrim absolute inset-0" onClick={onClose} />
      <nav
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        className="pixel-panel relative w-full max-w-sm bg-surface-container-low/70 backdrop-blur-[6px] rounded-xl shadow-2xl p-space-lg"
      >
        <div className="flex items-center justify-between mb-space-md">
          <span className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-primary">
            Menú
          </span>
          <button
            type="button"
            aria-label="Cerrar menú"
            className="w-9 h-9 -mr-2 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <ul className="space-y-1">
          {NAV_LINKS.map((link, index) => (
            <li key={link.path}>
              <a
                ref={index === 0 ? firstLinkRef : null}
                className="menu-link"
                data-path={link.path}
                href="#"
                onClick={onClose}
              >
                <span>{link.label}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </li>
          ))}
        </ul>

        <a
          className="mt-space-lg w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-[0.14em] rounded-lg shadow-lg hover:bg-primary-container transition-colors"
          data-path="cita-privada"
          href="#"
          onClick={onClose}
        >
          <span>Concierge Privé</span>
          <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
        </a>

        <canvas ref={fxRef} aria-hidden="true" className="pixel-fx" />
      </nav>
    </div>
  )
}

export default MobileMenu
