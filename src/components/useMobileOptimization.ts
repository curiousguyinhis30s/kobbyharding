import { useEffect, useState } from 'react'

interface MobileOptimizationConfig {
  enableTouchGestures: boolean
  enablePullToRefresh: boolean
  enableLazyLoading: boolean
  minTouchTargetSize: number // 44px minimum
}

// Hook for mobile detection and optimization
export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })

  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= 768 && window.innerWidth < 1024
  })

  const [isLandscape, setIsLandscape] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerHeight < window.innerWidth
  })

  const [viewportHeight, setViewportHeight] = useState(() => {
    if (typeof window === 'undefined') return 800
    return window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
      setIsLandscape(window.innerHeight < window.innerWidth)
      setViewportHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { isMobile, isTablet, isLandscape, viewportHeight }
}

// Touch gesture handler
interface TouchGestureConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export const useTouchGestures = (config: TouchGestureConfig) => {
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const threshold = config.threshold || 50

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const diffX = startX - endX
    const diffY = startY - endY

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > threshold && config.onSwipeLeft) {
        config.onSwipeLeft()
      } else if (diffX < -threshold && config.onSwipeRight) {
        config.onSwipeRight()
      }
    } else {
      // Vertical swipe
      if (diffY > threshold && config.onSwipeUp) {
        config.onSwipeUp()
      } else if (diffY < -threshold && config.onSwipeDown) {
        config.onSwipeDown()
      }
    }
  }

  return { handleTouchStart, handleTouchEnd }
}

// Pull-to-refresh hook
export const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const pullThreshold = 80

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return

    const distance = e.touches[0].clientY - startY
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, 120))
    }
  }

  const handleTouchEnd = async () => {
    setIsPulling(false)

    if (pullDistance >= pullThreshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  }
}

// Lazy loading intersection observer hook
export const useLazyLoad = (
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        callback()
        observer.unobserve(element)
      }
    }, {
      threshold: 0.1,
      ...options
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, callback, options])

  return { setElement, isVisible }
}

// Performance monitoring hook
export const usePerformanceMonitoring = (componentName: string) => {
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          // Performance metrics tracked internally
          // Can be sent to analytics service in production
        }
      }
    })

    observer.observe({ entryTypes: ['measure', 'paint'] })

    return () => observer.disconnect()
  }, [componentName])
}

export type { MobileOptimizationConfig }
