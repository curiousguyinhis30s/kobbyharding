import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, MapPin, Leaf, Shield, Download, Share2, ChevronDown } from 'lucide-react'
import { useMobileOptimization } from './MobileOptimization'

interface FabricOrigin {
  location: string
  country: string
  date: Date
  description: string
  coordinates: [number, number]
}

interface FabricJourneyStep {
  stage: string
  location: string
  description: string
  date: Date
  image?: string
}

interface FabricDNAData {
  pieceId: string
  qrCode: string
  fabricOrigin: FabricOrigin
  journeySteps: FabricJourneyStep[]
  careInstructions: {
    washing: string
    drying: string
    ironing: string
    storage: string
  }
  sustainability: {
    score: number
    waterUsed: number
    carbonFootprint: number
    certifications: string[]
  }
  authenticity: {
    serialNumber: string
    createdDate: Date
    verificationUrl: string
    verificationCode: string
  }
}

interface FabricDNAProps {
  data: FabricDNAData
  onShare?: () => void
}

export const FabricDNA = ({ data, onShare }: FabricDNAProps) => {
  const { isMobile } = useMobileOptimization()
  const [expandedSection, setExpandedSection] = useState<string | null>('journey')
  const [showQRCode, setShowQRCode] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(type)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="w-full bg-black text-white">
      {/* Header */}
      <div className="px-4 md:px-8 pt-8 pb-6">
        <h2 className="text-2xl md:text-4xl font-light tracking-tight mb-2">
          Fabric DNA
        </h2>
        <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase">
          Complete origin story & authenticity verification
        </p>
      </div>

      {/* QR Code Section */}
      <div className="px-4 md:px-8 mb-8">
        <motion.button
          onClick={() => setShowQRCode(!showQRCode)}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-6 transition-all flex items-center justify-between"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4">
            <QrCode className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-light text-base">Scan QR Code</h3>
              <p className="text-xs text-gray-400 mt-1">
                Verify authenticity & view complete story
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              showQRCode ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col items-center"
            >
              <div className="bg-white p-4 rounded-lg mb-4">
                <img
                  src={data.qrCode}
                  alt="Fabric DNA QR Code"
                  className={isMobile ? 'w-40 h-40' : 'w-48 h-48'}
                />
              </div>
              <p className="text-sm text-gray-400 text-center mb-4">
                Scan to verify authenticity and explore complete fabric journey
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => handleCopy(data.authenticity.verificationCode, 'qr')}
                  className="flex-1 bg-white/10 hover:bg-white/20 rounded px-4 py-2 text-xs font-medium transition-all"
                >
                  {copiedText === 'qr' ? '✓ Copied' : 'Copy Code'}
                </button>
                <button
                  onClick={onShare}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fabric Journey */}
      <div className="px-4 md:px-8 mb-6">
        <motion.button
          onClick={() => toggleSection('journey')}
          className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-6 transition-all flex items-center justify-between"
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center gap-4">
            <MapPin className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <h3 className="font-light text-base">Fabric Journey</h3>
              <p className="text-xs text-gray-400 mt-1">
                From source to finished piece
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSection === 'journey' ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {expandedSection === 'journey' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-white/5 border border-t-0 border-white/10 rounded-b-lg overflow-hidden"
            >
              {/* Origin */}
              <div className="p-6 border-b border-white/10">
                <h4 className="text-sm font-light mb-4">Origin</h4>
                <div className="bg-black/40 rounded-lg p-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-light text-base mb-1">
                        {data.fabricOrigin.location}
                      </p>
                      <p className="text-sm text-gray-400 mb-2">
                        {data.fabricOrigin.country}
                      </p>
                      <p className="text-sm text-gray-300 mb-3">
                        {data.fabricOrigin.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(data.fabricOrigin.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Journey Steps */}
              {data.journeySteps.length > 0 && (
                <div className="p-6 border-b border-white/10">
                  <h4 className="text-sm font-light mb-4">Processing</h4>
                  <div className="space-y-4">
                    {data.journeySteps.map((step, index) => (
                      <div key={index} className="bg-black/40 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">
                              {step.stage}
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                              {step.location}
                            </p>
                            <p className="text-sm text-gray-300 mb-2">
                              {step.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(step.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Care Instructions */}
      <div className="px-4 md:px-8 mb-6">
        <motion.button
          onClick={() => toggleSection('care')}
          className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-6 transition-all flex items-center justify-between"
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center gap-4">
            <Leaf className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <h3 className="font-light text-base">Care Instructions</h3>
              <p className="text-xs text-gray-400 mt-1">
                Preserve your piece for years
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSection === 'care' ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {expandedSection === 'care' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-white/5 border border-t-0 border-white/10 rounded-b-lg p-6 space-y-4"
            >
              {Object.entries(data.careInstructions).map(([key, value]) => (
                <div key={key} className="bg-black/40 rounded-lg p-4">
                  <h4 className="text-sm font-light capitalize mb-2">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </h4>
                  <p className="text-sm text-gray-300">{value}</p>
                </div>
              ))}
              <button
                onClick={() => handleCopy(
                  Object.values(data.careInstructions).join('\n\n'),
                  'care'
                )}
                className="w-full bg-white/10 hover:bg-white/20 rounded px-4 py-2 text-xs font-medium transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Download className="w-3 h-3" />
                {copiedText === 'care' ? 'Copied to Clipboard' : 'Download Care Guide'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sustainability */}
      <div className="px-4 md:px-8 mb-6">
        <motion.button
          onClick={() => toggleSection('sustainability')}
          className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-6 transition-all flex items-center justify-between"
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center gap-4">
            <Shield className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="font-light text-base">Sustainability</h3>
              <p className="text-xs text-gray-400 mt-1">
                Environmental impact metrics
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSection === 'sustainability' ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {expandedSection === 'sustainability' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-white/5 border border-t-0 border-white/10 rounded-b-lg p-6 space-y-4"
            >
              {/* Score */}
              <div className="bg-black/40 rounded-lg p-4">
                <h4 className="text-sm font-light mb-3">Sustainability Score</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-black/40 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-emerald-400"
                      style={{ width: `${data.sustainability.score}%` }}
                    />
                  </div>
                  <span className="text-lg font-light">
                    {data.sustainability.score}%
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Water Used
                  </p>
                  <p className="text-2xl font-light">
                    {data.sustainability.waterUsed}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">liters</p>
                </div>
                <div className="bg-black/40 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Carbon Footprint
                  </p>
                  <p className="text-2xl font-light">
                    {data.sustainability.carbonFootprint}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">kg CO₂</p>
                </div>
              </div>

              {/* Certifications */}
              {data.sustainability.certifications.length > 0 && (
                <div className="bg-black/40 rounded-lg p-4">
                  <h4 className="text-sm font-light mb-3">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.sustainability.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="px-3 py-1 bg-green-600/20 border border-green-600/50 rounded-full text-xs font-medium text-green-300"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Authenticity Verification */}
      <div className="px-4 md:px-8 mb-8">
        <motion.button
          onClick={() => toggleSection('authenticity')}
          className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-6 transition-all flex items-center justify-between"
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center gap-4">
            <Shield className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <div>
              <h3 className="font-light text-base">Authenticity</h3>
              <p className="text-xs text-gray-400 mt-1">
                Verification & serial number
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSection === 'authenticity' ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {expandedSection === 'authenticity' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-white/5 border border-t-0 border-white/10 rounded-b-lg p-6 space-y-4"
            >
              <div className="bg-black/40 rounded-lg p-4">
                <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Serial Number
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-mono text-white">
                    {data.authenticity.serialNumber}
                  </p>
                  <button
                    onClick={() =>
                      handleCopy(data.authenticity.serialNumber, 'serial')
                    }
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedText === 'serial' ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="bg-black/40 rounded-lg p-4">
                <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Created
                </h4>
                <p className="text-base font-light">
                  {new Date(data.authenticity.createdDate).toLocaleDateString(
                    'en-US',
                    {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    }
                  )}
                </p>
              </div>

              <a
                href={data.authenticity.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 rounded px-4 py-3 text-sm font-medium text-center transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Verify Authenticity
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FabricDNA
