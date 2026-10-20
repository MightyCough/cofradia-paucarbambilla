import { useEffect } from 'react'
import { RelatoHistoria } from '@/components/historia/RelatoHistoria'
import { SeccionPostular } from '@/components/secciones/SeccionPostular'

export default function Historia() {
  useEffect(() => {
    document.title = 'Historia · Niño Jesús de Paucarbambilla'
  }, [])

  return (
    <>
      <RelatoHistoria />
      <SeccionPostular />
    </>
  )
}
