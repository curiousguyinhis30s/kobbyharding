import { memo } from 'react'
import { motion } from 'framer-motion'

const TypingIndicator = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        alignSelf: 'flex-start',
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'center'
      }}>
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            style={{
              width: '4px',
              height: '4px',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '50%'
            }}
          />
        ))}
      </div>
    </motion.div>
  )
})

TypingIndicator.displayName = 'TypingIndicator'

export default TypingIndicator
