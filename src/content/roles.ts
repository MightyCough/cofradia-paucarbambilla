// Roles de la danza. Se usan en la sección "La cuadrilla" y en el formulario de postulación.
// `foto` y `descripcion` son opcionales: mientras falten, la página muestra un marcador.
// Si cambias o agregas un rol, actualiza también la lista de roles en firestore.rules.
export interface Rol {
  valor: string
  etiqueta: string
  foto?: string // ejemplo: '/assets/roles/caporal.webp'
  descripcion?: string
}

export const ROLES = [
  {
    valor: 'negrito_pampa',
    foto: '/assets/roles/negrito.webp',
    etiqueta: 'Negrito',
    descripcion:
      'Representa a los antiguos esclavos africanos celebrando su devoción y libertad. También se le conoce como Pampa. Su función es ejecutar los pasos y mudanzas coreográficas con sincronización, destreza y fervor ante el Niño Jesús.',
  },
  {
    valor: 'caporal',
    foto: '/assets/roles/caporal.webp',
    etiqueta: 'Caporal',
    descripcion:
      'Representa al capataz o líder de los esclavos de las haciendas coloniales. En la danza, es la máxima autoridad que dirige el ritmo y ordena con un silbato o campana los cambios coreográficos.',
  },
  {
    valor: 'turco',
    foto: '/assets/roles/turco.webp',
    etiqueta: 'Turco',
    descripcion:
      'Junto a la Dama, representa a los hacendados, amos coloniales y terratenientes de la alta sociedad. Su rol es desfilar con elegancia y distinción en medio de las filas, exhibiendo trajes lujosos sin realizar pasos complejos.',
  },
  {
    valor: 'dama',
    foto: '/assets/roles/dama.webp',
    etiqueta: 'Dama',
    descripcion:
      'Junto al Turco, representa a los hacendados, amos coloniales y terratenientes de la alta sociedad. Su rol es desfilar con elegancia y distinción en medio de las filas, exhibiendo trajes lujosos sin realizar pasos complejos.',
  },
  {
    valor: 'abanderado',
    foto: '/assets/roles/abanderado.webp',
    etiqueta: 'Abanderado',
    descripcion:
      'Representa el sentimiento patriótico, la libertad de los pueblos y la identidad de la cofradía. Se encarga de liderar el desfile portando la bandera, marchando con orgullo delante de toda la cuadrilla.',
  },
  {
    valor: 'corochano',
    foto: '/assets/roles/corochano.webp',
    etiqueta: 'Corochano',
    descripcion:
      'Representa satíricamente al viejo corregidor español, un juez déspota de la colonia. Durante el baile, abre espacio entre la multitud con un látigo mientras hace bromas y asusta amigablemente al público.',
  },
] as const satisfies readonly Rol[]

export const rolesDanza: readonly Rol[] = ROLES
