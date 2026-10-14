import './ContactCta.css'
import { WHATSAPP_URL } from '../../data/content'
function ContactCta() {
  return (
    <section className="contact-cta">
      <div className="contact-cta__inner">
        <span className="contact-cta__kicker">
          Taller Privado La Mar
        </span>
        <h2 className="contact-cta__title">La Mar</h2>
        <p className="contact-cta__text">
          Repara, tasa, compra o vende tus prendas con atención personalizada, confianza y la
          seriedad de un oficio de toda la vida.
        </p>
        <div className="contact-cta__actions">
          <a
            className="contact-cta__button contact-cta__button--primary"
            href={WHATSAPP_URL}
          >
            Contactar por WhatsApp
          </a>

        </div>
      </div>
    </section>
  )
}

export default ContactCta
