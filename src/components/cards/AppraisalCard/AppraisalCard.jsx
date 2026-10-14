import { APPRAISAL_IMAGE, WHATSAPP_URL } from '../../../data/content'
import { CardMeta, PixelCard } from '../../PixelCard/PixelCard'
import './AppraisalCard.css'

function AppraisalCard() {
  return (
    <PixelCard className="appraisal-card">
      <CardMeta label="04 / Tasación" code="PRENDAS Y CHATARRA" accent="secondary" />
      <div className="appraisal-card__media">
        <img
          alt="Anillo de oro sobre la balanza junto a los ácidos de prueba de quilates"
          className="appraisal-card__image"
          src={APPRAISAL_IMAGE}
          loading="lazy"
        />
      </div>
      <div className="appraisal-card__body">
        <h3 className="appraisal-card__title">Tasamos tus Prendas</h3>
        <p className="appraisal-card__text">
          Pesamos y probamos cada pieza con ácidos de 10k, 14k, 18k y 22k para conocer su quilataje real. Compramos prendas y chatarra de oro, y el valor final depende de su peso y su estado.
        </p>
      </div>
      <div className="appraisal-card__action">
        <a
          className="appraisal-card__button"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Solicitar una Tasación</span>
          <span className="appraisal-card__button-icon material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </PixelCard>
  )
}

export default AppraisalCard
