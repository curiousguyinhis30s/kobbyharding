import { useNavigate } from 'react-router-dom'
import { Instagram, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import NewsletterSignup from './NewsletterSignup'

const FooterMinimal = () => {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 360)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 768)
      setIsSmallMobile(width < 360)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <footer style={{
      background: '#000',
      color: '#fff',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      marginTop: '48px'
    }}>
      {/* Main Footer */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isSmallMobile ? '24px 12px' : isMobile ? '32px 16px' : '48px 40px',
        display: 'grid',
        gridTemplateColumns: isSmallMobile ? '1fr' : isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: isSmallMobile ? '20px' : isMobile ? '24px' : '32px'
      }}>
        {/* Brand */}
        <div style={{ gridColumn: isSmallMobile ? 'auto' : isMobile ? 'span 2' : 'auto' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '100',
            letterSpacing: '0.2em',
            marginBottom: '12px'
          }}>
            KHARDING
          </h3>
          <p style={{
            fontSize: '11px',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.03em',
            maxWidth: '240px'
          }}>
            African heritage fashion for dance festivals across Asia.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <a
              href="https://www.instagram.com/Khardingclassics"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.6)',
                transition: 'color 0.2s',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@Khardingclassics"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.6)',
                transition: 'color 0.2s',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>
            <a
              href="mailto:contact@khardingclassics.com"
              style={{
                color: 'rgba(255,255,255,0.6)',
                transition: 'color 0.2s',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            marginBottom: '14px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            SHOP
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Collection', path: '/collection' },
              { label: 'Festival', path: '/festival' },
              { label: 'Gift Cards', path: '/gift-cards' },
              { label: 'About', path: '/about' }
            ].map((item) => (
              <li key={item.label} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => navigate(item.path)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            marginBottom: '14px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            INFO
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Track Order', path: '/track-order' },
              { label: 'Shipping', path: '/delivery' },
              { label: 'Contact', path: '/contact' }
            ].map((item) => (
              <li key={item.label} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => navigate(item.path)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            marginBottom: '14px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            STAY CONNECTED
          </h4>
          <NewsletterSignup inline isMobile={isMobile} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        padding: isMobile ? '16px' : '20px 40px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: '9px',
        letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.4)'
      }}>
        <div>© {currentYear} KHARDING CLASSICS</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span style={{ cursor: 'pointer' }}>PRIVACY</span>
          <span style={{ cursor: 'pointer' }}>TERMS</span>
        </div>
      </div>
    </footer>
  )
}

export default FooterMinimal
