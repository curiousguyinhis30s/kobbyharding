import { useState, useEffect } from 'react'
import { FestivalTwins } from '../components/FestivalTwins'

interface Festival {
  id: string
  name: string
  date: string
  location: string
  attendees: number
}

interface MatchedUser {
  id: string
  name: string
  location: string
  festivals: Festival[]
  vibes: string[]
  imageUrl: string
  bio: string
  commonFestivals: Festival[]
}

export default function FestivalTwinsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [matchedUsers, setMatchedUsers] = useState<MatchedUser[]>([])

  useEffect(() => {
    // Mock data - in production, fetch from API
    const mockUser = {
      id: 'user-1',
      name: 'You',
      upcomingFestivals: [
        { id: 'f1', name: 'Coachella', date: '2025-04-15', location: 'Indio, CA', attendees: 125000 },
        { id: 'f2', name: 'Outside Lands', date: '2025-08-08', location: 'San Francisco, CA', attendees: 75000 },
        { id: 'f3', name: 'Brooklyn Vegan Festival', date: '2025-05-20', location: 'Brooklyn, NY', attendees: 45000 }
      ],
      preferredVibes: ['minimalist', 'sustainable', 'artistic'],
      style: 'Sustainable fashion advocate'
    }

    const mockMatches: MatchedUser[] = [
      {
        id: 'user-2',
        name: 'Alex',
        location: 'Los Angeles, CA',
        festivals: [
          { id: 'f1', name: 'Coachella', date: '2025-04-15', location: 'Indio, CA', attendees: 125000 },
          { id: 'f4', name: 'Burning Man', date: '2025-08-25', location: 'Nevada Desert', attendees: 70000 }
        ],
        vibes: ['minimalist', 'eco-conscious', 'indie'],
        imageUrl: 'https://via.placeholder.com/200x200?text=Alex',
        bio: 'Fashion blogger exploring sustainable styles. Always looking for unique pieces with stories.',
        commonFestivals: [
          { id: 'f1', name: 'Coachella', date: '2025-04-15', location: 'Indio, CA', attendees: 125000 }
        ]
      },
      {
        id: 'user-3',
        name: 'Jordan',
        location: 'San Francisco, CA',
        festivals: [
          { id: 'f2', name: 'Outside Lands', date: '2025-08-08', location: 'San Francisco, CA', attendees: 75000 },
          { id: 'f5', name: 'Lightning in a Bottle', date: '2025-05-26', location: 'Kern County, CA', attendees: 20000 }
        ],
        vibes: ['artistic', 'sustainable', 'minimalist'],
        imageUrl: 'https://via.placeholder.com/200x200?text=Jordan',
        bio: 'Artist and creative director. Love connecting with people who share values around ethical fashion.',
        commonFestivals: [
          { id: 'f2', name: 'Outside Lands', date: '2025-08-08', location: 'San Francisco, CA', attendees: 75000 }
        ]
      },
      {
        id: 'user-4',
        name: 'Casey',
        location: 'Brooklyn, NY',
        festivals: [
          { id: 'f3', name: 'Brooklyn Vegan Festival', date: '2025-05-20', location: 'Brooklyn, NY', attendees: 45000 },
          { id: 'f6', name: 'Governors Ball', date: '2025-06-07', location: 'New York, NY', attendees: 65000 }
        ],
        vibes: ['sustainable', 'bohemian', 'artistic'],
        imageUrl: 'https://via.placeholder.com/200x200?text=Casey',
        bio: 'NYC-based sustainability enthusiast. Always hunting for ethically-made fashion finds.',
        commonFestivals: [
          { id: 'f3', name: 'Brooklyn Vegan Festival', date: '2025-05-20', location: 'Brooklyn, NY', attendees: 45000 }
        ]
      },
      {
        id: 'user-5',
        name: 'Morgan',
        location: 'Austin, TX',
        festivals: [
          { id: 'f1', name: 'Coachella', date: '2025-04-15', location: 'Indio, CA', attendees: 125000 },
          { id: 'f7', name: 'Austin City Limits', date: '2025-10-04', location: 'Austin, TX', attendees: 75000 }
        ],
        vibes: ['minimalist', 'indie', 'artistic'],
        imageUrl: 'https://via.placeholder.com/200x200?text=Morgan',
        bio: 'Festival regular and style curator. Love finding like-minded people with great taste.',
        commonFestivals: [
          { id: 'f1', name: 'Coachella', date: '2025-04-15', location: 'Indio, CA', attendees: 125000 }
        ]
      }
    ]

    setCurrentUser(mockUser)
    setMatchedUsers(mockMatches)
  }, [])

  const handleConnect = (userId: string) => {
    // Trigger messaging/connection logic
    // TODO: Implement user connection
  }

  const handleJoinGroup = (groupId: string) => {
    // Add user to group
    // TODO: Implement group joining
  }

  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading festival matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#000' }}>
      <FestivalTwins
        currentUser={currentUser}
        matchedUsers={matchedUsers}
        onConnect={handleConnect}
        onJoinGroup={handleJoinGroup}
      />
    </div>
  )
}
