import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Mail, MessageSquare, Check, Copy } from 'lucide-react'
import { useGiftCardStore } from '../stores/useGiftCardStore'
import { useToast } from './Toast'

interface GiftCardPurchaseProps {
  isMobile?: boolean
}

const GiftCardPurchase = ({ isMobile = false }: GiftCardPurchaseProps) => {
  const { purchaseGiftCard } = useGiftCardStore()
  const { addToast } = useToast()

  const [selectedAmount, setSelectedAmount] = useState<number>(100)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const [purchasedCard, setPurchasedCard] = useState<{ code: string; amount: number } | null>(null)

  const presetAmounts = [50, 100, 200, 500]

  const handlePurchase = () => {
    const amount = selectedAmount === 0 ? parseFloat(customAmount) : selectedAmount

    if (!amount || amount < 10) {
      addToast('error', 'Minimum gift card amount is $10')
      return
    }

    if (amount > 1000) {
      addToast('error', 'Maximum gift card amount is $1000')
      return
    }

    if (!recipientEmail || !recipientEmail.includes('@')) {
      addToast('error', 'Please enter a valid recipient email')
      return
    }

    const giftCard = purchaseGiftCard(amount, recipientEmail, message)
    setPurchasedCard({ code: giftCard.code, amount })
    addToast('success', 'Gift card purchased successfully!')

    // Reset form
    setSelectedAmount(100)
    setCustomAmount('')
    setRecipientEmail('')
    setMessage('')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addToast('success', 'Gift card code copied to clipboard!')
  }

  const cardStyle = {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: isMobile ? '20px' : '32px',
    borderRadius: '0',
    marginBottom: isMobile ? '20px' : '32px'
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
    outline: 'none',
    transition: 'all 0.3s'
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

  if (purchasedCard) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={cardStyle}
      >
        <div style={{
          textAlign: 'center',
          padding: isMobile ? '20px' : '40px',
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          borderRadius: '0',
          marginBottom: '24px'
        }}>
          <Gift style={{
            width: isMobile ? '48px' : '64px',
            height: isMobile ? '48px' : '64px',
            margin: '0 auto 20px',
            color: '#f97316'
          }} />

          <h3 style={{
            fontSize: isMobile ? '18px' : '24px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            marginBottom: '8px',
            color: '#ffffff'
          }}>
            GIFT CARD PURCHASED
          </h3>

          <p style={{
            fontSize: isMobile ? '12px' : '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '24px'
          }}>
            Amount: ${purchasedCard.amount}
          </p>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: isMobile ? '12px' : '16px',
            borderRadius: '0',
            marginBottom: '16px'
          }}>
            <p style={{
              fontSize: isMobile ? '10px' : '11px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '8px',
              letterSpacing: '0.1em'
            }}>
              GIFT CARD CODE
            </p>
            <p style={{
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: '300',
              letterSpacing: '0.2em',
              color: '#ffffff',
              fontFamily: 'monospace'
            }}>
              {purchasedCard.code}
            </p>
          </div>

          <button
            onClick={() => copyToClipboard(purchasedCard.code)}
            style={{
              ...buttonStyle,
              width: '100%',
              background: 'rgba(249, 115, 22, 0.1)',
              borderColor: 'rgba(249, 115, 22, 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.2)'
              e.currentTarget.style.borderColor = '#f97316'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)'
            }}
          >
            <Copy style={{ width: '14px', height: '14px' }} />
            COPY CODE
          </button>
        </div>

        <p style={{
          fontSize: isMobile ? '11px' : '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          The gift card code has been sent to <strong style={{ color: '#ffffff' }}>{recipientEmail}</strong>.
          It can be used at checkout to purchase any items from our collection.
        </p>

        <button
          onClick={() => setPurchasedCard(null)}
          style={{
            ...buttonStyle,
            width: '100%',
            marginTop: '20px'
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
          PURCHASE ANOTHER GIFT CARD
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={cardStyle}
    >
      <h2 style={{
        fontSize: isMobile ? '16px' : '20px',
        fontWeight: '300',
        letterSpacing: '0.15em',
        marginBottom: isMobile ? '20px' : '24px',
        color: '#ffffff'
      }}>
        PURCHASE GIFT CARD
      </h2>

      {/* Amount Selection */}
      <div style={{ marginBottom: isMobile ? '20px' : '24px' }}>
        <label style={{
          display: 'block',
          fontSize: isMobile ? '11px' : '12px',
          letterSpacing: '0.1em',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '12px'
        }}>
          SELECT AMOUNT
        </label>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '12px'
        }}>
          {presetAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => {
                setSelectedAmount(amount)
                setCustomAmount('')
              }}
              style={{
                padding: isMobile ? '12px' : '16px',
                background: selectedAmount === amount ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                border: selectedAmount === amount ? '1px solid rgba(249, 115, 22, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '300',
                cursor: 'pointer',
                borderRadius: '0',
                transition: 'all 0.3s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (selectedAmount !== amount) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAmount !== amount) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              ${amount}
              {selectedAmount === amount && (
                <Check style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '14px',
                  height: '14px',
                  color: '#f97316'
                }} />
              )}
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder="Custom amount ($10 - $1000)"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value)
            setSelectedAmount(0)
          }}
          style={inputStyle}
          onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
        />
      </div>

      {/* Recipient Email */}
      <div style={{ marginBottom: isMobile ? '20px' : '24px' }}>
        <label style={{
          display: 'block',
          fontSize: isMobile ? '11px' : '12px',
          letterSpacing: '0.1em',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '12px'
        }}>
          <Mail style={{ width: '14px', height: '14px', display: 'inline', marginRight: '8px' }} />
          RECIPIENT EMAIL
        </label>
        <input
          type="email"
          placeholder="recipient@example.com"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          style={inputStyle}
          onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
        />
      </div>

      {/* Personal Message */}
      <div style={{ marginBottom: isMobile ? '20px' : '24px' }}>
        <label style={{
          display: 'block',
          fontSize: isMobile ? '11px' : '12px',
          letterSpacing: '0.1em',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '12px'
        }}>
          <MessageSquare style={{ width: '14px', height: '14px', display: 'inline', marginRight: '8px' }} />
          PERSONAL MESSAGE (OPTIONAL)
        </label>
        <textarea
          placeholder="Add a personal message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          style={{
            ...inputStyle,
            resize: 'vertical' as const,
            minHeight: '80px'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
        />
      </div>

      {/* Gift Card Preview */}
      {(selectedAmount > 0 || customAmount) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(249, 115, 22, 0.1) 100%)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            padding: isMobile ? '16px' : '24px',
            marginBottom: isMobile ? '20px' : '24px',
            textAlign: 'center'
          }}
        >
          <Gift style={{
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            margin: '0 auto 12px',
            color: '#f97316'
          }} />
          <p style={{
            fontSize: isMobile ? '12px' : '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '8px'
          }}>
            KHARDING CLASSICS
          </p>
          <p style={{
            fontSize: isMobile ? '20px' : '28px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            color: '#ffffff'
          }}>
            ${selectedAmount || customAmount}
          </p>
        </motion.div>
      )}

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        style={{
          ...buttonStyle,
          width: '100%',
          background: '#ffffff',
          color: '#000000',
          border: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(249, 115, 22, 0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <Gift style={{ width: '16px', height: '16px' }} />
        PURCHASE GIFT CARD
      </button>

      <p style={{
        fontSize: isMobile ? '10px' : '11px',
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: '16px',
        textAlign: 'center',
        lineHeight: '1.6'
      }}>
        Gift cards are valid for 1 year from purchase date and can be used for any items in our collection.
      </p>
    </motion.div>
  )
}

export default GiftCardPurchase
