import { ATELIER_IMAGE, PRESENCE_IMAGE } from '../data/content'
import { ringAngle } from '../lib/ringAngle'

const FACETS = [
  {
    angle: 0,
    title: 'Vue Frontale',
    subtitle: 'Symétrie & Table de Gema',
    alt: 'Face 0 deg',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQXIsmsDfPF-ZURNG1rSt_Tbk6Ju2nWt3AVi7J9YywoIimiLEnsRSM8UdgWQ6eVG2qPc8KR_JJK513_EsBPC_lC8d7hb8lBUzMJYbjAW230XB6FIj_HKc8J8o7ctTBgH44PGKGtWUHaAxnZxL6_RpXoFXtcRx5pHwGgiaL90nEsSSX5Xh_suNx6h6-Yr-z5GZW-lH1nuJeMLw6kaO3N7bLZzVm16yzY1rKYSKos1-Gk7uVqABGf3hucAODP5NfApJQXA',
  },
  {
    angle: 90,
    title: 'Profil Architectural',
    subtitle: 'Élévation de la corbeille',
    alt: 'Profil 90 deg',
    zoom: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBeZtz4sNGF2MLUE8fUkKTI49hqQq6FvsgS2EYC1dVomUsaSY7HnFI6902DNjY3wNibjqGnIup5Z5QUf00e3F38vnyCz-DNN1is6MTICn3RjnA0ctX8zomQ7G0KjQlUhrq1QcknIm6EiAZyHxIlV10WIo5-TvTuievaXK_KVmB6hxNX7uPHhoJwX6fyr-gSieTUOGyHscixovwK5_fl3JkqLkWDw_qHl1FyI7CdQ37tHz1K1LjsID68P__Id5oVe0Aetg',
  },
  {
    angle: 180,
    title: 'Atelier & Matière',
    subtitle: 'Poinçon et polissage main',
    alt: 'Atelier Crafting',
    image: ATELIER_IMAGE,
  },
  {
    angle: 270,
    title: 'Au Porter',
    subtitle: 'Lumière du soir et tenue',
    alt: 'Editorial Silhouette',
    image: PRESENCE_IMAGE,
  },
]

function FacetsGallery() {
  return (
    <section className="relative z-20 w-full px-margin-mobile md:px-margin py-space-xl bg-surface-container-lowest/80 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto space-y-space-md">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-secondary">
              Vues Rapprochées
            </span>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">Les Facettes de L'Abysse Vert</h3>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
            Sélectionnez un angle pour orienter la bague ou examiner la disposition des griffes et le
            pavage intérieur.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
          {FACETS.map((facet) => (
            <button
              key={facet.angle}
              type="button"
              className="text-left p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col gap-2 group"
              onClick={() => ringAngle.setManual(facet.angle)}
            >
              <div className="w-full aspect-[4/3] rounded bg-surface-container-lowest overflow-hidden relative">
                <img
                  alt={facet.alt}
                  className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity${
                    facet.zoom ? ' scale-110' : ''
                  }`}
                  src={facet.image}
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-surface-container-highest/80 font-mono text-[10px] text-primary">
                  {String(facet.angle).padStart(3, '0')}°
                </span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface">
                {facet.title}
              </span>
              <span className="text-xs text-outline">{facet.subtitle}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FacetsGallery
