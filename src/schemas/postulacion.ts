import { z } from 'zod'

import { ROLES } from '@/content/roles'

// La lista de roles se edita en src/content/roles.ts.
export { ROLES }

export const postulacionSchema = z.object({
  nombres: z.string().trim().min(2, 'Ingresa tus nombres'),
  apellidos: z.string().trim().min(2, 'Ingresa tus apellidos'),
  dni: z.string().regex(/^\d{8}$/, 'El DNI tiene 8 dígitos'),
  telefono: z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{9,15}$/, 'Ingresa un teléfono válido'),
  correo: z.email('Ingresa un correo válido'),
  edad: z.coerce.number().int().min(10, 'Edad no válida').max(99, 'Edad no válida'),
  // Los valores válidos salen de ROLES: se editan en un solo lugar.
  rol: z.literal(
    ROLES.map((r) => r.valor),
    'Elige un rol',
  ),
  experiencia: z.string().trim().max(600, 'Máximo 600 caracteres').optional(),
  motivo: z
    .string()
    .trim()
    .min(20, 'Cuéntanos un poco más (mínimo 20 caracteres)')
    .max(1000, 'Máximo 1000 caracteres'),
  acepta: z.literal(true, 'Debes aceptar para poder enviar'),
  // Campo trampa para bots: las personas nunca lo ven ni lo llenan.
  sitioWeb: z.string().max(0).optional(),
})

export type PostulacionEntrada = z.input<typeof postulacionSchema>
export type Postulacion = z.output<typeof postulacionSchema>
