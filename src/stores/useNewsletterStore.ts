import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NewsletterSubscription {
  email: string
  timestamp: string
}

interface NewsletterStore {
  subscriptions: NewsletterSubscription[]
  subscribe: (email: string) => { success: boolean; message: string }
  isSubscribed: (email: string) => boolean
  getAllSubscriptions: () => NewsletterSubscription[]
  exportToCSV: () => string
}

export const useNewsletterStore = create<NewsletterStore>()(
  persist(
    (set, get) => ({
      subscriptions: [],

      subscribe: (email: string) => {
        const normalizedEmail = email.toLowerCase().trim()

        if (!normalizedEmail || !normalizedEmail.includes('@')) {
          return { success: false, message: 'Please enter a valid email address' }
        }

        if (get().isSubscribed(normalizedEmail)) {
          return { success: false, message: 'This email is already subscribed' }
        }

        const subscription: NewsletterSubscription = {
          email: normalizedEmail,
          timestamp: new Date().toISOString(),
        }

        set((state) => ({
          subscriptions: [...state.subscriptions, subscription],
        }))

        return { success: true, message: 'Successfully subscribed to newsletter!' }
      },

      isSubscribed: (email: string) => {
        const normalizedEmail = email.toLowerCase().trim()
        return get().subscriptions.some((sub) => sub.email === normalizedEmail)
      },

      getAllSubscriptions: () => {
        return get().subscriptions
      },

      exportToCSV: () => {
        const subs = get().subscriptions
        if (subs.length === 0) return ''

        const header = 'Email,Subscribed Date\n'
        const rows = subs
          .map((sub) => {
            const date = new Date(sub.timestamp).toLocaleDateString()
            return `${sub.email},${date}`
          })
          .join('\n')

        return header + rows
      },
    }),
    {
      name: 'khardingclassics-newsletter',
    }
  )
)
