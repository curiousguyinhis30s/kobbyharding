# Search and Filter System - Usage Examples

This document provides practical examples of using the search and filter system in Kobby's Threads.

## Basic Usage

### Using the SearchAndFilter Component

```typescript
import SearchAndFilter from '../components/SearchAndFilter'

export const MyCollectionPage = () => {
  const [isMobile, setIsMobile] = useState(false)

  return (
    <div>
      <h1>Collection</h1>
      {/* Include the search and filter component */}
      <SearchAndFilter isMobile={isMobile} />

      {/* Your products grid here */}
    </div>
  )
}
```

### With Callback Handler

```typescript
import SearchAndFilter from '../components/SearchAndFilter'

export const MyCollectionPage = () => {
  const [isMobile, setIsMobile] = useState(false)

  const handleFiltersChange = () => {
    // Perform any additional actions when filters change
    console.log('Filters changed!')
    // e.g., send analytics event
    // e.g., scroll to results
  }

  return (
    <SearchAndFilter
      isMobile={isMobile}
      onFiltersChange={handleFiltersChange}
    />
  )
}
```

## Store Usage Examples

### Getting Filtered Pieces

```typescript
import useStore from '../stores/useStore'

export const FilteredCollectionList = () => {
  const { getFilteredPieces } = useStore()

  // Get filtered pieces
  const pieces = getFilteredPieces()

  return (
    <div>
      <p>Found {pieces.length} pieces</p>
      {pieces.map(piece => (
        <div key={piece.id}>{piece.name}</div>
      ))}
    </div>
  )
}
```

### Reading Current Filter State

```typescript
import useStore from '../stores/useStore'

export const FilterStats = () => {
  const {
    searchQuery,
    priceRange,
    selectedVibes,
    selectedCategories,
    sortBy
  } = useStore()

  return (
    <div>
      <h3>Active Filters</h3>
      {searchQuery && <p>Search: {searchQuery}</p>}
      {(priceRange[0] > 0 || priceRange[1] < 600) && (
        <p>Price: ${priceRange[0]} - ${priceRange[1]}</p>
      )}
      {selectedVibes.length > 0 && (
        <p>Vibes: {selectedVibes.join(', ')}</p>
      )}
      {selectedCategories.length > 0 && (
        <p>Categories: {selectedCategories.join(', ')}</p>
      )}
      <p>Sort: {sortBy}</p>
    </div>
  )
}
```

### Updating Filters Programmatically

```typescript
import useStore from '../stores/useStore'

export const QuickFilters = () => {
  const {
    setSearchQuery,
    setPriceRange,
    setSelectedVibes,
    resetFilters
  } = useStore()

  return (
    <div>
      {/* Quick price filter */}
      <button onClick={() => setPriceRange([0, 400])}>
        Under $400
      </button>

      {/* Quick vibe filter */}
      <button onClick={() => setSelectedVibes(['Bold confidence'])}>
        Bold & Confident
      </button>

      {/* Quick search */}
      <button onClick={() => setSearchQuery('Sunset')}>
        Search Sunset
      </button>

      {/* Reset all */}
      <button onClick={resetFilters}>
        Clear All Filters
      </button>
    </div>
  )
}
```

## Advanced Examples

### Custom Filter Component

```typescript
import useStore from '../stores/useStore'

interface CustomPriceFilterProps {
  minPrice: number
  maxPrice: number
  step?: number
}

export const CustomPriceRangeFilter = ({
  minPrice,
  maxPrice,
  step = 50
}: CustomPriceFilterProps) => {
  const { priceRange, setPriceRange } = useStore()

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value)
    if (newMin < priceRange[1]) {
      setPriceRange([newMin, priceRange[1]])
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value)
    if (newMax > priceRange[0]) {
      setPriceRange([priceRange[0], newMax])
    }
  }

  return (
    <div className="price-filter">
      <h3>Price Range</h3>

      {/* Min slider */}
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        step={step}
        value={priceRange[0]}
        onChange={handleMinChange}
      />
      <span>${priceRange[0]}</span>

      {/* Max slider */}
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        step={step}
        value={priceRange[1]}
        onChange={handleMaxChange}
      />
      <span>${priceRange[1]}</span>

      {/* Total items in range */}
      <p>{getFilteredPieces().length} items available</p>
    </div>
  )
}
```

### Filter Persistence Across Routes

```typescript
import useStore from '../stores/useStore'
import { useEffect } from 'react'

export const PersistentFilterExample = () => {
  const { searchQuery, getFilteredPieces } = useStore()

  useEffect(() => {
    // Filters are automatically persisted!
    // This runs when component mounts
    console.log('Current search:', searchQuery)
    console.log('Filtered results:', getFilteredPieces().length)
  }, [searchQuery, getFilteredPieces])

  return (
    <div>
      {/* Filters persist across page navigation */}
      <h2>Filters are persistent!</h2>
      <p>Search: {searchQuery || 'none'}</p>
    </div>
  )
}
```

