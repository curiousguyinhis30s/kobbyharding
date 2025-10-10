import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Heart, X } from 'lucide-react'
import useStore from '../stores/useStore'
import { useToast } from '../components/Toast'
import { EmptySearch } from '../components/EmptyStates'

const FavoritesMinimal = () => {
  const navigate = useNavigate()
  const { pieces, favorites, toggleFavorite, addToCart } = useStore()
  const { addToast } = useToast()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const favoritePieces = pieces.filter(p => favorites.includes(p.id))

  useEffect(() => {
    window.scrollTo(0, 0)
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleRemoveFavorite = (e: React.MouseEvent, pieceId: string) => {
    e.stopPropagation()
    toggleFavorite(pieceId)
    addToast('success', 'Removed from favorites')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.02,
        pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Header */}
      <div style={{
        backgroundColor: '#000',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '15px' : '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: isMobile ? '10px' : '12px'
          }}>
            <h1 style={{
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '100',
              letterSpacing: isMobile ? '0.3em' : '0.4em',
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Heart style={{ width: '16px', height: '16px', fill: '#fff' }} />
              MY FAVORITES
            </h1>
            <div style={{
              fontSize: '11px',
              opacity: 0.5,
              letterSpacing: '0.1em'
            }}>
              {favoritePieces.length} ITEM{favoritePieces.length !== 1 ? 'S' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '20px 15px' : '40px 20px'
      }}>
        {favoritePieces.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <Heart style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 24px',
              opacity: 0.2
            }} />
            <p style={{
              fontSize: '13px',
              letterSpacing: '0.2em',
              opacity: 0.5,
              marginBottom: '24px'
            }}>
              NO FAVORITES YET
            </p>
            <button
              onClick={() => navigate('/collection')}
              style={{
                padding: '12px 32px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                fontSize: '11px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fff'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              EXPLORE COLLECTION
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: isMobile ? '10px' : '20px',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fill, minmax(250px, 1fr))'
          }}>
            {favoritePieces.map((piece, index) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  position: 'relative',
                  background: '#000',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={() => setHoveredItem(piece.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => navigate(`/piece/${piece.id}`)}
              >
                {/* Image */}
                <div style={{
                  aspectRatio: '1',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img
                    src={piece.imageUrl}
                    alt={piece.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'all 0.5s ease',
                      transform: hoveredItem === piece.id ? 'scale(1.05)' : 'scale(1)',
                      filter: hoveredItem === piece.id ? 'brightness(0.8)' : 'brightness(1)'
                    }}
                  />

                  {/* Remove button */}
                  <button
                    onClick={(e) => handleRemoveFavorite(e, piece.id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '8px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      opacity: hoveredItem === piece.id ? 1 : 0
                    }}
                  >
                    <X style={{ width: '16px', height: '16px', stroke: '#fff' }} />
                  </button>

                  {/* Overlay on hover */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    opacity: hoveredItem === piece.id ? 1 : 0,
                    transition: 'opacity 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(piece.id, 'M')
                        addToast('success', `${piece.name} added to cart`)
                      }}
                      style={{
                        padding: '12px 32px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        color: '#fff',
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        opacity: hoveredItem === piece.id ? 1 : 0
                      }}
                    >
                      QUICK ADD
                    </motion.button>
                  </div>
                </div>

                {/* Product Info */}
                <div style={{
                  padding: isMobile ? '12px' : '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '11px',
                    fontWeight: '300',
                    letterSpacing: '0.15em',
                    marginBottom: isMobile ? '4px' : '8px',
                    opacity: 0.9,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {piece.name}
                  </h3>

                  {!isMobile && (
                    <p style={{
                      fontSize: '11px',
                      opacity: 0.5,
                      letterSpacing: '0.1em',
                      marginBottom: '12px'
                    }}>
                      {piece.vibe}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: isMobile ? '12px' : '13px',
                      fontWeight: '200',
                      letterSpacing: '0.05em'
                    }}>
                      ${piece.price}
                    </span>

                    {!piece.available && (
                      <span style={{
                        fontSize: '10px',
                        letterSpacing: '0.15em',
                        opacity: 0.5
                      }}>
                        OUT OF STOCK
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesMinimal
