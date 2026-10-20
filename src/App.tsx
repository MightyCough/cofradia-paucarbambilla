import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import Actividades from '@/pages/Actividades'
import Cuadrilla from '@/pages/Cuadrilla'
import Catalogo from '@/pages/Catalogo'
import EnPreparacion from '@/pages/EnPreparacion'
import Historia from '@/pages/Historia'
import Inicio from '@/pages/Inicio'
import Invitacion from '@/pages/Invitacion'
import Mayordomia from '@/pages/Mayordomia'
import NoEncontrada from '@/pages/NoEncontrada'
import Sorteos from '@/pages/Sorteos'

// Firebase solo se descarga al entrar a /postular.
const Postular = lazy(() => import('@/pages/Postular'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Inicio />} />
            <Route path="historia" element={<Historia />} />
            <Route path="cuadrilla" element={<Cuadrilla />} />
            <Route path="mayordomia" element={<Mayordomia />} />
            <Route path="actividades" element={<Actividades />} />
            <Route path="postular" element={<Postular />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="sorteos" element={<Sorteos />} />
            <Route path="invitacion" element={<Invitacion />} />
            <Route path="en-vivo" element={<EnPreparacion nombre="En vivo" />} />
            <Route path="*" element={<NoEncontrada />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
