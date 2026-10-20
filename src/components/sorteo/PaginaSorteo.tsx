import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, createScope, onScroll, stagger } from 'animejs'
import { Link } from 'react-router-dom'
import { sorteo, type Premio } from '@/content/sorteo'
import '@/styles/sorteo.css'

const MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'
const FECHA_LIMA = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'America/Lima',
})

interface TiempoRestante {
  dias: number
  horas: number
  minutos: number
  segundos: number
}

function calcularTiempo(fecha: number, ahora: number): TiempoRestante {
  const total = Math.max(0, Math.ceil((fecha - ahora) / 1000))
  return {
    dias: Math.floor(total / 86_400),
    horas: Math.floor((total % 86_400) / 3_600),
    minutos: Math.floor((total % 3_600) / 60),
    segundos: total % 60,
  }
}

function DigitoRodante({ valor, movimientoReducido }: { valor: string; movimientoReducido: boolean }) {
  const ranuraRef = useRef<HTMLSpanElement>(null)
  const salienteRef = useRef<HTMLSpanElement>(null)
  const entranteRef = useRef<HTMLSpanElement>(null)
  const [cambio, setCambio] = useState<{ valor: string; saliente: string | null }>({ valor, saliente: null })

  if (cambio.valor !== valor) {
    setCambio({ valor, saliente: movimientoReducido ? null : cambio.valor })
  } else if (movimientoReducido && cambio.saliente !== null) {
    setCambio({ valor, saliente: null })
  }

  useLayoutEffect(() => {
    if (cambio.saliente === null || movimientoReducido || !ranuraRef.current) return
    const scope = createScope({ root: ranuraRef })
    scope.add(() => {
      if (salienteRef.current) {
        animate(salienteRef.current, {
          translateY: '-100%',
          duration: 450,
          ease: 'outExpo',
          onComplete: () => setCambio((anterior) => ({ ...anterior, saliente: null })),
        })
      }
      if (entranteRef.current) {
        animate(entranteRef.current, {
          translateY: ['100%', '0%'],
          duration: 450,
          ease: 'outExpo',
        })
      }
    })
    return () => scope.revert()
  }, [cambio.saliente, movimientoReducido])

  return (
    <span className="sorteo__digito" ref={ranuraRef}>
      {cambio.saliente !== null && (
        <span className="sorteo__digito-saliente" ref={salienteRef}>{cambio.saliente}</span>
      )}
      <span
        className={cambio.saliente === null ? 'sorteo__digito-actual' : 'sorteo__digito-entrante'}
        ref={entranteRef}
      >
        {valor}
      </span>
    </span>
  )
}

function CuentaSorteo({ fecha, movimientoReducido }: { fecha: string; movimientoReducido: boolean }) {
  const fechaMarca = Date.parse(fecha)
  const [ahora, setAhora] = useState(() => Date.now())
  const [minutoAccesible, setMinutoAccesible] = useState(() => Math.floor(Date.now() / 60_000))

  useEffect(() => {
    const actualizar = () => {
      const marca = Date.now()
      setAhora(marca)
      const minuto = Math.floor(marca / 60_000)
      setMinutoAccesible((anterior) => anterior === minuto ? anterior : minuto)
    }
    const temporizador = window.setInterval(actualizar, 1000)
    return () => window.clearInterval(temporizador)
  }, [])

  const restante = calcularTiempo(fechaMarca, ahora)
  const accesible = calcularTiempo(fechaMarca, minutoAccesible * 60_000)
  const unidades = [
    { etiqueta: 'días', valor: restante.dias },
    { etiqueta: 'horas', valor: restante.horas },
    { etiqueta: 'minutos', valor: restante.minutos },
    { etiqueta: 'segundos', valor: restante.segundos },
  ]

  return (
    <div className="sorteo__cuenta" role="group" aria-label="Cuenta regresiva para el sorteo">
      <p className="sorteo__cuenta-titulo">Falta para el sorteo</p>
      <div className="sorteo__reloj" aria-hidden="true">
        {unidades.map((unidad, indice) => (
          <span className="sorteo__unidad-par" key={unidad.etiqueta}>
            {indice > 0 && <span className="sorteo__separador" aria-hidden="true">·</span>}
            <span className="sorteo__unidad">
              <span className="sorteo__numero">
                {[...String(unidad.valor).padStart(2, '0')].map((digito, digitoIndice) => (
                  <DigitoRodante
                    key={digitoIndice}
                    valor={digito}
                    movimientoReducido={movimientoReducido}
                  />
                ))}
              </span>
              <span className="sorteo__unidad-etiqueta">{unidad.etiqueta}</span>
            </span>
          </span>
        ))}
      </div>
      <p className="sorteo__sr-only" aria-live="polite">
        Faltan {accesible.dias} {accesible.dias === 1 ? 'día' : 'días'}, {accesible.horas} {accesible.horas === 1 ? 'hora' : 'horas'} y {accesible.minutos} {accesible.minutos === 1 ? 'minuto' : 'minutos'}.
      </p>
      <p className="sorteo__fecha">{FECHA_LIMA.format(fechaMarca)}, hora de Lima</p>
    </div>
  )
}

