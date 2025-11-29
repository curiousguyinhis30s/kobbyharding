import type { Piece } from '../stores/useStore'

/**
 * Search a piece by multiple fields
 * Searches: name, story, vibe, fabricOrigin
 */
export const searchPiece = (piece: Piece, query: string): boolean => {
  if (!query.trim()) return true

  const searchFields = [
    piece.name,
    piece.story,
    piece.vibe,
    piece.fabricOrigin,
    piece.denimType,
    piece.createdFor,
    piece.currentLocation
  ]

  const lowerQuery = query.toLowerCase()
  return searchFields.some(field =>
    field && field.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Filter pieces by price range
 */
export const filterByPriceRange = (
  pieces: Piece[],
  minPrice: number,
  maxPrice: number
): Piece[] => {
  return pieces.filter(p => p.price >= minPrice && p.price <= maxPrice)
}

/**
 * Filter pieces by vibe
 */
export const filterByVibes = (pieces: Piece[], vibes: string[]): Piece[] => {
  if (vibes.length === 0) return pieces
  return pieces.filter(p => vibes.includes(p.vibe))
}

/**
 * Filter pieces by category
 */
export const filterByCategories = (pieces: Piece[], categories: string[]): Piece[] => {
  if (categories.length === 0) return pieces
  return pieces.filter(p => p.category && categories.includes(p.category))
}

/**
 * Filter pieces by availability
 */
export const filterByAvailability = (pieces: Piece[], availableOnly: boolean): Piece[] => {
  if (!availableOnly) return pieces
  return pieces.filter(p => p.available)
}

/**
 * Filter pieces by popularity
 */
export const filterByPopularity = (pieces: Piece[], popularOnly: boolean, threshold: number = 50): Piece[] => {
  if (!popularOnly) return pieces
  return pieces.filter(p => p.hearts >= threshold)
}

/**
 * Sort pieces by different criteria
 */
export type SortOption = 'newest' | 'price-low' | 'price-high' | 'most-popular' | 'most-viewed'

export const sortPieces = (pieces: Piece[], sortBy: SortOption): Piece[] => {
  const sorted = [...pieces]

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price)

    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price)

    case 'most-popular':
      return sorted.sort((a, b) => b.hearts - a.hearts)

    case 'most-viewed':
      return sorted.sort((a, b) => b.views - a.views)

    case 'newest':
    default:
      return sorted
  }
}

/**
 * Get all unique values from pieces for a given field
 */
export const getUniqueValues = <K extends keyof Piece>(
  pieces: Piece[],
  field: K
): Array<Piece[K]> => {
  const unique = new Set<Piece[K]>()
  pieces.forEach(p => {
    if (p[field]) {
      unique.add(p[field])
    }
  })
  return Array.from(unique)
}

/**
 * Get price range from pieces
 */
export const getPriceRange = (pieces: Piece[]): [number, number] => {
  if (pieces.length === 0) return [0, 0]

  const prices = pieces.map(p => p.price)
  return [Math.min(...prices), Math.max(...prices)]
}

/**
 * Get filter statistics
 */
export const getFilterStats = (pieces: Piece[]) => {
  return {
    totalPieces: pieces.length,
    availablePieces: pieces.filter(p => p.available).length,
    averagePrice: pieces.length > 0
      ? Math.round(pieces.reduce((sum, p) => sum + p.price, 0) / pieces.length)
      : 0,
    highestPrice: Math.max(...pieces.map(p => p.price), 0),
    lowestPrice: Math.min(...pieces.map(p => p.price), Infinity),
    totalHearts: pieces.reduce((sum, p) => sum + p.hearts, 0),
    totalViews: pieces.reduce((sum, p) => sum + p.views, 0)
  }
}

/**
 * Combine multiple filter functions
 */
export const applyMultipleFilters = (
  pieces: Piece[],
  filters: {
    search?: string
    priceRange?: [number, number]
    vibes?: string[]
    categories?: string[]
    availableOnly?: boolean
    popularOnly?: boolean
  }
): Piece[] => {
  let filtered = pieces

  // Apply search filter
  if (filters.search) {
    filtered = filtered.filter(p => searchPiece(p, filters.search!))
  }

  // Apply price range filter
  if (filters.priceRange) {
    filtered = filterByPriceRange(filtered, filters.priceRange[0], filters.priceRange[1])
  }

  // Apply vibe filter
  if (filters.vibes && filters.vibes.length > 0) {
    filtered = filterByVibes(filtered, filters.vibes)
  }

  // Apply category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filterByCategories(filtered, filters.categories)
  }

  // Apply availability filter
  if (filters.availableOnly) {
    filtered = filterByAvailability(filtered, true)
  }

  // Apply popularity filter
  if (filters.popularOnly) {
    filtered = filterByPopularity(filtered, true)
  }

  return filtered
}
