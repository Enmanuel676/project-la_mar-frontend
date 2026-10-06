import { useLayoutEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import AmbientGlow from './components/AmbientGlow/AmbientGlow'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import Catalog from './pages/Catalog/Catalog'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import PriceReport from './pages/PriceReport/PriceReport'
import './App.css'

// Al cambiar de página se vuelve arriba, como en una navegación normal.
// useLayoutEffect: sube antes de pintar, así la página nueva nunca se ve un
// instante con el scroll de la anterior (y el anillo de Inicio se dibuja ya
// en su posición correcta).
function ScrollToTop() {
  const { pathname } = useLocation()
  // Con llaves: en Chrome scrollTo() devuelve una Promise, y un efecto solo puede devolver su limpieza.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// BrowserRouter da URLs limpias (/catalogo en vez de /#/catalogo). En GitHub Pages,
// entrar directo o recargar en una de estas rutas requiere el truco de public/404.html
// (ver ese archivo y el script en index.html que restaura la URL real).
function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Navbar />
      <main className="app-main">
        <div className="app-content">
          <AmbientGlow />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/informes-precios" element={<PriceReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
