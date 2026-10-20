import { useEffect } from 'react'
import { Comunicado } from '@/components/secciones/Comunicado'
import { Hero } from '@/components/secciones/Hero'
import { SeccionPostular } from '@/components/secciones/SeccionPostular'

export default function Inicio() {
  useEffect(() => {
    document.title = 'Cofradía de Negritos “Niño Jesús de Paucarbambilla”'
  }, [])

  return (
    <>
      <Hero />
      <Comunicado />
      <SeccionPostular />
    </>
  )
}
