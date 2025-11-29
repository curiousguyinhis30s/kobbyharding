import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType = 'order_confirmation' | 'shipping_update' | 'contact_reply'

export interface EmailNotification {
  id: string
  type: NotificationType
  recipient: string
  subject: string
  body: string
  timestamp: string
  status: 'pending' | 'sent' | 'failed'
}

interface NotificationStore {
  notifications: EmailNotification[]
  addNotification: (notification: Omit<EmailNotification, 'id' | 'timestamp' | 'status'>) => string
  updateStatus: (id: string, status: EmailNotification['status']) => void
  getNotification: (id: string) => EmailNotification | undefined
  getAllNotifications: () => EmailNotification[]
  getNotificationsByType: (type: NotificationType) => EmailNotification[]
  getNotificationsByRecipient: (recipient: string) => EmailNotification[]
  clearNotifications: () => void
}

const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        const id = `EMAIL-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        const newNotification: EmailNotification = {
          ...notification,
          id,
          timestamp: new Date().toISOString(),
          status: 'pending'
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }))

        // Simulate sending email after a short delay
        setTimeout(() => {
          get().updateStatus(id, 'sent')
        }, 1000)

        return id
      },

      updateStatus: (id, status) => {
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, status } : notif
          )
        }))
      },

      getNotification: (id) => {
        return get().notifications.find(notif => notif.id === id)
      },

      getAllNotifications: () => {
        return get().notifications
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter(notif => notif.type === type)
      },

      getNotificationsByRecipient: (recipient) => {
        return get().notifications.filter(notif =>
          notif.recipient.toLowerCase() === recipient.toLowerCase()
        )
      },

      clearNotifications: () => {
        set({ notifications: [] })
      }
    }),
    {
      name: 'email-notifications-storage'
    }
  )
)

export default useNotificationStore
