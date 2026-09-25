import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router'
import AmbientGlow from './components/AmbientGlow/AmbientGlow'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import Catalog from './pages/Catalog/Catalog'
import Home from './pages/Home/Home'
import PriceReport from './pages/PriceReport/PriceReport'
import './App.css'

// Al cambiar de página se vuelve arriba, como en una navegación normal.
function ScrollToTop() {
  const { pathname } = useLocation()
  // Con llaves: en Chrome scrollTo() devuelve una Promise, y un efecto solo puede devolver su limpieza.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// HashRouter (#/catalogo) funciona en GitHub Pages sin configurar el servidor.
function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Navbar />
      <main className="app-main">
        <div className="app-content">
          <AmbientGlow />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/informes-precios" element={<PriceReport />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </HashRouter>
  )
}

export default App
