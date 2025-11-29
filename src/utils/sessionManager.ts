import { generateSecureToken } from './crypto'

/**
 * Secure session management
 * Uses sessionStorage instead of localStorage for sensitive data
 * Sessions expire when browser is closed
 */

interface SessionData {
  userId: string
  token: string
  createdAt: number
  expiresAt: number
}

const SESSION_KEY = 'koby_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Create a new session
 * Returns session token
 */
export function createSession(userId: string): string {
  const token = generateSecureToken()
  const now = Date.now()

  const sessionData: SessionData = {
    userId,
    token,
    createdAt: now,
    expiresAt: now + SESSION_DURATION
  }

  // Store in sessionStorage (expires on browser close)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))

  return token
}

/**
 * Get current session if valid
 * Returns null if session expired or doesn't exist
 */
export function getSession(): SessionData | null {
  const sessionStr = sessionStorage.getItem(SESSION_KEY)

  if (!sessionStr) {
    return null
  }

  try {
    const session: SessionData = JSON.parse(sessionStr)
    const now = Date.now()

    // Check if session expired
    if (now > session.expiresAt) {
      clearSession()
      return null
    }

    return session
  } catch {
    clearSession()
    return null
  }
}

/**
 * Validate a session token
 */
export function validateSession(token: string): boolean {
  const session = getSession()
  return session !== null && session.token === token
}

/**
 * Clear the current session
 */
export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

/**
 * Get user ID from current session
 */
export function getSessionUserId(): string | null {
  const session = getSession()
  return session?.userId || null
}

/**
 * Check if there's an active session
 */
export function hasActiveSession(): boolean {
  return getSession() !== null
}

/**
 * Extend session expiration
 * Call this on user activity to keep session alive
 */
export function extendSession(): boolean {
  const session = getSession()

  if (!session) {
    return false
  }

  const now = Date.now()
  session.expiresAt = now + SESSION_DURATION

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return true
}

/**
 * Store minimal user data in localStorage
 * Only stores non-sensitive display information
 */
interface MinimalUserData {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

const USER_DATA_KEY = 'koby_user_data'

export function storeUserData(userData: MinimalUserData): void {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
}

export function getUserData(): MinimalUserData | null {
  const dataStr = localStorage.getItem(USER_DATA_KEY)

  if (!dataStr) {
    return null
  }

  try {
    return JSON.parse(dataStr)
  } catch {
    return null
  }
}

export function clearUserData(): void {
  localStorage.removeItem(USER_DATA_KEY)
}
