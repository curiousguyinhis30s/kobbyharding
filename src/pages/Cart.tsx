import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, X, Plus, Minus, ShoppingBag, Truck, Shield, Package, Tag, Gift } from 'lucide-react'
import useStore from '../stores/useStore'
import usePromoStore from '../stores/usePromoStore'
import { useGiftCardStore } from '../stores/useGiftCardStore'
import { useToast } from '../components/Toast'
import Breadcrumb from '../components/Breadcrumb'
import RecentlyViewed from '../components/RecentlyViewed'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, pieces, updateQuantity, removeFromCart, getCartTotal } = useStore()
  const { appliedPromo, validateCode, applyCode, removePromo, calculateDiscount } = usePromoStore()
  const { appliedGiftCard, applyGiftCard, removeAppliedGiftCard } = useGiftCardStore()
  const { addToast } = useToast()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024)
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 360)
  const [promoInput, setPromoInput] = useState('')
  const [giftCardInput, setGiftCardInput] = useState('')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 768)
      setIsTablet(width > 768 && width <= 1024)
      setIsSmallMobile(width < 360)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const cartPieces = cartItems.map(item => ({
    ...item,
    piece: pieces.find(p => p.id === item.pieceId)
  })).filter(item => item.piece)

  // Free shipping calculation
  const freeShippingThreshold = 200
  const subtotal = getCartTotal()
  const discount = calculateDiscount(subtotal)
  const giftCardDiscount = appliedGiftCard ? Math.min(appliedGiftCard.balance, subtotal - discount) : 0
  const currentTotal = Math.max(0, subtotal - discount - giftCardDiscount)
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discount))
  const shippingProgress = Math.min(100, ((subtotal - discount) / freeShippingThreshold) * 100)

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      addToast('error', 'Please enter a promo code')
      return
    }

    const validation = validateCode(promoInput, subtotal)
    if (validation.valid && validation.promo) {
      applyCode(promoInput)
      addToast('success', validation.message)
      setPromoInput('')
    } else {
      addToast('error', validation.message)
    }
  }

  const handleRemovePromo = () => {
    removePromo()
    addToast('success', 'Promo code removed')
  }

  const handleApplyGiftCard = () => {
    if (!giftCardInput.trim()) {
      addToast('error', 'Please enter a gift card code')
      return
    }

    const result = applyGiftCard(giftCardInput.toUpperCase())
    if (result.success) {
      addToast('success', result.message)
      setGiftCardInput('')
    } else {
      addToast('error', result.message)
    }
  }

  const handleRemoveGiftCard = () => {
    removeAppliedGiftCard()
    addToast('success', 'Gift card removed')
  }

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    background: '#000000',
    color: '#ffffff'
  }

  const headerStyle = {
    borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
    background: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(8px)'
  }

  const itemCardStyle = {
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '16px',
    borderRadius: '0',
    transition: 'all 0.3s',
    marginBottom: isMobile ? '12px' : '16px'
  }

  const summaryCardStyle = {
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '20px',
    borderRadius: '0',
    position: isMobile ? 'relative' as const : 'sticky' as const,
    top: isMobile ? '0' : '88px'
  }

  const quantityButtonStyle = {
    minWidth: '44px',
    minHeight: '44px',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid rgba(255, 255, 255, 0.2)`,
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    borderRadius: '0',
    transition: 'all 0.3s'
  }

  const checkoutButtonStyle = {
    width: '100%',
    padding: '12px',
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '300',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    borderRadius: '0',
    transition: 'all 0.3s'
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <button
              onClick={() => navigate('/collection')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.6)',
                background: 'none',
                border: 'none',
                fontSize: isMobile ? '11px' : '13px',
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
              {!isMobile && 'CONTINUE SHOPPING'}
            </button>

            <h1 style={{
              fontSize: isMobile ? '16px' : '24px',
              fontWeight: '200',
              letterSpacing: isMobile ? '0.2em' : '0.3em',
              color: '#ffffff'
            }}>
              YOUR BAG
            </h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: isMobile ? '11px' : '13px',
              color: '#ffffff',
              fontWeight: '300'
            }}>
              <ShoppingBag style={{ width: '16px', height: '16px' }} />
              {cartItems.length}
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      {!isMobile && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Breadcrumb
            items={[
              { label: 'HOME', path: '/' },
              { label: 'CART' }
            ]}
          />
        </div>
      )}

      {/* Free Shipping Progress Bar */}
      {cartItems.length > 0 && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.02)',
          borderBottom: `1px solid ${'rgba(255, 255, 255, 0.1)'}`,
          padding: isMobile ? '12px 0' : '16px 0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '8px' : '0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: isMobile ? '11px' : '13px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                <Package style={{ width: '16px', height: '16px' }} />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong style={{ color: '#ffffff' }}>${remainingForFreeShipping}</strong> more for FREE shipping
                  </span>
                ) : (
                  <span style={{ color: '#ffffff', fontWeight: '500' }}>
                    ✨ You've unlocked FREE shipping!
                  </span>
                )}
              </div>
              <span style={{
                fontSize: isMobile ? '10px' : '12px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                ${currentTotal} / ${freeShippingThreshold}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '4px',
              background: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative' as const
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${shippingProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: remainingForFreeShipping === 0 
                    ? 'linear-gradient(to right, #10b981, #059669)'
                    : 'linear-gradient(to right, #f97316, #ea580c)',
                  borderRadius: '2px'
                }}
              />
              {remainingForFreeShipping === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    transform: 'translateX(-100%)',
                    animation: 'shimmer 2s infinite'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 24px' }}>
        {cartItems.length === 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: isMobile ? '40px 20px' : '80px 20px' }}
            >
              <ShoppingBag style={{ width: isMobile ? '48px' : '64px', height: isMobile ? '48px' : '64px', margin: '0 auto 24px', color: 'rgba(255, 255, 255, 0.6)' }} />
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '32px', fontSize: isMobile ? '14px' : '18px', fontWeight: '300' }}>
                Your bag is currently empty
              </p>
              <button
                onClick={() => navigate('/collection')}
                style={{
                  padding: isMobile ? '12px 24px' : '14px 32px',
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  fontSize: isMobile ? '11px' : '13px',
                  fontWeight: '300',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(249, 115, 22, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                BROWSE COLLECTION
              </button>
            </motion.div>

            {/* Show Recently Viewed when cart is empty */}
            <RecentlyViewed isMobile={isMobile} maxItems={6} showClearButton={false} />
          </>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 320px' : '1fr 380px',
            gap: isSmallMobile ? '16px' : isMobile ? '24px' : '32px'
          }}>
            {/* Cart Items */}
            <div>
              <h2 style={{
                fontSize: '11px',
                fontWeight: '300',
                letterSpacing: '0.2em',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '20px',
                textTransform: 'uppercase'
              }}>
                ITEMS ({cartItems.length})
              </h2>
              
              {cartPieces.map(({ piece, size, quantity, pieceId }, index) => (
                piece && (
                  <motion.div 
                    key={`${pieceId}-${size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={itemCardStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ffffff'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px', flexDirection: isMobile ? 'column' : 'row' }}>
                      <img
                        src={piece.imageUrl}
                        alt={piece.name}
                        loading="lazy"
                        style={{
                          width: isMobile ? '100%' : '100px',
                          height: isMobile ? 'auto' : '133px',
                          objectFit: 'cover',
                          borderRadius: '0'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <h3 style={{
                            fontSize: isMobile ? '14px' : '16px',
                            fontWeight: '300',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#ffffff'
                          }}>
                            {piece.name}
                          </h3>
                          <button
                            onClick={() => {
                              removeFromCart(pieceId, size)
                              addToast('success', 'Item removed from cart')
                            }}
                            style={{
                              padding: '4px',
                              color: 'rgba(255, 255, 255, 0.6)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                          >
                            <X style={{ width: '18px', height: '18px' }} />
                          </button>
                        </div>
                        
                        <p style={{ fontSize: isMobile ? '11px' : '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                          {piece.vibe}
                        </p>
                        <p style={{ fontSize: isMobile ? '11px' : '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '16px' }}>
                          Size: {size}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? '12px' : '0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              onClick={() => updateQuantity(pieceId, size, quantity - 1)}
                              style={quantityButtonStyle}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#ffffff'
                                e.currentTarget.style.color = '#ffffff'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
                              }}
                            >
                              <Minus style={{ width: '14px', height: '14px' }} />
                            </button>
                            <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '14px' }}>
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(pieceId, size, quantity + 1)}
                              style={quantityButtonStyle}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#ffffff'
                                e.currentTarget.style.color = '#ffffff'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
                              }}
                            >
                              <Plus style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                          
                          <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#ffffff', fontWeight: '300' }}>
                            ${piece.price * quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={summaryCardStyle}
              >
                <h2 style={{
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: '300',
                  letterSpacing: '0.2em',
                  color: '#ffffff',
                  marginBottom: isMobile ? '16px' : '24px',
                  textTransform: 'uppercase'
                }}>
                  Order Summary
                </h2>

                {/* Promo Code Input */}
                <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                  {!appliedPromo ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1, position: 'relative' as const }}>
                        <Tag style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '14px',
                          height: '14px',
                          color: 'rgba(255, 255, 255, 0.4)'
                        }} />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                          placeholder="PROMO CODE"
                          style={{
                            width: '100%',
                            padding: isMobile ? '10px 12px 10px 36px' : '12px 12px 12px 40px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '0',
                            color: '#ffffff',
                            fontSize: isMobile ? '11px' : '13px',
                            fontFamily: 'inherit',
                            letterSpacing: '0.1em',
                            outline: 'none',
                            transition: 'all 0.3s'
                          }}
                          onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
                          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                        />
                      </div>
                      <button
                        onClick={handleApplyPromo}
                        style={{
                          padding: isMobile ? '10px 16px' : '12px 20px',
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: '#ffffff',
                          fontSize: isMobile ? '10px' : '11px',
                          fontWeight: '300',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          borderRadius: '0',
                          transition: 'all 0.3s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#ffffff'
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        APPLY
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      padding: isMobile ? '10px 12px' : '12px 16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag style={{ width: '14px', height: '14px', color: '#10b981' }} />
                        <span style={{
                          fontSize: isMobile ? '11px' : '13px',
                          color: '#10b981',
                          fontWeight: '300',
                          letterSpacing: '0.1em'
                        }}>
                          {appliedPromo.code}
                        </span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        style={{
                          padding: '4px 8px',
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: isMobile ? '10px' : '11px',
                          cursor: 'pointer',
                          transition: 'color 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                      >
                        <X style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Gift Card Input */}
                <div style={{ marginBottom: isMobile ? '16px' : '20px' }}>
                  {!appliedGiftCard ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1, position: 'relative' as const }}>
                        <Gift style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '14px',
                          height: '14px',
                          color: 'rgba(255, 255, 255, 0.4)'
                        }} />
                        <input
                          type="text"
                          value={giftCardInput}
                          onChange={(e) => setGiftCardInput(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyGiftCard()}
                          placeholder="GIFT CARD CODE"
                          style={{
                            width: '100%',
                            padding: isMobile ? '10px 12px 10px 36px' : '12px 12px 12px 40px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '0',
                            color: '#ffffff',
                            fontSize: isMobile ? '11px' : '13px',
                            fontFamily: 'inherit',
                            letterSpacing: '0.1em',
                            outline: 'none',
                            transition: 'all 0.3s'
                          }}
                          onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
                          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                        />
                      </div>
                      <button
                        onClick={handleApplyGiftCard}
                        style={{
                          padding: isMobile ? '10px 16px' : '12px 20px',
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: '#ffffff',
                          fontSize: isMobile ? '10px' : '11px',
                          fontWeight: '300',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          borderRadius: '0',
                          transition: 'all 0.3s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#ffffff'
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        APPLY
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      padding: isMobile ? '10px 12px' : '12px 16px',
                      background: 'rgba(249, 115, 22, 0.1)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      borderRadius: '0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Gift style={{ width: '14px', height: '14px', color: '#f97316' }} />
                        <div>
                          <span style={{
                            fontSize: isMobile ? '11px' : '13px',
                            color: '#f97316',
                            fontWeight: '300',
                            letterSpacing: '0.1em',
                            display: 'block'
                          }}>
                            {appliedGiftCard.code}
                          </span>
                          <span style={{
                            fontSize: isMobile ? '9px' : '10px',
                            color: 'rgba(249, 115, 22, 0.7)',
                            letterSpacing: '0.05em'
                          }}>
                            Balance: ${appliedGiftCard.balance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveGiftCard}
                        style={{
                          padding: '4px 8px',
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: isMobile ? '10px' : '11px',
                          cursor: 'pointer',
                          transition: 'color 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                      >
                        <X style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ paddingBottom: isMobile ? '16px' : '20px', borderBottom: `1px solid ${'rgba(255, 255, 255, 0.1)'}` }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: isMobile ? '12px' : '14px'
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Subtotal</span>
                    <span style={{ color: '#ffffff' }}>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      fontSize: isMobile ? '12px' : '14px'
                    }}>
                      <span style={{ color: '#10b981' }}>Discount ({appliedPromo?.code})</span>
                      <span style={{ color: '#10b981' }}>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  {giftCardDiscount > 0 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      fontSize: isMobile ? '12px' : '14px'
                    }}>
                      <span style={{ color: '#f97316' }}>Gift Card ({appliedGiftCard?.code})</span>
                      <span style={{ color: '#f97316' }}>-${giftCardDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: isMobile ? '12px' : '14px'
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Shipping</span>
                    <span style={{ color: '#ffffff' }}>FREE</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: isMobile ? '12px' : '14px'
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Tax</span>
                    <span style={{ color: '#ffffff', fontSize: isMobile ? '10px' : '14px' }}>Calculated at checkout</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: isMobile ? '16px 0' : '20px 0',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '300'
                }}>
                  <span style={{ color: '#ffffff' }}>Total</span>
                  <span style={{ color: '#ffffff' }}>${currentTotal.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={() => navigate('/delivery')}
                  style={checkoutButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(249, 115, 22, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  PROCEED TO CHECKOUT
                </button>
                
                {/* Trust Badges */}
                <div style={{ marginTop: isMobile ? '16px' : '24px', paddingTop: isMobile ? '16px' : '24px', borderTop: `1px solid ${'rgba(255, 255, 255, 0.1)'}` }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    fontSize: isMobile ? '10px' : '12px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    <Shield style={{ width: '14px', height: '14px' }} />
                    Secure Checkout
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: isMobile ? '10px' : '12px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    <Truck style={{ width: '14px', height: '14px' }} />
                    Free Shipping Worldwide
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart