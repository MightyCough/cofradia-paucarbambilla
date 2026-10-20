# Cofradía de Negritos “Niño Jesús de Paucarbambilla”

Sitio web oficial de la Cofradía de Negritos **“Niño Jesús de Paucarbambilla”**, de Huánuco (Perú). Comparte la historia, las costumbres y la tradición de la Danza de los Negritos, presenta a la cuadrilla y permite postular para formar parte de ella.

La fiesta se celebra del **13 (víspera) al 16 de enero**.

## Secciones

| Ruta | Qué muestra |
|---|---|
| `/` | Portada con foto del desfile, comunicado de bienvenida (pliego lacrado que se abre al tocar el sello) e invitación a postular. |
| `/historia` | La historia de la cofradía en cuatro capítulos, con un hilo dorado que avanza al hacer scroll. |
| `/cuadrilla` | Los personajes de la danza (Negrito, Caporal, Turco, Dama, Abanderado, Corochano) y los integrantes con su reseña. |
| `/mayordomia` | Retratos de los mayordomos de cada día de la fiesta (plantillas “Próximamente”). |
| `/actividades` | Cuenta regresiva a la víspera y programa por día en hojas de almanaque. |
| `/catalogo` | Catálogo de recuerdos con bolsa de compras; el pedido se envía por WhatsApp. |
| `/sorteos` | Gran sorteo pro-fondos (plantilla “Próximamente”). |
| `/invitacion` | Generador de invitaciones: plantilla, nombre del invitado y versículo bíblico; se descarga o se comparte por WhatsApp. |
| `/postular` | Formulario de postulación a la cuadrilla (se guarda en Firebase). |
| `/en-vivo` | Recorrido en vivo de la cuadrilla (en preparación). |

## Tecnologías

- **React 19 + TypeScript + Vite**, con **pnpm**.
- **React Router** para las páginas.
- **anime.js** para las animaciones (y `motion` en algunas partes heredadas).
- **Firebase**: Firestore guarda las postulaciones; Hosting publica el sitio.
- **react-hook-form + zod** para validar el formulario.
- Tipografías autoalojadas: **Cinzel** (títulos) y **EB Garamond** (texto).

Todas las animaciones respetan la opción del sistema “reducir movimiento”.

## Puesta en marcha

Requisitos: Node 20 o superior y pnpm.

```bash
pnpm install
cp .env.example .env.local   # y completa los valores de Firebase
pnpm dev                     # servidor de desarrollo
```

Otros comandos:

```bash
pnpm build     # compila para producción en dist/
pnpm preview   # sirve la compilación
pnpm lint      # revisa el código
```

### Variables de entorno

Se leen de `.env.local` (no se sube a git). Los nombres están en `.env.example`:
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

### Publicar

```bash
pnpm build
pnpm exec firebase deploy                      # hosting + reglas
pnpm exec firebase deploy --only firestore:rules   # solo las reglas
```

## Cómo editar el contenido

El texto y los datos **no están dentro de los componentes**: viven en `src/content/`, para que se puedan cambiar sin tocar el diseño.

| Archivo | Contenido |
|---|---|
| `cofradia.ts` | Nombre, ciudad y textos de la portada. |
| `comunicado.ts` | Comunicado de bienvenida de la portada. |
| `historia.ts` | Capítulos de la historia y sus imágenes. |
| `roles.ts` | Personajes de la danza (foto y descripción). También alimenta el formulario. |
| `cuadrilla.ts` | Integrantes: nombre, rol, foto y reseña. |
| `mayordomos.ts` | Mayordomos por día. Sin `nombre` se muestran como “Próximamente”. |
| `eventos.ts` | Días de la fiesta, inicio de la cuenta regresiva y actividades de cada día. |
| `catalogo.ts` | Productos, precios y número de WhatsApp que recibe los pedidos. |
| `sorteo.ts` | Datos del sorteo (fecha, precio, premios, números de pago). |
| `invitacion.ts` | Plantillas de invitación, banco de versículos y mensajes para compartir. |
| `fotos.ts` | Fotos sueltas pendientes (por ejemplo, la de los fundadores). |
| `navegacion.ts` | Enlaces del menú. |

Las imágenes van en `public/assets/` (en WebP, ya optimizadas). Cada archivo de contenido explica en sus comentarios qué medidas usar.

**Importante:** si cambias la lista de roles en `roles.ts`, actualiza también la lista de roles permitidos en `firestore.rules` y vuelve a publicar las reglas.

## Estructura

```
src/
├── content/      datos y textos editables
├── pages/        una página por ruta
├── components/   piezas de cada página (historia/, cuadrilla/, catalogo/, invitacion/…) y layout/
├── lib/          Firebase y envío de postulaciones
├── schemas/      validación del formulario
├── hooks/
└── styles/       tokens.css (colores y fuentes), estilos globales y uno por página
```

## Pendientes

- Correo automático al personal cuando llega una postulación (extensión Trigger Email de Firebase, requiere plan Blaze).
- Página “En vivo”.
- Detalle del sorteo: comprobantes de pago, validación por tesorería y consulta de tickets.
- Foto de los fundadores, mayordomos, programa de actividades y fotos del catálogo.
