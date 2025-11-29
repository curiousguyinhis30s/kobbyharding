import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Payment Provider Types
export type PaymentProviderType = 'stripe' | 'paypal' | 'square' | 'shopify' | 'manual' | 'cod'

export interface PaymentProvider {
  id: string
  type: PaymentProviderType
  name: string
  enabled: boolean
  testMode: boolean
  priority: number // Lower = higher priority (1 is primary)

  // API Configuration
  publicKey: string
  secretKey: string
  webhookSecret: string
  webhookUrl: string

  // Settings
  supportedCurrencies: string[]
  supportedCountries: string[]
  minAmount: number
  maxAmount: number

  // Fees
  flatFee: number
  percentageFee: number
  passFeeToCustomer: boolean

  // Display
  displayName: string
  description: string
  iconUrl: string

  // Provider-specific config
  stripeConfig?: {
    statementDescriptor: string
    captureMethod: 'automatic' | 'manual'
    allowedCardBrands: string[]
    enableApplePay: boolean
    enableGooglePay: boolean
    enableLink: boolean
  }

  paypalConfig?: {
    clientId: string
    merchantId: string
    enablePayLater: boolean
    enableVenmo: boolean
  }

  squareConfig?: {
    applicationId: string
    locationId: string
    enableCashApp: boolean
    enableAfterPay: boolean
  }

  shopifyConfig?: {
    shopName: string
    accessToken: string
    apiVersion: string
    useShopifyPayments: boolean
  }

  manualConfig?: {
    instructions: string
    requiresApproval: boolean
    acceptedMethods: string[]
  }
}

// Shopify Integration
export interface ShopifyIntegration {
  enabled: boolean
  connected: boolean
  shopName: string
  accessToken: string
  apiVersion: string
  lastSync: Date | null

  syncSettings: {
    autoSyncProducts: boolean
    autoSyncInventory: boolean
    autoSyncOrders: boolean
    syncInterval: number // minutes
    conflictResolution: 'local' | 'shopify' | 'manual' | 'newest'
  }

  webhooks: {
    ordersCreate: boolean
    ordersUpdate: boolean
    productsCreate: boolean
    productsUpdate: boolean
    inventoryUpdate: boolean
  }

  mappings: {
    productIdField: string
    variantIdField: string
    inventoryLocationId: string
  }
}

// Tax Configuration
export interface TaxConfig {
  enabled: boolean
  includeInPrice: boolean
  calculateAutomatically: boolean
  defaultRate: number

  taxRates: {
    id: string
    name: string
    rate: number
    country: string
    state?: string
    applyToShipping: boolean
  }[]

  taxExemptProducts: string[]
  taxExemptCustomers: string[]
}

// Shipping Configuration
export interface ShippingConfig {
  enabled: boolean

  zones: {
    id: string
    name: string
    countries: string[]
    methods: {
      id: string
      name: string
      description: string
      price: number
      freeAbove: number | null
      estimatedDays: { min: number; max: number }
      enabled: boolean
    }[]
  }[]

  freeShippingThreshold: number | null
  defaultWeight: number
  weightUnit: 'kg' | 'lb'

  carriers: {
    id: string
    name: string
    enabled: boolean
    apiKey: string
    accountNumber: string
  }[]
}

// Currency Configuration
export interface CurrencyConfig {
  primary: string
  supported: string[]
  autoConvert: boolean
  conversionRates: Record<string, number>
  displayFormat: {
    symbolPosition: 'before' | 'after'
    decimalSeparator: '.' | ','
    thousandsSeparator: ',' | '.' | ' ' | ''
    decimals: number
  }
}

// Checkout Configuration
export interface CheckoutConfig {
  guestCheckout: boolean
  requirePhone: boolean
  requireShippingAddress: boolean
  showOrderNotes: boolean
  termsRequired: boolean
  termsUrl: string
  privacyUrl: string

  steps: ('contact' | 'shipping' | 'payment' | 'review')[]

  fields: {
    firstName: { required: boolean; visible: boolean }
    lastName: { required: boolean; visible: boolean }
    company: { required: boolean; visible: boolean }
    phone: { required: boolean; visible: boolean }
    address2: { required: boolean; visible: boolean }
  }

  abandonedCart: {
    enabled: boolean
    reminderDelay: number // hours
    discountCode: string | null
  }
}

// Store Interface
interface CommerceStore {
  // Payment Providers
  paymentProviders: PaymentProvider[]
  activeProviderId: string | null

  // Integrations
  shopify: ShopifyIntegration

  // Configuration
  tax: TaxConfig
  shipping: ShippingConfig
  currency: CurrencyConfig
  checkout: CheckoutConfig

