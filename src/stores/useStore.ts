import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Piece {
  id: string
  name: string
  story: string
  fabricOrigin: string
  denimType: string
  vibe: string
  imageUrl: string
  videoUrl?: string
  voiceNoteUrl?: string
  createdFor: string
  currentLocation: string
  weight: number
  views: number
  hearts: number
  inquiries: number
  price: number
  available: boolean
  category?: string
  image?: string
  wornBy?: Array<{
    name: string
    location: string
    story: string
    photoUrl: string
  }>
}

interface UserJourney {
  id: string
  timestamp: Date
  emotion: string
  path: string[]
  connectionLevel: number
  piecesViewed: string[]
  timeSpent: number
  returnVisit: boolean
}

interface KobyLocation {
  city: string
  country: string
  arrivalDate: Date
  departureDate?: Date
  piecesCarried: number
  totalWeight: number
  message: string
}

interface CartItem {
  pieceId: string
  size: string
  quantity: number
}

interface TryOnReservation {
  pieceId: string
  festivalId: string
  date: Date
  status: 'pending' | 'confirmed' | 'completed'
}

interface Store {
  pieces: Piece[]
  currentLocation: KobyLocation
  userJourney: UserJourney | null
  viewedPieces: Set<string>
  heartedPieces: Set<string>
  cartItems: CartItem[]
  tryOnReservations: TryOnReservation[]
  userStory: {
    name?: string
    lookingFor?: string
    vibe?: string
    festivalPlan?: string
    connectionStory?: string
  }
  recentlyViewed: string[]
  searchHistory: string[]
  favorites: string[]

  // Search and Filter State
  searchQuery: string
  priceRange: [number, number]
  selectedVibes: string[]
  selectedCategories: string[]
  selectedSizes: string[]
  sortBy: 'newest' | 'price-low' | 'price-high' | 'most-popular'

