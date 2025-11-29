import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WaitlistEntry {
  productId: string
  email: string
  timestamp: string
  notified: boolean
}

interface WaitlistStore {
  waitlist: WaitlistEntry[]

  // Actions
  addToWaitlist: (productId: string, email: string) => boolean
  removeFromWaitlist: (productId: string, email: string) => void
  getWaitlistForProduct: (productId: string) => WaitlistEntry[]
  isEmailOnWaitlist: (productId: string, email: string) => boolean
  getAllWaitlist: () => WaitlistEntry[]
  markAsNotified: (productId: string, email: string) => void
  clearNotifiedEntries: () => void
}

export const useWaitlistStore = create<WaitlistStore>()(
  persist(
    (set, get) => ({
      waitlist: [],

      addToWaitlist: (productId, email) => {
        const { waitlist } = get()

        // Check if email already exists for this product
        const exists = waitlist.some(
          entry => entry.productId === productId && entry.email.toLowerCase() === email.toLowerCase()
        )

        if (exists) {
          return false
        }

        const newEntry: WaitlistEntry = {
          productId,
          email: email.toLowerCase().trim(),
          timestamp: new Date().toISOString(),
          notified: false
        }

        set({ waitlist: [...waitlist, newEntry] })
        return true
      },

      removeFromWaitlist: (productId, email) => {
        const { waitlist } = get()
        set({
          waitlist: waitlist.filter(
            entry => !(entry.productId === productId && entry.email.toLowerCase() === email.toLowerCase())
          )
        })
      },

      getWaitlistForProduct: (productId) => {
        const { waitlist } = get()
        return waitlist.filter(entry => entry.productId === productId)
      },

      isEmailOnWaitlist: (productId, email) => {
        const { waitlist } = get()
        return waitlist.some(
          entry => entry.productId === productId && entry.email.toLowerCase() === email.toLowerCase()
        )
      },

      getAllWaitlist: () => {
        return get().waitlist
      },

      markAsNotified: (productId, email) => {
        const { waitlist } = get()
        set({
          waitlist: waitlist.map(entry =>
            entry.productId === productId && entry.email.toLowerCase() === email.toLowerCase()
              ? { ...entry, notified: true }
              : entry
          )
        })
      },

      clearNotifiedEntries: () => {
        const { waitlist } = get()
        set({
          waitlist: waitlist.filter(entry => !entry.notified)
        })
      }
    }),
    {
      name: 'kobys-threads-waitlist',
      partialize: (state) => ({
        waitlist: state.waitlist
      })
    }
  )
)