  // Actions - Payment Providers
  addPaymentProvider: (provider: Omit<PaymentProvider, 'id'>) => void
  updatePaymentProvider: (id: string, updates: Partial<PaymentProvider>) => void
  deletePaymentProvider: (id: string) => void
  setActiveProvider: (id: string) => void
  toggleProviderEnabled: (id: string) => void
  reorderProviders: (ids: string[]) => void
  testProviderConnection: (id: string) => Promise<{ success: boolean; message: string }>

  // Actions - Shopify
  updateShopify: (updates: Partial<ShopifyIntegration>) => void
  connectShopify: (shopName: string, accessToken: string) => Promise<boolean>
  disconnectShopify: () => void
  syncShopify: (type: 'products' | 'inventory' | 'orders' | 'all') => Promise<void>

  // Actions - Configuration
  updateTax: (updates: Partial<TaxConfig>) => void
  updateShipping: (updates: Partial<ShippingConfig>) => void
  updateCurrency: (updates: Partial<CurrencyConfig>) => void
  updateCheckout: (updates: Partial<CheckoutConfig>) => void

  // Helpers
  getEnabledProviders: () => PaymentProvider[]
  getPrimaryProvider: () => PaymentProvider | null
  calculateTax: (amount: number, country: string, state?: string) => number
  calculateShipping: (country: string, weight: number, method?: string) => number
  formatPrice: (amount: number, currency?: string) => string
}

// Default Configurations
const defaultStripeProvider: PaymentProvider = {
  id: 'stripe-default',
  type: 'stripe',
  name: 'Stripe',
  enabled: false,
  testMode: true,
  priority: 1,
  publicKey: '',
  secretKey: '',
  webhookSecret: '',
  webhookUrl: '/api/webhooks/stripe',
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'THB', 'SGD', 'JPY', 'AUD'],
  supportedCountries: ['US', 'GB', 'EU', 'TH', 'SG', 'JP', 'AU', 'HK'],
  minAmount: 0.50,
  maxAmount: 999999,
  flatFee: 0.30,
  percentageFee: 2.9,
  passFeeToCustomer: false,
  displayName: 'Credit/Debit Card',
  description: 'Pay securely with your card',
  iconUrl: '/icons/stripe.svg',
  stripeConfig: {
    statementDescriptor: 'KHARDING',
    captureMethod: 'automatic',
    allowedCardBrands: ['visa', 'mastercard', 'amex'],
    enableApplePay: true,
    enableGooglePay: true,
    enableLink: false
  }
}

const defaultPayPalProvider: PaymentProvider = {
  id: 'paypal-default',
  type: 'paypal',
  name: 'PayPal',
  enabled: false,
  testMode: true,
  priority: 2,
  publicKey: '',
  secretKey: '',
  webhookSecret: '',
  webhookUrl: '/api/webhooks/paypal',
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD'],
  supportedCountries: ['US', 'GB', 'EU', 'AU', 'CA'],
  minAmount: 1,
  maxAmount: 10000,
  flatFee: 0.30,
  percentageFee: 3.49,
  passFeeToCustomer: false,
  displayName: 'PayPal',
  description: 'Pay with your PayPal account',
  iconUrl: '/icons/paypal.svg',
  paypalConfig: {
    clientId: '',
    merchantId: '',
    enablePayLater: true,
    enableVenmo: false
  }
}

const defaultManualProvider: PaymentProvider = {
  id: 'manual-default',
  type: 'manual',
  name: 'Manual/Bank Transfer',
  enabled: true,
  testMode: false,
  priority: 10,
  publicKey: '',
  secretKey: '',
  webhookSecret: '',
  webhookUrl: '',
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'THB'],
  supportedCountries: ['*'],
  minAmount: 0,
  maxAmount: 999999,
  flatFee: 0,
  percentageFee: 0,
  passFeeToCustomer: false,
  displayName: 'Bank Transfer',
  description: 'Pay via bank transfer (order confirmed after payment received)',
  iconUrl: '/icons/bank.svg',
  manualConfig: {
    instructions: 'Please transfer to:\n\nBank: Bangkok Bank\nAccount: 123-456-7890\nName: K Harding Classics\n\nInclude your order number in the reference.',
    requiresApproval: true,
    acceptedMethods: ['Bank Transfer', 'Wire Transfer']
  }
}

const defaultCODProvider: PaymentProvider = {
  id: 'cod-default',
  type: 'cod',
  name: 'Cash on Delivery',
  enabled: false,
  testMode: false,
  priority: 20,
  publicKey: '',
  secretKey: '',
  webhookSecret: '',
  webhookUrl: '',
  supportedCurrencies: ['THB', 'USD'],
  supportedCountries: ['TH'],
  minAmount: 0,
  maxAmount: 5000,
  flatFee: 50,
  percentageFee: 0,
  passFeeToCustomer: true,
  displayName: 'Cash on Delivery',
  description: 'Pay when you receive (THB 50 fee)',
  iconUrl: '/icons/cod.svg',
  manualConfig: {
    instructions: 'Pay cash to the delivery person',
    requiresApproval: false,
    acceptedMethods: ['Cash']
  }
}

