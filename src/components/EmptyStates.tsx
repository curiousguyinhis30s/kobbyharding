import { ShoppingBag, Search, Heart, Package } from 'lucide-react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon?: 'cart' | 'search' | 'favorites' | 'orders'
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState = ({
  icon = 'cart',
  title,
  message,
  actionLabel,
  onAction
}: EmptyStateProps) => {
  const icons = {
    cart: ShoppingBag,
    search: Search,
    favorites: Heart,
    orders: Package
  }

  const Icon = icons[icon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '60px 20px',
        textAlign: 'center'
      }}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        style={{
          width: '120px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          marginBottom: '32px'
        }}
      >
        <Icon style={{ width: '48px', height: '48px', color: 'rgba(255, 255, 255, 0.4)' }} />
      </motion.div>

      {/* Title */}
      <h3 style={{
        fontSize: '24px',
        fontWeight: '300',
        letterSpacing: '0.1em',
        color: '#ffffff',
        marginBottom: '12px'
      }}>
        {title}
      </h3>

      {/* Message */}
      <p style={{
        fontSize: '14px',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.5)',
        maxWidth: '400px',
        marginBottom: '32px',
        letterSpacing: '0.02em'
      }}>
        {message}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          style={{
            padding: '14px 40px',
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            fontSize: '13px',
            fontWeight: '300',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff'
          }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}

// Preset empty states for common scenarios
export const EmptyCart = ({ onContinueShopping }: { onContinueShopping: () => void }) => (
  <EmptyState
    icon="cart"
    title="YOUR BAG IS EMPTY"
    message="Discover our collection of unique pieces crafted with intention. Each item tells a story waiting to be part of yours."
    actionLabel="EXPLORE COLLECTION"
    onAction={onContinueShopping}
  />
)

export const EmptySearch = ({ query, onClearFilters }: { query: string; onClearFilters?: () => void }) => (
  <EmptyState
    icon="search"
    title="NO RESULTS FOUND"
    message={`We couldn't find any pieces matching "${query}". Try adjusting your search or browse our full collection.`}
    actionLabel={onClearFilters ? "CLEAR ALL FILTERS" : undefined}
    onAction={onClearFilters}
  />
)

export const EmptyFavorites = ({ onExplore }: { onExplore: () => void }) => (
  <EmptyState
    icon="favorites"
    title="NO FAVORITES YET"
    message="Start building your collection by marking pieces you love. They'll appear here for easy access."
    actionLabel="DISCOVER PIECES"
    onAction={onExplore}
  />
)

export const EmptyOrders = () => (
  <EmptyState
    icon="orders"
    title="NO ORDERS YET"
    message="Your order history will appear here once you make your first purchase."
  />
)

export default EmptyState