  setPieces: (pieces: Piece[]) => void
  setCurrentLocation: (location: KobyLocation) => void
  startJourney: (emotion: string) => void
  viewPiece: (pieceId: string) => void
  heartPiece: (pieceId: string) => void
  addToCart: (pieceId: string, size: string) => void
  removeFromCart: (pieceId: string, size: string) => void
  updateQuantity: (pieceId: string, size: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  // Try-on specific functions
  addTryOnReservation: (pieceId: string, festivalId: string) => void
  removeTryOnReservation: (pieceId: string, festivalId: string) => void
  clearTryOnReservations: (festivalId: string) => void
  getTryOnReservations: (festivalId?: string) => TryOnReservation[]
  updateUserStory: (story: Partial<Store['userStory']>) => void
  getRecommendations: () => Piece[]
  getInsights: () => {
    popularVibes: string[]
    emotionalConnections: number
    averageTimeSpent: number
    returnRate: number
  }
  // New functional features
  addToRecentlyViewed: (pieceId: string) => void
  clearRecentlyViewed: () => void
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
  toggleFavorite: (pieceId: string) => void
  isFavorite: (pieceId: string) => boolean

  // Search and Filter Functions
  setSearchQuery: (query: string) => void
  setPriceRange: (range: [number, number]) => void
  setSelectedVibes: (vibes: string[]) => void
  setSelectedCategories: (categories: string[]) => void
  setSelectedSizes: (sizes: string[]) => void
  setSortBy: (sort: 'newest' | 'price-low' | 'price-high' | 'most-popular') => void
  resetFilters: () => void
  getFilteredPieces: () => Piece[]
}

const useStore = create<Store>()(
  persist(
    (set, get) => ({
      pieces: [],
      currentLocation: {
        city: 'Bangkok',
        country: 'Thailand',
        arrivalDate: new Date(),
        piecesCarried: 23,
        totalWeight: 80,
        message: "Just arrived with fresh creations. The energy here is beautiful."
      },
      userJourney: null,
      viewedPieces: new Set(),
      heartedPieces: new Set(),
      cartItems: [],
      tryOnReservations: [],
      userStory: {},
      recentlyViewed: [],
      searchHistory: [],
      favorites: [],

      // Search and Filter State
      searchQuery: '',
      priceRange: [0, 600],
      selectedVibes: [],
      selectedCategories: [],
      selectedSizes: [],
      sortBy: 'newest',
      
      setPieces: (pieces) => set({ pieces }),
      
      setCurrentLocation: (location) => set({ currentLocation: location }),
      
      startJourney: (emotion) => set({
        userJourney: {
          id: Math.random().toString(36),
          timestamp: new Date(),
          emotion,
          path: ['/'],
          connectionLevel: 1,
          piecesViewed: [],
          timeSpent: 0,
          returnVisit: !!get().userJourney
        }
      }),
      
      viewPiece: (pieceId) => {
        const { pieces, viewedPieces, userJourney } = get()
        const newViewedPieces = new Set(viewedPieces)
        newViewedPieces.add(pieceId)
        
        const updatedPieces = pieces.map(p => 
          p.id === pieceId ? { ...p, views: p.views + 1 } : p
        )
        
        set({ 
          pieces: updatedPieces,
          viewedPieces: newViewedPieces,
          userJourney: userJourney ? {
            ...userJourney,
            piecesViewed: [...userJourney.piecesViewed, pieceId],
            connectionLevel: Math.min(10, userJourney.connectionLevel + 0.5)
          } : null
        })
      },
      
      heartPiece: (pieceId) => {
        const { pieces, heartedPieces } = get()
        const newHeartedPieces = new Set(heartedPieces)
        
        if (newHeartedPieces.has(pieceId)) {
          newHeartedPieces.delete(pieceId)
        } else {
          newHeartedPieces.add(pieceId)
        }
        
        const updatedPieces = pieces.map(p => 
          p.id === pieceId ? { 
            ...p, 
            hearts: newHeartedPieces.has(pieceId) ? p.hearts + 1 : p.hearts - 1 
          } : p
        )
        
        set({ 
          pieces: updatedPieces,
          heartedPieces: newHeartedPieces
        })
      },
      
      addToCart: (pieceId, size) => {
        const { cartItems } = get()
        const existingItem = cartItems.find(item => item.pieceId === pieceId && item.size === size)
        
        if (existingItem) {
          set({
            cartItems: cartItems.map(item => 
              item.pieceId === pieceId && item.size === size 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          set({
            cartItems: [...cartItems, { pieceId, size, quantity: 1 }]
          })
        }
      },
      
      removeFromCart: (pieceId, size) => {
        const { cartItems } = get()
        set({
          cartItems: cartItems.filter(item => !(item.pieceId === pieceId && item.size === size))
        })
      },
      
      updateQuantity: (pieceId, size, quantity) => {
        const { cartItems } = get()
        if (quantity <= 0) {
          get().removeFromCart(pieceId, size)
        } else {
          set({
            cartItems: cartItems.map(item => 
              item.pieceId === pieceId && item.size === size 
                ? { ...item, quantity }
                : item
            )
          })
        }
      },
      
      clearCart: () => set({ cartItems: [] }),
      
      getCartTotal: () => {
        const { cartItems, pieces } = get()
        return cartItems.reduce((total, item) => {
          const piece = pieces.find(p => p.id === item.pieceId)
          return total + (piece?.price || 0) * item.quantity
        }, 0)
      },
      
      // Try-on specific functions
      addTryOnReservation: (pieceId, festivalId) => {
        const { tryOnReservations } = get()
        const existingReservation = tryOnReservations.find(
          r => r.pieceId === pieceId && r.festivalId === festivalId
        )
        
        if (!existingReservation) {
          set({
            tryOnReservations: [...tryOnReservations, {
              pieceId,
              festivalId,
              date: new Date(),
              status: 'pending'
            }]
          })
        }
      },
      
      removeTryOnReservation: (pieceId, festivalId) => {
        const { tryOnReservations } = get()
        set({
          tryOnReservations: tryOnReservations.filter(
            r => !(r.pieceId === pieceId && r.festivalId === festivalId)
          )
        })
      },
      
      clearTryOnReservations: (festivalId) => {
        const { tryOnReservations } = get()
        set({
          tryOnReservations: tryOnReservations.filter(r => r.festivalId !== festivalId)
        })
      },
      
      getTryOnReservations: (festivalId?) => {
        const { tryOnReservations } = get()
        if (festivalId) {
          return tryOnReservations.filter(r => r.festivalId === festivalId)
        }
        return tryOnReservations
      },
      
      updateUserStory: (story) => {
        const current = get().userStory
        set({ userStory: { ...current, ...story } })
      },
      
      getRecommendations: () => {
        const { pieces, userStory, viewedPieces } = get()
        
        return pieces
          .filter(p => p.available && !viewedPieces.has(p.id))
          .sort((a, b) => {
            let scoreA = 0
            let scoreB = 0
            
            if (userStory.vibe) {
              if (a.vibe.toLowerCase().includes(userStory.vibe.toLowerCase())) scoreA += 3
              if (b.vibe.toLowerCase().includes(userStory.vibe.toLowerCase())) scoreB += 3
            }
            
            if (userStory.lookingFor) {
              if (a.createdFor.toLowerCase().includes(userStory.lookingFor.toLowerCase())) scoreA += 2
              if (b.createdFor.toLowerCase().includes(userStory.lookingFor.toLowerCase())) scoreB += 2
            }
            
            scoreA += a.hearts * 0.1 + a.views * 0.01
            scoreB += b.hearts * 0.1 + b.views * 0.01
            
            return scoreB - scoreA
          })
          .slice(0, 6)
      },
      
      getInsights: () => {
        const { pieces, userJourney } = get()

        const vibeCount: Record<string, number> = {}
        pieces.forEach(p => {
          vibeCount[p.vibe] = (vibeCount[p.vibe] || 0) + p.views
        })

        const popularVibes = Object.entries(vibeCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([vibe]) => vibe)

        return {
          popularVibes,
          emotionalConnections: pieces.reduce((sum, p) => sum + p.hearts, 0),
          averageTimeSpent: userJourney?.timeSpent || 0,
          returnRate: 0.73
        }
      },

      addToRecentlyViewed: (pieceId) => {
        const { recentlyViewed } = get()
        const filtered = recentlyViewed.filter(id => id !== pieceId)
        const updated = [pieceId, ...filtered].slice(0, 10)
        set({ recentlyViewed: updated })
      },

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      addToSearchHistory: (query) => {
        if (!query || query.trim().length === 0) return
        const { searchHistory } = get()
        const filtered = searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase())
        const updated = [query, ...filtered].slice(0, 10)
        set({ searchHistory: updated })
      },

      clearSearchHistory: () => set({ searchHistory: [] }),

      toggleFavorite: (pieceId) => {
        const { favorites } = get()
        const updated = favorites.includes(pieceId)
          ? favorites.filter(id => id !== pieceId)
          : [...favorites, pieceId]
        set({ favorites: updated })
      },

      isFavorite: (pieceId) => {
        return get().favorites.includes(pieceId)
      },

      // Search and Filter Functions
      setSearchQuery: (query) => set({ searchQuery: query }),

      setPriceRange: (range) => set({ priceRange: range }),

      setSelectedVibes: (vibes) => set({ selectedVibes: vibes }),

      setSelectedCategories: (categories) => set({ selectedCategories: categories }),

      setSelectedSizes: (sizes) => set({ selectedSizes: sizes }),

      setSortBy: (sort) => set({ sortBy: sort }),

      resetFilters: () => set({
        searchQuery: '',
        priceRange: [0, 600],
        selectedVibes: [],
        selectedCategories: [],
        selectedSizes: [],
        sortBy: 'newest'
      }),

      getFilteredPieces: () => {
        const {
          pieces,
          searchQuery,
          priceRange,
          selectedVibes,
          selectedCategories,
          selectedSizes,
          sortBy
        } = get()

        let filtered = [...pieces]

        // Search filter - search by name, story, vibe, fabric origin
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.story.toLowerCase().includes(query) ||
            p.vibe.toLowerCase().includes(query) ||
            p.fabricOrigin.toLowerCase().includes(query)
          )
        }

        // Price range filter
        filtered = filtered.filter(p =>
          p.price >= priceRange[0] && p.price <= priceRange[1]
        )

        // Vibe filter
        if (selectedVibes.length > 0) {
          filtered = filtered.filter(p =>
            selectedVibes.includes(p.vibe)
          )
        }

        // Category filter
        if (selectedCategories.length > 0) {
          filtered = filtered.filter(p =>
            p.category && selectedCategories.includes(p.category)
          )
        }

        // Size filter - only show pieces available in selected sizes
        if (selectedSizes.length > 0) {
          // This could be expanded if pieces have size availability data
          // For now, we'll just include all pieces when sizes are selected
          // as our mock data doesn't include detailed size availability
        }

        // Sorting
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return a.price - b.price
            case 'price-high':
              return b.price - a.price
            case 'most-popular':
              return b.hearts - a.hearts
            case 'newest':
            default:
              return 0
          }
        })

        return filtered
      }
    }),
    {
      name: 'kobys-threads-storage',
      partialize: (state) => ({
        heartedPieces: Array.from(state.heartedPieces),
        viewedPieces: Array.from(state.viewedPieces),
        cartItems: state.cartItems,
        tryOnReservations: state.tryOnReservations,
        userStory: state.userStory,
        recentlyViewed: state.recentlyViewed,
        searchHistory: state.searchHistory,
        favorites: state.favorites,
        searchQuery: state.searchQuery,
        priceRange: state.priceRange,
        selectedVibes: state.selectedVibes,
        selectedCategories: state.selectedCategories,
        selectedSizes: state.selectedSizes,
        sortBy: state.sortBy
      }),
      merge: (persistedState: any, currentState: Store) => {
        return {
          ...currentState,
          ...persistedState,
          heartedPieces: new Set(persistedState?.heartedPieces || []),
          viewedPieces: new Set(persistedState?.viewedPieces || [])
        }
      }
    }
  )
)

export default useStore