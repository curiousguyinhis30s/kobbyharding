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

  // Get recently viewed pieces maintaining order
  const recentlyViewedPieces = recentlyViewed
    .map(id => pieces.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, maxItems)

  if (recentlyViewedPieces.length === 0) {
    return null
  }

  return (
    <div style={{
      borderTop: '1px solid var(--border-primary)',
      padding: isMobile ? '20px 16px' : '32px 24px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? '16px' : '24px'
      }}>
        <h2 style={{
          fontSize: '10px',
          fontWeight: '400',
          letterSpacing: '0.2em',
          color: 'var(--text-muted)'
        }}>
          RECENTLY VIEWED
        </h2>

        {showClearButton && (
          <button
            onClick={() => clearRecentlyViewed()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '9px',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X style={{ width: '10px', height: '10px' }} />
            CLEAR
          </button>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: isMobile ? '12px' : '16px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '4px',
          margin: '0 -4px',
          padding: '0 4px'
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
            key={piece!.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/piece/${piece!.id}`)}
            style={{
              cursor: 'pointer',
              flexShrink: 0,
              width: isMobile ? '100px' : '120px'
            }}
          >
            {/* Square image container */}
            <div style={{
              width: isMobile ? '100px' : '120px',
              height: isMobile ? '100px' : '120px',
              overflow: 'hidden',
              background: 'var(--bg-tertiary)',
              borderRadius: '2px',
              marginBottom: '8px'
            }}>
              <motion.img
                src={piece!.imageUrl}
                alt={piece!.name}
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top'
                }}
              />
            </div>
            {/* Minimal text below */}
            <p style={{
              fontSize: '10px',
              fontWeight: '300',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: '2px'
            }}>
              {piece!.name}
            </p>
            <p style={{
              fontSize: '10px',
              fontWeight: '400',
              color: 'var(--text-primary)'
            }}>
              ${piece!.price}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default RecentlyViewed
