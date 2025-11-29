import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react'
import { useState } from 'react'
import useStore from '../stores/useStore'

interface EnhancedProductCardProps {
  piece: {
    id: string
    name: string
    price: number
    imageUrl: string
    vibe: string
    available?: boolean
    isNew?: boolean
    onSale?: boolean
    limited?: boolean
  }
  onQuickView: () => void
}

const EnhancedProductCard = ({ piece, onQuickView }: EnhancedProductCardProps) => {
  const { addToCart, favorites, toggleFavorite } = useStore()
  const [isHovered, setIsHovered] = useState(false)
  const isFavorite = favorites.includes(piece.id)

  return (
    <motion.article
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      role="article"
      aria-label={`Product: ${piece.name}, ${piece.vibe}, $${piece.price}`}
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
    >
      {/* Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {piece.isNew && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            style={{
              background: 'linear-gradient(135deg, #F97316, #ea580c)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={12} />
            NEW
          </motion.div>
        )}
        {piece.limited && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(239, 68, 68, 0.9)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            LIMITED
          </motion.div>
        )}
        {piece.onSale && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(16, 185, 129, 0.9)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            SALE
          </motion.div>
        )}
      </div>

      {/* Image Container */}
      <div style={{
        position: 'relative',
        paddingBottom: '125%',
        background: '#1a1a1a',
        overflow: 'hidden'
      }}>
        <motion.img
          src={piece.imageUrl}
          alt={piece.name}
          loading="lazy"
          animate={{
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            aspectRatio: '4/5'
          }}
        />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            display: 'flex',
            gap: '8px'
          }}
        >
          {/* Quick View */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onQuickView()
            }}
            aria-label={`Quick view ${piece.name}`}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F97316, #ea580c)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
              transition: 'all 0.2s'
            }}
            title="Quick View"
          >
            <Eye size={20} aria-hidden="true" />
          </button>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(piece.id)
            }}
            aria-label={isFavorite ? `Remove ${piece.name} from favorites` : `Add ${piece.name} to favorites`}
            aria-pressed={isFavorite}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: isFavorite ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              color: isFavorite ? '#fff' : '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={20} fill={isFavorite ? '#fff' : 'none'} />
          </button>

          {/* Add to Cart */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              addToCart(piece.id, 'M')
            }}
            aria-label={`Add ${piece.name} to cart`}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Add to cart"
          >
            <ShoppingBag size={20} aria-hidden="true" />
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div style={{ padding: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '400',
          color: '#fff',
          marginBottom: '4px',
          letterSpacing: '0.02em'
        }}>
          {piece.name}
        </h3>

        <p style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontStyle: 'italic',
          marginBottom: '12px'
        }}>
          {piece.vibe}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '300',
            color: '#fff'
          }}>
            ${piece.price}
          </div>

          {piece.available !== false && (
            <div style={{
              fontSize: '11px',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981'
              }} />
              IN STOCK
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default EnhancedProductCard
