import { useEffect, useRef, useState } from 'react'
import { createTimeline, stagger } from 'animejs'
import { comunicado } from '@/content/comunicado'
import '@/styles/comunicado.css'

function SelloDibujo({ id }: { id: string }) {
  return (
    <svg className="comunicado__sello-dibujo" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="32%" cy="28%" r="76%">
          <stop offset="0%" stopColor="#c33a43" />
          <stop offset="58%" stopColor="#8e1424" />
          <stop offset="100%" stopColor="#5c0b16" />
        </radialGradient>
      </defs>
      <path
        d="M50 3c5 5 9 7 13 5 2 6 5 9 11 9 0 6 2 10 8 13-3 6-3 10 1 15-5 4-6 8-3 14-6 2-9 6-8 12-6 0-10 3-12 9-6-2-10-1-14 4-4-5-8-6-14-4-2-6-6-9-12-9 1-6-2-10-8-12 3-6 2-10-3-14 4-5 4-9 1-15 6-3 8-7 8-13 6 0 9-3 11-9 6 2 10 0 14-5 2 2 4 3 7 3s5-1 7-3Z"
        fill={`url(#${id})`}
      />
      <circle cx="51" cy="53" r="31" fill="#4a0712" opacity=".34" />
      <circle cx="48" cy="47" r="30" fill="none" stroke="rgb(255 255 255 / .18)" strokeWidth="1.5" />
    </svg>
  )
}

