import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'
import { catalogo, type Producto } from '@/content/catalogo'

const CLAVE_BOLSA = 'cofradia:bolsa'
const productos: Producto[] = catalogo.productos

export interface ItemBolsa {
  id: string
  talla?: string
  cantidad: number
}

export interface EntradaBolsa extends ItemBolsa {
  producto: Producto
  subtotal: number
}

interface ContextoBolsa {
  items: ItemBolsa[]
  entradas: EntradaBolsa[]
  piezas: number
  total: number
  agregar: (id: string, talla?: string, cantidad?: number) => void
  cambiarCantidad: (id: string, talla: string | undefined, cantidad: number) => void
  quitar: (id: string, talla?: string) => void
  vaciar: () => void
}

const BolsaContext = createContext<ContextoBolsa | null>(null)
const esCantidadValida = (cantidad: unknown): cantidad is number =>
  typeof cantidad === 'number' && Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= 20

function leerBolsa(): ItemBolsa[] {
  try {
    if (typeof window === 'undefined') return []
    const guardado = window.localStorage.getItem(CLAVE_BOLSA)
    if (!guardado) return []
    const parseado: unknown = JSON.parse(guardado)
    if (!Array.isArray(parseado)) return []

    return parseado.filter((item): item is ItemBolsa =>
      typeof item === 'object' && item !== null &&
      typeof item.id === 'string' &&
      (item.talla === undefined || (typeof item.talla === 'string' && item.talla.length > 0)) &&
      esCantidadValida(item.cantidad),
    )
  } catch {
    return []
  }
}

function normalizarCantidad(cantidad: number) {
  return Math.min(20, Math.max(1, Math.trunc(Number.isFinite(cantidad) ? cantidad : 1)))
}

export function formatearPrecio(precio: number) {
  const decimales = Number.isInteger(precio) ? 0 : 2
  return catalogo.moneda + ' ' + precio.toFixed(decimales)
}

export function BolsaProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemBolsa[]>(leerBolsa)

  useEffect(() => {
    try {
      window.localStorage.setItem(CLAVE_BOLSA, JSON.stringify(items))
    } catch {
      // La bolsa sigue disponible durante esta visita aunque el navegador bloquee el almacenamiento.
    }
  }, [items])

  const agregar = (id: string, talla?: string, cantidad = 1) => {
    const producto = productos.find((item) => item.id === id)
    if (!producto) return
    if (producto.tallas?.length && !producto.tallas.includes(talla ?? '')) return
    const tallaFinal = producto.tallas?.length ? talla : undefined
    const aumento = normalizarCantidad(cantidad)

    setItems((actuales) => {
      const existente = actuales.find((item) => item.id === id && item.talla === tallaFinal)
      if (existente) {
        return actuales.map((item) => item === existente
          ? { ...item, cantidad: normalizarCantidad(item.cantidad + aumento) }
          : item)
      }
      return [...actuales, { id, talla: tallaFinal, cantidad: aumento }]
    })
  }

  const cambiarCantidad = (id: string, talla: string | undefined, cantidad: number) => {
    setItems((actuales) => actuales.map((item) =>
      item.id === id && item.talla === talla
        ? { ...item, cantidad: normalizarCantidad(cantidad) }
        : item,
    ))
  }

  const quitar = (id: string, talla?: string) => {
    setItems((actuales) => actuales.filter((item) => item.id !== id || item.talla !== talla))
  }

  const entradas = items.flatMap((item) => {
    const producto = productos.find((actual) => actual.id === item.id)
    if (!producto) return []
    if (producto.tallas?.length && (!item.talla || !producto.tallas.includes(item.talla))) return []
    if (!producto.tallas?.length && item.talla) return []
    return [{ ...item, producto, subtotal: producto.precio * item.cantidad }]
  })
  const piezas = entradas.reduce((suma, item) => suma + item.cantidad, 0)
  const total = entradas.reduce((suma, item) => suma + item.subtotal, 0)

  return createElement(BolsaContext.Provider, {
    value: { items, entradas, piezas, total, agregar, cambiarCantidad, quitar, vaciar: () => setItems([]) },
    children,
  })
}

export function useBolsa() {
  const bolsa = useContext(BolsaContext)
  if (!bolsa) throw new Error('useBolsa debe usarse dentro de BolsaProvider')
  return bolsa
}
