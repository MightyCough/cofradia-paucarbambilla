import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { cofradia } from '@/content/cofradia'

const SALIDA = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const reducir = useReducedMotion()

  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <img
        className="hero__foto"
        src="/assets/image1.jpg"
        alt="La cuadrilla de negritos bailando por una calle de Huánuco"
      />
      <motion.div
        className="hero__copia"
        {...(reducir
          ? {}
          : {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.7, ease: SALIDA },
            })}
      >
        <h1 id="hero-titulo">{cofradia.heroTitulo}</h1>
        <p>{cofradia.heroTexto}</p>
        <Link to="/historia" className="hero__accion">
          {cofradia.heroAccion}
        </Link>
      </motion.div>
    </section>
  )
}
