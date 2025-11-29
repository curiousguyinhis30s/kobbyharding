import { useState, useEffect } from 'react'
import type { CityStop } from '../types/features'
import KobysJourneyTracker from '../components/KobysJourneyTracker'

// Example page wrapper for Koby's Journey Tracker
const JourneyTrackerPage = () => {
  const [currentLocation, setCurrentLocation] = useState<CityStop | null>(null)
  const [upcomingStops, setUpcomingStops] = useState<CityStop[]>([])
  const [pastStops, setPastStops] = useState<CityStop[]>([])
  const [selectedLocation, setSelectedLocation] = useState<CityStop | null>(null)

  useEffect(() => {
    // In production, fetch from your API/database
    // Example data structure:
    const mockData = {
      pastStops: [
        {
          city: 'Dhaka',
          country: 'Bangladesh',
          arrivalDate: new Date('2024-08-01'),
          departureDate: new Date('2024-08-20'),
          piecesAvailable: 45,
          totalWeight: 250,
          message: 'Started our journey in the heart of textile country',
          latitude: 23.8103,
          longitude: 90.4125,
          stories: [
            {
              id: 'story-1',
              imageUrl: 'https://via.placeholder.com/400x300?text=Dhaka+Workshop',
              caption: 'Where it all began - our textile workshop',
              date: new Date('2024-08-05')
            }
          ]
        }
      ],
      currentLocation: {
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
            id: 'story-2',
            imageUrl: 'https://via.placeholder.com/400x300?text=Istanbul+Markets',
            caption: 'Exploring the Grand Bazaar for color inspiration',
            date: new Date('2024-09-10')
          }
        ]
      },
      upcomingStops: [
        {
          city: 'Paris',
          country: 'France',
          arrivalDate: new Date('2024-10-15'),
          departureDate: new Date('2024-11-05'),
          piecesAvailable: 28,
          totalWeight: 160,
          message: 'Bringing Kobby\'s vision to the fashion capital',
          latitude: 48.8566,
          longitude: 2.3522
        },
        {
          city: 'New York',
          country: 'United States',
          arrivalDate: new Date('2024-11-20'),
          departureDate: new Date('2024-12-15'),
          piecesAvailable: 35,
          totalWeight: 200,
          message: 'Taking Kobby\'s Threads to the biggest stage',
          latitude: 40.7128,
          longitude: -74.006
        },
        {
          city: 'Tokyo',
          country: 'Japan',
          arrivalDate: new Date('2025-01-10'),
          piecesAvailable: 30,
          totalWeight: 170,
          message: 'Merging global craftsmanship with Japanese aesthetics',
          latitude: 35.6762,
          longitude: 139.6503
        }
      ]
    }

    setPastStops(mockData.pastStops)
    setCurrentLocation(mockData.currentLocation)
    setUpcomingStops(mockData.upcomingStops)
    setSelectedLocation(mockData.currentLocation)
  }, [])

  const handleLocationSelect = (location: CityStop) => {
    setSelectedLocation(location)
  }

  if (!currentLocation) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading journey data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <KobysJourneyTracker
        currentLocation={currentLocation}
        upcomingStops={upcomingStops}
        pastStops={pastStops}
        onLocationSelect={handleLocationSelect}
      />

      {/* Optional: Additional details section */}
      {selectedLocation && (
        <div className="px-4 md:px-8 py-8 border-t border-white/10">
          <h3 className="text-2xl font-light mb-4">About {selectedLocation.city}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-light mb-3">Quick Facts</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Population: ~10+ million</li>
                <li>• Known for: Textiles & craftsmanship</li>
                <li>• Climate: Tropical</li>
                <li>• Local craft: Hand-weaving traditions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-light mb-3">Why We're Here</h4>
              <p className="text-sm text-gray-400">
                This location represents a critical point in our supply chain,
                where we partner with local artisans to craft pieces that honor
                traditional techniques while embracing modern design.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JourneyTrackerPage
