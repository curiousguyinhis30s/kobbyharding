import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GiftCard {
  code: string
  balance: number
  originalAmount: number
  isActive: boolean
  createdAt: string
  expiresAt: string
  redeemedBy?: string
  recipientEmail?: string
  message?: string
}

interface GiftCardStore {
  giftCards: GiftCard[]
  appliedGiftCard: GiftCard | null

  // Actions
  purchaseGiftCard: (amount: number, recipientEmail: string, message?: string) => GiftCard
  redeemGiftCard: (code: string) => { success: boolean; balance: number; message: string }
  applyGiftCard: (code: string) => { success: boolean; message: string }
  removeAppliedGiftCard: () => void
  getGiftCardBalance: (code: string) => number | null
  validateGiftCard: (code: string) => { valid: boolean; message: string; giftCard?: GiftCard }
  useGiftCardBalance: (code: string, amount: number) => boolean
}

// Generate unique gift card code in format: KHC-XXXX-XXXX-XXXX
const generateGiftCardCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const segments = 3
  const segmentLength = 4

  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  }).join('-')

  return `KHC-${code}`
}

export const useGiftCardStore = create<GiftCardStore>()(
  persist(
    (set, get) => ({
      giftCards: [],
      appliedGiftCard: null,

      purchaseGiftCard: (amount, recipientEmail, message) => {
        const code = generateGiftCardCode()
        const now = new Date()
        const expiresAt = new Date()
        expiresAt.setFullYear(expiresAt.getFullYear() + 1) // 1 year expiry

        const newGiftCard: GiftCard = {
          code,
          balance: amount,
          originalAmount: amount,
          isActive: true,
          createdAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          recipientEmail,
          message
        }

        set((state) => ({
          giftCards: [...state.giftCards, newGiftCard]
        }))

        return newGiftCard
      },

      redeemGiftCard: (code) => {
        const { giftCards } = get()
        const giftCard = giftCards.find(gc => gc.code === code)

        if (!giftCard) {
          return { success: false, balance: 0, message: 'Gift card not found' }
        }

        if (!giftCard.isActive) {
          return { success: false, balance: 0, message: 'Gift card is no longer active' }
        }

        if (new Date(giftCard.expiresAt) < new Date()) {
          return { success: false, balance: 0, message: 'Gift card has expired' }
        }

        if (giftCard.balance <= 0) {
          return { success: false, balance: 0, message: 'Gift card has no remaining balance' }
        }

        return {
          success: true,
          balance: giftCard.balance,
          message: `Gift card redeemed! Balance: $${giftCard.balance.toFixed(2)}`
        }
      },

      applyGiftCard: (code) => {
        const validation = get().validateGiftCard(code)

        if (!validation.valid || !validation.giftCard) {
          return { success: false, message: validation.message }
        }

        set({ appliedGiftCard: validation.giftCard })
        return { success: true, message: `Gift card applied! Balance: $${validation.giftCard.balance.toFixed(2)}` }
      },

      removeAppliedGiftCard: () => {
        set({ appliedGiftCard: null })
      },

      getGiftCardBalance: (code) => {
        const { giftCards } = get()
        const giftCard = giftCards.find(gc => gc.code === code)
        return giftCard ? giftCard.balance : null
      },

      validateGiftCard: (code) => {
        const { giftCards } = get()
        const giftCard = giftCards.find(gc => gc.code === code)

        if (!giftCard) {
          return { valid: false, message: 'Gift card code not found' }
        }

        if (!giftCard.isActive) {
          return { valid: false, message: 'This gift card is no longer active' }
        }

        if (new Date(giftCard.expiresAt) < new Date()) {
          return { valid: false, message: 'This gift card has expired' }
        }

        if (giftCard.balance <= 0) {
          return { valid: false, message: 'This gift card has been fully used' }
        }

        return { valid: true, message: 'Gift card is valid', giftCard }
      },

      useGiftCardBalance: (code, amount) => {
        const { giftCards } = get()
        const giftCard = giftCards.find(gc => gc.code === code)

        if (!giftCard || giftCard.balance < amount) {
          return false
        }

        set((state) => ({
          giftCards: state.giftCards.map(gc =>
            gc.code === code
              ? { ...gc, balance: gc.balance - amount }
              : gc
          ),
          appliedGiftCard: state.appliedGiftCard?.code === code
            ? { ...state.appliedGiftCard, balance: state.appliedGiftCard.balance - amount }
            : state.appliedGiftCard
        }))

        return true
      }
    }),
    {
      name: 'gift-card-storage',
      partialize: (state) => ({
        giftCards: state.giftCards,
        appliedGiftCard: state.appliedGiftCard
      })
    }
  )
)
