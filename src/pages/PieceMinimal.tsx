import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Ruler, Package } from 'lucide-react'
import useStore from '../stores/useStore'
import { mockPieces } from '../data/mockData'
import { useToast } from '../components/Toast'

const PieceMinimal = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pieces, setPieces, addToCart } = useStore()
  const { addToast } = useToast()
  const [selectedSize, setSelectedSize] = useState('M')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Initialize pieces if empty
  useEffect(() => {
    if (pieces.length === 0) {
      setPieces(mockPieces)
    }
  }, [pieces.length, setPieces])

  const piece = pieces.find(p => p.id === id)
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  useEffect(() => {
    window.scrollTo(0, 0)
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!piece) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            marginBottom: '24px', 
            fontSize: '13px', 
            letterSpacing: '0.2em',
            opacity: 0.5
          }}>
            ITEM NOT FOUND
          </p>
          <button 
            onClick={() => navigate('/collection')}
            style={{
              color: '#fff',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '12px 24px',
              fontSize: '11px',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#fff'
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.background = 'none'
            }}
          >
            BACK TO COLLECTION
          </button>
        </div>
      </div>
    )
  }

  // Mock multiple images for the piece
  const images = [
    piece.imageUrl,
    piece.imageUrl, // Would be different angles in production
    piece.imageUrl,
    piece.imageUrl
  ]

  const handleAddToBag = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(piece.id, selectedSize)
    }
    setAddedToCart(true)
    addToast('success', `${quantity > 1 ? `${quantity}x ` : ''}${piece.name} (Size ${selectedSize}) added to bag`)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const sizeChart = {
    'XS': { chest: '32-34', waist: '24-26', hips: '34-36' },
    'S': { chest: '34-36', waist: '26-28', hips: '36-38' },
    'M': { chest: '36-38', waist: '28-30', hips: '38-40' },
    'L': { chest: '38-40', waist: '30-32', hips: '40-42' },
    'XL': { chest: '40-42', waist: '32-34', hips: '42-44' },
    'XXL': { chest: '42-44', waist: '34-36', hips: '44-46' }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      paddingTop: '64px'
    }}>
      {/* Back Navigation */}
      <div style={{ 
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button 
          onClick={() => navigate('/collection')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.6)',
            background: 'none',
            border: 'none',
            fontSize: '11px',
            letterSpacing: '0.2em',
            cursor: 'pointer',
            transition: 'opacity 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
        >
          <ArrowLeft style={{ width: '14px', height: '14px' }} />
          BACK TO COLLECTION
        </button>
      </div>

      {/* Product Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '0',
        maxWidth: '100%',
        margin: '0',
        minHeight: isMobile ? 'auto' : 'calc(100vh - 128px)'
      }}>
        {/* Left: Images */}
        <div style={{
          position: 'relative',
          background: '#000',
          borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Main Image */}
          <div style={{
            position: isMobile ? 'relative' : 'sticky',
            top: isMobile ? '0' : '128px',
            height: isMobile ? 'auto' : 'calc(100vh - 128px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '20px' : '40px'
          }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
              <img
                src={images[currentImageIndex]}
                alt={piece.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  cursor: 'zoom-in'
                }}
              />
              
              {/* Image Navigation */}
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
              
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
              
              {/* Image Dots */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px'
              }}>
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: index === currentImageIndex ? '#fff' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Details */}
        <div style={{
          padding: isMobile ? '24px 20px' : '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isMobile ? 'flex-start' : 'center'
        }}>
          {/* Product Info */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '100',
              letterSpacing: '0.2em',
              marginBottom: '12px'
            }}>
              {piece.name.toUpperCase()}
            </h1>
            
            <p style={{
              fontSize: '13px',
              opacity: 0.6,
              letterSpacing: '0.1em',
              marginBottom: '24px'
            }}>
              {piece.vibe}
            </p>
            
            <div style={{
              fontSize: '20px',
              fontWeight: '200',
              letterSpacing: '0.05em',
              marginBottom: '32px'
            }}>
              ${piece.price}
            </div>

            {/* Stock Status */}
            {!piece.available && (
              <div style={{
                padding: '8px 16px',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'inline-block',
                fontSize: '11px',
                letterSpacing: '0.15em',
                marginBottom: '32px'
              }}>
                SOLD OUT
              </div>
            )}
          </div>

          {/* Size Selection */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <label style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                opacity: 0.7
              }}>
                SELECT SIZE
              </label>
              <button
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
              >
                <Ruler style={{ width: '12px', height: '12px' }} />
                SIZE GUIDE
              </button>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
              gap: '1px',
              background: 'rgba(255,255,255,0.1)'
            }}>
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '16px',
                    fontSize: '12px',
                    fontWeight: '300',
                    letterSpacing: '0.1em',
                    border: 'none',
                    background: selectedSize === size ? 'rgba(255,255,255,0.1)' : '#000',
                    color: selectedSize === size ? '#fff' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSize !== size) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSize !== size) {
                      e.currentTarget.style.background = '#000'
                    }
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Size Guide */}
          <AnimatePresence>
            {showSizeGuide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{
                  marginBottom: '32px',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  padding: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '11px',
                  letterSpacing: '0.1em'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>SIZE</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>CHEST</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>WAIST</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>HIPS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(sizeChart).map(([size, measurements]) => (
                        <tr key={size}>
                          <td style={{ padding: '8px', opacity: 0.8 }}>{size}</td>
                          <td style={{ padding: '8px', opacity: 0.6 }}>{measurements.chest}"</td>
                          <td style={{ padding: '8px', opacity: 0.6 }}>{measurements.waist}"</td>
                          <td style={{ padding: '8px', opacity: 0.6 }}>{measurements.hips}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quantity */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              opacity: 0.7,
              display: 'block',
              marginBottom: '16px'
            }}>
              QUANTITY
            </label>
            
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1px',
              background: 'rgba(255,255,255,0.1)',
              width: 'fit-content'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  padding: '12px 20px',
                  background: '#000',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
              >
                −
              </button>
              
              <div style={{
                padding: '12px 32px',
                background: '#000',
                fontSize: '14px',
                minWidth: '80px',
                textAlign: 'center'
              }}>
                {quantity}
              </div>
              
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                style={{
                  padding: '12px 20px',
                  background: '#000',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToBag}
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '12px',
              fontWeight: '300',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              background: addedToCart ? 'transparent' : 'transparent',
              color: '#fff',
              border: addedToCart ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => {
              if (!addedToCart) {
                e.currentTarget.style.borderColor = '#fff'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }
            }}
            onMouseLeave={(e) => {
              if (!addedToCart) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <ShoppingBag style={{ width: '16px', height: '16px' }} />
            {addedToCart ? 'ADDED TO BAG' : 'ADD TO BAG'}
          </motion.button>

          {/* Quick Checkout */}
          <button
            onClick={() => {
              handleAddToBag()
              setTimeout(() => navigate('/cart'), 500)
            }}
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '12px',
              fontWeight: '300',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              background: '#fff',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            BUY NOW
          </button>

          {/* Shipping Info */}
          <div style={{
            marginTop: '40px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '11px',
            letterSpacing: '0.1em'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Package style={{ width: '14px', height: '14px', opacity: 0.6 }} />
              <span style={{ opacity: 0.8 }}>FREE SHIPPING ON ORDERS OVER $200</span>
            </div>
            <div style={{ opacity: 0.6, paddingLeft: '26px' }}>
              Estimated delivery: 3-5 business days
            </div>
          </div>

          {/* Product Details */}
          <div style={{
            marginTop: '40px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h3 style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              marginBottom: '16px',
              opacity: 0.7
            }}>
              DETAILS
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              fontSize: '12px',
              lineHeight: '2',
              opacity: 0.6
            }}>
              <li>• Handcrafted in limited quantities</li>
              <li>• African-inspired contemporary design</li>
              <li>• Premium sustainable materials</li>
              <li>• Perfect for Kizomba & Urban Kiz festivals</li>
              <li>• Designed by Koby Harding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PieceMinimal