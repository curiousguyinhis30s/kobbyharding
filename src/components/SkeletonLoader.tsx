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
      role="status"
      aria-label="Loading..."
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--bg-tertiary) 0%, var(--bg-hover) 50%, var(--bg-tertiary) 100%)',
        backgroundSize: '200% 100%',
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
    <div
      style={{
        width: '100%',
        padding: '0',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)'
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading product"
    >
      {/* Image skeleton */}
      <SkeletonBox height="200px" borderRadius="0" />

      {/* Content */}
      <div style={{ padding: '12px' }}>
        {/* Title */}
        <SkeletonBox height="14px" width="70%" style={{ marginBottom: '6px' }} />

        {/* Price */}
        <SkeletonBox height="16px" width="40%" style={{ marginBottom: '8px' }} />

        {/* Button */}
        <SkeletonBox height="32px" width="100%" borderRadius="0" />
      </div>
    </div>
  )
}

export const ProductDetailSkeleton = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        padding: '80px 20px 40px'
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading product details"
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
    <div
      style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        marginBottom: '16px'
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading cart item"
    >
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

export default SkeletonBox
