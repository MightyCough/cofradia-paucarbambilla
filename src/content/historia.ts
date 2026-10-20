// Historia de la cofradía, contada en capítulos (página /historia).
// `texto` es literal del relato original; el orden es cronológico.
// `visual` decide qué se ve junto al capítulo:
//   - 'foto': una foto de public/assets (src = versión grande, srcChica = versión de celular)
//   - 'marcador': un espacio reservado hasta tener la foto (ver src/content/fotos.ts)
//   - 'escudo': el escudo de la cofradía con una fecha grabada
export type VisualCapitulo =
  | { tipo: 'foto'; src: string; srcChica: string; alt: string }
  | { tipo: 'marcador'; foto: 'fundadores' }
  | { tipo: 'escudo'; fecha: string }

export interface Capitulo {
  numero: string
  titulo: string
  texto: string
  visual: VisualCapitulo
}

export const historia = {
  titulo: 'Nuestros orígenes',
  subtitulo: 'La historia de la Cofradía de Negritos “Niño Jesús de Paucarbambilla”',
  capitulos: [
    {
      numero: 'I',
      titulo: 'Una tarde de despedida',
      texto:
        'El origen de la institución se dio de manera espontánea durante el día de "despedida" de una cuadrilla hermana. Aquella tarde, tres amigos y vecinos del barrio de Paucarbambilla asistieron a la presentación. Al presenciar la devoción de los danzantes, el majestuoso porte de los cotones y el inconfundible sonido de las bandas, sintieron la necesidad de que su propio barrio tuviera una agrupación representativa.',
      visual: {
        tipo: 'foto',
        src: '/assets/historia/image9-1600.webp',
        srcChica: '/assets/historia/image9-900.webp',
        alt: 'Una cuadrilla de negritos con sus cotones bordados en oro, en pleno desfile',
      },
    },
    {
      numero: 'II',
      titulo: 'La mesa de tres amigos',
      texto:
        'Motivados por esta visión, ese mismo día se reunieron para consolidar el proyecto. En esa mesa de trabajo se acordó el nombre y el propósito de la hermandad: rendir homenaje al Niño Jesús mediante nuestra danza tradicional, llevando alegría y bendiciones a las calles de Paucarbambilla.',
      visual: { tipo: 'marcador', foto: 'fundadores' },
    },
    {
      numero: 'III',
      titulo: '12 de enero de 2022',
      texto:
        'La Cofradía de Negritos "Niño Jesús de Paucarbambilla" fue fundada oficialmente el 12 de enero de 2022. Su creación nació del profundo fervor por nuestras tradiciones huanuqueñas y el deseo de unir a nuestra comunidad a través de la fe y la cultura.',
      visual: { tipo: 'escudo', fecha: '12 · I · 2022' },
    },
    {
      numero: 'IV',
      titulo: 'Hoy',
      texto:
        'Hoy, a cuatro años de aquel 12 de enero, nuestra Cofradía ha pasado de ser el sueño de tres amigos a convertirse en una familia y un símbolo de identidad para el barrio. Cada temporada, nuestros Caporales, Pampas y Corochanos salen a las calles con el compromiso de preservar la majestuosa Danza de los Negritos de Huánuco, manteniendo viva la promesa que le dio inicio a esta gran historia.',
      visual: {
        tipo: 'foto',
        src: '/assets/historia/image14-1600.webp',
        srcChica: '/assets/historia/image14-900.webp',
        alt: 'Integrantes de la cofradía reunidos: caporales, pampas, turcos, la dama y el abanderado',
      },
    },
  ] satisfies Capitulo[],
}
