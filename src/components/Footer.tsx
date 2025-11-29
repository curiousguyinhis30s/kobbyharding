import { Link } from 'react-router-dom'
import { 
  Instagram, Facebook, Twitter, MapPin, 
  Heart, Sparkles, ArrowUpRight
} from 'lucide-react'

const Footer = () => {

  const footerStyle = {
    borderTop: `1px solid ${'#e0e0e0'}`,
    background: 'rgba(255, 255, 255, 0.98)',
    marginTop: '80px'
  }

  const linkStyle = {
    color: '#666666',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'color 0.3s',
    cursor: 'pointer'
  }

  const socialIconStyle = {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${'#e0e0e0'}`,
    borderRadius: '50%',
    transition: 'all 0.3s',
    cursor: 'pointer'
  }

  return (
    <footer style={footerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 40px' }}>
        {/* Main Footer Content */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(4, 1fr)' : '1fr',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Brand Section */}
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '200',
              letterSpacing: '0.3em',
              color: '#000000',
              marginBottom: '16px'
            }}>
              KOBY'S
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#666666',
              lineHeight: '1.8',
              marginBottom: '20px'
            }}>
              Unique threads with stories to tell. Each piece carries the spirit of adventure and authenticity.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: Instagram, link: 'https://instagram.com' },
                { icon: Facebook, link: 'https://facebook.com' },
                { icon: Twitter, link: 'https://twitter.com' }
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialIconStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#000000'
                      e.currentTarget.style.background = `${'#000000'}20`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <Icon size={16} color={'#666666'} />
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
              color: '#000000',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}>
              Shop
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link 
                to="/collection" 
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
              >
                All Products
              </Link>
              <Link 
                to="/collection?filter=new" 
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
              >
                New Arrivals
              </Link>
              <Link 
                to="/festival-pickup" 
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
              >
                Festival Pickup
              </Link>
              <a 
                href="#" 
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
              >
                Size Guide
              </a>
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '300',
              letterSpacing: '0.2em',
              color: '#000000',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link 
                to="/contact" 
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
              >
                Contact Us
              </Link>
              <a 
                href="#" 
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
              >
                Shipping Info
              </a>
              <a 
                href="#" 
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
              >
                Returns & Exchanges
              </a>
              <a 
                href="#" 
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
              >
                FAQ
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '300',
              letterSpacing: '0.2em',
              color: '#000000',
              marginBottom: '16px',
              textTransform: 'uppercase'
            }}>
              Stay Connected
            </h4>
            <p style={{
              fontSize: '13px',
              color: '#666666',
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              Subscribe for exclusive drops and festival updates
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: 'transparent',
                  border: `1px solid ${'#e0e0e0'}`,
                  borderRadius: '4px',
                  color: '#000000',
                  fontSize: '13px'
                }}
              />
              <button
                style={{
                  padding: '10px 16px',
                  background: '#000000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#666666'
            }}>
              <MapPin size={14} />
              Currently in: China
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: '#e0e0e0',
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
            color: '#666666'
          }}>
            © 2024 Koby's Threads. All rights reserved.
          </div>
          
          <div style={{
            display: 'flex',
            gap: '24px',
            fontSize: '12px'
          }}>
            <a 
              href="#" 
              style={{ color: '#666666', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              style={{ color: '#666666', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              style={{ color: '#666666', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#000000' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#666666' }}
            >
              Sustainability
            </a>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#666666'
          }}>
            Made with <Heart size={12} fill={'#000000'} color={'#000000'} /> and <Sparkles size={12} color={'#000000'} />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer