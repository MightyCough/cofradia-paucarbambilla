// Mayordomía de la fiesta (página /mayordomia).
// Hay un espacio por cada día de la celebración. Mientras un espacio no tenga `nombre`,
// la página lo muestra como "Próximamente".
// Para completar uno: escribe `nombre` y, si hay foto, cópiala a public/assets/mayordomia/
// y pon su ruta en `foto` (ejemplo: '/assets/mayordomia/apellido.webp', vertical 4:5).
export interface Mayordomo {
  cargo: string
  dia: string // cuándo le toca, tal como se muestra
  nombre?: string
  foto?: string
}

export const mayordomia = {
  titulo: 'Los mayordomos',
  intro: 'Ellos son los encargados de organizar la festividad.',
  aviso: 'Próximamente',
  avisoTexto: 'Muy pronto daremos a conocer a los mayordomos de la próxima celebración.',
  mayordomos: [
    { cargo: 'Mayordomo de la víspera', dia: '13 de enero' },
    { cargo: 'Mayordomo del primer día', dia: '14 de enero' },
    { cargo: 'Mayordomo del segundo día', dia: '15 de enero' },
    { cargo: 'Mayordomo del tercer día', dia: '16 de enero' },
  ] satisfies Mayordomo[],
}
