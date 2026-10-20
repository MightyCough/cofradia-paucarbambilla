import { Link } from 'react-router-dom'

export default function EnPreparacion({ nombre }: { nombre: string }) {
  return (
    <section className="seccion seccion--preparacion">
      <h1>{nombre}</h1>
      <p>Esta sección está en preparación. Cuando esté lista, vas a encontrar aquí su contenido.</p>
      <Link to="/" className="hero__accion">
        Volver al inicio
      </Link>
    </section>
  )
}
