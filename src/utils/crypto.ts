/**
 * Client-side cryptographic utilities
 * Uses Web Crypto API for secure password hashing
 *
 * ⚠️ SECURITY WARNING - DEMO ONLY ⚠️
 * This implementation is for demonstration purposes only.
 *
 * FOR PRODUCTION, YOU MUST:
 * 1. Use server-side password hashing (bcrypt/argon2 with salt)
 * 2. Never hash passwords on the client
 * 3. Use HTTPS for all authentication requests
 * 4. Implement proper session management with httpOnly cookies
 * 5. Add rate limiting and account lockout
 * 6. Use a proper authentication service (Auth0, Firebase Auth, etc.)
 */

/**
 * Hash a password using SHA-256
 * ⚠️ DEMO ONLY - Use server-side bcrypt/argon2 in production
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password)
  return hashedInput === hash
}

/**
 * Generate a secure random session token
 */
export function generateSecureToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * ⚠️ DEMO CREDENTIALS - FOR TESTING ONLY ⚠️
 *
 * These credentials are for demonstration purposes.
 * In production:
 * - Store credentials in a secure database
 * - Use environment variables for sensitive data
 * - Never expose password hashes in client code
 *
 * Demo Accounts:
 * - Admin: admin@kobysthreads.com / SecureAdmin2025!
 * - User: john@example.com / SecureUser2025!
 * - User: sarah@example.com / SecureUser2025!
 */
export const DEMO_CREDENTIALS = {
  ADMIN_EMAIL: 'admin@kobysthreads.com',
  ADMIN_PASSWORD_HASH: '310d38607aae5ad9db72c393f80300b2462ae44a0d0e24561fc1a7bec6756466',

  USER_EMAIL: 'john@example.com',
  USER_PASSWORD_HASH: '055d5d79ac617fd2d7f532b58a772f9c5ca56c09e2c75cb44f4b9e97705ba64e',

  USER2_EMAIL: 'sarah@example.com',
  USER2_PASSWORD_HASH: '055d5d79ac617fd2d7f532b58a772f9c5ca56c09e2c75cb44f4b9e97705ba64e'
}
