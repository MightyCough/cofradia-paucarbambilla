import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { animate, createScope, onScroll, stagger, type Target } from 'animejs'
import { programa, type DiaFiesta } from '@/content/eventos'
import { CuentaRegresiva } from '@/components/actividades/CuentaRegresiva'
import { HojaAlmanaque } from '@/components/actividades/HojaAlmanaque'
import '@/styles/actividades.css'

const MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'
const GIROS = [-2, 1.5, -1, 2]
const GIROS_ENTRADA = [-5, 4, -3, 6]
const dias: DiaFiesta[] = programa.dias

export function ProgramaFiesta() {
  const raizRef = useRef<HTMLElement>(null)
  const grillaRef = useRef<HTMLUListElement>(null)
  const brilloRef = useRef<HTMLSpanElement>(null)
  const [movimientoReducido, setMovimientoReducido] = useState(() =>
    window.matchMedia(MOVIMIENTO_REDUCIDO).matches,
  )
  const hayActividades = dias.some((dia) => (dia.actividades?.length ?? 0) > 0)

  useEffect(() => {
    const consulta = window.matchMedia(MOVIMIENTO_REDUCIDO)
    const actualizar = () => setMovimientoReducido(consulta.matches)
    consulta.addEventListener('change', actualizar)
    return () => consulta.removeEventListener('change', actualizar)
  }, [])

  useLayoutEffect(() => {
    const raiz = raizRef.current
    const grilla = grillaRef.current
    if (!raiz || !grilla || movimientoReducido) return

    const scope = createScope({ root: raiz })
    raiz.classList.add('programa--revelando')
    raiz.classList.add('programa--tinta')
    scope.add(() => {
      const tinta = raiz.querySelectorAll<HTMLElement>('[data-programa-tinta]')
      animate(tinta, {
        opacity: [0, 1],
        translateY: [14, 0],
        filter: ['blur(4px)', 'blur(0px)'],
        duration: 650,
        ease: 'outExpo',
        onComplete: () => raiz.classList.remove('programa--tinta'),
      })

      const letras = brilloRef.current?.querySelectorAll<HTMLSpanElement>('span')
      if (letras?.length && !hayActividades) {
        animate(letras, {
          opacity: [0, 1, 0],
          delay: stagger(75),
          duration: 450,
          loop: true,
          loopDelay: 2500,
          ease: 'inOutSine',
        })
      }

      onScroll({
        target: grilla,
        repeat: false,
        onEnter: () => scope.execute(() => {
          const hojas = grilla.querySelectorAll<HTMLElement>('[data-programa-hoja]')
          animate(hojas, {
            opacity: [0, 1],
            translateY: ['-40px', '0px'],
            rotate: (_objetivo: Target | undefined, indice = 0) => {
              const giro = indice % GIROS.length
              return [`${GIROS_ENTRADA[giro] - GIROS[giro]}deg`, '0deg']
            },
            delay: stagger(150),
            duration: 900,
            ease: 'outBack',
            onComplete: () => raiz.classList.remove('programa--revelando'),
          })
        }),
      })
    })

    return () => {
      scope.revert()
      raiz.classList.remove('programa--revelando')
      raiz.classList.remove('programa--tinta')
    }
  }, [hayActividades, movimientoReducido])

  return (
    <section className="seccion programa" ref={raizRef} aria-labelledby="programa-titulo">
      <header className="programa__cabecera">
        <div className="seccion__titulo">
          <h1 id="programa-titulo" data-programa-tinta>{programa.titulo}</h1>
        </div>
        <p className="programa__introduccion" data-programa-tinta>{programa.intro}</p>
      </header>

      <CuentaRegresiva />

      {!hayActividades && (
        <div className="programa__aviso" role="status">
          <div className="programa__ornamento" aria-hidden="true">
            <span />
            <span className="programa__rombo" />
            <span />
          </div>
          <p className="programa__aviso-titulo">
            <span>{programa.aviso}</span>
            <span className="programa__brillo" ref={brilloRef} aria-hidden="true">
              {[...programa.aviso].map((letra, indice) => <span key={`${letra}-${indice}`}>{letra}</span>)}
            </span>
          </p>
          <p className="programa__aviso-texto">{programa.avisoTexto}</p>
        </div>
      )}

      <ul className="programa__almanaques" ref={grillaRef}>
        {dias.map((dia, indice) => (
          <li
            className="programa__elemento"
            data-programa-hoja
            key={dia.fecha}
            style={{ '--giro-hoja': `${GIROS[indice % GIROS.length]}deg` } as CSSProperties}
          >
            <HojaAlmanaque dia={dia} movimientoReducido={movimientoReducido} />
          </li>
        ))}
      </ul>
    </section>
  )
}
