import { CardMeta, PixelCard } from '../../PixelCard/PixelCard'
import './SpecsCard.css'

const SPECS = [
  { label: 'Piedra Central', value: 'Esmeralda de Colombia 4.22 ct (Pureza VS1)' },
  { label: 'Piedras de Acompañamiento', value: '32 Diamantes talla brillante F-VVS (0.64 ct)' },
  { label: 'Peso del Metal', value: '14.80 gramos de Oro Rosa 18k' },
  { label: 'Talla de Anillo', value: '54 EU (Ajuste a medida incluido)', accent: true },
  { label: 'Estuche de Presentación', value: 'Caoba Maciza y Cuero Leonado Pespunteado' },
]

function SpecsCard() {
  return (
    <PixelCard className="specs-card">
      <CardMeta label="04 / Especificaciones" code="FICHA TÉCNICA" />
      <h2 className="specs-card__title">Alta Precisión y Detalles</h2>
      <div className="specs-card__list">
        {SPECS.map((spec) => (
          <div
            key={spec.label}
            className="specs-card__row"
          >
            <span className="specs-card__label">{spec.label}</span>
            <span className={`specs-card__value${spec.accent ? ' specs-card__value--accent' : ''}`}>
              {spec.value}
            </span>
          </div>
        ))}
      </div>
      <div className="specs-card__action">
        <a
          className="specs-card__button"
          data-path="cita-privada"
          href="#"
        >
          <span>Solicitar el Informe Gemológico</span>
          <span className="specs-card__button-icon material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </PixelCard>
  )
}

export default SpecsCard
