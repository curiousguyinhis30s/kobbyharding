import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Instagram, Facebook, Twitter, MapPin,
  Heart, Sparkles, ArrowUpRight, Settings, CheckCircle
} from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [emailError, setEmailError] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setEmailError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email')
      return
    }
    setEmailError('')
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer style={{
      borderTop: '1px solid var(--border-primary)',
      background: 'var(--bg-primary)',
      marginTop: '80px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 40px' }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Brand Section */}
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '200',
              letterSpacing: '0.3em',
              color: 'var(--text-primary)',
              marginBottom: '16px'
            }}>
              KOBY'S
            </h3>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
              marginBottom: '20px'
            }}>
              Unique threads with stories to tell. Each piece carries the spirit of adventure and authenticity.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: Instagram, link: 'https://instagram.com', label: 'Instagram' },
                { icon: Facebook, link: 'https://facebook.com', label: 'Facebook' },
                { icon: Twitter, link: 'https://twitter.com', label: 'Twitter' }
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.label}`}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '50%',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--text-primary)'
                      e.currentTarget.style.background = 'var(--bg-hover)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-primary)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--text-primary)'
                      e.currentTarget.style.outline = '2px solid var(--accent-primary)'
                      e.currentTarget.style.outlineOffset = '2px'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-primary)'
                      e.currentTarget.style.outline = 'none'
                    }}
                  >
                    <Icon size={16} style={{ color: 'var(--text-secondary)' }} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '300',
              letterSpacing: '0.2em',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}>
              Shop
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/collection', label: 'All Products' },
                { to: '/collection?filter=new', label: 'New Arrivals' },
                { to: '/festival-pickup', label: 'Festival Pickup' },
                { to: '/about', label: 'Size Guide' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                  onFocus={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.outline = '2px solid var(--accent-primary)'
                    e.currentTarget.style.outlineOffset = '2px'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.outline = 'none'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support Links */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '300',
              letterSpacing: '0.2em',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}>
              Support
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/contact', label: 'Contact Us' },
                { to: '/about', label: 'Shipping Info' },
                { to: '/about', label: 'Returns & Exchanges' },
                { to: '/about', label: 'FAQ' }
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.to}
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                  onFocus={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.outline = '2px solid var(--accent-primary)'
                    e.currentTarget.style.outlineOffset = '2px'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.outline = 'none'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '300',
              letterSpacing: '0.2em',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}>
              Stay Connected
            </h4>
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              Subscribe for exclusive drops and festival updates
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                  aria-label="Email address for newsletter"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'transparent',
                    border: `1px solid ${emailError ? '#ef4444' : 'var(--border-primary)'}`,
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = emailError ? '#ef4444' : 'var(--border-primary)' }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  disabled={subscribed}
                  style={{
                    padding: '10px 16px',
                    background: subscribed ? '#22c55e' : 'var(--text-primary)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: subscribed ? 'default' : 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (!subscribed) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--accent-primary)'
                    e.currentTarget.style.outlineOffset = '2px'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none'
                  }}
                >
                  {subscribed ? <CheckCircle size={16} /> : <ArrowUpRight size={16} />}
                </button>
              </div>
              {emailError && (
                <span id="email-error" role="alert" style={{ color: '#ef4444', fontSize: '12px' }}>
                  {emailError}
                </span>
              )}
              {subscribed && (
                <span role="status" style={{ color: '#22c55e', fontSize: '12px' }}>
                  Thanks for subscribing!
                </span>
              )}
            </form>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              <MapPin size={14} />
              Currently in: China
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'var(--border-primary)',
          margin: '40px 0 20px'
        }} />

        {/* Bottom Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            © 2024 Koby's Threads. All rights reserved.
          </div>

          <nav style={{
            display: 'flex',
            gap: '24px',
            fontSize: '12px'
          }}>
            {['Privacy Policy', 'Terms of Service', 'Sustainability'].map((text, idx) => (
              <Link
                key={idx}
                to="/about"
                style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                onFocus={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)'
                  e.currentTarget.style.outline = '2px solid var(--accent-primary)'
                  e.currentTarget.style.outlineOffset = '2px'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.outline = 'none'
                }}
              >
                {text}
              </Link>
            ))}
          </nav>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            Made with <Heart size={12} fill={'var(--accent-primary)'} color={'var(--accent-primary)'} /> and <Sparkles size={12} color={'var(--accent-primary)'} />
          </div>

          {/* Admin Access - Subtle link */}
          <Link
            to="/admin/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              textDecoration: 'none',
              opacity: 0.6,
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
            onFocus={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.outline = '2px solid var(--accent-primary)'
              e.currentTarget.style.outlineOffset = '2px'
            }}
            onBlur={(e) => {
              e.currentTarget.style.opacity = '0.6'
              e.currentTarget.style.outline = 'none'
            }}
          >
            <Settings size={12} />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
