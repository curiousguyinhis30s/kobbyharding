// Animation components barrel export
export { default as PageTransition, PageTransitionWrapper } from './PageTransition'
export { default as AnimatedLoader, PageLoader } from './AnimatedLoader'
export { default as AnimatedSection } from './AnimatedSection'
export { default as StaggerContainer, StaggerItem, staggerItemVariants } from './StaggerContainer'
export { default as AnimatedButton } from './AnimatedButton'
export { default as ParallaxSection, ParallaxBackground } from './ParallaxSection'

// Animation presets for consistent use across the app
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: 'easeOut' as const }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 }
}

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 }
}

export const hoverLift = {
  whileHover: { y: -4 },
  transition: { duration: 0.2 }
}

// Spring configs
export const springConfig = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  bouncy: { type: 'spring', stiffness: 500, damping: 15 }
}
