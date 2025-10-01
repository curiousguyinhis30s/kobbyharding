import { motion } from 'framer-motion'

const LoadingSpinnerMinimal = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px'
    }}>
      {/* Minimal spinner */}
      <div style={{ position: 'relative', width: '40px', height: '40px' }}>
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid transparent',
            borderTopColor: '#fff',
            borderRadius: '50%'
          }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      
      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          fontSize: '11px',
          letterSpacing: '0.3em',
          color: 'rgba(255,255,255,0.5)'
        }}
      >
        LOADING
      </motion.div>
    </div>
  )
}

export default LoadingSpinnerMinimal