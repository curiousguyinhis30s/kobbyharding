// Feature Utilities and Helper Functions

import type { CityStop, SunsetPiece, Festival } from '../types/features'

/**
 * Calculate next sunset time for a given location
 * Note: Requires suncalc library: npm install suncalc
 */
export const calculateSunsetTime = (latitude: number, longitude: number, date: Date = new Date()) => {
  // Placeholder implementation
  // Use suncalc library in production: https://github.com/mourner/suncalc
  const nextSunset = new Date(date)
  nextSunset.setHours(18, 30, 0) // Example: 6:30 PM
  return nextSunset
}

/**
 * Check if current time is within golden hour (30 mins before/after sunset)
 */
export const isWithinGoldenHour = (sunsetTime: Date, buffer: number = 30): boolean => {
  const now = new Date()
  const bufferMs = buffer * 60 * 1000
  const beforeSunset = new Date(sunsetTime.getTime() - bufferMs)
  const afterSunset = new Date(sunsetTime.getTime() + bufferMs)

  return now >= beforeSunset && now <= afterSunset
}

/**
 * Calculate time until sunset in minutes
 */
export const getTimeUntilSunset = (sunsetTime: Date): number => {
  const now = new Date()
  const diffMs = sunsetTime.getTime() - now.getTime()
  return Math.max(0, Math.floor(diffMs / 60000)) // Convert to minutes
}

/**
 * Get user's timezone
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Format seconds to MM:SS or H:MM:SS
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Find common festivals between users
 */
export const getCommonFestivals = (festivals1: Festival[], festivals2: Festival[]): Festival[] => {
  return festivals1.filter(f1 =>
    festivals2.some(f2 => f2.id === f1.id)
  )
}

/**
 * Calculate vibe compatibility score (0-100)
 */
export const getVibeCompatibility = (vibes1: string[], vibes2: string[]): number => {
  if (vibes1.length === 0 || vibes2.length === 0) return 0

  const common = vibes1.filter(v => vibes2.includes(v)).length
  const total = Math.max(vibes1.length, vibes2.length)

  return Math.round((common / total) * 100)
}

/**
 * Filter pieces by price range
 */
export const filterPiecesByPrice = (
  pieces: SunsetPiece[],
  minPrice: number,
  maxPrice: number
): SunsetPiece[] => {
  return pieces.filter(p => p.price >= minPrice && p.price <= maxPrice)
}

/**
 * Sort pieces by availability (most available first)
 */
export const sortByAvailability = (pieces: SunsetPiece[]): SunsetPiece[] => {
  return [...pieces].sort((a, b) => b.availableQuantity - a.availableQuantity)
}

/**
 * Sort pieces by demand (most wanted first - reverse availability)
 */
export const sortByDemand = (pieces: SunsetPiece[]): SunsetPiece[] => {
  return [...pieces].sort((a, b) => a.availableQuantity - b.availableQuantity)
}

/**
 * Generate unique serial number for authenticity
 */
export const generateSerialNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${timestamp}-${random}`
}

/**
 * Calculate sustainability score based on various factors
 */
export const calculateSustainabilityScore = (
  waterUsed: number,
  carbonFootprint: number,
  certifications: string[]
): number => {
  // Base score
  let score = 50

  // Water impact (0-25 points)
  // Less water = higher score
  if (waterUsed < 100) score += 25
  else if (waterUsed < 500) score += 15
  else if (waterUsed < 1000) score += 5

  // Carbon footprint (0-25 points)
  if (carbonFootprint < 5) score += 25
  else if (carbonFootprint < 10) score += 15
  else if (carbonFootprint < 20) score += 5

  // Certifications (bonus points)
  score += Math.min(certifications.length * 5, 25)

  return Math.min(100, score)
}

/**
 * Format location name for display
 */
export const formatLocation = (city: string, country: string): string => {
  return `${city}, ${country}`
}

/**
 * Check if piece is low in stock
 */
export const isLowStock = (quantity: number, threshold: number = 5): boolean => {
  return quantity > 0 && quantity <= threshold
}

/**
 * Calculate FOMO intensity (0-100)
 */
export const calculateFOMOIntensity = (
  availableQuantity: number,
  timeUntilSunset: number,
  initialTimeUntilSunset: number
): number => {
  // Lower quantity = higher FOMO
  const quantityFactor = Math.max(0, 50 - availableQuantity * 5)

  // Time passing = higher FOMO
  const timePercentage = (1 - timeUntilSunset / initialTimeUntilSunset) * 50

  return Math.min(100, quantityFactor + timePercentage)
}

/**
 * Determine if locations are close (within ~100km)
 */
export const areLocationsClose = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): boolean => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance < 100
}

/**
 * Validate QR code format
 */
export const validateQRCode = (code: string): boolean => {
  const qrPattern = /^[A-Za-z0-9\-_]+$/
  return qrPattern.test(code) && code.length > 0
}

/**
 * Format date for display
 */
export const formatDateDisplay = (
  date: Date,
  format: 'short' | 'long' | 'time' = 'short'
): string => {
  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    time: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  }

  const selectedOption = formatOptions[format] || formatOptions.short
  return new Date(date).toLocaleDateString('en-US', selectedOption)
}

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Throttle function for performance
 */
export const throttle = <T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Get contrasting text color for background
 */
export const getContrastingColor = (hexColor: string): 'white' | 'black' => {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? 'black' : 'white'
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

/**
 * Share feature detection
 */
export const canShare = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.share
}

/**
 * Native share
 */
export const shareData = async (data: {
  title?: string
  text?: string
  url?: string
}): Promise<void> => {
  if (navigator.share) {
    try {
      await navigator.share(data)
    } catch (error) {
      console.error('Share failed:', error)
    }
  }
}
