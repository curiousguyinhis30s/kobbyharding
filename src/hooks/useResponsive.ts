import { useState, useEffect, useCallback, useMemo } from 'react'

// Breakpoint constants
export const BREAKPOINTS = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

export interface ResponsiveState {
  screenWidth: number
  screenHeight: number
  isSmallMobile: boolean  // < 360px
  isMobile: boolean       // < 768px
  isTablet: boolean       // 768px - 1024px
  isDesktop: boolean      // >= 1024px
  isLargeDesktop: boolean // >= 1280px
  breakpoint: Breakpoint
  isTouchDevice: boolean
}

const getBreakpoint = (width: number): Breakpoint => {
  if (width < BREAKPOINTS.xs) return 'xs'
  if (width < BREAKPOINTS.sm) return 'sm'
  if (width < BREAKPOINTS.md) return 'md'
  if (width < BREAKPOINTS.lg) return 'lg'
  if (width < BREAKPOINTS.xl) return 'xl'
  return 'xxl'
}

const getResponsiveState = (): ResponsiveState => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024
  const height = typeof window !== 'undefined' ? window.innerHeight : 768
  const isTouchDevice = typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  return {
    screenWidth: width,
    screenHeight: height,
    isSmallMobile: width < BREAKPOINTS.xs,
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    isLargeDesktop: width >= BREAKPOINTS.xl,
    breakpoint: getBreakpoint(width),
    isTouchDevice
  }
}

/**
 * Custom hook for responsive design
 * Replaces 44+ duplicate resize handlers across the codebase
 *
 * Usage:
 * const { isMobile, isTablet, isDesktop, screenWidth } = useResponsive()
 */
export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(getResponsiveState)

  const handleResize = useCallback(() => {
    setState(getResponsiveState())
  }, [])

  useEffect(() => {
    // Use ResizeObserver for better performance if available
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(handleResize)
      observer.observe(document.documentElement)
      return () => observer.disconnect()
    }

    // Fallback to window resize with debounce
    let timeoutId: ReturnType<typeof setTimeout>
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [handleResize])

  return state
}

/**
 * Hook for media query matching
 * Usage: const isWide = useMediaQuery('(min-width: 1024px)')
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Hook for reduced motion preference
 */
export const useReducedMotion = (): boolean => {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export default useResponsive
