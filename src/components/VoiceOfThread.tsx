import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, Download, Music, MapPin, ChevronDown } from 'lucide-react'
import { useMobileOptimization } from './MobileOptimization'

interface AudioTrack {
  id: string
  title: string
  duration: number
  url: string
  transcript: string
  backgroundSound?: string
  backgroundSoundLocation?: string
}

interface VoiceOfThreadProps {
  pieceId: string
  pieceName: string
  voiceStory: AudioTrack
  createdDate: Date
  creationLocation: string
  kobyMessage?: string
  relatedTracks?: AudioTrack[]
  onDownload?: (trackId: string) => void
}

export const VoiceOfThread = ({
  pieceName,
  voiceStory,
  createdDate,
  creationLocation,
  kobyMessage,
  relatedTracks = [],
  onDownload
}: VoiceOfThreadProps) => {
  useMobileOptimization()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null)
  const [volume, setVolume] = useState(1)

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / voiceStory.duration) * 100

  return (
    <div className="w-full bg-black text-white">
      {/* Header */}
      <div className="px-4 md:px-8 pt-8 pb-6 border-b border-white/10">
        <div className="flex items-start gap-3 mb-4">
          <Music className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight mb-1">
              Voice of the Thread
            </h2>
            <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase">
              Audio story by Koby for each piece
            </p>
          </div>
        </div>
      </div>

      {/* Main Story Player */}
      <div className="px-4 md:px-8 py-8">
        {/* Header Info */}
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-light mb-3">
            {pieceName}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Created
              </p>
              <p className="text-gray-200">
                {new Date(createdDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Location
              </p>
              <div className="flex items-center gap-1 text-gray-200">
                <MapPin className="w-3 h-3" />
                {creationLocation}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Duration
              </p>
              <p className="text-gray-200">{formatTime(voiceStory.duration)}</p>
            </div>
          </div>
        </div>

        {/* Player Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-lg p-6 md:p-8 mb-8">
          {/* Waveform Visualization */}
          <div className="mb-6 flex items-end gap-1 h-12 justify-center">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                initial={{ height: '20%' }}
                animate={{
                  height: isPlaying
                    ? `${Math.random() * 100}%`
                    : '20%'
                }}
                transition={{
                  duration: 0.1,
                  repeat: isPlaying ? Infinity : 0
                }}
              />
            ))}
          </div>

          {/* Play Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <motion.button
              onClick={handlePlayPause}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 flex items-center justify-center transition-all shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 md:w-8 md:h-8 text-white" />
              ) : (
                <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" />
              )}
            </motion.button>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${
                    volume * 100
                  }%, rgb(255, 255, 255, 0.2) ${volume * 100}%, rgb(255, 255, 255, 0.2) 100%)`
                }}
              />
              <span className="text-xs text-gray-400 w-6 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min="0"
                max={voiceStory.duration}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(voiceStory.duration)}</span>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={voiceStory.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              audioRef.current.volume = volume
            }
          }}
        />

        {/* Background Sound Info */}
        {voiceStory.backgroundSound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white/5 border border-white/10 rounded-lg p-4"
          >
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              Ambient Soundtrack
            </p>
            <p className="text-sm text-gray-300">
              {voiceStory.backgroundSound}
              {voiceStory.backgroundSoundLocation && (
                <span className="text-gray-500">
                  {' '}· Recorded in {voiceStory.backgroundSoundLocation}
                </span>
              )}
            </p>
          </motion.div>
        )}

        {/* Koby Message */}
        {kobyMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 bg-gradient-to-r from-purple-600/20 to-transparent border border-purple-600/30 rounded-lg p-6"
          >
            <p className="text-xs uppercase tracking-widest text-purple-400 mb-3">
              Koby's Note
            </p>
            <p className="text-sm text-gray-300 italic">
              "{kobyMessage}"
            </p>
          </motion.div>
        )}

        {/* Transcript */}
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-8">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full text-left p-4 md:p-6 hover:bg-white/10 transition-colors flex items-center justify-between"
          >
            <div>
              <h4 className="text-base font-light">Transcript</h4>
              <p className="text-xs text-gray-400 mt-1">
                Read along with Koby's voice
              </p>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                showTranscript ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-black/40 border-t border-white/10 p-4 md:p-6"
              >
                <p className="text-sm text-gray-300 leading-relaxed">
                  {voiceStory.transcript}
                </p>
                <button
                  onClick={() => onDownload?.(voiceStory.id)}
                  className="mt-4 w-full bg-white/10 hover:bg-white/20 rounded px-4 py-2 text-xs font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  Download Transcript
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Download Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <button
            onClick={() => onDownload?.(voiceStory.id)}
            className="bg-white/10 hover:bg-white/20 rounded px-4 py-3 text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Audio
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-3 text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <Music className="w-4 h-4" />
            Share Story
          </button>
        </motion.div>
      </div>

      {/* Related Tracks */}
      {relatedTracks.length > 0 && (
        <div className="px-4 md:px-8 py-8 border-t border-white/10">
          <h4 className="text-lg font-light mb-4">Other Stories in This Collection</h4>
          <div className="space-y-3">
            {relatedTracks.map((track, index) => (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() =>
                  setExpandedTrack(expandedTrack === track.id ? null : track.id)
                }
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-4 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <Music className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-light text-base truncate">{track.title}</p>
                    <p className="text-xs text-gray-400">
                      {formatTime(track.duration)}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                      expandedTrack === track.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {expandedTrack === track.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-white/10 flex gap-2"
                    >
                      <button className="flex-1 bg-white/10 hover:bg-white/20 rounded px-3 py-2 text-xs font-medium transition-all">
                        Listen
                      </button>
                      <button
                        onClick={() => onDownload?.(track.id)}
                        className="flex-1 bg-white/10 hover:bg-white/20 rounded px-3 py-2 text-xs font-medium transition-all flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VoiceOfThread
