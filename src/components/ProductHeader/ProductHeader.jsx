import { useEffect, useRef } from 'react'
import { formatAngle, ringAngle } from '../../lib/ringAngle'
import './ProductHeader.css'

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
    <header className="product-header">
      <div>
        <div className="product-header__eyebrow">
          <span className="product-header__dot" />
          <span className="product-header__kicker">
            Pieza Única Nº 01 / Colección Océano
          </span>
        </div>
        <h1 className="product-header__title">
          El Abismo Verde
        </h1>
        <p className="product-header__subtitle">
          Anillo Solitario de Esmeralda y Oro Rosa Satinado
        </p>
      </div>

      <div className="product-header__status">
        <div className="product-header__stat">
          <span className="product-header__stat-label">Ángulo de Vista</span>
          <span
            ref={angleRef}
            className="product-header__angle"
          >
            {formatAngle(ringAngle.get())}
          </span>
        </div>
        <div className="product-header__divider" />
        <div className="product-header__stat">
          <span className="product-header__stat-label">Estado del Taller</span>
          <span className="product-header__stat-value">
            Archivo Privado
          </span>
        </div>
      </div>
    </header>
  )
}

export default ProductHeader
