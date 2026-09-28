import { useEffect, useState } from 'react'
import PriceTable from '../../components/PriceTable/PriceTable'
import { GOLD_PRICES, GOLD_PRICES_JSON_URL, GOLD_PRICES_UPDATED_AT, SCRAP_PRICES, WHATSAPP_URL } from '../../data/content'
import { formatPrice } from '../../lib/formatPrice'
import './PriceReport.css'

// Precios del oro por gramo en USD: joya como prenda (compra y venta) y joya como chatarra (solo compra).
// `npm run gold:update` calcula estos precios una vez al día y los publica como JSON
// (ver scripts/update-gold-prices.js); aquí solo se leen. Si la petición falla, se quedan las filas en "—".
function PriceReport() {
  const [rows, setRows] = useState(GOLD_PRICES)
  const [scrapRows, setScrapRows] = useState(SCRAP_PRICES)
  const [updatedAt, setUpdatedAt] = useState(GOLD_PRICES_UPDATED_AT)

  useEffect(() => {
    let cancelled = false

    fetch(GOLD_PRICES_JSON_URL)
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo obtener el reporte de precios')
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        setRows(data.rows ?? GOLD_PRICES)
        setScrapRows(data.scrapRows ?? SCRAP_PRICES)
        setUpdatedAt(data.updatedAt ? new Date(data.updatedAt) : null)
      })
      .catch((error) => {
        console.error('No se pudo cargar el precio del oro:', error)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="price-report">
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

        <div className="price-report__block">
          <span className="price-report__line"></span>
          <div>
            <h2 className="price-report__subtitle">Precios de joya como prenda</h2>
            <p className="price-report__note">Precio por gramo según el quilataje.</p>
          </div>

          {/* Tableta y computadora: una sola tabla con compra y venta */}
          <div className="price-report__full">
            <table className="price-table">
              <thead>
                <tr>
                  <th rowSpan={2} scope="col" className="price-table__karat">
                    Quilataje
                  </th>
                  <th scope="col" className="price-table__group">
                    Compramos
                  </th>
                  <th scope="col" className="price-table__group">
                    Vendemos
                  </th>
                </tr>
                <tr>
                  <th scope="col">USD</th>
                  <th scope="col">USD</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.karat}>
                    <th scope="row" className="price-table__karat">
                      <span className="price-table__karat-name">{row.karat}</span>
                      <span className="price-table__purity">{row.purity}</span>
                    </th>
                    <td>{formatPrice(row.buyUSD, 'USD')}</td>
                    <td>{formatPrice(row.sellUSD, 'USD')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Teléfono: la tabla se divide en dos, primero la venta y después la compra */}
          <div className="price-report__split">
            <PriceTable title="Vendemos" rows={rows} usdKey="sellUSD" />
            <PriceTable title="Compramos" rows={rows} usdKey="buyUSD" />
          </div>
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