const defaultShopify: ShopifyIntegration = {
  enabled: false,
  connected: false,
  shopName: '',
  accessToken: '',
  apiVersion: '2024-01',
  lastSync: null,
  syncSettings: {
    autoSyncProducts: false,
    autoSyncInventory: true,
    autoSyncOrders: true,
    syncInterval: 15,
    conflictResolution: 'newest'
  },
  webhooks: {
    ordersCreate: true,
    ordersUpdate: true,
    productsCreate: false,
    productsUpdate: false,
    inventoryUpdate: true
  },
  mappings: {
    productIdField: 'sku',
    variantIdField: 'variant_id',
    inventoryLocationId: ''
  }
}

const defaultTax: TaxConfig = {
  enabled: true,
  includeInPrice: false,
  calculateAutomatically: false,
  defaultRate: 7,
  taxRates: [
    { id: 'th-vat', name: 'Thailand VAT', rate: 7, country: 'TH', applyToShipping: false },
    { id: 'us-none', name: 'US (No Tax)', rate: 0, country: 'US', applyToShipping: false }
  ],
  taxExemptProducts: [],
  taxExemptCustomers: []
}

const defaultShipping: ShippingConfig = {
  enabled: true,
  zones: [
    {
      id: 'asia',
      name: 'Asia',
      countries: ['TH', 'SG', 'JP', 'KR', 'HK', 'MY', 'ID', 'PH', 'VN'],
      methods: [
        { id: 'asia-standard', name: 'Standard', description: '7-14 days', price: 15, freeAbove: 300, estimatedDays: { min: 7, max: 14 }, enabled: true },
        { id: 'asia-express', name: 'Express', description: '3-5 days', price: 35, freeAbove: null, estimatedDays: { min: 3, max: 5 }, enabled: true }
      ]
    },
    {
      id: 'worldwide',
      name: 'Worldwide',
      countries: ['*'],
      methods: [
        { id: 'world-standard', name: 'International Standard', description: '14-21 days', price: 25, freeAbove: 400, estimatedDays: { min: 14, max: 21 }, enabled: true },
        { id: 'world-express', name: 'International Express', description: '5-10 days', price: 55, freeAbove: null, estimatedDays: { min: 5, max: 10 }, enabled: true }
      ]
    }
  ],
  freeShippingThreshold: 300,
  defaultWeight: 0.5,
  weightUnit: 'kg',
  carriers: []
}

const defaultCurrency: CurrencyConfig = {
  primary: 'USD',
  supported: ['USD', 'EUR', 'GBP', 'THB', 'SGD', 'JPY'],
  autoConvert: false,
  conversionRates: {
    'EUR': 0.92,
    'GBP': 0.79,
    'THB': 35.5,
    'SGD': 1.35,
    'JPY': 149.5
  },
  displayFormat: {
    symbolPosition: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2
  }
}

