import { PRESENCE_IMAGE } from '../../../data/content'
import { CardMeta, PixelCard } from '../../PixelCard/PixelCard'
import './PresenceCard.css'

function PresenceCard() {
  return (
    <PixelCard className="presence-card">
      <CardMeta label="02 / En Escena" code="RETRATO DE SALÓN" accent="secondary" />
      <div className="presence-card__media">
        <img
          alt="Porte y Presencia - Modelo luciendo el anillo de alta joyería"
          className="presence-card__image"
          src={PRESENCE_IMAGE}
        />
        <div className="presence-card__shade" />
        <div className="presence-card__caption">
          <p className="presence-card__quote">
            «Una presencia magnética donde el fuego de la joya late al compás de la muñeca.»
          </p>
        </div>
      </div>
      <div className="presence-card__body">
        <h3 className="presence-card__title">Porte y Presencia</h3>
        <p className="presence-card__text">
          Concebido para capturar la luz rasante de una noche de gala o la intimidad serena de un salón
          privado. Su equilibrio ergonómico garantiza un asiento perfecto en el dedo, sin que se ladee.
        </p>
      </div>
    </PixelCard>
  )
}

export default PresenceCard
