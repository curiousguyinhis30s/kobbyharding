# Search and Filtering System Guide

## Overview

Kobby's Threads now includes a comprehensive search and filtering system that allows users to easily discover pieces through multiple filtering methods. The system is fully integrated with Zustand state management and provides real-time search with debouncing for optimal performance.

## Features

### 1. Real-Time Search
- **Multi-field Search**: Search by piece name, story, vibe, fabric origin, denim type, and more
- **Debounced Input**: 300ms debounce prevents excessive computations
- **Instant Results**: Results update as you type

### 2. Category Filters
- Filter by clothing categories (shirts, pants, dresses, accessories)
- Multi-select support - combine multiple categories
- Dynamic category extraction from piece data

### 3. Price Range Slider
- Min/Max price inputs for precise control
- Range slider for visual adjustment
- Validates against available piece prices
- Dynamic price range based on collection

### 4. Vibe/Mood Filter
- Filter by emotional/aesthetic vibes (e.g., "Bold confidence", "Mysterious elegance")
- Multi-select support
- Dynamically extracted from piece data

### 5. Size Availability Filter
- Filter by clothing sizes (XS, S, M, L, XL, XXL)
- Multi-select support
- Visual button-based interface

### 6. Sort Options
- **Newest**: Default, maintains insertion order
- **Price Low to High**: Ascending price order
- **Price High to Low**: Descending price order
- **Most Popular**: Sorted by heart count (engagement)

### 7. Clear Filters Button
- One-click reset of all filters and search
- Only appears when filters are active
- Shows active filter count badge

## Architecture

### File Structure

```
src/
├── components/
│   └── SearchAndFilter.tsx          # Main search/filter component
├── stores/
│   └── useStore.ts                  # Extended with filter state
├── utils/
│   └── filterHelpers.ts             # Helper functions for filtering
├── pages/
│   └── CollectionMinimalEnhanced.tsx # Integrated collection page
└── SEARCH_AND_FILTER_GUIDE.md       # This file
```

### State Management (Zustand)

The filter state is managed in `useStore.ts`:

```typescript
interface Store {
  // Search and Filter State
  searchQuery: string
  priceRange: [number, number]
  selectedVibes: string[]
  selectedCategories: string[]
  selectedSizes: string[]
  sortBy: 'newest' | 'price-low' | 'price-high' | 'most-popular'

  // Filter Functions
  setSearchQuery: (query: string) => void
  setPriceRange: (range: [number, number]) => void
  setSelectedVibes: (vibes: string[]) => void
  setSelectedCategories: (categories: string[]) => void
  setSelectedSizes: (sizes: string[]) => void
  setSortBy: (sort: ...) => void
  resetFilters: () => void
  getFilteredPieces: () => Piece[]
}
```

**Persistence**: All filter state is automatically persisted to localStorage via Zustand's persist middleware.

### Component Architecture

#### SearchAndFilter Component (`src/components/SearchAndFilter.tsx`)

**Props**:
- `onFiltersChange?`: Callback when filters change
- `isMobile?`: Boolean flag for mobile responsiveness

**Features**:
- Responsive design (mobile-first)
- Smooth animations using framer-motion
- Expandable filter sections with smooth transitions
- Real-time filter count badge
- Debounced search input (300ms)

**Sub-Components**:
- `FilterSection`: Reusable collapsible filter section with toggle animation

#### Integration Point (`CollectionMinimalEnhanced.tsx`)

The SearchAndFilter component replaces the old inline search/filter code:

```typescript
// Before: Scattered state and filtering logic
// After: Clean integration
<SearchAndFilter isMobile={isMobile} />
```

The page uses `getFilteredPieces()` from the store to get dynamically filtered results:

```typescript
const filteredPieces = useMemo(() => {
  return getFilteredPieces()
}, [getFilteredPieces])
```

## Usage Guide

### For Users

1. **Search**: Type in the search bar to find pieces by name, story, vibe, or fabric
2. **Filter**: Click "FILTERS" button to expand filter panel
3. **Combine**: Mix multiple filters (e.g., "Bold confidence" vibe + "$300-500" price range)
4. **Sort**: Use the sort dropdown to organize results
5. **Clear**: Click "CLEAR ALL" to reset all filters at once

### For Developers

#### Using Filter Functions

```typescript
import useStore from '../stores/useStore'

const MyComponent = () => {
  const { getFilteredPieces, searchQuery, setSearchQuery } = useStore()

  // Get filtered pieces
  const pieces = getFilteredPieces()

  // Update search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Update vibes
  const handleVibeFilter = (vibes: string[]) => {
    setSelectedVibes(vibes)
  }

  return (
    // Your JSX
  )
}
```

#### Using Helper Functions

```typescript
import { searchPiece, filterByPriceRange, sortPieces } from '../utils/filterHelpers'
import { Piece } from '../stores/useStore'

// Search a single piece
const matches = searchPiece(piece, 'bold')

// Filter multiple pieces
const expensive = filterByPriceRange(pieces, 300, 600)

// Sort pieces
const sorted = sortPieces(pieces, 'price-low')

// Get statistics
import { getFilterStats } from '../utils/filterHelpers'
const stats = getFilterStats(pieces)
// Returns: { totalPieces, availablePieces, averagePrice, ... }
```

#### Advanced Filtering

Use the `applyMultipleFilters` utility for complex filter combinations:

