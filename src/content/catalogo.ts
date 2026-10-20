// Catálogo oficial (página /catalogo). Los pedidos se envían por WhatsApp.
// Para agregar un producto, copia uno de la lista y cambia sus datos.
// Fotos: cópialas a public/assets/catalogo/ (cuadradas, 1200 × 1200 px) y pon sus rutas en `fotos`.
export interface Producto {
  id: string // único, sin espacios (se usa en el carrito)
  nombre: string
  precio: number // en soles
  descripcion?: string
  fotos?: string[]
  tallas?: string[] // si el producto tiene tallas, el cliente elige una
}

export const catalogo = {
  titulo: 'Catálogo oficial',
  intro: 'Lleva un recuerdo y apoya a nuestra cofradía.',
  // Número de WhatsApp que recibe los pedidos: código de país (51) + número, sin espacios ni "+".
  whatsapp: '51917309964',
  moneda: 'S/',
  aviso: 'Próximamente',
  avisoTexto: 'Muy pronto sumaremos más recuerdos de la cofradía.',
  // Cuántas tarjetas "Próximamente" mostrar después de los productos reales.
  plantillas: 3,
  productos: [
    {
      id: 'polo-original',
      nombre: 'Polo original',
      precio: 36,
    },
  ] satisfies Producto[],
}
