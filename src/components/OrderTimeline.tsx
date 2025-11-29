import { motion } from 'framer-motion'
import { Check, Package, Truck, MapPin, Clock } from 'lucide-react'
import type { OrderStatus } from '../stores/useOrderStore'

interface OrderTimelineProps {
  currentStatus: OrderStatus
  orderDate?: Date
  processingDate?: Date
  shippedDate?: Date
  deliveredDate?: Date
  estimatedDelivery?: Date
}

const OrderTimeline = ({
  currentStatus,
  orderDate,
  processingDate,
  shippedDate,
  deliveredDate,
  estimatedDelivery
}: OrderTimelineProps) => {
  const steps: Array<{
    status: OrderStatus
    label: string
    icon: typeof Package
    date?: Date
  }> = [
    { status: 'pending', label: 'Order Placed', icon: Package, date: orderDate },
    { status: 'processing', label: 'Processing', icon: Clock, date: processingDate },
    { status: 'shipped', label: 'Shipped', icon: Truck, date: shippedDate },
    { status: 'delivered', label: 'Delivered', icon: MapPin, date: deliveredDate }
  ]

  const statusOrder: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered']
  const currentIndex = statusOrder.indexOf(currentStatus)

  const formatDate = (date?: Date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="relative py-8">
      {/* Progress Line */}
      <div className="absolute top-12 left-0 right-0 h-px bg-gray-800 mx-4 md:mx-8" />
      <motion.div
        className="absolute top-12 left-0 h-px bg-orange-500"
        initial={{ width: 0 }}
        animate={{
          width: currentIndex === 0 ? '0%' : currentIndex === 1 ? '33%' : currentIndex === 2 ? '66%' : '100%'
        }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginLeft: '2rem' }}
      />

      {/* Steps */}
      <div className="relative flex justify-between px-4 md:px-8">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex
          const Icon = step.icon

          return (
            <div key={step.status} className="flex flex-col items-center flex-1">
              {/* Icon Container */}
              <motion.div
                className={`
                  relative z-10 w-16 h-16 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isCompleted
                    ? 'bg-orange-500 border-2 border-orange-500'
                    : 'bg-gray-900 border-2 border-gray-700'
                  }
                  ${isCurrent ? 'ring-4 ring-orange-500/20' : ''}
                `}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
              >
                {isCompleted ? (
                  <Check className="w-7 h-7 text-white" />
                ) : (
                  <Icon className="w-6 h-6 text-gray-500" />
                )}
              </motion.div>

              {/* Label */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
              >
                <p
                  className={`
                    text-xs font-light tracking-wider mb-1
                    ${isCompleted ? 'text-white' : 'text-gray-500'}
                  `}
                >
                  {step.label.toUpperCase()}
                </p>
                {step.date && (
                  <p className="text-[10px] text-gray-600 font-mono">
                    {formatDate(step.date)}
                  </p>
                )}
                {!step.date && index === currentIndex + 1 && estimatedDelivery && (
                  <p className="text-[10px] text-gray-600 font-mono">
                    Est: {formatDate(estimatedDelivery)}
                  </p>
                )}
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderTimeline
