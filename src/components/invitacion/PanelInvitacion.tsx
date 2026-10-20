import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { animate, createScope } from 'animejs'
import type { Plantilla, Versiculo } from '@/content/invitacion'

type Tema = 'Todos' | Versiculo['tema']

interface Props {
  plantillas: Plantilla[]
  plantillaId: string
  onPlantilla: (id: string) => void
  nombre: string
  onNombre: (nombre: string) => void
  colorNombre: string
  onColorNombre: (color: string) => void
  tamNombre: number
  onTamNombre: (tam: number) => void
  ajusteYNombre: number
  onAjusteYNombre: (ajuste: number) => void
  filtro: Tema
  onFiltro: (tema: Tema) => void
  versiculos: Versiculo[]
  versiculoIndex: number
  onVersiculo: (index: number) => void
  mensajePropioActivo: boolean
  onMensajePropioActivo: (activo: boolean) => void
  mensajePropio: string
  onMensajePropio: (mensaje: string) => void
  mostrarCita: boolean
  onMostrarCita: (mostrar: boolean) => void
  tamVersiculo: number
  onTamVersiculo: (tam: number) => void
  ajusteYVersiculo: number
  onAjusteYVersiculo: (ajuste: number) => void
  onRestablecer: () => void
  mensajeIndex: number
  onMensajeIndex: (index: number) => void
  mensajeEnvio: string
  onMensajeEnvio: (mensaje: string) => void
  nombreValido: boolean
  canvasListo: boolean
  onDescargar: () => void
  onEnviar: () => void
  onCopiar: () => void
  reducido: boolean
}

const TEMAS: Tema[] = ['Todos', 'Niño Jesús', 'Alegría y danza', 'Fe', 'Hermandad']
const COLORES = [
  { valor: '#2a1606', etiqueta: 'Tinta oscura' },
  { valor: '#6b0f1a', etiqueta: 'Granate' },
  { valor: '#7a5410', etiqueta: 'Dorado oscuro' },
]

function indiceAleatorio(maximo: number) {
  return Math.floor(Math.random() * maximo)
}

function Icono({ tipo }: { tipo: 'menos' | 'mas' | 'arriba' | 'abajo' | 'azar' | 'check' }) {
  const rutas = {
    menos: <path d="M5 12h14" />,
    mas: <path d="M12 5v14M5 12h14" />,
    arriba: <path d="m5 14 7-7 7 7" />,
    abajo: <path d="m5 10 7 7 7-7" />,
    azar: <><path d="m16 3 4 4-4 4" /><path d="M4 17h2.5a5 5 0 0 0 4-2l3-4a5 5 0 0 1 4-2H20" /><path d="m16 13 4 4-4 4" /><path d="M4 7h2.5a5 5 0 0 1 2.7.8" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {rutas[tipo]}
    </svg>
  )
}

function Ajuste({
  titulo, alBajar, alSubir, etiquetaBajar, etiquetaSubir, bajar, subir, deshabilitarBajar, deshabilitarSubir,
}: {
  titulo: string
  alBajar: () => void
  alSubir: () => void
  etiquetaBajar: string
  etiquetaSubir: string
  bajar: 'menos' | 'arriba'
  subir: 'mas' | 'abajo'
  deshabilitarBajar?: boolean
  deshabilitarSubir?: boolean
}) {
  return (
    <div className="taller__ajuste">
      <span className="taller__ajuste-titulo">{titulo}</span>
      <div className="taller__ajuste-botones">
        <button className="taller__boton-icono" type="button" onClick={alBajar} aria-label={etiquetaBajar} disabled={deshabilitarBajar}>
          <Icono tipo={bajar} />
        </button>
        <button className="taller__boton-icono" type="button" onClick={alSubir} aria-label={etiquetaSubir} disabled={deshabilitarSubir}>
          <Icono tipo={subir} />
        </button>
      </div>
    </div>
  )
}

