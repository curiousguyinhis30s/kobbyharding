import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Grid3x3, Grid2x2, Search, X, Heart, SlidersHorizontal, Clock, TrendingUp } from 'lucide-react'
import useStore from '../stores/useStore'
import { mockPieces } from '../data/mockData'
import { useToast } from '../components/Toast'
import { ProductCardSkeleton } from '../components/SkeletonLoader'
import { EmptySearch } from '../components/EmptyStates'

const CollectionMinimalEnhanced = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    pieces,
    addToCart,
    setPieces,
    toggleFavorite,
    isFavorite,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory
  } = useStore()
  const { addToast } = useToast()
  const [category, setCategory] = useState('all')
  const [gridView, setGridView] = useState<'large' | 'small'>('small')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'newest'>('newest')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isLoading, setIsLoading] = useState(true)

  // Advanced filters state
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 600])
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock'>('all')
  const [popularityFilter, setPopularityFilter] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Search autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [autocompleteResults, setAutocompleteResults] = useState<typeof pieces>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'jackets', label: 'JACKETS' },
    { id: 'shirts', label: 'SHIRTS' },
    { id: 'pants', label: 'PANTS' },
    { id: 'limited', label: 'LIMITED' }
  ]

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (priceRange[0] > 0 || priceRange[1] < 600) count++
    if (availabilityFilter === 'in-stock') count++
    if (popularityFilter) count++
    if (selectedCategories.length > 0) count++
    return count
  }, [priceRange, availabilityFilter, popularityFilter, selectedCategories])

  // Search autocomplete logic
  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = pieces.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vibe.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
      setAutocompleteResults(results)
      setShowAutocomplete(true)
      setShowSearchHistory(false)
    } else {
      setShowAutocomplete(false)
    }
  }, [searchQuery, pieces])

  // Click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false)
        setShowSearchHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToSearchHistory(query.trim())
      setSearchQuery(query.trim())
      setShowAutocomplete(false)
      setShowSearchHistory(false)
    }
  }

  // Filter and sort pieces
  let filteredPieces = pieces

  // Search filter
  if (searchQuery) {
    filteredPieces = filteredPieces.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vibe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Category filter (existing logic)
  if (category !== 'all') {
    filteredPieces = filteredPieces.filter((_, index) =>
      category === 'limited' ? index < 3 : index % 2 === 0
    )
  }

  // Multi-category filter (advanced)
  if (selectedCategories.length > 0) {
    filteredPieces = filteredPieces.filter(p =>
      selectedCategories.includes(p.category || '')
    )
  }

  // Price range filter
  filteredPieces = filteredPieces.filter(p =>
    p.price >= priceRange[0] && p.price <= priceRange[1]
  )

  // Availability filter
  if (availabilityFilter === 'in-stock') {
    filteredPieces = filteredPieces.filter(p => p.available)
  }

  // Popularity filter
  if (popularityFilter) {
    filteredPieces = filteredPieces.filter(p => p.hearts > 50)
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
    if (pieces.length === 0) {
      setIsLoading(true)
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

  const handleFavoriteClick = (e: React.MouseEvent, pieceId: string) => {
    e.stopPropagation()
    toggleFavorite(pieceId)
    addToast('success', isFavorite(pieceId) ? 'Removed from favorites' : 'Added to favorites')
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

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: '8px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
              >
                <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
                {activeFiltersCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#fff',
                    color: '#000',
                    borderRadius: '50%',
                    width: '14px',
                    height: '14px',
                    fontSize: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {!isMobile && (
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
              )}
            </div>
          </div>

          {/* Search Bar with Autocomplete */}
          <div style={{ position: 'relative' }}>
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
                ref={searchInputRef}
                type="text"
                placeholder={isMobile ? "Search..." : "Search collection..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.length === 0 && searchHistory.length > 0) {
                    setShowSearchHistory(true)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery)
                  }
                }}
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
                  onClick={() => {
                    setSearchQuery('')
                    setShowAutocomplete(false)
                  }}
                  style={{
                    padding: '4px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <X style={{ width: '14px', height: '14px' }} />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {(showAutocomplete || showSearchHistory) && (
                <motion.div
                  ref={autocompleteRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#000',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    marginTop: '4px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000
                  }}
                >
                  {showSearchHistory && searchHistory.length > 0 && (
                    <div style={{ padding: '12px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          fontSize: '10px',
                          letterSpacing: '0.1em',
                          opacity: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Clock style={{ width: '12px', height: '12px' }} />
                          RECENT SEARCHES
                        </div>
                        <button
                          onClick={clearSearchHistory}
                          style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            letterSpacing: '0.1em'
                          }}
                        >
                          CLEAR
                        </button>
                      </div>
                      {searchHistory.map((query, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSearchQuery(query)
                            handleSearch(query)
                          }}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            borderBottom: index < searchHistory.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {query}
                        </div>
                      ))}
                    </div>
                  )}

                  {showAutocomplete && autocompleteResults.length > 0 && (
                    <div>
                      <div style={{
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        opacity: 0.5,
                        padding: '12px 12px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <TrendingUp style={{ width: '12px', height: '12px' }} />
                        SUGGESTIONS
                      </div>
                      {autocompleteResults.map((piece) => (
                        <div
                          key={piece.id}
                          onClick={() => navigate(`/piece/${piece.id}`)}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            padding: '12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <img
                            src={piece.imageUrl}
                            alt={piece.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                              {piece.name}
                            </div>
                            <div style={{ fontSize: '10px', opacity: 0.5 }}>
                              {piece.vibe}
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            ${piece.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAutocomplete && autocompleteResults.length === 0 && searchQuery.length > 1 && (
                    <div style={{
                      padding: '20px',
                      textAlign: 'center',
                      fontSize: '12px',
                      opacity: 0.5
                    }}>
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              backgroundColor: '#000',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden'
            }}
          >
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: isMobile ? '15px' : '20px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                {/* Price Range */}
                <div>
                  <label style={{
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    opacity: 0.7,
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    PRICE RANGE
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      style={{
                        width: '70px',
                        padding: '6px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '11px'
                      }}
                    />
                    <span style={{ opacity: 0.5 }}>—</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 600])}
                      style={{
                        width: '70px',
                        padding: '6px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '11px'
                      }}
                    />
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label style={{
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    opacity: 0.7,
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    AVAILABILITY
                  </label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value as typeof availabilityFilter)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  >
                    <option value="all" style={{ background: '#000' }}>All Items</option>
                    <option value="in-stock" style={{ background: '#000' }}>In Stock Only</option>
                  </select>
                </div>

                {/* Popularity */}
                <div>
                  <label style={{
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    opacity: 0.7,
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    FILTER
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}>
                    <input
                      type="checkbox"
                      checked={popularityFilter}
                      onChange={(e) => setPopularityFilter(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    Popular Items Only
                  </label>
                </div>
              </div>

              {/* Reset Filters */}
              {activeFiltersCount > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => {
                      setPriceRange([0, 600])
                      setAvailabilityFilter('all')
                      setPopularityFilter(false)
                      setSelectedCategories([])
                    }}
                    style={{
                      padding: '6px 16px',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    RESET FILTERS
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories & Sort */}
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
        {/* Results count */}
        {!isLoading && (
          <div style={{
            fontSize: '11px',
            opacity: 0.5,
            letterSpacing: '0.1em',
            marginBottom: '16px'
          }}>
            {filteredPieces.length} ITEM{filteredPieces.length !== 1 ? 'S' : ''}
          </div>
        )}

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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
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
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'all 0.5s ease',
                    transform: hoveredItem === piece.id ? 'scale(1.05)' : 'scale(1)',
                    filter: hoveredItem === piece.id ? 'brightness(0.8)' : 'brightness(1)'
                  }}
                />

                {/* Favorite button */}
                <button
                  onClick={(e) => handleFavoriteClick(e, piece.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    opacity: hoveredItem === piece.id || isFavorite(piece.id) ? 1 : 0
                  }}
                >
                  <Heart
                    style={{
                      width: '16px',
                      height: '16px',
                      fill: isFavorite(piece.id) ? '#fff' : 'none',
                      stroke: '#fff'
                    }}
                  />
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

                {!piece.available && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    opacity: 0.5
                  }}>
                    OUT OF STOCK
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionMinimalEnhanced
