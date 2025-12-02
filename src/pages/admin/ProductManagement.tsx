import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Plus, Search, Edit, Trash2, Copy, Eye, CheckCircle, XCircle,
  Filter, Download, Upload, MoreVertical, TrendingUp, AlertCircle
} from 'lucide-react'
import { useProductStore } from '../../stores/useProductStore'
import ProductForm from '../../components/admin/ProductForm'
import { useToast } from '../../components/Toast'
import type { Piece } from '../../stores/useStore'

const ProductManagement = () => {
  const { addToast } = useToast()
  const {
    products,
    initialized,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    toggleAvailability,
    initializeFromMockData
  } = useProductStore()

  // Initialize from mock data on first load
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData()
    }
  }, [initialized, initializeFromMockData])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterAvailability, setFilterAvailability] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Piece | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const categories = [
    'all',
    't-shirts',
    'kh-specials',
    'limited',
    'denims',
    'kh-tailored',
    'khlassic-suits'
  ]

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vibe.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        filterCategory === 'all' || product.category === filterCategory

      const matchesAvailability =
        filterAvailability === 'all' ||
        (filterAvailability === 'available' && product.available) ||
        (filterAvailability === 'unavailable' && !product.available)

      return matchesSearch && matchesCategory && matchesAvailability
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'price':
          comparison = a.price - b.price
          break
        case 'stock':
          comparison = (a.available ? 1 : 0) - (b.available ? 1 : 0)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEditProduct = (product: Piece) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
      addToast('success', 'Product updated successfully')
    } else {
      addProduct(productData)
      addToast('success', 'Product created successfully')
    }
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id)
    setShowDeleteConfirm(null)
    setSelectedProducts((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
    addToast('success', 'Product deleted successfully')
  }

  const handleDuplicateProduct = (id: string) => {
    duplicateProduct(id)
    addToast('success', 'Product duplicated successfully')
  }

  const handleToggleAvailability = (id: string) => {
    const product = products.find((p) => p.id === id)
    const newStatus = !product?.available
    toggleAvailability(id)
    addToast(
      'success',
      `Product marked as ${newStatus ? 'available' : 'unavailable'}`
    )
  }

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  const handleBulkDelete = () => {
    const count = selectedProducts.size
    selectedProducts.forEach((id) => deleteProduct(id))
    setSelectedProducts(new Set())
    addToast('success', `${count} product${count > 1 ? 's' : ''} deleted`)
  }

  const stats = {
    total: products.length,
    available: products.filter((p) => p.available).length,
    unavailable: products.filter((p) => !p.available).length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      padding: '40px 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '200',
                letterSpacing: '0.1em',
                color: '#000',
                marginBottom: '8px'
              }}>
                PRODUCT MANAGEMENT
              </h1>
              <p style={{
                fontSize: '14px',
                fontWeight: '300',
                color: '#6b7280',
                letterSpacing: '0.05em'
              }}>
                Manage your product catalog
              </p>
            </div>
            <button
              onClick={handleAddProduct}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#000',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              ADD PRODUCT
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginTop: '24px'
          }}>
            {[
              { label: 'Total Products', value: stats.total, icon: Package },
              { label: 'Available', value: stats.available, icon: CheckCircle },
              { label: 'Out of Stock', value: stats.unavailable, icon: XCircle },
              { label: 'Total Value', value: `$${stats.totalValue.toFixed(0)}`, icon: TrendingUp }
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon style={{ width: '24px', height: '24px', color: '#000' }} />
                </div>
                <div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '200',
                    color: '#000',
                    marginBottom: '4px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '300',
                    letterSpacing: '0.05em',
                    color: '#6b7280'
                  }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto auto',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: '#6b7280'
                }}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '300',
                outline: 'none',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Availability Filter */}
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '300',
                outline: 'none',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Out of Stock</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-') as [
                  'name' | 'price' | 'stock',
                  'asc' | 'desc'
                ]
                setSortBy(sort)
                setSortOrder(order)
              }}
              style={{
                padding: '10px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '300',
                outline: 'none',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
              <option value="stock-asc">Stock (Out-In)</option>
              <option value="stock-desc">Stock (In-Out)</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.size > 0 && (
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: '300',
                color: '#6b7280'
              }}>
                {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: '300',
                  letterSpacing: '0.05em',
                  cursor: 'pointer'
                }}
              >
                <Trash2 style={{ width: '14px', height: '14px' }} />
                DELETE SELECTED
              </button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  width: '40px'
                }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedProducts.size === filteredProducts.length
                    }
                    onChange={handleSelectAll}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.1em',
                  color: '#6b7280',
                  width: '80px'
                }}>
                  IMAGE
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.1em',
                  color: '#6b7280'
                }}>
                  NAME
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.1em',
                  color: '#6b7280'
                }}>
                  PRICE
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.1em',
                  color: '#6b7280'
                }}>
                  CATEGORY
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.1em',
                  color: '#6b7280'
                }}>
                  STATUS
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.1em',
                  color: '#6b7280'
                }}>
                  VIEWS
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'right',
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.1em',
                  color: '#6b7280'
                }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: '40px',
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '14px',
                      fontWeight: '300'
                    }}
                  >
                    <Package
                      style={{
                        width: '48px',
                        height: '48px',
                        margin: '0 auto 16px',
                        opacity: 0.3
                      }}
                    />
                    <div>No products found</div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f9fafb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff'
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb'
                      }}>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '300',
                        color: '#000',
                        marginBottom: '4px'
                      }}>
                        {product.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '300',
                        color: '#6b7280'
                      }}>
                        {product.vibe}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '300',
                        color: '#000'
                      }}>
                        ${product.price}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {product.category && (
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          background: 'rgba(0, 0, 0, 0.05)',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '300',
                          letterSpacing: '0.05em',
                          color: '#000'
                        }}>
                          {product.category}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => handleToggleAvailability(product.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 12px',
                          background: product.available
                            ? 'rgba(74, 222, 128, 0.1)'
                            : 'rgba(239, 68, 68, 0.1)',
                          border: product.available
                            ? '1px solid rgba(74, 222, 128, 0.3)'
                            : '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '300',
                          letterSpacing: '0.05em',
                          color: product.available ? '#16a34a' : '#dc2626',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {product.available ? (
                          <>
                            <CheckCircle style={{ width: '12px', height: '12px' }} />
                            IN STOCK
                          </>
                        ) : (
                          <>
                            <XCircle style={{ width: '12px', height: '12px' }} />
                            OUT OF STOCK
                          </>
                        )}
                      </button>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '300',
                        color: '#6b7280'
                      }}>
                        {product.views}
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          onClick={() => handleEditProduct(product)}
                          style={{
                            padding: '8px',
                            background: 'transparent',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                            color: '#6b7280',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          title="Edit"
                        >
                          <Edit style={{ width: '14px', height: '14px' }} />
                        </button>
                        <button
                          onClick={() => handleDuplicateProduct(product.id)}
                          style={{
                            padding: '8px',
                            background: 'transparent',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                            color: '#6b7280',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          title="Duplicate"
                        >
                          <Copy style={{ width: '14px', height: '14px' }} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(product.id)}
                          style={{
                            padding: '8px',
                            background: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '4px',
                            color: '#dc2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          title="Delete"
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
            isEdit={!!editingProduct}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '400px',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <AlertCircle style={{ width: '32px', height: '32px', color: '#dc2626' }} />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#000',
                marginBottom: '12px'
              }}>
                Delete Product?
              </h3>
              <p style={{
                fontSize: '14px',
                fontWeight: '300',
                color: '#6b7280',
                marginBottom: '24px'
              }}>
                This action cannot be undone. The product will be permanently deleted.
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    color: '#6b7280',
                    fontSize: '13px',
                    fontWeight: '300',
                    letterSpacing: '0.05em',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleDeleteProduct(showDeleteConfirm)}
                  style={{
                    padding: '12px 24px',
                    background: '#dc2626',
                    border: '1px solid #dc2626',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '300',
                    letterSpacing: '0.05em',
                    cursor: 'pointer'
                  }}
                >
                  DELETE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductManagement
