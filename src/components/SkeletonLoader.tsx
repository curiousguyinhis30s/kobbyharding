import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
  style?: React.CSSProperties
}

export const SkeletonBox = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className,
  style
}: SkeletonLoaderProps) => {
  return (
    <motion.div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style
      }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )
}

export const ProductCardSkeleton = () => {
  return (
    <div style={{
      width: '100%',
      padding: '0',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      {/* Image skeleton */}
      <SkeletonBox height="400px" borderRadius="0" />

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Title */}
        <SkeletonBox height="18px" width="70%" style={{ marginBottom: '8px' }} />

        {/* Price */}
        <SkeletonBox height="20px" width="40%" style={{ marginBottom: '12px' }} />

        {/* Button */}
        <SkeletonBox height="40px" width="100%" borderRadius="0" />
      </div>
    </div>
  )
}

export const ProductDetailSkeleton = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      padding: '80px 20px 40px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px'
      }}>
        {/* Image side */}
        <div>
          <SkeletonBox height="600px" borderRadius="0" />
        </div>

        {/* Details side */}
        <div>
          <SkeletonBox height="40px" width="80%" style={{ marginBottom: '16px' }} />
          <SkeletonBox height="30px" width="30%" style={{ marginBottom: '24px' }} />
          <SkeletonBox height="100px" width="100%" style={{ marginBottom: '24px' }} />
          <SkeletonBox height="50px" width="100%" borderRadius="0" />
        </div>
      </div>
    </div>
  )
}

export const CartItemSkeleton = () => {
  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '16px'
    }}>
      {/* Image */}
      <SkeletonBox width="120px" height="160px" borderRadius="0" />

      {/* Content */}
      <div style={{ flex: 1 }}>
        <SkeletonBox height="20px" width="60%" style={{ marginBottom: '8px' }} />
        <SkeletonBox height="16px" width="40%" style={{ marginBottom: '12px' }} />
        <SkeletonBox height="32px" width="120px" />
      </div>

      {/* Price */}
      <SkeletonBox height="24px" width="80px" />
    </div>
  )
}

// Add shimmer animation to global styles if not already present
const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`

// Inject style if not already present
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-shimmer-style'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = shimmerStyle
    document.head.appendChild(style)
  }
}

export default SkeletonBox