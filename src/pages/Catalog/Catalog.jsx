import { CATALOG_ITEMS } from '../../data/content'
import { formatPrice } from '../../lib/formatPrice'
import './Catalog.css'

// Artículos disponibles con su precio en CUP y USD.
// Hoy lee datos de ejemplo; más adelante vendrán de la API del catálogo.
function Catalog({ items = CATALOG_ITEMS }) {
  return (
    <section className="catalog">
      <div className="catalog__inner">
        <div>
          <span className="catalog__kicker">Disponibles ahora</span>
          <h1 className="catalog__title">Catálogo</h1>
        </div>

        {items.length === 0 ? (
          <p className="catalog__empty">No hay artículos disponibles en este momento.</p>
        ) : (
          <ul className="catalog__grid">
            {items.map((item) => (
              <li key={item.id} className="catalog-card">
                <div className="catalog-card__media">
                  {item.image ? (
                    <img alt={item.name} className="catalog-card__image" src={item.image} />
                  ) : (
                    <span className="catalog-card__placeholder material-symbols-outlined" aria-hidden="true">
                      diamond
                    </span>
                  )}
                </div>
                <div className="catalog-card__body">
                  <h3 className="catalog-card__name">{item.name}</h3>
                  {item.description && <p className="catalog-card__description">{item.description}</p>}
                  <dl className="catalog-card__prices">
                    <div>
                      <dt className="catalog-card__currency">CUP</dt>
                      <dd className="catalog-card__price">{formatPrice(item.priceCUP, 'CUP')}</dd>
                    </div>
                    <div>
                      <dt className="catalog-card__currency">USD</dt>
                      <dd className="catalog-card__price catalog-card__price--usd">
                        {formatPrice(item.priceUSD, 'USD')}
                      </dd>
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
