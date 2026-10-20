export interface EnlaceNav {
  etiqueta: string
  to: string
  destacado?: boolean
}

export const principales: readonly EnlaceNav[] = [
  { etiqueta: 'Historia', to: '/historia' },
  { etiqueta: 'La cuadrilla', to: '/cuadrilla' },
  { etiqueta: 'Mayordomía', to: '/mayordomia' },
  { etiqueta: 'Actividades', to: '/actividades' },
]

export const participa: readonly EnlaceNav[] = [
  { etiqueta: 'Catálogo', to: '/catalogo' },
  { etiqueta: 'Sorteos', to: '/sorteos' },
  { etiqueta: 'Crear invitación', to: '/invitacion', destacado: true },
]

export const enVivo = { etiqueta: 'En vivo', to: '/en-vivo' }
export const postular = { etiqueta: 'Postular', to: '/postular' }