## Utility Function Examples

### Basic Search

```typescript
import { searchPiece } from '../utils/filterHelpers'
import { mockPieces } from '../data/mockData'

// Search single piece
const piece = mockPieces[0]
const isMatch = searchPiece(piece, 'bold')
console.log(isMatch) // true if piece matches

// Search all pieces
const results = mockPieces.filter(p => searchPiece(p, 'Accra'))
console.log(results) // All pieces mentioning Accra
```

### Advanced Filtering

```typescript
import { applyMultipleFilters } from '../utils/filterHelpers'
import { mockPieces } from '../data/mockData'

// Complex filter combination
const filtered = applyMultipleFilters(mockPieces, {
  search: 'festival',
  priceRange: [300, 500],
  vibes: ['Free spirit energy', 'Grounded power'],
  categories: ['shirts', 'pants'],
  availableOnly: true,
  popularOnly: false
})

console.log(`Found ${filtered.length} matching pieces`)
```

### Get Statistics

```typescript
import { getFilterStats } from '../utils/filterHelpers'
import { mockPieces } from '../data/mockData'

const stats = getFilterStats(mockPieces)

console.log(`Total pieces: ${stats.totalPieces}`)
console.log(`Available: ${stats.availablePieces}`)
console.log(`Average price: $${stats.averagePrice}`)
console.log(`Price range: $${stats.lowestPrice} - $${stats.highestPrice}`)
console.log(`Total hearts: ${stats.totalHearts}`)
console.log(`Total views: ${stats.totalViews}`)
```

### Sort Different Ways

```typescript
import { sortPieces } from '../utils/filterHelpers'
import { mockPieces } from '../data/mockData'

// Sort by price (low to high)
const cheapFirst = sortPieces(mockPieces, 'price-low')

// Sort by price (high to low)
const expensiveFirst = sortPieces(mockPieces, 'price-high')

// Sort by popularity
const mostPopular = sortPieces(mockPieces, 'most-popular')

// Sort by most viewed
const mostViewed = sortPieces(mockPieces, 'most-viewed')

// Keep newest order
const newest = sortPieces(mockPieces, 'newest')
```

### Extract Unique Values

```typescript
import { getUniqueValues } from '../utils/filterHelpers'
import { mockPieces } from '../data/mockData'

// Get all unique vibes
const vibes = getUniqueValues(mockPieces, 'vibe')
console.log(vibes)
// ["Bold confidence", "Mysterious elegance", "Free spirit energy", ...]

// Get all unique categories
const categories = getUniqueValues(mockPieces, 'category')
console.log(categories)
// ["shirts", "pants", "dresses", "accessories"]

// Get all unique fabric origins
const origins = getUniqueValues(mockPieces, 'fabricOrigin')
console.log(origins)
```

## React Component Examples

### Display Current Filters as Chips

```typescript
import useStore from '../stores/useStore'

export const ActiveFiltersChips = () => {
  const {
    searchQuery,
    priceRange,
    selectedVibes,
    selectedCategories,
    setSearchQuery,
    setPriceRange,
    setSelectedVibes,
    setSelectedCategories
  } = useStore()

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case 'search':
        setSearchQuery('')
        break
      case 'vibe':
        setSelectedVibes(selectedVibes.filter(v => v !== value))
        break
      case 'category':
        setSelectedCategories(selectedCategories.filter(c => c !== value))
        break
    }
  }

  return (
    <div className="active-filters">
      {searchQuery && (
        <Chip
          label={`Search: ${searchQuery}`}
          onDelete={() => removeFilter('search', '')}
        />
      )}

      {selectedVibes.map(vibe => (
        <Chip
          key={vibe}
          label={`Vibe: ${vibe}`}
          onDelete={() => removeFilter('vibe', vibe)}
        />
      ))}

      {selectedCategories.map(cat => (
        <Chip
          key={cat}
          label={`Category: ${cat}`}
          onDelete={() => removeFilter('category', cat)}
        />
      ))}
    </div>
  )
}
```

### Filter Summary Component

