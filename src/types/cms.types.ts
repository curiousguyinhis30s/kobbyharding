// CMS Type Definitions for Koby's Threads

export interface Media {
  id: string
  url: string
  type: 'image' | 'video'
  thumbnail?: string
  alt?: string
  order: number
  createdAt: Date
}

export interface InventoryLocation {
  quantity: number
  reserved: number
  location: 'warehouse' | 'festival' | 'studio' | 'consignment'
  lastUpdated: Date
}

export interface SizeInventory {
  [size: string]: InventoryLocation
}

export interface Product {
  id: string
  name: string
  story: string
  sku: string
  
  // Media
  media: {
    images: Media[]
    videos: Media[]
    thumbnail: string
    view360?: string
  }
  
  // Inventory
  inventory: SizeInventory
  lowStockThreshold: number
  
  // Pricing
  pricing: {
    base: number
    sale?: number
    customization?: number
    bulkDiscounts?: Array<{
      quantity: number
      discount: number
    }>
  }
  
  // Categorization
  category: 'jackets' | 'shirts' | 'pants' | 'accessories'
  collection: string
  tags: string[]
  
  // Fabric & Materials
  fabricOrigin: string
  denimType: string
  materials: string[]
  sustainabilityScore?: number
  
  // Metadata
  isLimited: boolean
  isActive: boolean
  views: number
  sales: number
  createdAt: Date
  updatedAt: Date
}

export interface Festival {
  id: string
  name: string
  location: {
    city: string
    country: string
    venue: string
    coordinates?: [number, number]
  }
  dates: {
    start: Date
    end: Date
  }
  booth?: string
  inventory?: Product[]
  estimatedAttendance?: number
  notes?: string
}

export interface DeliveryOption {
  id: string
  orderId: string
  type: 'shipping' | 'festival-pickup' | 'studio-pickup'
  status: 'pending' | 'ready' | 'collected' | 'shipped' | 'delivered' | 'failed'
  
  shipping?: {
    address: {
      street: string
      city: string
      state: string
      zip: string
      country: string
    }
    carrier: 'DHL' | 'FedEx' | 'UPS' | 'Local'
    trackingNumber?: string
    estimatedDelivery?: Date
  }
  
  festivalPickup?: {
    festivalId: string
    pickupCode: string
    pickupWindow: {
      start: Date
      end: Date
    }
    reminders: Array<{
      type: 'sms' | 'email'
      sentAt: Date
    }>
  }
  
  fallback?: {
    triggered: boolean
    reason?: string
    action?: 'next-festival' | 'ship-to-address' | 'store-credit'
  }
}

export interface Order {
  id: string
  customerId: string
  items: Array<{
    productId: string
    size: string
    quantity: number
    price: number
    customization?: string
  }>
  
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled'
  
  delivery: DeliveryOption
  payment: {
    method: 'card' | 'paypal' | 'apple-pay' | 'google-pay' | 'cash'
    status: 'pending' | 'paid' | 'refunded'
    transactionId?: string
  }
  
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    inseam?: number
    preferredFit: 'slim' | 'regular' | 'relaxed'
  }
  
  preferences: {
    sizes: string[]
    colors: string[]
    styles: string[]
    festivals: string[]
  }
  
  history: {
    orders: Order[]
    views: Product[]
    wishlist: Product[]
  }
  
  loyalty?: {
    points: number
    tier: 'bronze' | 'silver' | 'gold' | 'vip'
    referrals: number
  }
  
  createdAt: Date
  lastActive: Date
}

export interface Analytics {
  date: Date
  
  sales: {
    revenue: number
    orders: number
    averageOrderValue: number
    conversionRate: number
  }
  
  inventory: {
    totalValue: number
    turnoverRate: number
    lowStockItems: Product[]
    deadStock: Product[]
  }
  
  customers: {
    new: number
    returning: number
    churnRate: number
    satisfaction: number
  }
  
  festivals: {
    upcoming: Festival[]
    performance: Map<string, {
      sales: number
      pickupRate: number
      missedPickups: number
    }>
  }
}