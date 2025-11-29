import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Lock, CreditCard, Truck, Shield, User, UserX, Loader2
} from 'lucide-react'
import useStore from '../stores/useStore'
import usePromoStore from '../stores/usePromoStore'
import useNotificationStore from '../stores/useNotificationStore'
import { useOrderStore } from '../stores/useOrderStore'
import { calculateTax } from '../utils/taxCalculator'
import Breadcrumb from '../components/Breadcrumb'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, pieces, getCartTotal, clearCart } = useStore()
  const { appliedPromo, calculateDiscount } = usePromoStore()
  const { addNotification } = useNotificationStore()
  const { createOrder } = useOrderStore()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768)
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 360)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 1024)
      setIsSmallScreen(width < 768)
      setIsSmallMobile(width < 360)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [isGuest, setIsGuest] = useState(true)
  const [formData, setFormData] = useState({
    // Contact
    email: '',
    password: '',
    // Shipping
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    billingAddressSame: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const cartPieces = cartItems
    .map(item => ({
      ...item,
      piece: pieces.find(p => p.id === item.pieceId)
    }))
    .filter(item => item.piece != null)

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia',
    'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
    'Belgium', 'Austria', 'Portugal', 'Sweden', 'Denmark',
    'Japan', 'South Korea', 'Singapore', 'Thailand', 'Switzerland',
    'Norway', 'New Zealand'
  ]

  // Calculate totals with promo and tax
  const subtotal = getCartTotal()
  const discount = calculateDiscount(subtotal)
  const subtotalAfterDiscount = subtotal - discount
  const taxInfo = calculateTax(subtotalAfterDiscount, formData.country || 'United States')
  const total = subtotalAfterDiscount + taxInfo.taxAmount

  // Luhn algorithm for credit card validation
  const validateLuhn = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, '')
    if (digits.length < 13 || digits.length > 19) return false

    let sum = 0
    let isEven = false

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10)

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  // Validate expiry date
  const validateExpiryDate = (expiryDate: string): boolean => {
    const parts = expiryDate.split('/')
    if (parts.length !== 2) return false

    const month = parseInt(parts[0], 10)
    const year = parseInt(parts[1], 10)

    if (isNaN(month) || isNaN(year)) return false
    if (month < 1 || month > 12) return false

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (year < currentYear) return false
    if (year === currentYear && month < currentMonth) return false

    return true
  }

  // Validate postal code (basic validation)
  const validatePostalCode = (postalCode: string, country: string): boolean => {
    if (!postalCode || postalCode.trim().length === 0) return false

    // Basic validation - just check it has some content
    // In production, you'd want country-specific validation
    const trimmed = postalCode.trim()
    return trimmed.length >= 3 && trimmed.length <= 10
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Only validate password if creating account
    if (!isGuest && (!formData.password || formData.password.length < 8)) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    // Shipping validation
    if (!formData.firstName || !formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName || !formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.address || !formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!formData.city || !formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.country) {
      newErrors.country = 'Please select a country'
    }

    // Postal code validation
    if (!validatePostalCode(formData.postalCode, formData.country)) {
      newErrors.postalCode = 'Please enter a valid postal code'
    }

    // Card number validation with Luhn algorithm
    if (!formData.cardNumber || formData.cardNumber.trim().length === 0) {
      newErrors.cardNumber = 'Card number is required'
    } else if (formData.cardNumber.replace(/\D/g, '').length < 13) {
      newErrors.cardNumber = 'Card number must be at least 13 digits'
    } else if (!validateLuhn(formData.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number'
    }

    // Expiry date validation
    if (!formData.expiryDate || !formData.expiryDate.includes('/')) {
      newErrors.expiryDate = 'Expiry date required (MM/YY)'
    } else if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = 'Card has expired or invalid date'
    }

    // CVC validation
    if (!formData.cvc || formData.cvc.trim().length === 0) {
      newErrors.cvc = 'CVC is required'
    } else if (formData.cvc.length < 3 || formData.cvc.length > 4) {
      newErrors.cvc = 'CVC must be 3 or 4 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // Create order with order store
      const orderItems = cartPieces.map(item => ({
        pieceId: item.pieceId,
        pieceName: item.piece!.name,
        size: item.size,
        quantity: item.quantity,
        price: item.piece!.price,
        imageUrl: item.piece!.imageUrl || item.piece!.image || ''
      }))

      const newOrder = createOrder({
        items: orderItems,
        subtotal,
        discount,
        tax: taxInfo.taxAmount,
        shipping: 0, // Free shipping for now
        total,
        status: 'pending',
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode
        }
      })

      // Also save to admin orders for backwards compatibility
      const adminOrder = {
        id: newOrder.orderNumber,
        items: cartItems,
        subtotal,
        discount,
        tax: taxInfo.taxAmount,
        total,
        customerInfo: formData,
        promoCode: appliedPromo?.code || null,
        status: 'processing',
        createdAt: new Date().toISOString()
      }

      const existingOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]')
      localStorage.setItem('admin_orders', JSON.stringify([adminOrder, ...existingOrders]))

      // Send order confirmation email
      addNotification({
        type: 'order_confirmation',
        recipient: formData.email,
        subject: `Order Confirmation - ${newOrder.orderNumber}`,
        body: `Hi ${formData.firstName},\n\nThank you for your order! We've received your order and it's being processed.\n\nOrder Number: ${newOrder.orderNumber}\nSubtotal: $${subtotal.toFixed(2)}${discount > 0 ? `\nDiscount: -$${discount.toFixed(2)}` : ''}\nTax (${taxInfo.displayName}): $${taxInfo.taxAmount.toFixed(2)}\nTotal: $${total.toFixed(2)}\n\nShipping to:\n${formData.firstName} ${formData.lastName}\n${formData.address}\n${formData.city}, ${formData.postalCode}\n${formData.country}\n\nYou'll receive a shipping confirmation once your order ships.\n\nTrack your order: /track-order\n\nBest regards,\nKhardingclassics Team`
      })

      clearCart()
      navigate(`/thank-you?orderId=${newOrder.id}`)
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    background: '#000000',
    color: '#ffffff',
    paddingTop: '64px'
  }

  const headerStyle = {
    borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
    background: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(8px)'
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.3s'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0.08em',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase' as const
  }

  const sectionStyle = {
    marginBottom: '24px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0'
  }

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '0',
    fontSize: '14px',
    fontWeight: '300',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s'
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <button
              onClick={() => navigate('/cart')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.6)',
                background: 'none',
                border: 'none',
                fontSize: '13px',
                fontWeight: '300',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.transform = 'translateX(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              BACK TO BAG
            </button>

            <h1 style={{
              fontSize: '24px',
              fontWeight: '200',
              letterSpacing: '0.3em',
              color: '#ffffff'
            }}>
              CHECKOUT
            </h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#ffffff'
            }}>
              <Lock style={{ width: '16px', height: '16px' }} />
              SECURE
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Breadcrumb
          items={[
            { label: 'HOME', path: '/' },
            { label: 'CART', path: '/cart' },
            { label: 'CHECKOUT' }
          ]}
        />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isSmallMobile ? '16px 12px' : isSmallScreen ? '24px 16px' : '32px 24px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 360px',
            gap: isSmallMobile ? '20px' : '32px'
          }}>
            {/* Left Column - Form */}
            <div>
              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={sectionStyle}
              >
                <h2 style={{
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.2em',
                  marginBottom: '20px',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  CONTACT
                </h2>
                
                {/* Guest Checkout Toggle */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '24px',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.02)',
                  borderRadius: '8px'
                }}>
                  <button
                    type="button"
                    onClick={() => setIsGuest(true)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: isGuest ? '#000000' : 'transparent',
                      color: isGuest ? 'white' : '#666666',
                      border: `1px solid ${isGuest ? '#000000' : '#e0e0e0'}`,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '300',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <UserX size={16} />
                    GUEST CHECKOUT
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsGuest(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: !isGuest ? '#000000' : 'transparent',
                      color: !isGuest ? 'white' : '#666666',
                      border: `1px solid ${!isGuest ? '#000000' : '#e0e0e0'}`,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '300',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <User size={16} />
                    CREATE ACCOUNT
                  </button>
                </div>
                
                {isGuest ? (
                  <div>
                    <p style={{
                      fontSize: '13px',
                      color: '#666666',
                      marginBottom: '16px',
                      fontStyle: 'italic'
                    }}>
                      Continue as guest - no account required
                    </p>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors.email ? '#000000' : '#e0e0e0'
                      }}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                        {errors.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p style={{
                      fontSize: '13px',
                      color: '#666666',
                      marginBottom: '16px',
                      fontStyle: 'italic'
                    }}>
                      Create an account to track orders and save favorites
                    </p>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        style={{
                          ...inputStyle,
                          borderColor: errors.email ? '#000000' : '#e0e0e0'
                        }}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        style={{
                          ...inputStyle,
                          borderColor: errors.password ? '#000000' : '#e0e0e0'
                        }}
                        placeholder="Create a password"
                      />
                      {errors.password && (
                        <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                          {errors.password}
                        </p>
                      )}
                      <p style={{
                        fontSize: '11px',
                        color: '#666666',
                        marginTop: '4px'
                      }}>
                        Minimum 8 characters
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Shipping Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={sectionStyle}
              >
                <h2 style={{
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.2em',
                  marginBottom: '20px',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  SHIPPING
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors.firstName ? '#000000' : '#e0e0e0'
                      }}
                    />
                    {errors.firstName && (
                      <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors.lastName ? '#000000' : '#e0e0e0'
                      }}
                    />
                    {errors.lastName && (
                      <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.address ? '#000000' : '#e0e0e0'
                    }}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                      {errors.address}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.city ? '#000000' : '#e0e0e0'
                    }}
                  />
                  {errors.city && (
                    <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                      {errors.city}
                    </p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors.country ? '#000000' : '#e0e0e0',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country} style={{ background: '#ffffff' }}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                        {errors.country}
                      </p>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Postal Code</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors.postalCode ? '#000000' : '#e0e0e0'
                      }}
                    />
                    {errors.postalCode && (
                      <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Payment Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={sectionStyle}
              >
                <h2 style={{
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.2em',
                  marginBottom: '20px',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  PAYMENT
                </h2>

                {/* Payment Simulation Warning */}
                <div style={{
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#3b82f6'
                }}>
                  <p style={{ margin: '0' }}>
                    Stripe integration pending. Payment processing is currently simulated for testing purposes.
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={14} />
                    Credit or Debit Card
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '')
                      if (value.length <= 16 && /^\d*$/.test(value)) {
                        handleInputChange('cardNumber', value)
                      }
                    }}
                    style={{
                      ...inputStyle,
                      borderColor: errors.cardNumber ? '#000000' : '#e0e0e0'
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                  />
                  {errors.cardNumber && (
                    <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>MM/YY</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '')
                        if (value.length >= 3) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4)
                        }
                        if (value.length <= 5) {
                          handleInputChange('expiryDate', value)
                        }
                      }}
                      style={{
                        ...inputStyle,
                        borderColor: errors.expiryDate ? '#000000' : '#e0e0e0'
                      }}
                      placeholder="12/25"
                      maxLength={5}
                    />
                    {errors.expiryDate && (
                      <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>CVC</label>
                    <input
                      type="text"
                      value={formData.cvc}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value.length <= 4) {
                          handleInputChange('cvc', value)
                        }
                      }}
                      style={{
                        ...inputStyle,
                        borderColor: errors.cvc ? '#000000' : '#e0e0e0'
                      }}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvc && (
                      <p style={{ color: '#000000', fontSize: '12px', marginTop: '4px' }}>
                        {errors.cvc}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  ...sectionStyle,
                  position: 'sticky',
                  top: '88px'
                }}
              >
                <h2 style={{
                  fontSize: '11px',
                  fontWeight: '300',
                  letterSpacing: '0.2em',
                  marginBottom: '20px',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  ORDER SUMMARY
                </h2>

                {/* Cart Items */}
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                  {cartPieces.map(({ piece, size, quantity }) => (
                    piece && (
                      <div key={`${piece.id}-${size}`} style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '16px',
                        paddingBottom: '16px',
                        borderBottom: `1px solid ${'#e0e0e0'}`
                      }}>
                        <img
                          src={piece?.imageUrl || '/placeholder.jpg'}
                          alt={piece?.name || 'Product'}
                          style={{
                            width: '60px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: '500', color: '#000000' }}>
                            {piece?.name || 'Unknown Product'}
                          </p>
                          <p style={{ fontSize: '12px', color: '#666666' }}>
                            Size: {size} | Qty: {quantity}
                          </p>
                          <p style={{ fontSize: '14px', color: '#000000', marginTop: '4px' }}>
                            ${(piece?.price || 0) * quantity}
                          </p>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Totals */}
                <div style={{ paddingTop: '20px', borderTop: `1px solid ${'#e0e0e0'}` }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#666666' }}>Subtotal</span>
                    <span style={{ color: '#000000' }}>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      fontSize: '14px'
                    }}>
                      <span style={{ color: '#10b981' }}>Discount ({appliedPromo?.code})</span>
                      <span style={{ color: '#10b981' }}>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#666666' }}>Shipping</span>
                    <span style={{ color: '#000000' }}>FREE</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#666666' }}>
                      {taxInfo.displayName}
                      {taxInfo.taxRate > 0 && ` (${(taxInfo.taxRate * 100).toFixed(1)}%)`}
                    </span>
                    <span style={{ color: '#000000' }}>${taxInfo.taxAmount.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: `1px solid ${'#e0e0e0'}`,
                    fontSize: '18px',
                    fontWeight: '300'
                  }}>
                    <span style={{ color: '#000000' }}>Total</span>
                    <span style={{ color: '#000000' }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0}
                  style={{
                    ...buttonStyle,
                    marginTop: '24px',
                    opacity: isProcessing || cartItems.length === 0 ? 0.5 : 1,
                    cursor: isProcessing || cartItems.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isProcessing && cartItems.length > 0) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(249, 115, 22, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      COMPLETE ORDER
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${'#e0e0e0'}` }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#666666'
                  }}>
                    <Shield size={14} />
                    256-bit SSL Encryption
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#666666'
                  }}>
                    <Truck size={14} />
                    Free Worldwide Shipping
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default Checkout