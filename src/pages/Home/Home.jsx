import FacetsGallery from '../../components/FacetsGallery/FacetsGallery'
import PrivateSalon from '../../components/PrivateSalon/PrivateSalon'
import ProductHeader from '../../components/ProductHeader/ProductHeader'
import RingScrollVideo from '../../components/RingScrollVideo/RingScrollVideo'
import './Home.css'

// Página de inicio (landing): presentación del anillo con el video por scroll.
function Home() {
  return (
    <>
      <ProductHeader />
      <RingScrollVideo />
      <FacetsGallery />
      <PrivateSalon />
    </>
  )
}

export default Home
