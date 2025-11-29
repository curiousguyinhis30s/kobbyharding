/**
 * Zod Validation Schemas
 * Type-safe validation for forms and data structures
 */

import { z } from 'zod'
import { VALIDATION } from '../constants'

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .trim()
  .toLowerCase()

export const passwordSchema = z
  .string()
  .min(VALIDATION.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`)
  .max(VALIDATION.MAX_PASSWORD_LENGTH, 'Password is too long')

export const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .max(100, 'Name is too long')
  .trim()

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(20, 'Phone number is too long')
  .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')

export const userSchema = z.object({
  id: z.string().optional(),
  email: emailSchema,
  password: passwordSchema.optional(),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export type User = z.infer<typeof userSchema>

// ============================================================================
// ADDRESS SCHEMAS
// ============================================================================

export const addressSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  address: z.string().min(1, 'Address is required').trim(),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required').trim(),
  state: z.string().optional(),
  country: z.string().min(1, 'Please select a country'),
  postalCode: z
    .string()
    .min(VALIDATION.MIN_POSTAL_CODE_LENGTH, 'Please enter a valid postal code')
    .max(VALIDATION.MAX_POSTAL_CODE_LENGTH, 'Postal code is too long')
    .trim(),
  phone: phoneSchema.optional()
})

export type Address = z.infer<typeof addressSchema>

// ============================================================================
// PAYMENT SCHEMAS
// ============================================================================

export const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(VALIDATION.MIN_CARD_NUMBER_LENGTH, 'Card number must be at least 13 digits')
    .max(VALIDATION.MAX_CARD_NUMBER_LENGTH, 'Card number is too long')
    .regex(/^\d+$/, 'Card number must contain only digits')
    .refine((val) => {
      // Luhn algorithm validation
      const digits = val.split('').reverse()
      let sum = 0
      let isEven = false

      for (const digitStr of digits) {
        let digit = parseInt(digitStr, 10)
        if (isEven) {
          digit *= 2
          if (digit > 9) digit -= 9
        }
        sum += digit
        isEven = !isEven
      }

      return sum % 10 === 0
    }, 'Invalid card number'),

  expiryDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, 'Expiry date must be MM/YY')
    .refine((val) => {
      const [month, year] = val.split('/').map(Number)
      if (month < 1 || month > 12) return false

      const now = new Date()
      const currentYear = now.getFullYear() % 100
      const currentMonth = now.getMonth() + 1

      if (year < currentYear) return false
      if (year === currentYear && month < currentMonth) return false

      return true
    }, 'Card has expired or invalid date'),

  cvc: z
    .string()
    .min(VALIDATION.CVC_LENGTH_MIN, 'CVC must be 3 or 4 digits')
    .max(VALIDATION.CVC_LENGTH_MAX, 'CVC must be 3 or 4 digits')
    .regex(/^\d+$/, 'CVC must contain only digits')
})

export type CreditCard = z.infer<typeof creditCardSchema>

// ============================================================================
// PRODUCT SCHEMAS
// ============================================================================

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Invalid image URL'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  colors: z.array(z.string()).optional(),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export type Product = z.infer<typeof productSchema>

// ============================================================================
// CART SCHEMAS
// ============================================================================

export const cartItemSchema = z.object({
  pieceId: z.string(),
  size: z.string(),
  quantity: z.number().int().min(1).max(10, 'Maximum 10 items per product'),
  addedAt: z.date().optional()
})

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  promoCode: z.string().optional(),
  updatedAt: z.date().optional()
})

export type CartItem = z.infer<typeof cartItemSchema>
export type Cart = z.infer<typeof cartSchema>

// ============================================================================
// ORDER SCHEMAS
// ============================================================================

export const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  size: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  total: z.number().positive()
})

export const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customerId: z.string().optional(),
  customerEmail: emailSchema,

  // Items
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),

  // Pricing
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  shipping: z.number().nonnegative().default(0),
  total: z.number().positive(),

  // Addresses
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),

  // Status
  status: z.enum([
    'pending',
    'processing',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
  ]),

  // Payment
  paymentMethod: z.string(),
  paymentStatus: z.enum(['pending', 'completed', 'failed', 'refunded']),

  // Promo
  promoCode: z.string().optional(),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  shippedAt: z.date().optional(),
  deliveredAt: z.date().optional()
})

export type OrderItem = z.infer<typeof orderItemSchema>
export type Order = z.infer<typeof orderSchema>

// ============================================================================
// CHECKOUT SCHEMAS
// ============================================================================

export const guestCheckoutSchema = z.object({
  email: emailSchema,
  shippingAddress: addressSchema,
  paymentDetails: creditCardSchema,
  billingAddressSame: z.boolean().default(true),
  billingAddress: addressSchema.optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions'
  })
})

export const accountCheckoutSchema = guestCheckoutSchema.extend({
  password: passwordSchema,
  createAccount: z.boolean().default(true)
})

export type GuestCheckout = z.infer<typeof guestCheckoutSchema>
export type AccountCheckout = z.infer<typeof accountCheckoutSchema>

// ============================================================================
// REVIEW SCHEMAS
// ============================================================================

export const reviewSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  userId: z.string().optional(),
  userName: z.string().min(1, 'Name is required'),
  rating: z.number().int().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
  title: z.string().min(1, 'Review title is required').max(100, 'Title is too long'),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review is too long'),
  verified: z.boolean().default(false),
  helpful: z.number().int().nonnegative().default(0),
  createdAt: z.date().optional()
})

export type Review = z.infer<typeof reviewSchema>

// ============================================================================
// CONTACT SCHEMAS
// ============================================================================

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
  phone: phoneSchema.optional()
})

export type ContactForm = z.infer<typeof contactFormSchema>

// ============================================================================
// PROMO CODE SCHEMAS
// ============================================================================

export const promoCodeSchema = z.object({
  code: z.string().min(1, 'Promo code is required').toUpperCase(),
  discount: z.number().positive('Discount must be positive'),
  type: z.enum(['percentage', 'fixed']),
  minPurchase: z.number().nonnegative().optional(),
  expiryDate: z.date().optional(),
  maxUses: z.number().int().positive().optional(),
  currentUses: z.number().int().nonnegative().default(0),
  active: z.boolean().default(true)
})

export type PromoCode = z.infer<typeof promoCodeSchema>

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
})

export type AdminLogin = z.infer<typeof adminLoginSchema>

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Safely parse and validate data with a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with success flag and data or errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, errors: result.error }
  }
}

/**
 * Get user-friendly error messages from Zod errors
 * @param error - Zod validation error
 * @returns Object mapping field names to error messages
 */
export function getErrorMessages(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    errors[path] = issue.message
  }

  return errors
}

/**
 * Validate a single field with a Zod schema
 * @param schema - Zod schema to validate against
 * @param value - Value to validate
 * @returns Error message if invalid, undefined if valid
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): string | undefined {
  const result = schema.safeParse(value)

  if (!result.success) {
    return result.error.issues[0]?.message
  }

  return undefined
}
