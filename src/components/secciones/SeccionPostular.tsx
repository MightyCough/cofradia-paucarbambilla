import { Link } from 'react-router-dom'

export function SeccionPostular() {
  return (
    <section className="seccion seccion--cierre" aria-labelledby="postular-titulo">
      <div className="cierre">
        <h2 id="postular-titulo">¿Quieres bailar con la cofradía?</h2>
        <p>Cuéntanos quién eres y qué rol te gustaría tener en la danza.</p>
        <Link to="/postular" className="boton">
          Llenar mi postulación
        </Link>
      </div>
    </section>
  )
}
