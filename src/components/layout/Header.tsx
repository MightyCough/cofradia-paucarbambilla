import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { createTimeline, utils } from 'animejs'
import { cofradia } from '@/content/cofradia'
import { enVivo, participa, postular, principales } from '@/content/navegacion'

const SALIDA = [0.16, 1, 0.3, 1] as const

export function Header() {
  const { pathname } = useLocation()
  const inicio = pathname === '/'
  const reducir = useReducedMotion()
  const [abierto, setAbierto] = useState(false)
  const [masAbierto, setMasAbierto] = useState(false)
  const [desplazado, setDesplazado] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 40,
  )
  const botonMenuRef = useRef<HTMLButtonElement | null>(null)
  const menuMovilRef = useRef<HTMLElementTagNameMap['nav'] | null>(null)
  const masRef = useRef<HTMLDivElement | null>(null)
  const botonMasRef = useRef<HTMLButtonElement | null>(null)
  const marcaRef = useRef<HTMLSpanElement | null>(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const marca = marcaRef.current
    const imagen = marca?.querySelector('img')
    const brillo = marca?.querySelector('.header__brillo')
    if (!imagen || !brillo) return

    const sombra = 'drop-shadow(0 2px 6px rgb(0 0 0 / .55))'
    utils.set(imagen, {
      clipPath: 'inset(0% 50% 0% 50%)',
      opacity: 0,
      filter: `${sombra} brightness(2)`,
    })

    const timeline = createTimeline({ defaults: { ease: 'outExpo' } })
    timeline
      .add(imagen, {
        clipPath: ['inset(0% 50% 0% 50%)', 'inset(0% 0% 0% 0%)'],
        opacity: [0, 1],
        filter: [`${sombra} brightness(2)`, `${sombra} brightness(1)`],
        duration: 900,
      })
      .add(
        brillo,
        {
          keyframes: [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }],
          backgroundPosition: ['150% 0', '-50% 0'],
          duration: 1100,
          ease: 'inOutQuad',
        },
        '-=250',
      )

    return () => {
      timeline.revert()
    }
  }, [])

  useEffect(() => {
    const detectarDesplazamiento = () => setDesplazado(window.scrollY > 40)
    window.addEventListener('scroll', detectarDesplazamiento, { passive: true })
    return () => window.removeEventListener('scroll', detectarDesplazamiento)
  }, [])

  useEffect(() => {
    if (!abierto) return

    const overflowAnterior = document.body.style.overflow
    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key !== 'Escape') return
      setAbierto(false)
      botonMenuRef.current?.focus()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', cerrarConEscape)
    menuMovilRef.current?.querySelector('a')?.focus()

    return () => {
      document.body.style.overflow = overflowAnterior
      document.removeEventListener('keydown', cerrarConEscape)
    }
  }, [abierto])

  useEffect(() => {
    if (!masAbierto) return

    const cerrarAlHacerClicFuera = (evento: PointerEvent) => {
      if (!masRef.current?.contains(evento.target as Node)) setMasAbierto(false)
    }
    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key !== 'Escape') return
      setMasAbierto(false)
      botonMasRef.current?.focus()
    }

    document.addEventListener('pointerdown', cerrarAlHacerClicFuera)
    document.addEventListener('keydown', cerrarConEscape)
    return () => {
      document.removeEventListener('pointerdown', cerrarAlHacerClicFuera)
      document.removeEventListener('keydown', cerrarConEscape)
    }
  }, [masAbierto])

  const cerrarMenu = () => {
    setAbierto(false)
    setMasAbierto(false)
  }
  const clases = [
    'header',
    inicio ? 'header--flotante' : '',
    inicio && desplazado ? 'header--desplazado' : '',
    abierto ? 'header--menu-abierto' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={clases}>
      <Link
        to="/"
        className="header__marca"
        aria-label={`${cofradia.nombre}, ${cofradia.advocacion}`}
        onClick={cerrarMenu}
      >
        <span className="header__rotulo-marca" ref={marcaRef}>
          <img src="/assets/logos/rotulo-oro-nav.webp" width={702} height={240} alt="" />
          <span className="header__brillo" aria-hidden="true" />
        </span>
      </Link>

      <nav className="header__nav-escritorio" aria-label="Principal">
        <ul className="header__principales">
          {principales.map((enlace) => (
            <li key={enlace.to}>
              <NavLink className="header__enlace header__subrayado" to={enlace.to} onClick={cerrarMenu}>
                {enlace.etiqueta}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="header__mas" ref={masRef}>
          <button
            ref={botonMasRef}
            type="button"
            className="header__enlace header__mas-boton header__subrayado"
            aria-expanded={masAbierto}
            aria-controls="menu-participa"
            onClick={() => setMasAbierto((valor) => !valor)}
          >
            Más
            <svg
              className={masAbierto ? 'header__chevron header__chevron--abierto' : 'header__chevron'}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path d="m2 4 4 4 4-4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <div
            id="menu-participa"
            className="header__desplegable"
            hidden={!masAbierto}
          >
            <ul>
              {participa.map((enlace) => (
                <li key={enlace.to}>
                  <NavLink
                    to={enlace.to}
                    className={enlace.destacado ? 'header__participa-link header__oro' : 'header__participa-link'}
                    onClick={cerrarMenu}
                  >
                    {enlace.etiqueta}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link className="header__vivo" to={enVivo.to} onClick={cerrarMenu}>
          <span className="header__vivo-punto" aria-hidden="true" />
          {enVivo.etiqueta}
        </Link>
      </nav>

      <div className="header__acciones">
        <Link className="boton boton--chico header__postular" to={postular.to} onClick={cerrarMenu}>
          {postular.etiqueta}
        </Link>
        <button
          ref={botonMenuRef}
          type="button"
          className="header__burger"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setAbierto((valor) => !valor)}
        >
          <svg className="header__icono-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path className="header__linea-menu header__linea-menu--superior" d="M4 6h16" />
            <path className="header__linea-menu header__linea-menu--centro" d="M4 12h16" />
            <path className="header__linea-menu header__linea-menu--inferior" d="M4 18h16" />
          </svg>
        </button>
      </div>

      <motion.nav
        ref={menuMovilRef}
        id="menu-movil"
        className="header__nav-movil"
        aria-label="Principal"
        aria-hidden={!abierto}
        inert={!abierto}
        initial={false}
        animate={abierto ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: reducir ? 0 : 0.25, ease: SALIDA }}
      >
        <div className="header__menu-contenido">
          <section className="header__grupo-movil" aria-labelledby="header-rotulo-cofradia">
            <h2 className="header__rotulo" id="header-rotulo-cofradia">La cofradía</h2>
            <ul className="header__lista-movil">
              {principales.map((enlace, indice) => (
                <motion.li
                  key={enlace.to}
                  initial={false}
                  animate={abierto ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: reducir ? 0 : 0.25, delay: abierto && !reducir ? indice * 0.04 : 0, ease: SALIDA }}
                >
                  <NavLink to={enlace.to} onClick={cerrarMenu}>{enlace.etiqueta}</NavLink>
                </motion.li>
              ))}
            </ul>
          </section>

          <section className="header__grupo-movil" aria-labelledby="header-rotulo-participa">
            <h2 className="header__rotulo" id="header-rotulo-participa">Participa</h2>
            <ul className="header__lista-movil">
              {participa.map((enlace, indice) => (
                <motion.li
                  key={enlace.to}
                  initial={false}
                  animate={abierto ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: reducir ? 0 : 0.25, delay: abierto && !reducir ? (principales.length + indice) * 0.04 : 0, ease: SALIDA }}
                >
                  <NavLink
                    to={enlace.to}
                    className={enlace.destacado ? 'header__participa-link header__oro' : 'header__participa-link'}
                    onClick={cerrarMenu}
                  >
                    {enlace.etiqueta}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </section>

          <motion.div
            className="header__entrada-vivo"
            initial={false}
            animate={abierto ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: reducir ? 0 : 0.25, delay: abierto && !reducir ? (principales.length + participa.length) * 0.04 : 0, ease: SALIDA }}
          >
            <Link className="header__vivo" to={enVivo.to} onClick={cerrarMenu}>
              <span className="header__vivo-punto" aria-hidden="true" />
              {enVivo.etiqueta}
            </Link>
          </motion.div>
          <motion.div
            className="header__entrada-postular"
            initial={false}
            animate={abierto ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: reducir ? 0 : 0.25, delay: abierto && !reducir ? (principales.length + participa.length + 1) * 0.04 : 0, ease: SALIDA }}
          >
            <Link className="boton header__postular-movil" to={postular.to} onClick={cerrarMenu}>
              Postular a la cuadrilla
            </Link>
          </motion.div>
        </div>
      </motion.nav>
    </header>
  )
}
