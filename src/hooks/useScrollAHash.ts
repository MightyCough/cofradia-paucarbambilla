import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Lleva la vista a la sección indicada en la URL (#historia, #eventos...). */
export function useScrollAHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [pathname, hash])
}
