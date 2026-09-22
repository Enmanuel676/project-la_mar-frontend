import { useEffect, useRef } from 'react'
import { formatAngle, ringAngle } from '../lib/ringAngle'

function ProductHeader() {
  const angleRef = useRef(null)

  // Se escribe directo en el DOM para no re-renderizar en cada frame.
  useEffect(
    () =>
      ringAngle.subscribe((value) => {
        if (angleRef.current) angleRef.current.textContent = formatAngle(value)
      }),
    [],
  )

  return (
    <header className="relative z-20 w-full px-margin-mobile md:px-margin pt-space-lg pb-space-sm flex flex-col md:flex-row md:items-end justify-between gap-space-md">
      <div>
        <div className="flex items-center gap-space-sm mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-secondary">
            Pièce Unique Nº 01 / Collection Océano
          </span>
        </div>
        <h1 className="font-headline-2xl text-headline-2xl md:text-[58px] leading-tight text-on-surface tracking-tight">
          L'Abysse Vert
        </h1>
        <p className="font-headline-md text-headline-md italic text-secondary font-normal tracking-wide">
          Bague Solitaire Émeraude &amp; Or Rose Satiné
        </p>
      </div>

      <div className="flex items-center gap-space-md bg-surface-container-low/90 backdrop-blur-md px-space-md py-space-sm rounded-lg shadow-xl">
        <div className="text-right">
          <span className="block font-label-sm text-label-sm uppercase text-outline">Angle de Vue</span>
          <span
            ref={angleRef}
            className="font-label-md text-label-md tracking-wider text-primary font-mono"
          >
            {formatAngle(ringAngle.get())}
          </span>
        </div>
        <div className="h-8 w-px bg-surface-variant" />
        <div className="text-right">
          <span className="block font-label-sm text-label-sm uppercase text-outline">Atelier Status</span>
          <span className="font-label-md text-label-md uppercase tracking-[0.14em] text-secondary">
            Archives Privées
          </span>
        </div>
      </div>
    </header>
  )
}

export default ProductHeader
