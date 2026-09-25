import { useCallback, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { LOGO, NAV_LINKS } from '../../data/content'
import MobileMenu from '../MobileMenu/MobileMenu'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo" aria-label="Ir al inicio">
            <img alt="Logotipo de La Mar" src={LOGO} />
          </Link>

          {/* NavLink añade la clase "active" al enlace de la página actual */}
          <nav className="navbar__links">
            {NAV_LINKS.map((link) =>
              link.to ? (
                <NavLink key={link.path} to={link.to} className="navbar__link">
                  {link.label}
                </NavLink>
              ) : (
                <a
                  key={link.path}
                  className="navbar__link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>

          <div className="navbar__actions">
            <button
              ref={toggleRef}
              id="menu-toggle"
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="navbar__toggle"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="navbar__toggle-icon material-symbols-outlined">
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
