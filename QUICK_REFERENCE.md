# Quick Reference: Mobile Optimization & Features

## 🚀 Quick Start Integration

### 1. Add Imports to App.tsx

```typescript
import { lazy, Suspense } from 'react'
import MobileOptimizationProvider from './components/MobileOptimization'

// Lazy load feature pages
const JourneyTracker = lazy(() => import('./pages/JourneyTracker'))
const FabricDNAPage = lazy(() => import('./pages/FabricDNA'))
const FestivalTwinsPage = lazy(() => import('./pages/FestivalTwins'))
const SunsetEditionsPage = lazy(() => import('./pages/SunsetEditions'))
const VoiceOfThreadPage = lazy(() => import('./pages/VoiceOfThread'))
```

### 2. Wrap App with MobileOptimizationProvider

```typescript
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MobileOptimizationProvider>
          <Router>
            <AppContent />
          </Router>
        </MobileOptimizationProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
```

### 3. Add Routes

```typescript
<Route path="/journey" element={<JourneyTracker />} />
<Route path="/fabric-dna/:id" element={<FabricDNAPage />} />
<Route path="/festival-twins" element={<FestivalTwinsPage />} />
<Route path="/sunset" element={<SunsetEditionsPage />} />
<Route path="/voice/:id" element={<VoiceOfThreadPage />} />
```

---

## 🎯 Mobile Optimization Hook Examples

### Detect Device Type

```typescript
import { useMobileOptimization } from '@/components/MobileOptimization'

function MyComponent() {
  const { isMobile, isTablet, isLandscape, viewportHeight } = useMobileOptimization()

  return (
    <div>
      {isMobile && <p>You're on mobile!</p>}
      {isTablet && <p>You're on tablet!</p>}
      {isLandscape && <p>Landscape orientation</p>}
    </div>
  )
}
```

### Handle Touch Gestures

```typescript
import { useTouchGestures } from '@/components/MobileOptimization'
import { useNavigate } from 'react-router-dom'

function Carousel() {
  const navigate = useNavigate()
  const { handleTouchStart, handleTouchEnd } = useTouchGestures({
    onSwipeLeft: () => navigate('next'),
    onSwipeRight: () => navigate('prev'),
    onSwipeUp: () => navigate('up'),
    threshold: 50
  })

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Content */}
    </div>
  )
}
```

### Pull-to-Refresh

```typescript
import { usePullToRefresh } from '@/components/MobileOptimization'
import { motion } from 'framer-motion'

function RefreshableList() {
  const { isPulling, pullDistance, isRefreshing, handlers } = usePullToRefresh(
    async () => {
      // Fetch fresh data
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  )

  return (
    <div {...handlers}>
      {isPulling && (
        <motion.div style={{ height: pullDistance }}>
          Pull to refresh...
        </motion.div>
      )}
      {/* List content */}
    </div>
  )
}
```

### Lazy Load Images

```typescript
import { ResponsiveImage, useLazyLoad } from '@/components/MobileOptimization'

function ImageGallery() {
  return (
    <ResponsiveImage
      src="image.jpg"
      alt="Gallery item"
      srcSet="mobile.jpg 480w, tablet.jpg 768w, desktop.jpg 1024w"
      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
      loading="lazy"
    />
  )
}
```

### Minimum Touch Target

```typescript
import { TouchTarget } from '@/components/MobileOptimization'

function ActionButtons() {
  return (
    <div className="flex gap-4">
      <TouchTarget
        onClick={() => console.log('Buy')}
        ariaLabel="Add to cart"
      >
        🛒 Add to Cart
      </TouchTarget>
      <TouchTarget
        onClick={() => console.log('Heart')}
        ariaLabel="Add to favorites"
      >
        ❤️ Save
      </TouchTarget>
    </div>
  )
}
```

---

## 🌍 Koby's Journey Tracker Examples

### Basic Usage

