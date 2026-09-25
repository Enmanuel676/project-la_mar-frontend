import { formatPrice } from '../../lib/formatPrice'
import './PriceTable.css'

// Tabla sencilla de precios por quilataje en USD.
// `usdKey` indica qué campo de cada fila mostrar
// (p. ej. sellUSD para "Vendemos" o buyUSD para "Compramos").
function PriceTable({ title, rows, usdKey }) {
  return (
    <div className="price-list">
      <table className="price-list__table">
        <caption className="price-list__title">{title}</caption>
        <thead>
          <tr>
            <th scope="col" className="price-list__karat">
              Quilataje
            </th>
            <th scope="col">USD</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.karat}>
              <th scope="row" className="price-list__karat">
                <span className="price-list__karat-name">{row.karat}</span>
                <span className="price-list__purity">{row.purity}</span>
              </th>
              <td>{formatPrice(row[usdKey], 'USD')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PriceTable
