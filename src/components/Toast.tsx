import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, message, duration = 3000) => {
    const id = Math.random().toString(36).substring(7)
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }]
    }))

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }))
      }, duration)
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  }
}))

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: () => void }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: AlertCircle
  }

  const colors = {
    success: {
      bg: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.3)',
      text: '#22c55e',
      icon: '#22c55e'
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#ef4444',
      icon: '#ef4444'
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#3b82f6',
      icon: '#3b82f6'
    }
  }

  const Icon = icons[toast.type]
  const color = colors[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: color.bg,
        border: `1px solid ${color.border}`,
        backdropFilter: 'blur(20px)',
        marginBottom: '12px',
        minWidth: '320px',
        maxWidth: '420px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    >
      <Icon style={{ width: '20px', height: '20px', color: color.icon, flexShrink: 0 }} />

      <p style={{
        flex: 1,
        fontSize: '13px',
        letterSpacing: '0.02em',
        color: '#fff',
        margin: 0
      }}>
        {toast.message}
      </p>

      <button
        onClick={onRemove}
        style={{
          padding: '4px',
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.5)',
          cursor: 'pointer',
          transition: 'color 0.2s',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
      >
        <X style={{ width: '16px', height: '16px' }} />
      </button>
    </motion.div>
  )
}

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem
              toast={toast}
              onRemove={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer