import { useEffect } from 'react'
import { PaginaSorteo } from '@/components/sorteo/PaginaSorteo'

export default function Sorteos() {
  useEffect(() => {
    document.title = 'Sorteos · Niño Jesús de Paucarbambilla'
  }, [])

  return <PaginaSorteo />
}
