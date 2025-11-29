import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { ReactNode, CSSProperties } from 'react'

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number // Negative = slower, positive = faster
  style?: CSSProperties
  className?: string
}

const ParallaxSection = ({
  children,
  speed = 0.5,
  style,
  className
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100])

  return (
    <div ref={ref} className={className} style={{ position: 'relative', ...style }}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}

// Parallax background image
export const ParallaxBackground = ({
  imageUrl,
  speed = 0.3,
  overlay = 0.5,
  height = '100%',
  style
}: {
  imageUrl: string
  speed?: number
  overlay?: number
  height?: string
  style?: CSSProperties
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 30}%`])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        ...style
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: '-20%',
          y,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      {overlay > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `rgba(0, 0, 0, ${overlay})`
          }}
        />
      )}
    </div>
  )
}

export default ParallaxSection
