import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { animate, createScope, onScroll, stagger } from 'animejs'
import { catalogo, type Producto } from '@/content/catalogo'
import { Bolsa } from '@/components/catalogo/Bolsa'
import { DetalleProducto } from '@/components/catalogo/DetalleProducto'
import { TarjetaProducto } from '@/components/catalogo/TarjetaProducto'
import { BolsaProvider, useBolsa } from '@/components/catalogo/useBolsa'
import '@/styles/catalogo.css'

const MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'
const MONOGRAMA = '/assets/logos/monograma-oro-limpio.webp'

interface Vuelo {
  id: number
  x: number
  y: number
  foto: string
}

function ContenidoVitrina() {
  const bolsa = useBolsa()
  const [reducido, setReducido] = useState(() => window.matchMedia(MOVIMIENTO_REDUCIDO).matches)
  const [productoActivo, setProductoActivo] = useState<Producto | null>(null)
  const [anuncio, setAnuncio] = useState('')
  const [vuelo, setVuelo] = useState<Vuelo | null>(null)
  const raizRef = useRef<HTMLElement>(null)
  const grillaRef = useRef<HTMLDivElement>(null)
  const brilloRef = useRef<HTMLSpanElement>(null)
  const disparadorDetalleRef = useRef<HTMLButtonElement>(null)
  const botonBolsaRef = useRef<HTMLButtonElement>(null)
  const vueloRef = useRef<HTMLDivElement>(null)
  const alcanceRef = useRef<ReturnType<typeof createScope> | null>(null)
  const animacionVueloRef = useRef<ReturnType<typeof animate> | null>(null)
  const siguienteVueloRef = useRef(0)

  useEffect(() => {
    const consulta = window.matchMedia(MOVIMIENTO_REDUCIDO)
    const cambiar = () => {
      setReducido(consulta.matches)
      if (consulta.matches) setVuelo(null)
    }
    consulta.addEventListener('change', cambiar)
    return () => consulta.removeEventListener('change', cambiar)
  }, [])

  useLayoutEffect(() => {
    const raiz = raizRef.current
    const grilla = grillaRef.current
    if (!raiz || !grilla || reducido) return

    const alcance = createScope({ root: raiz })
    alcanceRef.current = alcance
    raiz.classList.add('vitrina--revelando')
    alcance.add(() => {
      const letras = brilloRef.current?.querySelectorAll<HTMLSpanElement>('span')
      if (letras?.length) {
        animate(letras, {
          opacity: [{ to: 1, duration: 450 }, { to: 0, duration: 450 }],
          delay: stagger(70),
          duration: 450,
          loop: true,
          loopDelay: 2500,
          ease: 'inOutSine',
        })
      }

      const entrada = onScroll({
        target: grilla,
        repeat: false,
        onEnter: () => alcance.execute(() => {
          raiz.classList.remove('vitrina--revelando')
          animate(grilla.querySelectorAll<HTMLElement>('[data-vitrina-card]'), {
            opacity: [0, 1],
            translateY: [30, 0],
            delay: stagger(110),
            duration: 700,
            ease: 'outExpo',
          })
          animate(grilla.querySelectorAll<HTMLElement>('[data-vitrina-precio]'), {
            rotate: ['-18deg', '0deg'],
            delay: stagger(110),
            duration: 850,
            ease: 'outElastic(1, .6)',
          })
        }),
      })
      return () => entrada.revert()
    })

    return () => {
      alcance.revert()
      alcanceRef.current = null
      raiz.classList.remove('vitrina--revelando')
    }
  }, [reducido])

  useLayoutEffect(() => {
    const elemento = vueloRef.current
    const destino = botonBolsaRef.current
    if (!vuelo || !elemento || !destino || reducido) return
    const limites = destino.getBoundingClientRect()
    const deltaX = limites.left + limites.width / 2 - vuelo.x
    const deltaY = limites.top + limites.height / 2 - vuelo.y
    animacionVueloRef.current?.cancel()
    animacionVueloRef.current = alcanceRef.current?.execute(() => animate(elemento, {
      translateX: { to: deltaX, ease: 'inQuad' },
      translateY: [
        { to: deltaY - 90, duration: 350, ease: 'outQuad' },
        { to: deltaY, duration: 350, ease: 'inQuad' },
      ],
      scale: [1, 0.4],
      opacity: { from: 1, to: 0, delay: 550, duration: 150 },
      duration: 700,
      onComplete: () => {
        if (botonBolsaRef.current) {
          alcanceRef.current?.execute(() => animate(botonBolsaRef.current!, {
            keyframes: [
              { scale: 1.18, rotate: -8, duration: 100 },
              { scale: 1, rotate: 8, duration: 120 },
              { rotate: 0, duration: 160 },
            ],
            ease: 'outBack',
          }))
        }
        setVuelo(null)
      },
    })) ?? null

    return () => {
      animacionVueloRef.current?.cancel()
    }
  }, [vuelo, reducido])

  const abrirDetalle = (producto: Producto, disparador: HTMLButtonElement) => {
    disparadorDetalleRef.current = disparador
    setProductoActivo(producto)
  }

  const agregar = (producto: Producto, talla: string | undefined, cantidad: number, disparador: HTMLButtonElement) => {
    if (producto.tallas?.length && !producto.tallas.includes(talla ?? '')) return
    const existente = bolsa.items.find((item) => item.id === producto.id && item.talla === talla)
    const cantidadActual = existente?.cantidad ?? 0
    const incremento = Math.min(20, cantidadActual + cantidad) - cantidadActual
    if (incremento <= 0) {
      setAnuncio('Ya alcanzaste el máximo de 20 piezas de ' + producto.nombre + ' para esta talla.')
      return
    }

    const limites = disparador.getBoundingClientRect()
    bolsa.agregar(producto.id, talla, cantidad)
    setAnuncio(producto.nombre + ' añadido a la bolsa. ' + (bolsa.piezas + incremento) + ' piezas.')

    if (reducido) return
    setVuelo({
      id: ++siguienteVueloRef.current,
      x: limites.left + limites.width / 2,
      y: limites.top + limites.height / 2,
      foto: producto.fotos?.[0] ?? MONOGRAMA,
    })
  }

  const agregarDesdeTarjeta = (producto: Producto, disparador: HTMLButtonElement) => {
    agregar(producto, undefined, 1, disparador)
  }

  return (
    <section className="seccion vitrina" ref={raizRef} aria-labelledby="vitrina-titulo">
      <header className="vitrina__cabecera">
        <div className="seccion__titulo">
          <h1 id="vitrina-titulo" tabIndex={-1}>{catalogo.titulo}</h1>
        </div>
        <p className="vitrina__introduccion">{catalogo.intro}</p>
      </header>

      <div className="vitrina__grilla" ref={grillaRef}>
        {catalogo.productos.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            reducido={reducido}
            onVer={(disparador) => abrirDetalle(producto, disparador)}
            onAgregar={(disparador) => agregarDesdeTarjeta(producto, disparador)}
          />
        ))}
        {Array.from({ length: catalogo.plantillas }, (_, indice) => (
          <article
            className="vitrina__tarjeta vitrina__tarjeta--plantilla"
            key={'plantilla-' + indice}
            aria-label="Próximamente: nuevo recuerdo"
            data-vitrina-card
          >
            <div className="vitrina__marco vitrina__marco--plantilla">
              <img className="vitrina__plantilla-monograma" src={MONOGRAMA} alt="" />
              <div className="vitrina__sello" aria-hidden="true">
                <span>{catalogo.aviso}</span>
                <img src={MONOGRAMA} alt="" />
              </div>
            </div>
            <div className="vitrina__datos">
              <h2 className="vitrina__nombre">Nuevo recuerdo</h2>
            </div>
          </article>
        ))}
      </div>

      <div className="vitrina__aviso" role="status">
        <div className="vitrina__ornamento" aria-hidden="true">
          <span />
          <span className="vitrina__rombo" />
          <span />
        </div>
        <p className="vitrina__aviso-titulo">
          <span>{catalogo.aviso}</span>
          <span className="vitrina__brillo" ref={brilloRef} aria-hidden="true">
            {Array.from(catalogo.aviso, (letra, indice) => <span key={letra + indice}>{letra}</span>)}
          </span>
        </p>
        <p className="vitrina__aviso-texto">{catalogo.avisoTexto}</p>
      </div>

      <p className="vitrina__anuncio" aria-live="polite" aria-atomic="true">{anuncio}</p>
      <Bolsa reducido={reducido} botonRef={botonBolsaRef} />
      <DetalleProducto
        key={productoActivo?.id ?? 'cerrado'}
        producto={productoActivo}
        reducido={reducido}
        disparadorRef={disparadorDetalleRef}
        onCerrar={() => setProductoActivo(null)}
        onAgregar={agregar}
      />
      {vuelo && createPortal(
        <div
          className={'vitrina__vuelo' + (vuelo.foto === MONOGRAMA ? ' vitrina__vuelo--monograma' : '')}
          key={vuelo.id}
          ref={vueloRef}
          style={{ left: vuelo.x - 28, top: vuelo.y - 28 }}
          aria-hidden="true"
        >
          <img src={vuelo.foto} alt="" />
        </div>,
        document.body,
      )}
    </section>
  )
}

export function Vitrina() {
  return (
    <BolsaProvider>
      <ContenidoVitrina />
    </BolsaProvider>
  )
}
