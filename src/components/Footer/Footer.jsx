import { LOGO } from '../../data/content'
import './Footer.css'

const ADDRESSES = [
  { name: 'Calle La Mar', street: 'Ave 46 #3506 e/ 35 y 37' },
]

// Cada fila es el nombre de la persona de contacto o uno de sus datos (teléfono, correo).
const CONTACTS = [
  { name: 'Darelis Batista Garrido' },
  { detail: '+53 53126406' },
  { detail: 'darelisbatistag@gmail.com' },
]

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
              Taller de joyería. Reparación de prendas, compra y venta de joyas y tasación de oro,
              con atención personalizada y garantía.
            </p>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Nos Ubicamos en:</h3>
            <ul className="footer__list">
              {ADDRESSES.map((address) => (
                <li key={address.name} className="footer__address">
                  <span className="footer__address-name">{address.name}</span>
                  <span className="footer__address-street">{address.street}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Contáctenos</h3>
            <ul className="footer__list">
              {CONTACTS.map((contact) => (
                <li key={contact.name ?? contact.detail}>
                  {contact.name && <span className="footer__contact-name">{contact.name}</span>}
                  {contact.detail && <span className="footer__contact-detail">{contact.detail}</span>}
                </li>
              ))}
            </ul>
          </div>


        </div>

        <div className="footer__bottom">
          <p>© 2026</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
