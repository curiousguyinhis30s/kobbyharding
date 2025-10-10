import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Lock, CreditCard, Truck, Shield, User, UserX
} from 'lucide-react'
import useStore from '../stores/useStore'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, pieces, getCartTotal, clearCart } = useStore()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
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

  const cartPieces = cartItems.map(item => ({
    ...item,
    piece: pieces.find(p => p.id === item.pieceId)
  })).filter(item => item.piece)

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 
    'Germany', 'France', 'Japan', 'South Korea'
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email required'
    }
    
    // Only validate password if creating account
    if (!isGuest && (!formData.password || formData.password.length < 8)) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.firstName) newErrors.firstName = 'First name required'
    if (!formData.lastName) newErrors.lastName = 'Last name required'
    if (!formData.address) newErrors.address = 'Address required'
    if (!formData.city) newErrors.city = 'City required'
    if (!formData.country) newErrors.country = 'Country required'
    if (!formData.postalCode) newErrors.postalCode = 'Postal code required'
    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = 'Valid card number required'
    }
    if (!formData.expiryDate || !formData.expiryDate.includes('/')) {
      newErrors.expiryDate = 'MM/YY format required'
    }
    if (!formData.cvc || formData.cvc.length < 3) {
      newErrors.cvc = 'CVC required'
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
      // Save order to localStorage
      const order = {
        id: Date.now().toString(),
        items: cartItems,
        total: getCartTotal(),
        customerInfo: formData,
        status: 'processing',
        createdAt: new Date().toISOString()
      }
      
      const existingOrders = JSON.parse(localStorage.getItem('admin_orders') || '[]')
      localStorage.setItem('admin_orders', JSON.stringify([order, ...existingOrders]))
      
      clearCart()
      navigate('/thank-you')
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
    border: 'none',
    borderRadius: '8px'
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 400px',
            gap: '32px'
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
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.2em',
                  marginBottom: '20px',
                  color: '#000000'
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
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.2em',
                  marginBottom: '20px',
                  color: '#000000'
                }}>
                  SHIPPING
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
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
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.2em',
                  marginBottom: '20px',
                  color: '#000000'
                }}>
                  PAYMENT
                </h2>

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
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.2em',
                  marginBottom: '20px',
                  color: '#000000'
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
                          src={piece.imageUrl} 
                          alt={piece.name}
                          style={{
                            width: '60px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: '500', color: '#000000' }}>
                            {piece.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#666666' }}>
                            Size: {size} | Qty: {quantity}
                          </p>
                          <p style={{ fontSize: '14px', color: '#000000', marginTop: '4px' }}>
                            ${piece.price * quantity}
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
                    <span style={{ color: '#000000' }}>${getCartTotal()}</span>
                  </div>
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
                    <span style={{ color: '#666666' }}>Tax</span>
                    <span style={{ color: '#000000' }}>${(getCartTotal() * 0.08).toFixed(2)}</span>
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
                      ${(getCartTotal() * 1.08).toFixed(2)}
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
                    <>Processing...</>
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
    </div>
  )
}

export default Checkout