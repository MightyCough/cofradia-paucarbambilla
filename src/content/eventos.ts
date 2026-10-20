// Programa de la fiesta (página /actividades).
// Hay una hoja por cada día. Mientras un día no tenga `actividades`, se muestra "Próximamente".
// Para completar un día, agrega elementos así:
//   actividades: [{ hora: '09:00', titulo: 'Misa en honor al Niño Jesús', lugar: 'Paucarbambilla' }]
export interface Actividad {
  hora?: string
  titulo: string
  lugar?: string
}

export interface DiaFiesta {
  fecha: string // AAAA-MM-DD
  jornada: string
  actividades?: Actividad[]
}

export const programa = {
  titulo: 'Programa de la fiesta',
  intro: 'Nuestra próxima celebración será los días 13 (la víspera), 14, 15 y 16 de enero.',
  // Inicio de la cuenta regresiva (hora de Perú, UTC−5).
  inicio: '2027-01-13T00:00:00-05:00',
  aviso: 'Próximamente',
  avisoTexto: 'Pronto publicaremos el programa completo de cada jornada.',
  dias: [
    { fecha: '2027-01-13', jornada: 'La víspera' },
    { fecha: '2027-01-14', jornada: 'Primer día' },
    { fecha: '2027-01-15', jornada: 'Segundo día' },
    { fecha: '2027-01-16', jornada: 'Tercer día · Despedida' },
  ] satisfies DiaFiesta[],
}
