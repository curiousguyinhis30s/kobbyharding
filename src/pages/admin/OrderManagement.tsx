import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Package, Clock, CheckCircle, XCircle, Truck, Search, Eye, Download,
  AlertCircle, Calendar, User, MapPin, DollarSign, MessageSquare,
  ChevronDown, ChevronRight, RefreshCw, Send, Printer, History
} from 'lucide-react'
import { useOrderStore } from '../../stores/useOrderStore'
import type { Order, OrderStatus } from '../../stores/useOrderStore'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/Toast'

const OrderManagement = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { orders, updateOrderStatus, addTrackingUpdate } = useOrderStore()
  const { addToast } = useToast()

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showTimeline, setShowTimeline] = useState(false)
  const [trackingInput, setTrackingInput] = useState('')
  const [locationInput, setLocationInput] = useState('')
  const [messageInput, setMessageInput] = useState('')

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated || user?.email !== 'admin@kobysthreads.com') {
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    pending: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' },
    processing: { bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.3)', text: '#60a5fa' },
    shipped: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', text: '#a855f7' },
    delivered: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' }
  }

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock style={{ width: '14px', height: '14px' }} />,
    processing: <RefreshCw style={{ width: '14px', height: '14px' }} />,
    shipped: <Truck style={{ width: '14px', height: '14px' }} />,
    delivered: <CheckCircle style={{ width: '14px', height: '14px' }} />
  }

  const orderStatuses = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { value: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
  ]

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  }).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, locationInput || 'Processing Center', messageInput || undefined)
    addToast('success', `Order status updated to ${newStatus}`)
    setLocationInput('')
    setMessageInput('')

    // Update selected order after store updates
    setTimeout(() => {
      const updated = useOrderStore.getState().getOrder(orderId)
      if (updated) {
        setSelectedOrder(updated)
      }
    }, 0)
  }

  const handleAddTracking = (orderId: string) => {
    if (!messageInput.trim()) {
      addToast('error', 'Please enter a tracking update message')
      return
    }

    addTrackingUpdate(orderId, {
      status: selectedOrder?.status || 'processing',
      location: locationInput || 'In Transit',
      message: messageInput
    })

    addToast('success', 'Tracking update added')
    setLocationInput('')
    setMessageInput('')

    // Refresh selected order to show new tracking update
    setTimeout(() => {
      const updated = useOrderStore.getState().getOrder(orderId)
      if (updated) {
        setSelectedOrder(updated)
      }
    }, 0)
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: '64px',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '300',
              letterSpacing: '0.2em',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Package style={{ width: '24px', height: '24px' }} />
              ORDER MANAGEMENT
            </h1>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => addToast('info', 'Export functionality coming soon')}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Download style={{ width: '14px', height: '14px' }} />
                EXPORT
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'flex', gap: '24px', fontSize: '13px', opacity: 0.7 }}>
            <span>Total Orders: {orders.length}</span>
            <span>Revenue: ${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</span>
            <span>Pending: {orders.filter(o => o.status === 'pending').length}</span>
            <span>In Transit: {orders.filter(o => o.status === 'shipped').length}</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '20px 24px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {orderStatuses.map(status => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                style={{
                  padding: '8px 16px',
                  background: filterStatus === status.value ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: `1px solid ${filterStatus === status.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: filterStatus === status.value ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
              >
                {status.label}
                <span style={{
                  padding: '2px 8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  fontSize: '10px'
                }}>
                  {status.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '300px' }}>
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
              placeholder="Search by order #, name, email..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '12px',
                borderRadius: '6px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            opacity: 0.5
          }}>
            <Package style={{ width: '64px', height: '64px', margin: '0 auto 24px', opacity: 0.3 }} />
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>No orders found</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>
              {searchQuery ? 'Try adjusting your search' : 'Orders will appear here when customers place them'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredOrders.map((order) => {
              const statusStyle = statusColors[order.status]

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedOrder(order)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr 200px 120px 120px 80px',
                    gap: '20px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  whileHover={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.15)'
                  }}
                >
                  {/* Order Number */}
                  <div>
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '4px'
                    }}>
                      {order.orderNumber}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.5 }}>
                      {formatDate(order.orderDate)}
                    </div>
                  </div>

                  {/* Customer */}
                  <div>
                    <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                      {order.customerName}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.5 }}>
                      {order.customerEmail}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    <span style={{ opacity: 0.5 }}> • </span>
                    {order.items.slice(0, 2).map(i => i.pieceName).join(', ')}
                    {order.items.length > 2 && ` +${order.items.length - 2}`}
                  </div>

                  {/* Total */}
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '400'
                  }}>
                    ${order.total.toLocaleString()}
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    padding: '6px 12px',
                    background: statusStyle.bg,
                    border: `1px solid ${statusStyle.border}`,
                    color: statusStyle.text,
                    borderRadius: '20px',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textTransform: 'uppercase',
                    justifyContent: 'center'
                  }}>
                    {statusIcons[order.status]}
                    {order.status}
                  </div>

                  {/* View Button */}
                  <div style={{ textAlign: 'right' }}>
                    <ChevronRight style={{ width: '20px', height: '20px', opacity: 0.3 }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

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
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(10px)',
                zIndex: 100
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '100%',
                maxWidth: '700px',
                height: '100vh',
                background: '#0a0a0a',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 101,
                overflow: 'auto'
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'sticky',
                top: 0,
                background: '#0a0a0a',
                zIndex: 10
              }}>
                <div>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '300',
                    letterSpacing: '0.15em',
                    marginBottom: '8px'
                  }}>
                    ORDER DETAILS
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    opacity: 0.6
                  }}>
                    {selectedOrder.orderNumber}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <XCircle style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              {/* Modal Content */}
              <div style={{ padding: '24px' }}>
                {/* Current Status Banner */}
                <div style={{
                  padding: '20px',
                  background: statusColors[selectedOrder.status].bg,
                  border: `1px solid ${statusColors[selectedOrder.status].border}`,
                  borderRadius: '12px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: statusColors[selectedOrder.status].text
                  }}>
                    {statusIcons[selectedOrder.status]}
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div style={{ fontSize: '13px', opacity: 0.8, fontFamily: 'monospace' }}>
                      Tracking: {selectedOrder.trackingNumber}
                    </div>
                  )}
                </div>

                {/* Status Update Buttons */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    opacity: 0.5,
                    marginBottom: '16px'
                  }}>
                    UPDATE STATUS
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(['pending', 'processing', 'shipped', 'delivered'] as OrderStatus[]).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                        disabled={selectedOrder.status === status}
                        style={{
                          padding: '10px 20px',
                          background: selectedOrder.status === status
                            ? statusColors[status].bg
                            : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${selectedOrder.status === status
                            ? statusColors[status].border
                            : 'rgba(255, 255, 255, 0.1)'}`,
                          color: selectedOrder.status === status
                            ? statusColors[status].text
                            : 'rgba(255, 255, 255, 0.6)',
                          fontSize: '11px',
                          letterSpacing: '0.1em',
                          cursor: selectedOrder.status === status ? 'default' : 'pointer',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.3s'
                        }}
                      >
                        {statusIcons[status]}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  {/* Customer */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      <User style={{ width: '14px', height: '14px', opacity: 0.5 }} />
                      <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', opacity: 0.5 }}>
                        CUSTOMER
                      </h3>
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                      {selectedOrder.customerName}
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.6 }}>
                      {selectedOrder.customerEmail}
                    </div>
                  </div>

                  {/* Shipping */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      <MapPin style={{ width: '14px', height: '14px', opacity: 0.5 }} />
                      <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', opacity: 0.5 }}>
                        SHIPPING TO
                      </h3>
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                      <div>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</div>
                      <div style={{ opacity: 0.7 }}>{selectedOrder.shippingAddress.address}</div>
                      <div style={{ opacity: 0.7 }}>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country} {selectedOrder.shippingAddress.postalCode}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <Package style={{ width: '14px', height: '14px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', opacity: 0.5 }}>
                      ORDER ITEMS ({selectedOrder.items.length})
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          gap: '16px',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: '8px',
                          alignItems: 'center'
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.pieceName}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                            {item.pieceName}
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.6 }}>
                            Size: {item.size} • Qty: {item.quantity}
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                          ${item.price}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', opacity: 0.6 }}>
                      <span>Subtotal</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#22c55e' }}>
                        <span>Discount</span>
                        <span>-${selectedOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', opacity: 0.6 }}>
                      <span>Shipping</span>
                      <span>${selectedOrder.shipping.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px', opacity: 0.6 }}>
                      <span>Tax</span>
                      <span>${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '500' }}>
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <button
                    onClick={() => setShowTimeline(!showTimeline)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <History style={{ width: '14px', height: '14px', opacity: 0.5 }} />
                      <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', opacity: 0.5 }}>
                        TRACKING HISTORY ({selectedOrder.trackingUpdates.length})
                      </h3>
                    </div>
                    <ChevronDown
                      style={{
                        width: '16px',
                        height: '16px',
                        opacity: 0.5,
                        transform: showTimeline ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s'
                      }}
                    />
                  </button>

                  <AnimatePresence>
                    {showTimeline && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ marginTop: '20px' }}>
                          {selectedOrder.trackingUpdates
                            .slice()
                            .reverse()
                            .map((update, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex',
                                  gap: '16px',
                                  paddingBottom: idx < selectedOrder.trackingUpdates.length - 1 ? '16px' : 0,
                                  marginBottom: idx < selectedOrder.trackingUpdates.length - 1 ? '16px' : 0,
                                  borderBottom: idx < selectedOrder.trackingUpdates.length - 1
                                    ? '1px solid rgba(255, 255, 255, 0.05)'
                                    : 'none'
                                }}
                              >
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: statusColors[update.status].bg,
                                  border: `1px solid ${statusColors[update.status].border}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: statusColors[update.status].text,
                                  flexShrink: 0
                                }}>
                                  {statusIcons[update.status]}
                                </div>
                                <div>
                                  <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                                    {update.message}
                                  </div>
                                  <div style={{ fontSize: '11px', opacity: 0.5 }}>
                                    {update.location} • {formatDate(update.timestamp)}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Add Tracking Update */}
                        <div style={{
                          marginTop: '20px',
                          paddingTop: '20px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', opacity: 0.5, marginBottom: '12px' }}>
                            ADD UPDATE
                          </h4>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                              type="text"
                              value={locationInput}
                              onChange={(e) => setLocationInput(e.target.value)}
                              placeholder="Location..."
                              style={{
                                flex: 1,
                                padding: '10px 12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#fff',
                                fontSize: '12px',
                                borderRadius: '6px',
                                outline: 'none'
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="text"
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              placeholder="Update message..."
                              style={{
                                flex: 1,
                                padding: '10px 12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#fff',
                                fontSize: '12px',
                                borderRadius: '6px',
                                outline: 'none'
                              }}
                            />
                            <button
                              onClick={() => handleAddTracking(selectedOrder.id)}
                              style={{
                                padding: '10px 16px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#fff',
                                fontSize: '11px',
                                letterSpacing: '0.1em',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <Send style={{ width: '12px', height: '12px' }} />
                              ADD
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => addToast('info', 'Print invoice coming soon')}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Printer style={{ width: '14px', height: '14px' }} />
                    PRINT INVOICE
                  </button>
                  <button
                    onClick={() => addToast('info', 'Email customer coming soon')}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <MessageSquare style={{ width: '14px', height: '14px' }} />
                    EMAIL CUSTOMER
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
