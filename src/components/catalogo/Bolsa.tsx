import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { animate, createScope, createTimeline } from 'animejs'
import { catalogo } from '@/content/catalogo'
import { formatearPrecio, useBolsa } from '@/components/catalogo/useBolsa'

interface Props {
  reducido: boolean
  botonRef: RefObject<HTMLButtonElement | null>
}

export function Bolsa({ reducido, botonRef }: Props) {
  const bolsa = useBolsa()
  const dialogoRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const contadorRef = useRef<HTMLSpanElement>(null)
  const alcanceRef = useRef<ReturnType<typeof createScope> | null>(null)
  const animacionRef = useRef<ReturnType<typeof animate> | null>(null)
  const filasRef = useRef(new Map<string, HTMLLIElement>())
  const disparadorRef = useRef<HTMLButtonElement | null>(null)
  const cierreRef = useRef(false)
  const piezasPreviasRef = useRef(0)
  const [nombre, setNombre] = useState('')
  const [quitando, setQuitando] = useState<string | null>(null)

  useLayoutEffect(() => {
    const dialogo = dialogoRef.current
    if (!dialogo) return
    const alcance = createScope({ root: dialogo })
    alcanceRef.current = alcance
    return () => {
      animacionRef.current?.cancel()
      alcance.revert()
      alcanceRef.current = null
    }
  }, [])

  useLayoutEffect(() => {
    const boton = botonRef.current
    if (!boton || reducido) {
      piezasPreviasRef.current = bolsa.piezas
      return
    }
    const eraVacia = piezasPreviasRef.current === 0
    piezasPreviasRef.current = bolsa.piezas
    if (eraVacia) {
      alcanceRef.current?.execute(() => animate(boton, {
        scale: [0, 1],
        duration: 450,
        ease: 'outBack',
      }))
    }
    if (contadorRef.current) {
      alcanceRef.current?.execute(() => animate(contadorRef.current!, {
        rotate: ['-70deg', '0deg'],
        opacity: [0, 1],
        duration: 320,
        ease: 'outBack',
      }))
    }
  }, [bolsa.piezas, botonRef, reducido])

  const abrir = (disparador: HTMLButtonElement) => {
    const dialogo = dialogoRef.current
    const panel = panelRef.current
    if (!dialogo || !panel || dialogo.open) return
    disparadorRef.current = disparador
    dialogo.showModal()
    if (reducido) return
    animacionRef.current = alcanceRef.current?.execute(() => animate(panel, {
      translateX: ['100%', '0%'],
      duration: 450,
      ease: 'outExpo',
    })) ?? null
  }

  const cerrar = () => {
    const dialogo = dialogoRef.current
    const panel = panelRef.current
    if (!dialogo?.open || cierreRef.current) return
    cierreRef.current = true
    animacionRef.current?.cancel()
    if (reducido || !panel) {
      dialogo.close()
      return
    }
    animacionRef.current = alcanceRef.current?.execute(() => animate(panel, {
      translateX: ['0%', '100%'],
      duration: 280,
      ease: 'inExpo',
      onComplete: () => dialogo.close(),
    })) ?? null
  }

  const quitarConAnimacion = (id: string, talla: string | undefined) => {
    const llave = id + '|' + (talla ?? '')
    const fila = filasRef.current.get(llave)
    const colapso = fila?.querySelector<HTMLElement>('.bolsa__fila-colapso')
    if (!fila || !colapso || reducido) {
      bolsa.quitar(id, talla)
      return
    }
    setQuitando(llave)
    const salida = alcanceRef.current?.execute(() => createTimeline())
    salida?.add(fila, { opacity: [1, 0], duration: 150, ease: 'outQuad' }, 0)
    salida?.add(colapso, { gridTemplateRows: ['1fr', '0fr'], duration: 220, ease: 'inOutQuad' }, 150)
    salida?.call(() => {
      bolsa.quitar(id, talla)
      setQuitando(null)
    }, 370)
  }

  const mensaje = [
    'Hola, quiero hacer un pedido del catálogo de la Cofradía Niño Jesús de Paucarbambilla:',
    ...bolsa.entradas.map((item) =>
      '• ' + item.cantidad + ' × ' + item.producto.nombre +
      (item.talla ? ' (talla ' + item.talla + ')' : '') +
      ' — ' + formatearPrecio(item.subtotal),
    ),
    'Total: ' + formatearPrecio(bolsa.total),
    ...(nombre.trim() ? ['Nombre: ' + nombre.trim()] : []),
  ].join('\n')
  const enlacePedido = 'https://wa.me/' + catalogo.whatsapp + '?text=' + encodeURIComponent(mensaje)

  return (
    <>
      {bolsa.piezas > 0 && (
        <button
          className="bolsa__boton"
          type="button"
          ref={botonRef}
          aria-label={'Abrir bolsa, ' + bolsa.piezas + ' piezas'}
          onClick={(evento) => abrir(evento.currentTarget)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5.5 8h13l1.4 12H4.1L5.5 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          <span className="bolsa__contador" ref={contadorRef} aria-hidden="true">{bolsa.piezas}</span>
          {/* Solo en celular: el botón se vuelve una barra inferior con el resumen. */}
          <span className="bolsa__barra" aria-hidden="true">
            <span className="bolsa__barra-piezas">
              {bolsa.piezas} {bolsa.piezas === 1 ? 'pieza' : 'piezas'}
            </span>
            <span className="bolsa__barra-total">{formatearPrecio(bolsa.total)}</span>
            <span className="bolsa__barra-accion">Ver bolsa</span>
          </span>
        </button>
      )}

      <dialog
        className="bolsa__dialogo"
        ref={dialogoRef}
        aria-labelledby="bolsa-titulo"
        onCancel={(evento) => {
          evento.preventDefault()
          cerrar()
        }}
        onClose={() => {
          cierreRef.current = false
          animacionRef.current?.cancel()
          requestAnimationFrame(() => {
            if (disparadorRef.current?.isConnected) disparadorRef.current.focus()
            else document.getElementById('vitrina-titulo')?.focus()
          })
        }}
        onClick={(evento) => {
          if (evento.target === evento.currentTarget) cerrar()
        }}
      >
        <div className="bolsa__panel" ref={panelRef}>
          <header className="bolsa__cabecera">
            <h2 id="bolsa-titulo">Tu bolsa</h2>
            <button className="bolsa__cerrar" type="button" aria-label="Cerrar bolsa" onClick={cerrar}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </header>

          {bolsa.entradas.length ? (
            <>
              <ul className="bolsa__lista">
                {bolsa.entradas.map((item) => {
                  const llave = item.id + '|' + (item.talla ?? '')
                  return (
                    <li
                      className="bolsa__fila"
                      key={llave}
                      ref={(elemento) => {
                        if (elemento) filasRef.current.set(llave, elemento)
                        else filasRef.current.delete(llave)
                      }}
                    >
                      <div className="bolsa__fila-colapso">
                        <div className="bolsa__fila-contenido">
                          {item.producto.fotos?.[0] ? (
                            <img className="bolsa__miniatura" src={item.producto.fotos[0]} alt="" />
                          ) : (
                            <span className="bolsa__miniatura bolsa__miniatura--monograma" aria-hidden="true">
                              <img src="/assets/logos/monograma-oro-limpio.webp" alt="" />
                            </span>
                          )}
                          <div className="bolsa__producto">
                            <h3>{item.producto.nombre}</h3>
                            {item.talla && <p>Talla {item.talla}</p>}
                            <div className="bolsa__stepper" role="group" aria-label={'Cantidad de ' + item.producto.nombre}>
                              <button
                                type="button"
                                aria-label={'Reducir cantidad de ' + item.producto.nombre}
                                disabled={item.cantidad <= 1}
                                onClick={() => bolsa.cambiarCantidad(item.id, item.talla, item.cantidad - 1)}
                              >
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
                              </button>
                              <output aria-live="polite">{item.cantidad}</output>
                              <button
                                type="button"
                                aria-label={'Aumentar cantidad de ' + item.producto.nombre}
                                disabled={item.cantidad >= 20}
                                onClick={() => bolsa.cambiarCantidad(item.id, item.talla, item.cantidad + 1)}
                              >
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                              </button>
                            </div>
                          </div>
                          <div className="bolsa__subtotal">
                            <strong>{formatearPrecio(item.subtotal)}</strong>
                            <button
                              className="bolsa__quitar"
                              type="button"
                              aria-label={'Quitar ' + item.producto.nombre + (item.talla ? ', talla ' + item.talla : '')}
                              disabled={quitando !== null}
                              onClick={() => quitarConAnimacion(item.id, item.talla)}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <footer className="bolsa__pie">
                <p className="bolsa__total"><span>Total</span><strong>{formatearPrecio(bolsa.total)}</strong></p>
                <label className="bolsa__nombre">
                  Tu nombre (opcional)
                  <input
                    type="text"
                    autoComplete="name"
                    value={nombre}
                    onChange={(evento) => setNombre(evento.currentTarget.value)}
                  />
                </label>
                <a className="boton bolsa__pedir" href={enlacePedido} target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.4-3.5A8 8 0 1 1 20 11.5Z" />
                    <path d="M8.5 9.2c.5 2.2 2.1 3.8 4.3 4.3" />
                  </svg>
                  Pedir por WhatsApp
                </a>
                <p className="bolsa__coordinacion">Coordinaremos el pago y la entrega por WhatsApp.</p>
                <button className="bolsa__vaciar" type="button" onClick={bolsa.vaciar}>Vaciar bolsa</button>
              </footer>
            </>
          ) : (
            <div className="bolsa__vacia">
              <p>Tu bolsa está vacía.</p>
              <button className="boton" type="button" onClick={cerrar}>Seguir viendo</button>
            </div>
          )}
        </div>
      </dialog>
    </>
  )
}