function AvisoSorteo() {
  return (
    <div className="sorteo__aviso" role="status">
      <div className="sorteo__ornamento" aria-hidden="true">
        <span />
        <span className="sorteo__rombo" />
        <span />
      </div>
      <p className="sorteo__aviso-titulo">
        <span>{sorteo.aviso}</span>
        <span className="sorteo__brillo" aria-hidden="true">
          {[...sorteo.aviso].map((letra, indice) => <span key={`${letra}-${indice}`}>{letra}</span>)}
        </span>
      </p>
      <p className="sorteo__aviso-texto">{sorteo.avisoTexto}</p>
    </div>
  )
}

function BoletoPrincipal() {
  return (
    <article className="sorteo__boleto-principal" aria-label="Boleto de muestra del sorteo">
      <div className="sorteo__boleto-cuerpo">
        <p className="sorteo__boleto-cofradia">Cuadrilla Niño Jesús de Paucarbambilla</p>
        <h2 className="sorteo__boleto-titulo">Gran sorteo pro-fondos</h2>
        <div className="sorteo__boleto-pie">
          <span>Ticket N.º ----</span>
          <span className="sorteo__boleto-precio">
            {sorteo.precioTicket === null ? 'Precio por anunciar' : `S/ ${sorteo.precioTicket}`}
          </span>
        </div>
      </div>
      <div className="sorteo__talon" aria-hidden="true">
        {!sorteo.fecha && (
          <span className="sorteo__sello">
            <span className="sorteo__sello-texto">Próximamente</span>
            <span className="sorteo__sello-centro">NJ</span>
          </span>
        )}
      </div>
    </article>
  )
}

function RegaloPendiente() {
  return (
    <div className="sorteo__regalo" aria-hidden="true">
      <svg viewBox="0 0 120 112" focusable="false">
        <path d="M15 47h90v57H15zM8 31h104v20H8zM60 31H37c-13 0-18-16-8-23 12-8 27 5 31 23Zm0 0h23c13 0 18-16 8-23-12-8-27 5-31 23Z" />
        <path d="M60 31v73" />
      </svg>
    </div>
  )
}

function BoletoPremio({ premio }: { premio: Premio }) {
  const nombre = premio.nombre?.trim()

  return (
    <article className="sorteo__boleto-premio">
      <p className="sorteo__premio-categoria">{premio.categoria}</p>
      {nombre ? (
        <>
          {premio.foto ? (
            <img className="sorteo__premio-foto" src={premio.foto} alt={nombre} loading="lazy" />
          ) : null}
          <h3 className="sorteo__premio-nombre">{nombre}</h3>
          {premio.detalle && <p className="sorteo__premio-detalle">{premio.detalle}</p>}
          {premio.cantidad !== undefined && (
            <p className="sorteo__premio-cantidad">{premio.cantidad} {premio.cantidad === 1 ? 'disponible' : 'disponibles'}</p>
          )}
        </>
      ) : (
        <>
          <RegaloPendiente />
          <p className="sorteo__premio-pendiente">Por anunciar</p>
        </>
      )}
    </article>
  )
}