const defaultCheckout: CheckoutConfig = {
  guestCheckout: true,
  requirePhone: true,
  requireShippingAddress: true,
  showOrderNotes: true,
  termsRequired: true,
  termsUrl: '/terms',
  privacyUrl: '/privacy',
  steps: ['contact', 'shipping', 'payment', 'review'],
  fields: {
    firstName: { required: true, visible: true },
    lastName: { required: true, visible: true },
    company: { required: false, visible: true },
    phone: { required: true, visible: true },
    address2: { required: false, visible: true }
  },
  abandonedCart: {
    enabled: false,
    reminderDelay: 24,
    discountCode: null
  }
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const useCommerceStore = create<CommerceStore>()(
  persist(
    (set, get) => ({
      // Initial State
      paymentProviders: [defaultStripeProvider, defaultPayPalProvider, defaultManualProvider, defaultCODProvider],
      activeProviderId: 'manual-default',
      shopify: defaultShopify,
      tax: defaultTax,
      shipping: defaultShipping,
      currency: defaultCurrency,
      checkout: defaultCheckout,

      // Payment Provider Actions
      addPaymentProvider: (provider) => {
        const newProvider: PaymentProvider = {
          ...provider,
          id: generateId()
        }
        set((state) => ({
          paymentProviders: [...state.paymentProviders, newProvider]
        }))
      },

      updatePaymentProvider: (id, updates) => {
        set((state) => ({
          paymentProviders: state.paymentProviders.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          )
        }))
      },

      deletePaymentProvider: (id) => {
        set((state) => ({
          paymentProviders: state.paymentProviders.filter((p) => p.id !== id),
          activeProviderId: state.activeProviderId === id ? null : state.activeProviderId
        }))
      },

      setActiveProvider: (id) => {
        set({ activeProviderId: id })
      },

      toggleProviderEnabled: (id) => {
        set((state) => ({
          paymentProviders: state.paymentProviders.map((p) =>
            p.id === id ? { ...p, enabled: !p.enabled } : p
          )
        }))
      },

      reorderProviders: (ids) => {
        set((state) => {
          const providers = [...state.paymentProviders]
          const reordered = ids.map((id, index) => {
            const provider = providers.find((p) => p.id === id)
            return provider ? { ...provider, priority: index + 1 } : null
          }).filter(Boolean) as PaymentProvider[]
          return { paymentProviders: reordered }
        })
      },

      testProviderConnection: async (id) => {
        const provider = get().paymentProviders.find((p) => p.id === id)
        if (!provider) return { success: false, message: 'Provider not found' }

        // Simulate API test (in real implementation, this would call backend)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        if (!provider.publicKey || !provider.secretKey) {
          return { success: false, message: 'API keys not configured' }
        }

        // Mock success for demo
        return { success: true, message: 'Connection successful!' }
      },

      // Shopify Actions
      updateShopify: (updates) => {
        set((state) => ({
          shopify: { ...state.shopify, ...updates }
        }))
      },

      connectShopify: async (shopName, accessToken) => {
        // Simulate OAuth flow
        await new Promise((resolve) => setTimeout(resolve, 2000))
        set((state) => ({
          shopify: {
            ...state.shopify,
            enabled: true,
            connected: true,
            shopName,
            accessToken,
            lastSync: new Date()
          }
        }))
        return true
      },

      disconnectShopify: () => {
        set((state) => ({
          shopify: {
            ...defaultShopify,
            enabled: false,
            connected: false
          }
        }))
      },

      syncShopify: async (type) => {
        // Simulate sync
        await new Promise((resolve) => setTimeout(resolve, 3000))
        set((state) => ({
          shopify: { ...state.shopify, lastSync: new Date() }
        }))
      },

      // Configuration Actions
      updateTax: (updates) => {
        set((state) => ({
          tax: { ...state.tax, ...updates }
        }))
      },

      updateShipping: (updates) => {
        set((state) => ({
          shipping: { ...state.shipping, ...updates }
        }))
      },

      updateCurrency: (updates) => {
        set((state) => ({
          currency: { ...state.currency, ...updates }
        }))
      },

      updateCheckout: (updates) => {
        set((state) => ({
          checkout: { ...state.checkout, ...updates }
        }))
      },

      // Helper Methods
      getEnabledProviders: () => {
        return get().paymentProviders
          .filter((p) => p.enabled)
          .sort((a, b) => a.priority - b.priority)
      },

      getPrimaryProvider: () => {
        const enabled = get().getEnabledProviders()
        return enabled.length > 0 ? enabled[0] : null
      },

      calculateTax: (amount, country, state) => {
        const { tax } = get()
        if (!tax.enabled) return 0

        const rate = tax.taxRates.find((r) =>
          r.country === country && (!state || r.state === state)
        )?.rate ?? tax.defaultRate

        return amount * (rate / 100)
      },

      calculateShipping: (country, weight, method) => {
        const { shipping } = get()
        if (!shipping.enabled) return 0

        // Find zone
        const zone = shipping.zones.find((z) =>
          z.countries.includes(country) || z.countries.includes('*')
        )
        if (!zone) return 0

        // Find method
        const shippingMethod = method
          ? zone.methods.find((m) => m.id === method)
          : zone.methods.find((m) => m.enabled)

        return shippingMethod?.price ?? 0
      },

      formatPrice: (amount, currency) => {
        const { currency: config } = get()
        const curr = currency ?? config.primary

        const symbols: Record<string, string> = {
          USD: '$', EUR: '€', GBP: '£', THB: '฿', SGD: 'S$', JPY: '¥'
        }

        const formatted = amount.toFixed(config.displayFormat.decimals)
          .replace('.', config.displayFormat.decimalSeparator)
          .replace(/\B(?=(\d{3})+(?!\d))/g, config.displayFormat.thousandsSeparator)

        const symbol = symbols[curr] ?? curr
        return config.displayFormat.symbolPosition === 'before'
          ? `${symbol}${formatted}`
          : `${formatted}${symbol}`
      }
    }),
    {
      name: 'commerce-config',
      partialize: (state) => ({
        paymentProviders: state.paymentProviders,
        activeProviderId: state.activeProviderId,
        shopify: state.shopify,
        tax: state.tax,
        shipping: state.shipping,
        currency: state.currency,
        checkout: state.checkout
      })
    }
  )
)
