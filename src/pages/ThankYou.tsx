import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Package, ArrowRight } from 'lucide-react'

const ThankYou = () => {
  const navigate = useNavigate()
  const orderNumber = `KB${Math.random().toString(36).substr(2, 9).toUpperCase()}`

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Success Icon */}
        <motion.div 
          className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        
        {/* Thank You Message */}
        <motion.div
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

        {/* Order Details */}
        <motion.div 
          className="border border-gray-900 bg-gray-950/50 p-8 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <p className="text-xs text-gray-500 mb-1">ORDER NUMBER</p>
              <p className="text-orange-500 font-mono">{orderNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">ESTIMATED DELIVERY</p>
              <p className="font-light">3-5 Business Days</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Order Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span className="text-sm text-gray-400">Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span className="text-sm text-gray-400">Shipped</span>
              </div>
            </div>
          </div>
        </motion.div>

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
          <button
            onClick={() => navigate('/collection')}
            className="px-8 py-3 bg-orange-500 text-white font-light tracking-wider hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            CONTINUE SHOPPING
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 border border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white transition-all font-light tracking-wider"
          >
            BACK TO HOME
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