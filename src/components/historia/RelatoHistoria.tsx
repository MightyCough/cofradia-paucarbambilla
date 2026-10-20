import { useEffect, useRef, useState } from 'react'
import { animate, createDrawable, createScope, onScroll, stagger } from 'animejs'
import { fotos } from '@/content/fotos'
import { historia, type VisualCapitulo } from '@/content/historia'
import { FotoMarcador } from '@/components/ui/FotoMarcador'
import '@/styles/historia.css'

function ContenidoVisual({ visual, loading = 'lazy' }: { visual: VisualCapitulo; loading?: 'eager' | 'lazy' }) {
  switch (visual.tipo) {
    case 'foto':
      return (
        <img
          className="relato__imagen"
          src={visual.src}
          srcSet={`${visual.srcChica} 900w, ${visual.src} 1600w`}
          sizes="(min-width: 960px) 45vw, (min-width: 640px) 75vw, calc(100vw - 3rem)"
          alt={visual.alt}
          loading={loading}
        />
      )
    case 'marcador':
      return (
        <FotoMarcador
          etiqueta={fotos.fundadores.alt}
          medidas="1600 × 1200 px"
          proporcion="4 / 3"
          foto={fotos.fundadores}
          className="relato__marcador"
        />
      )
    case 'escudo':
      return (
        <div className="relato__escudo">
          <img
            data-relato-escudo
            src="/assets/logos/escudo-900.webp"
            srcSet="/assets/logos/escudo-900.webp 900w, /assets/logos/escudo-1600.webp 1600w"
            sizes="(min-width: 960px) 35vw, 70vw"
            alt=""
            loading={loading}
          />
          <div className="relato__fecha" data-relato-fecha>
            <span aria-hidden="true" />
            <p>{visual.fecha}</p>
            <span aria-hidden="true" />
          </div>
        </div>
      )
  }
}

function Roles() {
  return (
    <p className="relato__roles" aria-label="Caporales, Pampas y Corochanos">
      <span data-relato-rol>Caporales</span>
      <span data-relato-rol>Pampas</span>
      <span data-relato-rol>Corochanos</span>
    </p>
  )
}

