import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag, User, Search, LogOut, Heart } from 'lucide-react'
import useStore from '../stores/useStore'
import { useAuth } from '../contexts/AuthContext'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems, favorites } = useStore()
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    // Set initial values immediately
    setIsMobile(window.innerWidth < 768)
    setIsScrolled(window.scrollY > 20)
    setIsLoaded(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    // Always close menu when location changes
    setIsMenuOpen(false)
    setShowSearch(false)
    setShowUserMenu(false)
  }, [location])

  // Ensure menu is closed on mount
  useEffect(() => {
    setIsMenuOpen(false)
  }, [])

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'COLLECTION', path: '/collection' },
    { label: 'FESTIVALS', path: '/pickup' },
    { label: 'CONTACT', path: '/contact' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  // Navigation stays black - no theme needed

  const headerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: !isLoaded ? '#000' : 'rgba(0, 0, 0, 0.95)',
    backdropFilter: !isLoaded ? 'none' : 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    transition: !isLoaded ? 'none' : 'background-color 0.3s ease'
  }

  const mobileMenuStyle = {
    position: 'fixed' as const,
    right: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    maxWidth: '384px',
    backgroundColor: '#000',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 60,
    overflowY: 'auto' as const,
    color: 'white'
  }

  const backdropStyle = {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(4px)',
    zIndex: 55
  }

  return (
    <>
      <header style={headerStyle}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            height: '64px'
          }}>
            {/* Logo */}
            <button 
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {/* Logo Icon */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '300',
                color: '#fff'
              }}>
                K
              </div>
              <span style={{
                fontSize: '16px',
                fontWeight: '100',
                letterSpacing: '0.25em',
                color: '#fff'
              }}>
                KHARDING CLASSICS
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav style={{ display: !isMobile ? 'flex' : 'none', gap: '40px', alignItems: 'center' }}>
              {navItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.25em',
                    color: location.pathname === item.path ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                    background: 'none',
                    border: 'none',
                    borderBottom: location.pathname === item.path ? `1px solid ${'#fff'}` : '1px solid transparent',
                    paddingBottom: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderBottom = '1px solid rgba(255, 255, 255, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'
                      e.currentTarget.style.borderBottom = '1px solid transparent'
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

              {/* Search Button */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                style={{
                  padding: '8px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                <Search style={{ width: '18px', height: '18px' }} />
              </button>

              {/* Favorites Button */}
              <button
                onClick={() => navigate('/favorites')}
                style={{
                  position: 'relative',
                  padding: '8px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                <Heart style={{ width: '18px', height: '18px' }} />
                {favorites.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#fff',
                    color: '#000',
                    fontSize: '10px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '400'
                  }}>
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button 
                onClick={() => navigate('/cart')}
                style={{
                  position: 'relative',
                  padding: '8px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                <ShoppingBag style={{ width: '18px', height: '18px' }} />
                {cartItems.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#fff',
                    color: '#000',
                    fontSize: '10px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '400'
                  }}>
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* User Account - Desktop Only */}
              <div style={{ position: 'relative', display: !isMobile ? 'block' : 'none' }}>
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      setShowUserMenu(!showUserMenu)
                    } else {
                      navigate("/admin/login")
                    }
                  }}
                  style={{
                    padding: '8px',
                    color: isAuthenticated ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = isAuthenticated ? '1' : '0.7'}
                >
                  <User style={{ width: '18px', height: '18px' }} />
                  {isAuthenticated && (
                    <span style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                      {user?.name?.split(' ')[0]?.toUpperCase()}
                    </span>
                  )}
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '8px',
                        width: '220px',
                        background: 'rgba(0, 0, 0, 0.98)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(20px)',
                        zIndex: 100,
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>SIGNED IN AS</p>
                        <p style={{ fontSize: '13px', color: '#fff' }}>{user?.email}</p>
                      </div>
                      
                      <div style={{ padding: '8px 0' }}>
                        <button
                          onClick={() => {
                            navigate('/account/orders')
                            setShowUserMenu(false)
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          MY ORDERS
                        </button>
                        
                        <button
                          onClick={() => {
                            navigate('/account/favorites')
                            setShowUserMenu(false)
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          FAVORITES
                        </button>
                        
                        <button
                          onClick={() => {
                            navigate('/account/try-on')
                            setShowUserMenu(false)
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          TRY-ON REQUESTS
                        </button>
                        
                        <button
                          onClick={() => {
                            navigate('/admin')
                            setShowUserMenu(false)
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          ADMIN DASHBOARD
                        </button>
                      </div>
                      
                      <div style={{ padding: '8px 0', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <button
                          onClick={() => {
                            logout()
                            setShowUserMenu(false)
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          <LogOut style={{ width: '14px', height: '14px' }} />
                          SIGN OUT
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  display: isMobile ? 'block' : 'none',
                  padding: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease',
                  zIndex: 70
                }}
              >
                {isMenuOpen ? 
                  <X style={{ width: '20px', height: '20px' }} /> : 
                  <Menu style={{ width: '20px', height: '20px' }} />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.98)',
                overflow: 'hidden'
              }}
            >
              <form onSubmit={handleSearch} style={{ maxWidth: '1024px', margin: '0 auto', padding: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      paddingRight: '100px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '13px',
                      letterSpacing: '0.05em'
                    }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    SEARCH
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={backdropStyle}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={mobileMenuStyle}
            >
              <div style={{ padding: '24px', paddingTop: '80px' }}>
                {/* Mobile Navigation */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {navItems.map(item => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path)
                        setIsMenuOpen(false)
                      }}
                      style={{
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '200',
                        letterSpacing: '0.2em',
                        color: location.pathname === item.path ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px 0',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={() => {
                            navigate('/account/orders')
                            setIsMenuOpen(false)
                          }}
                          style={{
                            textAlign: 'left',
                            fontSize: '16px',
                            fontWeight: '200',
                            letterSpacing: '0.2em',
                            color: 'rgba(255,255,255,0.5)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px 0',
                            width: '100%'
                          }}
                        >
                          MY ACCOUNT
                        </button>
                        <button
                          onClick={() => {
                            logout()
                            setIsMenuOpen(false)
                          }}
                          style={{
                            textAlign: 'left',
                            fontSize: '16px',
                            fontWeight: '200',
                            letterSpacing: '0.2em',
                            color: 'rgba(255,255,255,0.5)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px 0',
                            width: '100%',
                            marginTop: '16px'
                          }}
                        >
                          SIGN OUT
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          navigate("/admin/login")
                          setIsMenuOpen(false)
                        }}
                        style={{
                          textAlign: 'left',
                          fontSize: '16px',
                          fontWeight: '200',
                          letterSpacing: '0.2em',
                          color: 'rgba(255,255,255,0.5)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px 0'
                        }}
                      >
                        SIGN IN
                      </button>
                    )}
                  </div>
                </nav>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} style={{ marginTop: '32px' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '13px',
                      letterSpacing: '0.05em'
                    }}
                  />
                </form>

                {/* Quick Links */}
                <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
                    QUICK LINKS
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button style={{ textAlign: 'left', fontSize: '14px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Size Guide
                    </button>
                    <button style={{ textAlign: 'left', fontSize: '14px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Shipping Info
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/contact')
                        setIsMenuOpen(false)
                      }}
                      style={{ textAlign: 'left', fontSize: '14px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Contact
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
                    FOLLOW US
                  </h3>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Instagram
                    </button>
                    <button style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      TikTok
                    </button>
                    <button style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
    </>
  )
}

export default Navigation