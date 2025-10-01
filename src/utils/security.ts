// Security utilities for input validation and sanitization

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return ''
  
  // Remove HTML tags and script injections
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Rate limiting for API calls
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  private readonly maxAttempts: number
  private readonly windowMs: number
  
  constructor(maxAttempts = 10, windowMs = 60000) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }
  
  checkLimit(identifier: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(
      timestamp => now - timestamp < this.windowMs
    )
    
    if (validAttempts.length >= this.maxAttempts) {
      console.warn(`[Security] Rate limit exceeded for ${identifier}`)
      return false
    }
    
    validAttempts.push(now)
    this.attempts.set(identifier, validAttempts)
    return true
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
}

export const loginRateLimiter = new RateLimiter(5, 60000) // 5 attempts per minute
export const apiRateLimiter = new RateLimiter(100, 60000) // 100 requests per minute

/**
 * Validates and sanitizes product quantities
 */
export const validateQuantity = (quantity: any): number => {
  const num = parseInt(quantity, 10)
  
  if (isNaN(num) || num < 1) {
    return 1
  }
  
  if (num > 10) {
    console.warn('[Security] Quantity limit exceeded, capping at 10')
    return 10
  }
  
  return num
}

/**
 * Validates product IDs to prevent injection
 */
export const validateProductId = (id: string): boolean => {
  // Only allow alphanumeric and hyphens
  const idRegex = /^[a-zA-Z0-9-]+$/
  return idRegex.test(id)
}

/**
 * Secure session storage with encryption simulation
 */
export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const encoded = btoa(JSON.stringify(value))
      localStorage.setItem(key, encoded)
    } catch (error) {
      console.error('[Security] Failed to store secure data:', error)
    }
  },
  
  getItem: (key: string): any => {
    try {
      const encoded = localStorage.getItem(key)
      if (!encoded) return null
      return JSON.parse(atob(encoded))
    } catch (error) {
      console.error('[Security] Failed to retrieve secure data:', error)
      return null
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key)
  }
}

/**
 * Content Security Policy headers
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
}

/**
 * Validates festival selection
 */
export const validateFestivalSelection = (
  festivalId: string,
  selectedPieces: string[]
): { isValid: boolean; error?: string } => {
  if (!festivalId || !validateProductId(festivalId)) {
    return { isValid: false, error: 'Invalid festival selection' }
  }
  
  if (!Array.isArray(selectedPieces)) {
    return { isValid: false, error: 'Invalid piece selection' }
  }
  
  if (selectedPieces.length === 0) {
    return { isValid: false, error: 'Please select at least one piece' }
  }
  
  if (selectedPieces.length > 5) {
    return { isValid: false, error: 'Maximum 5 pieces allowed' }
  }
  
  // Validate each piece ID
  for (const pieceId of selectedPieces) {
    if (!validateProductId(pieceId)) {
      return { isValid: false, error: 'Invalid piece selection' }
    }
  }
  
  return { isValid: true }
}

/**
 * Sanitizes review content
 */
export const sanitizeReview = (review: {
  rating: number
  comment: string
}): { isValid: boolean; sanitized?: any; error?: string } => {
  if (!review.rating || review.rating < 1 || review.rating > 5) {
    return { isValid: false, error: 'Invalid rating' }
  }
  
  if (!review.comment || review.comment.trim().length < 10) {
    return { isValid: false, error: 'Review must be at least 10 characters' }
  }
  
  if (review.comment.length > 1000) {
    return { isValid: false, error: 'Review must be less than 1000 characters' }
  }
  
  return {
    isValid: true,
    sanitized: {
      rating: Math.floor(review.rating),
      comment: sanitizeInput(review.comment)
    }
  }
}

/**
 * Logs security events for audit
 */
export const logSecurityEvent = (
  event: string,
  details: any,
  severity: 'info' | 'warning' | 'error' = 'info'
): void => {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    event,
    details,
    severity,
    userAgent: navigator.userAgent,
    url: window.location.href
  }
  
  // In production, this would send to a security monitoring service
  if (severity === 'error') {
    console.error('[Security Event]', logEntry)
  } else if (severity === 'warning') {
    console.warn('[Security Event]', logEntry)
  } else {
    console.log('[Security Event]', logEntry)
  }
}

export default {
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateQuantity,
  validateProductId,
  secureStorage,
  CSP_HEADERS,
  validateFestivalSelection,
  sanitizeReview,
  logSecurityEvent,
  loginRateLimiter,
  apiRateLimiter
}