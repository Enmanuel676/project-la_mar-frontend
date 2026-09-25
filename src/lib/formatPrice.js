// Formatea importes como "12 500,00 CUP" o "85,00 USD". El código de moneda
// va explícito porque "$" se usa tanto para el peso cubano como para el dólar.
// Devuelve "—" cuando aún no hay precio (p. ej. antes de conectar la API).
const number = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
})

export function formatPrice(value, currency) {
  return value == null ? '—' : `${number.format(value)} ${currency}`
}
