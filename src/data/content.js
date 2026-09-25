import logo from './logo.webp'
export const LOGO = logo
export const ATELIER_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBC3QM_8tYVMKlRQA8AI2LMoNWWzUGlSY9Da1lft7nGTqdoix6BODWteHdVsm2cgu08uXLm4NbYT9MHF-9imPPrjS3Ba8eoGvWuoKcSKyQjJWHVTvUhHtsLDp_mhToQJQi-RtsI4hKd9iU5b_L3xd91xYO1FUsKHqwi6ET_ktmdO9fyZ31aRYk1Yub97Uq5J5_NTaNJgGUKCZ6YFwRUNDi7nkn76CT5ywOO7qdP4M_UFdIbh6d6Grkd'

export const PRESENCE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC162Xp7Tydvx82Civ0LISlceAFxBz05-5oRwG51f1W724_Jr73DaD2aBAJ4Rq29ac6R3joGaPENdcM_YFBJwEh4Pd3Dh9BNIzl4qVipm6IxxmpTBtNe3ogQZ005cmyWzmITZ5OyuzNbfT3R7p_z402n0xQusYOxclkVO7RxJkGy2RPupFkQAlfcs2X62OHyQviVB0hx4W20C4L6Gx6dXnc6nUi-3p5L39aYnAS3auXhEVmD8-07bky'

// TODO: sustituir por el número real (código de país + número, sin "+" ni espacios).
export const WHATSAPP_NUMBER = '53126406'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

// `to` es una ruta interna (página); `href` es un enlace externo que se abre en otra pestaña.
export const NAV_LINKS = [
  { path: 'inicio', label: 'Inicio', to: '/' },
  { path: 'catalogo', label: 'Catálogo', to: '/catalogo' },
  { path: 'informes-precios', label: 'Informes de precios', to: '/informes-precios' },
  { path: 'contacto', label: 'Contacto', href: WHATSAPP_URL },
]

// Datos de ejemplo hasta conectar la API de administración del catálogo.
// `image` puede ser null: la tarjeta muestra un marcador en su lugar.
export const CATALOG_ITEMS = [
  { id: 'ejemplo-1', name: 'Artículo de ejemplo 1', description: 'Anillo · Oro 18k', image: null, priceUSD: null },
  { id: 'ejemplo-2', name: 'Artículo de ejemplo 2', description: 'Cadena · Oro 14k', image: null, priceUSD: null },
  { id: 'ejemplo-3', name: 'Artículo de ejemplo 3', description: 'Aretes · Oro 18k', image: null, priceUSD: null },
  { id: 'ejemplo-4', name: 'Artículo de ejemplo 4', description: 'Pulsera · Oro 10k', image: null, priceUSD: null },
]

// Filas de la tabla de precios del oro (por gramo), de menor a mayor quilataje.
// Los valores null se muestran como "—" hasta que la API de precios los rellene.
export const GOLD_PRICES = [
  { karat: '10k', purity: '417‰', buyUSD: null, sellUSD: null },
  { karat: '14k', purity: '585‰', buyUSD: null, sellUSD: null },
  { karat: '18k', purity: '750‰', buyUSD: null, sellUSD: null },
  { karat: '22k', purity: '916‰', buyUSD: null, sellUSD: null },
  { karat: '24k', purity: '999‰', buyUSD: null, sellUSD: null },
]

// Precios de compra de oro como chatarra (por gramo). La joyería solo compra.
export const SCRAP_PRICES = [
  { karat: '10k', purity: '417‰', buyUSD: null },
  { karat: '12k', purity: '500‰', buyUSD: null },
  { karat: '14k', purity: '585‰', buyUSD: null },
  { karat: '18k', purity: '750‰', buyUSD: null },
  { karat: '22k', purity: '916‰', buyUSD: null },
  { karat: '24k', purity: '999‰', buyUSD: null },
]
