import { useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import { createTimeline, stagger } from 'animejs'
import { rolesDanza } from '@/content/roles'
import '@/styles/cuadrilla.css'

const MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'

export function EscenarioRoles() {
  const [activo, setActivo] = useState(0)
  const [reducido, setReducido] = useState(() => window.matchMedia(MOVIMIENTO_REDUCIDO).matches)
  const [hover, setHover] = useState(false)
  const [foco, setFoco] = useState(false)
  const [pausaManual, setPausaManual] = useState(false)
  const [pestanaVisible, setPestanaVisible] = useState(() => document.visibilityState === 'visible')
  const raizRef = useRef<HTMLElement>(null)
  const imagenesRef = useRef<(HTMLImageElement | null)[]>([])
  const nombreRef = useRef<HTMLHeadingElement>(null)
  const anteriorRef = useRef(0)
  const inicioToqueRef = useRef<number | null>(null)

  useEffect(() => {
    const consulta = window.matchMedia(MOVIMIENTO_REDUCIDO)
    const cambiar = () => setReducido(consulta.matches)
    const cambiarVisibilidad = () => setPestanaVisible(document.visibilityState === 'visible')
    consulta.addEventListener('change', cambiar)
    document.addEventListener('visibilitychange', cambiarVisibilidad)
    return () => {
      consulta.removeEventListener('change', cambiar)
      document.removeEventListener('visibilitychange', cambiarVisibilidad)
    }
  }, [])

  useEffect(() => {
    if (reducido || pausaManual || hover || foco || !pestanaVisible) return
    const temporizador = window.setInterval(() => {
      setActivo((actual) => (actual + 1) % rolesDanza.length)
    }, 7000)
    return () => window.clearInterval(temporizador)
  }, [foco, hover, pausaManual, pestanaVisible, reducido])

  useLayoutEffect(() => {
    const imagenActiva = imagenesRef.current[activo]
    const nombre = nombreRef.current
    if (!imagenActiva || !nombre) return

    for (const imagen of imagenesRef.current) {
      if (!imagen) continue
      imagen.style.removeProperty('visibility')
      imagen.style.removeProperty('opacity')
      imagen.style.removeProperty('clip-path')
      imagen.style.removeProperty('scale')
    }

    if (reducido) {
      anteriorRef.current = activo
      return
    }

    const indiceAnterior = anteriorRef.current
    const imagenAnterior = imagenesRef.current[indiceAnterior]
    const timeline = createTimeline()
    const letras = nombre.querySelectorAll<HTMLElement>('.escenario__letra')
    const tinta = raizRef.current?.querySelectorAll<HTMLElement>('[data-escenario-tinta]')

    if (indiceAnterior === activo || !imagenAnterior) {
      timeline.add(imagenActiva, {
        opacity: [0, 1],
        scale: [1.05, 1],
        duration: 800,
        ease: 'outExpo',
      }, 0)
    } else {
      const avanza = activo > indiceAnterior
      const salida = avanza ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)'
      const entrada = avanza ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
      imagenAnterior.style.visibility = 'visible'
      imagenAnterior.style.opacity = '1'
      imagenActiva.style.visibility = 'visible'
      imagenActiva.style.clipPath = entrada
      imagenActiva.style.scale = '1.08'
      timeline.add(imagenAnterior, {
        clipPath: ['inset(0 0 0 0)', salida],
        duration: 600,
        ease: 'inOutQuart',
      }, 0)
      timeline.add(imagenActiva, {
        clipPath: [entrada, 'inset(0 0 0 0)'],
        scale: [1.08, 1],
        duration: 800,
        ease: 'outExpo',
      }, 0)
      timeline.call(() => {
        imagenAnterior.style.visibility = 'hidden'
        imagenAnterior.style.removeProperty('clip-path')
        imagenActiva.style.removeProperty('clip-path')
      }, 800)
    }

    timeline.add(letras, {
      opacity: [0, 1],
      translateY: ['0.4em', 0],
      delay: stagger(30),
      duration: 600,
      ease: 'outExpo',
    }, 0)
    if (tinta?.length) {
      timeline.add(tinta, {
        opacity: [0, 1],
        translateY: [16, 0],
        filter: ['blur(4px)', 'blur(0px)'],
        delay: stagger(90),
        duration: 700,
        ease: 'outExpo',
      }, 0)
    }

    anteriorRef.current = activo
    return () => { timeline.cancel() }
  }, [activo, reducido])

  const marcarInteraccion = () => setPausaManual(true)
  const cambiarA = (indice: number) => {
    marcarInteraccion()
    setActivo((indice + rolesDanza.length) % rolesDanza.length)
  }

  const manejarTeclado = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (evento.key === 'ArrowRight' || evento.key === 'ArrowLeft') {
      evento.preventDefault()
      cambiarA(activo + (evento.key === 'ArrowRight' ? 1 : -1))
      raizRef.current?.querySelector<HTMLButtonElement>(`[data-escenario-tab="${(activo + (evento.key === 'ArrowRight' ? 1 : -1) + rolesDanza.length) % rolesDanza.length}"]`)?.focus()
    }
  }

  const manejarFoco = (evento: FocusEvent<HTMLElement>) => {
    setFoco(evento.type === 'focus' || (evento.relatedTarget instanceof Node && Boolean(raizRef.current?.contains(evento.relatedTarget))))
  }

  const rol = rolesDanza[activo]

  return (
    <section
      id="cuadrilla"
      className="seccion escenario"
      ref={raizRef}
      aria-labelledby="escenario-titulo"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={manejarFoco}
      onBlur={manejarFoco}
    >
      <div className="seccion__titulo">
        <h1 id="escenario-titulo">Los personajes de la danza</h1>
      </div>

      <div className="escenario__contenido">
        <div
          className="escenario__marco"
          onPointerDown={(evento) => {
            marcarInteraccion()
            inicioToqueRef.current = evento.pointerType === 'touch' ? evento.clientX : null
            if (inicioToqueRef.current !== null) evento.currentTarget.setPointerCapture(evento.pointerId)
          }}
          onPointerUp={(evento) => {
            if (inicioToqueRef.current === null) return
            const desplazamiento = evento.clientX - inicioToqueRef.current
            inicioToqueRef.current = null
            if (Math.abs(desplazamiento) >= 40) cambiarA(activo + (desplazamiento < 0 ? 1 : -1))
          }}
          onPointerCancel={() => { inicioToqueRef.current = null }}
          aria-label="Fotografía del personaje activo; desliza para cambiar"
        >
          {rolesDanza.map((personaje, indice) => (
            <img
              key={personaje.valor}
              className="escenario__imagen"
              ref={(elemento) => { imagenesRef.current[indice] = elemento }}
              src={personaje.foto}
              alt={indice === activo ? personaje.etiqueta : ''}
              aria-hidden={indice !== activo}
              loading={indice === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          ))}
        </div>

        <div className="escenario__texto" role="tabpanel" id="escenario-panel" aria-labelledby={`escenario-tab-${activo}`}>
          <p className="escenario__numero" data-escenario-tinta aria-hidden="true">
            {String(activo + 1).padStart(2, '0')} / {String(rolesDanza.length).padStart(2, '0')}
          </p>
          <h2 className="escenario__nombre" ref={nombreRef} aria-label={rol.etiqueta}>
            {Array.from(rol.etiqueta).map((letra, indice) => (
              <span className="escenario__letra" aria-hidden="true" key={`${indice}-${letra}`}>
                {letra === ' ' ? '\u00a0' : letra}
              </span>
            ))}
          </h2>
          <span className="escenario__filete" data-escenario-tinta aria-hidden="true" />
          <p className="escenario__descripcion" data-escenario-tinta>{rol.descripcion}</p>
          <div className="escenario__controles">
            <button className="escenario__flecha" type="button" aria-label="Personaje anterior" onClick={() => cambiarA(activo - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button
              className="escenario__pausa"
              type="button"
              aria-label={pausaManual ? 'Reanudar avance automático' : 'Pausar avance automático'}
              onClick={() => {
                setPausaManual((pausado) => !pausado)
              }}
              hidden={reducido}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {pausaManual ? <path d="m9 5 10 7-10 7z" /> : <path d="M8 5v14M16 5v14" />}
              </svg>
            </button>
            <button className="escenario__flecha" type="button" aria-label="Personaje siguiente" onClick={() => cambiarA(activo + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="escenario__desfile" role="tablist" aria-label="Personajes de la danza" onKeyDown={manejarTeclado}>
        {rolesDanza.map((personaje, indice) => (
          <button
            key={personaje.valor}
            id={`escenario-tab-${indice}`}
            className="escenario__tab"
            data-escenario-tab={indice}
            type="button"
            role="tab"
            aria-selected={activo === indice}
            aria-controls="escenario-panel"
            tabIndex={activo === indice ? 0 : -1}
            onClick={() => cambiarA(indice)}
          >
            <img src={personaje.foto} alt="" loading="lazy" />
            <span>{personaje.etiqueta}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
