// Integrantes de la cuadrilla. Ejemplo:
// { nombre: 'Nombre Apellido', rol: 'Caporal', foto: '/assets/cuadrilla/nombre.webp', resena: 'Texto breve' }
export interface Integrante {
  nombre: string
  rol: string
  foto?: string
  resena?: string
}

export const cuadrilla: Integrante[] = [
  {
    nombre: 'Sebastian Flores Gonzales',
    rol: 'Abanderado',
    foto: '/assets/cuadrilla/sebastian-flores-gonzales.webp',
  },
  {
    nombre: 'Victor G. Chaupis Palomino',
    rol: 'Pampa',
    foto: '/assets/cuadrilla/victor-g-chaupis-palomino.webp',
    resena:
      'Tiene 43 años, es profesional y lleva dos años danzando como pampa. Llegó a la cofradía por invitación de un amigo y encuentra en esta tradición una expresión de fe y esperanza. Disfruta especialmente de compartir con toda la cuadrilla y fortalecer la hermandad. Le gustan el fútbol y los deportes, y transmite la convicción de que la fe ayuda a enfrentar las dificultades.',
  },
  {
    nombre: 'Luis Gonzales Cespedes',
    rol: 'Corochano',
    foto: '/assets/cuadrilla/luis-gonzales-cespedes.webp',
    resena:
      'Tiene 38 años, se dedica al comercio y lleva tres años representando al corochano. Se unió a la cofradía por devoción al Niño Jesús y por tradición. Danzar lo llena de orgullo por su tierra y le permite dar a conocer sus raíces. Su momento favorito es compartir con la cuadrilla y disfrutar de su hermandad. Invita a todos a acompañarlos y vivir esta hermosa experiencia.',
  },
  {
    nombre: 'Iván Rochabrun Takano',
    rol: 'Pampa',
    foto: '/assets/cuadrilla/ivan-rochabrun-takano.webp',
    resena:
      'Es estudiante, tiene 20 años y lleva dos años danzando como pampa. Su gusto por el baile lo llevó a formar parte de la cofradía, donde expresa su fe y devoción al Niño Jesús. Lo que más disfruta es compartir con toda la cuadrilla y vivir la hermandad. Le gustan el fútbol y los deportes, y anima a quienes los acompañan a seguir sus sueños.',
  },
  {
    nombre: 'Piero Freddy Mendoza Gavidia',
    rol: 'Guiador',
    foto: '/assets/cuadrilla/piero-freddy-mendoza-gavidia.webp',
    resena:
      'Es estudiante, tiene 25 años y lleva dos años danzando como guiador. Creció en el barrio de Paucarbambilla, rodeado de la tradición de los Negritos de Huánuco. Su fe en el Niño Jesús, el gusto por bailar y la confraternidad lo motivaron a integrarse a la cofradía. Para él, vestir el traje significa llevar cultura, tradición y devoción. Su momento favorito es la misa frente al Niño, y desea que la cuadrilla conserve las costumbres de antaño y su autenticidad.',
  },
  {
    nombre: 'Nicolas Echevarria Gonzales',
    rol: 'Pampa',
    foto: '/assets/cuadrilla/nicolas-echevarria-gonzales.webp',
    resena:
      'Es estudiante, tiene 16 años y lleva tres años participando como pampa. Su devoción al Niño Jesús lo animó a formar parte de la cofradía, y cada vez que danza siente que reafirma su fe. Lo que más disfruta de la festividad es compartir con toda la cuadrilla y vivir la hermandad entre sus integrantes. En sus ratos libres le gusta ver películas y descansar.',
  },
  {
    nombre: 'Deyvith Félix Deudor Duran',
    rol: 'Pampa',
    foto: '/assets/cuadrilla/deyvith-felix-deudor-duran.webp',
    resena:
      'Tiene 35 años, trabaja en ventas de campo y lleva tres años danzando como pampa. Desde niño soñaba con formar parte de una cofradía en su barrio, un sueño que pudo cumplir motivado también por sus amigos. Vestir el traje lo llena de orgullo y vive con especial cariño la despedida de la festividad. Desea que esta tradición nunca se pierda. En sus ratos libres disfruta de ver películas y descansar.',
  },
  {
    nombre: 'Franz Ferrer Saldaña',
    rol: 'Caporal',
    foto: '/assets/cuadrilla/franz-ferrer-saldana.webp',
    resena:
      'Tiene 40 años, se dedica al comercio y lleva tres años danzando como caporal. Fue parte de la fundación de la cofradía, impulsado por el deseo de que su querido barrio tuviera su propia festividad. Vestir el traje representa para él orgullo, devoción y esfuerzo. Recuerda con cariño una confusión de pasos durante el primer año que terminó pareciendo parte de la presentación. Valora el respeto a los antiguos danzantes y la continuidad de su cultura y tradición.',
  },
  {
    nombre: 'Dayiro D. Nolasco Deudor',
    rol: 'Abanderado',
    foto: '/assets/cuadrilla/dayiro-d-nolasco-deudor.webp',
    resena:
      'Es estudiante, tiene 15 años y lleva un año representando al abanderado. Su pasión por el Niño Jesús de Paucarbambilla lo motivó a unirse a la cofradía. Danzar le transmite felicidad y lo anima a bailar con entusiasmo. Su momento favorito es la despedida: disfruta tanto del último día que siente que no se cansa. En su tiempo libre le gustan el fútbol y los deportes.',
  },
]
