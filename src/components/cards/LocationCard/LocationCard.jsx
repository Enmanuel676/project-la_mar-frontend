import { CardMeta, PixelCard } from '../../PixelCard/PixelCard'
import './LocationCard.css'

function LocationCard() {
  return (
    <PixelCard className="location-card">
      <CardMeta label="03 / Ubicación" code="NUESTRO TALLER" />
      <div className="location-card__map-container">
        <iframe
          title="Ubicación del taller en Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5891.109862281062!2d-80.45269224970801!3d22.141176902788047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f2b39000a7de56f%3A0xd71c0821e759be81!2sLA%20MAR%20Joyer%C3%ADa!5e0!3m2!1ses-419!2sus!4v1791974902555!5m2!1ses-419!2sus"
          className="location-card__map-iframe"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="location-card__body">
        <h3 className="location-card__title">Visita Nuestro Taller</h3>
        <p className="location-card__text">
          Acceso directo a nuestra ubicación. Encuéntranos para atención personalizada, tasación y asesoría.
        </p>
      </div>
    </PixelCard>
  )
}

export default LocationCard
