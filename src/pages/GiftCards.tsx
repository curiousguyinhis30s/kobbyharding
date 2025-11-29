import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Gift, Search, Info, Check } from 'lucide-react'
import GiftCardPurchase from '../components/GiftCardPurchase'
import { useGiftCardStore } from '../stores/useGiftCardStore'
import { useToast } from '../components/Toast'

const GiftCards = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { validateGiftCard } = useGiftCardStore()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [checkBalanceCode, setCheckBalanceCode] = useState('')
  const [balanceResult, setBalanceResult] = useState<{ balance: number; valid: boolean; message: string } | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleCheckBalance = () => {
    if (!checkBalanceCode.trim()) {
      addToast('error', 'Please enter a gift card code')
      return
    }

    const result = validateGiftCard(checkBalanceCode.toUpperCase())

    if (result.valid && result.giftCard) {
      setBalanceResult({
        balance: result.giftCard.balance,
        valid: true,
        message: result.message
      })
      addToast('success', `Balance: $${result.giftCard.balance.toFixed(2)}`)
    } else {
      setBalanceResult({
        balance: 0,
        valid: false,
        message: result.message
      })
      addToast('error', result.message)
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    background: '#000000',
    color: '#ffffff'
  }

  const headerStyle = {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(8px)'
  }

  const cardStyle = {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: isMobile ? '20px' : '32px',
    borderRadius: '0'
  }

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '10px 12px' : '12px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0',
    color: '#ffffff',
    fontSize: isMobile ? '13px' : '14px',
    fontFamily: 'inherit',
    letterSpacing: '0.1em',
    outline: 'none',
    transition: 'all 0.3s',
    textTransform: 'uppercase' as const
  }

  const buttonStyle = {
    padding: isMobile ? '10px 20px' : '12px 24px',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    fontSize: isMobile ? '11px' : '13px',
    fontWeight: '300',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    borderRadius: '0',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center'
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
              {!isMobile && 'BACK'}
            </button>

            <h1 style={{
              fontSize: isMobile ? '16px' : '24px',
              fontWeight: '200',
              letterSpacing: isMobile ? '0.2em' : '0.3em',
              color: '#ffffff'
            }}>
              GIFT CARDS
            </h1>

            <Gift style={{ width: '20px', height: '20px', color: '#f97316' }} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '32px 16px' : '64px 24px',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <Gift style={{
            width: isMobile ? '48px' : '64px',
            height: isMobile ? '48px' : '64px',
            margin: '0 auto 24px',
            color: '#f97316'
          }} />

          <h2 style={{
            fontSize: isMobile ? '24px' : '36px',
            fontWeight: '200',
            letterSpacing: '0.15em',
            marginBottom: '16px',
            color: '#ffffff'
          }}>
            THE PERFECT GIFT
          </h2>

          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.8',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Share the joy of African heritage fashion. Our gift cards allow your loved ones
            to choose their perfect piece from our curated collection of festival wear.
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '24px 16px' : '48px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '24px' : '32px'
        }}>
          {/* Purchase Section */}
          <div>
            <GiftCardPurchase isMobile={isMobile} />
          </div>

          {/* Check Balance Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={cardStyle}
            >
              <h2 style={{
                fontSize: isMobile ? '16px' : '20px',
                fontWeight: '300',
                letterSpacing: '0.15em',
                marginBottom: isMobile ? '20px' : '24px',
                color: '#ffffff'
              }}>
                CHECK BALANCE
              </h2>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="KHC-XXXX-XXXX-XXXX"
                  value={checkBalanceCode}
                  onChange={(e) => setCheckBalanceCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckBalance()}
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
                <button
                  onClick={handleCheckBalance}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ffffff'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Search style={{ width: '14px', height: '14px' }} />
                  {!isMobile && 'CHECK'}
                </button>
              </div>

              {balanceResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: isMobile ? '16px' : '20px',
                    background: balanceResult.valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${balanceResult.valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    borderRadius: '0',
                    marginBottom: '16px'
                  }}
                >
                  {balanceResult.valid ? (
                    <>
                      <p style={{
                        fontSize: isMobile ? '11px' : '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '8px',
                        letterSpacing: '0.1em'
                      }}>
                        AVAILABLE BALANCE
                      </p>
                      <p style={{
                        fontSize: isMobile ? '24px' : '32px',
                        fontWeight: '300',
                        color: '#10b981'
                      }}>
                        ${balanceResult.balance.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p style={{
                      fontSize: isMobile ? '12px' : '14px',
                      color: '#ef4444'
                    }}>
                      {balanceResult.message}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ ...cardStyle, marginTop: isMobile ? '20px' : '24px' }}
            >
              <h3 style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '300',
                letterSpacing: '0.15em',
                marginBottom: isMobile ? '16px' : '20px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Info style={{ width: '16px', height: '16px' }} />
                HOW IT WORKS
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { step: '1', text: 'Choose an amount and enter recipient details' },
                  { step: '2', text: 'Complete your purchase securely' },
                  { step: '3', text: 'Gift card code is sent to recipient via email' },
                  { step: '4', text: 'Recipient applies code at checkout' }
                ].map((item) => (
                  <div key={item.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(249, 115, 22, 0.2)',
                      border: '1px solid rgba(249, 115, 22, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '300',
                      color: '#f97316',
                      flexShrink: 0
                    }}>
                      {item.step}
                    </div>
                    <p style={{
                      fontSize: isMobile ? '12px' : '13px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: '1.6'
                    }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Terms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ ...cardStyle, marginTop: isMobile ? '24px' : '32px' }}
        >
          <h3 style={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: '300',
            letterSpacing: '0.15em',
            marginBottom: isMobile ? '16px' : '20px',
            color: '#ffffff'
          }}>
            GIFT CARD TERMS
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? '16px' : '24px'
          }}>
            {[
              { icon: Check, text: 'Valid for 1 year from purchase date' },
              { icon: Check, text: 'Can be used for any items in our collection' },
              { icon: Check, text: 'Multiple gift cards can be combined' },
              { icon: Check, text: 'Non-refundable and cannot be exchanged for cash' },
              { icon: Check, text: 'Balance never expires once used' },
              { icon: Check, text: 'Digital delivery via email' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <item.icon style={{
                  width: '16px',
                  height: '16px',
                  color: '#10b981',
                  flexShrink: 0,
                  marginTop: '2px'
                }} />
                <p style={{
                  fontSize: isMobile ? '11px' : '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: '1.6'
                }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default GiftCards
