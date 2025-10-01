import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  orders: Order[]
  favorites: string[]
  tryOnRequests: TryOnRequest[]
  // Additional user details
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

interface Order {
  id: string
  date: string
  items: any[]
  total: number
  status: 'pending' | 'shipped' | 'delivered'
}

interface TryOnRequest {
  festivalId: string
  festivalName: string
  items: string[]
  status: 'pending' | 'confirmed' | 'completed'
  date: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  addToFavorites: (productId: string) => void
  removeFromFavorites: (productId: string) => void
  addTryOnRequest: (festivalId: string, festivalName: string, items: string[]) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('koby_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication - credentials from environment variables
    const users = {
      [import.meta.env.VITE_ADMIN_EMAIL || 'admin@kobysthreads.com']: {
        password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
        data: {
          id: '1',
          email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@kobysthreads.com',
          name: 'Admin User',
          role: 'admin' as const,
          orders: [],
          favorites: [],
          tryOnRequests: [],
          joinDate: '2024-01-01',
          lastLogin: new Date().toISOString()
        }
      },
      [import.meta.env.VITE_TEST_USER_EMAIL_1 || 'john@example.com']: {
        password: import.meta.env.VITE_TEST_USER_PASSWORD_1 || 'user123',
        data: {
          id: '2',
          email: import.meta.env.VITE_TEST_USER_EMAIL_1 || 'john@example.com',
          name: 'John Doe',
          role: 'user' as const,
          orders: [
            {
              id: 'ORD001',
              date: '2025-01-10',
              items: [{ name: 'African Heritage Jacket', price: 299, quantity: 1 }],
              total: 299,
              status: 'delivered' as const
            },
            {
              id: 'ORD002',
              date: '2025-01-15',
              items: [
                { name: 'Urban Kiz Shirt', price: 89, quantity: 2 },
                { name: 'Festival Pants', price: 129, quantity: 1 }
              ],
              total: 307,
              status: 'shipped' as const
            }
          ],
          favorites: ['piece-1', 'piece-3'],
          tryOnRequests: [
            {
              festivalId: 'fest-1',
              festivalName: 'Bangkok Kizomba Festival',
              items: ['piece-2', 'piece-4'],
              status: 'confirmed' as const,
              date: '2025-01-20'
            }
          ],
          phone: '+1 234 567 8900',
          address: {
            street: '123 Main Street',
            city: 'New York',
            country: 'USA',
            postalCode: '10001'
          },
          joinDate: '2024-06-15',
          lastLogin: new Date().toISOString()
        }
      },
      [import.meta.env.VITE_TEST_USER_EMAIL_2 || 'sarah@example.com']: {
        password: import.meta.env.VITE_TEST_USER_PASSWORD_2 || 'user456',
        data: {
          id: '3',
          email: import.meta.env.VITE_TEST_USER_EMAIL_2 || 'sarah@example.com',
          name: 'Sarah Johnson',
          role: 'user' as const,
          orders: [
            {
              id: 'ORD003',
              date: '2025-01-08',
              items: [{ name: 'Tarraxo Collection Dress', price: 189, quantity: 1 }],
              total: 189,
              status: 'delivered' as const
            }
          ],
          favorites: ['piece-2'],
          tryOnRequests: [],
          phone: '+44 20 7946 0958',
          address: {
            street: '45 Oxford Street',
            city: 'London',
            country: 'UK',
            postalCode: 'W1D 1BZ'
          },
          joinDate: '2024-09-20',
          lastLogin: new Date().toISOString()
        }
      }
    }

    // Check credentials
    const userAccount = users[email as keyof typeof users]
    if (userAccount && userAccount.password === password) {
      const userData = { ...userAccount.data, lastLogin: new Date().toISOString() }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('koby_user', JSON.stringify(userData))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('koby_user')
  }

  const addToFavorites = (productId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        favorites: [...user.favorites, productId]
      }
      setUser(updatedUser)
      localStorage.setItem('koby_user', JSON.stringify(updatedUser))
    }
  }

  const removeFromFavorites = (productId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        favorites: user.favorites.filter(id => id !== productId)
      }
      setUser(updatedUser)
      localStorage.setItem('koby_user', JSON.stringify(updatedUser))
    }
  }

  const addTryOnRequest = (festivalId: string, festivalName: string, items: string[]) => {
    if (user) {
      const newRequest: TryOnRequest = {
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

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      addToFavorites,
      removeFromFavorites,
      addTryOnRequest
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext