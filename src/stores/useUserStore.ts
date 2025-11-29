import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { hashPassword, verifyPassword, DEMO_CREDENTIALS } from '../utils/crypto'
import { createSession as createSecureSession, validateSession as validateSecureSession } from '../utils/sessionManager'

// User interfaces
export interface UserAddress {
  street: string
  city: string
  country: string
  postalCode: string
}

export interface OrderItem {
  name: string
  price: number
  quantity: number
}

export interface UserOrder {
  id: string
  date: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

export interface TryOnRequest {
  festivalId: string
  festivalName: string
  items: string[]
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  date: string
}

export interface StoredUser {
  id: string
  email: string
  passwordHash: string // SHA-256 hash of password
  name: string
  role: 'admin' | 'user'
  phone?: string
  address?: UserAddress
  orders: UserOrder[]
  favorites: string[]
  tryOnRequests: TryOnRequest[]
  joinDate: string
  lastLogin: string
  isActive: boolean
  emailVerified: boolean
  notificationPreferences: {
    orderUpdates: boolean
    marketing: boolean
    tryOnReminders: boolean
  }
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  adminUsers: number
  recentSignups: number // Last 30 days
}

interface UserStore {
  // State
  users: StoredUser[]
  currentSession: {
    userId: string | null
    loginTime: string | null
    sessionToken: string | null
  }

  // User Management Actions
  createUser: (userData: Omit<StoredUser, 'id' | 'joinDate' | 'lastLogin' | 'orders' | 'favorites' | 'tryOnRequests' | 'isActive' | 'emailVerified' | 'notificationPreferences'>) => StoredUser | null
  updateUser: (userId: string, updates: Partial<StoredUser>) => boolean
  deleteUser: (userId: string) => boolean
  getUserById: (userId: string) => StoredUser | undefined
  getUserByEmail: (email: string) => StoredUser | undefined

  // Authentication Actions
  authenticate: (email: string, password: string) => Promise<StoredUser | null>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string; user?: StoredUser }>
  changePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  resetPassword: (userId: string, newPassword: string) => Promise<boolean> // Admin only
  logout: () => void

  // Session Management
  createSession: (userId: string) => string // Returns session token
  validateSession: (token: string) => boolean

  // User Profile Actions
  updateProfile: (userId: string, updates: { name?: string; phone?: string; address?: UserAddress }) => boolean
  updateNotificationPreferences: (userId: string, preferences: Partial<StoredUser['notificationPreferences']>) => boolean

  // Order Management (for users)
  addOrder: (userId: string, order: Omit<UserOrder, 'id'>) => string | null // Returns order ID
  updateOrderStatus: (userId: string, orderId: string, status: UserOrder['status']) => boolean

  // Favorites Management
  addFavorite: (userId: string, productId: string) => boolean
  removeFavorite: (userId: string, productId: string) => boolean

  // Try-On Management
  addTryOnRequest: (userId: string, request: Omit<TryOnRequest, 'status' | 'date'>) => boolean
  updateTryOnStatus: (userId: string, festivalId: string, status: TryOnRequest['status']) => boolean

  // Admin Actions
  toggleUserStatus: (userId: string) => boolean
  promoteToAdmin: (userId: string) => boolean
  demoteFromAdmin: (userId: string) => boolean
  getUserStats: () => UserStats

  // Bulk Actions
  exportUsers: () => string // JSON string
  importUsers: (jsonData: string) => Promise<{ success: boolean; imported: number; errors: string[] }>
}

// Generate unique IDs
const generateId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
const generateOrderId = () => `ORD${Date.now().toString(36).toUpperCase()}`
const generateSessionToken = () => `sess_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`

// Default users (seeded on first load)
// Passwords are now hashed using SHA-256
const defaultUsers: StoredUser[] = [
  {
    id: 'user_admin_001',
    email: DEMO_CREDENTIALS.ADMIN_EMAIL,
    passwordHash: DEMO_CREDENTIALS.ADMIN_PASSWORD_HASH, // SecureAdmin2025!
    name: 'Admin User',
    role: 'admin',
    orders: [],
    favorites: [],
    tryOnRequests: [],
    joinDate: '2024-01-01T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
    emailVerified: true,
    notificationPreferences: {
      orderUpdates: true,
      marketing: false,
      tryOnReminders: true
    }
  },
  {
    id: 'user_john_002',
    email: DEMO_CREDENTIALS.USER_EMAIL,
    passwordHash: DEMO_CREDENTIALS.USER_PASSWORD_HASH, // SecureUser2025!
    name: 'John Doe',
    role: 'user',
    phone: '+1 234 567 8900',
    address: {
      street: '123 Main Street',
      city: 'New York',
      country: 'USA',
      postalCode: '10001'
    },
    orders: [
      {
        id: 'ORD001',
        date: '2025-01-10',
        items: [{ name: 'African Heritage Jacket', price: 299, quantity: 1 }],
        total: 299,
        status: 'delivered'
      },
      {
        id: 'ORD002',
        date: '2025-01-15',
        items: [
          { name: 'Urban Kiz Shirt', price: 89, quantity: 2 },
          { name: 'Festival Pants', price: 129, quantity: 1 }
        ],
        total: 307,
        status: 'shipped'
      }
    ],
    favorites: ['piece-1', 'piece-3'],
    tryOnRequests: [
      {
        festivalId: 'fest-1',
        festivalName: 'Bangkok Kizomba Festival',
        items: ['piece-2', 'piece-4'],
        status: 'confirmed',
        date: '2025-01-20'
      }
    ],
    joinDate: '2024-06-15T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
    emailVerified: true,
    notificationPreferences: {
      orderUpdates: true,
      marketing: true,
      tryOnReminders: true
    }
  },
  {
    id: 'user_sarah_003',
    email: DEMO_CREDENTIALS.USER2_EMAIL,
    passwordHash: DEMO_CREDENTIALS.USER2_PASSWORD_HASH, // SecureUser2025!
    name: 'Sarah Johnson',
    role: 'user',
    phone: '+44 20 7946 0958',
    address: {
      street: '45 Oxford Street',
      city: 'London',
      country: 'UK',
      postalCode: 'W1D 1BZ'
    },
    orders: [
      {
        id: 'ORD003',
        date: '2025-01-08',
        items: [{ name: 'Tarraxo Collection Dress', price: 189, quantity: 1 }],
        total: 189,
        status: 'delivered'
      }
    ],
    favorites: ['piece-2'],
    tryOnRequests: [],
    joinDate: '2024-09-20T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
    emailVerified: true,
    notificationPreferences: {
      orderUpdates: true,
      marketing: false,
      tryOnReminders: true
    }
  }
]

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: defaultUsers,
      currentSession: {
        userId: null,
        loginTime: null,
        sessionToken: null
      },

      // User Management
      createUser: (userData) => {
        const { users } = get()

        // Check if email already exists
        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
          return null
        }

        const newUser: StoredUser = {
          ...userData,
          id: generateId(),
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          orders: [],
          favorites: [],
          tryOnRequests: [],
          isActive: true,
          emailVerified: false,
          notificationPreferences: {
            orderUpdates: true,
            marketing: false,
            tryOnReminders: true
          }
        }

        set({ users: [...users, newUser] })
        return newUser
      },

      updateUser: (userId, updates) => {
        const { users } = get()
        const userIndex = users.findIndex(u => u.id === userId)

        if (userIndex === -1) return false

        const updatedUsers = [...users]
        updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...updates }
        set({ users: updatedUsers })
        return true
      },

      deleteUser: (userId) => {
        const { users, currentSession } = get()

        // Don't allow deleting currently logged in user
        if (currentSession.userId === userId) return false

        // Don't allow deleting last admin
        const user = users.find(u => u.id === userId)
        if (user?.role === 'admin') {
          const adminCount = users.filter(u => u.role === 'admin').length
          if (adminCount <= 1) return false
        }

        set({ users: users.filter(u => u.id !== userId) })
        return true
      },

      getUserById: (userId) => {
        return get().users.find(u => u.id === userId)
      },

      getUserByEmail: (email) => {
        return get().users.find(u => u.email.toLowerCase() === email.toLowerCase())
      },

      // Authentication
      authenticate: async (email, password) => {
        const user = get().getUserByEmail(email)

        if (!user || !user.isActive) {
          return null
        }

        // Verify password hash
        const isValidPassword = await verifyPassword(password, user.passwordHash)

        if (!isValidPassword) {
          return null
        }

        // Update last login
        get().updateUser(user.id, { lastLogin: new Date().toISOString() })

        // Create secure session
        const sessionToken = createSecureSession(user.id)

        return { ...user, lastLogin: new Date().toISOString() }
      },

      register: async (email, password, name) => {
        const { users } = get()

        // Validation
        if (!email || !password || !name) {
          return { success: false, message: 'All fields are required' }
        }

        if (password.length < 6) {
          return { success: false, message: 'Password must be at least 6 characters' }
        }

        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, message: 'An account with this email already exists' }
        }

        // Hash password before storing
        const passwordHash = await hashPassword(password)

        const newUser = get().createUser({
          email,
          passwordHash,
          name,
          role: 'user'
        })

        if (newUser) {
          return { success: true, message: 'Account created successfully', user: newUser }
        }

        return { success: false, message: 'Failed to create account' }
      },

      changePassword: async (userId, oldPassword, newPassword) => {
        const user = get().getUserById(userId)

        if (!user) {
          return { success: false, message: 'User not found' }
        }

        // Verify old password
        const isValidOldPassword = await verifyPassword(oldPassword, user.passwordHash)

        if (!isValidOldPassword) {
          return { success: false, message: 'Current password is incorrect' }
        }

        if (newPassword.length < 6) {
          return { success: false, message: 'New password must be at least 6 characters' }
        }

        // Hash new password
        const newPasswordHash = await hashPassword(newPassword)
        const success = get().updateUser(userId, { passwordHash: newPasswordHash })

        return success
          ? { success: true, message: 'Password changed successfully' }
          : { success: false, message: 'Failed to change password' }
      },

      resetPassword: async (userId, newPassword) => {
        if (newPassword.length < 6) return false
        const newPasswordHash = await hashPassword(newPassword)
        return get().updateUser(userId, { passwordHash: newPasswordHash })
      },

      logout: () => {
        set({
          currentSession: {
            userId: null,
            loginTime: null,
            sessionToken: null
          }
        })
      },

      // Session Management
      createSession: (userId) => {
        const token = generateSessionToken()
        set({
          currentSession: {
            userId,
            loginTime: new Date().toISOString(),
            sessionToken: token
          }
        })
        return token
      },

      validateSession: (token) => {
        const { currentSession } = get()
        return currentSession.sessionToken === token
      },

      // Profile Management
      updateProfile: (userId, updates) => {
        const user = get().getUserById(userId)
        if (!user) return false

        const profileUpdates: Partial<StoredUser> = {}
        if (updates.name) profileUpdates.name = updates.name
        if (updates.phone !== undefined) profileUpdates.phone = updates.phone
        if (updates.address) profileUpdates.address = updates.address

        return get().updateUser(userId, profileUpdates)
      },

      updateNotificationPreferences: (userId, preferences) => {
        const user = get().getUserById(userId)
        if (!user) return false

        return get().updateUser(userId, {
          notificationPreferences: {
            ...user.notificationPreferences,
            ...preferences
          }
        })
      },

      // Order Management
      addOrder: (userId, order) => {
        const user = get().getUserById(userId)
        if (!user) return null

        const orderId = generateOrderId()
        const newOrder: UserOrder = {
          ...order,
          id: orderId
        }

        get().updateUser(userId, {
          orders: [...user.orders, newOrder]
        })

        return orderId
      },

      updateOrderStatus: (userId, orderId, status) => {
        const user = get().getUserById(userId)
        if (!user) return false

        const updatedOrders = user.orders.map(o =>
          o.id === orderId ? { ...o, status } : o
        )

        return get().updateUser(userId, { orders: updatedOrders })
      },

      // Favorites
      addFavorite: (userId, productId) => {
        const user = get().getUserById(userId)
        if (!user || user.favorites.includes(productId)) return false

        return get().updateUser(userId, {
          favorites: [...user.favorites, productId]
        })
      },

      removeFavorite: (userId, productId) => {
        const user = get().getUserById(userId)
        if (!user) return false

        return get().updateUser(userId, {
          favorites: user.favorites.filter(id => id !== productId)
        })
      },

      // Try-On Requests
      addTryOnRequest: (userId, request) => {
        const user = get().getUserById(userId)
        if (!user) return false

        const newRequest: TryOnRequest = {
          ...request,
          status: 'pending',
          date: new Date().toISOString()
        }

        return get().updateUser(userId, {
          tryOnRequests: [...user.tryOnRequests, newRequest]
        })
      },

      updateTryOnStatus: (userId, festivalId, status) => {
        const user = get().getUserById(userId)
        if (!user) return false

        const updatedRequests = user.tryOnRequests.map(r =>
          r.festivalId === festivalId ? { ...r, status } : r
        )

        return get().updateUser(userId, { tryOnRequests: updatedRequests })
      },

      // Admin Actions
      toggleUserStatus: (userId) => {
        const user = get().getUserById(userId)
        if (!user) return false

        // Don't allow disabling the last active admin
        if (user.role === 'admin' && user.isActive) {
          const activeAdmins = get().users.filter(u => u.role === 'admin' && u.isActive)
          if (activeAdmins.length <= 1) return false
        }

        return get().updateUser(userId, { isActive: !user.isActive })
      },

      promoteToAdmin: (userId) => {
        const user = get().getUserById(userId)
        if (!user || user.role === 'admin') return false

        return get().updateUser(userId, { role: 'admin' })
      },

      demoteFromAdmin: (userId) => {
        const user = get().getUserById(userId)
        if (!user || user.role !== 'admin') return false

        // Don't allow demoting the last admin
        const adminCount = get().users.filter(u => u.role === 'admin').length
        if (adminCount <= 1) return false

        return get().updateUser(userId, { role: 'user' })
      },

      getUserStats: () => {
        const { users } = get()
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        return {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.isActive).length,
          adminUsers: users.filter(u => u.role === 'admin').length,
          recentSignups: users.filter(u => new Date(u.joinDate) > thirtyDaysAgo).length
        }
      },

      // Bulk Actions
      exportUsers: () => {
        const { users } = get()
        // Export without password hashes for security
        const exportData = users.map(({ passwordHash, ...user }) => user)
        return JSON.stringify(exportData, null, 2)
      },

      importUsers: async (jsonData) => {
        try {
          const importedUsers = JSON.parse(jsonData)
          if (!Array.isArray(importedUsers)) {
            return { success: false, imported: 0, errors: ['Invalid data format'] }
          }

          const errors: string[] = []
          let imported = 0
          const { users } = get()

          // Hash default password once
          const defaultPasswordHash = await hashPassword('ChangeMe2025!')

          const validUsers = importedUsers.filter((userData: Partial<StoredUser>) => {
            // Validate required fields
            if (!userData.email || !userData.name) {
              errors.push(`Skipped user: missing email or name`)
              return false
            }

            // Check for duplicates
            if (users.some(u => u.email.toLowerCase() === userData.email!.toLowerCase())) {
              errors.push(`Skipped ${userData.email}: already exists`)
              return false
            }

            imported++
            return true
          })

          const newUsers = validUsers.map((userData: Partial<StoredUser>) => ({
            id: generateId(),
            email: userData.email!,
            passwordHash: defaultPasswordHash, // Default hashed password for imported users
            name: userData.name!,
            role: (userData.role || 'user') as 'admin' | 'user',
            phone: userData.phone,
            address: userData.address,
            orders: userData.orders || [],
            favorites: userData.favorites || [],
            tryOnRequests: userData.tryOnRequests || [],
            joinDate: userData.joinDate || new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: userData.isActive ?? true,
            emailVerified: false,
            notificationPreferences: userData.notificationPreferences || {
              orderUpdates: true,
              marketing: false,
              tryOnReminders: true
            }
          }))

          set({ users: [...users, ...newUsers] })

          return { success: true, imported, errors }
        } catch {
          return { success: false, imported: 0, errors: ['Invalid JSON format'] }
        }
      }
    }),
    {
      name: 'koby-user-store',
      version: 1
    }
  )
)

export default useUserStore
