import { LOGO } from '../../data/content'
import './Footer.css'

const SALONS = [
  { name: 'Place Vendôme', address: '12 Place Vendôme, París' },
  { name: 'Barrio de Salamanca', address: 'Calle de Serrano 48, Madrid' },
  { name: 'Madison Avenue', address: '740 Madison Ave, Nueva York' },
]

const CONCIERGE_LINKS = [
  { label: 'Solicitar Consulta Privada', path: 'cita-privada' },
  { label: 'Certificación Gemológica GIA' },
  { label: 'Servicio de Restauración' },
  { label: 'contact@lamar-joaillerie.com' },
]

const LEGAL_LINKS = ['Aviso Legal', 'Privacidad', 'Deontología RJC']

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__column">
            <div className="footer__brand">
              <img alt="Logotipo de La Mar Alta Joyería" className="footer__logo" src={LOGO} />
            </div>
            <p className="footer__tagline">
              Alta Joyería y Gemas Raras. Piezas únicas forjadas a mano por nuestros maestros
              joyeros bajo la luminiscencia de los abismos.
            </p>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Salones y Vitrinas</h3>
            <ul className="footer__list">
              {SALONS.map((salon) => (
                <li key={salon.name} className="footer__salon">
                  <span className="footer__salon-name">{salon.name}</span>
                  <span className="footer__salon-address">{salon.address}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Conserjería Privada</h3>
            <ul className="footer__list">
              {CONCIERGE_LINKS.map((link) => (
                <li key={link.label}>
                  <a className="footer__link" data-path={link.path} href="#">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">La Gaceta de los Joyeros</h3>
            <p className="footer__text">
              Acceda a las vistas previas de nuestras adquisiciones de gemas antes de su presentación
              pública.
            </p>
            <div className="footer__newsletter">
              <input
                type="email"
                aria-label="Correo electrónico"
                placeholder="Tu correo electrónico"
                className="footer__input"
              />
              <button type="button" className="footer__submit">
                Unirse
              </button>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2024 Taller La Mar Alta Joyería. Todos los derechos reservados.</p>
          <div className="footer__legal">
            {LEGAL_LINKS.map((label) => (
              <a key={label} className="footer__legal-link" href="#">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
