import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { animate, createScope, stagger } from 'animejs'
import { invitacion, type Versiculo } from '@/content/invitacion'
import { PanelInvitacion } from '@/components/invitacion/PanelInvitacion'
import { VistaPrevia } from '@/components/invitacion/VistaPrevia'
import '@/styles/invitacion.css'

const MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'
const COLOR_NOMBRE_INICIAL = '#2a1606'
const COLOR_VERSICULO = '#f8efd9'
type Tema = 'Todos' | Versiculo['tema']
type Imagenes = Record<string, HTMLImageElement>

function nombreEnTitulo(nombre: string) {
  const limpio = nombre.trim().replace(/\s+/g, ' ')
  if (!limpio) return 'Hola'
  return limpio.toLocaleLowerCase('es-PE').split(' ').map((palabra) =>
    palabra.charAt(0).toLocaleUpperCase('es-PE') + palabra.slice(1),
  ).join(' ')
}

function nombreDeArchivo(nombre: string) {
  return nombre.trim().toLocaleLowerCase('es-PE')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'invitado'
}

function obtenerBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('No se pudo crear la imagen.')), 'image/png')
  })
}

function descargarBlob(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  document.body.append(enlace)
  enlace.click()
  enlace.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function abrirWhatsApp(mensaje: string) {
  const enlace = document.createElement('a')
  enlace.href = `https://wa.me/?text=${encodeURIComponent(mensaje)}`
  enlace.target = '_blank'
  enlace.rel = 'noopener noreferrer'
  document.body.append(enlace)
  enlace.click()
  enlace.remove()
}

export function TallerInvitacion() {
  const [plantillaId, setPlantillaId] = useState(invitacion.plantillas[0].id)
  const [imagenes, setImagenes] = useState<Imagenes>({})
  const [nombre, setNombre] = useState('')
  const [colorNombre, setColorNombre] = useState(COLOR_NOMBRE_INICIAL)
  const [tamNombre, setTamNombre] = useState(78)
  const [ajusteYNombre, setAjusteYNombre] = useState(0)
  const [filtro, setFiltro] = useState<Tema>('Todos')
  const [versiculoIndex, setVersiculoIndex] = useState(0)
  const [mensajePropioActivo, setMensajePropioActivo] = useState(false)
  const [mensajePropio, setMensajePropio] = useState('')
  const [mostrarCita, setMostrarCita] = useState(true)
  const [tamVersiculo, setTamVersiculo] = useState(40)
  const [ajusteYVersiculo, setAjusteYVersiculo] = useState(0)
  const [mensajeIndex, setMensajeIndex] = useState(0)
  const [mensajeManual, setMensajeManual] = useState<string | null>(null)
  const [reducido, setReducido] = useState(() => window.matchMedia(MOVIMIENTO_REDUCIDO).matches)
  const [toast, setToast] = useState<{ texto: string; id: number } | null>(null)
  const [renderKeyListo, setRenderKeyListo] = useState('')
  const raizRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const brilloRef = useRef<HTMLSpanElement>(null)
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)
  const toastId = useRef(0)
  const marcarCanvasListo = useCallback((renderKey: string) => setRenderKeyListo(renderKey), [])

  const plantilla = invitacion.plantillas.find(({ id }) => id === plantillaId) ?? invitacion.plantillas[0]
  const indiceVisible = filtro !== 'Todos' && invitacion.versiculos[versiculoIndex]?.tema !== filtro
    ? invitacion.versiculos.findIndex(({ tema }) => tema === filtro)
    : versiculoIndex
  const versiculoSeleccionado = invitacion.versiculos[indiceVisible] ?? invitacion.versiculos[0]
  const versiculo = useMemo<Versiculo>(() => mensajePropioActivo
    ? { ...versiculoSeleccionado, texto: mensajePropio }
    : versiculoSeleccionado,
  [mensajePropioActivo, mensajePropio, versiculoSeleccionado])
  const nombreValido = Boolean(nombre.trim())
  const nombreCompartir = nombreEnTitulo(nombre)
  const mensajeBase = invitacion.mensajesEnvio[mensajeIndex].replaceAll('{nombre}', nombreCompartir)
  const mensajeEnvio = mensajeManual ?? mensajeBase
  const renderKey = JSON.stringify([
    plantilla.id, imagenes[plantilla.id]?.src, nombre, colorNombre, tamNombre, ajusteYNombre,
    versiculo.texto, versiculo.cita, mostrarCita && !mensajePropioActivo, tamVersiculo, ajusteYVersiculo, COLOR_VERSICULO,
  ])
  const canvasListo = renderKeyListo === renderKey

  useEffect(() => {
    let activo = true
    void Promise.all(invitacion.plantillas.map((plantillaImagen) => new Promise<[string, HTMLImageElement | null]>((resolve) => {
      const imagen = new Image()
      imagen.onload = () => resolve([plantillaImagen.id, imagen])
      imagen.onerror = () => resolve([plantillaImagen.id, null])
      imagen.src = plantillaImagen.src
    }))).then((cargas) => {
      if (!activo) return
      setImagenes(Object.fromEntries(cargas.filter((carga): carga is [string, HTMLImageElement] => carga[1] !== null)))
    })
    return () => { activo = false }
  }, [])

  useEffect(() => {
    const consulta = window.matchMedia(MOVIMIENTO_REDUCIDO)
    const actualizar = () => setReducido(consulta.matches)
    consulta.addEventListener('change', actualizar)
    return () => consulta.removeEventListener('change', actualizar)
  }, [])

  useEffect(() => {
    if (!toast) return
    const temporizador = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(temporizador)
  }, [toast])

  useLayoutEffect(() => {
    const raiz = raizRef.current
    if (!raiz || reducido) return
    const scope = createScope({ root: raiz })
    scopeRef.current = scope
    scope.add(() => {
      const cabecera = raiz.querySelector<HTMLElement>('[data-taller-cabecera]')
      const previa = raiz.querySelector<HTMLElement>('[data-taller-previa]')
      const pasos = raiz.querySelectorAll<HTMLElement>('[data-paso]')
      if (cabecera) animate(cabecera, {
        opacity: [0, 1],
        translateY: [12, 0],
        filter: ['blur(4px)', 'blur(0px)'],
        duration: 650,
        ease: 'outExpo',
        onComplete: (animacion) => animacion.revert(),
      })
      if (previa) animate(previa, {
        opacity: [0, 1],
        scale: [0.94, 1],
        rotate: ['-2deg', '0deg'],
        duration: 850,
        ease: 'outBack',
        onComplete: (animacion) => animacion.revert(),
      })
      if (pasos.length) animate(pasos, {
        opacity: [0, 1],
        translateY: [14, 0],
        delay: stagger(100),
        duration: 500,
        ease: 'outExpo',
        onComplete: (animacion) => animacion.revert(),
      })
    })
    return () => {
      scope.revert()
      scopeRef.current = null
    }
  }, [reducido])

  function mostrarAviso(texto: string) {
    toastId.current += 1
    setToast({ texto, id: toastId.current })
  }

  function celebrar(texto = '¡Invitación lista!') {
    const brillo = brilloRef.current
    if (!reducido && brillo) {
      scopeRef.current?.execute(() => animate(brillo, {
        translateX: ['-150%', '250%'],
        opacity: [0, 0.9, 0],
        duration: 850,
        ease: 'inOutQuad',
        onComplete: (animacion) => animacion.revert(),
      }))
    }
    mostrarAviso(texto)
  }

  async function descargar() {
    if (!nombreValido || !canvasRef.current) return
    try {
      const blob = await obtenerBlob(canvasRef.current)
      descargarBlob(blob, `invitacion-${nombreDeArchivo(nombre)}.png`)
      celebrar()
    } catch {
      mostrarAviso('No se pudo descargar la invitación. Inténtalo de nuevo.')
    }
  }

  async function enviar() {
    if (!nombreValido || !canvasRef.current) return
    const archivoNombre = `invitacion-${nombreDeArchivo(nombre)}.png`
    const archivoPrueba = typeof File === 'undefined' ? null : new File([], archivoNombre, { type: 'image/png' })
    const compartir = Reflect.get(navigator, 'share') as Navigator['share'] | undefined
    const puedeCompartir = Boolean(archivoPrueba && compartir && navigator.canShare?.({ files: [archivoPrueba] }))

    if (!puedeCompartir) abrirWhatsApp(mensajeEnvio)

    try {
      const blob = await obtenerBlob(canvasRef.current)
      if (typeof File === 'undefined') {
        descargarBlob(blob, archivoNombre)
        celebrar('¡Invitación lista! Descargamos tu invitación. Adjúntala en el chat de WhatsApp que se abrió.')
        return
      }
      const archivo = new File([blob], archivoNombre, { type: 'image/png' })
      if (puedeCompartir && compartir && navigator.canShare?.({ files: [archivo] })) {
        await compartir.call(navigator, { files: [archivo], text: mensajeEnvio })
        celebrar()
        return
      }

      if (puedeCompartir) abrirWhatsApp(mensajeEnvio)
      descargarBlob(blob, archivoNombre)
      celebrar('¡Invitación lista! Descargamos tu invitación. Adjúntala en el chat de WhatsApp que se abrió.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      mostrarAviso('No se pudo compartir la invitación. Inténtalo de nuevo.')
    }
  }

  async function copiarMensaje() {
    try {
      await navigator.clipboard.writeText(mensajeEnvio)
      mostrarAviso('Copiado')
    } catch {
      mostrarAviso('No se pudo copiar el mensaje.')
    }
  }

  function cambiarPlantilla(id: string) {
    setPlantillaId(id)
    setColorNombre(COLOR_NOMBRE_INICIAL)
    setTamNombre(78)
    setAjusteYNombre(0)
    setTamVersiculo(40)
    setAjusteYVersiculo(0)
  }

  function restablecerAjustes() {
    setColorNombre(COLOR_NOMBRE_INICIAL)
    setTamNombre(78)
    setAjusteYNombre(0)
    setTamVersiculo(40)
    setAjusteYVersiculo(0)
  }

  function cambiarMensajeIndex(index: number) {
    setMensajeManual(null)
    setMensajeIndex(index)
  }

  return (
    <section className="seccion taller" ref={raizRef} aria-labelledby="taller-titulo">
      <header className="taller__cabecera" data-taller-cabecera>
        <div className="seccion__titulo">
          <h1 id="taller-titulo">{invitacion.titulo}</h1>
        </div>
        <p>{invitacion.intro}</p>
      </header>

      <div className="taller__diseno">
        <div className="taller__columna-previa" data-taller-previa>
          <div className="taller__atril" aria-label="Vista previa de la invitación">
            <VistaPrevia
              plantilla={plantilla}
              imagen={imagenes[plantilla.id] ?? null}
              nombre={nombre}
              colorNombre={colorNombre}
              tamNombre={tamNombre}
              ajusteYNombre={ajusteYNombre}
              versiculo={versiculo}
              mostrarCita={mostrarCita && !mensajePropioActivo}
              tamVersiculo={tamVersiculo}
              ajusteYVersiculo={ajusteYVersiculo}
              colorVersiculo={COLOR_VERSICULO}
              canvasRef={canvasRef}
              reducido={reducido}
              brilloRef={brilloRef}
              renderKey={renderKey}
              onRendered={marcarCanvasListo}
            />
          </div>
          <span className="taller__rotulo-previa" aria-hidden="true">Vista previa</span>
        </div>

        <PanelInvitacion
          plantillas={invitacion.plantillas}
          plantillaId={plantilla.id}
          onPlantilla={cambiarPlantilla}
          nombre={nombre}
          onNombre={setNombre}
          colorNombre={colorNombre}
          onColorNombre={setColorNombre}
          tamNombre={tamNombre}
          onTamNombre={setTamNombre}
          ajusteYNombre={ajusteYNombre}
          onAjusteYNombre={setAjusteYNombre}
          filtro={filtro}
          onFiltro={setFiltro}
          versiculos={invitacion.versiculos}
          versiculoIndex={indiceVisible}
          onVersiculo={setVersiculoIndex}
          mensajePropioActivo={mensajePropioActivo}
          onMensajePropioActivo={setMensajePropioActivo}
          mensajePropio={mensajePropio}
          onMensajePropio={setMensajePropio}
          mostrarCita={mostrarCita}
          onMostrarCita={setMostrarCita}
          tamVersiculo={tamVersiculo}
          onTamVersiculo={setTamVersiculo}
          ajusteYVersiculo={ajusteYVersiculo}
          onAjusteYVersiculo={setAjusteYVersiculo}
          onRestablecer={restablecerAjustes}
          mensajeIndex={mensajeIndex}
          onMensajeIndex={cambiarMensajeIndex}
          mensajeEnvio={mensajeEnvio}
          onMensajeEnvio={setMensajeManual}
          nombreValido={nombreValido}
          canvasListo={canvasListo}
          onDescargar={descargar}
          onEnviar={enviar}
          onCopiar={copiarMensaje}
          reducido={reducido}
        />
      </div>

      <div className="taller__barra-movil" role="group" aria-label="Acciones de invitación">
        <button type="button" disabled={!nombreValido || !canvasListo} onClick={descargar}>Descargar</button>
        <button type="button" disabled={!nombreValido || !canvasListo} onClick={enviar}>Enviar</button>
        <span>En escritorio, descarga la imagen y adjúntala al chat de WhatsApp.</span>
      </div>
      <div className="taller__toast" aria-live="polite" role="status" key={toast?.id}>
        {toast?.texto}
      </div>
    </section>
  )
}
