import { PRESENCE_IMAGE } from '../../data/content'
import { CardMeta, PixelCard } from '../PixelCard'

function PresenceCard() {
  return (
    <PixelCard className="md:max-w-md lg:max-w-xl p-space-md md:p-space-lg">
      <CardMeta label="02 / En Scène" code="PORTRAIT SALON" accent="text-secondary" />
      <div className="relative overflow-hidden rounded-lg aspect-[4/3] md:aspect-[3/4] bg-surface-container-lowest">
        <img
          alt="Porte et Présence - Modèle portant la bague haute joaillerie"
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          src={PRESENCE_IMAGE}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-headline-md text-headline-md text-on-surface italic drop-shadow-md">
            « Une présence magnétique où le feu du joyau s'accorde au battement du poignet. »
          </p>
        </div>
      </div>
      <div className="space-y-1 pt-1">
        <h3 className="font-headline-md text-headline-md text-on-surface">Porte &amp; Présence</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Pensée pour capturer l'incidence lumineuse rasante d'une soirée de gala ou la douceur intime
          d'un salon privé. Son équilibre ergonomique garantit une assise parfaite sans basculement.
        </p>
      </div>
    </PixelCard>
  )
}

export default PresenceCard
