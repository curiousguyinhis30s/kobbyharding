import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Package, Clock, CheckCircle, XCircle, Truck, Filter, Search, Eye, Download, AlertCircle, Calendar, User, MapPin, DollarSign, Tag, MessageSquare } from 'lucide-react'
import { adminPageStyles } from '../../utils/adminStyles'
import { useToast } from '../../components/Toast'

interface Order {
  id: string
  date: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: {
    id: string
    name: string
    size: string
    quantity: number
    price: number
  }[]
  shipping: {
    address: string
    city: string
    country: string
    method: string
    tracking?: string
  }
  payment: {
    method: string
    status: 'paid' | 'pending' | 'failed'
    total: number
  }
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes?: string
}

const OrderManagement = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-2025-001',
      date: '2025-01-12',
      customer: {
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        phone: '+65 9123 4567'
      },
      items: [
        { id: '1', name: 'Sunset Warrior', size: 'M', quantity: 1, price: 280 },
        { id: '2', name: 'Midnight Bloom', size: 'S', quantity: 1, price: 260 }
      ],
      shipping: {
        address: '123 Orchard Road',
        city: 'Singapore',
        country: 'Singapore',
        method: 'Express',
        tracking: 'SG12345678'
      },
      payment: {
        method: 'Credit Card',
        status: 'paid',
        total: 540
      },
      status: 'shipped'
    },
    {
      id: 'ORD-2025-002',
      date: '2025-01-11',
      customer: {
        name: 'Michael Park',
        email: 'mpark@example.com',
        phone: '+82 10 1234 5678'
      },
      items: [
        { id: '3', name: 'Urban Echo', size: 'L', quantity: 2, price: 320 }
      ],
      shipping: {
        address: '456 Gangnam-gu',
        city: 'Seoul',
        country: 'South Korea',
        method: 'Standard'
      },
      payment: {
        method: 'PayPal',
        status: 'paid',
        total: 640
      },
      status: 'processing'
    },
    {
      id: 'ORD-2025-003',
      date: '2025-01-10',
      customer: {
        name: 'Lisa Thompson',
        email: 'lisa.t@example.com',
        phone: '+66 81 234 5678'
      },
      items: [
        { id: '4', name: 'Festival Spirit', size: 'M', quantity: 1, price: 299 }
      ],
      shipping: {
        address: '789 Sukhumvit Road',
        city: 'Bangkok',
        country: 'Thailand',
        method: 'Express'
      },
      payment: {
        method: 'Bank Transfer',
        status: 'pending',
        total: 299
      },
      status: 'pending'
    }
  ])

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showGuidelines, setShowGuidelines] = useState(false)

  const statusColors = {
    pending: { bg: 'rgba(255, 165, 0, 0.1)', border: 'rgba(255, 165, 0, 0.3)', text: '#ffa500' },
    processing: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6' },
    shipped: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', text: '#a855f7' },
    delivered: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.3)', text: '#4ade80' },
    cancelled: { bg: 'rgba(255, 107, 107, 0.1)', border: 'rgba(255, 107, 107, 0.3)', text: '#ff6b6b' }
  }

  const orderStatuses = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { value: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ]

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    try {
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      const statusText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
      addToast('success', `Order ${orderId} marked as ${statusText}`)
      setSelectedOrder(null)
    } catch (error) {
      addToast('error', 'Failed to update order status. Please try again.')
      console.error('Error updating order status:', error)
    }
  }

  const orderGuidelines = {
    statuses: [
      {
        status: 'PENDING',
        action: 'Review payment status and inventory availability',
        timeline: 'Process within 24 hours',
        next: 'Move to Processing once payment confirmed'
      },
      {
        status: 'PROCESSING',
        action: 'Prepare items for shipment, quality check',
        timeline: '1-2 business days',
        next: 'Update to Shipped with tracking number'
      },
      {
        status: 'SHIPPED',
        action: 'Monitor tracking, send customer notification',
        timeline: 'Varies by destination',
        next: 'Mark as Delivered when confirmed'
      },
      {
        status: 'DELIVERED',
        action: 'Follow up for feedback, resolve any issues',
        timeline: 'Within 48 hours of delivery',
        next: 'Close order or handle returns if needed'
      }
    ],
    bestPractices: [
      'Process orders chronologically unless priority shipping',
      'Always add tracking number when marking as shipped',
      'Send email notifications for all status changes',
      'Document any special requests in order notes',
      'Verify shipping address for international orders',
      'Contact customer if payment pending > 48 hours'
    ]
  }

  return (
    <div style={adminPageStyles.container}>
      {/* Header */}
      <section style={adminPageStyles.header}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={adminPageStyles.title}>
              ORDER MANAGEMENT
            </h1>
            <p style={adminPageStyles.subtitle}>
              Process and track customer orders efficiently
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              style={{
                padding: '12px 24px',
                background: showGuidelines ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: '1px solid #d1d5db',
                color: '#000',
                fontSize: '11px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {showGuidelines ? 'HIDE' : 'VIEW'} GUIDELINES
            </button>

            <button
              onClick={() => navigate('/admin')}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid #d1d5db',
                color: '#000',
                fontSize: '11px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#000'
                e.currentTarget.style.background = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              BACK TO ADMIN
            </button>
          </div>
        </div>
      </section>

      {/* Guidelines Panel */}
      <AnimatePresence>
        {showGuidelines && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              overflow: 'hidden',
              background: 'rgba(74, 222, 128, 0.02)',
              borderBottom: '1px solid rgba(74, 222, 128, 0.2)'
            }}
          >
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '40px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '32px'
              }}>
                <AlertCircle style={{ width: '20px', height: '20px', color: '#4ade80' }} />
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '200',
                  letterSpacing: '0.2em',
                  color: '#4ade80'
                }}>
                  ORDER PROCESSING GUIDELINES
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px'
              }}>
                {/* Status Workflow */}
                <div>
                  <h4 style={{
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    marginBottom: '20px',
                    opacity: 0.7
                  }}>
                    STATUS WORKFLOW
                  </h4>
                  {orderGuidelines.statuses.map((item, index) => (
                    <div key={index} style={{
                      marginBottom: '20px',
                      padding: '16px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '300',
                        marginBottom: '8px',
                        color: '#4ade80'
                      }}>
                        {item.status}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        opacity: 0.7,
                        lineHeight: '1.6'
                      }}>
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Action:</strong> {item.action}
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <strong>Timeline:</strong> {item.timeline}
                        </div>
                        <div>
                          <strong>Next:</strong> {item.next}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Best Practices */}
                <div>
                  <h4 style={{
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    marginBottom: '20px',
                    opacity: 0.7
                  }}>
                    BEST PRACTICES
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0
                  }}>
                    {orderGuidelines.bestPractices.map((practice, index) => (
                      <li key={index} style={{
                        fontSize: '11px',
                        lineHeight: '1.8',
                        opacity: 0.7,
                        marginBottom: '12px',
                        paddingLeft: '20px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: '#4ade80'
                        }}>✓</span>
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 style={{
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    marginBottom: '20px',
                    opacity: 0.7
                  }}>
                    QUICK ACTIONS
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <button style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid #d1d5db',
                      color: '#000',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'left'
                    }}>
                      <Download style={{ width: '12px', height: '12px', display: 'inline', marginRight: '8px' }} />
                      EXPORT TODAY'S ORDERS
                    </button>
                    <button style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid #d1d5db',
                      color: '#000',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'left'
                    }}>
                      <MessageSquare style={{ width: '12px', height: '12px', display: 'inline', marginRight: '8px' }} />
                      BULK EMAIL CUSTOMERS
                    </button>
                    <button style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid #d1d5db',
                      color: '#000',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'left'
                    }}>
                      <Truck style={{ width: '12px', height: '12px', display: 'inline', marginRight: '8px' }} />
                      PRINT SHIPPING LABELS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <section style={{
        padding: '32px 40px',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap'
        }}>
          {/* Status Filters */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {orderStatuses.map(status => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                style={{
                  padding: '8px 16px',
                  background: filterStatus === status.value ? '#f3f4f6' : 'transparent',
                  border: '1px solid #d1d5db',
                  color: filterStatus === status.value ? '#000' : '#6b7280',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {status.label}
                <span style={{
                  padding: '2px 6px',
                  background: '#f3f4f6',
                  borderRadius: '10px',
                  fontSize: '10px'
                }}>
                  {status.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{
            position: 'relative',
            width: '300px'
          }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              opacity: 0.5
            }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                background: 'transparent',
                border: '1px solid #d1d5db',
                color: '#000',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </section>

      {/* Orders Table */}
      <section style={{
        padding: '40px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '120px 120px 200px 200px 120px 120px 100px',
            padding: '16px 24px',
            background: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            fontSize: '10px',
            letterSpacing: '0.2em',
            opacity: 0.5
          }}>
            <div>ORDER ID</div>
            <div>DATE</div>
            <div>CUSTOMER</div>
            <div>ITEMS</div>
            <div>TOTAL</div>
            <div>STATUS</div>
            <div>ACTIONS</div>
          </div>

          {/* Table Body */}
          {filteredOrders.map((order, index) => (
            <div
              key={order.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 120px 200px 200px 120px 120px 100px',
                padding: '20px 24px',
                borderBottom: index < filteredOrders.length - 1 ? '1px solid #f3f4f6' : 'none',
                fontSize: '12px',
                alignItems: 'center',
                transition: 'background 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              onClick={() => setSelectedOrder(order)}
            >
              <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>{order.id}</div>
              <div style={{ opacity: 0.7 }}>{order.date}</div>
              <div>
                <div style={{ marginBottom: '4px' }}>{order.customer.name}</div>
                <div style={{ fontSize: '10px', opacity: 0.5 }}>{order.customer.email}</div>
              </div>
              <div>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ fontSize: '11px', opacity: 0.8 }}>
                    {item.name} ({item.size}) x{item.quantity}
                  </div>
                ))}
              </div>
              <div style={{ fontWeight: '300' }}>${order.payment.total}</div>
              <div>
                <span style={{
                  padding: '4px 12px',
                  background: statusColors[order.status].bg,
                  border: `1px solid ${statusColors[order.status].border}`,
                  color: statusColors[order.status].text,
                  fontSize: '10px',
                  letterSpacing: '0.1em'
                }}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedOrder(order)
                  }}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    border: '1px solid #d1d5db',
                    color: '#000',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye style={{ width: '12px', height: '12px' }} />
                  VIEW
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 100
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '800px',
                maxHeight: '80vh',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                zIndex: 101,
                overflow: 'auto'
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '200',
                    letterSpacing: '0.2em',
                    marginBottom: '8px'
                  }}>
                    ORDER DETAILS
                  </h2>
                  <p style={{
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    opacity: 0.5
                  }}>
                    {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <XCircle style={{ width: '20px', height: '20px' }} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '24px' }}>
                {/* Status Update */}
                <div style={{
                  padding: '20px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    marginBottom: '16px',
                    opacity: 0.7
                  }}>
                    UPDATE STATUS
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status as Order['status'])}
                        disabled={selectedOrder.status === status}
                        style={{
                          padding: '8px 16px',
                          background: selectedOrder.status === status ? statusColors[status].bg : 'transparent',
                          border: `1px solid ${selectedOrder.status === status ? statusColors[status].border : 'rgba(255, 255, 255, 0.2)'}`,
                          color: selectedOrder.status === status ? statusColors[status].text : '#fff',
                          fontSize: '10px',
                          letterSpacing: '0.1em',
                          cursor: selectedOrder.status === status ? 'default' : 'pointer',
                          opacity: selectedOrder.status === status ? 1 : 0.6,
                          transition: 'all 0.3s'
                        }}
                      >
                        {status.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '24px'
                }}>
                  {/* Customer Info */}
                  <div style={{
                    padding: '20px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <User style={{ width: '14px', height: '14px', opacity: 0.6 }} />
                      <h3 style={{
                        fontSize: '12px',
                        letterSpacing: '0.2em',
                        opacity: 0.7
                      }}>
                        CUSTOMER
                      </h3>
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                      <div style={{ marginBottom: '8px' }}>{selectedOrder.customer.name}</div>
                      <div style={{ opacity: 0.6, marginBottom: '4px' }}>{selectedOrder.customer.email}</div>
                      <div style={{ opacity: 0.6 }}>{selectedOrder.customer.phone}</div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div style={{
                    padding: '20px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <MapPin style={{ width: '14px', height: '14px', opacity: 0.6 }} />
                      <h3 style={{
                        fontSize: '12px',
                        letterSpacing: '0.2em',
                        opacity: 0.7
                      }}>
                        SHIPPING
                      </h3>
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                      <div style={{ marginBottom: '8px' }}>{selectedOrder.shipping.address}</div>
                      <div style={{ opacity: 0.6, marginBottom: '4px' }}>{selectedOrder.shipping.city}, {selectedOrder.shipping.country}</div>
                      <div style={{ opacity: 0.6, marginBottom: '4px' }}>Method: {selectedOrder.shipping.method}</div>
                      {selectedOrder.shipping.tracking && (
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', marginTop: '8px' }}>
                          Tracking: {selectedOrder.shipping.tracking}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{
                    padding: '20px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <Package style={{ width: '14px', height: '14px', opacity: 0.6 }} />
                      <h3 style={{
                        fontSize: '12px',
                        letterSpacing: '0.2em',
                        opacity: 0.7
                      }}>
                        ITEMS
                      </h3>
                    </div>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} style={{
                        fontSize: '12px',
                        marginBottom: '12px',
                        paddingBottom: '12px',
                        borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                      }}>
                        <div style={{ marginBottom: '4px' }}>{item.name}</div>
                        <div style={{ opacity: 0.6 }}>
                          Size: {item.size} | Qty: {item.quantity} | ${item.price}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment */}
                  <div style={{
                    padding: '20px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <DollarSign style={{ width: '14px', height: '14px', opacity: 0.6 }} />
                      <h3 style={{
                        fontSize: '12px',
                        letterSpacing: '0.2em',
                        opacity: 0.7
                      }}>
                        PAYMENT
                      </h3>
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                      <div style={{ marginBottom: '8px' }}>Method: {selectedOrder.payment.method}</div>
                      <div style={{ marginBottom: '8px' }}>
                        Status: 
                        <span style={{
                          marginLeft: '8px',
                          padding: '2px 8px',
                          background: selectedOrder.payment.status === 'paid' 
                            ? 'rgba(74, 222, 128, 0.1)' 
                            : 'rgba(255, 165, 0, 0.1)',
                          border: `1px solid ${selectedOrder.payment.status === 'paid' 
                            ? 'rgba(74, 222, 128, 0.3)' 
                            : 'rgba(255, 165, 0, 0.3)'}`,
                          color: selectedOrder.payment.status === 'paid' ? '#4ade80' : '#ffa500',
                          fontSize: '10px'
                        }}>
                          {selectedOrder.payment.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '300', marginTop: '12px' }}>
                        Total: ${selectedOrder.payment.total}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div style={{
                  marginTop: '24px',
                  padding: '20px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    marginBottom: '16px',
                    opacity: 0.7
                  }}>
                    ORDER NOTES
                  </h3>
                  <textarea
                    placeholder="Add notes about this order..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid #d1d5db',
                      color: '#000',
                      fontSize: '12px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{
                  marginTop: '24px',
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    style={{
                      padding: '12px 24px',
                      background: 'transparent',
                      border: '1px solid #d1d5db',
                      color: '#000',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      cursor: 'pointer'
                    }}
                  >
                    PRINT INVOICE
                  </button>
                  <button
                    style={{
                      padding: '12px 24px',
                      background: 'transparent',
                      border: '1px solid #d1d5db',
                      color: '#000',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      cursor: 'pointer'
                    }}
                  >
                    EMAIL CUSTOMER
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    style={{
                      padding: '12px 24px',
                      background: '#fff',
                      border: 'none',
                      color: '#000',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      cursor: 'pointer'
                    }}
                  >
                    SAVE & CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrderManagement