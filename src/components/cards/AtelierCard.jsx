import { ATELIER_IMAGE } from '../../data/content'
import { CardMeta, PixelCard } from '../PixelCard'

const TAGS = [
  { label: 'Finition Sablée', accent: true },
  { label: 'Serti Descendant' },
  { label: 'Poinçon Maître' },
]

function AtelierCard() {
  return (
    <PixelCard className="md:max-w-md lg:max-w-xl p-space-md md:p-space-lg">
      <CardMeta label="03 / Métier d'Art" code="ATELIER PLACE VENDÔME" />
      <div className="relative overflow-hidden rounded-lg aspect-[16/10] md:aspect-[4/3] bg-surface-container-lowest">
        <img
          alt="Savoir-Faire sur l'établi du maître artisan joaillier"
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          src={ATELIER_IMAGE}
        />
        <div className="absolute top-3 right-3 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-md">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.14em]">
            120 Heures d'Engaste
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-headline-lg text-headline-lg text-on-surface">Savoir-Faire en el Atelier</h3>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Chaque griffe sculpturale est évidée sous binoculaire pour maximiser l'aération de la pierre.
          Le serti micro-pavé latéral est réalisé au burin d'acier trempé selon les traditions de la
          joaillerie française du XVIIIe siècle.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {TAGS.map((tag) => (
          <span
            key={tag.label}
            className={`px-3 py-1 bg-surface-container-high rounded-full font-label-sm text-label-sm ${
              tag.accent ? 'text-secondary' : 'text-on-surface-variant'
            }`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </PixelCard>
  )
}

export default AtelierCard
