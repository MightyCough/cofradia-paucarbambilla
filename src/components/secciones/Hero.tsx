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
        src="/assets/fotos/image1-1600.webp"
        srcSet="/assets/fotos/image1-900.webp 900w, /assets/fotos/image1-1600.webp 1600w"
        sizes="100vw"
        width={1600}
        height={1066}
        alt="La cuadrilla de negritos bailando por una calle de Huánuco"
        fetchPriority="high"
        decoding="async"
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
