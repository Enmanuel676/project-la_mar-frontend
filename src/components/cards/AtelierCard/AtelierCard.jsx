import { ATELIER_IMAGE } from '../../../data/content'
import { CardMeta, PixelCard } from '../../PixelCard/PixelCard'
import './AtelierCard.css'

const TAGS = [
  { label: 'Acabado Arenado', accent: true },
  { label: 'Engaste Descendente' },
  { label: 'Contraste del Maestro' },
]

function AtelierCard() {
  return (
    <PixelCard className="atelier-card">
      <CardMeta label="03 / Oficio Artesanal" code="TALLER PLACE VENDÔME" />
      <div className="atelier-card__media">
        <img
          alt="Oficio en el banco de trabajo del maestro joyero"
          className="atelier-card__image"
          src={ATELIER_IMAGE}
        />
        <div className="atelier-card__badge">
          <span className="atelier-card__badge-text">
            120 Horas de Engaste
          </span>
        </div>
      </div>
      <div className="atelier-card__body">
        <h3 className="atelier-card__title">El Oficio en el Taller</h3>
        <p className="atelier-card__text">
          Cada garra escultórica se vacía bajo lupa binocular para maximizar la entrada de luz en la
          piedra. El engaste micropavé lateral se realiza con buril de acero templado según las
          tradiciones de la joyería francesa del siglo XVIII.
        </p>
      </div>
      <div className="atelier-card__tags">
        {TAGS.map((tag) => (
          <span
            key={tag.label}
            className={`atelier-card__tag${tag.accent ? ' atelier-card__tag--accent' : ''}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </PixelCard>
  )
}

export default AtelierCard
