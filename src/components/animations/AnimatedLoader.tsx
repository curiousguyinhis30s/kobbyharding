import { motion } from 'framer-motion'

interface AnimatedLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  variant?: 'dots' | 'pulse' | 'spinner'
}

const AnimatedLoader = ({ size = 'md', text, variant = 'dots' }: AnimatedLoaderProps) => {
  const sizes = {
    sm: { dot: 4, gap: 4, text: '10px' },
    md: { dot: 6, gap: 6, text: '11px' },
    lg: { dot: 8, gap: 8, text: '12px' }
  }

  const s = sizes[size]

  if (variant === 'spinner') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: s.dot * 4,
            height: s.dot * 4,
            border: `2px solid rgba(255, 255, 255, 0.1)`,
            borderTopColor: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%'
          }}
        />
        {text && (
          <span style={{
            fontSize: s.text,
            letterSpacing: '0.2em',
            color: 'rgba(255, 255, 255, 0.4)'
          }}>
            {text}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            width: s.dot * 3,
            height: s.dot * 3,
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%'
          }}
        />
        {text && (
          <span style={{
            fontSize: s.text,
            letterSpacing: '0.2em',
            color: 'rgba(255, 255, 255, 0.4)'
          }}>
            {text}
          </span>
        )}
      </div>
    )
  }

  // Default: dots
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', gap: s.gap }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut'
            }}
            style={{
              width: s.dot,
              height: s.dot,
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%'
            }}
          />
        ))}
      </div>
      {text && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: s.text,
            letterSpacing: '0.2em',
            color: 'rgba(255, 255, 255, 0.4)'
          }}
        >
          {text}
        </motion.span>
      )}
    </div>
  )
}

// Full page loader
export const PageLoader = ({ text = 'LOADING' }: { text?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000'
      }}
    >
      <AnimatedLoader size="md" text={text} variant="dots" />
    </motion.div>
  )
}

export default AnimatedLoader
