import { useLayoutEffect, useRef, type PointerEvent } from 'react'
import { animate, createAnimatable, createScope } from 'animejs'
import type { Producto } from '@/content/catalogo'
import { formatearPrecio } from '@/components/catalogo/useBolsa'

const MONOGRAMA = '/assets/logos/monograma-oro-limpio.webp'

interface Props {
  producto: Producto
  reducido: boolean
  onVer: (disparador: HTMLButtonElement) => void
  onAgregar: (disparador: HTMLButtonElement) => void
}

export function TarjetaProducto({ producto, reducido, onVer, onAgregar }: Props) {
  const tarjetaRef = useRef<HTMLElement>(null)
  const marcoRef = useRef<HTMLDivElement>(null)
  const etiquetaRef = useRef<HTMLSpanElement>(null)
  const alcanceRef = useRef<ReturnType<typeof createScope> | null>(null)
  const inclinacionRef = useRef<ReturnType<typeof createAnimatable> | null>(null)

  useLayoutEffect(() => {
    const tarjeta = tarjetaRef.current
    const marco = marcoRef.current
    if (!tarjeta || !marco) return

    const alcance = createScope({ root: tarjeta })
    alcanceRef.current = alcance
    alcance.add(() => {
      if (reducido || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
      const inclinacion = createAnimatable(marco, {
        rotateX: { duration: 420, ease: 'outExpo' },
        rotateY: { duration: 420, ease: 'outExpo' },
      })
      inclinacionRef.current = inclinacion
      return () => {
        inclinacion.revert()
        inclinacionRef.current = null
      }
    })

    return () => {
      alcance.revert()
      alcanceRef.current = null
    }
  }, [reducido])

  const inclinar = (evento: PointerEvent<HTMLElement>) => {
    const marco = marcoRef.current
    if (evento.pointerType === 'touch' || !marco || !inclinacionRef.current) return
    const limites = marco.getBoundingClientRect()
    const x = (evento.clientX - limites.left) / limites.width
    const y = (evento.clientY - limites.top) / limites.height
    inclinacionRef.current.rotateX((0.5 - y) * 16)
    inclinacionRef.current.rotateY((x - 0.5) * 16)
    marco.style.setProperty('--brillo-x', (x * 100) + '%')
    marco.style.setProperty('--brillo-y', (y * 100) + '%')
  }

  const restablecerInclinacion = () => {
    inclinacionRef.current?.rotateX(0)
    inclinacionRef.current?.rotateY(0)
    marcoRef.current?.style.setProperty('--brillo-x', '50%')
    marcoRef.current?.style.setProperty('--brillo-y', '50%')
  }

  const balancearEtiqueta = () => {
    const etiqueta = etiquetaRef.current
    if (!etiqueta || reducido || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    alcanceRef.current?.execute(() => animate(etiqueta, {
      rotate: [
        { to: 4, duration: 220, ease: 'outQuad' },
        { to: -4, duration: 230, ease: 'outQuad' },
        { to: 0, duration: 420, ease: 'outElastic(1, .6)' },
      ],
    }))
  }

  return (
    <article
      className="vitrina__tarjeta"
      ref={tarjetaRef}
      data-vitrina-card
      onPointerMove={inclinar}
      onPointerLeave={restablecerInclinacion}
    >
      <div className="vitrina__marco" ref={marcoRef}>
        {producto.fotos?.[0] ? (
          <img className="vitrina__foto" src={producto.fotos[0]} alt="" loading="lazy" />
        ) : (
          <div className="vitrina__marcador">
            <img src={MONOGRAMA} alt="" />
            <span>Foto próximamente</span>
          </div>
        )}
        <svg className="vitrina__hilo" viewBox="0 0 64 36" aria-hidden="true">
          <path d="M59 1c-2 14-33 8-42 33" />
        </svg>
        <span className="vitrina__clavo" aria-hidden="true" />
        <span className="vitrina__precio" ref={etiquetaRef} data-vitrina-precio onPointerEnter={balancearEtiqueta}>
          {formatearPrecio(producto.precio)}
        </span>
      </div>

      <div className="vitrina__datos">
        <h2 className="vitrina__nombre">{producto.nombre}</h2>
        {producto.descripcion && <p className="vitrina__descripcion">{producto.descripcion}</p>}
        <div className="vitrina__acciones">
          <button className="vitrina__ver" type="button" onClick={(evento) => onVer(evento.currentTarget)}>
            Ver detalle
          </button>
          <button
            className="boton boton--chico"
            type="button"
            onClick={(evento) => producto.tallas?.length
              ? onVer(evento.currentTarget)
              : onAgregar(evento.currentTarget)}
          >
            Añadir
          </button>
        </div>
      </div>
    </article>
  )
}