```typescript
import useStore from '../stores/useStore'

export const FilterSummary = () => {
  const { getFilteredPieces, pieces } = useStore()

  const filtered = getFilteredPieces()
  const resultCount = filtered.length
  const totalCount = pieces.length
  const percentageShowing = Math.round((resultCount / totalCount) * 100)

  return (
    <div className="filter-summary">
      <h3>
        Showing {resultCount} of {totalCount} pieces
        <span className="percentage">({percentageShowing}%)</span>
      </h3>

      {resultCount === 0 && (
        <p className="no-results">
          No pieces match your filters. Try adjusting your search.
        </p>
      )}

      {resultCount === totalCount && (
        <p className="showing-all">
          Showing all pieces in collection
        </p>
      )}
    </div>
  )
}
```

### Popular Filters Suggestion

```typescript
import useStore from '../stores/useStore'
import { getUniqueValues } from '../utils/filterHelpers'

export const PopularFiltersSuggestion = () => {
  const { pieces, setSelectedVibes } = useStore()

  const vibes = getUniqueValues(pieces, 'vibe')

  return (
    <div className="popular-filters">
      <h3>Explore by Vibe</h3>
      <div className="vibe-buttons">
        {vibes.map(vibe => (
          <button
            key={vibe}
            onClick={() => setSelectedVibes([vibe])}
            className="vibe-chip"
          >
            {vibe}
          </button>
        ))}
      </div>
    </div>
  )
}
```

## Analytics Integration Examples

### Track Filter Usage

```typescript
import useStore from '../stores/useStore'
import { useEffect } from 'react'

export const FilterAnalytics = () => {
  const {
    searchQuery,
    selectedVibes,
    selectedCategories,
    sortBy
  } = useStore()

  useEffect(() => {
    // Track when filters change
    const event = {
      timestamp: new Date().toISOString(),
      search: searchQuery,
      vibes: selectedVibes,
      categories: selectedCategories,
      sort: sortBy
    }

    // Send to analytics service
    console.log('Filter event:', event)
    // analytics.track('filters_changed', event)
  }, [searchQuery, selectedVibes, selectedCategories, sortBy])

  return null // Analytics component
}
```

### Track Search Queries

```typescript
import useStore from '../stores/useStore'

export const SearchAnalytics = () => {
  const { searchQuery, getFilteredPieces } = useStore()

  const logSearch = (query: string) => {
    const results = getFilteredPieces()

    const event = {
      query,
      resultCount: results.length,
      timestamp: new Date().toISOString()
    }

    console.log('Search event:', event)
    // analytics.track('search_performed', event)
  }

  // Log search when query changes
  useEffect(() => {
    if (searchQuery) {
      logSearch(searchQuery)
    }
  }, [searchQuery])

  return null
}
```

## Complete Page Example

```typescript
import { useState, useMemo } from 'react'
import useStore from '../stores/useStore'
import SearchAndFilter from '../components/SearchAndFilter'

export const CompleteCollectionPage = () => {
  const {
    getFilteredPieces,
    addToCart,
    toggleFavorite,
    isFavorite
  } = useStore()

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [gridView, setGridView] = useState<'large' | 'small'>('small')

  const filteredPieces = useMemo(
    () => getFilteredPieces(),
    [getFilteredPieces]
  )

  return (
    <div className="collection-page">
      {/* Header */}
      <div className="header">
        <h1>COLLECTION</h1>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter isMobile={isMobile} />

      {/* Results Section */}
      <div className="results">
        <p className="results-count">
          {filteredPieces.length} piece{filteredPieces.length !== 1 ? 's' : ''}
        </p>

        {filteredPieces.length === 0 ? (
          <div className="empty-state">
            <p>No pieces found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid">
            {filteredPieces.map(piece => (
              <div key={piece.id} className="product-card">
                <img src={piece.imageUrl} alt={piece.name} />
                <h3>{piece.name}</h3>
                <p className="vibe">{piece.vibe}</p>
                <p className="price">${piece.price}</p>

                <button onClick={() => toggleFavorite(piece.id)}>
                  {isFavorite(piece.id) ? 'Liked' : 'Like'}
                </button>

                <button onClick={() => addToCart(piece.id, 'M')}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

## Tips & Best Practices

### Performance
1. Use `useMemo` when getting filtered pieces
2. Keep debounce at 300ms for search
3. Avoid creating new filter objects on every render
4. Use callback functions with `useCallback` in filter components

### User Experience
1. Show result count to give feedback
2. Provide "Clear All" button for easy reset
3. Display loading state while filtering large datasets
4. Remember filter preferences (automatic via persistence)

### Code Quality
1. Import filter functions from `filterHelpers.ts`
2. Keep filter logic in Zustand store
3. Use TypeScript types from `useStore.ts`
4. Document custom filter combinations
5. Add tests for new filter types

### Maintenance
1. Update `filterHelpers.ts` when adding new filters
2. Keep store methods focused on state management
3. Log filter events for analytics
4. Monitor performance with large datasets
5. Test across different device sizes
