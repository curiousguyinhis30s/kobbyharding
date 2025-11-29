import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered'

export interface TrackingUpdate {
  timestamp: Date
  status: OrderStatus
  location: string
  message: string
}

export interface OrderItem {
  pieceId: string
  pieceName: string
  size: string
  quantity: number
  price: number
  imageUrl: string
}

export interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  status: OrderStatus
  trackingNumber?: string

  // Customer info
  customerEmail: string
  customerName: string

  // Shipping info
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    country: string
    postalCode: string
  }

  // Dates
  orderDate: Date
  processingDate?: Date
  shippedDate?: Date
  deliveredDate?: Date
  estimatedDelivery: Date

  // Tracking
  trackingUpdates: TrackingUpdate[]
}

interface OrderStore {
  orders: Order[]

  // Actions
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'trackingUpdates' | 'estimatedDelivery'>) => Order
  getOrder: (orderId: string) => Order | undefined
  getOrderByNumber: (orderNumber: string) => Order | undefined
  getOrdersByEmail: (email: string) => Order[]
  updateOrderStatus: (orderId: string, status: OrderStatus, location?: string, message?: string) => void
  addTrackingUpdate: (orderId: string, update: Omit<TrackingUpdate, 'timestamp'>) => void
}

const generateOrderNumber = (): string => {
  const prefix = 'KB'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substr(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

const generateTrackingNumber = (): string => {
  const prefix = 'KHD'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substr(2, 8).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

const calculateEstimatedDelivery = (orderDate: Date, country: string): Date => {
  const daysToAdd = country === 'Thailand' ? 5 : country.includes('Asia') ? 7 : 14
  const estimated = new Date(orderDate)
  estimated.setDate(estimated.getDate() + daysToAdd)
  return estimated
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (orderData) => {
        const now = new Date()
        const orderNumber = generateOrderNumber()
        const estimatedDelivery = calculateEstimatedDelivery(now, orderData.shippingAddress.country)

        const newOrder: Order = {
          ...orderData,
          id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          orderNumber,
          orderDate: now,
          estimatedDelivery,
          trackingUpdates: [
            {
              timestamp: now,
              status: orderData.status,
              location: 'Bangkok, Thailand',
              message: 'Order received and awaiting processing'
            }
          ]
        }

        set((state) => ({
          orders: [...state.orders, newOrder]
        }))

        // Simulate order progression with mock updates
        setTimeout(() => {
          get().updateOrderStatus(newOrder.id, 'processing', 'Bangkok, Thailand', 'Order is being prepared for shipment')
        }, 30000) // 30 seconds after order

        return newOrder
      },

      getOrder: (orderId) => {
        return get().orders.find(order => order.id === orderId)
      },

      getOrderByNumber: (orderNumber) => {
        return get().orders.find(order => order.orderNumber === orderNumber)
      },

      getOrdersByEmail: (email) => {
        return get().orders.filter(order =>
          order.customerEmail.toLowerCase() === email.toLowerCase()
        ).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      },

      updateOrderStatus: (orderId, status, location = 'In Transit', message = '') => {
        set((state) => {
          const updatedOrders = state.orders.map(order => {
            if (order.id !== orderId) return order

            const now = new Date()
            const updatedOrder = { ...order, status }

            // Update status-specific dates
            if (status === 'processing') {
              updatedOrder.processingDate = now
            } else if (status === 'shipped') {
              updatedOrder.shippedDate = now
              updatedOrder.trackingNumber = updatedOrder.trackingNumber || generateTrackingNumber()
            } else if (status === 'delivered') {
              updatedOrder.deliveredDate = now
            }

            // Add tracking update
            const statusMessages: Record<OrderStatus, string> = {
              pending: 'Order received and awaiting processing',
              processing: 'Order is being prepared for shipment',
              shipped: 'Package has been shipped and is on the way',
              delivered: 'Package has been delivered successfully'
            }

            updatedOrder.trackingUpdates = [
              ...order.trackingUpdates,
              {
                timestamp: now,
                status,
                location,
                message: message || statusMessages[status]
              }
            ]

            return updatedOrder
          })

          return { orders: updatedOrders }
        })
      },

      addTrackingUpdate: (orderId, update) => {
        set((state) => {
          const updatedOrders = state.orders.map(order => {
            if (order.id !== orderId) return order

            return {
              ...order,
              trackingUpdates: [
                ...order.trackingUpdates,
                {
                  ...update,
                  timestamp: new Date()
                }
              ]
            }
          })

          return { orders: updatedOrders }
        })
      }
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        orders: state.orders
      })
    }
  )
)
