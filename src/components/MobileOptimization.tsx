import { useEffect, useState } from 'react'

interface MobileOptimizationConfig {
  enableTouchGestures: boolean
  enablePullToRefresh: boolean
  enableLazyLoading: boolean
  minTouchTargetSize: number // 44px minimum
}

// Responsive image component with lazy loading and srcset
interface ResponsiveImageProps {
  src: string
  alt: string
  srcSet?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  className?: string
  onLoad?: () => void
}

export const ResponsiveImage = ({
  src,
  alt,
  srcSet,
  sizes,
  loading = 'lazy',
  className = '',
  onLoad
}: ResponsiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  return (
    <picture>
      {srcSet && (
        <source
          srcSet={srcSet}
          sizes={sizes || '100vw'}
          media="(max-width: 768px)"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={() => setError(true)}
        style={{
          display: error ? 'none' : 'block'
        }}
      />
    </picture>
  )
}

// Mobile navigation drawer component
interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const MobileDrawer = ({ isOpen, onClose, children }: MobileDrawerProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-40 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {children}
      </div>
    </>
  )
}

// Minimum touch target size utility component
interface TouchTargetProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}

export const TouchTarget = ({
  onClick,
  children,
  className = '',
  ariaLabel
}: TouchTargetProps) => {
  return (
    <button
      onClick={onClick}
      className={`min-h-11 min-w-11 flex items-center justify-center ${className}`}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  )
}

// Re-export hooks - they are in separate files to avoid Fast Refresh issues
export {
  useMobileOptimization,
  useTouchGestures,
  usePullToRefresh,
  useLazyLoad,
  usePerformanceMonitoring
} from './useMobileOptimization'

// Mobile optimization context provider
export const MobileOptimizationProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [config] = useState<MobileOptimizationConfig>({
    enableTouchGestures: true,
    enablePullToRefresh: true,
    enableLazyLoading: true,
    minTouchTargetSize: 44
  })

  useEffect(() => {
    // Disable double-tap zoom on interactive elements
    const handleTouchEnd = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input')) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchend', handleTouchEnd, { passive: false })

    // Optimize viewport settings
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no'
      )
    }

    return () => {
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [config])

  return <>{children}</>
}

export default MobileOptimizationProvider
