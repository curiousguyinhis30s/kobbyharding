/**
 * Global Constants
 * Central location for all magic numbers and repeated values
 */

// ============================================================================
// ANIMATION & TRANSITIONS
// ============================================================================
export const ANIMATION_DURATION = {
  INSTANT: 0,
  FAST: 0.2,
  DEFAULT: 0.3,
  MEDIUM: 0.5,
  SLOW: 0.8,
  VERY_SLOW: 1.5
} as const

export const TOAST_DURATION = 4000 // milliseconds
export const DEBOUNCE_DELAY = 300 // milliseconds
export const THROTTLE_DELAY = 500 // milliseconds
export const AUTO_SAVE_DELAY = 1000 // milliseconds

// ============================================================================
// BREAKPOINTS
// ============================================================================
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1280,
  EXTRA_LARGE: 1536
} as const

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================
export const Z_INDEX = {
  BACKDROP: 1000,
  MODAL: 2000,
  DROPDOWN: 3000,
  TOAST: 9999,
  TOOLTIP: 10000
} as const

// ============================================================================
// COLORS (Opacity Values)
// ============================================================================
export const OPACITY = {
  TRANSPARENT: 0,
  LIGHT: 0.05,
  SUBTLE: 0.1,
  MEDIUM: 0.3,
  VISIBLE: 0.5,
  STRONG: 0.7,
  HEAVY: 0.8,
  OPAQUE: 1
} as const

// ============================================================================
// SPACING
// ============================================================================
export const SPACING = {
  XS: '4px',
  SM: '8px',
  MD: '12px',
  LG: '16px',
  XL: '24px',
  XXL: '32px',
  XXXL: '48px'
} as const

// ============================================================================
// BORDER RADIUS
// ============================================================================
export const BORDER_RADIUS = {
  NONE: 0,
  SM: '4px',
  MD: '6px',
  LG: '8px',
  XL: '12px',
  ROUND: '50%'
} as const

// ============================================================================
// VALIDATION
// ============================================================================
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_CARD_NUMBER_LENGTH: 13,
  MAX_CARD_NUMBER_LENGTH: 19,
  CVC_LENGTH_MIN: 3,
  CVC_LENGTH_MAX: 4,
  MIN_POSTAL_CODE_LENGTH: 3,
  MAX_POSTAL_CODE_LENGTH: 10,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const

// ============================================================================
// CART & ORDERS
// ============================================================================
export const CART = {
  MAX_QUANTITY: 10,
  MIN_QUANTITY: 1,
  FREE_SHIPPING_THRESHOLD: 300
} as const

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const

// ============================================================================
// SIMULATION & MOCK DATA
// ============================================================================
export const SIMULATION = {
  PAYMENT_PROCESSING_DELAY: 2000,
  API_CALL_DELAY: 1500,
  DATA_FETCH_DELAY: 800
} as const

// ============================================================================
// TOAST POSITIONING
// ============================================================================
export const TOAST_POSITION = {
  TOP: '80px',
  RIGHT: '20px',
  MIN_WIDTH: '320px',
  MAX_WIDTH: '420px'
} as const

// ============================================================================
// ADMIN SETTINGS
// ============================================================================
export const ADMIN = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  ITEMS_PER_PAGE: 10
} as const

// ============================================================================
// HTTP STATUS CODES
// ============================================================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================
export const STORAGE_KEYS = {
  CART: 'cart',
  FAVORITES: 'favorites',
  USER: 'user',
  AUTH_TOKEN: 'auth_token',
  ADMIN_ORDERS: 'admin_orders',
  THEME: 'theme',
  LANGUAGE: 'language'
} as const

// ============================================================================
// ROUTES
// ============================================================================
export const ROUTES = {
  HOME: '/',
  COLLECTION: '/collection',
  CART: '/cart',
  CHECKOUT: '/checkout',
  THANK_YOU: '/thank-you',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  USER_ACCOUNT: '/account'
} as const

// ============================================================================
// API ENDPOINTS (for future use)
// ============================================================================
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  USERS: '/api/users'
} as const

// ============================================================================
// TAX RATES
// ============================================================================
export const TAX_RATES = {
  DEFAULT: 0.07, // 7%
  US_DEFAULT: 0,
  THAILAND_VAT: 0.07,
  EU_VAT: 0.20
} as const

// ============================================================================
// SHIPPING
// ============================================================================
export const SHIPPING = {
  DEFAULT_WEIGHT_KG: 0.5,
  PROCESSING_DAYS: { MIN: 1, MAX: 2 },
  STANDARD_DAYS: { MIN: 7, MAX: 14 },
  EXPRESS_DAYS: { MIN: 3, MAX: 5 }
} as const

// ============================================================================
// TYPOGRAPHY
// ============================================================================
export const FONT_SIZE = {
  XS: '11px',
  SM: '12px',
  BASE: '13px',
  MD: '14px',
  LG: '18px',
  XL: '24px',
  XXL: '32px',
  XXXL: '48px'
} as const

export const LETTER_SPACING = {
  TIGHT: '0.02em',
  NORMAL: '0.08em',
  WIDE: '0.1em',
  WIDER: '0.2em',
  WIDEST: '0.3em'
} as const

// ============================================================================
// TYPE EXPORTS FOR TYPESCRIPT
// ============================================================================
export type AnimationDuration = typeof ANIMATION_DURATION[keyof typeof ANIMATION_DURATION]
export type Breakpoint = typeof BREAKPOINTS[keyof typeof BREAKPOINTS]
export type ZIndex = typeof Z_INDEX[keyof typeof Z_INDEX]
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]
export type Route = typeof ROUTES[keyof typeof ROUTES]
