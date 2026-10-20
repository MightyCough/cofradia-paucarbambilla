import { FormularioPostulacion } from '@/components/postulacion/FormularioPostulacion'

export default function Postular() {
  return (
    <section className="seccion seccion--formulario">
      <div className="seccion__titulo">
        <h1>Postula a la cuadrilla</h1>
      </div>
      <p className="intro">
        Completa tus datos y el personal de la cofradía se pondrá en contacto contigo.
      </p>
      <FormularioPostulacion />
    </section>
  )
}
