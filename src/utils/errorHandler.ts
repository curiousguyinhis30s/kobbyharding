/**
 * Error Handling Utilities
 * Centralized error handling with consistent patterns
 */

import { useToast } from '../components/useToast'

// ============================================================================
// ERROR TYPES
// ============================================================================

export class AppError extends Error {
  public code?: string
  public statusCode?: number
  public details?: unknown

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 500)
    this.name = 'NetworkError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

// ============================================================================
// ERROR HANDLING FUNCTIONS
// ============================================================================

/**
 * Get user-friendly error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return 'An unexpected error occurred'
}

/**
 * Log error to console with context
 */
export function logError(error: unknown, context?: string): void {
  const errorMessage = getErrorMessage(error)
  const contextStr = context ? `[${context}]` : ''

  console.error(`${contextStr} Error:`, errorMessage)

  if (error instanceof Error) {
    console.error('Stack:', error.stack)
  }

  if (error instanceof AppError && error.details) {
    console.error('Details:', error.details)
  }
}

/**
 * Handle error with toast notification
 */
export function handleError(
  error: unknown,
  context?: string,
  customMessage?: string
): void {
  logError(error, context)

  const message = customMessage || getErrorMessage(error)
  const { addToast } = useToast.getState()
  addToast('error', message)
}

/**
 * Handle async operation with error handling
 */
export async function handleAsync<T>(
  operation: () => Promise<T>,
  errorContext?: string,
  errorMessage?: string
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    handleError(error, errorContext, errorMessage)
    return null
  }
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    logError(error, 'JSON Parse')
    return fallback
  }
}

/**
 * Safe localStorage operations
 */
export const safeLocalStorage = {
  getItem<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : fallback
    } catch (error) {
      logError(error, `localStorage.getItem(${key})`)
      return fallback
    }
  },

  setItem(key: string, value: unknown): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      logError(error, `localStorage.setItem(${key})`)
      return false
    }
  },

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      logError(error, `localStorage.removeItem(${key})`)
      return false
    }
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Assert a condition is true, throw ValidationError if not
 */
export function assert(
  condition: boolean,
  message: string,
  details?: unknown
): asserts condition {
  if (!condition) {
    throw new ValidationError(message, details)
  }
}

/**
 * Validate required field
 */
export function validateRequired(
  value: unknown,
  fieldName: string
): string | undefined {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`
  }
  return undefined
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string | undefined {
  if (!email || !email.trim()) {
    return 'Email is required'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }

  return undefined
}

/**
 * Validate minimum length
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): string | undefined {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`
  }
  return undefined
}

/**
 * Validate maximum length
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): string | undefined {
  if (value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`
  }
  return undefined
}

/**
 * Validate numeric range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | undefined {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`
  }
  return undefined
}

// ============================================================================
// RETRY LOGIC
// ============================================================================

/**
 * Retry an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt)
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

// ============================================================================
// FORM VALIDATION HELPERS
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Validate multiple fields and return all errors
 */
export function validateFields(
  validations: Array<{ field: string; error?: string }>
): ValidationResult {
  const errors: Record<string, string> = {}

  for (const { field, error } of validations) {
    if (error) {
      errors[field] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Clear specific field error
 */
export function clearFieldError(
  errors: Record<string, string>,
  field: string
): Record<string, string> {
  const { [field]: _, ...rest } = errors
  return rest
}

// ============================================================================
// BOUNDARY ERROR HANDLER
// ============================================================================

/**
 * Get error info for Error Boundary
 */
export function getErrorBoundaryInfo(error: Error, errorInfo?: { componentStack?: string }) {
  return {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    timestamp: new Date().toISOString()
  }
}

/**
 * Report error to monitoring service (placeholder for future implementation)
 */
export function reportError(
  error: Error,
  context?: Record<string, unknown>
): void {
  // In production, send to error monitoring service (Sentry, LogRocket, etc.)
  console.error('Error Report:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  })
}
