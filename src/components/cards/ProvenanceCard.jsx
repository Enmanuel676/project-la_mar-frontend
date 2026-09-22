import { CardMeta, PixelCard } from '../PixelCard'

function ProvenanceCard() {
  return (
    <PixelCard className="md:max-w-md lg:max-w-lg p-space-lg md:p-space-xl">
      <CardMeta label="01 / Provenance" code="COL-OCN-01" />
      <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
        Origine &amp; Matière Première
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
        Née dans les failles minérales de Muzo, cette émeraude naturelle présente une transparence
        abyssale rare appelée « jardín secret ». Montée sur un corps sculpté en or rose 750‰ au fini
        brossé à la main, sa couleur vert-mer résonne avec la chaleur cuivrée de l'alliage maison.
      </p>
      <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
        <div className="bg-surface-container-high/60 p-3 rounded-lg">
          <span className="block font-label-sm text-label-sm uppercase text-outline">Taille</span>
          <span className="font-headline-md text-headline-md text-on-surface">Coussin 4.2 ct</span>
        </div>
        <div className="bg-surface-container-high/60 p-3 rounded-lg">
          <span className="block font-label-sm text-label-sm uppercase text-outline">Alliage</span>
          <span className="font-headline-md text-headline-md text-secondary">Or Rose 750‰</span>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-space-xs">
        <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
        <span className="font-label-sm text-label-sm uppercase tracking-[0.14em] text-on-surface">
          Certification Gemmologique GIA nº 22359182
        </span>
      </div>
    </PixelCard>
  )
}

export default ProvenanceCard
