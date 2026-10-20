import { useEffect } from 'react'
import { TallerInvitacion } from '@/components/invitacion/TallerInvitacion'

export default function Invitacion() {
  useEffect(() => {
    const tituloAnterior = document.title
    document.title = 'Crear invitación · Niño Jesús de Paucarbambilla'
    return () => { document.title = tituloAnterior }
  }, [])

  return <TallerInvitacion />
}
