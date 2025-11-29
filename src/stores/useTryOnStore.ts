import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Festival {
  id: string
  name: string
  date: string
  location: string
  city: string
  country: string
  available: boolean
  piecesAvailable: number
  description?: string
}

export interface TryOnReservation {
  id: string
  userId: string
  userEmail: string
  userName?: string
  pieces: string[] // max 3 piece IDs
  primaryFestival: string
  alternateFestival?: string
  status: 'pending' | 'confirmed' | 'ready' | 'checked_in' | 'picked_up' | 'cancelled'
  qrCode: string // unique reservation code
  createdAt: string
  confirmedAt?: string
  checkedInAt?: string
  pickedUpAt?: string
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentAmount?: number
  selectedForPurchase?: string[] // pieces user wants to buy after try-on
  notes?: string
}

interface TryOnStore {
  reservations: TryOnReservation[]
  festivals: Festival[]

  // Reservation management
  createReservation: (data: {
    userId: string
    userEmail: string
    userName?: string
    pieces: string[]
    primaryFestival: string
    alternateFestival?: string
  }) => TryOnReservation

  updateReservation: (id: string, updates: Partial<TryOnReservation>) => void
  cancelReservation: (id: string) => void
  getReservation: (id: string) => TryOnReservation | undefined
  getUserReservations: (userId: string) => TryOnReservation[]
  getReservationByQR: (qrCode: string) => TryOnReservation | undefined

  // Festival management
  getFestivals: () => Festival[]
  getAvailableFestivals: () => Festival[]

  // Staff actions
  checkInReservation: (id: string) => void
  processPayment: (id: string, amount: number, selectedPieces: string[]) => void
  markPickedUp: (id: string) => void
  addNote: (id: string, note: string) => void
}

// Generate unique QR code
const generateQRCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'KH-'
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Mock festivals data
const mockFestivals: Festival[] = [
  {
    id: 'bangkok-kiz-2024',
    name: 'Bangkok Kizomba Festival',
    date: 'December 15-18, 2024',
    location: 'Centara Grand Hotel',
    city: 'Bangkok',
    country: 'Thailand',
    available: true,
    piecesAvailable: 15,
    description: 'The biggest Kizomba event in Southeast Asia'
  },
  {
    id: 'singapore-latin-2025',
    name: 'Singapore Latin Festival',
    date: 'January 20-23, 2025',
    location: 'Marina Bay Sands',
    city: 'Singapore',
    country: 'Singapore',
    available: true,
    piecesAvailable: 12,
    description: 'Premium Latin dance experience'
  },
  {
    id: 'bali-dance-2025',
    name: 'Bali Dance Week',
    date: 'February 10-14, 2025',
    location: 'Ubud Cultural Center',
    city: 'Bali',
    country: 'Indonesia',
    available: true,
    piecesAvailable: 18,
    description: 'Dance and culture in paradise'
  },
  {
    id: 'dubai-urban-2025',
    name: 'Dubai Urban Kiz',
    date: 'March 5-8, 2025',
    location: 'Dubai Opera',
    city: 'Dubai',
    country: 'UAE',
    available: true,
    piecesAvailable: 20,
    description: 'Luxury dance experience in the desert'
  },
  {
    id: 'lisbon-kiz-2025',
    name: 'Lisbon Kizomba Festival',
    date: 'April 15-20, 2025',
    location: 'Lisbon Congress Center',
    city: 'Lisbon',
    country: 'Portugal',
    available: false,
    piecesAvailable: 0,
    description: 'Coming soon - The birthplace of Kizomba'
  }
]

const useTryOnStore = create<TryOnStore>()(
  persist(
    (set, get) => ({
      reservations: [],
      festivals: mockFestivals,

      createReservation: (data) => {
        const reservation: TryOnReservation = {
          id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: data.userId,
          userEmail: data.userEmail,
          userName: data.userName,
          pieces: data.pieces.slice(0, 3), // Max 3 pieces
          primaryFestival: data.primaryFestival,
          alternateFestival: data.alternateFestival,
          status: 'pending',
          qrCode: generateQRCode(),
          createdAt: new Date().toISOString(),
          paymentStatus: 'pending'
        }

        set((state) => ({
          reservations: [...state.reservations, reservation]
        }))

        return reservation
      },

      updateReservation: (id, updates) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          )
        }))
      },

      cancelReservation: (id) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, status: 'cancelled' } : r
          )
        }))
      },

      getReservation: (id) => {
        return get().reservations.find((r) => r.id === id)
      },

      getUserReservations: (userId) => {
        return get().reservations.filter((r) => r.userId === userId)
      },

      getReservationByQR: (qrCode) => {
        return get().reservations.find((r) => r.qrCode === qrCode)
      },

      getFestivals: () => get().festivals,

      getAvailableFestivals: () => {
        return get().festivals.filter((f) => f.available)
      },

      checkInReservation: (id) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'checked_in',
                  checkedInAt: new Date().toISOString()
                }
              : r
          )
        }))
      },

      processPayment: (id, amount, selectedPieces) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id
              ? {
                  ...r,
                  paymentStatus: 'paid',
                  paymentAmount: amount,
                  selectedForPurchase: selectedPieces,
                  status: 'ready'
                }
              : r
          )
        }))
      },

      markPickedUp: (id) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'picked_up',
                  pickedUpAt: new Date().toISOString()
                }
              : r
          )
        }))
      },

      addNote: (id, note) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id
              ? {
                  ...r,
                  notes: r.notes ? `${r.notes}\n${note}` : note
                }
              : r
          )
        }))
      }
    }),
    {
      name: 'kobys-tryon-storage'
    }
  )
)

export default useTryOnStore