```typescript
import KobysJourneyTracker from '@/components/KobysJourneyTracker'
import { CityStop } from '@/types/features'

function JourneyPage() {
  const currentLocation: CityStop = {
    city: 'Istanbul',
    country: 'Turkey',
    arrivalDate: new Date('2024-09-01'),
    piecesAvailable: 32,
    totalWeight: 180,
    message: 'Blending Eastern tradition with Western innovation',
    latitude: 41.0082,
    longitude: 28.9784,
    stories: [
      {
        id: 'story-1',
        imageUrl: '/images/istanbul-1.jpg',
        caption: 'Grand Bazaar colors',
        date: new Date('2024-09-10')
      }
    ]
  }

  return (
    <KobysJourneyTracker
      currentLocation={currentLocation}
      upcomingStops={[...]}
      pastStops={[...]}
      onLocationSelect={(location) => {
        console.log('Selected:', location.city)
      }}
    />
  )
}
```

---

## 🧬 Fabric DNA Examples

### Complete Setup

```typescript
import FabricDNA from '@/components/FabricDNA'
import { FabricDNAData } from '@/types/features'

function PieceDetail() {
  const fabricData: FabricDNAData = {
    pieceId: 'jacket-001',
    qrCode: '/qr-codes/jacket-001.png',
    fabricOrigin: {
      location: 'Dhaka',
      country: 'Bangladesh',
      date: new Date('2024-08-01'),
      description: 'Premium denim sourced from local mills',
      coordinates: [23.8103, 90.4125]
    },
    journeySteps: [
      {
        stage: 'Dyeing',
        location: 'Dhaka, Bangladesh',
        description: 'Custom indigo dyeing process',
        date: new Date('2024-08-05')
      },
      {
        stage: 'Construction',
        location: 'Istanbul, Turkey',
        description: 'Hand-stitched jacket assembly',
        date: new Date('2024-08-20')
      }
    ],
    careInstructions: {
      washing: 'Cold water, gentle cycle, turn inside out',
      drying: 'Air dry flat, never in direct sunlight',
      ironing: 'Low heat, steam inside out only',
      storage: 'Fold carefully, store in cool dry place'
    },
    sustainability: {
      score: 85,
      waterUsed: 450,
      carbonFootprint: 8.5,
      certifications: ['Fair Trade', 'Organic Cotton']
    },
    authenticity: {
      serialNumber: 'KT-2024-08-001',
      createdDate: new Date('2024-08-25'),
      verificationUrl: 'https://verify.kobbysthreads.com/KT-2024-08-001',
      verificationCode: 'A7F9K2M5'
    }
  }

  return (
    <FabricDNA
      data={fabricData}
      onShare={() => navigator.share({
        title: 'Fabric DNA',
        text: 'Check the authenticity of this piece!'
      })}
    />
  )
}
```

---

## 👥 Festival Twins Examples

### Festival Matching

```typescript
import FestivalTwins from '@/components/FestivalTwins'
import { MatchedUser } from '@/types/features'

function FestivalTwinsPage() {
  const currentUser = {
    id: 'user-123',
    name: 'Alex',
    upcomingFestivals: [
      { id: 'f1', name: 'Coachella', date: '2025-04', location: 'USA', attendees: 750000 }
    ],
    preferredVibes: ['minimalist', 'sustainable', 'artistic'],
    style: 'Clean aesthetic'
  }

  const matches: MatchedUser[] = [
    {
      id: 'user-456',
      name: 'Jordan',
      location: 'LA, CA',
      festivals: [{ id: 'f1', name: 'Coachella', ... }],
      vibes: ['minimalist', 'sustainable'],
      imageUrl: '/users/jordan.jpg',
      bio: 'Fashion enthusiast and sustainable fashion advocate',
      commonFestivals: [{ id: 'f1', name: 'Coachella', ... }]
    }
  ]

  return (
    <FestivalTwins
      currentUser={currentUser}
      matchedUsers={matches}
      onConnect={(userId) => {
        console.log('Connecting with:', userId)
        // Open chat
      }}
      onJoinGroup={(groupId) => {
        console.log('Joined group:', groupId)
        // Update user state
      }}
    />
  )
}
```

