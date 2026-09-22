import { useCallback, useRef, useState } from 'react'
import { LOGO_URL, NAV_LINKS } from '../data/content'
import MobileMenu from './MobileMenu'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header className="nav-gradient fixed top-0 w-full z-50">
        <div className="h-20 w-full px-margin-mobile md:px-margin flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              alt="La Mar Haute Joaillerie Logo"
              className="h-8 w-auto object-contain text-[0px]"
              src={LOGO_URL}
            />
            <span className="font-headline-md text-headline-md tracking-wider text-on-surface uppercase select-none whitespace-nowrap">
              La Mar
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-space-lg">
            {NAV_LINKS.map((link) => (
              <a
                key={link.path}
                className="font-label-md text-label-md uppercase tracking-[0.14em] text-on-surface-variant hover:text-on-surface transition-colors duration-200"
                data-path={link.path}
                href="#"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-space-md">
            <a
              className="hidden sm:inline-flex items-center px-4 py-2 font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface border border-secondary/40 hover:bg-secondary hover:text-on-secondary transition-colors duration-250"
              data-path="cita-privada"
              href="#"
            >
              Concierge Privé
            </a>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <button
              ref={toggleRef}
              id="menu-toggle"
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="lg:hidden w-9 h-9 -mr-1 flex items-center justify-center rounded-lg text-on-surface hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="material-symbols-outlined text-[26px]">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} returnFocusRef={toggleRef} />
    </>
  )
}

export default Navbar
