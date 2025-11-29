import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { useToast, type Toast } from './useToast'
import { ANIMATION_DURATION, Z_INDEX, TOAST_POSITION, SPACING, FONT_SIZE, LETTER_SPACING } from '../constants'

// Re-export for backward compatibility
export { useToast }

// Toast color schemes
const TOAST_COLORS = {
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
} as const

const TOAST_ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: AlertCircle
} as const

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: () => void }) => {
  const Icon = TOAST_ICONS[toast.type]
  const color = TOAST_COLORS[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: ANIMATION_DURATION.DEFAULT }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.MD,
        padding: '14px 16px',
        background: color.bg,
        border: `1px solid ${color.border}`,
        backdropFilter: 'blur(20px)',
        marginBottom: SPACING.MD,
        minWidth: TOAST_POSITION.MIN_WIDTH,
        maxWidth: TOAST_POSITION.MAX_WIDTH,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    >
      <Icon style={{ width: '20px', height: '20px', color: color.icon, flexShrink: 0 }} />

      <p style={{
        flex: 1,
        fontSize: FONT_SIZE.BASE,
        letterSpacing: LETTER_SPACING.TIGHT,
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
          transition: `color ${ANIMATION_DURATION.FAST}s`,
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
      top: TOAST_POSITION.TOP,
      right: TOAST_POSITION.RIGHT,
      zIndex: Z_INDEX.TOAST,
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