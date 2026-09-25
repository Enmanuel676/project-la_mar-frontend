import { ATELIER_IMAGE, PRESENCE_IMAGE } from '../../data/content'
import { ringAngle } from '../../lib/ringAngle'
import './FacetsGallery.css'

const FACETS = [
  {
    angle: 0,
    title: 'Vista Frontal',
    subtitle: 'Simetría y Tabla de la Gema',
    alt: 'Vista frontal a 0°',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQXIsmsDfPF-ZURNG1rSt_Tbk6Ju2nWt3AVi7J9YywoIimiLEnsRSM8UdgWQ6eVG2qPc8KR_JJK513_EsBPC_lC8d7hb8lBUzMJYbjAW230XB6FIj_HKc8J8o7ctTBgH44PGKGtWUHaAxnZxL6_RpXoFXtcRx5pHwGgiaL90nEsSSX5Xh_suNx6h6-Yr-z5GZW-lH1nuJeMLw6kaO3N7bLZzVm16yzY1rKYSKos1-Gk7uVqABGf3hucAODP5NfApJQXA',
  },
  {
    angle: 90,
    title: 'Perfil Arquitectónico',
    subtitle: 'Elevación de la canastilla',
    alt: 'Perfil a 90°',
    zoom: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBeZtz4sNGF2MLUE8fUkKTI49hqQq6FvsgS2EYC1dVomUsaSY7HnFI6902DNjY3wNibjqGnIup5Z5QUf00e3F38vnyCz-DNN1is6MTICn3RjnA0ctX8zomQ7G0KjQlUhrq1QcknIm6EiAZyHxIlV10WIo5-TvTuievaXK_KVmB6hxNX7uPHhoJwX6fyr-gSieTUOGyHscixovwK5_fl3JkqLkWDw_qHl1FyI7CdQ37tHz1K1LjsID68P__Id5oVe0Aetg',
  },
  {
    angle: 180,
    title: 'Taller y Materia',
    subtitle: 'Contraste y pulido a mano',
    alt: 'Trabajo artesanal en el taller',
    image: ATELIER_IMAGE,
  },
  {
    angle: 270,
    title: 'Al Llevarlo',
    subtitle: 'Luz de noche y porte',
    alt: 'Silueta editorial',
    image: PRESENCE_IMAGE,
  },
]

function FacetsGallery() {
  return (
    <section className="facets">
      <div className="facets__inner">
        <div className="facets__header">
          <div>
            <span className="facets__kicker">
              Vistas de Cerca
            </span>
            <h3 className="facets__title">Las Facetas de El Abismo Verde</h3>
          </div>
          <p className="facets__intro">
            Selecciona un ángulo para orientar el anillo o examinar la disposición de las garras y el
            pavé interior.
          </p>
        </div>

        <div className="facets__grid">
          {FACETS.map((facet) => (
            <button
              key={facet.angle}
              type="button"
              className="facets__item"
              onClick={() => ringAngle.setManual(facet.angle)}
            >
              <div className="facets__thumb">
                <img
                  alt={facet.alt}
                  className={`facets__image${facet.zoom ? ' facets__image--zoom' : ''}`}
                  src={facet.image}
                />
                <span className="facets__angle">
                  {String(facet.angle).padStart(3, '0')}°
                </span>
              </div>
              <span className="facets__name">
                {facet.title}
              </span>
              <span className="facets__subtitle">{facet.subtitle}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FacetsGallery
