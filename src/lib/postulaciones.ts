import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Postulacion } from '@/schemas/postulacion'

/**
 * Guarda una postulación en Firestore.
 * El envío de correo al personal se engancha aquí más adelante
 * (extensión Trigger Email o Cloud Function) sin tocar el formulario.
 */
export async function enviarPostulacion(datos: Postulacion): Promise<void> {
  // Si el campo trampa viene lleno es un bot: fingimos éxito y no guardamos.
  if (datos.sitioWeb) return

  await addDoc(collection(db, 'postulaciones'), {
    nombres: datos.nombres,
    apellidos: datos.apellidos,
    dni: datos.dni,
    telefono: datos.telefono,
    correo: datos.correo,
    edad: datos.edad,
    rol: datos.rol,
    experiencia: datos.experiencia ?? '',
    motivo: datos.motivo,
    acepta: datos.acepta,
    estado: 'nueva',
    creadoEn: serverTimestamp(),
  })
}
