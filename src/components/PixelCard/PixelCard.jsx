import { useEffect, useRef } from 'react'
import { attachScrollDissolve } from '../../lib/pixelDissolve'
import './PixelCard.css'

// Tarjeta que aparece/desaparece en píxeles según su posición de scroll.
export function PixelCard({ className = '', children }) {
  const cardRef = useRef(null)
  const fxRef = useRef(null)

  useEffect(() => attachScrollDissolve(cardRef.current, fxRef.current), [])

  return (
    <article
      ref={cardRef}
      className={`pixel-card ${className}`}
    >
      {children}
      <canvas ref={fxRef} aria-hidden="true" className="pixel-card__fx" />
    </article>
  )
}

// `accent`: 'primary' (turquesa) o 'secondary' (coral) para el color de la etiqueta.
export function CardMeta({ label, code, accent = 'primary' }) {
  return (
    <div className="card-meta">
      <span className={`card-meta__label card-meta__label--${accent}`}>{label}</span>
      <span className="card-meta__code">{code}</span>
    </div>
  )
}
