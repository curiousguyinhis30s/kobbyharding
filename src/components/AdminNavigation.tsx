import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Package,
  Settings, Palette, BarChart2, LogOut, MessageSquare, CreditCard, Users, Bell, Menu, X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const AdminNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024)
      if (window.innerWidth > 1024) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/waitlist', label: 'Waitlist', icon: Bell },
    { path: '/admin/commerce', label: 'Commerce', icon: CreditCard },
    { path: '/admin/chatbot', label: 'Chatbot', icon: MessageSquare },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/admin/brand', label: 'Brand', icon: Palette },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleNavClick = (path: string) => {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        backdropFilter: 'blur(8px)',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          height: '100%',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div
            onClick={() => handleNavClick('/admin')}
            style={{
              fontSize: isMobile ? '14px' : '18px',
              fontWeight: '200',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              color: '#000'
            }}
          >
            {isMobile ? 'KH ADMIN' : 'KOBBY HARDING ADMIN'}
          </div>

          {/* Mobile Menu Button */}
          {isMobile ? (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                background: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          ) : (
            /* Desktop Navigation Items */
            <nav style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              {navItems.map(item => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      background: isActive ? '#f3f4f6' : 'transparent',
                      border: isActive ? '1px solid #e5e7eb' : '1px solid transparent',
                      borderRadius: '6px',
                      color: isActive ? '#000' : '#6b7280',
                      fontSize: '13px',
                      fontWeight: '300',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#f9fafb'
                        e.currentTarget.style.color = '#000'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#6b7280'
                      }
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid #000'
                      e.currentTarget.style.outlineOffset = '2px'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = 'none'
                    }}
                  >
                    <Icon style={{ width: '16px', height: '16px' }} />
                    <span>{item.label}</span>
                  </button>
                )
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  marginLeft: '16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#dc2626',
                  fontSize: '13px',
                  fontWeight: '300',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #dc2626'
                  e.currentTarget.style.outlineOffset = '2px'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none'
                }}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                <span>Logout</span>
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 150,
                opacity: menuOpen ? 1 : 0,
                transition: 'opacity 0.3s'
              }}
              aria-hidden="true"
            />
          )}

          {/* Slide-out Panel */}
          <nav
            role="navigation"
            aria-label="Admin navigation"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '280px',
              background: '#fff',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
              zIndex: 200,
              transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              padding: '80px 16px 24px'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {/* Nav Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
              {navItems.map(item => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      background: isActive ? '#f3f4f6' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: isActive ? '#000' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: isActive ? '500' : '400',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px' }} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Logout at bottom */}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                marginTop: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <LogOut style={{ width: '20px', height: '20px' }} />
              <span>Logout</span>
            </button>
          </nav>
        </>
      )}
    </>
  )
}

export default AdminNavigation
