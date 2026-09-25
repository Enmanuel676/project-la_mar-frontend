import { CardMeta, PixelCard } from '../../PixelCard/PixelCard'
import './ProvenanceCard.css'

function ProvenanceCard() {
  return (
    <PixelCard className="provenance-card">
      <CardMeta label="01 / Procedencia" code="COL-OCN-01" />
      <h2 className="provenance-card__title">
        Origen y Materia Prima
      </h2>
      <p className="provenance-card__text">
        Nacida en las fallas minerales de Muzo, esta esmeralda natural presenta una rara transparencia
        abisal conocida como «jardín secreto». Montada sobre un cuerpo esculpido en oro rosa 750‰ con
        acabado cepillado a mano, su color verde mar resuena con la calidez cobriza de la aleación de la casa.
      </p>
      <div className="provenance-card__stats">
        <div className="provenance-card__stat">
          <span className="provenance-card__stat-label">Talla</span>
          <span className="provenance-card__stat-value">Cojín 4.2 ct</span>
        </div>
        <div className="provenance-card__stat">
          <span className="provenance-card__stat-label">Aleación</span>
          <span className="provenance-card__stat-value provenance-card__stat-value--accent">Oro Rosa 750‰</span>
        </div>
      </div>
      <div className="provenance-card__cert">
        <span className="provenance-card__cert-icon material-symbols-outlined">verified</span>
        <span className="provenance-card__cert-text">
          Certificación Gemológica GIA nº 22359182
        </span>
      </div>
    </PixelCard>
  )
}

export default ProvenanceCard
