import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Instagram, Mail, MapPin, Phone, Send } from 'lucide-react'

const ContactMinimal = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      paddingTop: '64px'
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
          filter: 'grayscale(100%) brightness(0.3)'
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
            fontSize: '48px',
            fontWeight: '100',
            letterSpacing: '0.4em',
            marginBottom: '16px'
          }}>
            CONTACT
          </h1>
          <p style={{
            fontSize: '13px',
            letterSpacing: '0.2em',
            opacity: 0.7
          }}>
            GET IN TOUCH WITH KOBBY HARDING
          </p>
        </motion.div>
      </div>

      {/* Contact Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px'
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
              gridTemplateColumns: '1fr 1fr',
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
                  NAME
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
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  marginBottom: '8px',
                  opacity: 0.7
                }}>
                  EMAIL
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
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                />
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
                SUBJECT
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
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border 0.3s',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              >
                <option value="" style={{ background: '#000' }}>Select a subject</option>
                <option value="order" style={{ background: '#000' }}>Order Inquiry</option>
                <option value="festival" style={{ background: '#000' }}>Festival Pickup</option>
                <option value="custom" style={{ background: '#000' }}>Custom Design</option>
                <option value="collaboration" style={{ background: '#000' }}>Collaboration</option>
                <option value="other" style={{ background: '#000' }}>Other</option>
              </select>
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
                MESSAGE
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border 0.3s',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '16px',
                background: submitted ? 'transparent' : 'transparent',
                border: submitted ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.3)',
                color: submitted ? '#10b981' : '#fff',
                fontSize: '12px',
                letterSpacing: '0.25em',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                if (!submitted) {
                  e.currentTarget.style.borderColor = '#fff'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!submitted) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <Send style={{ width: '14px', height: '14px' }} />
              {submitted ? 'MESSAGE SENT' : 'SEND MESSAGE'}
            </motion.button>
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
                  href="mailto:koby@kobysthreads.com"
                  style={{
                    fontSize: '13px',
                    color: '#fff',
                    textDecoration: 'none',
                    letterSpacing: '0.05em'
                  }}
                >
                  koby@kobysthreads.com
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
                  href="https://www.instagram.com/hardingkobby"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '13px',
                    color: '#fff',
                    textDecoration: 'none',
                    letterSpacing: '0.05em'
                  }}
                >
                  @hardingkobby
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
                  Bangkok, Thailand<br />
                  <span style={{ opacity: 0.6, fontSize: '12px' }}>
                    (Traveling for festivals)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Festival Schedule */}
          <div style={{
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '32px'
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
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ContactMinimal