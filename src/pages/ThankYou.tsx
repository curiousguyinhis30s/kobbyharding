import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Package, ArrowRight, Truck } from 'lucide-react'
import { useOrderStore } from '../stores/useOrderStore'
import OrderTimeline from '../components/OrderTimeline'

const ThankYou = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { getOrder } = useOrderStore()
  const [order, setOrder] = useState(orderId ? getOrder(orderId) : undefined)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (orderId) {
      const foundOrder = getOrder(orderId)
      setOrder(foundOrder)
    }
  }, [orderId, getOrder])

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white flex items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full mb-6 mx-auto block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-extralight tracking-[0.3em] mb-4">
            THANK YOU
          </h1>
          <p className="text-gray-400 mb-8 font-light">
            Your order has been confirmed and will be shipped soon
          </p>
        </motion.div>

        {order ? (
          <>
            {/* Order Details */}
            <motion.div
              className="border border-gray-900 bg-gray-950/50 p-8 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid md:grid-cols-3 gap-6 text-left mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1 tracking-wider">ORDER NUMBER</p>
                  <p className="text-orange-500 font-mono text-sm">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 tracking-wider">ORDER DATE</p>
                  <p className="font-light text-sm">{formatDate(order.orderDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 tracking-wider">ESTIMATED DELIVERY</p>
                  <p className="font-light text-sm">{formatDate(order.estimatedDelivery)}</p>
                </div>
              </div>

              <OrderTimeline
                currentStatus={order.status}
                orderDate={order.orderDate}
                processingDate={order.processingDate}
                shippedDate={order.shippedDate}
                deliveredDate={order.deliveredDate}
                estimatedDelivery={order.estimatedDelivery}
              />
            </motion.div>

            {/* Order Items Summary */}
            <motion.div
              className="border border-gray-900 bg-gray-950/50 p-6 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-lg font-extralight tracking-[0.2em] mb-4">ORDER SUMMARY</h2>
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.pieceName}
                      className="w-16 h-16 object-cover bg-gray-900"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-light">{item.pieceName}</p>
                      <p className="text-xs text-gray-500">Size: {item.size} • Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-orange-500">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-800 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-green-500">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between text-base font-light pt-2 border-t border-gray-800">
                  <span>Total</span>
                  <span className="text-orange-500">{formatPrice(order.total)}</span>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="border border-gray-900 bg-gray-950/50 p-8 mb-8 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-500 text-sm">
              Order confirmation details will be sent to your email
            </p>
          </motion.div>
        )}

        {/* Message from Koby */}
        <motion.div 
          className="mb-8 p-6 border border-orange-500/20 bg-orange-500/5"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Package className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <p className="text-sm text-gray-300 font-light italic">
            "Each piece carries a story. Thank you for becoming part of the KOBY journey. 
            Your unique style continues the narrative."
          </p>
          <p className="text-xs text-orange-500 mt-3">— Koby</p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {order && (
            <button
              onClick={() => navigate(`/track-order/${order.id}`)}
              className="px-8 py-3 bg-orange-500 text-white font-light tracking-wider hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              TRACK YOUR ORDER
            </button>
          )}
          <button
            onClick={() => navigate('/collection')}
            className="px-8 py-3 border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white transition-all font-light tracking-wider flex items-center justify-center gap-2"
          >
            CONTINUE SHOPPING
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Contact Info */}
        <motion.p 
          className="text-xs text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Questions? Contact us at hello@koby.com
        </motion.p>
      </div>
    </motion.div>
  )
}

export default ThankYou