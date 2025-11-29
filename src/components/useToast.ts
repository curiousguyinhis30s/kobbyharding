import { create } from 'zustand'
import { TOAST_DURATION } from '../constants'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  timeouts: Record<string, NodeJS.Timeout>
  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  timeouts: {},
  addToast: (type, message, duration = TOAST_DURATION) => {
    const id = Math.random().toString(36).substring(7)
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }]
    }))

    // Auto-remove after duration with cleanup
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        set((state) => {
          const newTimeouts = { ...state.timeouts }
          delete newTimeouts[id]
          return {
            toasts: state.toasts.filter((t) => t.id !== id),
            timeouts: newTimeouts
          }
        })
      }, duration)

      // Store timeout reference for cleanup
      set((state) => ({
        timeouts: { ...state.timeouts, [id]: timeoutId }
      }))
    }
  },
  removeToast: (id) => {
    // Clear timeout if exists
    const { timeouts } = get()
    if (timeouts[id]) {
      clearTimeout(timeouts[id])
    }

    set((state) => {
      const newTimeouts = { ...state.timeouts }
      delete newTimeouts[id]
      return {
        toasts: state.toasts.filter((t) => t.id !== id),
        timeouts: newTimeouts
      }
    })
  }
}))