```typescript
import { applyMultipleFilters } from '../utils/filterHelpers'

const filtered = applyMultipleFilters(pieces, {
  search: 'bold',
  priceRange: [300, 500],
  vibes: ['Bold confidence', 'Grounded power'],
  categories: ['shirts', 'pants'],
  availableOnly: true,
  popularOnly: false
})
```

## Filter Logic Details

### Search Algorithm

Searches across multiple fields with case-insensitive matching:
- `piece.name`
- `piece.story`
- `piece.vibe`
- `piece.fabricOrigin`
- `piece.denimType`
- `piece.createdFor`
- `piece.currentLocation`

### Filter Application Order

Filters are applied in this sequence:
1. Search filter (multi-field text search)
2. Price range filter (min/max bounds)
3. Vibe filter (exact matches on selected vibes)
4. Category filter (exact matches on selected categories)
5. Size filter (marks which sizes to show)
6. **Sorting** (final ordering of results)

### Performance Optimizations

1. **Debounced Search**: 300ms debounce prevents excessive re-filtering
2. **Memoized Getters**: `getFilteredPieces()` uses Zustand's selector pattern
3. **useMemo**: Collection page memoizes filtered results
4. **Dynamic Values**: Categories and vibes extracted on-demand from piece data
5. **Lazy Filter Expansion**: Filter sections only animate when toggled

## Styling and Design

### Design System

The search and filter component follows Kobby's Threads design aesthetic:

- **Color**: Black background with white text
- **Typography**: Light weight (300), letter-spacing for elegance
- **Spacing**: 8px grid system (multiples of 8)
- **Borders**: Subtle rgba(255, 255, 255, 0.1) for separation
- **Transitions**: 0.3s ease for all interactive elements
- **Animations**: framer-motion for smooth filter transitions

### Responsive Design

- **Mobile** (≤768px):
  - Single column layout
  - Compact spacing (15px padding)
  - Full-width inputs and buttons
  - Simplified filter UI

- **Desktop** (>768px):
  - Multi-column grid layout
  - Comfortable spacing (20px padding)
  - Sidebar-style filter panel
  - Full feature set

## Mobile Responsiveness

The component is fully responsive with:
- Touch-friendly buttons (min 44x44px)
- Readable font sizes on all devices
- Flexible grid layouts
- Scroll-friendly filter sections
- Mobile-optimized filter collapsing

## Accessibility Features

- Proper label associations with form inputs
- Semantic HTML structure
- Keyboard navigation support
- Clear visual feedback on interactions
- High contrast ratios (white on black)

## Future Enhancements

### Potential Features

1. **Advanced Search**
   - Wildcard support (*keyword*)
   - Exact phrase matching ("quoted phrase")
   - Field-specific search (name:"Sunset Warrior")

2. **Additional Filters**
   - Fabric composition (% cotton, % polyester, etc.)
   - Availability by location
   - Weight range filter
   - Inquiry count / popularity timeline

3. **Smart Recommendations**
   - "Similar to this" suggestions
   - Trending pieces based on views
   - Personalized recommendations based on journey

4. **Filter Presets**
   - Save favorite filter combinations
   - Shared filter presets (e.g., "Festival Ready", "Minimalist Vibes")
   - Filter templates

5. **Advanced UI**
   - Filter visualization (price histogram, vibe cloud)
   - Filter suggestions based on selection
   - Quick-flip filter toggles
   - Faceted search with counts

### Implementation Notes for Future Work

- Keep `filterHelpers.ts` as the single source of truth for filter logic
- Add tests for each filter function
- Profile performance with large datasets (>1000 pieces)
- Consider virtualization if needed
- Add analytics for filter usage patterns

## Testing

### Unit Tests (filterHelpers.ts)

```typescript
describe('filterHelpers', () => {
  describe('searchPiece', () => {
    it('should find piece by name', () => {
      const piece = { name: 'Sunset Warrior', ... }
      expect(searchPiece(piece, 'sunset')).toBe(true)
    })

    it('should find piece by story', () => {
      const piece = { story: 'Created during golden hour...', ... }
      expect(searchPiece(piece, 'golden')).toBe(true)
    })
  })

  // ... more tests
})
```

### Integration Tests

Test the full filter flow in CollectionMinimalEnhanced page:
- Verify filter state persists
- Test filter combinations
- Validate sort order
- Check mobile responsiveness

## Troubleshooting

### Filters Not Appearing

1. Check that pieces have the required fields
2. Verify filter state is properly initialized
3. Ensure SearchAndFilter component is imported correctly

### Search Not Finding Results

1. Verify search term matches piece data
2. Check for case sensitivity (should be ignored)
3. Ensure piece data is loaded before searching

### Performance Issues

1. Check debounce timer (300ms is standard)
2. Verify useMemo dependencies in collection page
3. Profile with React DevTools
4. Consider pagination for large datasets

### Mobile Display Issues

1. Test with `isMobile` prop set correctly
2. Check viewport width detection
3. Verify touch interactions work
4. Test on various device sizes

## Maintenance

### Regular Updates

- Monitor filter usage analytics
- Update popular vibes/categories based on trends
- Optimize price range defaults
- Add new categories as collection grows

### Code Maintenance

- Keep `filterHelpers.ts` imports centralized
- Update TypeScript types when Piece interface changes
- Test filter logic after any data model changes
- Review performance with collection size changes

## Support

For issues or questions:

1. Check this guide for troubleshooting
2. Review component implementation details
3. Examine filter logic in `useStore.ts` and `filterHelpers.ts`
4. Test with mock data before production deployment
