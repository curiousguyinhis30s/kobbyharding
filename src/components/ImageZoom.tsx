import { useState, useRef, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, X } from 'lucide-react'

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
}

const ImageZoom = ({ src, alt, className = '' }: ImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => {
    if (!showLightbox) {
      setIsZoomed(true)
    }
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  const toggleLightbox = () => {
    setShowLightbox(!showLightbox)
    setIsZoomed(false)
  }

  return (
    <>
      {/* Main Image Container */}
      <div className={`relative overflow-hidden cursor-zoom-in ${className}`}>
        <div
          ref={imageRef}
          className="relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={toggleLightbox}
        >
          <img 
            src={src} 
            alt={alt}
            className="w-full h-full object-cover"
          />
          
          {/* Zoom Indicator */}
          <motion.button
            className="absolute top-4 right-4 p-2 bg-black/70 border border-gray-700 hover:bg-orange-500 hover:border-orange-500 text-white transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              toggleLightbox()
            }}
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>

          {/* Hover Zoom Preview */}
          {isZoomed && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat',
                opacity: 0
              }}
            />
          )}

          {/* Magnifier Lens */}
          {isZoomed && (
            <motion.div
              className="absolute w-32 h-32 border-2 border-orange-500 pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                left: `${mousePosition.x}%`,
                top: `${mousePosition.y}%`,
                transform: 'translate(-50%, -50%)',
                backgroundImage: `url(${src})`,
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                backgroundSize: '300%',
                backgroundRepeat: 'no-repeat',
                boxShadow: '0 0 0 2px rgba(251, 146, 60, 0.2)',
              }}
            />
          )}
        </div>

        {/* Zoom Preview Box (Desktop) */}
        {isZoomed && (
          <motion.div
            className="hidden lg:block absolute left-[105%] top-0 w-[500px] h-[500px] border-2 border-gray-800 bg-black z-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                backgroundSize: '200%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 bg-gray-900 border border-gray-800 text-white hover:bg-orange-500 hover:border-orange-500 transition-all z-50"
            onClick={toggleLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
            <button
              className="p-2 bg-gray-900 border border-gray-800 text-white hover:bg-orange-500 hover:border-orange-500 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                // Implement zoom in logic
              }}
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              className="p-2 bg-gray-900 border border-gray-800 text-white hover:bg-orange-500 hover:border-orange-500 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                // Implement zoom out logic
              }}
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Image */}
          <motion.img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            dragElastic={0.2}
          />
        </motion.div>
      )}
    </>
  )
}

export default ImageZoom