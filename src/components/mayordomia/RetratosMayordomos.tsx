import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, createScope, createTimeline, onScroll, stagger } from 'animejs'
import { mayordomia, type Mayordomo } from '@/content/mayordomos'
import '@/styles/mayordomia.css'

const MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'
const mayordomos: Mayordomo[] = mayordomia.mayordomos

export function RetratosMayordomos() {
  const raizRef = useRef<HTMLElement>(null)
  const galeriaRef = useRef<HTMLDivElement>(null)
  const brilloRef = useRef<HTMLSpanElement>(null)
  const [movimientoReducido, setMovimientoReducido] = useState(() =>
    window.matchMedia(MOVIMIENTO_REDUCIDO).matches,
  )
  const hayMayordomosAnunciados = mayordomos.some(({ nombre }) => Boolean(nombre?.trim()))

  useEffect(() => {
    const consulta = window.matchMedia(MOVIMIENTO_REDUCIDO)
    const actualizar = () => setMovimientoReducido(consulta.matches)
    consulta.addEventListener('change', actualizar)
    return () => consulta.removeEventListener('change', actualizar)
  }, [])

  useLayoutEffect(() => {
    const raiz = raizRef.current
    const galeria = galeriaRef.current
    if (!raiz || !galeria || movimientoReducido) return

    const scope = createScope({ root: raiz })
    raiz.classList.add('mayordomia--revelando')
    scope.add(() => {
      const destellos = brilloRef.current?.querySelectorAll<HTMLSpanElement>('span')
      if (destellos?.length && !hayMayordomosAnunciados) {
        animate(destellos, {
          opacity: [0, 1, 0],
          delay: stagger(75),
          duration: 450,
          loop: true,
          loopDelay: 2500,
          ease: 'inOutSine',
        })
      }

      const siluetas = galeria.querySelectorAll<SVGSVGElement>('.mayordomia__silueta--plantilla')
      if (siluetas.length) {
        animate(siluetas, {
          opacity: [0.14, 0.2],
          duration: 3000,
          alternate: true,
          loop: true,
          ease: 'inOutSine',
        })
      }

      onScroll({
        target: galeria,
        repeat: false,
        onEnter: () => scope.execute(() => {
          const marcos = galeria.querySelectorAll<HTMLElement>('[data-mayordomia-marco]')
          const sellos = galeria.querySelectorAll<HTMLElement>('[data-mayordomia-sello]')
          const textos = galeria.querySelectorAll<HTMLElement>('[data-mayordomia-tinta]')
          const entrada = createTimeline()

          entrada.add(marcos, {
            clipPath: ['inset(100% 0 0 0)', 'inset(0)'],
            opacity: [0, 1],
            delay: stagger(140),
            duration: 700,
            ease: 'outExpo',
          }, 0)
          entrada.add(sellos, {
            opacity: [0, 1],
            rotate: ['-20deg', '0deg'],
            scale: [0.6, 1],
            delay: stagger(140),
            duration: 600,
            ease: 'outBack',
          }, 1150)
          entrada.add(textos, {
            opacity: [0, 1],
            translateY: [14, 0],
            filter: ['blur(4px)', 'blur(0px)'],
            delay: stagger(55),
            duration: 600,
            ease: 'outExpo',
          }, 1800)
        }),
      })
    })

    return () => {
      scope.revert()
      raiz.classList.remove('mayordomia--revelando')
    }
  }, [hayMayordomosAnunciados, movimientoReducido])

  return (
    <section className="seccion mayordomia" ref={raizRef} aria-labelledby="mayordomia-titulo">
      <header className="mayordomia__cabecera">
        <div className="seccion__titulo">
          <h1 id="mayordomia-titulo">{mayordomia.titulo}</h1>
        </div>
        <p className="mayordomia__introduccion">{mayordomia.intro}</p>
      </header>

      {!hayMayordomosAnunciados && (
        <div className="mayordomia__aviso" role="status">
          <div className="mayordomia__ornamento" aria-hidden="true">
            <span />
            <span className="mayordomia__rombo" />
            <span />
          </div>
          <p className="mayordomia__aviso-titulo">
            <span>{mayordomia.aviso}</span>
            <span className="mayordomia__brillo" ref={brilloRef} aria-hidden="true">
              {Array.from(mayordomia.aviso, (letra, indice) => <span key={`${letra}-${indice}`}>{letra}</span>)}
            </span>
          </p>
          <p className="mayordomia__aviso-texto">{mayordomia.avisoTexto}</p>
        </div>
      )}

      <div className="mayordomia__galeria" ref={galeriaRef}>
        {mayordomos.map((mayordomo) => {
          const nombre = mayordomo.nombre?.trim()

          return (
            <article
              className="mayordomia__retrato"
              key={`${mayordomo.cargo}-${mayordomo.dia}`}
              aria-label={nombre
                ? `${nombre}, ${mayordomo.cargo}`
                : `${mayordomo.cargo}, ${mayordomo.dia}: próximamente`}
            >
              <div className="mayordomia__marco" data-mayordomia-marco>
                {mayordomo.foto ? (
                  <img className="mayordomia__foto" src={mayordomo.foto} alt="" loading="lazy" />
                ) : (
                  <svg
                    className={`mayordomia__silueta${nombre ? '' : ' mayordomia__silueta--plantilla'}`}
                    viewBox="0 0 240 300"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <circle cx="120" cy="84" r="44" />
                    <path d="M20 300 38 226c13-52 44-77 82-77s69 25 82 77l18 74H20Z" />
                  </svg>
                )}
                {!nombre && (
                  <div className="mayordomia__sello" data-mayordomia-sello aria-hidden="true">
                    <span className="mayordomia__sello-etiqueta">{mayordomia.aviso}</span>
                    <img src="/assets/logos/monograma-oro-limpio.webp" alt="" />
                  </div>
                )}
              </div>

              <div className="mayordomia__datos">
                {nombre ? (
                  <>
                    <h2 className="mayordomia__nombre" data-mayordomia-tinta>{nombre}</h2>
                    <p className="mayordomia__cargo" data-mayordomia-tinta>{mayordomo.cargo}</p>
                  </>
                ) : (
                  <h2 className="mayordomia__cargo" data-mayordomia-tinta>{mayordomo.cargo}</h2>
                )}
                <p className="mayordomia__dia" data-mayordomia-tinta>{mayordomo.dia}</p>
                {!nombre && <p className="mayordomia__pendiente" data-mayordomia-tinta>Por anunciar</p>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
