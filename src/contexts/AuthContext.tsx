import { createContext, useState, useEffect, type ReactNode } from 'react'
import { useUserStore, type StoredUser, type UserAddress, type UserOrder, type TryOnRequest } from '../stores/useUserStore'

// Re-export types for backward compatibility
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  orders: Order[]
  favorites: string[]
  tryOnRequests: TryOnRequestLegacy[]
  phone?: string
  address?: {
    street: string
    city: string
    country: string
    postalCode: string
  }
  joinDate: string
  lastLogin: string
}

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'shipped' | 'delivered'
}

interface TryOnRequestLegacy {
  festivalId: string
  festivalName: string
  items: string[]
  status: 'pending' | 'confirmed' | 'completed'
  date: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  updateProfile: (updates: { name?: string; phone?: string; address?: UserAddress }) => Promise<boolean>
  addToFavorites: (productId: string) => void
  removeFromFavorites: (productId: string) => void
  addTryOnRequest: (festivalId: string, festivalName: string, items: string[]) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Convert StoredUser to legacy User format for backward compatibility
const convertToLegacyUser = (storedUser: StoredUser): User => {
  return {
    id: storedUser.id,
    email: storedUser.email,
    name: storedUser.name,
    role: storedUser.role,
    orders: storedUser.orders.map(o => ({
      ...o,
      status: o.status === 'processing' || o.status === 'cancelled'
        ? 'pending'
        : o.status as 'pending' | 'shipped' | 'delivered'
    })),
    favorites: storedUser.favorites,
    tryOnRequests: storedUser.tryOnRequests.map(t => ({
      ...t,
      status: t.status === 'cancelled'
        ? 'pending'
        : t.status as 'pending' | 'confirmed' | 'completed'
    })),
    phone: storedUser.phone,
    address: storedUser.address,
    joinDate: storedUser.joinDate,
    lastLogin: storedUser.lastLogin
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Get functions from user store
  const {
    authenticate,
    register: storeRegister,
    changePassword: storeChangePassword,
    updateProfile: storeUpdateProfile,
    addFavorite,
    removeFavorite,
    addTryOnRequest: storeAddTryOnRequest,
    getUserById
  } = useUserStore()

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('koby_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        // Verify user still exists in store
        const storeUser = getUserById(userData.id)
        if (storeUser && storeUser.isActive) {
          setUser(convertToLegacyUser(storeUser))
          setIsAuthenticated(true)
        } else {
          // User no longer exists or is inactive, clear session
          localStorage.removeItem('koby_user')
        }
      } catch {
        localStorage.removeItem('koby_user')
      }
    }
  }, [getUserById])

  const login = async (email: string, password: string): Promise<boolean> => {
    const authenticatedUser = await authenticate(email, password)

    if (authenticatedUser) {
      const legacyUser = convertToLegacyUser(authenticatedUser)
      setUser(legacyUser)
      setIsAuthenticated(true)
      localStorage.setItem('koby_user', JSON.stringify(legacyUser))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('koby_user')
  }

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message: string }> => {
    const result = await storeRegister(email, password, name)

    if (result.success && result.user) {
      // Auto-login after registration
      const legacyUser = convertToLegacyUser(result.user)
      setUser(legacyUser)
      setIsAuthenticated(true)
      localStorage.setItem('koby_user', JSON.stringify(legacyUser))
    }

    return { success: result.success, message: result.message }
  }

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'Not authenticated' }
    }

    return storeChangePassword(user.id, oldPassword, newPassword)
  }

  const updateProfile = async (updates: { name?: string; phone?: string; address?: UserAddress }): Promise<boolean> => {
    if (!user) return false

    const success = storeUpdateProfile(user.id, updates)

    if (success) {
      // Refresh user data
      const updatedStoreUser = getUserById(user.id)
      if (updatedStoreUser) {
        const legacyUser = convertToLegacyUser(updatedStoreUser)
        setUser(legacyUser)
        localStorage.setItem('koby_user', JSON.stringify(legacyUser))
      }
    }

    return success
  }

  const addToFavorites = (productId: string) => {
    if (user) {
      const success = addFavorite(user.id, productId)
      if (success) {
        const updatedUser = {
          ...user,
          favorites: [...user.favorites, productId]
        }
        setUser(updatedUser)
        localStorage.setItem('koby_user', JSON.stringify(updatedUser))
      }
    }
  }

  const removeFromFavorites = (productId: string) => {
    if (user) {
      const success = removeFavorite(user.id, productId)
      if (success) {
        const updatedUser = {
          ...user,
          favorites: user.favorites.filter(id => id !== productId)
        }
        setUser(updatedUser)
        localStorage.setItem('koby_user', JSON.stringify(updatedUser))
      }
    }
  }

  const addTryOnRequest = (festivalId: string, festivalName: string, items: string[]) => {
    if (user) {
      const success = storeAddTryOnRequest(user.id, { festivalId, festivalName, items })
      if (success) {
        const newRequest: TryOnRequestLegacy = {
          festivalId,
          festivalName,
          items,
          status: 'pending',
          date: new Date().toISOString()
        }

        const updatedUser = {
          ...user,
          tryOnRequests: [...user.tryOnRequests, newRequest]
        }
        setUser(updatedUser)
        localStorage.setItem('koby_user', JSON.stringify(updatedUser))
      }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      register,
      changePassword,
      updateProfile,
      addToFavorites,
      removeFromFavorites,
      addTryOnRequest
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Re-export useAuth hook for backward compatibility
export { useAuth } from './useAuthHook'

export default AuthContext
