import { useLayoutEffect, useRef } from 'react'
import { animate } from 'animejs'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { useScrollAHash } from '@/hooks/useScrollAHash'

export function Layout() {
  const { pathname } = useLocation()
  const paginaRef = useRef<HTMLDivElement | null>(null)

  useScrollAHash()

  useLayoutEffect(() => {
    if (!paginaRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const animacion = animate(paginaRef.current, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 550,
      ease: 'outExpo',
      // Un `transform` residual convierte a `.pagina` en el contenedor de todo lo `position: fixed`
      // de las páginas (p. ej. el botón de la bolsa) y lo despega de la pantalla.
      onComplete: (a) => a.revert(),
    })

    return () => {
      animacion.revert()
    }
  }, [pathname])

  return (
    <>
      <Header />
      <main>
        <div className="pagina" ref={paginaRef}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}
