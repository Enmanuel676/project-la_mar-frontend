import { LOGO_URL } from '../data/content'

const SALONS = [
  { name: 'Place Vendôme', address: '12 Place Vendôme, Paris' },
  { name: 'Salamanca District', address: 'Calle de Serrano 48, Madrid' },
  { name: 'Madison Avenue', address: '740 Madison Ave, New York' },
]

const CONCIERGE_LINKS = [
  { label: 'Solicitar Consulta Privada', path: 'cita-privada' },
  { label: 'Certificación Gemológica GIA' },
  { label: 'Servicio de Restauración' },
  { label: 'contact@lamar-joaillerie.com' },
]

const LEGAL_LINKS = ['Mentions Légales', 'Confidentialité', 'Déontologie RJC']

const headingClass = 'font-label-md text-label-md uppercase tracking-[0.14em] text-secondary'

function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_12px_rgba(0,0,0,0.4)]">
      <div className="w-full px-margin-mobile md:px-margin py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-space-xl">
          <div className="space-y-space-sm">
            <div className="flex items-center gap-3">
              <img
                alt="La Mar Haute Joaillerie Logo"
                className="h-6 w-auto object-contain opacity-85 text-[0px]"
                src={LOGO_URL}
              />
              <span className="font-headline-md text-headline-md tracking-wider text-on-surface uppercase">
                La Mar
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs leading-relaxed">
              Haute Joaillerie &amp; Gemmes Rares. Pièces uniques façonnées à la main par nos maîtres
              joailliers sous la luminescence des abysses.
            </p>
          </div>

          <div className="space-y-space-sm">
            <h3 className={headingClass}>Salons &amp; Vitrines</h3>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              {SALONS.map((salon) => (
                <li key={salon.name} className="flex flex-col">
                  <span className="text-on-surface font-medium">{salon.name}</span>
                  <span className="text-xs text-outline">{salon.address}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-space-sm">
            <h3 className={headingClass}>Concierge Privé</h3>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              {CONCIERGE_LINKS.map((link) => (
                <li key={link.label}>
                  <a className="hover:text-primary transition-colors" data-path={link.path} href="#">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-space-sm">
            <h3 className={headingClass}>La Gazette des Joailliers</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Acceda a las vistas previas de nuestras adquisiciones de gemas antes de su presentación
              pública.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                aria-label="Correo electrónico"
                placeholder="Votre adresse email"
                className="w-full bg-surface-container-low px-3 py-2 text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              />
              <button
                type="button"
                className="px-4 py-2 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.18em] hover:bg-primary-container transition-colors"
              >
                Rejoindre
              </button>
            </div>
          </div>
        </div>

        <div className="pt-space-md flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-outline">
          <p>© 2024 La Mar Haute Joaillerie Atelier. Tous droits réservés.</p>
          <div className="flex items-center gap-6 font-label-sm text-label-sm uppercase tracking-[0.18em]">
            {LEGAL_LINKS.map((label) => (
              <a key={label} className="hover:text-on-surface transition-colors" href="#">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
