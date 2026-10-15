import { useEffect, useState } from 'react'
import PageLoader from '../../components/PageLoader/PageLoader'
import PriceTable from '../../components/PriceTable/PriceTable'
import {
  EMPTY_PRICE_ROWS,
  GOLD_PRICES_JSON_URL,
  WHATSAPP_URL,
  applyScrapPriceDifferences,
  applySellPriceDifferences,
} from '../../data/content'
import './PriceReport.css'

// Precios del oro por gramo en USD: joya como prenda (solo venta) y joya como chatarra (solo compra).
// `npm run gold:update` calcula estos precios una vez al día y los publica como JSON
// (ver scripts/update-gold-prices.js); aquí solo se leen. No hay precios por defecto: hasta que
// llegan, las tablas muestran «—», y si la petición falla se avisa en vez de enseñar precios viejos.
function PriceReport() {
  const [rows, setRows] = useState(EMPTY_PRICE_ROWS)
  const [scrapRows, setScrapRows] = useState(EMPTY_PRICE_ROWS)
  const [updatedAt, setUpdatedAt] = useState(null)
  // Mientras es 'loading' se ve el cargador encima de la página.
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false

    fetch(GOLD_PRICES_JSON_URL)
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo obtener el reporte de precios')
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        // Sin las dos listas el archivo no sirve: se trata como un fallo, sin pintar nada a medias.
        if (!Array.isArray(data.rows) || !Array.isArray(data.scrapRows)) {
          throw new Error('El reporte de precios no tiene el formato esperado')
        }
        setRows(applySellPriceDifferences(data.rows))
        setScrapRows(applyScrapPriceDifferences(data.scrapRows))
        setUpdatedAt(data.updatedAt ? new Date(data.updatedAt) : null)
        setStatus('ready')
      })
      .catch((error) => {
        console.error('No se pudo cargar el precio del oro:', error)
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="price-report">
      <PageLoader isLoading={status === 'loading'} />

      <div className="price-report__inner">
        <div className="price-report__header">
          <div>
            <span className="price-report__kicker">Precios del oro por gramo</span>
            <h1 className="price-report__title">Informes de precios aproximados</h1>
          </div>
          <p className="price-report__updated">
            Última actualización: {updatedAt ? updatedAt.toLocaleString('es-ES') : '—'}
          </p>
        </div>

        {status === 'error' && (
          <p className="price-report__error" role="alert">
            No pudimos cargar los precios del día. Inténtalo de nuevo en unos minutos.
          </p>
        )}

        <div className="price-report__block">
          <span className="price-report__line"></span>
          <div>
            <h2 className="price-report__subtitle">Precios de joya como prenda</h2>
            <p className="price-report__note">Precio por gramo según el quilataje.</p>
          </div>

          <PriceTable title="Vendemos" rows={rows} usdKey="sellUSD" />
        </div>

        <div className="price-report__block price-report__block--scrap">
          <div>
            <h2 className="price-report__subtitle">Precios de joya como chatarra</h2>
            <p className="price-report__note">Precio por gramo según el quilataje.</p>
          </div>
          <PriceTable title="Compramos chatarra" rows={scrapRows} usdKey="buyUSD" />
        </div>

        <div className="price-report__cta">
          <h2 className="price-report__cta-title">Si desea conocer un precio exacto...</h2>
          <a className="price-report__cta-button" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  )
}

export default PriceReport
