import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Package, Star, Clock, ChevronRight, Heart } from 'lucide-react'
import useStore from '../stores/useStore'

const FestivalHub = () => {
  const { pieces, addToCart, toggleFavorite, isFavorite } = useStore()

  // Festival pickup locations
  const festivals = [
    {
      id: 'bangkok-kiz',
      name: 'Bangkok Kizomba Festival',
      date: 'Dec 15-18, 2024',
      location: 'Bangkok, Thailand',
      available: true,
      pieces: 12,
      special: 'Exclusive sunset pieces available'
    },
    {
      id: 'singapore-latin',
      name: 'Singapore Latin Festival',
      date: 'Jan 20-23, 2025',
      location: 'Singapore',
      available: true,
      pieces: 8,
      special: 'Limited edition prints'
    },
    {
      id: 'bali-dance',
      name: 'Bali Dance Week',
      date: 'Feb 10-14, 2025',
      location: 'Bali, Indonesia',
      available: false,
      pieces: 15,
      special: 'Coming soon'
    }
  ]

  // Featured festival pieces
  const festivalPieces = pieces.filter(p =>
    p.name.toLowerCase().includes('festival') ||
    p.vibe.toLowerCase().includes('free') ||
    p.story.toLowerCase().includes('festival')
  ).slice(0, 4)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      padding: '80px 24px 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '48px' }}
        >
          <h1 style={{
            fontSize: '48px',
            fontWeight: '300',
            letterSpacing: '-0.02em',
            marginBottom: '16px'
          }}>
            Festival Pickup
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: '1.6'
          }}>
            Try on exclusive pieces at festivals • Limited festival editions
          </p>
        </motion.div>

        {/* Festival Locations */}
        <div style={{
          display: 'grid',
          gap: '24px',
          marginBottom: '64px'
        }}>
          {festivals.map((festival, index) => (
            <motion.div
              key={festival.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: festival.available ? 'pointer' : 'default',
                opacity: festival.available ? 1 : 0.5,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (festival.available) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '400',
                  marginBottom: '12px'
                }}>
                  {festival.name}
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} />
                    {festival.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} />
                    {festival.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={14} />
                    {festival.pieces} exclusive pieces
                  </div>
                </div>
                {festival.special && (
                  <div style={{
                    display: 'inline-block',
                    marginTop: '12px',
                    padding: '4px 12px',
                    background: festival.available ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${festival.available ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: festival.available ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.4)'
                  }}>
                    <Star size={12} style={{ marginRight: '4px', display: 'inline' }} />
                    {festival.special}
                  </div>
                )}
              </div>
              <ChevronRight
                size={20}
                style={{
                  opacity: festival.available ? 0.6 : 0.2
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Featured Festival Pieces */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: '300',
            marginBottom: '32px',
            letterSpacing: '0.05em'
          }}>
            FESTIVAL FAVORITES
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {festivalPieces.map((piece) => (
              <motion.div
                key={piece.id}
                whileHover={{ y: -4 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  position: 'relative',
                  paddingBottom: '125%',
                  background: `url(${piece.imageUrl}) center/cover`
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(piece.id)
                    }}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: 'none',
                      borderRadius: '50%',
                      padding: '8px',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Heart
                      size={16}
                      fill={isFavorite(piece.id) ? '#fff' : 'none'}
                      color="#fff"
                    />
                  </button>
                </div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '400',
                    marginBottom: '8px'
                  }}>
                    {piece.name}
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '12px'
                  }}>
                    {piece.vibe}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '16px' }}>${piece.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(piece.id, 'M')
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        padding: '6px 16px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '80px',
            padding: '32px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            textAlign: 'center'
          }}
        >
          <Clock size={24} style={{ marginBottom: '16px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '400' }}>
            How Festival Pickup Works
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Reserve your pieces online • Try them on at the festival • Pay only for what you love
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default FestivalHub
