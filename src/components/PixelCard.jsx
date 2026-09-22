import { useEffect, useRef } from 'react'
import { attachScrollDissolve } from '../lib/pixelDissolve'

// Tarjeta que aparece/desaparece en píxeles según su posición de scroll.
export function PixelCard({ className = '', children }) {
  const cardRef = useRef(null)
  const fxRef = useRef(null)

  useEffect(() => attachScrollDissolve(cardRef.current, fxRef.current), [])

  return (
    <article
      ref={cardRef}
      className={`pixel-card pointer-events-auto w-[92%] md:w-full bg-surface-container-low/70 backdrop-blur-[6px] rounded-xl shadow-2xl space-y-space-md transition-all hover:bg-surface-container/95 ${className}`}
    >
      {children}
      <canvas ref={fxRef} aria-hidden="true" className="pixel-fx" />
    </article>
  )
}

export function CardMeta({ label, code, accent = 'text-primary' }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className={`font-label-sm text-label-sm uppercase tracking-[0.18em] ${accent}`}>{label}</span>
      <span className="font-label-sm text-label-sm font-mono text-outline text-right">{code}</span>
    </div>
  )
}