---

## 🌅 Sunset Editions Examples

### Real Sunset Implementation

```typescript
import SunsetEditions from '@/components/SunsetEditions'
import { SunsetPiece } from '@/types/features'
import { getUserTimezone, calculateSunsetTime, getTimeUntilSunset } from '@/utils/features'

// Install suncalc: npm install suncalc
import SunCalc from 'suncalc'

function SunsetPage() {
  const userTimezone = getUserTimezone() // "America/Los_Angeles"
  const now = new Date()

  // Calculate sunset for user's location (example: LA)
  const sunsetTime = SunCalc.getTimes(now, 34.0522, -118.2437).sunset // LA coords
  const timeUntilSunset = getTimeUntilSunset(sunsetTime)

  const availablePieces: SunsetPiece[] = [
    {
      id: 'sunset-001',
      name: 'Golden Hour Jacket',
      description: 'Limited edition denim jacket only available at sunset',
      imageUrl: '/images/jacket-golden.jpg',
      price: 299,
      availableQuantity: 5,
      originStory: 'This jacket represents the perfect moment of the day when light is most beautiful'
    }
  ]

  return (
    <SunsetEditions
      userTimezone={userTimezone}
      sunsetTime={sunsetTime}
      timeUntilSunset={timeUntilSunset}
      isWithinGoldenHour={timeUntilSunset < 60}
      availablePieces={availablePieces}
      onPurchase={(pieceId) => {
        console.log('Purchasing:', pieceId)
        // Process payment
      }}
    />
  )
}
```

---

## 🎙️ Voice of the Thread Examples

### Audio Player Setup

```typescript
import VoiceOfThread from '@/components/VoiceOfThread'
import { AudioTrack } from '@/types/features'

function PieceWithAudio() {
  const voiceStory: AudioTrack = {
    id: 'audio-001',
    title: 'How This Jacket Was Made',
    duration: 245, // seconds
    url: '/audio/jacket-story.mp3',
    transcript: `
      Hello, I'm Koby. This jacket represents a 3-week journey...
      [full transcript here]
    `,
    backgroundSound: 'Workshop ambience and sewing sounds',
    backgroundSoundLocation: 'Istanbul, Turkey'
  }

  const relatedTracks: AudioTrack[] = [
    {
      id: 'audio-002',
      title: 'Fabric Sourcing Story',
      duration: 180,
      url: '/audio/fabric-story.mp3',
      transcript: 'Story about finding the perfect fabric...'
    }
  ]

  return (
    <VoiceOfThread
      pieceId="jacket-001"
      pieceName="Istanbul Jacket"
      voiceStory={voiceStory}
      createdDate={new Date('2024-09-25')}
      creationLocation="Istanbul, Turkey"
      kobyMessage="This piece represents the meeting of tradition and innovation"
      relatedTracks={relatedTracks}
      onDownload={(trackId) => {
        console.log('Downloading:', trackId)
        // Trigger download
      }}
    />
  )
}
```

---

## 📊 Utility Functions Quick Guide

### Features Utilities

```typescript
import {
  // Journey
  getUserTimezone,
  formatLocation,
  areLocationsClose,

  // Sunset
  calculateSunsetTime,
  isWithinGoldenHour,
  getTimeUntilSunset,
  calculateFOMOIntensity,

  // Fabric DNA
  generateSerialNumber,
  calculateSustainabilityScore,
  validateQRCode,

  // Festival
  getCommonFestivals,
  getVibeCompatibility,

  // General
  formatDuration,
  formatDateDisplay,
  copyToClipboard,
  canShare,
  shareData
} from '@/utils/features'

// Usage examples
const timezone = getUserTimezone() // "America/Los_Angeles"
const location = formatLocation('Paris', 'France') // "Paris, France"
const duration = formatDuration(245) // "4:05"
const date = formatDateDisplay(new Date(), 'long') // "October 30, 2024"
const score = calculateSustainabilityScore(450, 8.5, ['Fair Trade'])
const fomo = calculateFOMOIntensity(5, 30, 60) // 0-100
```

