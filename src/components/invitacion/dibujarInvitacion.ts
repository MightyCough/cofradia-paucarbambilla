import type { Plantilla, Versiculo } from '@/content/invitacion'

interface OpcionesDibujo {
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
}

const ANCHO = 1080
const ALTO = 1920

function ajustarEnDosLineas(ctx: CanvasRenderingContext2D, texto: string, ancho: number) {
  const palabras = texto.split(/\s+/)
  const lineas = ['', '']

  for (const palabra of palabras) {
    if (!lineas[0]) {
      lineas[0] = palabra
      continue
    }
    const candidata = lineas[0] ? `${lineas[0]} ${palabra}` : palabra
    if (!lineas[1] && ctx.measureText(candidata).width <= ancho) lineas[0] = candidata
    else lineas[1] = lineas[1] ? `${lineas[1]} ${palabra}` : palabra
  }

  return lineas.filter(Boolean)
}

function ajustarPorPalabras(ctx: CanvasRenderingContext2D, texto: string, ancho: number) {
  const lineas: string[] = []

  for (const palabra of texto.split(/\s+/)) {
    const ultima = lineas.length - 1
    const candidata = ultima >= 0 ? `${lineas[ultima]} ${palabra}` : palabra
    if (ultima >= 0 && ctx.measureText(candidata).width <= ancho) lineas[ultima] = candidata
    else lineas.push(palabra)
  }

  return lineas
}

function medirVersiculo(
  ctx: CanvasRenderingContext2D,
  texto: string,
  ancho: number,
  centroY: number,
  mostrarCita: boolean,
  tamanoInicial: number,
) {
  for (let tamano = tamanoInicial; tamano >= 8; tamano -= 1) {
    ctx.font = `italic 400 ${tamano}px "EB Garamond"`
    const lineas = ajustarPorPalabras(ctx, `“${texto}”`, ancho)
    const altoLinea = tamano * 1.3
    const tamanoCita = tamano * 0.7
    const altoCita = mostrarCita ? tamanoCita * 1.3 : 0
    const espacioCita = mostrarCita ? tamano * 0.3 : 0
    const altoBloque = lineas.length * altoLinea + altoCita + espacioCita
    const dentroDelAncho = lineas.every((linea) => ctx.measureText(linea).width <= ancho)
    const arriba = centroY - altoBloque / 2
    const abajo = centroY + altoBloque / 2

    if ((dentroDelAncho && arriba >= 0 && abajo <= ALTO) || tamano === 8) {
      return { tamano, lineas, altoLinea, tamanoCita, altoCita, altoBloque }
    }
  }

  return { tamano: 8, lineas: [texto], altoLinea: 10.4, tamanoCita: 5.6, altoCita: 0, altoBloque: 10.4 }
}

export function dibujarInvitacion(ctx: CanvasRenderingContext2D, opciones: OpcionesDibujo) {
  const {
    plantilla, imagen, nombre, colorNombre, tamNombre, ajusteYNombre,
    versiculo, mostrarCita, tamVersiculo, ajusteYVersiculo, colorVersiculo,
  } = opciones
  const canvas = ctx.canvas
  if (canvas.width !== ANCHO) canvas.width = ANCHO
  if (canvas.height !== ALTO) canvas.height = ALTO

  ctx.clearRect(0, 0, ANCHO, ALTO)
  ctx.fillStyle = '#120c0b'
  ctx.fillRect(0, 0, ANCHO, ALTO)
  ctx.imageSmoothingQuality = 'high'
  if (imagen) ctx.drawImage(imagen, 0, 0, ANCHO, ALTO)

  const textoNombre = nombre.trim() ? nombre.trim().toLocaleUpperCase('es-PE') : 'NOMBRE DEL INVITADO'
  const anchoNombre = Math.max(20, (plantilla.nombre.derecha - plantilla.nombre.izquierda) * ANCHO - 40)
  const altoNombre = plantilla.nombre.alto * ALTO
  const centroXNombre = ((plantilla.nombre.izquierda + plantilla.nombre.derecha) / 2) * ANCHO
  const centroYNombre = plantilla.nombre.centroY * ALTO + ajusteYNombre
  let tamanoNombre = Math.max(48, tamNombre)
  let lineasNombre: string[]

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${tamanoNombre}px Cinzel`
  while (tamanoNombre > 48 && ctx.measureText(textoNombre).width > anchoNombre) {
    tamanoNombre -= 1
    ctx.font = `700 ${tamanoNombre}px Cinzel`
  }

  if (ctx.measureText(textoNombre).width <= anchoNombre) lineasNombre = [textoNombre]
  else {
    tamanoNombre = 48
    ctx.font = `700 ${tamanoNombre}px Cinzel`
    lineasNombre = ajustarEnDosLineas(ctx, textoNombre, anchoNombre)
    while (
      tamanoNombre > 12 &&
      (lineasNombre.some((linea) => ctx.measureText(linea).width > anchoNombre) || tamanoNombre * lineasNombre.length > altoNombre)
    ) {
      tamanoNombre -= 1
      ctx.font = `700 ${tamanoNombre}px Cinzel`
      lineasNombre = ajustarEnDosLineas(ctx, textoNombre, anchoNombre)
    }
  }

  ctx.save()
  ctx.globalAlpha = nombre.trim() ? 1 : 0.28
  ctx.font = `700 ${tamanoNombre}px Cinzel`
  ctx.fillStyle = colorNombre
  ctx.shadowColor = 'rgba(255,255,255,.45)'
  ctx.shadowBlur = 2
  const altoLineaNombre = Math.min(tamanoNombre * 1.05, altoNombre / lineasNombre.length)
  lineasNombre.forEach((linea, indice) => {
    const y = centroYNombre + (indice - (lineasNombre.length - 1) / 2) * altoLineaNombre
    ctx.fillText(linea, centroXNombre, y, anchoNombre)
  })
  ctx.restore()

  const textoVersiculo = versiculo.texto.trim()
  const anchoVersiculo = Math.max(20, (plantilla.mensaje.derecha - plantilla.mensaje.izquierda) * ANCHO - 32)
  const centroXVersiculo = ((plantilla.mensaje.izquierda + plantilla.mensaje.derecha) / 2) * ANCHO
  const centroYVersiculo = plantilla.mensaje.centroY * ALTO + ajusteYVersiculo

  if (!textoVersiculo) return

  const layoutVersiculo = medirVersiculo(
    ctx,
    textoVersiculo,
    anchoVersiculo,
    centroYVersiculo,
    mostrarCita,
    Math.max(12, tamVersiculo),
  )
  const { tamano: tamanoVersiculo, lineas: lineasVersiculo, altoLinea: altoLineaVersiculo, tamanoCita, altoCita, altoBloque } = layoutVersiculo

  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = colorVersiculo
  ctx.shadowColor = 'rgba(0,0,0,.85)'
  ctx.shadowBlur = 8
  ctx.font = `italic 400 ${tamanoVersiculo}px "EB Garamond"`
  const inicio = centroYVersiculo - altoBloque / 2 + altoLineaVersiculo / 2
  lineasVersiculo.forEach((linea, indice) => {
    ctx.fillText(linea, centroXVersiculo, inicio + indice * altoLineaVersiculo, anchoVersiculo)
  })

  if (mostrarCita) {
    ctx.font = `600 ${tamanoCita}px Cinzel`
    ctx.fillText(`— ${versiculo.cita}`, centroXVersiculo, centroYVersiculo + altoBloque / 2 - altoCita / 2, anchoVersiculo)
  }
  ctx.restore()
}
