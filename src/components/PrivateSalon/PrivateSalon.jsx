import './PrivateSalon.css'

function PrivateSalon() {
  return (
    <section className="private-salon">
      <div className="private-salon__inner">
        <span className="private-salon__kicker">
          Salón Privado La Mar
        </span>
        <h2 className="private-salon__title">Vive la Experiencia de El Abismo Verde</h2>
        <p className="private-salon__text">
          Disponible únicamente con cita privada en nuestro salón de la Place Vendôme o a través de
          nuestra conserjería para una presentación segura a domicilio.
        </p>
        <div className="private-salon__actions">
          <a
            className="private-salon__button private-salon__button--primary"
            data-path="cita-privada"
            href="#"
          >
            Reservar una Presentación Privada
          </a>
          <a
            className="private-salon__button private-salon__button--secondary"
            href="#"
          >
            Descargar el Dossier Artístico
          </a>
        </div>
      </div>
    </section>
  )
}

export default PrivateSalon
