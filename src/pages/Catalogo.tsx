import { useEffect } from 'react'
import { Vitrina } from '@/components/catalogo/Vitrina'

export default function Catalogo() {
  useEffect(() => {
    document.title = 'Catálogo · Niño Jesús de Paucarbambilla'
  }, [])

  return <Vitrina />
}
