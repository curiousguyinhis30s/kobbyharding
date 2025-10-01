import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Truck, Package, MapPin, Clock, ChevronRight } from 'lucide-react'
import useStore from '../stores/useStore'

const DeliveryOptionsMinimal = () => {
  const navigate = useNavigate()
  const { getCartTotal } = useStore()
  const [selectedOption, setSelectedOption] = useState<'standard' | 'express' | 'festival'>('standard')
  
  const subtotal = getCartTotal()
  const deliveryOptions = [
    {
      id: 'standard',
      name: 'STANDARD DELIVERY',
      price: subtotal > 200 ? 0 : 15,
      time: '5-7 business days',
      description: 'Tracked delivery to your address',
      icon: Truck,
      free: subtotal > 200
    },
    {
      id: 'express',
      name: 'EXPRESS DELIVERY',
      price: 35,
      time: '2-3 business days',
      description: 'Priority tracked delivery',
      icon: Package,
      free: false
    },
    {
      id: 'festival',
      name: 'FESTIVAL PICKUP',
      price: 0,
      time: 'At festival venue',
      description: 'Collect from Koby at the festival',
      icon: MapPin,
      free: true,
      special: true
    }
  ]

  const selectedDelivery = deliveryOptions.find(opt => opt.id === selectedOption)
  const deliveryPrice = selectedDelivery?.price || 0
  const total = subtotal + deliveryPrice

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      paddingTop: '64px'
    }}>
      {/* Header */}
      <div style={{
        padding: '40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '100',
          letterSpacing: '0.4em',
          marginBottom: '16px'
        }}>
          DELIVERY OPTIONS
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '12px',
          opacity: 0.5,
          letterSpacing: '0.1em'
        }}>
          <span>CART</span>
          <ChevronRight style={{ width: '12px', height: '12px' }} />
          <span style={{ opacity: 1 }}>DELIVERY</span>
          <ChevronRight style={{ width: '12px', height: '12px' }} />
          <span>CHECKOUT</span>
          <ChevronRight style={{ width: '12px', height: '12px' }} />
          <span>CONFIRMATION</span>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 40px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '60px'
      }}>
        {/* Left: Delivery Options */}
        <div>
          <h2 style={{
            fontSize: '14px',
            letterSpacing: '0.2em',
            marginBottom: '32px',
            opacity: 0.8
          }}>
            SELECT DELIVERY METHOD
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {deliveryOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id
              
              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedOption(option.id as typeof selectedOption)}
                  style={{
                    padding: '24px',
                    border: `1px solid ${isSelected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    background: isSelected ? 'rgba(255,255,255,0.02)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    position: 'relative'
                  }}
                >
                  {option.special && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 12px',
                      background: 'rgba(255,255,255,0.1)',
                      fontSize: '10px',
                      letterSpacing: '0.15em'
                    }}>
                      RECOMMENDED
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
                    {/* Radio button */}
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: `1px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.3)'}`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                      transition: 'all 0.3s'
                    }}>
                      {isSelected && (
                        <div style={{
                          width: '10px',
                          height: '10px',
                          background: '#fff',
                          borderRadius: '50%'
                        }} />
                      )}
                    </div>
                    
                    {/* Icon */}
                    <Icon style={{ 
                      width: '20px', 
                      height: '20px',
                      opacity: 0.6
                    }} />
                    
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '8px'
                      }}>
                        <div>
                          <h3 style={{
                            fontSize: '13px',
                            letterSpacing: '0.15em',
                            marginBottom: '4px'
                          }}>
                            {option.name}
                          </h3>
                          <p style={{
                            fontSize: '11px',
                            opacity: 0.5,
                            letterSpacing: '0.05em'
                          }}>
                            {option.description}
                          </p>
                        </div>
                        
                        <div style={{ textAlign: 'right' }}>
                          {option.free ? (
                            <div>
                              <span style={{
                                fontSize: '14px',
                                fontWeight: '300'
                              }}>
                                FREE
                              </span>
                              {option.id === 'standard' && (
                                <p style={{
                                  fontSize: '10px',
                                  opacity: 0.4,
                                  marginTop: '4px'
                                }}>
                                  Order over $200
                                </p>
                              )}
                            </div>
                          ) : (
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '300'
                            }}>
                              ${option.price}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        opacity: 0.6,
                        marginTop: '8px'
                      }}>
                        <Clock style={{ width: '12px', height: '12px' }} />
                        {option.time}
                      </div>
                      
                      {option.id === 'festival' && (
                        <div style={{
                          marginTop: '16px',
                          padding: '12px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontSize: '11px',
                          lineHeight: '1.6',
                          opacity: 0.7
                        }}>
                          Available at Bangkok Kizomba Festival (March 15-17)<br />
                          Meet Koby personally and save on shipping
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Shipping Address (for non-festival options) */}
          {selectedOption !== 'festival' && (
            <div style={{ marginTop: '48px' }}>
              <h3 style={{
                fontSize: '14px',
                letterSpacing: '0.2em',
                marginBottom: '24px',
                opacity: 0.8
              }}>
                SHIPPING ADDRESS
              </h3>
              
              <div style={{
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <input
                    type="text"
                    placeholder="FIRST NAME"
                    style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      letterSpacing: '0.05em',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="LAST NAME"
                    style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      letterSpacing: '0.05em',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="STREET ADDRESS"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    outline: 'none',
                    marginBottom: '16px'
                  }}
                />
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  gap: '16px'
                }}>
                  <input
                    type="text"
                    placeholder="CITY"
                    style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      letterSpacing: '0.05em',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="STATE"
                    style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      letterSpacing: '0.05em',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
                    style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      letterSpacing: '0.05em',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div style={{
          position: 'sticky',
          top: '104px',
          height: 'fit-content'
        }}>
          <div style={{
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.01)'
          }}>
            <h3 style={{
              fontSize: '14px',
              letterSpacing: '0.2em',
              marginBottom: '24px'
            }}>
              ORDER SUMMARY
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '12px',
                opacity: 0.6
              }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '12px',
                opacity: 0.6
              }}>
                <span>Delivery</span>
                <span>{deliveryPrice === 0 ? 'FREE' : `$${deliveryPrice.toFixed(2)}`}</span>
              </div>
            </div>
            
            <div style={{
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: '300',
              marginBottom: '32px'
            }}>
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkout')}
              style={{
                width: '100%',
                padding: '16px',
                background: '#fff',
                color: '#000',
                border: 'none',
                fontSize: '12px',
                letterSpacing: '0.25em',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginBottom: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              CONTINUE TO CHECKOUT
            </motion.button>
            
            <button
              onClick={() => navigate('/cart')}
              style={{
                width: '100%',
                padding: '16px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '12px',
                letterSpacing: '0.25em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
              }}
            >
              BACK TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryOptionsMinimal