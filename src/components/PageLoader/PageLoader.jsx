import { useEffect, useState } from 'react'
import './PageLoader.css'

/**
 * Pop-up de carga modal centrado en pantalla con efecto de desenfoque (blur de 14px,
 * idéntico al de la barra de navegación) y spinner circular clásico.
 */
function PageLoader({ isLoading, title = 'Cargando' }) {
  const [mounted, setMounted] = useState(isLoading)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    let timer = null
    if (isLoading) {
      setMounted(true)
      setIsClosing(false)
    } else if (mounted) {
      setIsClosing(true)
      timer = setTimeout(() => {
        setMounted(false)
        setIsClosing(false)
      }, 300)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isLoading, mounted])

  if (!mounted) return null

  return (
    <div
      className={`page-loader-overlay${isClosing ? ' page-loader-overlay--closing' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="page-loader-modal">
        <div className="page-loader__spinner" aria-hidden="true" />
        <h2 className="page-loader__title">{title}</h2>
      </div>
    </div>
  )
}

export default PageLoader
