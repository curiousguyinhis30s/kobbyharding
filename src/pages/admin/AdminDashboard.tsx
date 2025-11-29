import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Users, LogOut,
  Plus, Edit, Trash2, DollarSign, Search,
  ShoppingBag, Bell, BarChart3, FileText, Box,
  Settings, TrendingUp, ChevronDown
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../stores/useStore'
import { useToast } from '../../components/Toast'
import ImageStudio from '../../components/admin/ImageStudio'
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard'
import InventoryManagement from '../../components/admin/InventoryManagement'
import ContentManager from '../../components/admin/ContentManager'
import WaitlistManager from '../../components/admin/WaitlistManager'

// Types
interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  sizes: { [key: string]: number }
  images: string[]
  sku: string
  status: 'active' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
  tags: string[]
  fabricOrigin?: string
  denimType?: string
  vibe?: string
  stock: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: Array<{
    productId: string
    productName: string
    size: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shippingAddress: string
  paymentMethod: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  joinedAt: string
  lastOrderAt: string
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { pieces, setPieces } = useStore()
  const { addToast } = useToast()

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'analytics' | 'inventory' | 'content' | 'image-studio' | 'waitlist' | 'settings'>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  
  // Load data from localStorage on mount and scroll to top
  useEffect(() => {
    window.scrollTo(0, 0)
    loadDataFromStorage()
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('admin_products', JSON.stringify(products))
      // Sync with main store
      const storePieces = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.images[0] || '/kobby-assets/IMG_0885.JPG',
        story: p.description,
        vibe: p.vibe || 'Bold confidence',
        fabricOrigin: p.fabricOrigin || 'Organic Cotton - India',
        denimType: p.denimType || 'Raw Selvedge',
        createdFor: 'The Free Spirit',
        currentLocation: 'Bangkok, Thailand',
        weight: 1.2,
        views: 0,
        hearts: 0,
        inquiries: 0,
        available: p.stock > 0
      }))
      setPieces(storePieces)
    }
  }, [products, setPieces])

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('admin_orders', JSON.stringify(orders))
    }
  }, [orders])

  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('admin_customers', JSON.stringify(customers))
    }
  }, [customers])

  const loadDataFromStorage = () => {
    // Load products
    const storedProducts = localStorage.getItem('admin_products')
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    } else {
      // Initialize with existing pieces
      const initialProducts: Product[] = pieces.map((piece, index) => ({
        id: piece.id,
        name: piece.name,
        price: piece.price,
        description: piece.story,
        category: index < 3 ? 'limited' : 'regular',
        sizes: { XS: 5, S: 8, M: 10, L: 8, XL: 5, XXL: 3 },
        images: [piece.imageUrl],
        sku: `KT-00${index + 1}`,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['denim', 'handcrafted'],
        fabricOrigin: piece.fabricOrigin,
        denimType: piece.denimType,
        vibe: piece.vibe,
        stock: 10
      }))
      setProducts(initialProducts)
    }

    // Load orders
    const storedOrders = localStorage.getItem('admin_orders')
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    } else {
      // Create mock orders
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          items: [
            { productId: '1', productName: 'Sunset Warrior', size: 'M', quantity: 1, price: 450 }
          ],
          total: 450,
          status: 'processing',
          createdAt: new Date().toISOString(),
          shippingAddress: '123 Main St, Bangkok',
          paymentMethod: 'Credit Card'
        }
      ]
      setOrders(mockOrders)
    }

    // Load customers
    const storedCustomers = localStorage.getItem('admin_customers')
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers))
    } else {
      // Create mock customers
      const mockCustomers: Customer[] = [
        {
          id: 'CUST-001',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+66 123 456 789',
          totalOrders: 3,
          totalSpent: 1350,
          joinedAt: new Date().toISOString(),
          lastOrderAt: new Date().toISOString()
        }
      ]
      setCustomers(mockCustomers)
    }
  }

  // Stats calculation
  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    totalProducts: products.filter(p => p.status === 'active').length,
    totalCustomers: customers.length,
    lowStockItems: products.filter(p => {
      const totalStock = Object.values(p.sizes).reduce((sum, qty) => sum + qty, 0)
      return totalStock < 10
    }).length,
    pendingOrders: orders.filter(o => o.status === 'pending').length
  }

  // Product management functions
  const saveProduct = (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updated = products.map(p =>
          p.id === editingProduct.id
            ? { ...p, ...productData, updatedAt: new Date().toISOString() }
            : p
        )
        setProducts(updated)
        addToast('success', `Updated ${productData.name || 'product'}`)
      } else {
        // Add new product
        const newProduct: Product = {
          id: Date.now().toString(),
          name: productData.name || '',
          price: productData.price || 0,
          description: productData.description || '',
          category: productData.category || 'regular',
          sizes: productData.sizes || { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
          images: productData.images || [],
          sku: productData.sku || `KT-${Date.now()}`,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: productData.tags || [],
          fabricOrigin: productData.fabricOrigin,
          denimType: productData.denimType,
          vibe: productData.vibe,
          stock: 10
        }
        setProducts([...products, newProduct])
        addToast('success', `Added ${productData.name || 'product'}`)
      }
      setShowProductModal(false)
      setEditingProduct(null)
    } catch (error) {
      addToast('error', 'Failed to save product. Please try again.')
      console.error('Error saving product:', error)
    }
  }

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id)
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        setProducts(products.filter(p => p.id !== id))
        addToast('success', `Deleted ${product?.name || 'product'}`)
      } catch (error) {
        addToast('error', 'Failed to delete product. Please try again.')
        console.error('Error deleting product:', error)
      }
    }
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    try {
      const updated = orders.map(o =>
        o.id === orderId ? { ...o, status } : o
      )
      setOrders(updated)
      addToast('success', `Order #${orderId} marked as ${status}`)
    } catch (error) {
      addToast('error', 'Failed to update order status. Please try again.')
      console.error('Error updating order status:', error)
    }
  }

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    background: '#ffffff',
    color: '#000000'
  }

  const cardStyle = {
    background: '#ffffff',
    border: `1px solid ${'#e0e0e0'}`,
    borderRadius: '8px',
    padding: '24px',
    transition: 'all 0.3s'
  }

  const buttonStyle = {
    padding: '10px 20px',
    background: '#000000',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '300',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.3s'
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    background: 'rgba(0, 0, 0, 0.05)',
    border: `1px solid ${'#e0e0e0'}`,
    borderRadius: '4px',
    color: '#000000',
    fontSize: '14px',
    outline: 'none'
  }

  // Render Dashboard
  const renderDashboard = () => (
    <div>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <motion.div style={cardStyle} whileHover={{ y: -4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#666666', marginBottom: '8px' }}>
                Total Revenue
              </p>
              <h3 style={{ fontSize: '28px', fontWeight: '300', color: '#000000' }}>
                ${stats.totalRevenue.toLocaleString()}
              </h3>
              <p style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
                +12.5% from last month
              </p>
            </div>
            <DollarSign style={{ width: '24px', height: '24px', color: '#000000' }} />
          </div>
        </motion.div>

        <motion.div style={cardStyle} whileHover={{ y: -4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#666666', marginBottom: '8px' }}>
                Total Orders
              </p>
              <h3 style={{ fontSize: '28px', fontWeight: '300', color: '#000000' }}>
                {stats.totalOrders}
              </h3>
              <p style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>
                {stats.pendingOrders} pending
              </p>
            </div>
            <ShoppingBag style={{ width: '24px', height: '24px', color: '#000000' }} />
          </div>
        </motion.div>

        <motion.div style={cardStyle} whileHover={{ y: -4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#666666', marginBottom: '8px' }}>
                Active Products
              </p>
              <h3 style={{ fontSize: '28px', fontWeight: '300', color: '#000000' }}>
                {stats.totalProducts}
              </h3>
              <p style={{ fontSize: '11px', color: stats.lowStockItems > 0 ? '#ef4444' : '#10b981', marginTop: '4px' }}>
                {stats.lowStockItems} low stock
              </p>
            </div>
            <Package style={{ width: '24px', height: '24px', color: '#000000' }} />
          </div>
        </motion.div>

        <motion.div style={cardStyle} whileHover={{ y: -4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#666666', marginBottom: '8px' }}>
                Customers
              </p>
              <h3 style={{ fontSize: '28px', fontWeight: '300', color: '#000000' }}>
                {stats.totalCustomers}
              </h3>
              <p style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
                +8 this week
              </p>
            </div>
            <Users style={{ width: '24px', height: '24px', color: '#000000' }} />
          </div>
        </motion.div>
      </div>

      {/* Recent Orders & Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 1024 ? '2fr 1fr' : '1fr', gap: '20px' }}>
        {/* Recent Orders */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '300', marginBottom: '20px', color: '#000000' }}>
            Recent Orders
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${'#e0e0e0'}` }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Order ID</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Customer</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Total</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} style={{ borderBottom: `1px solid ${'#e0e0e0'}` }}>
                    <td style={{ padding: '12px 8px', color: '#000000' }}>#{order.id}</td>
                    <td style={{ padding: '12px 8px' }}>{order.customerName}</td>
                    <td style={{ padding: '12px 8px' }}>${order.total}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        background: order.status === 'delivered' ? 'rgba(16, 185, 129, 0.1)' :
                                   order.status === 'processing' ? 'rgba(245, 158, 11, 0.1)' :
                                   'rgba(156, 163, 175, 0.1)',
                        color: order.status === 'delivered' ? '#10b981' :
                               order.status === 'processing' ? '#f59e0b' :
                               '#666666'
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '300', marginBottom: '20px', color: '#000000' }}>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                marginTop: '6px'
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#000000' }}>New order received</p>
                <p style={{ fontSize: '11px', color: '#666666' }}>2 minutes ago</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#f59e0b',
                marginTop: '6px'
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#000000' }}>Low stock alert: Sunset Warrior</p>
                <p style={{ fontSize: '11px', color: '#666666' }}>1 hour ago</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#000000',
                marginTop: '6px'
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#000000' }}>New customer registered</p>
                <p style={{ fontSize: '11px', color: '#666666' }}>3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Render Products
  const renderProducts = () => (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '200', color: '#000000' }}>Products</h2>
        <button
          style={buttonStyle}
          onClick={() => {
            setEditingProduct(null)
            setShowProductModal(true)
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: '#666666'
          }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '36px' }}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            ...inputStyle,
            width: 'auto',
            minWidth: '150px',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Categories</option>
          <option value="limited">Limited Edition</option>
          <option value="regular">Regular</option>
        </select>
      </div>

      {/* Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {products
          .filter(p => filterCategory === 'all' || p.category === filterCategory)
          .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(product => {
            const totalStock = Object.values(product.sizes).reduce((sum, qty) => sum + qty, 0)
            const isLowStock = totalStock < 10
            
            return (
              <motion.div
                key={product.id}
                style={{
                  ...cardStyle,
                  padding: 0,
                  overflow: 'hidden'
                }}
                whileHover={{ y: -4 }}
              >
                <div style={{
                  aspectRatio: '3/4',
                  background: 'rgba(255, 255, 255, 0.9)',
                  position: 'relative'
                }}>
                  <img
                    src={product.images[0] || '/kobby-assets/IMG_0886.JPG'}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {isLowStock && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '4px 8px',
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '500',
                      borderRadius: '4px'
                    }}>
                      LOW STOCK
                    </span>
                  )}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => {
                        setEditingProduct(product)
                        setShowProductModal(true)
                      }}
                      style={{
                        padding: '8px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      style={{
                        padding: '8px',
                        background: 'rgba(239, 68, 68, 0.7)',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '300', marginBottom: '8px' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#666666', marginBottom: '8px' }}>
                    SKU: {product.sku}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', color: '#000000' }}>
                      ${product.price}
                    </span>
                    <span style={{ fontSize: '12px', color: '#666666' }}>
                      Stock: {totalStock}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
      </div>
    </div>
  )

  // Render Orders
  const renderOrders = () => (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '200', marginBottom: '24px', color: '#000000' }}>
        Orders
      </h2>
      
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${'#e0e0e0'}` }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Order ID</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Items</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: `1px solid ${'#e0e0e0'}` }}>
                  <td style={{ padding: '12px', color: '#000000' }}>#{order.id}</td>
                  <td style={{ padding: '12px' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <p>{order.customerName}</p>
                      <p style={{ fontSize: '11px', color: '#666666' }}>{order.customerEmail}</p>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {order.items.map(item => (
                      <div key={`${item.productId}-${item.size}`} style={{ fontSize: '12px' }}>
                        {item.productName} ({item.size}) x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>${order.total}</td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        border: `1px solid ${'#e0e0e0'}`,
                        background: '#ffffff',
                        color: '#000000',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      style={{
                        padding: '4px 8px',
                        background: 'transparent',
                        border: `1px solid ${'#e0e0e0'}`,
                        borderRadius: '4px',
                        color: '#000000',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Render Customers
  const renderCustomers = () => (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '200', marginBottom: '24px', color: '#000000' }}>
        Customers
      </h2>
      
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${'#e0e0e0'}` }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Phone</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Orders</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Total Spent</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id} style={{ borderBottom: `1px solid ${'#e0e0e0'}` }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{customer.name}</td>
                  <td style={{ padding: '12px' }}>{customer.email}</td>
                  <td style={{ padding: '12px' }}>{customer.phone}</td>
                  <td style={{ padding: '12px' }}>{customer.totalOrders}</td>
                  <td style={{ padding: '12px', color: '#000000' }}>${customer.totalSpent}</td>
                  <td style={{ padding: '12px' }}>
                    {new Date(customer.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{...containerStyle, paddingTop: '64px'}}>
      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'inventory' && <InventoryManagement />}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'customers' && renderCustomers()}
        {activeTab === 'waitlist' && (
          <div style={{ background: '#000', minHeight: '80vh', marginLeft: '-24px', marginRight: '-24px', marginTop: '-24px', paddingTop: '24px' }}>
            <WaitlistManager />
          </div>
        )}
        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'image-studio' && <ImageStudio />}
        {activeTab === 'settings' && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '24px', fontWeight: '200', color: '#000000', marginBottom: '24px' }}>Settings</h2>
            <p style={{ fontSize: '14px', color: '#666666' }}>Store settings and configuration management coming soon...</p>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowProductModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              style={{
                ...cardStyle,
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '20px', fontWeight: '300', marginBottom: '24px' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                saveProduct({
                  name: formData.get('name') as string,
                  price: Number(formData.get('price')),
                  description: formData.get('description') as string,
                  category: formData.get('category') as string,
                  sku: formData.get('sku') as string,
                  vibe: formData.get('vibe') as string,
                  fabricOrigin: formData.get('fabricOrigin') as string,
                  denimType: formData.get('denimType') as string,
                  sizes: editingProduct?.sizes || { XS: 5, S: 8, M: 10, L: 8, XL: 5, XXL: 3 }
                })
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input
                    name="name"
                    type="text"
                    placeholder="Product Name"
                    defaultValue={editingProduct?.name}
                    required
                    style={inputStyle}
                  />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input
                      name="price"
                      type="number"
                      placeholder="Price"
                      defaultValue={editingProduct?.price}
                      required
                      style={inputStyle}
                    />
                    <input
                      name="sku"
                      type="text"
                      placeholder="SKU"
                      defaultValue={editingProduct?.sku}
                      required
                      style={inputStyle}
                    />
                  </div>
                  
                  <textarea
                    name="description"
                    placeholder="Product Description"
                    defaultValue={editingProduct?.description}
                    rows={4}
                    style={inputStyle}
                  />
                  
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'regular'}
                    style={inputStyle}
                  >
                    <option value="regular">Regular</option>
                    <option value="limited">Limited Edition</option>
                  </select>
                  
                  <input
                    name="vibe"
                    type="text"
                    placeholder="Vibe (e.g., Bold confidence)"
                    defaultValue={editingProduct?.vibe}
                    style={inputStyle}
                  />
                  
                  <input
                    name="fabricOrigin"
                    type="text"
                    placeholder="Fabric Origin"
                    defaultValue={editingProduct?.fabricOrigin}
                    style={inputStyle}
                  />
                  
                  <input
                    name="denimType"
                    type="text"
                    placeholder="Denim Type"
                    defaultValue={editingProduct?.denimType}
                    style={inputStyle}
                  />
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setShowProductModal(false)}
                      style={{
                        ...buttonStyle,
                        background: 'transparent',
                        border: `1px solid ${'#e0e0e0'}`,
                        color: '#666666'
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" style={buttonStyle}>
                      {editingProduct ? 'Update' : 'Create'} Product
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard