import { motion } from 'framer-motion'
import type { ReactNode, CSSProperties, MouseEvent } from 'react'

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  style?: CSSProperties
  className?: string
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  className,
  type = 'button',
  ariaLabel
}: AnimatedButtonProps) => {
  const sizeStyles = {
    sm: {
      padding: '8px 16px',
      fontSize: '10px',
      letterSpacing: '0.15em'
    },
    md: {
      padding: '12px 28px',
      fontSize: '11px',
      letterSpacing: '0.2em'
    },
    lg: {
      padding: '16px 40px',
      fontSize: '12px',
      letterSpacing: '0.2em'
    }
  }

  const variantStyles = {
    primary: {
      background: '#fff',
      color: '#000',
      border: 'none'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    ghost: {
      background: 'transparent',
      color: '#fff',
      border: 'none'
    },
    outline: {
      background: 'transparent',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.4)'
    }
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      aria-label={ariaLabel}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      style={{
        ...sizeStyles[size],
        ...variantStyles[variant],
        width: fullWidth ? '100%' : 'auto',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: '400',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid transparent',
            borderTopColor: 'currentColor',
            borderRadius: '50%',
            display: 'inline-block'
          }}
        />
      ) : (
        children
      )}
    </motion.button>
  )
}

export default AnimatedButton
