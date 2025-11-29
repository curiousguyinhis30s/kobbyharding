import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Ruler, Package, Bell, Heart } from 'lucide-react'
import useStore from '../stores/useStore'
import { mockPieces } from '../data/mockData'
import { useToast } from '../components/Toast'
import ProductReviews from '../components/ProductReviews'
import SizeGuide from '../components/SizeGuide'
import Breadcrumb from '../components/Breadcrumb'
import SEO from '../components/SEO'
import { generateProductSEO } from '../constants/seo'
import NotifyMeModal from '../components/NotifyMeModal'
import ShareButtons from '../components/ShareButtons'
import { useWaitlistStore } from '../stores/useWaitlistStore'

const PieceMinimal = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pieces, setPieces, addToCart, addToRecentlyViewed, recentlyViewed, toggleFavorite, isFavorite } = useStore()
  const { addToast } = useToast()
  const [selectedSize, setSelectedSize] = useState('M')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const { isEmailOnWaitlist } = useWaitlistStore()

  // Initialize pieces if empty
  useEffect(() => {
    if (pieces.length === 0) {
      setPieces(mockPieces)
    }
  }, [pieces.length, setPieces])

  const piece = pieces.find(p => p.id === id)
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  // Track recently viewed
  useEffect(() => {
    if (piece) {
      addToRecentlyViewed(piece.id)
    }
  }, [piece, addToRecentlyViewed])

  // Get recently viewed pieces (excluding current one)
  const recentlyViewedPieces = pieces.filter(p =>
    recentlyViewed.includes(p.id) && p.id !== id
  ).slice(0, 4)

  // Get related products (same category, excluding current piece)
  const relatedProducts = piece
    ? pieces.filter(p => p.category === piece.category && p.id !== piece.id).slice(0, 4)
    : []

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [id])

  useEffect(() => {
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

  // Generate product-specific SEO
  const productSEO = piece ? generateProductSEO(piece) : null

  return (
    <>
      {piece && productSEO && (
        <SEO
          title={productSEO.title}
          description={productSEO.description}
          keywords={productSEO.keywords}
          image={productSEO.image}
          url={`/piece/${piece.id}`}
          type="product"
          product={{
            price: productSEO.product.price,
            currency: productSEO.product.currency,
            availability: piece.available ? 'in stock' : 'out of stock',
            category: productSEO.product.category,
          }}
        />
      )}
      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        paddingTop: '64px'
      }}>
        {/* Back Navigation */}
      <div style={{
        padding: isMobile ? '16px' : '20px 40px',
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
                loading="lazy"
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
          padding: isMobile ? '16px' : '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isMobile ? 'flex-start' : 'center'
        }}>
          {/* Product Info */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '8px'
            }}>
              <h1 style={{
                fontSize: '18px',
                fontWeight: '100',
                letterSpacing: '0.2em',
                margin: 0
              }}>
                {piece.name.toUpperCase()}
              </h1>

              <button
                onClick={() => {
                  toggleFavorite(piece.id)
                  addToast(
                    isFavorite(piece.id) ? 'info' : 'success',
                    isFavorite(piece.id) ? 'Removed from favorites' : 'Added to favorites'
                  )
                }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  padding: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                }}
              >
                <Heart
                  size={18}
                  fill={isFavorite(piece.id) ? '#fff' : 'none'}
                  color="#fff"
                />
              </button>
            </div>

            <p style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.1em',
              marginBottom: '12px'
            }}>
              {piece.vibe}
            </p>

            <div style={{
              fontSize: '16px',
              fontWeight: '200',
              letterSpacing: '0.05em',
              marginBottom: '16px'
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
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <label style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.8)'
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
              gap: '8px'
            }}>
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '12px 8px',
                    fontSize: '11px',
                    fontWeight: '300',
                    letterSpacing: '0.1em',
                    border: selectedSize === size ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    background: selectedSize === size ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: selectedSize === size ? '#fff' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSize !== size) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSize !== size) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Size Guide Modal */}
          <SizeGuide
            isOpen={showSizeGuide}
            onClose={() => setShowSizeGuide(false)}
            isMobile={isMobile}
          />

          {/* Notify Me Modal */}
          <NotifyMeModal
            isOpen={showNotifyModal}
            onClose={() => setShowNotifyModal(false)}
            productId={piece.id}
            productName={piece.name}
            isMobile={isMobile}
          />

          {/* Quantity */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.8)',
              display: 'block',
              marginBottom: '12px'
            }}>
              QUANTITY
            </label>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: 'fit-content'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  minWidth: '44px',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                }}
              >
                −
              </button>

              <div style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
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
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  minWidth: '44px',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button or Notify Me Button */}
          {piece.available ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAddToBag}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '11px',
                fontWeight: '300',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                background: addedToCart ? 'transparent' : 'transparent',
                color: '#fff',
                border: addedToCart ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                if (!addedToCart) {
                  e.currentTarget.style.borderColor = '#fff'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!addedToCart) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <ShoppingBag style={{ width: '16px', height: '16px' }} />
              {addedToCart ? 'ADDED TO BAG' : 'ADD TO BAG'}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowNotifyModal(true)}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '11px',
                fontWeight: '300',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fff'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Bell style={{ width: '16px', height: '16px' }} />
              NOTIFY WHEN AVAILABLE
            </motion.button>
          )}

          {/* Quick Checkout */}
          {piece.available && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                handleAddToBag()
                setTimeout(() => navigate('/cart'), 500)
              }}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '11px',
                fontWeight: '400',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                background: '#fff',
                color: '#000',
                border: '1px solid #fff',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.9)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff'
              }}
            >
              BUY NOW
            </motion.button>
          )}

          {/* Shipping Info */}
          <div style={{
            marginTop: '16px',
            padding: '10px',
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

          {/* Share This Piece */}
          <div style={{ marginTop: '32px' }}>
            <h3 style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              marginBottom: '16px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              SHARE THIS PIECE
            </h3>
            <ShareButtons
              url={`/piece/${piece.id}`}
              title={piece.name}
              description={piece.vibe}
              image={images[0]}
            />
          </div>

          {/* Product Details */}
          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h3 style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              marginBottom: '20px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              DETAILS
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              fontSize: '12px',
              lineHeight: '2.2',
              color: 'rgba(255,255,255,0.7)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Handcrafted in limited quantities</li>
              <li style={{ marginBottom: '8px' }}>• African-inspired contemporary design</li>
              <li style={{ marginBottom: '8px' }}>• Premium sustainable materials</li>
              <li style={{ marginBottom: '8px' }}>• Perfect for Kizomba & Urban Kiz festivals</li>
              <li>• Designed by Koby Harding</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '0 20px' : '0 24px'
      }}>
        <ProductReviews productId={piece.id} isMobile={isMobile} />
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: isMobile ? '24px 20px' : '32px 24px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '12px',
            fontWeight: '100',
            letterSpacing: '0.3em',
            marginBottom: '32px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            YOU MAY ALSO LIKE
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: isMobile ? '16px' : '24px'
          }}>
            {relatedProducts.map((relatedPiece) => (
              <motion.div
                key={relatedPiece.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/piece/${relatedPiece.id}`)}
                style={{
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'border-color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <div style={{
                  aspectRatio: '1',
                  overflow: 'hidden'
                }}>
                  <img
                    src={relatedPiece.imageUrl}
                    alt={relatedPiece.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
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
                    {relatedPiece.name}
                  </h3>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '200' }}>
                      ${relatedPiece.price}
                    </div>
                    {!relatedPiece.available && (
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
      )}

      {/* Recently Viewed Section */}
      {recentlyViewedPieces.length > 0 && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: isMobile ? '24px 20px' : '32px 24px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '12px',
            fontWeight: '100',
            letterSpacing: '0.3em',
            marginBottom: '32px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            RECENTLY VIEWED
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: isMobile ? '16px' : '24px'
          }}>
            {recentlyViewedPieces.map((recentPiece) => (
              <motion.div
                key={recentPiece.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/piece/${recentPiece.id}`)}
                style={{
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'border-color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <div style={{
                  aspectRatio: '1',
                  overflow: 'hidden'
                }}>
                  <img
                    src={recentPiece.imageUrl}
                    alt={recentPiece.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
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
                    {recentPiece.name}
                  </h3>
                  <div style={{ fontSize: '12px', fontWeight: '200' }}>
                    ${recentPiece.price}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default PieceMinimal