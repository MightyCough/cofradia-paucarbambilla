import type { ReactNode } from 'react'

interface Props {
  id: string
  titulo: string
  children: ReactNode
}

export function Seccion({ id, titulo, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="seccion">
      <div className="seccion__titulo">
        <h2 id={`${id}-titulo`}>{titulo}</h2>
      </div>
      {children}
    </section>
  )
}

/** Aviso de contenido pendiente: se ve claramente como marcador, no como texto real. */
export function SinContenido({ children }: { children: ReactNode }) {
  return <p className="aviso">{children}</p>
}
