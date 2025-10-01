import { useNavigate } from 'react-router-dom'
import { Instagram, Mail, MapPin } from 'lucide-react'

const FooterMinimal = () => {
  const navigate = useNavigate()

  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      background: '#000',
      color: '#fff',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      marginTop: '80px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Main Footer Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '60px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '40px'
      }}>
        {/* Brand Column */}
        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '100',
            letterSpacing: '0.4em',
            marginBottom: '20px'
          }}>
            KOBBY
          </h3>
          <p style={{
            fontSize: '11px',
            lineHeight: '1.8',
            opacity: 0.6,
            letterSpacing: '0.05em'
          }}>
            African heritage meets contemporary design. 
            Festival fashion for the modern dancer.
          </p>
          
          {/* Social Links */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '24px'
          }}>
            <a 
              href="https://www.instagram.com/hardingkobby"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.5)',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              <Instagram style={{ width: '16px', height: '16px' }} />
            </a>
            <a 
              href="mailto:koby@kobysthreads.com"
              style={{
                color: 'rgba(255,255,255,0.5)',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              <Mail style={{ width: '16px', height: '16px' }} />
            </a>
          </div>
        </div>

        {/* Shop Column */}
        <div>
          <h4 style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            marginBottom: '20px',
            opacity: 0.8,
            fontWeight: '400'
          }}>
            SHOP
          </h4>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {[
              { label: 'New Arrivals', path: '/collection' },
              { label: 'Limited Edition', path: '/collection' },
              { label: 'Festival Collection', path: '/collection' },
              { label: 'All Products', path: '/collection' }
            ].map((item) => (
              <li key={item.label} style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => navigate(item.path)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'color 0.3s',
                    padding: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Festival Info Column */}
        <div>
          <h4 style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            marginBottom: '20px',
            opacity: 0.8,
            fontWeight: '400'
          }}>
            FESTIVALS
          </h4>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {[
              'Bangkok Kizomba',
              'Singapore Urban Kiz',
              'Bali Tarraxo Fest',
              'Tokyo Kizomba Week'
            ].map((festival) => (
              <li key={festival} style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => navigate('/pickup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'color 0.3s',
                    padding: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                  {festival}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Info Column */}
        <div>
          <h4 style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            marginBottom: '20px',
            opacity: 0.8,
            fontWeight: '400'
          }}>
            INFO
          </h4>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {[
              { label: 'About Koby', path: '/' },
              { label: 'Size Guide', path: '/collection' },
              { label: 'Shipping', path: '/delivery' },
              { label: 'Contact', path: '/contact' }
            ].map((item) => (
              <li key={item.label} style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => navigate(item.path)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'color 0.3s',
                    padding: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter Section */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{
              fontSize: '13px',
              letterSpacing: '0.2em',
              marginBottom: '8px'
            }}>
              STAY IN THE LOOP
            </h4>
            <p style={{
              fontSize: '11px',
              opacity: 0.5,
              letterSpacing: '0.05em'
            }}>
              Get exclusive access to new drops and festival updates
            </p>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              // Handle newsletter signup
            }}
            style={{
              display: 'flex',
              gap: '1px',
              background: 'rgba(255,255,255,0.1)'
            }}
          >
            <input
              type="email"
              placeholder="YOUR EMAIL"
              style={{
                flex: 1,
                padding: '14px 20px',
                background: '#000',
                border: 'none',
                color: '#fff',
                fontSize: '11px',
                letterSpacing: '0.1em',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '14px 32px',
                background: '#000',
                border: 'none',
                color: '#fff',
                fontSize: '11px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        fontSize: '10px',
        letterSpacing: '0.1em',
        opacity: 0.4
      }}>
        <div>
          © {currentYear} KOBBY CARDINGS. ALL RIGHTS RESERVED.
        </div>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: 0,
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
          >
            PRIVACY
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: 0,
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
          >
            TERMS
          </button>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          footer > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          footer > div:nth-child(2) > div {
            grid-template-columns: 1fr !important;
          }
          footer > div:last-child {
            flex-direction: column !important;
            gap: 16px !important;
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  )
}

export default FooterMinimal