export function RelatoHistoria() {
  const [activo, setActivo] = useState(0)
  const activoRef = useRef(-1)
  const raizRef = useRef<HTMLElement>(null)
  const capitulosRef = useRef<HTMLDivElement>(null)
  const flechaRef = useRef<SVGSVGElement>(null)
  const hiloRef = useRef<SVGPathElement>(null)
  const articulosRef = useRef<(HTMLElement | null)[]>([])
  const visualesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raiz = raizRef.current
    const capitulos = capitulosRef.current
    if (!raiz || !capitulos || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const scope = createScope({ root: raizRef })

    scope.add((contexto) => {
      if (!contexto) return

      if (flechaRef.current) {
        animate(flechaRef.current, {
          translateY: [0, -6],
          duration: 1000,
          ease: 'inOutSine',
          alternate: true,
          loop: true,
        })
      }

      if (hiloRef.current) {
        const recorrido = onScroll({
          target: capitulos,
          sync: true,
          enter: 'end start',
          leave: 'start end',
        })
        animate(createDrawable(hiloRef.current, 0, 0), {
          draw: ['0 0', '0 1'],
          duration: 1000,
          ease: 'linear',
          autoplay: recorrido,
        })
      }

      const revelados = new Set<number>()
      contexto.add('activarCapitulo', (indice: number) => {
        const anterior = activoRef.current
        activoRef.current = indice
        setActivo(indice)

        const romboAnterior = articulosRef.current[anterior]?.querySelector<HTMLElement>('[data-relato-rombo]')
        const romboActual = articulosRef.current[indice]?.querySelector<HTMLElement>('[data-relato-rombo]')
        if (anterior !== indice) {
          if (romboAnterior) {
            animate(romboAnterior, {
              scale: [1, 0.6],
              duration: 260,
              ease: 'outExpo',
            })
          }

          if (romboActual) {
            animate(romboActual, {
              scale: [0.6, 1],
              duration: 420,
              ease: 'outExpo',
            })
          }

          const capaAnterior = visualesRef.current?.querySelector<HTMLElement>(`[data-relato-visual="${anterior}"]`)
          const capaActual = visualesRef.current?.querySelector<HTMLElement>(`[data-relato-visual="${indice}"]`)
          if (capaAnterior) animate(capaAnterior, { opacity: [1, 0], duration: 260, ease: 'outExpo' })
          if (capaActual) {
            animate(capaActual, { opacity: [0, 1], scale: [1.06, 1], duration: 900, ease: 'outExpo' })
          }
        }

        const articulo = articulosRef.current[indice]
        if (articulo && !revelados.has(indice)) {
          revelados.add(indice)
          animate(articulo.querySelectorAll<HTMLElement>('[data-relato-tinta]'), {
            opacity: [0, 1],
            translateY: [16, 0],
            filter: ['blur(4px)', 'blur(0px)'],
            delay: stagger(90),
            duration: 700,
            ease: 'outExpo',
          })
        }

        if (indice === 2) {
          raiz.querySelectorAll<HTMLElement>('[data-relato-escudo]').forEach((escudo) => {
            animate(escudo, { scale: [0.92, 1], opacity: [0, 1], duration: 800, ease: 'outExpo' })
          })
          raiz.querySelectorAll<HTMLElement>('[data-relato-fecha]').forEach((fecha) => {
            animate(fecha, {
              clipPath: ['inset(0 50% 0 50%)', 'inset(0 0 0 0)'],
              duration: 700,
              ease: 'outExpo',
            })
          })
        }

        if (indice === 3) {
          animate(raiz.querySelectorAll<HTMLElement>('[data-relato-rol]'), {
            opacity: [0, 1],
            translateY: [12, 0],
            delay: stagger(120),
            duration: 600,
            ease: 'outExpo',
          })
        }
      })

      articulosRef.current.forEach((articulo, indice) => {
        if (!articulo) return
        onScroll({
          target: articulo,
          enter: 'center top',
          leave: 'center bottom',
          onEnter: () => contexto.methods.activarCapitulo(indice),
          onEnterBackward: () => contexto.methods.activarCapitulo(indice),
        })
      })
    })

    raiz.classList.add('relato--animado')
    return () => {
      scope.revert()
      raiz.classList.remove('relato--animado')
    }
  }, [])

  return (
    <section className="relato" ref={raizRef} aria-labelledby="relato-titulo">
      <header className="relato__encabezado">
        <h1 id="relato-titulo">{historia.titulo}</h1>
        <p>{historia.subtitulo}</p>
        <div className="relato__desliza" aria-hidden="true">
          <span>Desliza</span>
          <svg ref={flechaRef} viewBox="0 0 24 24" fill="none">
            <path d="m5 9 7 7 7-7" />
          </svg>
        </div>
      </header>

      <div className="relato__cuerpo">
        <div className="relato__columna-texto">
          <div className="relato__capitulos" ref={capitulosRef}>
            <svg className="relato__hilo" viewBox="0 0 20 1000" preserveAspectRatio="none" aria-hidden="true">
              <path className="relato__hilo-base" d="M10 0V1000" />
              <path className="relato__hilo-oro" ref={hiloRef} d="M10 0V1000" />
            </svg>
            <div className="relato__lista">
              {historia.capitulos.map((capitulo, indice) => (
                <article
                  className={`relato__capitulo${activo === indice ? ' relato__capitulo--activo' : ''}`}
                  key={capitulo.numero}
                  ref={(elemento) => {
                    articulosRef.current[indice] = elemento
                  }}
                  aria-labelledby={`relato-capitulo-${indice}`}
                >
                  <div className="relato__visual-capitulo">
                    <div className="relato__marco">
                      <ContenidoVisual visual={capitulo.visual} loading={indice === 0 ? 'eager' : 'lazy'} />
                      {indice === 3 && <Roles />}
                    </div>
                  </div>
                  <div className="relato__texto">
                    <span className="relato__rombo" data-relato-rombo aria-hidden="true" />
                    <span className="relato__numero" data-relato-tinta>{capitulo.numero}</span>
                    <h2 id={`relato-capitulo-${indice}`} data-relato-tinta>{capitulo.titulo}</h2>
                    <p data-relato-tinta>{capitulo.texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="relato__visual-sticky" aria-label="Imágenes de la historia">
          <div className="relato__marco" ref={visualesRef}>
            {historia.capitulos.map((capitulo, indice) => (
              <div
                className={`relato__capa${activo === indice ? ' relato__capa--activa' : ''}`}
                data-relato-visual={indice}
                key={capitulo.numero}
                aria-hidden={activo !== indice}
              >
                <ContenidoVisual visual={capitulo.visual} loading={indice === 0 ? 'eager' : 'lazy'} />
                {indice === 3 && <Roles />}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
