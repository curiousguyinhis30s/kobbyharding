import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Check, AlertCircle } from 'lucide-react'
import { useWaitlistStore } from '../stores/useWaitlistStore'

interface NotifyMeModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
  isMobile?: boolean
}

const NotifyMeModal = ({ isOpen, onClose, productId, productName, isMobile = false }: NotifyMeModalProps) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const { addToWaitlist, isEmailOnWaitlist } = useWaitlistStore()

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setError('')
      setIsSuccess(false)
      setIsSubmitting(false)
    }
  }, [isOpen])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Check if already subscribed
    if (isEmailOnWaitlist(productId, email)) {
      setError('You are already on the waitlist for this product')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const success = addToWaitlist(productId, email)

      if (success) {
        setIsSuccess(true)
        // Auto close after 2 seconds
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setError('Something went wrong. Please try again.')
      }

      setIsSubmitting(false)
    }, 800)
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '20px' : '40px'
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#000',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxWidth: '480px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  padding: '8px',
                  transition: 'all 0.3s',
                  opacity: isSubmitting ? 0.3 : 1,
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.color = '#fff'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>

              {/* Content */}
              <div style={{ padding: isMobile ? '32px 24px' : '40px 32px' }}>
                {/* Success State */}
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      textAlign: 'center',
                      padding: '20px 0'
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                      style={{
                        width: '60px',
                        height: '60px',
                        margin: '0 auto 24px',
                        borderRadius: '50%',
                        border: '2px solid #10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Check style={{ width: '32px', height: '32px', color: '#10b981' }} />
                    </motion.div>

                    <h2 style={{
                      fontSize: '16px',
                      fontWeight: '300',
                      letterSpacing: '0.15em',
                      marginBottom: '12px',
                      color: '#fff'
                    }}>
                      YOU'RE ON THE LIST
                    </h2>

                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      letterSpacing: '0.05em',
                      lineHeight: '1.6'
                    }}>
                      We'll notify you when {productName} becomes available
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Header */}
                    <div style={{
                      textAlign: 'center',
                      marginBottom: '32px'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        margin: '0 auto 20px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Mail style={{ width: '24px', height: '24px', color: 'rgba(255, 255, 255, 0.8)' }} />
                      </div>

                      <h2 style={{
                        fontSize: '16px',
                        fontWeight: '300',
                        letterSpacing: '0.15em',
                        marginBottom: '12px',
                        color: '#fff'
                      }}>
                        NOTIFY WHEN AVAILABLE
                      </h2>

                      <p style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        letterSpacing: '0.05em',
                        lineHeight: '1.6'
                      }}>
                        Enter your email to be notified when <br />
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{productName}</span> is back in stock
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '11px',
                          letterSpacing: '0.15em',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '12px'
                        }}>
                          EMAIL ADDRESS
                        </label>

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                          }}
                          placeholder="you@example.com"
                          disabled={isSubmitting}
                          autoFocus
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: error
                              ? '1px solid rgba(239, 68, 68, 0.5)'
                              : '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            fontSize: '14px',
                            letterSpacing: '0.02em',
                            outline: 'none',
                            transition: 'all 0.3s',
                            opacity: isSubmitting ? 0.6 : 1
                          }}
                          onFocus={(e) => {
                            if (!error) {
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                            }
                          }}
                          onBlur={(e) => {
                            if (!error) {
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                            }
                          }}
                        />

                        {/* Error Message */}
                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginTop: '8px',
                                fontSize: '11px',
                                color: 'rgba(239, 68, 68, 0.9)',
                                letterSpacing: '0.02em'
                              }}
                            >
                              <AlertCircle style={{ width: '14px', height: '14px' }} />
                              {error}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: isSubmitting ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: isSubmitting ? 'rgba(255, 255, 255, 0.5)' : '#000',
                          fontSize: '11px',
                          fontWeight: '400',
                          letterSpacing: '0.25em',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s',
                          opacity: isSubmitting ? 0.7 : 1
                        }}
                      >
                        {isSubmitting ? 'ADDING TO WAITLIST...' : 'NOTIFY WHEN AVAILABLE'}
                      </motion.button>

                      {/* Privacy Note */}
                      <p style={{
                        marginTop: '16px',
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        letterSpacing: '0.02em',
                        lineHeight: '1.5',
                        textAlign: 'center'
                      }}>
                        We'll only use your email to notify you about this product. <br />
                        No spam, we promise.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotifyMeModal
