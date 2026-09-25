import './AmbientGlow.css'

// Halos de color difuminados fijos detrás de todo el contenido.
function AmbientGlow() {
  return (
    <div className="ambient-glow" aria-hidden="true">
      <div className="ambient-glow__halo ambient-glow__halo--top" />
      <div className="ambient-glow__halo ambient-glow__halo--middle" />
      <div className="ambient-glow__halo ambient-glow__halo--bottom" />
    </div>
  )
}

export default AmbientGlow
