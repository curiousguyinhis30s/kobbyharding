import { motion } from 'framer-motion'
import type { ReactNode, CSSProperties } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  duration?: number
  once?: boolean
  threshold?: number
  style?: CSSProperties
  className?: string
}

const AnimatedSection = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 30,
  duration = 0.6,
  once = true,
  threshold = 0.1,
  style,
  className
}: AnimatedSectionProps) => {
  const getInitial = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: distance }
      case 'down': return { opacity: 0, y: -distance }
      case 'left': return { opacity: 0, x: distance }
      case 'right': return { opacity: 0, x: -distance }
      case 'none': return { opacity: 0 }
    }
  }

  const getAnimate = () => {
    switch (direction) {
      case 'up':
      case 'down': return { opacity: 1, y: 0 }
      case 'left':
      case 'right': return { opacity: 1, x: 0 }
      case 'none': return { opacity: 1 }
    }
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedSection
