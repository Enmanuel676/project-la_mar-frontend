import { useEffect, useState } from 'react'
import { isStoreOpen, STORE_SCHEDULE_DESCRIPTION } from '../../lib/storeHours'
import './HomeHeader.css'

function HomeHeader() {
  const [open, setOpen] = useState(() => isStoreOpen())

  useEffect(() => {
    const timer = setInterval(() => {
      setOpen(isStoreOpen())
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="home-header">
      <div className="home-header__top">
        <div className="home-header__eyebrow" title={STORE_SCHEDULE_DESCRIPTION}>
          <span
            className={`home-header__dot ${
              open ? 'home-header__dot--open' : 'home-header__dot--closed'
            }`}
          />
          <span
            className={`home-header__status-label ${
              open ? 'home-header__status-label--open' : 'home-header__status-label--closed'
            }`}
          >
            {open ? 'Abierto' : 'Cerrado'}
          </span>
        </div>
      </div>

      <div className="home-header__main">
        <div className="home-header__brand">
          <h1 className="home-header__title">
            La Mar Joyería
          </h1>
        </div>

        <p className="home-header__tagline">
          Disponible para lo que necesite
        </p>
      </div>
    </header>
  )
}

export default HomeHeader
