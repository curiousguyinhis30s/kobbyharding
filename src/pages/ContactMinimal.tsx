import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Instagram, Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react'
import useContactStore from '../stores/useContactStore'
import useNotificationStore from '../stores/useNotificationStore'
import SEO from '../components/SEO'
import { PAGE_SEO } from '../constants/seo'

const ContactMinimal = () => {
  const navigate = useNavigate()
  const { addSubmission } = useContactStore()
  const { addNotification } = useNotificationStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate subject
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Add submission to store
    const id = addSubmission({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    })

    // Create email notification
    addNotification({
      type: 'contact_reply',
      recipient: formData.email,
      subject: 'We received your message - Khardingclassics',
      body: `Hi ${formData.name},\n\nThank you for reaching out to Khardingclassics. We've received your message regarding "${formData.subject}" and will get back to you within 24-48 hours.\n\nYour submission ID: ${id}\n\nBest regards,\nKhardingclassics Team`
    })

    setSubmissionId(id)
    setSubmitted(true)
    setIsSubmitting(false)

    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false)
      setSubmissionId('')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  return (
    <>
      <SEO
        title={PAGE_SEO.contact.title}
        description={PAGE_SEO.contact.description}
        keywords={PAGE_SEO.contact.keywords}
        image={PAGE_SEO.contact.image}
        url="/contact"
        type="website"
      />
      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff'
      }}>
        {/* Hero Section */}
      <div style={{
        position: 'relative',
        height: '40vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/kobby-assets/models/IMG_3644.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)'
        }} />
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '100',
            letterSpacing: isMobile ? '0.3em' : '0.4em',
            marginBottom: '16px'
          }}>
            CONTACT
          </h1>
          <p style={{
            fontSize: isMobile ? '11px' : '13px',
            letterSpacing: '0.2em',
            opacity: 0.7
          }}>
            GET IN TOUCH WITH KHARDINGCLASSICS
          </p>
        </motion.div>
      </div>

      {/* Contact Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '24px 20px' : '40px 32px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '32px' : '40px'
      }}>
        {/* Left: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{
            fontSize: '14px',
            fontWeight: '300',
            letterSpacing: '0.25em',
            marginBottom: '40px'
          }}>
            SEND A MESSAGE
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Name & Email Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  marginBottom: '8px',
                  opacity: 0.7
                }}>
                  NAME <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: `1px solid ${errors.name ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = errors.name ? '#ef4444' : 'rgba(255,255,255,0.5)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = errors.name ? '#ef4444' : 'rgba(255,255,255,0.2)'}
                />
                {errors.name && (
                  <p style={{
                    color: '#ef4444',
                    fontSize: '10px',
                    marginTop: '4px',
                    letterSpacing: '0.05em'
                  }}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  marginBottom: '8px',
                  opacity: 0.7
                }}>
                  EMAIL <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = errors.email ? '#ef4444' : 'rgba(255,255,255,0.5)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = errors.email ? '#ef4444' : 'rgba(255,255,255,0.2)'}
                />
                {errors.email && (
                  <p style={{
                    color: '#ef4444',
                    fontSize: '10px',
                    marginTop: '4px',
                    letterSpacing: '0.05em'
                  }}>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                letterSpacing: '0.2em',
                marginBottom: '8px',
                opacity: 0.7
              }}>
                SUBJECT <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: `1px solid ${errors.subject ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border 0.3s',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = errors.subject ? '#ef4444' : 'rgba(255,255,255,0.5)'}
                onBlur={(e) => e.currentTarget.style.borderColor = errors.subject ? '#ef4444' : 'rgba(255,255,255,0.2)'}
              >
                <option value="" style={{ background: '#000' }}>Select a subject</option>
                <option value="order" style={{ background: '#000' }}>Order Inquiry</option>
                <option value="festival" style={{ background: '#000' }}>Festival Pickup</option>
                <option value="custom" style={{ background: '#000' }}>Custom Design</option>
                <option value="collaboration" style={{ background: '#000' }}>Collaboration</option>
                <option value="other" style={{ background: '#000' }}>Other</option>
              </select>
              {errors.subject && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '10px',
                  marginTop: '4px',
                  letterSpacing: '0.05em'
                }}>
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Message */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                letterSpacing: '0.2em',
                marginBottom: '8px',
                opacity: 0.7
              }}>
                MESSAGE <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: `1px solid ${errors.message ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border 0.3s',
                  resize: 'vertical',
                  minHeight: '100px'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = errors.message ? '#ef4444' : 'rgba(255,255,255,0.5)'}
                onBlur={(e) => e.currentTarget.style.borderColor = errors.message ? '#ef4444' : 'rgba(255,255,255,0.2)'}
              />
              {errors.message && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '10px',
                  marginTop: '4px',
                  letterSpacing: '0.05em'
                }}>
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              style={{
                width: '100%',
                padding: '16px',
                background: submitted ? 'transparent' : 'transparent',
                border: submitted ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.3)',
                color: submitted ? '#10b981' : '#fff',
                fontSize: '12px',
                letterSpacing: '0.25em',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!submitted && !isSubmitting) {
                  e.currentTarget.style.borderColor = '#fff'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!submitted && !isSubmitting) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                  SENDING...
                </>
              ) : submitted ? (
                <>
                  <Send style={{ width: '14px', height: '14px' }} />
                  MESSAGE SENT
                </>
              ) : (
                <>
                  <Send style={{ width: '14px', height: '14px' }} />
                  SEND MESSAGE
                </>
              )}
            </motion.button>

            {/* Success Message */}
            {submitted && submissionId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '4px'
                }}
              >
                <p style={{
                  fontSize: '12px',
                  color: '#10b981',
                  letterSpacing: '0.05em',
                  marginBottom: '4px'
                }}>
                  Thank you! Your message has been received.
                </p>
                <p style={{
                  fontSize: '11px',
                  color: 'rgba(16, 185, 129, 0.8)',
                  letterSpacing: '0.05em'
                }}>
                  Reference ID: <strong>{submissionId}</strong>
                </p>
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Right: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 style={{
            fontSize: '14px',
            fontWeight: '300',
            letterSpacing: '0.25em',
            marginBottom: '40px'
          }}>
            GET IN TOUCH
          </h2>

          {/* Contact Methods */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <Mail style={{ width: '16px', height: '16px', opacity: 0.6 }} />
              <div>
                <p style={{
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  opacity: 0.5,
                  marginBottom: '4px'
                }}>
                  EMAIL
                </p>
                <a
                  href="mailto:contact@khardingclassics.com"
                  style={{
                    fontSize: '13px',
                    color: '#fff',
                    textDecoration: 'none',
                    letterSpacing: '0.05em'
                  }}
                >
                  contact@khardingclassics.com
                </a>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <Instagram style={{ width: '16px', height: '16px', opacity: 0.6 }} />
              <div>
                <p style={{
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  opacity: 0.5,
                  marginBottom: '4px'
                }}>
                  INSTAGRAM
                </p>
                <a
                  href="https://www.instagram.com/Khardingclassics"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '13px',
                    color: '#fff',
                    textDecoration: 'none',
                    letterSpacing: '0.05em'
                  }}
                >
                  @Khardingclassics
                </a>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <Phone style={{ width: '16px', height: '16px', opacity: 0.6 }} />
              <div>
                <p style={{
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  opacity: 0.5,
                  marginBottom: '4px'
                }}>
                  WHATSAPP
                </p>
                <p style={{
                  fontSize: '13px',
                  letterSpacing: '0.05em'
                }}>
                  +66 98 765 4321
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'start',
              gap: '16px'
            }}>
              <MapPin style={{ width: '16px', height: '16px', opacity: 0.6, marginTop: '2px' }} />
              <div>
                <p style={{
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  opacity: 0.5,
                  marginBottom: '4px'
                }}>
                  CURRENT LOCATION
                </p>
                <p style={{
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  lineHeight: '1.6'
                }}>
                  China<br />
                  <span style={{ opacity: 0.6, fontSize: '12px' }}>
                    (Traveling for festivals)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Festival Schedule */}
          <div style={{
            padding: isMobile ? '16px' : '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: isMobile ? '20px' : '24px'
          }}>
            <h3 style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              marginBottom: '24px',
              opacity: 0.8
            }}>
              UPCOMING FESTIVAL APPEARANCES
            </h3>
            
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { event: 'Bangkok Kizomba Festival', date: 'March 15-17, 2025' },
                { event: 'Singapore Urban Kiz', date: 'April 5-7, 2025' },
                { event: 'Bali Tarraxo Fest', date: 'May 10-12, 2025' }
              ].map((festival) => (
                <li key={festival.event} style={{
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <p style={{
                    fontSize: '12px',
                    marginBottom: '4px',
                    letterSpacing: '0.05em'
                  }}>
                    {festival.event}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    opacity: 0.5,
                    letterSpacing: '0.1em'
                  }}>
                    {festival.date}
                  </p>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('/pickup')}
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '11px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
              }}
            >
              VIEW ALL FESTIVALS
            </button>
          </div>

          {/* FAQ Section */}
          <div>
            <h3 style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              marginBottom: '20px',
              opacity: 0.8
            }}>
              FREQUENTLY ASKED
            </h3>
            
            <div style={{ fontSize: '12px', lineHeight: '1.8', opacity: 0.6 }}>
              <p style={{ marginBottom: '16px' }}>
                <strong style={{ opacity: 1 }}>Response Time:</strong><br />
                Usually within 24-48 hours
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong style={{ opacity: 1 }}>Custom Orders:</strong><br />
                Yes, we accept custom design requests
              </p>
              <p>
                <strong style={{ opacity: 1 }}>Festival Pickup:</strong><br />
                Available at all major Kizomba festivals in Asia
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
        }
      `}</style>
      </div>
    </>
  )
}

export default ContactMinimal