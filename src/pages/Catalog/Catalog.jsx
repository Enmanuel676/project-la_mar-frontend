import { useEffect, useState } from 'react'
import PageLoader from '../../components/PageLoader/PageLoader'
import { CATALOG_API_URL } from '../../data/content'
import { formatPrice } from '../../lib/formatPrice'
import './Catalog.css'

// Foto de la tarjeta. Si no hay, o no carga (un navegador antiguo sin WebP, o una URL que
// falla), se muestra el mismo icono que en los artículos sin foto en vez de una imagen rota.
function CardImage({ alt, src }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <span className="catalog-card__placeholder material-symbols-outlined" aria-hidden="true">
        diamond
      </span>
    )
  }
  return <img alt={alt} className="catalog-card__image" onError={() => setFailed(true)} src={src} />
}

// Artículos publicados desde el panel de administración. Cada uno trae un solo precio,
// en la moneda que se eligió al crearlo (USD o CUP).
function Catalog() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // `cancelled` evita actualizar el estado si la persona sale de la página antes de que
    // llegue la respuesta.
    let cancelled = false

    // `cache: 'no-store'`: las tarjetas se piden siempre al backend, nunca a una copia guardada
    // por el navegador, para que un artículo recién publicado aparezca al volver a la sección.
    fetch(CATALOG_API_URL, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo obtener el catálogo')
        return response.json()
      })
      .then(async (data) => {
        if (cancelled) return
        const articleList = Array.isArray(data) ? data : []
        setItems(articleList)
        setStatus('ready')

        // Esperar a que se carguen todas las imágenes de los artículos
        const imageUrls = articleList.map((item) => item.image).filter(Boolean)
        if (imageUrls.length > 0) {
          const imagePromises = imageUrls.map((url) => {
            return new Promise((resolve) => {
              const img = new Image()
              img.src = url
              if (img.complete) {
                resolve()
              } else {
                img.onload = () => resolve()
                img.onerror = () => resolve()
              }
            })
          })
          const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 8000))
          await Promise.race([Promise.all(imagePromises), timeoutPromise])
        }

        if (!cancelled) setIsLoading(false)
      })
      .catch((error) => {
        console.error('No se pudo cargar el catálogo:', error)
        if (!cancelled) {
          setStatus('error')
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="catalog">
      <PageLoader isLoading={isLoading} />

      <div className="catalog__inner">
        <div>
          <span className="catalog__kicker">Disponibles ahora</span>
          <h1 className="catalog__title">Catálogo</h1>
        </div>
        {status === 'error' && (
          <p className="catalog__empty">No pudimos cargar el catálogo. Inténtalo de nuevo en unos minutos.</p>
        )}
        {status === 'ready' && items.length === 0 && (
          <p className="catalog__empty">No hay artículos disponibles en este momento.</p>
        )}

        {status === 'ready' && items.length > 0 && (
          <ul className="catalog__grid">
            {items.map((item) => (
              <li key={item.id} className="catalog-card">
                <div className="catalog-card__media">
                  <CardImage alt={item.name} src={item.image} />
                </div>
                <div className="catalog-card__body">
                  <h3 className="catalog-card__name">{item.name}</h3>
                  {item.description && <p className="catalog-card__description">{item.description}</p>}
                  <dl className="catalog-card__prices">
                    <div>
                      <dt className="catalog-card__currency">{item.currency}</dt>
                      <dd className="catalog-card__price">{formatPrice(item.price, item.currency)}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default Catalog
