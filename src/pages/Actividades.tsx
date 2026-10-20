import { useEffect } from 'react'
import { ProgramaFiesta } from '@/components/actividades/ProgramaFiesta'
import { SeccionPostular } from '@/components/secciones/SeccionPostular'

export default function Actividades() {
  useEffect(() => {
    document.title = 'Actividades · Niño Jesús de Paucarbambilla'
  }, [])

  return (
    <>
      <ProgramaFiesta />
      <SeccionPostular />
    </>
  )
}
