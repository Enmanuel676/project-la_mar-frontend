import { CardMeta, PixelCard } from '../../PixelCard/PixelCard'
import './AboutMeCard.css'

function AboutMeCard() {
  return (
    <PixelCard className="about-me-card">
      <CardMeta label="01 / Sobre mí" code="TALLER LA MAR" />
      <h2 className="about-me-card__title">
        Darelis Batista
      </h2>
      <p className="about-me-card__text">
Joyera con más de 35 años de experiencia en el oficio, establecida en este taller desde 2011 pero dedicada desde 2005, sumando más de 20 años de labor y trabajo  continuo . Mi labor se enfoca principalmente en la reparación experta de todo tipo de prendas de oro y plata, limpieza y tasado, así como en la compra y venta de joyas, además de la compra de piezas como chatarra de oro y plata , con un servicio de máxima confianza y seriedad.
      </p>
      <div className="about-me-card__stats">
        <div className="about-me-card__stat">
          <span className="about-me-card__stat-label">Experiencia</span>
          <span className="about-me-card__stat-value">+35 Años</span>
        </div>
        <div className="about-me-card__stat">
          <span className="about-me-card__stat-label">En este taller</span>
          <span className="about-me-card__stat-value">Desde 2011</span>
        </div>
      </div>
      <div className="about-me-card__guarantee">
        <span className="about-me-card__guarantee-icon material-symbols-outlined">verified</span>
        <span className="about-me-card__guarantee-text">
          Reparación, Compra y Venta con Garantía
        </span>
      </div>
    </PixelCard>
  )
}

export default AboutMeCard
