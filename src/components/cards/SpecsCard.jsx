import { CardMeta, PixelCard } from '../PixelCard'

const SPECS = [
  { label: 'Pierre Centrale', value: 'Émeraude Colombie 4.22 ct (Clarté VS1)' },
  { label: "Pierres d'Accompagnement", value: '32 Diamants taille brillant F-VVS (0.64 ct)' },
  { label: 'Poids Métal', value: '14.80 grammes Or 18k Rose' },
  { label: 'Taille de Doigt', value: '54 EU (Ajustement sur mesure offert)', accent: true },
  { label: 'Écrin de Présentation', value: 'Acajou Massif & Cuir Fauve Piqué' },
]

function SpecsCard() {
  return (
    <PixelCard className="md:max-w-md lg:max-w-lg p-space-lg md:p-space-xl">
      <CardMeta label="04 / Spécifications" code="DOSSIER TECHNIQUE" />
      <h2 className="font-headline-lg text-headline-lg text-on-surface">Haute Précision &amp; Détails</h2>
      <div className="space-y-3 font-body-sm text-body-sm">
        {SPECS.map((spec) => (
          <div
            key={spec.label}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-3 py-2 bg-surface-container-high/40 px-3 rounded"
          >
            <span className="shrink-0 text-outline uppercase tracking-wider font-label-sm">{spec.label}</span>
            <span className={`${spec.accent ? 'text-secondary' : 'text-on-surface'} font-medium sm:text-right`}>
              {spec.value}
            </span>
          </div>
        ))}
      </div>
      <div className="pt-2">
        <a
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-[0.14em] rounded-lg shadow-lg hover:bg-primary-container transition-colors"
          data-path="cita-privada"
          href="#"
        >
          <span>Demander le Rapport Gemmologique</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
      </div>
    </PixelCard>
  )
}

export default SpecsCard