export function Comunicado() {
  const [fase, setFase] = useState<'cerrado' | 'desplegando' | 'abriendo' | 'abierto'>('cerrado')
  const botonRef = useRef<HTMLButtonElement>(null)
  const pliegoRef = useRef<HTMLDivElement>(null)
  const panelSuperiorRef = useRef<HTMLDivElement>(null)
  const panelCentroRef = useRef<HTMLDivElement>(null)
  const panelInferiorRef = useRef<HTMLDivElement>(null)
  const selloRef = useRef<HTMLSpanElement>(null)
  const selloIzqRef = useRef<HTMLSpanElement>(null)
  const selloDerRef = useRef<HTMLSpanElement>(null)
  const hojaRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<ReturnType<typeof createTimeline> | null>(null)

  useEffect(() => {
    if (fase === 'abierto') hojaRef.current?.focus({ preventScroll: true })
  }, [fase])

  useEffect(() => () => {
    timelineRef.current?.revert()
  }, [])

  function abrir() {
    if (fase !== 'cerrado') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFase('abierto')
      return
    }

    const boton = botonRef.current
    const pliego = pliegoRef.current
    const superior = panelSuperiorRef.current
    const centro = panelCentroRef.current
    const inferior = panelInferiorRef.current
    const sello = selloRef.current
    const selloIzq = selloIzqRef.current
    const selloDer = selloDerRef.current
    const hoja = hojaRef.current

    if (!boton || !pliego || !superior || !centro || !inferior || !sello || !selloIzq || !selloDer || !hoja) {
      setFase('abierto')
      return
    }

    setFase('desplegando')

    const alto = centro.offsetHeight
    const tinta = hoja.querySelectorAll<HTMLElement>('[data-tinta]')
    const timeline = createTimeline({
      defaults: { ease: 'outExpo' },
      onComplete: () => setFase('abierto'),
    })

    timelineRef.current = timeline
    timeline
      .add(sello, { scale: [1, 1.08], duration: 120 }, 0)
      .add(sello, { scale: [1.08, 1], duration: 120 }, 80)
      .add(selloIzq, { translateX: -38, translateY: 10, rotate: -24, opacity: 0, duration: 450 }, 80)
      .add(selloDer, { translateX: 38, translateY: 10, rotate: 22, opacity: 0, duration: 450 }, 80)
      .add(superior, { rotateX: [-180, 0], top: [-alto, 0], duration: 700, ease: 'inOutCubic' }, '-=150')
      .add(centro, { top: [0, alto], duration: 700, ease: 'inOutCubic' }, '-=700')
      .add(inferior, { rotateX: [180, 0], top: [alto, alto * 2], duration: 700, ease: 'inOutCubic' }, '-=300')
      .add(pliego, { height: [alto, alto * 3], duration: 700, ease: 'inOutCubic' }, '-=700')
      .call(() => setFase('abriendo'))
      .add(boton, { opacity: [1, 0], duration: 450 })
      .add(hoja, { opacity: [0, 1], scale: [0.98, 1], duration: 450 }, '-=450')
      .add(
        tinta,
        { opacity: [0, 1], translateY: [10, 0], filter: ['blur(4px)', 'blur(0px)'], duration: 700, delay: stagger(90) },
      )
  }

  const escenaAbriendo = fase === 'abriendo'

  return (
    <section className="comunicado" aria-labelledby="comunicado-titulo">
      <div className={`comunicado__escena${escenaAbriendo ? ' comunicado__escena--abriendo' : ''}`}>
        {fase !== 'abierto' && (
          <button
            ref={botonRef}
            className="comunicado__pliego"
            type="button"
            aria-label={`${comunicado.etiqueta}: ${comunicado.pista}`}
            aria-expanded={fase === 'abriendo'}
            aria-controls="comunicado-hoja"
            aria-hidden={escenaAbriendo}
            disabled={fase !== 'cerrado'}
            onClick={abrir}
          >
            <span className="comunicado__contenedor" ref={pliegoRef}>
              <span className="comunicado__panel comunicado__panel--superior" ref={panelSuperiorRef}>
                <span className="comunicado__cara comunicado__cara--frente" />
                <span className="comunicado__cara comunicado__cara--dorso">
                  <span className="comunicado__rotulo">{comunicado.etiqueta}</span>
                  <span className="comunicado__pista">{comunicado.pista}</span>
                </span>
              </span>
              <span className="comunicado__panel comunicado__panel--centro" ref={panelCentroRef}>
                <span className="comunicado__cara comunicado__cara--frente" />
                <span className="comunicado__cara comunicado__cara--dorso" />
              </span>
              <span className="comunicado__panel comunicado__panel--inferior" ref={panelInferiorRef}>
                <span className="comunicado__cara comunicado__cara--frente" />
                <span className="comunicado__cara comunicado__cara--dorso" />
              </span>
              <span className="comunicado__sello" ref={selloRef} aria-hidden="true">
                <span ref={selloIzqRef} className="comunicado__sello-mitad comunicado__sello-mitad--izq">
                  <SelloDibujo id="comunicado-cera-izq" />
                  <img src="/assets/logos/monograma-oro-limpio.webp" alt="" />
                </span>
                <span ref={selloDerRef} className="comunicado__sello-mitad comunicado__sello-mitad--der">
                  <SelloDibujo id="comunicado-cera-der" />
                  <img src="/assets/logos/monograma-oro-limpio.webp" alt="" />
                </span>
              </span>
            </span>
          </button>
        )}

        <article
          ref={hojaRef}
          id="comunicado-hoja"
          className="comunicado__hoja"
          tabIndex={-1}
          hidden={fase !== 'abriendo' && fase !== 'abierto'}
        >
          <div className="comunicado__cruz" data-tinta aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <g className="comunicado__cruz-silueta">
                <rect x="45" y="13" width="10" height="79" rx="1" />
                <rect x="15" y="31" width="70" height="10" rx="1" />
                <circle cx="50" cy="9" r="6.5" />
                <circle cx="43.5" cy="15.5" r="5" />
                <circle cx="56.5" cy="15.5" r="5" />
                <circle cx="11" cy="36" r="6.5" />
                <circle cx="17.5" cy="29.5" r="5" />
                <circle cx="17.5" cy="42.5" r="5" />
                <circle cx="89" cy="36" r="6.5" />
                <circle cx="82.5" cy="29.5" r="5" />
                <circle cx="82.5" cy="42.5" r="5" />
                <path d="M39 96h22l-4-7H43Z" />
              </g>
              <path className="comunicado__cruz-filete" d="M50 17v70M19 36h62" />
            </svg>
          </div>
          <h2 id="comunicado-titulo" data-tinta>{comunicado.titulo}</h2>
          <div className="comunicado__filete" data-tinta aria-hidden="true" />
          <div className="comunicado__parrafos" data-tinta>
            {comunicado.parrafos.map((parrafo, indice) => {
              const inicioDestacado = parrafo.indexOf(comunicado.destacado)

              return (
                <p className={indice === 0 ? 'comunicado__parrafo comunicado__parrafo--primero' : 'comunicado__parrafo'} key={indice}>
                  {inicioDestacado < 0 ? (
                    parrafo
                  ) : (
                    <>
                      {parrafo.slice(0, inicioDestacado)}
                      <strong>{comunicado.destacado}</strong>
                      {parrafo.slice(inicioDestacado + comunicado.destacado.length)}
                    </>
                  )}
                </p>
              )
            })}
          </div>
          <div className="comunicado__divisor" data-tinta aria-hidden="true">
            <svg viewBox="0 0 20 20"><path d="m10 0 2 7 8 3-8 3-2 7-2-7-8-3 8-3Z" /></svg>
          </div>
          <p className="comunicado__cierre" data-tinta>{comunicado.cierre}</p>
          <p className="comunicado__lema" data-tinta>{comunicado.lema}</p>
        </article>
      </div>
    </section>
  )
}
