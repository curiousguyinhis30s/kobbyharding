import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  mode?: 'fade' | 'slide' | 'scale' | 'slideUp'
}

const pageVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 }
  }
}

const pageTransition = {
  duration: 0.3,
  ease: 'easeInOut' as const
}

const PageTransition = ({ children, mode = 'fade' }: PageTransitionProps) => {
  const variants = pageVariants[mode]

  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={pageTransition}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}

// Wrapper for pages with AnimatePresence
export const PageTransitionWrapper = ({ children, locationKey }: { children: ReactNode; locationKey: string }) => {
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={locationKey}>
        {children}
      </PageTransition>
    </AnimatePresence>
  )
}

export default PageTransition
