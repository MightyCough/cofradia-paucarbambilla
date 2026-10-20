// Gran sorteo pro-fondos (página /sorteos). Plantilla: lo que diga `null` o no esté aún
// se muestra como "Próximamente". Completa los datos cuando la directiva los confirme.
export interface Premio {
  categoria: string // ej. 'Premio mayor'
  nombre?: string // ej. 'S/ 5,000 en efectivo'
  detalle?: string
  cantidad?: number
  foto?: string // /assets/sorteo/archivo.webp
}

export const sorteo = {
  titulo: 'Gran sorteo pro-fondos',
  proposito:
    'Apoya a la Cuadrilla Niño Jesús de Paucarbambilla para la confección de nuestros nuevos vestuarios.',
  aviso: 'Próximamente',
  avisoTexto: 'Muy pronto anunciaremos la fecha, los premios y cómo adquirir tu ticket.',
  // Fecha y hora del sorteo central (hora de Perú). null = aún no anunciada.
  fecha: null as string | null, // ej. '2026-12-25T15:00:00-05:00'
  precioTicket: null as number | null, // ej. 15
  // Números oficiales de tesorería para pagar. null = aún no anunciados.
  yape: null as string | null,
  plin: null as string | null,
  premios: [
    { categoria: 'Premio mayor' },
    { categoria: 'Segundo premio' },
    { categoria: 'Tercer premio' },
    { categoria: 'Premios sorpresa' },
  ] satisfies Premio[],
  pasos: [
    { titulo: 'Realiza el pago', texto: 'Usa Yape o Plin a los números oficiales de tesorería.' },
    { titulo: 'Guarda la captura', texto: 'Asegúrate de que se vean la fecha, el monto y el número de operación.' },
    { titulo: 'Envía tu comprobante', texto: 'Adjunta la imagen para que tesorería valide tu pago.' },
    { titulo: 'Recibe tu ticket', texto: 'Una vez validado, recibirás tu ticket virtual.' },
  ],
  preguntas: [
    {
      pregunta: '¿Cómo adquiero mi ticket?',
      respuesta:
        'Paga por Yape o Plin a los números oficiales, guarda la captura y envíala. Te asignaremos tu ticket tras validar el pago.',
    },
    {
      pregunta: '¿A qué se destina lo recaudado?',
      respuesta: 'Todo lo recaudado es pro-fondos para la cuadrilla, para la confección de nuevos vestuarios.',
    },
    {
      pregunta: '¿Cuándo y dónde será el sorteo?',
      respuesta:
        'El sorteo se realizará de forma presencial y se transmitirá en vivo. La fecha se anunciará próximamente.',
    },
  ],
}
