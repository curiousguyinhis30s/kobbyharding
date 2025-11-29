import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Truck, Package, MapPin, Clock, ChevronRight, ArrowLeft } from 'lucide-react'
import useStore from '../stores/useStore'

const DeliveryOptionsMinimal = () => {
  const navigate = useNavigate()
  const { getCartTotal } = useStore()
  const [selectedOption, setSelectedOption] = useState<'standard' | 'express' | 'festival'>('standard')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const subtotal = getCartTotal()
  const deliveryOptions = [
    { id: 'standard', name: 'Standard', price: subtotal > 200 ? 0 : 15, time: '5-7 days', icon: Truck, free: subtotal > 200 },
    { id: 'express', name: 'Express', price: 35, time: '2-3 days', icon: Package, free: false },
    { id: 'festival', name: 'Festival Pickup', price: 0, time: 'At venue', icon: MapPin, free: true }
  ]

  const selectedDelivery = deliveryOptions.find(opt => opt.id === selectedOption)
  const deliveryPrice = selectedDelivery?.price || 0
  const total = subtotal + deliveryPrice

  // Compact header breadcrumb
  const steps = ['Cart', 'Delivery', 'Payment', 'Done']
  const currentStep = 1

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      padding: isMobile ? '16px' : '24px 40px'
    }}>
      {/* Compact Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button
          onClick={() => navigate('/cart')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={14} />
          {!isMobile && 'Back'}
        </button>

        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {steps.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                fontSize: '10px',
                letterSpacing: '0.1em',
                opacity: i <= currentStep ? 1 : 0.3,
                fontWeight: i === currentStep ? '500' : '300'
              }}>
                {isMobile ? (i + 1) : step.toUpperCase()}
              </span>
              {i < steps.length - 1 && (
                <ChevronRight size={10} style={{ margin: '0 4px', opacity: 0.3 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ width: '50px' }} />
      </div>

      {/* Main Content - Horizontal Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 320px',
        gap: isMobile ? '20px' : '32px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Delivery Options */}
        <div>
          <h2 style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            marginBottom: '12px',
            opacity: 0.6
          }}>
            DELIVERY METHOD
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {deliveryOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id

              return (
                <motion.div
                  key={option.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedOption(option.id as typeof selectedOption)}
                  style={{
                    padding: '12px 16px',
                    border: `1px solid ${isSelected ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    background: isSelected ? 'rgba(255,255,255,0.03)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  {/* Radio */}
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: `1px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.3)'}`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }} />}
                  </div>

                  <Icon size={16} style={{ opacity: 0.5, flexShrink: 0 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', letterSpacing: '0.1em' }}>{option.name}</div>
                    <div style={{ fontSize: '10px', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Clock size={10} /> {option.time}
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', fontWeight: '300', flexShrink: 0 }}>
                    {option.free ? 'FREE' : `$${option.price}`}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Shipping Address - Compact */}
          {selectedOption !== 'festival' && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '12px', opacity: 0.6 }}>
                SHIPPING ADDRESS
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input type="text" placeholder="First name" style={inputStyle} />
                <input type="text" placeholder="Last name" style={inputStyle} />
                <input type="text" placeholder="Address" style={{ ...inputStyle, gridColumn: 'span 2' }} />
                <input type="text" placeholder="City" style={inputStyle} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input type="text" placeholder="State" style={inputStyle} />
                  <input type="text" placeholder="ZIP" style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* Festival Info - Compact */}
          {selectedOption === 'festival' && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '11px',
              opacity: 0.7,
              lineHeight: 1.5
            }}>
              📍 Bangkok Kizomba Festival • March 15-17<br />
              Meet Koby personally at the venue
            </div>
          )}
        </div>

        {/* Order Summary - Compact Sidebar */}
        <div style={{
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.01)',
          height: 'fit-content',
          position: isMobile ? 'relative' : 'sticky',
          top: isMobile ? 'auto' : '80px'
        }}>
          <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '16px', opacity: 0.6 }}>
            SUMMARY
          </h3>

          <div style={{ fontSize: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', opacity: 0.6 }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
              <span>Delivery</span>
              <span>{deliveryPrice === 0 ? 'Free' : `$${deliveryPrice}`}</span>
            </div>
          </div>

          <div style={{
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            <span>Total</span>
            <span style={{ fontWeight: '400' }}>${total.toFixed(2)}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              padding: '12px',
              background: '#fff',
              color: '#000',
              border: 'none',
              fontSize: '11px',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            CONTINUE
          </motion.button>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  fontSize: '12px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
}

export default DeliveryOptionsMinimal
