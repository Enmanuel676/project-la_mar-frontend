import { CRAFT_IMAGE } from '../../../data/content'
import { CardMeta, PixelCard } from '../../PixelCard/PixelCard'
import './CraftCard.css'

function CraftCard() {
  return (
    <PixelCard className="craft-card">
      <CardMeta label="02 / En el Taller" code="EL OFICIO" accent="secondary" />
      <div className="craft-card__media">
        <img
          alt="Darelis Batista trabajando una pieza en el taller La Mar"
          className="craft-card__image"
          src={CRAFT_IMAGE}
        />
        <div className="craft-card__shade" />
        <div className="craft-card__caption">
          <p className="craft-card__quote">
            «Más de 35 años dando forma y nueva vida a cada pieza.»
          </p>
        </div>
      </div>
      <div className="craft-card__body">
        <h3 className="craft-card__title">Manos de Oficio</h3>
        <p className="craft-card__text">
          Cada reparación se trabaja en el banco del taller, con lupa, soplete y paciencia, cuidando que la pieza quede firme, limpia y lista para seguir luciéndose.
        </p>
      </div>
    </PixelCard>
  )
}

export default CraftCard
