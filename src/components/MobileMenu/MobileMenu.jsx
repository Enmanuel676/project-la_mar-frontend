import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router'
import { NAV_LINKS } from '../../data/content'
import { createSurface, prefersReducedMotion, renderSurface } from '../../lib/pixelDissolve'
import './MobileMenu.css'

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
      className={`mobile-menu${shown ? ' is-shown' : ''}${open && visible ? ' is-open' : ''}`}
    >
      <div className="mobile-menu__scrim" onClick={onClose} />
      <nav
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        className="mobile-menu__panel"
      >
        <div className="mobile-menu__header">
          <span className="mobile-menu__title">Menú</span>
          <button type="button" aria-label="Cerrar menú" className="mobile-menu__close" onClick={onClose}>
            <span className="mobile-menu__close-icon material-symbols-outlined">close</span>
          </button>
        </div>

        <ul className="mobile-menu__list">
          {NAV_LINKS.map((link, index) => {
            const ref = index === 0 ? firstLinkRef : null
            const content = (
              <>
                <span>{link.label}</span>
                <span className="mobile-menu__link-icon material-symbols-outlined">
                  {link.to ? 'arrow_forward' : 'arrow_outward'}
                </span>
              </>
            )
            return (
              <li key={link.path}>
                {link.to ? (
                  <NavLink ref={ref} className="mobile-menu__link" to={link.to} onClick={onClose}>
                    {content}
                  </NavLink>
                ) : (
                  <a
                    ref={ref}
                    className="mobile-menu__link"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                  >
                    {content}
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        <canvas ref={fxRef} aria-hidden="true" className="mobile-menu__fx" />
      </nav>
    </div>
  )
}

export default MobileMenu
