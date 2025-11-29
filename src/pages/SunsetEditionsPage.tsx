import { useState, useEffect } from 'react'
import { SunsetEditions } from '../components/SunsetEditions'
import useStore from '../stores/useStore'

interface SunsetPiece {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  availableQuantity: number
  originStory: string
}

export default function SunsetEditionsPage() {
  const { pieces } = useStore()
  const [userTimezone, setUserTimezone] = useState('America/New_York')
  const [sunsetTime, setSunsetTime] = useState<Date>(new Date())
  const [timeUntilSunset, setTimeUntilSunset] = useState(120)
  const [isWithinGoldenHour, setIsWithinGoldenHour] = useState(false)
  const [availablePieces, setAvailablePieces] = useState<SunsetPiece[]>([])

  useEffect(() => {
    // Calculate sunset time for user's timezone
    const now = new Date()
    // Mock sunset time - 2 hours from now
    const mockSunset = new Date(now.getTime() + 120 * 60000)
    setSunsetTime(mockSunset)

    // Simulate countdown
    const interval = setInterval(() => {
      setTimeUntilSunset(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Check if we're within golden hour (timeUntilSunset is between 60 and 120 minutes)
    const withinGoldenHour = timeUntilSunset > 60 && timeUntilSunset < 120
    setIsWithinGoldenHour(withinGoldenHour)

    // Select pieces from collection for sunset edition
    if (pieces.length > 0) {
      const sunsetPieces: SunsetPiece[] = pieces.slice(0, 3).map((piece, index) => ({
        id: piece.id,
        name: `${piece.name} - Sunset Edition`,
        description: piece.vibe || 'Exclusive sunset edition piece',
        imageUrl: piece.image || 'https://via.placeholder.com/400x300?text=Sunset+Edition',
        price: piece.price,
        availableQuantity: Math.max(1, 5 - index),
        originStory: `This exclusive sunset edition of ${piece.name} is only available during the golden hour. Crafted with intention and released at the most magical time of day.`
      }))
      setAvailablePieces(sunsetPieces)
    }
  }, [pieces, timeUntilSunset])

  const handlePurchase = (pieceId: string) => {
    // Trigger purchase flow for sunset piece
    // TODO: Implement purchase flow
  }

  return (
    <div style={{ background: '#000' }}>
      <SunsetEditions
        userTimezone={userTimezone}
        sunsetTime={sunsetTime}
        timeUntilSunset={timeUntilSunset}
        isWithinGoldenHour={isWithinGoldenHour}
        availablePieces={availablePieces}
        onPurchase={handlePurchase}
      />
    </div>
  )
}
