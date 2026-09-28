// Formatea importes como "$85,00" o "12 500,00 CUP". El USD lleva "$" delante (las tablas
// ya indican "USD" en el encabezado de columna, así que repetirlo en cada celda es redundante);
// el resto de monedas lleva su código detrás, ya que "$" también se usa para el peso cubano.
// Devuelve "—" cuando aún no hay precio (p. ej. antes de conectar la API).
const number = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
})

export function formatPrice(value, currency) {
  if (value == null) return '—'
  return currency === 'USD' ? `$${number.format(value)}` : `${number.format(value)} ${currency}`
}
