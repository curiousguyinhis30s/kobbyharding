import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

interface StandardButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  disabled?: boolean
  style?: CSSProperties
  type?: 'button' | 'submit' | 'reset'
}

export const StandardButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  style,
  type = 'button'
}: StandardButtonProps) => {
  const sizeStyles = {
    small: {
      padding: '8px 20px',
      fontSize: '10px',
      letterSpacing: '0.15em'
    },
    medium: {
      padding: '12px 32px',
      fontSize: '11px',
      letterSpacing: '0.2em'
    },
    large: {
      padding: '16px 40px',
      fontSize: '12px',
      letterSpacing: '0.25em'
    }
  }

  const variantStyles = {
    primary: {
      background: '#fff',
      color: '#000',
      border: '1px solid #fff',
      hoverBackground: 'rgba(255, 255, 255, 0.9)',
      hoverColor: '#000'
    },
    secondary: {
      background: 'transparent',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      hoverBackground: 'rgba(255, 255, 255, 0.1)',
      hoverColor: '#fff'
    },
    ghost: {
      background: 'transparent',
      color: 'rgba(255, 255, 255, 0.6)',
      border: '1px solid transparent',
      hoverBackground: 'rgba(255, 255, 255, 0.05)',
      hoverColor: '#fff'
    }
  }

  const currentSize = sizeStyles[size]
  const currentVariant = variantStyles[variant]

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{
        ...currentSize,
        background: currentVariant.background,
        color: currentVariant.color,
        border: currentVariant.border,
        width: fullWidth ? '100%' : 'auto',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s ease',
        fontWeight: '300',
        textTransform: 'uppercase',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = currentVariant.hoverBackground
          e.currentTarget.style.color = currentVariant.hoverColor
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = currentVariant.background
          e.currentTarget.style.color = currentVariant.color
        }
      }}
    >
      {children}
    </motion.button>
  )
}

export default StandardButton
