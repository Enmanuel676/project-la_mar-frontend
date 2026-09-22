import AmbientGlow from './components/AmbientGlow'
import FacetsGallery from './components/FacetsGallery'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PrivateSalon from './components/PrivateSalon'
import ProductHeader from './components/ProductHeader'
import RingScrollVideo from './components/RingScrollVideo'

function App() {
  return (
    <>
      <Navbar />
      <main className="w-full pt-20 bg-surface min-h-screen">
        <div className="flex flex-col w-full text-on-surface overflow-x-clip selection:bg-primary selection:text-on-primary">
          <AmbientGlow />
          <ProductHeader />
          <RingScrollVideo />
          <FacetsGallery />
          <PrivateSalon />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default App
