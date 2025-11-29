import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockPieces } from '../data/mockData'
import type { Piece } from './useStore'

interface ProductStore {
  products: Piece[]
  initialized: boolean

  // CRUD Operations
  addProduct: (product: Omit<Piece, 'id' | 'views' | 'hearts' | 'inquiries'>) => void
  updateProduct: (id: string, updates: Partial<Piece>) => void
  deleteProduct: (id: string) => void
  duplicateProduct: (id: string) => void
  toggleAvailability: (id: string) => void

  // Getters
  getProductById: (id: string) => Piece | undefined
  getProducts: () => Piece[]
  initializeFromMockData: () => void
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      initialized: false,

      initializeFromMockData: () => {
        const { initialized } = get()
        if (!initialized) {
          set({ products: [...mockPieces], initialized: true })
        }
      },

      addProduct: (product) => {
        const newProduct: Piece = {
          ...product,
          id: generateId(),
          views: 0,
          hearts: 0,
          inquiries: 0
        }
        set((state) => ({
          products: [...state.products, newProduct]
        }))
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          )
        }))
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }))
      },

      duplicateProduct: (id) => {
        const product = get().getProductById(id)
        if (product) {
          const duplicated: Piece = {
            ...product,
            id: generateId(),
            name: `${product.name} (Copy)`,
            views: 0,
            hearts: 0,
            inquiries: 0
          }
          set((state) => ({
            products: [...state.products, duplicated]
          }))
        }
      },

      toggleAvailability: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, available: !p.available } : p
          )
        }))
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id)
      },

      getProducts: () => {
        return get().products
      }
    }),
    {
      name: 'product-store',
      partialize: (state) => ({
        products: state.products,
        initialized: state.initialized
      })
    }
  )
)
