import { useEffect, useRef, type RefObject } from 'react'
import { animate, createScope } from 'animejs'
import type { Plantilla, Versiculo } from '@/content/invitacion'
import { dibujarInvitacion } from '@/components/invitacion/dibujarInvitacion'

interface Props {
  plantilla: Plantilla
  imagen: HTMLImageElement | null
  nombre: string
  colorNombre: string
  tamNombre: number
  ajusteYNombre: number
  versiculo: Versiculo
  mostrarCita: boolean
  tamVersiculo: number
  ajusteYVersiculo: number
  colorVersiculo: string
  canvasRef: RefObject<HTMLCanvasElement | null>
  reducido: boolean
  brilloRef: RefObject<HTMLSpanElement | null>
  renderKey: string
  onRendered: (renderKey: string) => void
}

export function VistaPrevia({
  plantilla, imagen, nombre, colorNombre, tamNombre, ajusteYNombre,
  versiculo, mostrarCita, tamVersiculo, ajusteYVersiculo, colorVersiculo,
  canvasRef, reducido, brilloRef, renderKey,
  onRendered,
}: Props) {
  const marcoRef = useRef<HTMLDivElement>(null)
  const estadoAnterior = useRef({ plantillaId: plantilla.id, textoVersiculo: versiculo.texto })

  useEffect(() => {
    let activo = true
    let frame = 0

    void Promise.all([
      document.fonts.load('700 64px Cinzel'),
      document.fonts.load('italic 400 40px "EB Garamond"'),
    ]).then(() => {
      if (!activo) return
      frame = requestAnimationFrame(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return
        dibujarInvitacion(ctx, {
          plantilla, imagen, nombre, colorNombre, tamNombre, ajusteYNombre,
          versiculo, mostrarCita, tamVersiculo, ajusteYVersiculo, colorVersiculo,
        })
        canvas.dataset.renderKey = renderKey
        onRendered(renderKey)
      })
    })

    return () => {
      activo = false
      cancelAnimationFrame(frame)
    }
  }, [
    plantilla, imagen, nombre, colorNombre, tamNombre, ajusteYNombre,
    versiculo, mostrarCita, tamVersiculo, ajusteYVersiculo, colorVersiculo, canvasRef, renderKey, onRendered,
  ])

  useEffect(() => {
    const plantillaCambio = estadoAnterior.current.plantillaId !== plantilla.id
    const versiculoCambio = estadoAnterior.current.textoVersiculo !== versiculo.texto
    estadoAnterior.current = { plantillaId: plantilla.id, textoVersiculo: versiculo.texto }
    if ((!plantillaCambio && !versiculoCambio) || reducido) return
    const canvas = canvasRef.current
    if (!canvas) return

    const scope = createScope({ root: marcoRef })
    scope.add(() => {
      animate(canvas, {
        opacity: [plantillaCambio ? 0.4 : 0.6, 1],
        duration: plantillaCambio ? 320 : 300,
        ease: 'outQuad',
        onComplete: (animacion) => animacion.revert(),
      })
    })
    return () => scope.revert()
  }, [plantilla.id, versiculo.texto, reducido, canvasRef])

  const nombreZona = plantilla.nombre

  return (
    <div className="taller__marco" ref={marcoRef}>
      <canvas
        ref={canvasRef}
        className="taller__canvas"
        width={1080}
        height={1920}
        role="img"
        aria-label={`Vista previa de la invitación para ${nombre.trim() || 'NOMBRE DEL INVITADO'}`}
      />
      <span
        ref={brilloRef}
        className="taller__destello"
        aria-hidden="true"
      />
      {!nombre.trim() && (
        <span
          className={`taller__zona-nombre${reducido ? '' : ' taller__zona-nombre--pulso'}`}
          aria-hidden="true"
          style={{
            left: `${nombreZona.izquierda * 100}%`,
            right: `${(1 - nombreZona.derecha) * 100}%`,
            top: `${(nombreZona.centroY - nombreZona.alto / 2) * 100}%`,
            height: `${nombreZona.alto * 100}%`,
          }}
        />
      )}
    </div>
  )
}