export function PanelInvitacion(props: Props) {
  const raizRef = useRef<HTMLElement>(null)
  const dadoRef = useRef<SVGSVGElement>(null)
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null)
  const temaActivo = props.filtro
  const versiculosVisibles = props.versiculos
    .map((versiculo, index) => ({ versiculo, index }))
    .filter(({ versiculo }) => temaActivo === 'Todos' || versiculo.tema === temaActivo)

  useLayoutEffect(() => {
    const raiz = raizRef.current
    if (!raiz) return
    const scope = createScope({ root: raiz })
    scopeRef.current = scope
    return () => {
      scope.revert()
      scopeRef.current = null
    }
  }, [])

  function elegirAlAzar() {
    const opciones = versiculosVisibles.filter(({ index }) => index !== props.versiculoIndex)
    if (!opciones.length) return
    props.onVersiculo(opciones[indiceAleatorio(opciones.length)].index)
    if (!props.reducido && dadoRef.current) {
      scopeRef.current?.execute(() => animate(dadoRef.current!, {
        rotate: '1turn',
        duration: 480,
        ease: 'outBack',
      }))
    }
  }

  return (
    <aside className="taller__panel" ref={raizRef} aria-label="Pasos para crear la invitación">
      <section className="taller__paso" data-paso aria-labelledby="taller-plantilla">
        <div className="taller__paso-titulo">
          <span className="taller__numero" aria-hidden="true">1</span>
          <h2 id="taller-plantilla">Elige la plantilla</h2>
        </div>
        <div className="taller__plantillas" role="group" aria-label="Plantillas disponibles">
          {props.plantillas.map((plantilla) => (
            <button
              className={`taller__plantilla${props.plantillaId === plantilla.id ? ' taller__plantilla--activa' : ''}`}
              type="button"
              key={plantilla.id}
              aria-label={`Plantilla ${plantilla.etiqueta}`}
              aria-pressed={props.plantillaId === plantilla.id}
              onClick={() => props.onPlantilla(plantilla.id)}
            >
              <img src={plantilla.mini} alt="" loading="eager" />
              <span>{plantilla.etiqueta}</span>
              {props.plantillaId === plantilla.id && <span className="taller__check"><Icono tipo="check" /></span>}
            </button>
          ))}
        </div>
      </section>

      <section className="taller__paso" data-paso aria-labelledby="taller-nombre">
        <div className="taller__paso-titulo">
          <span className="taller__numero" aria-hidden="true">2</span>
          <h2 id="taller-nombre">Nombre del invitado</h2>
        </div>
        <label className="taller__etiqueta" htmlFor="taller-nombre-input">¿A quién vas a invitar?</label>
        <div className="taller__entrada-conteo">
          <input
            id="taller-nombre-input"
            className="taller__entrada-nombre"
            type="text"
            value={props.nombre}
            maxLength={40}
            autoComplete="off"
            aria-describedby="taller-nombre-conteo"
            placeholder="Escribe su nombre"
            onChange={(event) => props.onNombre(event.target.value)}
          />
          <span id="taller-nombre-conteo" className="taller__contador">{props.nombre.length}/40</span>
        </div>
        <div className="taller__ajustes" aria-label="Ajustes del nombre">
          <Ajuste
            titulo="Tamaño"
            bajar="menos"
            subir="mas"
            etiquetaBajar="Reducir tamaño del nombre"
            etiquetaSubir="Agrandar nombre"
            deshabilitarBajar={props.tamNombre <= 48}
            deshabilitarSubir={props.tamNombre >= 120}
            alBajar={() => props.onTamNombre(Math.max(48, props.tamNombre - 4))}
            alSubir={() => props.onTamNombre(Math.min(120, props.tamNombre + 4))}
          />
          <Ajuste
            titulo="Posición"
            bajar="arriba"
            subir="abajo"
            etiquetaBajar="Subir nombre"
            etiquetaSubir="Bajar nombre"
            alBajar={() => props.onAjusteYNombre(props.ajusteYNombre - 12)}
            alSubir={() => props.onAjusteYNombre(props.ajusteYNombre + 12)}
          />
        </div>
        <div className="taller__colores" role="group" aria-label="Color del nombre">
          <span className="taller__ajuste-titulo">Color</span>
          {COLORES.map(({ valor, etiqueta }) => (
            <button
              key={valor}
              className="taller__muestra"
              type="button"
              style={{ '--muestra': valor } as CSSProperties}
              aria-label={etiqueta}
              aria-pressed={props.colorNombre === valor}
              onClick={() => props.onColorNombre(valor)}
            />
          ))}
        </div>
      </section>

      <section className="taller__paso" data-paso aria-labelledby="taller-mensaje">
        <div className="taller__paso-titulo">
          <span className="taller__numero" aria-hidden="true">3</span>
          <h2 id="taller-mensaje">Mensaje bíblico</h2>
        </div>
        <div className="taller__temas" role="group" aria-label="Filtrar mensajes por tema">
          {TEMAS.map((tema) => (
            <button
              className={`taller__chip${props.filtro === tema ? ' taller__chip--activo' : ''}`}
              type="button"
              key={tema}
              aria-pressed={props.filtro === tema}
              onClick={() => props.onFiltro(tema)}
            >
              {tema}
            </button>
          ))}
        </div>
        <div className="taller__versiculos" aria-label="Mensajes bíblicos">
          {versiculosVisibles.map(({ versiculo, index }) => (
            <button
              className={`taller__versiculo${props.versiculoIndex === index ? ' taller__versiculo--activo' : ''}`}
              type="button"
              key={`${versiculo.cita}-${index}`}
              aria-pressed={props.versiculoIndex === index}
              onClick={() => props.onVersiculo(index)}
            >
              <span>{versiculo.texto}</span>
              <small>— {versiculo.cita}</small>
            </button>
          ))}
        </div>
        <button
          className="taller__boton-azar"
          type="button"
          onClick={elegirAlAzar}
          disabled={versiculosVisibles.length < 2}
        >
          <svg ref={dadoRef} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m16 3 4 4-4 4" /><path d="M4 17h2.5a5 5 0 0 0 4-2l3-4a5 5 0 0 1 4-2H20" /><path d="m16 13 4 4-4 4" /><path d="M4 7h2.5a5 5 0 0 1 2.7.8" />
          </svg>
          Al azar
        </button>
        <button
          className={`taller__propio-toggle${props.mensajePropioActivo ? ' taller__propio-toggle--activo' : ''}`}
          type="button"
          aria-pressed={props.mensajePropioActivo}
          onClick={() => props.onMensajePropioActivo(!props.mensajePropioActivo)}
        >
          {props.mensajePropioActivo ? 'Usar un mensaje del listado' : 'Escribir mi propio mensaje'}
        </button>
        {props.mensajePropioActivo && (
          <label className="taller__campo-mensaje">
            <span className="taller__etiqueta">Tu mensaje <span>{props.mensajePropio.length}/180</span></span>
            <textarea
              value={props.mensajePropio}
              maxLength={180}
              rows={3}
              placeholder="Escribe un mensaje para la invitación"
              onChange={(event) => props.onMensajePropio(event.target.value)}
            />
          </label>
        )}
        <label className="taller__interruptor">
          <input
            type="checkbox"
            checked={props.mostrarCita && !props.mensajePropioActivo}
            disabled={props.mensajePropioActivo}
            onChange={(event) => props.onMostrarCita(event.target.checked)}
          />
          <span className="taller__interruptor-pista" aria-hidden="true" />
          Mostrar la cita
        </label>
        <div className="taller__ajustes">
          <Ajuste
            titulo="Tamaño"
            bajar="menos"
            subir="mas"
            etiquetaBajar="Reducir tamaño del mensaje"
            etiquetaSubir="Agrandar mensaje"
            deshabilitarBajar={props.tamVersiculo <= 20}
            deshabilitarSubir={props.tamVersiculo >= 64}
            alBajar={() => props.onTamVersiculo(Math.max(20, props.tamVersiculo - 2))}
            alSubir={() => props.onTamVersiculo(Math.min(64, props.tamVersiculo + 2))}
          />
          <Ajuste
            titulo="Posición"
            bajar="arriba"
            subir="abajo"
            etiquetaBajar="Subir mensaje"
            etiquetaSubir="Bajar mensaje"
            alBajar={() => props.onAjusteYVersiculo(props.ajusteYVersiculo - 12)}
            alSubir={() => props.onAjusteYVersiculo(props.ajusteYVersiculo + 12)}
          />
        </div>
        <button className="taller__restablecer" type="button" onClick={props.onRestablecer}>
          Restablecer ajustes
        </button>
      </section>

      <section className="taller__paso taller__paso--comparte" data-paso aria-labelledby="taller-comparte">
        <div className="taller__paso-titulo">
          <span className="taller__numero" aria-hidden="true">4</span>
          <h2 id="taller-comparte">Comparte</h2>
        </div>
        <label className="taller__etiqueta" htmlFor="taller-mensaje-tipo">Mensaje que acompaña</label>
        <select
          id="taller-mensaje-tipo"
          className="taller__selector"
          value={props.mensajeIndex}
          onChange={(event) => props.onMensajeIndex(Number(event.target.value))}
        >
          {[0, 1, 2, 3].map((index) => <option key={index} value={index}>Mensaje {index + 1}</option>)}
        </select>
        <label className="taller__campo-mensaje" htmlFor="taller-mensaje-envio">
          <span className="taller__sr-only">Edita el mensaje para compartir</span>
          <textarea
            id="taller-mensaje-envio"
            value={props.mensajeEnvio}
            rows={4}
            onChange={(event) => props.onMensajeEnvio(event.target.value)}
          />
        </label>
        {!props.nombreValido && <p className="taller__pista">Escribe el nombre del invitado</p>}
        {props.nombreValido && !props.canvasListo && <p className="taller__pista">Preparando la invitación…</p>}
        <div className="taller__acciones">
          <button className="boton boton--chico taller__accion-primaria" type="button" disabled={!props.nombreValido || !props.canvasListo} onClick={props.onDescargar}>
            Descargar imagen
          </button>
          <button className="boton boton--chico taller__accion-secundaria" type="button" disabled={!props.nombreValido || !props.canvasListo} onClick={props.onEnviar}>
            Enviar por WhatsApp
          </button>
          <button className="taller__copiar" type="button" onClick={props.onCopiar}>
            Copiar mensaje
          </button>
        </div>
        <p className="taller__nota-fallback">En escritorio, se descargará la imagen y se abrirá WhatsApp para que la adjuntes.</p>
      </section>
    </aside>
  )
}
