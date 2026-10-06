import { Link } from 'react-router'
import './NotFound.css'

function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__inner">
        <span className="not-found__kicker">Error 404</span>
        <h1 className="not-found__title">Página no encontrada</h1>
        <p className="not-found__note">La dirección a la que intentaste entrar no existe o fue movida.</p>
        <Link to="/" className="not-found__cta">
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}

export default NotFound
