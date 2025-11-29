import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Grid3x3, Grid2x2, Search } from 'lucide-react'
import useStore from '../stores/useStore'
import { mockPieces } from '../data/mockData'
import { useToast } from '../components/Toast'
import { ProductCardSkeleton } from '../components/SkeletonLoader'
import { EmptySearch } from '../components/EmptyStates'
import RecentlyViewed from '../components/RecentlyViewed'

const CollectionMinimal = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { pieces, addToCart, setPieces } = useStore()
  const { addToast } = useToast()
  const [category, setCategory] = useState('all')
  const [gridView, setGridView] = useState<'large' | 'small'>('small')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'newest'>('newest')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'khlassic-suits', label: 'KHLASSIC SUITS' },
    { id: 't-shirts', label: 'T-SHIRTS' },
    { id: 'kh-tailored', label: 'KH TAILORED' },
    { id: 'kh-specials', label: 'KH-SPECIALS' },
    { id: 'denims', label: 'DENIMS' },
    { id: 'limited', label: 'LIMITED EDITION' }
  ]

  // Filter and sort pieces
  let filteredPieces = pieces

  if (searchQuery) {
    filteredPieces = filteredPieces.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vibe.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  if (category !== 'all') {
    filteredPieces = filteredPieces.filter(p =>
      p.category === category
    )
  }
  
  // Sort pieces
  filteredPieces = [...filteredPieces].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      default: return 0
    }
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    // Load mock pieces if not already loaded
    if (pieces.length === 0) {
      setIsLoading(true)
      // Simulate loading for better UX
      setTimeout(() => {
        setPieces(mockPieces)
        setIsLoading(false)
      }, 800)
    } else {
      setIsLoading(false)
    }
  }, [pieces.length, setPieces])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      position: 'relative'
    }}>
      {/* Subtle grid pattern */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.02,
        pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Header - Integrated */}
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
            marginBottom: isMobile ? '15px' : '20px'
          }}>
            <h1 style={{
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '100',
              letterSpacing: isMobile ? '0.3em' : '0.4em',
              opacity: 0.9
            }}>
              COLLECTION
            </h1>

            {!isMobile && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => setGridView(gridView === 'large' ? 'small' : 'large')}
                  style={{
                    padding: '8px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                >
                  {gridView === 'large' ?
                    <Grid3x3 style={{ width: '16px', height: '16px' }} /> :
                    <Grid2x2 style={{ width: '16px', height: '16px' }} />
                  }
                </button>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : '12px',
            padding: isMobile ? '10px 12px' : '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s'
          }}>
            <Search style={{ width: '14px', height: '14px', opacity: 0.5, flexShrink: 0 }} />
            <input
              type="text"
              placeholder={isMobile ? "Search..." : "Search collection..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: isMobile ? '12px' : '13px',
                color: '#fff',
                letterSpacing: '0.05em',
                fontWeight: '300'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  padding: '4px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#000'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '12px 15px' : '16px 20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              flex: 1,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    padding: '4px 0',
                    fontSize: '11px',
                    fontWeight: '300',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    background: 'none',
                    border: 'none',
                    borderBottom: category === cat.id ? '1px solid #fff' : '1px solid transparent',
                    color: category === cat.id ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    if (category !== cat.id) {
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (category !== cat.id) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'
                      e.currentTarget.style.borderBottom = '1px solid transparent'
                    }
                  }}
                >
                  {cat.label}
                  {cat.id === 'limited' && <span style={{ marginLeft: '6px', color: '#fff' }}>●</span>}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              style={{
                padding: '6px 10px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            >
              <option value="newest" style={{ background: '#000' }}>NEWEST</option>
              <option value="price-low" style={{ background: '#000' }}>PRICE ↑</option>
              <option value="price-high" style={{ background: '#000' }}>PRICE ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '15px' : '20px'
      }}>
        {isLoading ? (
          <div style={{
            display: 'grid',
            gap: isMobile ? '10px' : '20px',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : gridView === 'large'
                ? 'repeat(auto-fill, minmax(350px, 1fr))'
                : 'repeat(auto-fill, minmax(220px, 1fr))'
          }}>
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPieces.length === 0 ? (
          <EmptySearch query={searchQuery || category} />
        ) : (
          <div style={{
            display: 'grid',
            gap: isMobile ? '10px' : '20px',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : gridView === 'large'
                ? 'repeat(auto-fill, minmax(350px, 1fr))'
                : 'repeat(auto-fill, minmax(220px, 1fr))'
          }}>
            {filteredPieces.map((piece, index) => (
            <motion.div
              key={piece.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.02,
                duration: 0.4,
                ease: 'easeOut'
              }}
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
                aspectRatio: gridView === 'large' ? '3/4' : '1',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={piece.imageUrl}
                  alt={piece.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'all 0.5s ease',
                    transform: hoveredItem === piece.id ? 'scale(1.05)' : 'scale(1)',
                    filter: hoveredItem === piece.id ? 'brightness(0.8)' : 'brightness(1)',
                    aspectRatio: gridView === 'large' ? '3/4' : '1/1'
                  }}
                />
                
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
                padding: isMobile ? '12px' : gridView === 'large' ? '20px' : '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{
                  fontSize: isMobile ? '11px' : gridView === 'large' ? '13px' : '12px',
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
                    fontSize: isMobile ? '12px' : gridView === 'large' ? '14px' : '13px',
                    fontWeight: '200',
                    letterSpacing: '0.05em'
                  }}>
                    ${piece.price}
                  </span>

                  {!isMobile && piece.available && piece.hearts > 50 && (
                    <span style={{
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      opacity: 0.7,
                      color: '#fff',
                      padding: '2px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      POPULAR
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>

      {/* Recently Viewed Section */}
      <RecentlyViewed isMobile={isMobile} maxItems={6} />
    </div>
  )
}

export default CollectionMinimal