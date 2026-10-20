import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { animate, createScope, createTimeline } from 'animejs'
import type { Producto } from '@/content/catalogo'
import { formatearPrecio } from '@/components/catalogo/useBolsa'

const MONOGRAMA = '/assets/logos/monograma-oro-limpio.webp'

interface Props {
  producto: Producto | null
  reducido: boolean
  disparadorRef: RefObject<HTMLButtonElement | null>
  onCerrar: () => void
  onAgregar: (producto: Producto, talla: string | undefined, cantidad: number, disparador: HTMLButtonElement) => void
}

export function DetalleProducto({ producto, reducido, disparadorRef, onCerrar, onAgregar }: Props) {
  const dialogoRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const fotoRef = useRef<HTMLImageElement>(null)
  const alcanceRef = useRef<ReturnType<typeof createScope> | null>(null)
  const entradaRef = useRef<ReturnType<typeof createTimeline> | null>(null)
  const cierreRef = useRef(false)
  const [talla, setTalla] = useState<string>()
  const [cantidad, setCantidad] = useState(1)
  const [errorTalla, setErrorTalla] = useState(false)
  const [indiceFoto, setIndiceFoto] = useState(0)
  const fotos = producto?.fotos ?? []
  const fotoActiva = fotos[indiceFoto]

  useLayoutEffect(() => {
    const dialogo = dialogoRef.current
    const panel = panelRef.current
    if (!producto || !dialogo || !panel) return
    cierreRef.current = false
    if (!dialogo.open) dialogo.showModal()

    const alcance = createScope({ root: dialogo })
    alcanceRef.current = alcance
    if (!reducido) {
      alcance.add(() => {
        const entrada = createTimeline()
        entradaRef.current = entrada
        entrada.add(panel, { opacity: [0, 1], scale: [0.96, 1], duration: 350, ease: 'outExpo' }, 0)
        if (fotoRef.current) {
          entrada.add(fotoRef.current, {
            clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'],
            duration: 600,
            ease: 'outExpo',
          }, 0)
        }
        return () => {
          entrada.cancel()
          entradaRef.current = null
        }
      })
    }

    return () => {
      alcance.revert()
      alcanceRef.current = null
    }
  }, [producto, reducido])

  useLayoutEffect(() => {
    const foto = fotoRef.current
    if (!foto || reducido || !producto) return
    alcanceRef.current?.execute(() => animate(foto, {
      opacity: [0.35, 1],
      duration: 260,
      ease: 'outExpo',
    }))
  }, [fotoActiva, producto, reducido])

  const cerrar = () => {
    const dialogo = dialogoRef.current
    const panel = panelRef.current
    if (!dialogo?.open || cierreRef.current) return
    cierreRef.current = true
    entradaRef.current?.cancel()
    entradaRef.current = null
    if (reducido || !panel) {
      dialogo.close()
      return
    }
    alcanceRef.current?.execute(() => animate(panel, {
      opacity: [1, 0],
      duration: 200,
      ease: 'outExpo',
      onComplete: () => dialogo.close(),
    }))
  }

  const agregar = (disparador: HTMLButtonElement) => {
    if (!producto) return
    if (producto.tallas?.length && !talla) {
      setErrorTalla(true)
      return
    }
    onAgregar(producto, talla, cantidad, disparador)
    cerrar()
  }

  return (
    <dialog
      className="vitrina__dialogo"
      ref={dialogoRef}
      aria-labelledby="detalle-titulo"
      onCancel={(evento) => {
        evento.preventDefault()
        cerrar()
      }}
      onClose={() => {
        cierreRef.current = false
        onCerrar()
        requestAnimationFrame(() => disparadorRef.current?.focus())
      }}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) cerrar()
      }}
    >
      {producto && (
        <div className="vitrina__detalle" ref={panelRef}>
          <button className="vitrina__cerrar" type="button" aria-label="Cerrar detalle" onClick={cerrar}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>

          <div className="vitrina__detalle-imagenes">
            <div className="vitrina__detalle-imagen">
              {fotoActiva ? (
                <img className="vitrina__detalle-foto" ref={fotoRef} src={fotoActiva} alt="" />
              ) : (
                <div className="vitrina__detalle-marcador">
                  <img src={MONOGRAMA} alt="" />
                  <span>Foto próximamente</span>
                </div>
              )}
            </div>
            {fotos.length > 1 && (
              <div className="vitrina__miniaturas" role="group" aria-label="Fotos del producto">
                {fotos.map((foto, indice) => (
                  <button
                    className="vitrina__miniatura"
                    type="button"
                    key={foto}
                    aria-label={'Ver imagen ' + (indice + 1) + ' de ' + producto.nombre}
                    aria-pressed={indiceFoto === indice}
                    onClick={() => setIndiceFoto(indice)}
                  >
                    <img src={foto} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="vitrina__detalle-texto">
            <h2 id="detalle-titulo">{producto.nombre}</h2>
            <p className="vitrina__detalle-precio">{formatearPrecio(producto.precio)}</p>
            {producto.descripcion && <p>{producto.descripcion}</p>}

            {producto.tallas?.length ? (
              <fieldset className="vitrina__tallas">
                <legend>Elige una talla</legend>
                <div className="vitrina__tallas-lista">
                  {producto.tallas.map((opcion) => (
                    <button
                      key={opcion}
                      className="vitrina__talla"
                      type="button"
                      aria-pressed={talla === opcion}
                      onClick={() => {
                        setTalla(opcion)
                        setErrorTalla(false)
                      }}
                    >
                      {opcion}
                    </button>
                  ))}
                </div>
                {errorTalla && <p className="vitrina__error" role="alert">Elige una talla antes de añadir el producto.</p>}
              </fieldset>
            ) : null}

            <div className="vitrina__cantidad" role="group" aria-label="Cantidad">
              <span>Cantidad</span>
              <div>
                <button
                  type="button"
                  aria-label="Reducir cantidad"
                  disabled={cantidad <= 1}
                  onClick={() => setCantidad((actual) => Math.max(1, actual - 1))}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
                </button>
                <output aria-live="polite">{cantidad}</output>
                <button
                  type="button"
                  aria-label="Aumentar cantidad"
                  disabled={cantidad >= 20}
                  onClick={() => setCantidad((actual) => Math.min(20, actual + 1))}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>
            </div>

            <button className="boton vitrina__agregar-detalle" type="button" onClick={(evento) => agregar(evento.currentTarget)}>
              Añadir a la bolsa
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
