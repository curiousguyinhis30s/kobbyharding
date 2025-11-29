import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Sunset, Zap, AlertCircle } from 'lucide-react'
import { useMobileOptimization } from './MobileOptimization'

interface SunsetPiece {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  availableQuantity: number
  originStory: string
}

interface SunsetEditionsProps {
  userTimezone: string
  sunsetTime: Date
  timeUntilSunset: number // in minutes
  isWithinGoldenHour: boolean
  availablePieces: SunsetPiece[]
  onPurchase?: (pieceId: string) => void
}

export const SunsetEditions = ({
  userTimezone,
  sunsetTime,
  timeUntilSunset,
  isWithinGoldenHour,
  availablePieces,
  onPurchase
}: SunsetEditionsProps) => {
  useMobileOptimization()
  const [timeLeft, setTimeLeft] = useState(timeUntilSunset)
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)
  const [fomoLevel, setFomoLevel] = useState(0)

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Calculate FOMO intensity based on time remaining
  useEffect(() => {
    const intensity = Math.min(100, Math.max(0, 100 - (timeLeft / timeUntilSunset) * 100))
    setFomoLevel(intensity)
  }, [timeLeft, timeUntilSunset])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const sunsetDate = new Date(sunsetTime)
  const formattedTime = sunsetDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  // FOMO pulse animation
  const pulseIntensity = Math.max(0.3, fomoLevel / 100)

  return (
    <div className="w-full bg-black text-white relative overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-600/20 via-red-600/10 to-transparent rounded-full blur-3xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 pt-8 pb-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sunset className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl md:text-4xl font-light tracking-tight">
              Sunset Editions
            </h2>
          </div>
          <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase">
            Exclusive pieces released during golden hour
          </p>
        </div>

        {/* Active Status */}
        {isWithinGoldenHour && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-orange-600/20 to-transparent border border-orange-500/30 rounded-lg p-4 md:p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 bg-orange-400 rounded-full flex-shrink-0"
              />
              <span className="text-sm md:text-base font-light text-orange-300">
                Golden hour is live now!
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-400">
              You're in the perfect moment to discover these exclusive pieces.
            </p>
          </motion.div>
        )}

        {/* Countdown Timer - Enhanced */}
        <motion.div
          className="mb-8 bg-white/5 border border-white/10 rounded-lg p-6 md:p-8"
          style={{
            boxShadow: `0 0 ${20 * pulseIntensity}px rgba(249, 115, 22, ${pulseIntensity})`
          }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-xs uppercase tracking-widest text-gray-400">
                Until next sunset
              </span>
            </div>

            <div className="mb-6">
              <motion.div
                className="text-5xl md:text-6xl font-light text-white mb-2 font-mono"
                key={timeLeft}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formatTime(timeLeft)}
              </motion.div>
              <p className="text-sm text-gray-400">
                Sunset in {userTimezone} at {formattedTime}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-600 to-red-600"
                initial={{ width: '100%' }}
                animate={{ width: `${Math.max(0, (timeLeft / timeUntilSunset) * 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            {timeLeft < 60 && timeLeft > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-orange-300 text-xs"
              >
                <Zap className="w-3 h-3" />
                Hurry! Less than an hour left
              </motion.div>
            )}

            {timeLeft === 0 && (
              <div className="text-orange-400 font-light text-sm">
                Check back tomorrow at sunset
              </div>
            )}
          </div>
        </motion.div>

        {/* FOMO Level Indicator */}
        <motion.div
          className="mb-8 bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between"
          animate={{
            borderColor: [
              'rgba(255, 255, 255, 0.1)',
              'rgba(249, 115, 22, 0.3)',
              'rgba(255, 255, 255, 0.1)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              Demand Level
            </p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-black/40 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600"
                  initial={{ width: '0%' }}
                  animate={{ width: `${fomoLevel}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-sm font-light text-gray-300">
                {Math.round(fomoLevel)}%
              </span>
            </div>
          </div>
          <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
        </motion.div>

        {/* Available Pieces */}
        {availablePieces.length > 0 ? (
          <div className="space-y-4 mb-8">
            {availablePieces.map((piece, index) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() =>
                  setSelectedPiece(
                    selectedPiece === piece.id ? null : piece.id
                  )
                }
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg overflow-hidden cursor-pointer transition-all"
              >
                <div className="flex gap-4 p-4 md:p-6">
                  {/* Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900 relative">
                    <img
                      src={piece.imageUrl}
                      alt={piece.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {piece.availableQuantity < 5 && (
                      <div className="absolute top-1 right-1 px-2 py-1 bg-red-600 rounded text-xs font-medium text-white">
                        {piece.availableQuantity} left
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-light text-base md:text-lg mb-1 line-clamp-2">
                        {piece.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {piece.description}
                      </p>
                      {piece.originStory && (
                        <p className="text-xs text-gray-500 italic">
                          "{piece.originStory.substring(0, 60)}..."
                        </p>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-lg md:text-2xl font-light text-white">
                        ${piece.price}
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          onPurchase?.(piece.id)
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded px-4 py-2 text-xs md:text-sm font-medium transition-all flex-shrink-0"
                      >
                        Get Now
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedPiece === piece.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-black/40 border-t border-white/10 p-4 md:p-6 space-y-4"
                    >
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                          Full Story
                        </h4>
                        <p className="text-sm text-gray-300">
                          {piece.originStory}
                        </p>
                      </div>

                      <div className="bg-black/40 rounded p-3 flex items-center gap-3">
                        <Zap className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        <p className="text-xs text-orange-300">
                          This is exclusive to sunset hours. Once the golden hour ends,
                          this piece won't be available until tomorrow.
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onPurchase?.(piece.id)
                        }}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded px-4 py-3 text-sm font-medium transition-all"
                      >
                        Purchase Sunset Edition
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/5 border border-white/10 rounded-lg mb-8"
          >
            <Sunset className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-light mb-2">No pieces available right now</h3>
            <p className="text-sm text-gray-400">
              Come back at sunset tomorrow to discover new exclusive editions.
            </p>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-8"
        >
          <h4 className="text-lg font-light mb-4">How Sunset Editions Work</h4>
          <div className="space-y-3">
            {[
              {
                icon: '🌅',
                title: 'Released During Golden Hour',
                desc: 'New exclusive pieces appear only during sunset in your timezone'
              },
              {
                icon: '⏱️',
                title: 'Time-Limited',
                desc: 'Each piece is only available for the duration of sunset (~1 hour)'
              },
              {
                icon: '👀',
                title: 'Limited Quantity',
                desc: 'Quantities are intentionally small to create exclusivity'
              },
              {
                icon: '🔥',
                title: 'FOMO-Approved',
                desc: 'Watch demand spike as sunset approaches'
              }
            ].map((step, index) => (
              <div key={index} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{step.icon}</span>
                <div>
                  <p className="font-light text-sm mb-1">{step.title}</p>
                  <p className="text-xs text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SunsetEditions
