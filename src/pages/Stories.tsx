import { VoiceOfThread } from '../components/VoiceOfThread'
import useStore from '../stores/useStore'

export default function StoriesPage() {
  const { pieces } = useStore()

  // Get first piece or demo data
  const firstPiece = pieces[0]

  if (!firstPiece) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#000',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>No pieces available</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Start exploring to discover voice stories</p>
        </div>
      </div>
    )
  }

  const demoTrack = {
    id: firstPiece.id,
    title: `${firstPiece.name} - Voice Story`,
    duration: 180,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    transcript: `"This piece represents the essence of sustainability and craftsmanship. Every thread tells a story of dedication and passion. We've worked with artisans from around the world to bring you something truly special. The fabric comes from sustainable sources, and every stitch is made with intention. Wear this piece knowing that you're supporting a global community of creators who believe in quality and ethics."`,
    backgroundSound: 'Ambient studio recordings',
    backgroundSoundLocation: 'Brooklyn, NY'
  }

  const relatedTracks = [
    {
      id: 'story-2',
      title: 'Fabric Origins',
      duration: 120,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      transcript: 'Information about fabric sourcing and origin stories'
    },
    {
      id: 'story-3',
      title: 'Craft Process',
      duration: 150,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      transcript: 'Behind the scenes of our crafting process'
    }
  ]

  return (
    <div style={{ background: '#000' }}>
      <VoiceOfThread
        pieceId={firstPiece.id}
        pieceName={firstPiece.name}
        voiceStory={demoTrack}
        createdDate={new Date()}
        creationLocation="Brooklyn, NY"
        kobyMessage={`This ${firstPiece.name} is special to me. I wanted to create something that speaks to your values.`}
        relatedTracks={relatedTracks}
        onDownload={(trackId) => {
          // TODO: Implement track download
        }}
      />
    </div>
  )
}
