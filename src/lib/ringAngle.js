// Estado compartido del ángulo del anillo (0–360°) entre el video,
// el indicador "Angle de Vue" y los botones de la galería de facetas.
// Se mantiene fuera de React para actualizarse a 60fps sin re-renders.

let angle = 45
let manualAngle = null
const listeners = new Set()

export const ringAngle = {
  get: () => angle,
  set(value) {
    angle = value
    listeners.forEach((listener) => listener(value))
  },
  subscribe(listener) {
    listeners.add(listener)
    listener(angle)
    return () => listeners.delete(listener)
  },
  // Ángulo fijado por el usuario (clic en una faceta); el scroll lo libera.
  getManual: () => manualAngle,
  setManual(value) {
    manualAngle = value
  },
  clearManual() {
    manualAngle = null
  },
}

export const formatAngle = (value) =>
  `${String(Math.round(value)).padStart(3, '0')}° / 360°`
