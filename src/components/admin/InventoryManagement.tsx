import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, AlertTriangle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { useToast } from '../Toast'

interface InventoryItem {
  id: string
  productName: string
  sku: string
  sizes: { [key: string]: number }
  totalStock: number
  minStock: number
  maxStock: number
  reorderPoint: number
  lastRestocked: string
  supplier: string
  cost: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock'
}

const InventoryManagement = () => {
  const { addToast } = useToast()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [showRestockModal, setShowRestockModal] = useState(false)

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = () => {
    const storedInventory = localStorage.getItem('admin_inventory')
    if (storedInventory) {
      setInventory(JSON.parse(storedInventory))
    } else {
      // Initialize with sample data
      const sampleInventory: InventoryItem[] = [
        {
          id: '1',
          productName: 'African Print Shirt',
          sku: 'KH-001',
          sizes: { XS: 5, S: 8, M: 12, L: 10, XL: 6, XXL: 3 },
          totalStock: 44,
          minStock: 20,
          maxStock: 100,
          reorderPoint: 30,
          lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          supplier: 'Accra Textiles Ltd',
          cost: 35,
          status: 'in_stock'
        },
        {
          id: '2',
          productName: 'Kente Pattern Dress',
          sku: 'KH-002',
          sizes: { XS: 2, S: 3, M: 2, L: 1, XL: 0, XXL: 0 },
          totalStock: 8,
          minStock: 15,
          maxStock: 80,
          reorderPoint: 20,
          lastRestocked: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          supplier: 'Ghana Fashion Co',
          cost: 55,
          status: 'low_stock'
        },
        {
          id: '3',
          productName: 'Dashiki Premium',
          sku: 'KH-003',
          sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
          totalStock: 0,
          minStock: 10,
          maxStock: 60,
          reorderPoint: 15,
          lastRestocked: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          supplier: 'Lagos Craft House',
          cost: 45,
          status: 'out_of_stock'
        }
      ]
      setInventory(sampleInventory)
      localStorage.setItem('admin_inventory', JSON.stringify(sampleInventory))
    }
  }

  const updateInventory = (productId: string, sizes: { [key: string]: number }) => {
    try {
      const product = inventory.find(item => item.id === productId)
      const updated = inventory.map(item => {
        if (item.id === productId) {
          const totalStock = Object.values(sizes).reduce((sum, qty) => sum + qty, 0)
          let status: InventoryItem['status'] = 'in_stock'
          if (totalStock === 0) status = 'out_of_stock'
          else if (totalStock < item.minStock) status = 'low_stock'
          else if (totalStock > item.maxStock) status = 'overstock'

          return {
            ...item,
            sizes,
            totalStock,
            status,
            lastRestocked: new Date().toISOString()
          }
        }
        return item
      })
      setInventory(updated)
      localStorage.setItem('admin_inventory', JSON.stringify(updated))
      addToast('success', `Updated inventory for ${product?.productName || 'product'}`)
    } catch (error) {
      addToast('error', 'Failed to update inventory. Please try again.')
      console.error('Error updating inventory:', error)
    }
  }

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return '#10b981'
      case 'low_stock': return '#f59e0b'
      case 'out_of_stock': return '#ef4444'
      case 'overstock': return '#8b5cf6'
      default: return '#666666'
    }
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

  // Calculate inventory metrics
  const metrics = {
    totalProducts: inventory.length,
    totalStock: inventory.reduce((sum, item) => sum + item.totalStock, 0),
    lowStockItems: inventory.filter(item => item.status === 'low_stock').length,
    outOfStockItems: inventory.filter(item => item.status === 'out_of_stock').length,
    totalValue: inventory.reduce((sum, item) => sum + (item.totalStock * item.cost), 0),
    needsReorder: inventory.filter(item => item.totalStock <= item.reorderPoint).length
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '200', color: '#000000', marginBottom: '8px' }}>
          Inventory Management
        </h2>
        <p style={{ fontSize: '14px', color: '#666666' }}>
          Track stock levels, manage reorders, and monitor inventory health
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <motion.div style={cardStyle} whileHover={{ y: -4 }}>
          <Package style={{ width: '20px', height: '20px', color: '#000000', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '300', color: '#000000' }}>{metrics.totalStock}</h3>
          <p style={{ fontSize: '12px', color: '#666666' }}>Total Stock Units</p>
        </motion.div>

        <motion.div style={cardStyle} whileHover={{ y: -4 }}>
          <TrendingUp style={{ width: '20px', height: '20px', color: '#10b981', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '300', color: '#000000' }}>${metrics.totalValue.toLocaleString()}</h3>
          <p style={{ fontSize: '12px', color: '#666666' }}>Inventory Value</p>
        </motion.div>

        <motion.div style={cardStyle} whileHover={{ y: -4 }}>
          <AlertTriangle style={{ width: '20px', height: '20px', color: '#f59e0b', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '300', color: '#000000' }}>{metrics.lowStockItems}</h3>
          <p style={{ fontSize: '12px', color: '#666666' }}>Low Stock Items</p>
        </motion.div>

        <motion.div style={cardStyle} whileHover={{ y: -4 }}>
          <TrendingDown style={{ width: '20px', height: '20px', color: '#ef4444', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '300', color: '#000000' }}>{metrics.outOfStockItems}</h3>
          <p style={{ fontSize: '12px', color: '#666666' }}>Out of Stock</p>
        </motion.div>

        <motion.div style={cardStyle} whileHover={{ y: -4 }}>
          <RefreshCw style={{ width: '20px', height: '20px', color: '#8b5cf6', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '300', color: '#000000' }}>{metrics.needsReorder}</h3>
          <p style={{ fontSize: '12px', color: '#666666' }}>Need Reorder</p>
        </motion.div>
      </div>

      {/* Inventory Table */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '300', color: '#000000' }}>Stock Levels</h3>
          <button
            onClick={() => setShowRestockModal(true)}
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Bulk Restock
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${'#e0e0e0'}` }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>SKU</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#666666', fontWeight: '400' }}>XS</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#666666', fontWeight: '400' }}>S</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#666666', fontWeight: '400' }}>M</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#666666', fontWeight: '400' }}>L</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#666666', fontWeight: '400' }}>XL</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#666666', fontWeight: '400' }}>XXL</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Supplier</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666666', fontWeight: '400' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${'#e0e0e0'}` }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{item.productName}</td>
                  <td style={{ padding: '12px', color: '#666666' }}>{item.sku}</td>
                  {Object.entries(item.sizes).map(([size, qty]) => (
                    <td key={size} style={{
                      padding: '12px',
                      textAlign: 'center',
                      color: qty === 0 ? '#ef4444' : qty <= 3 ? '#f59e0b' : '#000000'
                    }}>
                      {qty}
                    </td>
                  ))}
                  <td style={{ padding: '12px', fontWeight: '500' }}>{item.totalStock}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      background: `${getStatusColor(item.status)}20`,
                      color: getStatusColor(item.status)
                    }}>
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>{item.supplier}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => {
                        setSelectedProduct(item.id)
                        setShowRestockModal(true)
                      }}
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
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {showRestockModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
          onClick={() => {
            setShowRestockModal(false)
            setSelectedProduct(null)
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            style={{
              ...cardStyle,
              maxWidth: '500px',
              width: '100%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '300', marginBottom: '24px' }}>
              Restock Inventory
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <select
                value={selectedProduct || ''}
                onChange={(e) => setSelectedProduct(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select Product</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>{item.productName}</option>
                ))}
              </select>

              {selectedProduct && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {Object.keys(inventory[0].sizes).map(size => (
                    <div key={size}>
                      <label style={{ fontSize: '12px', color: '#666666' }}>{size}</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Qty"
                        style={{ ...inputStyle, marginTop: '4px' }}
                        id={`restock-${size}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={() => {
                    setShowRestockModal(false)
                    setSelectedProduct(null)
                  }}
                  style={{
                    ...buttonStyle,
                    background: 'transparent',
                    border: `1px solid ${'#e0e0e0'}`,
                    color: '#666666'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedProduct) {
                      const item = inventory.find(i => i.id === selectedProduct)
                      if (item) {
                        const newSizes = { ...item.sizes }
                        Object.keys(newSizes).forEach(size => {
                          const input = document.getElementById(`restock-${size}`) as HTMLInputElement
                          if (input && input.value) {
                            newSizes[size] += parseInt(input.value)
                          }
                        })
                        updateInventory(selectedProduct, newSizes)
                      }
                    }
                    setShowRestockModal(false)
                    setSelectedProduct(null)
                  }}
                  style={buttonStyle}
                >
                  Update Stock
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default InventoryManagement