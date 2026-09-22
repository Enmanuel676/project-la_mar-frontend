// Halos de color difuminados fijos detrás de todo el contenido.
function AmbientGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full bg-primary/5 blur-[160px]" />
      <div className="absolute top-[55%] left-[20%] w-[520px] h-[520px] rounded-full bg-secondary-container/15 blur-[140px]" />
      <div className="absolute top-[75%] right-[15%] w-[480px] h-[480px] rounded-full bg-primary/5 blur-[150px]" />
    </div>
  )
}

export default AmbientGlow
