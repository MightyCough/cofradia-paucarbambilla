import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { animate, createScope } from 'animejs'
import type { DiaFiesta } from '@/content/eventos'

export function HojaAlmanaque({ dia, movimientoReducido }: {
  dia: DiaFiesta
  movimientoReducido: boolean
}) {
  const botonRef = useRef<HTMLButtonElement>(null)
  const interiorRef = useRef<HTMLSpanElement>(null)
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)
  const [volteada, setVolteada] = useState(false)
  const fecha = new Date(`${dia.fecha}T12:00:00-05:00`)
  const opciones = { timeZone: 'America/Lima' } as const
  const diaSemana = fecha.toLocaleDateString('es-PE', { ...opciones, weekday: 'long' })
  const diaCapitalizado = diaSemana.charAt(0).toLocaleUpperCase('es-PE') + diaSemana.slice(1)
  const mes = fecha.toLocaleDateString('es-PE', { ...opciones, month: 'long' })
  const mesCapitalizado = mes.charAt(0).toLocaleUpperCase('es-PE') + mes.slice(1)
  const numero = fecha.toLocaleDateString('es-PE', { ...opciones, day: 'numeric' })
  const actividades = dia.actividades ?? []

  useLayoutEffect(() => {
    if (!botonRef.current) return
    const scope = createScope({ root: botonRef })
    scopeRef.current = scope
    return () => {
      scope.revert()
      scopeRef.current = null
    }
  }, [])

  function voltear() {
    const siguiente = !volteada
    setVolteada(siguiente)
    if (movimientoReducido || !interiorRef.current) return
    scopeRef.current?.execute(() => {
      animate(interiorRef.current!, {
        rotateY: siguiente ? 180 : 0,
        scale: [1, 1.04, 1],
        duration: 800,
        ease: 'inOutCubic',
      })
    })
  }

  return (
    <button
      className="programa__hoja"
      ref={botonRef}
      type="button"
      style={{ '--giro': movimientoReducido ? '0deg' : 'var(--giro-hoja)' } as CSSProperties}
      aria-label={`${dia.jornada}, ${diaCapitalizado} ${numero} de ${mes}. Ver programa.`}
      aria-expanded={volteada}
      onClick={voltear}
    >
      <span className="programa__hoja-interior" ref={interiorRef}>
        <span className="programa__cara programa__cara--frente" aria-hidden={volteada}>
          <span className="programa__mes">
            <svg viewBox="0 0 20 22" aria-hidden="true" focusable="false">
              <circle cx="10" cy="5" r="3" />
              <path d="M10 8v12" />
            </svg>
            <span>{mesCapitalizado}</span>
            <svg viewBox="0 0 20 22" aria-hidden="true" focusable="false">
              <circle cx="10" cy="5" r="3" />
              <path d="M10 8v12" />
            </svg>
          </span>
          <span className="programa__numero-dia">{numero}</span>
          <span className="programa__dia-semana">{diaSemana}</span>
          <span className="programa__jornada programa__jornada--frente">{dia.jornada}</span>
          <span className="programa__pista">Toca para ver el programa</span>
        </span>

        <span className="programa__cara programa__cara--dorso" aria-hidden={!volteada}>
          <span className="programa__dorso-titulo">Programa del día</span>
          <span className="programa__jornada">{dia.jornada}</span>
          {actividades.length === 0 ? (
            <>
              <span className="programa__sello">Próximamente</span>
              <span className="programa__renglones" aria-hidden="true">
                <span /><span /><span /><span />
              </span>
            </>
          ) : (
            <span className="programa__actividades" role="list">
              {actividades.map((actividad, indice) => (
                <span className="programa__actividad" role="listitem" key={`${actividad.hora}-${actividad.titulo}-${indice}`}>
                  {actividad.hora && <span className="programa__actividad-hora">{actividad.hora}</span>}
                  <span className="programa__actividad-titulo">{actividad.titulo}</span>
                  {actividad.lugar && <span className="programa__actividad-lugar">{actividad.lugar}</span>}
                </span>
              ))}
            </span>
          )}
        </span>
      </span>
    </button>
  )
}
