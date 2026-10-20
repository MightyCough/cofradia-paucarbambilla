import { useEffect } from 'react'
import { RetratosMayordomos } from '@/components/mayordomia/RetratosMayordomos'
import { SeccionPostular } from '@/components/secciones/SeccionPostular'

export default function Mayordomia() {
  useEffect(() => {
    document.title = 'Mayordomía · Niño Jesús de Paucarbambilla'
  }, [])

  return (
    <>
      <RetratosMayordomos />
      <SeccionPostular />
    </>
  )
}
