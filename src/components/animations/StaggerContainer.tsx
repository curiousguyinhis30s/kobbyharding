import { motion } from 'framer-motion'
import type { ReactNode, CSSProperties } from 'react'

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  initialDelay?: number
  style?: CSSProperties
  className?: string
  once?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (custom: { staggerDelay: number; initialDelay: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.initialDelay
    }
  })
}

export const StaggerContainer = ({
  children,
  staggerDelay = 0.08,
  initialDelay = 0,
  style,
  className,
  once = true
}: StaggerContainerProps) => {
  return (
    <motion.div
      className={className}
      style={style}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      custom={{ staggerDelay, initialDelay }}
    >
      {children}
    </motion.div>
  )
}

// Item variants for use inside StaggerContainer
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const
    }
  }
}

export const StaggerItem = ({
  children,
  style,
  className
}: {
  children: ReactNode
  style?: CSSProperties
  className?: string
}) => {
  return (
    <motion.div
      className={className}
      style={style}
      variants={staggerItemVariants}
    >
      {children}
    </motion.div>
  )
}

export default StaggerContainer
