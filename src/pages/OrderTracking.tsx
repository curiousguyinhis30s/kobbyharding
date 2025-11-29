import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Package, MapPin, Calendar, Truck, Mail, Phone, Copy, Check, ArrowLeft } from 'lucide-react'
import { useOrderStore } from '../stores/useOrderStore'
import OrderTimeline from '../components/OrderTimeline'

const OrderTracking = () => {
  const navigate = useNavigate()
  const { orderId: urlOrderId } = useParams()
  const { getOrder, getOrderByNumber, getOrdersByEmail } = useOrderStore()

  const [searchType, setSearchType] = useState<'orderId' | 'email'>('orderId')
  const [searchValue, setSearchValue] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<ReturnType<typeof getOrder>>()
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)

    // If orderId in URL, load that order
    if (urlOrderId) {
      const order = getOrder(urlOrderId) || getOrderByNumber(urlOrderId)
      if (order) {
        setSelectedOrder(order)
        setSearchValue(order.orderNumber)
      }
    }
  }, [urlOrderId, getOrder, getOrderByNumber])

  const handleSearch = () => {
    setError('')

    if (!searchValue.trim()) {
      setError('Please enter an order number or email')
      return
    }

    if (searchType === 'orderId') {
      const order = getOrderByNumber(searchValue.trim())
      if (order) {
        setSelectedOrder(order)
      } else {
        setError('Order not found. Please check your order number and try again.')
        setSelectedOrder(undefined)
      }
    } else {
      const orders = getOrdersByEmail(searchValue.trim())
      if (orders.length > 0) {
        setSelectedOrder(orders[0]) // Show most recent order
      } else {
        setError('No orders found for this email address.')
        setSelectedOrder(undefined)
      }
    }
  }

  const handleCopyTracking = () => {
    if (selectedOrder?.trackingNumber) {
      navigator.clipboard.writeText(selectedOrder.trackingNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs tracking-wider">BACK TO HOME</span>
          </button>

          <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.3em] mb-2">
            TRACK ORDER
          </h1>
          <p className="text-gray-500 text-sm font-light">
            Enter your order number or email to track your shipment
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-950 border border-gray-900 p-6 md:p-8 mb-8"
        >
          {/* Toggle Search Type */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSearchType('orderId')}
              className={`
                flex-1 py-3 text-xs tracking-wider transition-all
                ${searchType === 'orderId'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
                }
              `}
            >
              ORDER NUMBER
            </button>
            <button
              onClick={() => setSearchType('email')}
              className={`
                flex-1 py-3 text-xs tracking-wider transition-all
                ${searchType === 'email'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
                }
              `}
            >
              EMAIL ADDRESS
            </button>
          </div>

          {/* Search Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type={searchType === 'email' ? 'email' : 'text'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={searchType === 'orderId' ? 'Enter order number (e.g., KB...)' : 'Enter email address'}
                className="
                  w-full px-4 py-3 bg-black border border-gray-800
                  text-white placeholder-gray-600 text-sm
                  focus:outline-none focus:border-orange-500 transition-colors
                "
              />
              {searchType === 'orderId' ? (
                <Package className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              ) : (
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              )}
            </div>
            <button
              onClick={handleSearch}
              className="
                px-8 py-3 bg-orange-500 text-white
                hover:bg-orange-600 transition-colors
                text-xs tracking-wider font-light
                flex items-center gap-2
              "
            >
              <Search className="w-4 h-4" />
              TRACK
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs mt-3"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Order Details */}
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Order Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-950 border border-gray-900 p-4">
                <p className="text-xs text-gray-500 mb-1 tracking-wider">ORDER NUMBER</p>
                <p className="text-orange-500 font-mono text-sm">{selectedOrder.orderNumber}</p>
              </div>
              <div className="bg-gray-950 border border-gray-900 p-4">
                <p className="text-xs text-gray-500 mb-1 tracking-wider">ORDER DATE</p>
                <p className="text-sm font-light">{formatDate(selectedOrder.orderDate)}</p>
              </div>
              <div className="bg-gray-950 border border-gray-900 p-4">
                <p className="text-xs text-gray-500 mb-1 tracking-wider">ESTIMATED DELIVERY</p>
                <p className="text-sm font-light">{formatDate(selectedOrder.estimatedDelivery)}</p>
              </div>
            </div>

            {/* Tracking Number */}
            {selectedOrder.trackingNumber && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-orange-500/10 border border-orange-500/30 p-4 mb-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-orange-400 mb-1">TRACKING NUMBER</p>
                    <p className="font-mono text-sm">{selectedOrder.trackingNumber}</p>
                  </div>
                </div>
                <button
                  onClick={handleCopyTracking}
                  className="p-2 hover:bg-orange-500/20 transition-colors rounded"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </motion.div>
            )}

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-950 border border-gray-900 p-6 md:p-8 mb-8"
            >
              <h2 className="text-xl font-extralight tracking-[0.2em] mb-6">SHIPMENT STATUS</h2>
              <OrderTimeline
                currentStatus={selectedOrder.status}
                orderDate={selectedOrder.orderDate}
                processingDate={selectedOrder.processingDate}
                shippedDate={selectedOrder.shippedDate}
                deliveredDate={selectedOrder.deliveredDate}
                estimatedDelivery={selectedOrder.estimatedDelivery}
              />
            </motion.div>

            {/* Tracking Updates */}
            {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-950 border border-gray-900 p-6 md:p-8 mb-8"
              >
                <h2 className="text-xl font-extralight tracking-[0.2em] mb-6">TRACKING HISTORY</h2>
                <div className="space-y-4">
                  {[...selectedOrder.trackingUpdates].reverse().map((update, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b border-gray-800 last:border-0"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-light mb-1">{update.message}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(update.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {update.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-950 border border-gray-900 p-6 md:p-8 mb-8"
            >
              <h2 className="text-xl font-extralight tracking-[0.2em] mb-6">ORDER ITEMS</h2>
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-800 last:border-0">
                    <img
                      src={item.imageUrl}
                      alt={item.pieceName}
                      className="w-20 h-20 object-cover bg-gray-900"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-light mb-1">{item.pieceName}</h3>
                      <p className="text-xs text-gray-500 mb-2">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-orange-500">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-800 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-green-500">-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span>{formatPrice(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>{formatPrice(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-light pt-2 border-t border-gray-800">
                  <span>Total</span>
                  <span className="text-orange-500">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-950 border border-gray-900 p-6 md:p-8"
            >
              <h2 className="text-xl font-extralight tracking-[0.2em] mb-4">SHIPPING ADDRESS</h2>
              <div className="text-sm font-light text-gray-300 space-y-1">
                <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                <p>{selectedOrder.shippingAddress.address}</p>
                <p>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                </p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 mb-1">CONTACT</p>
                <p className="text-sm font-light flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  {selectedOrder.customerEmail}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-xs text-gray-500"
        >
          <p>Need help with your order?</p>
          <a href="/contact" className="text-orange-500 hover:text-orange-400 transition-colors">
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderTracking
