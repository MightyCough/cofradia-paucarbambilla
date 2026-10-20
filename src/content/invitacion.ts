// Generador de invitaciones (página /invitacion).
// Las posiciones son fracciones de la imagen (0 = arriba/izquierda, 1 = abajo/derecha),
// medidas sobre cada plantilla: `nombre` es el recuadro claro, `mensaje` la zona libre de abajo.
export interface Plantilla {
  id: string
  etiqueta: string
  src: string // 941 × 1672 (9:16)
  mini: string
  nombre: { centroY: number; izquierda: number; derecha: number; alto: number }
  mensaje: { centroY: number; izquierda: number; derecha: number }
}

export interface Versiculo {
  texto: string
  cita: string
  tema: 'Niño Jesús' | 'Alegría y danza' | 'Fe' | 'Hermandad'
}

export const invitacion = {
  titulo: 'Crea tu invitación',
  intro: 'Elige una plantilla, escribe el nombre de tu invitado y compártela.',
  ancho: 1080,
  alto: 1920,
  plantillas: [
    {
      id: 'negrito',
      etiqueta: 'Negrito',
      src: '/assets/invitacion/plantilla-1.webp',
      mini: '/assets/invitacion/plantilla-1-mini.webp',
      nombre: { centroY: 0.4725, izquierda: 0.16, derecha: 0.84, alto: 0.07 },
      mensaje: { centroY: 0.835, izquierda: 0.14, derecha: 0.86 },
    },
    {
      id: 'corochano',
      etiqueta: 'Corochano',
      src: '/assets/invitacion/plantilla-2.webp',
      mini: '/assets/invitacion/plantilla-2-mini.webp',
      nombre: { centroY: 0.519, izquierda: 0.12, derecha: 0.88, alto: 0.08 },
      mensaje: { centroY: 0.875, izquierda: 0.22, derecha: 0.78 },
    },
    {
      id: 'caporal-dama',
      etiqueta: 'Caporal y Dama',
      src: '/assets/invitacion/plantilla-3.webp',
      mini: '/assets/invitacion/plantilla-3-mini.webp',
      nombre: { centroY: 0.625, izquierda: 0.11, derecha: 0.89, alto: 0.075 },
      mensaje: { centroY: 0.912, izquierda: 0.2, derecha: 0.8 },
    },
  ] satisfies Plantilla[],

  // Banco de mensajes bíblicos (Reina-Valera 1960).
  versiculos: [
    { tema: 'Niño Jesús', cita: 'Mateo 19:14', texto: 'Dejad a los niños venir a mí, y no se lo impidáis; porque de los tales es el reino de los cielos.' },
    { tema: 'Niño Jesús', cita: 'Isaías 9:6', texto: 'Porque un niño nos es nacido, hijo nos es dado, y el principado sobre su hombro.' },
    { tema: 'Niño Jesús', cita: 'Lucas 2:14', texto: '¡Gloria a Dios en las alturas, y en la tierra paz, buena voluntad para con los hombres!' },
    { tema: 'Niño Jesús', cita: 'Lucas 2:52', texto: 'Y Jesús crecía en sabiduría y en estatura, y en gracia para con Dios y los hombres.' },
    { tema: 'Niño Jesús', cita: 'Proverbios 22:6', texto: 'Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él.' },
    { tema: 'Alegría y danza', cita: 'Salmos 149:3', texto: 'Alaben su nombre con danza; con pandero y arpa a él canten.' },
    { tema: 'Alegría y danza', cita: 'Salmos 150:4', texto: 'Alabadle con pandero y danza; alabadle con cuerdas y flautas.' },
    { tema: 'Alegría y danza', cita: 'Salmos 30:11', texto: 'Has cambiado mi lamento en baile; desataste mi cilicio, y me ceñiste de alegría.' },
    { tema: 'Alegría y danza', cita: 'Salmos 118:24', texto: 'Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.' },
    { tema: 'Alegría y danza', cita: 'Filipenses 4:4', texto: 'Regocijaos en el Señor siempre. Otra vez digo: ¡Regocijaos!' },
    { tema: 'Alegría y danza', cita: 'Nehemías 8:10', texto: 'No os entristezcáis, porque el gozo de Jehová es vuestra fuerza.' },
    { tema: 'Fe', cita: 'Filipenses 4:13', texto: 'Todo lo puedo en Cristo que me fortalece.' },
    { tema: 'Fe', cita: 'Salmos 23:1', texto: 'Jehová es mi pastor; nada me faltará.' },
    { tema: 'Fe', cita: 'Salmos 51:10', texto: 'Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí.' },
    { tema: 'Fe', cita: 'Salmos 143:10', texto: 'Enséñame a hacer tu voluntad, porque tú eres mi Dios.' },
    { tema: 'Hermandad', cita: 'Mateo 18:20', texto: 'Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.' },
    { tema: 'Hermandad', cita: 'Salmos 133:1', texto: '¡Mirad cuán bueno y cuán delicioso es habitar los hermanos juntos en armonía!' },
    { tema: 'Hermandad', cita: 'Juan 15:12', texto: 'Este es mi mandamiento: Que os améis unos a otros, como yo os he amado.' },
    { tema: 'Hermandad', cita: 'Josué 24:15', texto: 'Pero yo y mi casa serviremos a Jehová.' },
  ] satisfies Versiculo[],

  // Mensajes para acompañar la invitación al enviarla. `{nombre}` se reemplaza por el invitado.
  mensajesEnvio: [
    '{nombre}, te invito a ser partícipe de mi cofradía, Niño Jesús de Paucarbambilla. ¡Acompáñanos en nuestras festividades del 13 al 16 de enero!',
    'Querido(a) {nombre}: con mucho cariño te invito a vivir con nosotros la fe y la tradición de la Danza de los Negritos. ¡Te esperamos del 13 al 16 de enero!',
    '{nombre}, la Cofradía de Negritos Niño Jesús de Paucarbambilla te invita a compartir nuestra devoción y alegría. ¡No faltes!',
    'Hola {nombre}, este año celebramos juntos al Niño Jesús. Te invito a ser parte de nuestra cofradía en Huánuco.',
  ],
}