function MetodoPago({ nombre, numero, copiar }: {
  nombre: string
  numero: string
  copiar: (nombre: string, numero: string) => void
}) {
  return (
    <div className="sorteo__metodo">
      <p><strong>{nombre}:</strong> <span>{numero}</span></p>
      <button
        className="sorteo__copiar"
        type="button"
        aria-label={`Copiar número de ${nombre}`}
        onClick={() => copiar(nombre, numero)}
      >
        Copiar número
      </button>
    </div>
  )
}

export function PaginaSorteo() {
  const raizRef = useRef<HTMLElement>(null)
  const boletosRef = useRef<HTMLDivElement>(null)
  const pasosRef = useRef<HTMLOListElement>(null)
  const hiloRef = useRef<HTMLSpanElement>(null)
  const brilloRef = useRef<HTMLSpanElement>(null)
  const [movimientoReducido, setMovimientoReducido] = useState(() =>
    window.matchMedia(MOVIMIENTO_REDUCIDO).matches,
  )
  const [avisoCopia, setAvisoCopia] = useState('')

  useEffect(() => {
    const consulta = window.matchMedia(MOVIMIENTO_REDUCIDO)
    const actualizar = () => setMovimientoReducido(consulta.matches)
    consulta.addEventListener('change', actualizar)
    return () => consulta.removeEventListener('change', actualizar)
  }, [])

  useLayoutEffect(() => {
    const raiz = raizRef.current
    const boletos = boletosRef.current
    const pasos = pasosRef.current
    const hilo = hiloRef.current
    if (!raiz || !boletos || !pasos || !hilo || movimientoReducido) return

    const scope = createScope({ root: raiz })
    raiz.classList.add('sorteo--revelando', 'sorteo--tinta')
    scope.add(() => {
      const tinta = raiz.querySelectorAll<HTMLElement>('[data-sorteo-tinta]')
      animate(tinta, {
        opacity: [0, 1],
        translateY: [14, 0],
        filter: ['blur(4px)', 'blur(0px)'],
        duration: 650,
        ease: 'outExpo',
        onComplete: (animacion) => {
          raiz.classList.remove('sorteo--tinta')
          animacion.revert()
        },
      })

      const boleto = raiz.querySelector<HTMLElement>('.sorteo__boleto-principal')
      if (boleto) {
        animate(boleto, {
          opacity: [0, 1],
          translateY: ['-4rem', '0rem'],
          rotate: ['-5deg', '0deg'],
          duration: 1100,
          ease: 'outBack',
          // Sin revert: su estado oculto en CSS depende de `sorteo--revelando`, que se quita más tarde.
        })
      }

      const letras = brilloRef.current?.querySelectorAll<HTMLSpanElement>('span')
      if (letras?.length && !sorteo.fecha) {
        animate(letras, {
          opacity: [0, 1, 0],
          delay: stagger(75),
          duration: 450,
          loop: true,
          loopDelay: 2500,
          ease: 'inOutSine',
        })
      }

      const premiosObservador = onScroll({
        target: boletos,
        repeat: false,
        onEnter: () => scope.execute(() => {
          raiz.classList.remove('sorteo--revelando')
          animate(boletos.querySelectorAll<HTMLElement>('.sorteo__boleto-premio'), {
            opacity: [0, 1],
            translateY: [30, 0],
            delay: stagger(120),
            duration: 700,
            ease: 'outExpo',
            onComplete: (animacion) => animacion.revert(),
          })
        }),
      })
      const pasosObservador = onScroll({
        target: pasos,
        repeat: false,
        onEnter: () => scope.execute(() => animate(hilo, {
          [window.matchMedia('(max-width: 700px)').matches ? 'scaleY' : 'scaleX']: [0, 1],
          duration: 1000,
          ease: 'outExpo',
          onComplete: (animacion) => animacion.revert(),
        })),
      })
      return () => {
        premiosObservador.revert()
        pasosObservador.revert()
      }
    })

    return () => {
      scope.revert()
      raiz.classList.remove('sorteo--revelando', 'sorteo--tinta')
    }
  }, [movimientoReducido])

  const copiarNumero = async (nombre: string, numero: string) => {
    try {
      await navigator.clipboard.writeText(numero)
      setAvisoCopia('Copiado')
    } catch {
      setAvisoCopia(`No se pudo copiar el número de ${nombre}.`)
    }
  }

  return (
    <section className="seccion sorteo" ref={raizRef} aria-labelledby="sorteo-titulo">
      <header className="sorteo__cabecera">
        <div className="seccion__titulo">
          <h1 id="sorteo-titulo" data-sorteo-tinta>{sorteo.titulo}</h1>
        </div>
        <p className="sorteo__introduccion" data-sorteo-tinta>{sorteo.proposito}</p>
      </header>

      {sorteo.fecha ? (
        <CuentaSorteo fecha={sorteo.fecha} movimientoReducido={movimientoReducido} />
      ) : <AvisoSorteo />}

      <BoletoPrincipal />

      <section className="sorteo__seccion" aria-labelledby="sorteo-premios-titulo">
        <div className="seccion__titulo">
          <h2 id="sorteo-premios-titulo">Lo que puedes ganar</h2>
        </div>
        <div className="sorteo__premios" ref={boletosRef}>
          {sorteo.premios.map((premio) => (
            <BoletoPremio key={premio.categoria} premio={premio} />
          ))}
        </div>
      </section>

      <section className="sorteo__seccion" aria-labelledby="sorteo-pasos-titulo">
        <div className="seccion__titulo">
          <h2 id="sorteo-pasos-titulo">Cómo participar</h2>
        </div>
        <div className="sorteo__pasos-contenedor">
          <span className="sorteo__hilo" ref={hiloRef} aria-hidden="true" />
          <ol className="sorteo__pasos" ref={pasosRef}>
            {sorteo.pasos.map((paso, indice) => (
              <li className="sorteo__paso" key={paso.titulo}>
                <span className="sorteo__nodo" aria-hidden="true">{indice + 1}</span>
                <div className="sorteo__paso-texto">
                  <h3>{paso.titulo}</h3>
                  <p>{paso.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="sorteo__pago">
          <h3>Medios de pago oficiales</h3>
          {sorteo.yape || sorteo.plin ? (
            <div className="sorteo__metodos">
              {sorteo.yape && <MetodoPago nombre="Yape" numero={sorteo.yape} copiar={copiarNumero} />}
              {sorteo.plin && <MetodoPago nombre="Plin" numero={sorteo.plin} copiar={copiarNumero} />}
            </div>
          ) : <p className="sorteo__tesoreria">Números de tesorería: próximamente</p>}
          <p className="sorteo__copia" role="status" aria-live="polite">{avisoCopia}</p>
        </div>
      </section>

      <div className="sorteo__accion">
        {/* TODO: abrir WhatsApp de tesorería cuando se confirme el número oficial. */}
        <button className="sorteo__participar" type="button" disabled aria-disabled="true">
          Quiero participar
        </button>
        <p>Disponible muy pronto</p>
      </div>

      <section className="sorteo__seccion sorteo__preguntas" aria-labelledby="sorteo-preguntas-titulo">
        <div className="seccion__titulo">
          <h2 id="sorteo-preguntas-titulo">Preguntas frecuentes</h2>
        </div>
        <div className="sorteo__lista-preguntas">
          {sorteo.preguntas.map((pregunta) => (
            <details className="sorteo__pregunta" key={pregunta.pregunta}>
              <summary>
                <span>{pregunta.pregunta}</span>
                <span className="sorteo__mas" aria-hidden="true" />
              </summary>
              <div className="sorteo__respuesta"><div><p>{pregunta.respuesta}</p></div></div>
            </details>
          ))}
        </div>
      </section>

      <p className="sorteo__volver"><Link to="/">Volver al inicio</Link></p>
    </section>
  )
}