---

## 🧪 Testing Checklist

### Mobile Testing
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Test on Android (360-480px)
- [ ] Test touch gestures
- [ ] Test pull-to-refresh
- [ ] Test audio playback
- [ ] Verify 44x44px touch targets

### Desktop Testing
- [ ] Responsive at 1024px+
- [ ] Responsive at 1920px+
- [ ] Mouse hover states
- [ ] Keyboard navigation
- [ ] Tab order correct

### Performance
- [ ] Lighthouse score 90+
- [ ] Images load efficiently
- [ ] Audio streams smoothly
- [ ] Smooth animations
- [ ] No layout shifts

---

## 🔒 Security Checklist

- [ ] No hardcoded API keys
- [ ] All secrets in .env
- [ ] QR codes don't contain sensitive data
- [ ] Audio files CORS enabled
- [ ] HTTPS only in production
- [ ] Input validation on all forms
- [ ] XSS protection enabled

---

## 📦 Dependencies Summary

```bash
# Already included in project
react: ^19.1.1
typescript: ~5.8.3
framer-motion: ^12.23.12
zustand: ^5.0.8
react-router-dom: ^7.8.2
lucide-react: ^0.542.0
tailwindcss: ^4.1.13

# Recommended to add
npm install suncalc              # Sunset calculations
npm install qrcode              # QR code generation
npm install @stripe/react       # Payment (optional)

# Optional
npm install leaflet             # Maps (optional)
npm install react-leaflet       # Maps integration (optional)
```

---

## 🎯 Common Integration Patterns

### Pattern 1: Feature with Store Integration

```typescript
import useStore from '@/stores/useStore'

function MyFeature() {
  const { pieces } = useStore()

  return (
    <div>
      {pieces.map(piece => (
        <ComponentWithFeature key={piece.id} piece={piece} />
      ))}
    </div>
  )
}
```

### Pattern 2: Route with Auth

```typescript
<Route
  path="/journey"
  element={
    <ProtectedRoute>
      <JourneyTracker />
    </ProtectedRoute>
  }
/>
```

### Pattern 3: Feature with Error Boundary

```typescript
<ErrorBoundary>
  <SunsetEditions {...props} />
</ErrorBoundary>
```

---

## 🚀 Deployment Checklist

- [ ] All files copied to project
- [ ] App.tsx updated with routes
- [ ] Navigation.tsx updated with menu items
- [ ] Types imported where needed
- [ ] Utilities available in imports
- [ ] No console errors
- [ ] Mobile tested
- [ ] Desktop tested
- [ ] Lighthouse 90+
- [ ] Security scan passed
- [ ] Environment variables set
- [ ] Deployed to staging
- [ ] Final testing passed
- [ ] Deployed to production

---

## 📞 Support Resources

**Documentation Files**:
- `/FEATURES_SUMMARY.md` - Overview of all features
- `/MOBILE_AND_FEATURES_INTEGRATION.md` - Detailed integration guide
- `/IMPLEMENTATION_CHECKLIST.md` - Step-by-step checklist
- `/QUICK_REFERENCE.md` - This file

**Component Files**:
- `/src/components/MobileOptimization.tsx` - Mobile utilities
- `/src/components/KobysJourneyTracker.tsx` - Journey feature
- `/src/components/FabricDNA.tsx` - Authenticity feature
- `/src/components/FestivalTwins.tsx` - Community feature
- `/src/components/SunsetEditions.tsx` - Limited releases
- `/src/components/VoiceOfThread.tsx` - Audio stories

**Type Definitions**:
- `/src/types/features.ts` - All feature types

**Utilities**:
- `/src/utils/features.ts` - 50+ helper functions

---

**Everything is ready to ship. Good luck! 🚀**
