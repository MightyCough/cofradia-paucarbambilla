import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { enviarPostulacion } from '@/lib/postulaciones'
import {
  postulacionSchema,
  ROLES,
  type Postulacion,
  type PostulacionEntrada,
} from '@/schemas/postulacion'

type Estado = 'editando' | 'enviado' | 'error'

export function FormularioPostulacion() {
  const [estado, setEstado] = useState<Estado>('editando')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostulacionEntrada, unknown, Postulacion>({
    resolver: zodResolver(postulacionSchema),
  })

  async function alEnviar(datos: Postulacion) {
    try {
      await enviarPostulacion(datos)
      setEstado('enviado')
    } catch {
      setEstado('error')
    }
  }

  if (estado === 'enviado') {
    return (
      <div role="status" className="exito">
        <h2>¡Postulación recibida!</h2>
        <p>Gracias por tu interés. El personal de la cofradía se comunicará contigo.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(alEnviar)} noValidate className="formulario">
      <Campo etiqueta="Nombres" error={errors.nombres?.message}>
        <input autoComplete="given-name" {...register('nombres')} />
      </Campo>
      <Campo etiqueta="Apellidos" error={errors.apellidos?.message}>
        <input autoComplete="family-name" {...register('apellidos')} />
      </Campo>
      <Campo etiqueta="DNI" error={errors.dni?.message}>
        <input inputMode="numeric" maxLength={8} {...register('dni')} />
      </Campo>
      <Campo etiqueta="Teléfono (WhatsApp)" error={errors.telefono?.message}>
        <input type="tel" autoComplete="tel" {...register('telefono')} />
      </Campo>
      <Campo etiqueta="Correo electrónico" error={errors.correo?.message}>
        <input type="email" autoComplete="email" {...register('correo')} />
      </Campo>
      <Campo etiqueta="Edad" error={errors.edad?.message}>
        <input type="number" inputMode="numeric" {...register('edad')} />
      </Campo>
      <Campo etiqueta="¿Qué rol en la danza deseas tener?" error={errors.rol?.message}>
        <select defaultValue="" {...register('rol')}>
          <option value="" disabled>
            Elige una opción
          </option>
          {ROLES.map((r) => (
            <option key={r.valor} value={r.valor}>
              {r.etiqueta}
            </option>
          ))}
        </select>
      </Campo>
      <Campo etiqueta="Experiencia previa (opcional)" error={errors.experiencia?.message}>
        <textarea rows={3} {...register('experiencia')} />
      </Campo>
      <Campo etiqueta="¿Por qué quieres unirte?" error={errors.motivo?.message}>
        <textarea rows={5} {...register('motivo')} />
      </Campo>

      {/* Campo trampa anti-bots, oculto para las personas. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label>
          No llenar
          <input tabIndex={-1} autoComplete="off" {...register('sitioWeb')} />
        </label>
      </div>

      <label className="formulario__acepta">
        <input type="checkbox" {...register('acepta')} />
        Acepto que la cofradía use mis datos para contactarme sobre mi postulación.
      </label>
      {errors.acepta && <p role="alert">{errors.acepta.message}</p>}

      {estado === 'error' && (
        <p role="alert">No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.</p>
      )}

      <button type="submit" className="boton" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando…' : 'Enviar postulación'}
      </button>
    </form>
  )
}

function Campo({
  etiqueta,
  error,
  children,
}: {
  etiqueta: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="campo">
      <span>{etiqueta}</span>
      {children}
      {error && <span role="alert">{error}</span>}
    </label>
  )
}
