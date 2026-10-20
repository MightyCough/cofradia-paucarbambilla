import { useEffect } from 'react'
import { EscenarioRoles } from '@/components/cuadrilla/EscenarioRoles'
import { Integrantes } from '@/components/cuadrilla/Integrantes'
import { SeccionPostular } from '@/components/secciones/SeccionPostular'

export default function Cuadrilla() {
  useEffect(() => {
    document.title = 'Cuadrilla · Niño Jesús de Paucarbambilla'
  }, [])

  return (
    <>
      <EscenarioRoles />
      <Integrantes />
      <SeccionPostular />
    </>
  )
}
