import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Package, Plane } from 'lucide-react'
import { useMobileOptimization } from './MobileOptimization'

interface CityStop {
  city: string
  country: string
  arrivalDate: Date
  departureDate?: Date
  piecesAvailable: number
  totalWeight: number
  message: string
  latitude: number
  longitude: number
  stories?: Array<{
    id: string
    imageUrl: string
    caption: string
    date: Date
  }>
}

interface KobysJourneyTrackerProps {
  currentLocation: CityStop
  upcomingStops: CityStop[]
  pastStops: CityStop[]
  onLocationSelect?: (location: CityStop) => void
}

export const KobysJourneyTracker = ({
  currentLocation,
  upcomingStops,
  pastStops,
  onLocationSelect
}: KobysJourneyTrackerProps) => {
  const [selectedLocation, setSelectedLocation] = useState<CityStop | null>(currentLocation)
  const [viewMode, setViewMode] = useState<'timeline' | 'map' | 'stories'>('timeline')
  const [expandedStory, setExpandedStory] = useState<string | null>(null)

  const handleLocationSelect = (location: CityStop) => {
    setSelectedLocation(location)
    onLocationSelect?.(location)
  }

  return (
    <div className="w-full bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-4xl font-light tracking-tight mb-2">
          Koby's Journey
        </h2>
        <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase">
          Follow the collection around the world
        </p>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 md:gap-4 mb-8 border-b border-white/10">
        {(['timeline', 'map', 'stories'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium tracking-widest uppercase transition-all ${
              viewMode === mode
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {mode === 'timeline' && '📅 Timeline'}
            {mode === 'map' && '🗺️ Map'}
            {mode === 'stories' && '📸 Stories'}
          </button>
        ))}
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-4 md:space-y-6">
          {/* Current Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600/20 to-transparent border border-blue-500/30 rounded-lg p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-full p-3 flex-shrink-0 mt-1">
                  <Plane className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h3 className="text-lg md:text-xl font-light">
                      {currentLocation.city}
                    </h3>
                    <span className="text-xs px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 font-medium flex-shrink-0">
                      CURRENT
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    {currentLocation.country}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Pieces
                      </p>
                      <p className="text-lg font-light">
                        {currentLocation.piecesAvailable}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Total Weight
                      </p>
                      <p className="text-lg font-light">
                        {currentLocation.totalWeight}kg
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Arrived
                      </p>
                      <p className="text-lg font-light">
                        {new Date(currentLocation.arrivalDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {currentLocation.message && (
                    <p className="text-sm text-gray-300 mt-4 italic">
                      "{currentLocation.message}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Stops */}
          {upcomingStops.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                Upcoming Stops
              </h4>
              <div className="space-y-3">
                {upcomingStops.map((stop, index) => (
                  <motion.button
                    key={`${stop.city}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleLocationSelect(stop)}
                    className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-4 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 group-hover:text-white flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-light text-base mb-1">
                          {stop.city}, {stop.country}
                        </h5>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(stop.arrivalDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {stop.piecesAvailable} pieces
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Past Stops */}
          {pastStops.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                Past Locations
              </h4>
              <div className="space-y-2">
                {pastStops.map((stop, index) => (
                  <motion.button
                    key={`${stop.city}-past-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleLocationSelect(stop)}
                    className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full flex-shrink-0" />
                      <span className="text-sm text-gray-400">
                        {stop.city}, {stop.country}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center"
        >
          <div className="w-full max-w-2xl">
            {/* Simplified map visualization */}
            <div
              className="bg-gray-900 border border-white/10 rounded-lg overflow-hidden"
              style={{ aspectRatio: '16/9' }}
            >
              <div className="w-full h-full relative flex items-center justify-center">
                <p className="text-gray-400 text-sm">
                  Map integration with{' '}
                  <span className="text-blue-400">Mapbox/Leaflet</span>
                </p>
              </div>
            </div>

            {/* Location details */}
            {selectedLocation && (
              <motion.div
                key={selectedLocation.city}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <h4 className="font-light text-lg mb-3">
                  {selectedLocation.city}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Country</p>
                    <p className="text-white">{selectedLocation.country}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Coordinates</p>
                    <p className="text-white text-xs font-mono">
                      {selectedLocation.latitude.toFixed(4)},
                      {selectedLocation.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Stories View */}
      {viewMode === 'stories' && currentLocation.stories && currentLocation.stories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {currentLocation.stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
              className="cursor-pointer bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="aspect-square bg-gray-900 overflow-hidden relative">
                <img
                  src={story.imageUrl}
                  alt={story.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              {expandedStory === story.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-black border-t border-white/10"
                >
                  <p className="text-sm text-gray-300 mb-2">{story.caption}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(story.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {viewMode === 'stories' && (!currentLocation.stories || currentLocation.stories.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">
            No stories available for this location yet.
          </p>
        </div>
      )}
    </div>
  )
}

export default KobysJourneyTracker
