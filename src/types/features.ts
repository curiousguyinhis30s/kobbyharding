// Feature Type Definitions

// Koby's Journey Tracker
export interface CityStop {
  city: string
  country: string
  arrivalDate: Date
  departureDate?: Date
  piecesAvailable: number
  totalWeight: number
  message: string
  latitude: number
  longitude: number
  stories?: LocationStory[]
}

export interface LocationStory {
  id: string
  imageUrl: string
  caption: string
  date: Date
}

// Fabric DNA
export interface FabricOrigin {
  location: string
  country: string
  date: Date
  description: string
  coordinates: [number, number]
}

export interface FabricJourneyStep {
  stage: string
  location: string
  description: string
  date: Date
  image?: string
}

export interface FabricDNAData {
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

// Festival Twins
export interface Festival {
  id: string
  name: string
  date: string
  location: string
  attendees: number
}

export interface StyleGroup {
  id: string
  name: string
  members: number
  vibe: string
  outfitPlan: string
  memberNames: string[]
  image?: string
}

export interface MatchedUser {
  id: string
  name: string
  location: string
  festivals: Festival[]
  vibes: string[]
  imageUrl: string
  bio: string
  commonFestivals: Festival[]
}

// Sunset Editions
export interface SunsetPiece {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  availableQuantity: number
  originStory: string
}

// Voice of the Thread
export interface AudioTrack {
  id: string
  title: string
  duration: number
  url: string
  transcript: string
  backgroundSound?: string
  backgroundSoundLocation?: string
}

export interface VoiceStoryData {
  pieceId: string
  pieceName: string
  voiceStory: AudioTrack
  createdDate: Date
  creationLocation: string
  kobyMessage?: string
  relatedTracks?: AudioTrack[]
}

// Mobile Optimization
export interface MobileOptimizationConfig {
  enableTouchGestures: boolean
  enablePullToRefresh: boolean
  enableLazyLoading: boolean
  minTouchTargetSize: number
}

export interface TouchGestureConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export interface PullToRefreshConfig {
  onRefresh: () => Promise<void>
  threshold?: number
}
