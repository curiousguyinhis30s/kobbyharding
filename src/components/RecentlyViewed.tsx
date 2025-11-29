import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import useStore from '../stores/useStore'

interface RecentlyViewedProps {
  isMobile?: boolean
  maxItems?: number
  showClearButton?: boolean
}

const RecentlyViewed = ({
  isMobile = false,
  maxItems = 6,
  showClearButton = true
}: RecentlyViewedProps) => {
  const navigate = useNavigate()
  const { recentlyViewed, pieces, clearRecentlyViewed } = useStore()

  // Get recently viewed pieces (up to maxItems)
  const recentlyViewedPieces = pieces
    .filter(p => recentlyViewed.includes(p.id))
    .slice(0, maxItems)

  // Don't render if no recently viewed items
  if (recentlyViewedPieces.length === 0) {
    return null
  }

  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: isMobile ? '24px 20px' : '32px 24px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '12px',
          fontWeight: '100',
          letterSpacing: '0.3em',
          color: 'rgba(255,255,255,0.8)'
        }}>
          RECENTLY VIEWED
        </h2>

        {showClearButton && (
          <button
            onClick={() => clearRecentlyViewed()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
            }}
          >
            <X style={{ width: '12px', height: '12px' }} />
            CLEAR ALL
          </button>
        )}
      </div>

      <div
        style={{
          display: isMobile ? 'flex' : 'grid',
          gridTemplateColumns: isMobile ? undefined : 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: isMobile ? '16px' : '24px',
          overflowX: isMobile ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: isMobile ? '8px' : '0'
        }}
        className="recently-viewed-scroll"
      >
        <style>{`
          .recently-viewed-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {recentlyViewedPieces.map((piece, index) => (
          <motion.div
            key={piece.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/piece/${piece.id}`)}
            style={{
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'border-color 0.3s',
              minWidth: isMobile ? '150px' : 'auto',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <div style={{
              aspectRatio: '1',
              overflow: 'hidden'
            }}>
              <img
                src={piece.imageUrl}
                alt={piece.name}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s'
                }}
              />
            </div>
            <div style={{
              padding: isMobile ? '12px' : '16px',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: '300',
                letterSpacing: '0.15em',
                marginBottom: '8px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {piece.name}
              </h3>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '200' }}>
                  ${piece.price}
                </div>
                {!piece.available && (
                  <div style={{
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.5)',
                    opacity: 0.7
                  }}>
                    SOLD OUT
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default RecentlyViewed
