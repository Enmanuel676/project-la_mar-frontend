import logo from './logo.webp'
import craftImage from './taller-darelis.webp'
import appraisalImage from './tasacion-prendas.webp'
export const LOGO = logo
export const CRAFT_IMAGE = craftImage
export const APPRAISAL_IMAGE = appraisalImage

// Formato internacional que pide wa.me: código de país (53, Cuba) + número, sin "+" ni espacios.
// Es el mismo teléfono que muestra el pie de página (+53 53126406).
export const WHATSAPP_NUMBER = '5353126406'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

// `to` es una ruta interna (página); `href` es un enlace externo que se abre en otra pestaña.
export const NAV_LINKS = [
  { path: 'inicio', label: 'Inicio', to: '/' },
  { path: 'catalogo', label: 'Catálogo', to: '/catalogo' },
  { path: 'informes-precios', label: 'Informes de precios', to: '/informes-precios' },
  { path: 'contacto', label: 'Contacto', href: WHATSAPP_URL },
]

// API del catálogo (backend). Devuelve solo los artículos publicados desde el panel de
// administración. En local es el backend de `npm run dev`; al pasar al servidor con Nginx,
// se define VITE_API_URL con la dirección pública (por ejemplo https://tudominio.com/api).
export const CATALOG_API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/public/articles`

// Alpha Vantage no envía cabeceras CORS, así que el precio del oro no se puede pedir
// desde el navegador. `npm run gold:update` (ver scripts/update-gold-prices.js) lo pide
// una vez al día a las 9:00 a.m. y escribe public/gold-prices.json, que Vite sirve como
// archivo estático en esta misma ruta. Cuando el proyecto se aloje en el servidor
// permanente con Nginx, esta URL se cambiará por la del servidor.
export const GOLD_PRICES_JSON_URL = `${import.meta.env.BASE_URL}gold-prices.json`

// Diferencias fijas aplicadas sobre el precio base de la API para la venta de prendas por quilate (USD/g):
// - 10k: 85 - 55.83 = +29.17
// - 14k: 95 - 78.33 = +16.67
// - 18k: 100 - 100.42 = -0.42
// - 22k: 0
export const GOLD_SELL_DIFFERENCES = {
  '10k': 29.17,
  '14k': 16.67,
  '18k': -0.42,
  '22k': 0,
}

// Quilatajes que se muestran en los informes de precios (venta y compra).
export const DISPLAYED_KARATS = ['10k', '14k', '18k', '22k']

// Filas sin precio («—») mientras no llegan los datos de la API. No hay precios por defecto: si
// la petición falla, es mejor no mostrar ninguno que enseñar unos viejos como si fueran del día.
export const EMPTY_PRICE_ROWS = DISPLAYED_KARATS.map((karat) => ({ karat }))

export function applySellPriceDifferences(rows) {
  if (!Array.isArray(rows)) return []
  return rows.filter((row) => DISPLAYED_KARATS.includes(row.karat)).map((row) => {
    const diff = GOLD_SELL_DIFFERENCES[row.karat] ?? 0
    return {
      ...row,
      sellUSD:
        row.sellUSD != null
          ? Math.round((row.sellUSD + diff) * 100) / 100
          : row.sellUSD,
    }
  })
}

// Diferencias fijas aplicadas sobre el precio base de la API para la compra de chatarra por quilate (USD/g):
// - 10k: 45 - 55.83 = -10.83
// - 14k: 65 - 78.33 = -13.33
// - 18k: 80 - 100.42 = -20.42
// - 22k: descuento estándar de $5.00
export const SCRAP_BUY_DIFFERENCES = {
  '10k': -10.83,
  '14k': -13.33,
  '18k': -20.42,
  '22k': -5.0,
}

export function applyScrapPriceDifferences(rows) {
  if (!Array.isArray(rows)) return []
  return rows.filter((row) => DISPLAYED_KARATS.includes(row.karat)).map((row) => {
    const diff = SCRAP_BUY_DIFFERENCES[row.karat] ?? 0
    return {
      ...row,
      buyUSD:
        row.buyUSD != null
          ? Math.max(Math.round((row.buyUSD + diff) * 100) / 100, 0)
          : row.buyUSD,
    }
  })
}


