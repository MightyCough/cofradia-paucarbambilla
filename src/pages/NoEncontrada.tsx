import { Link } from 'react-router-dom'

export default function NoEncontrada() {
  return (
    <section className="seccion">
      <div className="seccion__titulo">
        <h1>Página no encontrada</h1>
      </div>
      <p className="intro">Esta dirección no existe o se movió.</p>
      <Link to="/" className="boton">
        Volver al inicio
      </Link>
    </section>
  )
}
