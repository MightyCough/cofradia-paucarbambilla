// Fotos de la página. Mientras `src` no exista, se muestra un marcador con las medidas sugeridas.
// Para poner una foto: copia el archivo a public/assets/fotos/ y escribe su ruta en `src`.
export interface Foto {
  src?: string // ejemplo: '/assets/fotos/portada.webp'
  alt: string
}

export const fotos = {
  portada: { alt: 'La cuadrilla de negritos bailando en la procesión' } satisfies Foto,
  historia: { alt: 'Fotografía antigua de la cofradía' } satisfies Foto,
  // Página de historia, capítulo II. Medidas sugeridas: 1600 × 1200 px.
  fundadores: { alt: 'Los tres amigos fundadores de la cofradía' } satisfies Foto,
} as const
