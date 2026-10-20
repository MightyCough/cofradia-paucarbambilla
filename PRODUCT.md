# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React (elegido por el usuario por su ecosistema de librerías de animación y fluidez) con Firebase para la configuración: Hosting, Firestore para guardar postulaciones y envío de correo al personal. Sin backend propio. Por decidir: bundler (Vite es la opción por defecto) y servicio de envío de correo (extensión Trigger Email o Cloud Function; ambas requieren el plan Blaze de Firebase).

## Users

- **Postulantes**: personas que quieren unirse a la cuadrilla y necesitan saber cómo hacerlo y enviar su postulación.
- **Devotos y familias de Huánuco**: siguen la fiesta y buscan fechas, actividades y noticias.
- **Turistas y curiosos**: descubren la danza de los negritos por primera vez y necesitan contexto.
- **Huanuqueños en el extranjero**: miembros o devotos que siguen la cofradía a distancia.

Los contenidos los actualizan el propio usuario y algunas personas de la cofradía con conocimientos técnicos básicos.

## Product Purpose

Sitio informativo y oficial de la Cofradía de Negritos "Niño Jesús de Paucarbambilla", de la ciudad de Huánuco (Perú). Comparte su historia, costumbres y tradiciones alrededor de la Danza de los Negritos, y permite que nuevas personas envíen su postulación por la página. Éxito: que la tradición quede bien contada y que las postulaciones lleguen completas al personal encargado.

## Positioning

Es la voz propia de esta cofradía en particular, con su historia, sus mayordomos y su cuadrilla reales, sobre una danza tradicional huanuqueña. Ninguna otra cofradía puede contar este mismo origen.

## Operating Context

- Ciudad: Huánuco, Perú. Contenido en español.
- Referencia de contenido (no de diseño): https://cofradia-paucarbambilla.vercel.app/. El usuario dijo explícitamente que su diseño no es una referencia.
- Fiesta principal: del 13 al 16 de enero, con un día previo (dato tomado de la página de referencia; confirmar con el usuario).

## Capabilities and Constraints

- Sitio informativo: historia, mayordomos, cuadrilla, actividades y eventos, contacto.
- **Formulario de postulación** con nombres, apellidos, teléfono, propósito y otros campos por definir. Al enviarse: se guarda en Firebase (Firestore) y llega un correo al personal encargado.
- Sin catálogo ni tienda por ahora; podrían añadirse en el futuro.
- Sin backend propio. Firebase cubre hosting, base de datos y correo.
- Fuera de alcance por ahora: panel de administración, recorrido en vivo por GPS, carrito con WhatsApp (existen en la referencia).
- Por decidir: campos exactos de la postulación, correo destinatario, requisitos para postular.

## Brand Commitments

- Nombre: Cofradía de Negritos "Niño Jesús de Paucarbambilla".
- Cuentan con logo o escudo propio, que debe respetarse.

## Evidence on Hand

El usuario indica que ya tiene: logo o escudo, fotos y videos, y texto de historia. Las rutas de los archivos aún no están en el proyecto. No inventar historia, nombres de mayordomos, integrantes, fechas ni testimonios; usar marcadores claros hasta recibirlos.

## Product Principles

1. La tradición manda: el contenido real de la cofradía va antes que cualquier adorno.
2. Postular tiene que ser fácil: un formulario corto y claro, que funcione bien en celular.
3. Respeto cultural: la danza de los negritos es una devoción viva; se presenta con dignidad y sin caricatura.
4. Simple de mantener: gente con conocimientos básicos debe poder actualizar el contenido.
5. Preparado para crecer: el catálogo o tienda puede sumarse después sin rehacer el sitio.

## Accessibility & Inclusion

Se espera uso mayoritario en celular y por parte de personas de distintas edades, incluidos devotos mayores. Priorizar legibilidad, textos claros en español y un formulario accesible.
