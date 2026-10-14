/**
 * Horario de atención del negocio (zona horaria Cuba / America/Havana):
 * - Lunes: 9:00 am a 6:00 pm (09:00 - 18:00)
 * - Martes: 9:00 am a 4:30 pm (09:00 - 16:30)
 * - Miércoles: 2:00 pm a 6:00 pm (14:00 - 18:00)
 * - Jueves y Viernes: 9:00 am a 6:00 pm (09:00 - 18:00)
 * - Sábado: 2:00 pm a 5:00 pm (14:00 - 17:00)
 * - Domingo: Cerrado
 */

export const STORE_SCHEDULE_DESCRIPTION =
  'Horario: Lun, Jue, Vie 9:00 - 18:00 | Mar 9:00 - 16:30 | Mié 14:00 - 18:00 | Sáb 14:00 - 17:00 | Dom Cerrado'

export function getStoreTime(date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Havana',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    })
    const parts = formatter.formatToParts(date)
    let weekday = ''
    let hour = 0
    let minute = 0
    for (const part of parts) {
      if (part.type === 'weekday') weekday = part.value
      if (part.type === 'hour') {
        hour = parseInt(part.value, 10) % 24
      }
      if (part.type === 'minute') minute = parseInt(part.value, 10)
    }
    const daysMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
    const day = daysMap[weekday] ?? date.getDay()
    return { day, minutes: hour * 60 + minute }
  } catch {
    return { day: date.getDay(), minutes: date.getHours() * 60 + date.getMinutes() }
  }
}

export function isStoreOpen(date = new Date()) {
  const { day, minutes } = getStoreTime(date)

  switch (day) {
    case 1: // Lunes: 9:00 am a 6:00 pm
    case 4: // Jueves: 9:00 am a 6:00 pm
    case 5: // Viernes: 9:00 am a 6:00 pm
      return minutes >= 9 * 60 && minutes < 18 * 60
    case 2: // Martes: 9:00 am a 4:30 pm
      return minutes >= 9 * 60 && minutes < 16 * 60 + 30
    case 3: // Miércoles: 2:00 pm a 6:00 pm
      return minutes >= 14 * 60 && minutes < 18 * 60
    case 6: // Sábado: 2:00 pm a 5:00 pm
      return minutes >= 14 * 60 && minutes < 17 * 60
    case 0: // Domingo: Cerrado
    default:
      return false
  }
}
