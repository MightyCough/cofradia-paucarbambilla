import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, createScope } from 'animejs'
import { programa } from '@/content/eventos'

const INICIO = Date.parse(programa.inicio)
const ULTIMA_FECHA = programa.dias.at(-1)?.fecha ?? programa.inicio.slice(0, 10)
const FIN = Date.parse(`${ULTIMA_FECHA}T23:59:59.999-05:00`)
const MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'

interface TiempoRestante {
  dias: number
  horas: number
  minutos: number
  segundos: number
}

function calcularTiempo(ahora: number): TiempoRestante {
  const total = Math.max(0, Math.ceil((INICIO - ahora) / 1000))
  return {
    dias: Math.floor(total / 86_400),
    horas: Math.floor((total % 86_400) / 3_600),
    minutos: Math.floor((total % 3_600) / 60),
    segundos: total % 60,
  }
}

function Digito({ valor, movimientoReducido }: { valor: string; movimientoReducido: boolean }) {
  const ranuraRef = useRef<HTMLSpanElement>(null)
  const salienteRef = useRef<HTMLSpanElement>(null)
  const entranteRef = useRef<HTMLSpanElement>(null)
  const [cambio, setCambio] = useState<{ valor: string; saliente: string | null }>({ valor, saliente: null })
  if (cambio.valor !== valor) {
    setCambio({ valor, saliente: movimientoReducido ? null : cambio.valor })
  } else if (movimientoReducido && cambio.saliente !== null) {
    setCambio({ valor, saliente: null })
  }
  const saliente = cambio.saliente

  useLayoutEffect(() => {
    if (saliente === null || movimientoReducido || !ranuraRef.current) return
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
  }, [movimientoReducido, saliente])

  return (
    <span className="programa__digito" ref={ranuraRef}>
      {saliente !== null && <span className="programa__digito-saliente" ref={salienteRef}>{saliente}</span>}
      <span
        className={saliente === null ? 'programa__digito-actual' : 'programa__digito-entrante'}
        ref={entranteRef}
      >
        {valor}
      </span>
    </span>
  )
}

function Unidad({ etiqueta, valor, movimientoReducido }: {
  etiqueta: string
  valor: number
  movimientoReducido: boolean
}) {
  const numero = String(valor).padStart(2, '0')

  return (
    <div className="programa__cuenta-unidad">
      <span className="programa__cuenta-numero" aria-hidden="true">
        {[...numero].map((digito, indice) => (
          <Digito key={indice} valor={digito} movimientoReducido={movimientoReducido} />
        ))}
      </span>
      <span className="programa__cuenta-etiqueta">{etiqueta}</span>
    </div>
  )
}

export function CuentaRegresiva() {
  const [ahora, setAhora] = useState(() => Date.now())
  const [minutoAccesible, setMinutoAccesible] = useState(() => Math.floor(Date.now() / 60_000))
  const [movimientoReducido, setMovimientoReducido] = useState(() =>
    window.matchMedia(MOVIMIENTO_REDUCIDO).matches,
  )

  useEffect(() => {
    const consulta = window.matchMedia(MOVIMIENTO_REDUCIDO)
    const actualizar = () => setMovimientoReducido(consulta.matches)
    consulta.addEventListener('change', actualizar)
    return () => consulta.removeEventListener('change', actualizar)
  }, [])

  useEffect(() => {
    let temporizador: number | undefined
    const actualizarTiempo = () => {
      const marca = Date.now()
      setAhora(marca)
      const minuto = Math.floor(marca / 60_000)
      setMinutoAccesible((anterior) => anterior === minuto ? anterior : minuto)
    }
    const actualizarTick = () => {
      if (temporizador !== undefined) window.clearInterval(temporizador)
      temporizador = undefined
      if (document.hidden) return
      actualizarTiempo()
      temporizador = window.setInterval(actualizarTiempo, 1000)
    }

    actualizarTick()
    document.addEventListener('visibilitychange', actualizarTick)
    return () => {
      if (temporizador !== undefined) window.clearInterval(temporizador)
      document.removeEventListener('visibilitychange', actualizarTick)
    }
  }, [])

  if (ahora > FIN) {
    return (
      <div className="programa__cuenta-estado" role="status">
        <p className="programa__cuenta-mensaje">¡Gracias por acompañarnos!</p>
        <p className="programa__cuenta-detalle">Pronto anunciaremos la próxima celebración.</p>
      </div>
    )
  }

  if (ahora >= INICIO) {
    return (
      <div className="programa__cuenta-estado" role="status">
        <p className="programa__cuenta-mensaje">¡La fiesta ya comenzó!</p>
      </div>
    )
  }

  const restante = calcularTiempo(ahora)
  const accesible = calcularTiempo(minutoAccesible * 60_000)
  const unidades = [
    { etiqueta: 'días', valor: restante.dias },
    { etiqueta: 'horas', valor: restante.horas },
    { etiqueta: 'minutos', valor: restante.minutos },
    { etiqueta: 'segundos', valor: restante.segundos },
  ]

  return (
    <div className="programa__cuenta">
      <p className="programa__cuenta-titulo">Faltan para la víspera</p>
      <div className="programa__cuenta-reloj">
        {unidades.map((unidad, indice) => (
          <span className="programa__cuenta-par" key={unidad.etiqueta}>
            {indice > 0 && (
              <svg className="programa__cuenta-rombo" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
                <path d="m6 0 6 6-6 6-6-6Z" fill="currentColor" />
              </svg>
            )}
            <Unidad {...unidad} movimientoReducido={movimientoReducido} />
          </span>
        ))}
      </div>
      <p className="programa__sr-only">
        Faltan {accesible.dias} {accesible.dias === 1 ? 'día' : 'días'}, {accesible.horas} {accesible.horas === 1 ? 'hora' : 'horas'} y {accesible.minutos} {accesible.minutos === 1 ? 'minuto' : 'minutos'}.
      </p>
    </div>
  )
}
