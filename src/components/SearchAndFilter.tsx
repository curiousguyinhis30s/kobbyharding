import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronDown, Sliders } from 'lucide-react'
import useStore from '../stores/useStore'
import { useDebounce } from '../hooks/useDebounce'

interface SearchAndFilterProps {
  onFiltersChange?: () => void
  isMobile?: boolean
}

const SearchAndFilter = memo(({ onFiltersChange, isMobile = false }: SearchAndFilterProps) => {
  const {
    pieces,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    selectedVibes,
    setSelectedVibes,
    selectedCategories,
    setSelectedCategories,
    selectedSizes,
    setSelectedSizes,
    sortBy,
    setSortBy,
    resetFilters
  } = useStore()

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['vibe'])
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Use custom debounce hook for search query
  const debouncedQuery = useDebounce(localQuery, 300)

  // Extract unique values from pieces - memoized
  const uniqueVibes = useMemo(() => Array.from(new Set(pieces.map(p => p.vibe))), [pieces])
  const uniqueCategories = useMemo(() =>
    Array.from(new Set(pieces.map(p => p.category).filter(Boolean))) as string[],
    [pieces]
  )
  const uniqueSizes = useMemo(() => ['XS', 'S', 'M', 'L', 'XL', 'XXL'], [])
  const minPrice = useMemo(() => Math.min(...pieces.map(p => p.price)), [pieces])
  const maxPrice = useMemo(() => Math.max(...pieces.map(p => p.price)), [pieces])

  // Update search query when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedQuery)
    onFiltersChange?.()
  }, [debouncedQuery, setSearchQuery, onFiltersChange])

  const handleVibe = useCallback((vibe: string) => {
    setSelectedVibes(
      selectedVibes.includes(vibe)
        ? selectedVibes.filter(v => v !== vibe)
        : [...selectedVibes, vibe]
    )
    onFiltersChange?.()
  }, [selectedVibes, setSelectedVibes, onFiltersChange])

  const handleCategory = useCallback((category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories, category]
    )
    onFiltersChange?.()
  }, [selectedCategories, setSelectedCategories, onFiltersChange])

  const handleSize = useCallback((size: string) => {
    setSelectedSizes(
      selectedSizes.includes(size)
        ? selectedSizes.filter(s => s !== size)
        : [...selectedSizes, size]
    )
    onFiltersChange?.()
  }, [selectedSizes, setSelectedSizes, onFiltersChange])

  const handlePriceChange = useCallback((min: number, max: number) => {
    setPriceRange([min, max])
    onFiltersChange?.()
  }, [setPriceRange, onFiltersChange])

  const handleSortChange = useCallback((newSort: string) => {
    setSortBy(newSort as 'newest' | 'price-low' | 'price-high' | 'most-popular')
    onFiltersChange?.()
  }, [setSortBy, onFiltersChange])

  const toggleFilter = useCallback((filterName: string) => {
    setExpandedFilters(prev =>
      prev.includes(filterName)
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    )
  }, [])

  const activeFiltersCount = useMemo(() => [
    ...selectedVibes,
    ...selectedCategories,
    ...selectedSizes,
    ...(priceRange[0] > minPrice || priceRange[1] < maxPrice ? ['price'] : [])
  ].length, [selectedVibes, selectedCategories, selectedSizes, priceRange, minPrice, maxPrice])

  const handleReset = useCallback(() => {
    setLocalQuery('')
    resetFilters()
    onFiltersChange?.()
  }, [resetFilters, onFiltersChange])

  return (
    <div style={{
      background: '#000',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#fff'
    }}>
      {/* Search Bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '12px 15px' : '16px 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '8px' : '12px',
          padding: isMobile ? '10px 12px' : '12px 16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          transition: 'all 0.3s'
        }}>
          <Search style={{
            width: '14px',
            height: '14px',
            color: 'rgba(255,255,255,0.6)',
            flexShrink: 0
          }} />
          <input
            type="text"
            placeholder={isMobile ? "Search pieces..." : "Search by name, vibe, story, fabric origin..."}
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            aria-label="Search products by name, vibe, story, or fabric origin"
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
          {localQuery && (
            <button
              onClick={() => setLocalQuery('')}
              aria-label="Clear search"
              style={{
                padding: '4px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              <X style={{ width: '14px', height: '14px' }} />
            </button>
          )}
        </div>

        {/* Filter Toggle & Sort */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              aria-label={`${showAdvancedFilters ? 'Hide' : 'Show'} filters${activeFiltersCount > 0 ? ` (${activeFiltersCount} active)` : ''}`}
              aria-expanded={showAdvancedFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '11px',
                letterSpacing: '0.1em',
                background: showAdvancedFilters ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative'
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
              <Sliders style={{ width: '14px', height: '14px' }} />
              FILTERS
              {activeFiltersCount > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    background: '#fff',
                    color: '#000',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    marginLeft: '4px'
                  }}
                >
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleReset}
                aria-label="Clear all filters"
                style={{
                  padding: '6px 12px',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.8)',
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
                CLEAR ALL
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            aria-label="Sort products by"
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
            <option value="most-popular" style={{ background: '#000' }}>MOST POPULAR</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: isMobile ? '15px' : '20px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: isMobile ? '16px' : '20px'
              }}>
                {/* Vibe Filter */}
                <FilterSection
                  title="VIBE / MOOD"
                  isExpanded={expandedFilters.includes('vibe')}
                  onToggle={() => toggleFilter('vibe')}
                >
                  <div style={{
                    display: 'grid',
                    gap: '8px'
                  }}>
                    {uniqueVibes.map((vibe) => (
                      <label
                        key={vibe}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          opacity: 0.8,
                          transition: 'opacity 0.3s',
                          minHeight: '44px',
                          padding: '8px 0'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                      >
                        <input
                          type="checkbox"
                          checked={selectedVibes.includes(vibe)}
                          onChange={() => handleVibe(vibe)}
                          id={`vibe-${vibe}`}
                          aria-label={`Filter by ${vibe} vibe`}
                          style={{
                            cursor: 'pointer',
                            width: '18px',
                            height: '18px',
                            minWidth: '18px',
                            minHeight: '18px'
                          }}
                        />
                        {vibe}
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Category Filter */}
                <FilterSection
                  title="CATEGORY"
                  isExpanded={expandedFilters.includes('category')}
                  onToggle={() => toggleFilter('category')}
                >
                  <div style={{
                    display: 'grid',
                    gap: '8px'
                  }}>
                    {uniqueCategories.map((category) => (
                      <label
                        key={category}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          opacity: 0.8,
                          transition: 'opacity 0.3s',
                          minHeight: '44px',
                          padding: '8px 0'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategory(category)}
                          id={`category-${category}`}
                          aria-label={`Filter by ${category} category`}
                          style={{
                            cursor: 'pointer',
                            width: '18px',
                            height: '18px',
                            minWidth: '18px',
                            minHeight: '18px'
                          }}
                        />
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Price Range Filter */}
                <FilterSection
                  title="PRICE RANGE"
                  isExpanded={expandedFilters.includes('price')}
                  onToggle={() => toggleFilter('price')}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      <input
                        type="number"
                        min={minPrice}
                        max={maxPrice}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(parseInt(e.target.value) || minPrice, priceRange[1])}
                        aria-label="Minimum price"
                        style={{
                          width: '70px',
                          padding: '6px 8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          fontSize: '11px',
                          borderRadius: '2px'
                        }}
                      />
                      <span style={{ opacity: 0.5, fontSize: '12px' }} aria-hidden="true">—</span>
                      <input
                        type="number"
                        min={minPrice}
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value) || maxPrice)}
                        aria-label="Maximum price"
                        style={{
                          width: '70px',
                          padding: '6px 8px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          fontSize: '11px',
                          borderRadius: '2px'
                        }}
                      />
                    </div>
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
                      aria-label="Price range slider"
                      style={{
                        width: '100%',
                        height: '4px',
                        borderRadius: '2px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </FilterSection>

                {/* Size Filter */}
                <FilterSection
                  title="SIZE AVAILABILITY"
                  isExpanded={expandedFilters.includes('size')}
                  onToggle={() => toggleFilter('size')}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px'
                  }}>
                    {uniqueSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSize(size)}
                        aria-label={`Filter by size ${size}`}
                        aria-pressed={selectedSizes.includes(size)}
                        style={{
                          padding: '12px 8px',
                          minHeight: '44px',
                          minWidth: '44px',
                          background: selectedSizes.includes(size)
                            ? 'rgba(255, 255, 255, 0.2)'
                            : 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${selectedSizes.includes(size)
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'rgba(255, 255, 255, 0.1)'}`,
                          color: selectedSizes.includes(size) ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                          fontSize: '11px',
                          fontWeight: selectedSizes.includes(size) ? '500' : '300',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          borderRadius: '2px',
                          letterSpacing: '0.05em'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                          e.currentTarget.style.color = '#fff'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = selectedSizes.includes(size)
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'rgba(255, 255, 255, 0.1)'
                          e.currentTarget.style.color = selectedSizes.includes(size) ? '#fff' : 'rgba(255, 255, 255, 0.6)'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

SearchAndFilter.displayName = 'SearchAndFilter'

interface FilterSectionProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

const FilterSection = memo(({ title, isExpanded, onToggle, children }: FilterSectionProps) => {
  return (
    <div style={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      paddingBottom: '16px'
    }}>
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} filter section`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0 0 12px 0',
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '11px',
          letterSpacing: '0.15em',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'opacity 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        {title}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <ChevronDown style={{ width: '14px', height: '14px' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

FilterSection.displayName = 'FilterSection'

export default SearchAndFilter
