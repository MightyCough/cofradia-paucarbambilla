import type { Foto } from '@/content/fotos'

interface Props {
  /** Qué foto va aquí, en palabras: "La cuadrilla en la procesión". */
  etiqueta: string
  medidas?: string
  proporcion?: string
  foto?: Foto
  className?: string
}

/** Muestra la foto real si existe; si no, un marcador claro con las medidas sugeridas. */
export function FotoMarcador({
  etiqueta,
  medidas = '1600 × 900 px',
  proporcion = '16 / 9',
  foto,
  className = '',
}: Props) {
  if (foto?.src) {
    return (
      <img
        src={foto.src}
        alt={foto.alt}
        loading="lazy"
        className={`foto ${className}`}
        style={{ aspectRatio: proporcion }}
      />
    )
  }

  return (
    <div
      className={`marcador ${className}`}
      style={{ aspectRatio: proporcion }}
      role="img"
      aria-label={`Espacio reservado para una foto: ${etiqueta}`}
    >
      <svg viewBox="0 0 48 48" width="40" height="40" fill="none" aria-hidden="true">
        <rect x="5" y="9" width="38" height="30" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="17" cy="20" r="3.5" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="m6 35 10-9 8 7 7-8 11 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
      <p>
        <strong>{etiqueta}</strong>
        <span>{medidas}</span>
      </p>
    </div>
  )
}
