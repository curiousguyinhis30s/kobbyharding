import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PromoCode {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase: number
  expiryDate: Date | null
  usageLimit: number
  timesUsed: number
  active: boolean
  description: string
}

interface PromoStore {
  promoCodes: PromoCode[]
  appliedPromo: PromoCode | null
  validateCode: (code: string, cartTotal: number) => { valid: boolean; message: string; promo?: PromoCode }
  applyCode: (code: string) => void
  removePromo: () => void
  getActivePromos: () => PromoCode[]
  calculateDiscount: (cartTotal: number) => number
  usePromoCode: (code: string) => void
}

const usePromoStore = create<PromoStore>()(
  persist(
    (set, get) => ({
      promoCodes: [
        {
          code: 'WELCOME10',
          type: 'percentage',
          value: 10,
          minPurchase: 0,
          expiryDate: null, // No expiry
          usageLimit: 1000,
          timesUsed: 0,
          active: true,
          description: '10% off your first order'
        },
        {
          code: 'SAVE20',
          type: 'fixed',
          value: 20,
          minPurchase: 100,
          expiryDate: new Date('2025-12-31'),
          usageLimit: 500,
          timesUsed: 0,
          active: true,
          description: '$20 off orders over $100'
        },
        {
          code: 'FESTIVAL15',
          type: 'percentage',
          value: 15,
          minPurchase: 150,
          expiryDate: new Date('2025-12-31'),
          usageLimit: 300,
          timesUsed: 0,
          active: true,
          description: '15% off for festival season'
        },
        {
          code: 'KHCLASSICS25',
          type: 'fixed',
          value: 25,
          minPurchase: 200,
          expiryDate: new Date('2025-12-31'),
          usageLimit: 200,
          timesUsed: 0,
          active: true,
          description: '$25 off orders over $200'
        }
      ],
      appliedPromo: null,

      validateCode: (code, cartTotal) => {
        const upperCode = code.toUpperCase().trim()
        const promo = get().promoCodes.find(p => p.code === upperCode)

        if (!promo) {
          return { valid: false, message: 'Invalid promo code' }
        }

        if (!promo.active) {
          return { valid: false, message: 'This promo code is no longer active' }
        }

        if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
          return { valid: false, message: 'This promo code has expired' }
        }

        if (promo.timesUsed >= promo.usageLimit) {
          return { valid: false, message: 'This promo code has reached its usage limit' }
        }

        if (cartTotal < promo.minPurchase) {
          return {
            valid: false,
            message: `Minimum purchase of $${promo.minPurchase} required for this code`
          }
        }

        const discountAmount = promo.type === 'percentage'
          ? (cartTotal * promo.value) / 100
          : promo.value

        return {
          valid: true,
          message: `Promo code applied! You saved $${discountAmount.toFixed(2)}`,
          promo
        }
      },

      applyCode: (code) => {
        const upperCode = code.toUpperCase().trim()
        const promo = get().promoCodes.find(p => p.code === upperCode)
        if (promo) {
          set({ appliedPromo: promo })
        }
      },

      removePromo: () => {
        set({ appliedPromo: null })
      },

      getActivePromos: () => {
        return get().promoCodes.filter(promo => {
          if (!promo.active) return false
          if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) return false
          if (promo.timesUsed >= promo.usageLimit) return false
          return true
        })
      },

      calculateDiscount: (cartTotal) => {
        const { appliedPromo } = get()
        if (!appliedPromo) return 0

        if (appliedPromo.type === 'percentage') {
          return (cartTotal * appliedPromo.value) / 100
        } else {
          return Math.min(appliedPromo.value, cartTotal) // Don't discount more than cart total
        }
      },

      usePromoCode: (code) => {
        set((state) => ({
          promoCodes: state.promoCodes.map(promo =>
            promo.code === code
              ? { ...promo, timesUsed: promo.timesUsed + 1 }
              : promo
          )
        }))
      }
    }),
    {
      name: 'khardingclassics-promos',
      partialize: (state) => ({
        promoCodes: state.promoCodes,
        appliedPromo: state.appliedPromo
      })
    }
  )
)

export default usePromoStore
