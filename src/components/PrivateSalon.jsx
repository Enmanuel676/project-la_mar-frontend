function PrivateSalon() {
  return (
    <section className="relative z-20 w-full px-margin-mobile md:px-margin py-space-xl bg-surface-container-low">
      <div className="max-w-4xl mx-auto text-center space-y-space-md">
        <span className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-secondary">
          Salon Privé La Mar
        </span>
        <h2 className="font-headline-xl text-headline-xl text-on-surface">Faire L'Expérience de L'Abysse Vert</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Disponible uniquement sur rendez-vous privé à notre salon de la Place Vendôme ou via notre
          concierge pour une présentation sécurisée à domicile.
        </p>
        <div className="pt-space-sm flex flex-col sm:flex-row items-center justify-center gap-space-md">
          <a
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-[0.14em] rounded-lg shadow-xl hover:bg-primary-container transition-all hover:scale-105"
            data-path="cita-privada"
            href="#"
          >
            Réserver une Présentation Privée
          </a>
          <a
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-secondary/40 text-secondary font-label-md text-label-md uppercase tracking-[0.14em] rounded-lg hover:bg-secondary hover:text-on-secondary transition-all"
            href="#"
          >
            Télécharger le Dossier d'Art
          </a>
        </div>
      </div>
    </section>
  )
}

export default PrivateSalon
