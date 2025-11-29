import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag, Plus, Minus } from 'lucide-react'
import useStore from '../stores/useStore'
import { useToast } from './Toast'

interface ProductQuickViewProps {
  piece: {
    id: string
    name: string
    price: number
    imageUrl: string
    story: string
    vibe: string
    fabricOrigin: string
    denimType: string
  }
  isOpen: boolean
  onClose: () => void
}

const ProductQuickView = ({ piece, isOpen, onClose }: ProductQuickViewProps) => {
  const { addToCart, favorites, toggleFavorite } = useStore()
  const { addToast } = useToast()
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const isFavorite = favorites.includes(piece.id)

  const handleAddToCart = () => {
    // Add items to cart based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(piece.id, selectedSize)
    }
    addToast(
      'success',
      `${piece.name} (${selectedSize}) x${quantity} added to cart!`
    )
    onClose()
  }

  const handleToggleFavorite = () => {
    toggleFavorite(piece.id)
    addToast(
      'info',
      isFavorite
        ? `${piece.name} removed from favorites`
        : `${piece.name} added to favorites`
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: window.innerWidth > 768 ? 'row' : 'column'
              }}
            >
              {/* Image Section */}
              <div style={{
                flex: window.innerWidth > 768 ? '1' : 'none',
                background: '#1a1a1a',
                position: 'relative',
                minHeight: window.innerWidth > 768 ? 'auto' : '300px'
              }}>
                <img
                  src={piece.imageUrl}
                  alt={piece.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Content Section */}
              <div style={{
                flex: '1',
                padding: '32px',
                overflowY: 'auto',
                position: 'relative'
              }}>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                >
                  <X size={20} />
                </button>

                {/* Product Info */}
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '300',
                  letterSpacing: '0.05em',
                  color: '#fff',
                  marginBottom: '8px'
                }}>
                  {piece.name}
                </h2>

                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontStyle: 'italic',
                  marginBottom: '16px'
                }}>
                  {piece.vibe}
                </p>

                <div style={{
                  fontSize: '32px',
                  fontWeight: '300',
                  color: '#fff',
                  marginBottom: '24px'
                }}>
                  ${piece.price}
                </div>

                {/* Story */}
                <div style={{
                  marginBottom: '24px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '0.05em',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '8px'
                  }}>
                    THE STORY
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    {piece.story}
                  </p>
                </div>

                {/* Fabric Info */}
                <div style={{
                  marginBottom: '24px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Fabric Origin:
                    </span>
                    <div style={{
                      fontSize: '14px',
                      color: '#fff',
                      marginTop: '4px'
                    }}>
                      {piece.fabricOrigin}
                    </div>
                  </div>
                  <div>
                    <span style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Denim Type:
                    </span>
                    <div style={{
                      fontSize: '14px',
                      color: '#fff',
                      marginTop: '4px'
                    }}>
                      {piece.denimType}
                    </div>
                  </div>
                </div>

                {/* Size Selector */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Select Size
                  </label>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '12px 20px',
                          background: selectedSize === size ? '#fff' : 'transparent',
                          color: selectedSize === size ? '#000' : '#fff',
                          border: `1px solid ${selectedSize === size ? '#fff' : 'rgba(255, 255, 255, 0.2)'}`,
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          minWidth: '50px'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Quantity
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#fff',
                      minWidth: '30px',
                      textAlign: 'center'
                    }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '12px'
                }}>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1,
                      padding: '16px 24px',
                      background: 'linear-gradient(135deg, #F97316 0%, #ea580c 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '0.02em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    style={{
                      width: '54px',
                      height: '54px',
                      background: isFavorite ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${isFavorite ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      color: isFavorite ? '#ef4444' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProductQuickView
