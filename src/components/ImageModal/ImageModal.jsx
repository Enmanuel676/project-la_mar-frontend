import { useEffect } from 'react'
import './ImageModal.css'

function ImageModal({ isOpen, onClose, image }) {
  useEffect(() => {
    if (!isOpen) return

    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !image) return null

  return (
    <div
      className="image-modal"
      role="dialog"
      aria-modal="true"
      aria-label={image.title ?? image.alt ?? 'Imagen ampliada'}
    >
      <div className="image-modal__scrim" onClick={onClose} />
      <div className="image-modal__dialog">
        <header className="image-modal__header">
          <div className="image-modal__info">
            {image.title && <h3 className="image-modal__title">{image.title}</h3>}
            {image.subtitle && <span className="image-modal__subtitle">{image.subtitle}</span>}
          </div>
          <button
            type="button"
            className="image-modal__close"
            onClick={onClose}
            aria-label="Cerrar imagen"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="image-modal__image-wrapper">
          <img
            src={image.src}
            alt={image.alt ?? image.title ?? 'Imagen ampliada'}
            className="image-modal__image"
          />
        </div>
      </div>
    </div>
  )
}

export default ImageModal
