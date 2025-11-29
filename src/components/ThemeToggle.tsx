import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const ThemeToggle = ({ size = 'md', showLabel = false }: ThemeToggleProps) => {
  const { theme, toggleTheme, isDark } = useTheme()

  const sizes = {
    sm: { button: '32px', icon: 14, padding: '6px' },
    md: { button: '40px', icon: 18, padding: '8px' },
    lg: { button: '48px', icon: 22, padding: '10px' }
  }

  const currentSize = sizes[size]

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: showLabel ? '8px' : '0',
        padding: showLabel ? `${currentSize.padding} 16px` : currentSize.padding,
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '8px',
        cursor: 'pointer',
        color: 'var(--text-primary)',
        transition: 'all 0.3s ease'
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? (
          <Sun
            style={{
              width: `${currentSize.icon}px`,
              height: `${currentSize.icon}px`,
              color: '#fbbf24'
            }}
          />
        ) : (
          <Moon
            style={{
              width: `${currentSize.icon}px`,
              height: `${currentSize.icon}px`,
              color: '#6366f1'
            }}
          />
        )}
      </motion.div>

      {showLabel && (
        <span style={{
          fontSize: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </motion.button>
  )
}

export default ThemeToggle
