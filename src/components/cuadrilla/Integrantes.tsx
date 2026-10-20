import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, createLayout, createTimeline, onScroll, stagger } from 'animejs'
import { cuadrilla } from '@/content/cuadrilla'
import '@/styles/cuadrilla.css'

const ROLES_FILTRO = [
  { rol: null, etiqueta: 'Todos' },
  { rol: 'Caporal', etiqueta: 'Caporal' },
  { rol: 'Pampa', etiqueta: 'Negrito (Pampa)' },
  { rol: 'Guiador', etiqueta: 'Guiador' },
  { rol: 'Abanderado', etiqueta: 'Abanderado' },
  { rol: 'Corochano', etiqueta: 'Corochano' },
] as const

const MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'
const etiquetaRol = (rol: string) => rol === 'Pampa' ? 'Negrito (Pampa)' : rol

export function Integrantes() {
  const [filtro, setFiltro] = useState<string | null>(null)
  const [seleccionado, setSeleccionado] = useState<number | null>(null)
  const [reducido, setReducido] = useState(() => window.matchMedia(MOVIMIENTO_REDUCIDO).matches)
  const raizRef = useRef<HTMLElement>(null)
  const grillaRef = useRef<HTMLDivElement>(null)
  const dialogoRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const fotoDialogoRef = useRef<HTMLImageElement>(null)
  const tarjetaOrigenRef = useRef<HTMLButtonElement>(null)
  const layoutRef = useRef<ReturnType<typeof createLayout> | null>(null)
  const animacionDialogoRef = useRef<ReturnType<typeof createTimeline> | null>(null)
  const cierreEnCursoRef = useRef(false)
  const filtroAnteriorRef = useRef(filtro)

  const indicesVisibles = cuadrilla.flatMap((integrante, indice) =>
    filtro === null || integrante.rol === filtro ? [indice] : [],
  )
  const integranteActivo = seleccionado === null ? null : cuadrilla[seleccionado]
  const filtrosDisponibles = ROLES_FILTRO.filter(({ rol }) => rol === null || cuadrilla.some((integrante) => integrante.rol === rol))

  useEffect(() => {
    const consulta = window.matchMedia(MOVIMIENTO_REDUCIDO)
    const cambiar = () => setReducido(consulta.matches)
    consulta.addEventListener('change', cambiar)
    return () => consulta.removeEventListener('change', cambiar)
  }, [])

  useLayoutEffect(() => {
    const grilla = grillaRef.current
    const raiz = raizRef.current
    if (!grilla || !raiz) return

    const layout = createLayout(grilla, {
      children: '[data-integrante-card]',
      duration: 500,
      ease: 'outExpo',
      enterFrom: { opacity: 0, scale: 0.94 },
      leaveTo: { opacity: 0, scale: 0.92 },
    })
    layoutRef.current = layout
    return () => {
      layout.revert()
      layoutRef.current = null
    }
  }, [])

  useLayoutEffect(() => {
    if (filtroAnteriorRef.current === filtro) return
    filtroAnteriorRef.current = filtro
    if (reducido) return
    layoutRef.current?.animate()
  }, [filtro, reducido])

  useEffect(() => {
    const grilla = grillaRef.current
    const raiz = raizRef.current
    if (!grilla || !raiz || reducido) return

    raiz.classList.add('integrantes--revelando')
    const entrada = onScroll({
      target: grilla,
      repeat: false,
      onEnter: () => {
        raiz.classList.remove('integrantes--revelando')
        animate(grilla.querySelectorAll<HTMLElement>('[data-integrante-card]'), {
          opacity: [0, 1],
          translateY: [24, 0],
          delay: stagger(70),
          duration: 700,
          ease: 'outExpo',
        })
      },
    })
    return () => {
      raiz.classList.remove('integrantes--revelando')
      entrada.revert()
    }
  }, [reducido])

  useLayoutEffect(() => {
    const dialogo = dialogoRef.current
    const panel = panelRef.current
    const foto = fotoDialogoRef.current
    if (!dialogo || seleccionado === null || !panel || !foto) return

    cierreEnCursoRef.current = false
    if (!dialogo.open) dialogo.showModal()
    animacionDialogoRef.current?.cancel()
    if (reducido) {
      panel.style.removeProperty('opacity')
      panel.style.removeProperty('scale')
      foto.style.removeProperty('clip-path')
      return
    }

    const tinta = panel.querySelectorAll<HTMLElement>('[data-dialogo-tinta]')
    const timeline = createTimeline()
    animacionDialogoRef.current = timeline
    timeline.add(panel, {
      opacity: [0, 1],
      scale: [0.96, 1],
      duration: 350,
      ease: 'outExpo',
    }, 0)
    timeline.add(foto, {
      clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'],
      duration: 600,
      ease: 'outExpo',
    }, 0)
    timeline.add(tinta, {
      opacity: [0, 1],
      translateY: [16, 0],
      filter: ['blur(4px)', 'blur(0px)'],
      delay: stagger(90),
      duration: 700,
      ease: 'outExpo',
    }, 0)
    return () => { timeline.cancel() }
  }, [reducido, seleccionado])

  useEffect(() => () => { animacionDialogoRef.current?.cancel() }, [])

  const cerrarDialogo = () => {
    const dialogo = dialogoRef.current
    const panel = panelRef.current
    if (!dialogo?.open || cierreEnCursoRef.current) return
    cierreEnCursoRef.current = true
    animacionDialogoRef.current?.cancel()
    if (reducido || !panel) {
      dialogo.close()
      return
    }
    const timeline = createTimeline()
    animacionDialogoRef.current = timeline
    timeline.add(panel, { opacity: [1, 0], duration: 200, ease: 'outExpo' }, 0)
    timeline.call(() => dialogo.close(), 200)
  }

  const alCerrar = () => {
    cierreEnCursoRef.current = false
    animacionDialogoRef.current?.cancel()
    setSeleccionado(null)
    requestAnimationFrame(() => tarjetaOrigenRef.current?.focus())
  }

  const navegarDialogo = (direccion: -1 | 1) => {
    if (seleccionado === null || indicesVisibles.length < 2) return
    const posicion = indicesVisibles.indexOf(seleccionado)
    setSeleccionado(indicesVisibles[(posicion + direccion + indicesVisibles.length) % indicesVisibles.length])
  }

  const seleccionarFiltro = (nuevoFiltro: string | null) => {
    if (filtro === nuevoFiltro) return
    if (!reducido) layoutRef.current?.record()
    setFiltro(nuevoFiltro)
  }

  return (
    <section className="seccion integrantes" ref={raizRef} aria-labelledby="integrantes-titulo">
      <div className="seccion__titulo">
        <h2 id="integrantes-titulo">Quiénes la bailan</h2>
      </div>
      <p className="integrantes__intro">Conoce a quienes llevan la tradición de Paucarbambilla a las calles.</p>

      <div className="integrantes__filtros" role="group" aria-label="Filtrar integrantes por rol">
        {filtrosDisponibles.map(({ rol, etiqueta }) => {
          const cantidad = rol === null ? cuadrilla.length : cuadrilla.filter((integrante) => integrante.rol === rol).length
          return (
            <button
              key={etiqueta}
              className="integrantes__filtro"
              type="button"
              aria-pressed={filtro === rol}
              onClick={() => seleccionarFiltro(rol)}
            >
              {etiqueta} ({cantidad})
            </button>
          )
        })}
      </div>

      <div className="integrantes__grilla" ref={grillaRef}>
        {indicesVisibles.map((indice) => {
          const integrante = cuadrilla[indice]
          return (
            <button
              key={integrante.nombre}
              className="integrantes__tarjeta"
              data-integrante-card
              type="button"
              onClick={(evento) => {
                tarjetaOrigenRef.current = evento.currentTarget
                setSeleccionado(indice)
              }}
              aria-label={`Ver a ${integrante.nombre}, ${etiquetaRol(integrante.rol)}`}
            >
              <img src={integrante.foto} alt="" loading="lazy" />
              <span className="integrantes__nombre">{integrante.nombre}</span>
              <span className="integrantes__rol">{etiquetaRol(integrante.rol)}</span>
            </button>
          )
        })}
      </div>

      <dialog
        className="integrantes__dialogo"
        ref={dialogoRef}
        aria-label={integranteActivo ? `Perfil de ${integranteActivo.nombre}` : 'Perfil del integrante'}
        onCancel={(evento) => {
          evento.preventDefault()
          cerrarDialogo()
        }}
        onClose={alCerrar}
        onClick={(evento) => {
          if (evento.target === evento.currentTarget) cerrarDialogo()
        }}
        onKeyDown={(evento) => {
          if (evento.key === 'ArrowLeft' || evento.key === 'ArrowRight') {
            evento.preventDefault()
            navegarDialogo(evento.key === 'ArrowRight' ? 1 : -1)
          }
        }}
      >
        {integranteActivo && (
          <div className="integrantes__dialogo-panel" ref={panelRef}>
            <button className="integrantes__cerrar" type="button" aria-label="Cerrar" onClick={cerrarDialogo}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
            <img
              className="integrantes__dialogo-foto"
              ref={fotoDialogoRef}
              src={integranteActivo.foto}
              alt=""
            />
            <div className="integrantes__dialogo-texto">
              <h2 data-dialogo-tinta>{integranteActivo.nombre}</h2>
              <p className="integrantes__dialogo-rol" data-dialogo-tinta>{etiquetaRol(integranteActivo.rol)}</p>
              {integranteActivo.resena && <p className="integrantes__resena" data-dialogo-tinta>{integranteActivo.resena}</p>}
              <div className="integrantes__dialogo-nav">
                <button type="button" aria-label="Integrante anterior" onClick={() => navegarDialogo(-1)} disabled={indicesVisibles.length < 2}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <span>{indicesVisibles.indexOf(seleccionado ?? -1) + 1} / {indicesVisibles.length}</span>
                <button type="button" aria-label="Integrante siguiente" onClick={() => navegarDialogo(1)} disabled={indicesVisibles.length < 2}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
