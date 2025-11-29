import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag, User, Heart, Search } from 'lucide-react'
import useStore from '../stores/useStore'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

// Animated Logo Component with typewriter effect
const AnimatedLogo = ({ onClick }: { onClick: () => void }) => {
  const [showH, setShowH] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowH(true), 150)
    return () => clearTimeout(timer)
  }, [])

  return (
    <button
      onClick={onClick}
      aria-label="Go to homepage - KH Classics"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        padding: '8px 0'
      }}
    >
      <motion.span
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          fontSize: '20px',
          fontWeight: '600',
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          display: 'inline-block'
        }}
      >
        K
      </motion.span>
      <motion.span
        initial={{ opacity: 0, rotateY: 90 }}
        animate={{ opacity: showH ? 1 : 0, rotateY: showH ? 0 : 90 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          fontSize: '20px',
          fontWeight: '600',
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          display: 'inline-block'
        }}
      >
        H
      </motion.span>
    </button>
  )
}

// Minimal Theme Toggle - just a small circle
const ThemeToggle = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    style={{
      background: 'none',
      border: 'none',
      padding: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <motion.div
      initial={false}
      animate={{
        backgroundColor: isDark ? '#fff' : '#000',
        scale: isDark ? 1 : 0.85
      }}
      transition={{ duration: 0.2 }}
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`
      }}
    />
  </button>
)

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems, favorites, setSearchQuery } = useStore()
  const { user, isAuthenticated, logout } = useAuth()
  const { toggleTheme, isDark } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 360)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setScreenWidth(width)
      setIsMobile(width < 768)
      setIsSmallMobile(width < 360)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setShowUserMenu(false)
    setShowMobileSearch(false)
  }, [location])

  // Focus search input when mobile search opens
  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showMobileSearch])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        if (showUserMenu) setShowUserMenu(false)
        if (showMobileSearch) setShowMobileSearch(false)
        if (isMenuOpen) setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showUserMenu, showMobileSearch, isMenuOpen])

  // Handle mobile search submission
  const handleMobileSearch = () => {
    if (mobileSearchQuery.trim()) {
      setSearchQuery(mobileSearchQuery)
      navigate('/collection')
      setShowMobileSearch(false)
      setMobileSearchQuery('')
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleMobileSearch()
    }
  }

  const navItems = [
    { label: 'Collection', path: '/collection' },
    { label: 'About', path: '/about' },
    { label: 'Festival', path: '/festival' },
    { label: 'Gift Cards', path: '/gift-cards' },
    { label: 'Contact', path: '/contact' },
  ]

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <header
        role="banner"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-secondary)'
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isSmallMobile ? '0 12px' : isMobile ? '0 16px' : '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Animated Logo */}
          <AnimatedLogo onClick={() => navigate('/')} />

          {/* Desktop Nav */}
          {!isMobile && (
            <LayoutGroup>
            <nav aria-label="Main navigation" style={{ display: 'flex', gap: '32px' }}>
              {navItems.map(item => {
                const isActive = location.pathname === item.path
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    aria-label={`Navigate to ${item.label}`}
                    aria-current={isActive ? 'page' : undefined}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      letterSpacing: '0.1em',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      position: 'relative',
                      paddingBottom: '4px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = isActive ? 'var(--text-primary)' : 'var(--text-muted)'}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '1px',
                          background: 'var(--text-primary)'
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </nav>
            </LayoutGroup>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Mobile Search Icon */}
            {isMobile && !showMobileSearch && (
              <button
                onClick={() => setShowMobileSearch(true)}
                aria-label="Open search"
                style={iconBtnStyle}
              >
                <Search size={18} />
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

            {/* Favorites */}
            <button
              onClick={() => navigate('/favorites')}
              aria-label={`View favorites${favorites.length > 0 ? ` (${favorites.length} items)` : ''}`}
              style={{ ...iconBtnStyle, position: 'relative' }}
            >
              <Heart size={18} />
              {favorites.length > 0 && <Badge count={favorites.length} />}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              aria-label={`View shopping cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
              style={{ ...iconBtnStyle, position: 'relative' }}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <Badge count={cartCount} />}
            </button>

            {/* User */}
            {!isMobile && (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  onClick={() => isAuthenticated ? setShowUserMenu(!showUserMenu) : navigate('/login')}
                  aria-label={isAuthenticated ? 'User menu' : 'Sign in'}
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                  style={iconBtnStyle}
                >
                  <User size={18} />
                </button>

                <AnimatePresence>
                  {showUserMenu && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      role="menu"
                      aria-label="User account menu"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '8px',
                        width: '180px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)',
                        padding: '8px 0'
                      }}
                    >
                      <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-secondary)', marginBottom: '4px' }}>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>SIGNED IN</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{user?.email}</p>
                      </div>
                      {[
                        { label: 'My Orders', path: '/account/orders' },
                        { label: 'Admin', path: '/admin' },
                      ].map(item => (
                        <button
                          key={item.path}
                          onClick={() => { navigate(item.path); setShowUserMenu(false) }}
                          role="menuitem"
                          aria-label={`Go to ${item.label}`}
                          style={menuItemStyle}
                        >
                          {item.label}
                        </button>
                      ))}
                      <button
                        onClick={() => { logout(); setShowUserMenu(false) }}
                        role="menuitem"
                        aria-label="Sign out"
                        style={{ ...menuItemStyle, borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '4px', paddingTop: '12px' }}
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                style={iconBtnStyle}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '56px',
              left: 0,
              right: 0,
              zIndex: 55,
              background: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border-primary)',
              padding: '12px 20px'
            }}
          >
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              padding: '10px 12px'
            }}>
              <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search pieces..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onBlur={() => {
                  if (!mobileSearchQuery.trim()) {
                    setTimeout(() => setShowMobileSearch(false), 150)
                  }
                }}
                aria-label="Search products"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  letterSpacing: '0.05em'
                }}
              />
              {mobileSearchQuery && (
                <button
                  onClick={handleMobileSearch}
                  aria-label="Submit search"
                  style={{
                    padding: '4px 10px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer'
                  }}
                >
                  GO
                </button>
              )}
              <button
                onClick={() => {
                  setShowMobileSearch(false)
                  setMobileSearchQuery('')
                }}
                aria-label="Close search"
                style={{
                  padding: '4px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
              style={{ position: 'fixed', inset: 0, background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)', zIndex: 55 }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              role="dialog"
              aria-label="Mobile navigation menu"
              aria-modal="true"
              style={{
                position: 'fixed',
                right: 0,
                top: 0,
                bottom: 0,
                width: `min(280px, ${screenWidth * 0.8}px)`,
                maxWidth: '100vw',
                background: 'var(--bg-primary)',
                borderLeft: '1px solid var(--border-primary)',
                zIndex: 60,
                padding: isSmallMobile ? '72px 16px 16px' : '72px 24px 24px',
                overflowY: 'auto'
              }}
            >
              <nav aria-label="Mobile main navigation" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[{ label: 'Home', path: '/' }, ...navItems].map(item => (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setIsMenuOpen(false) }}
                    aria-label={`Navigate to ${item.label}`}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '14px',
                      letterSpacing: '0.1em',
                      color: location.pathname === item.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-primary)' }}>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => { navigate('/account'); setIsMenuOpen(false) }}
                      aria-label="Go to account"
                      style={mobileMenuItemStyle}
                    >
                      Account
                    </button>
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false) }}
                      aria-label="Sign out"
                      style={mobileMenuItemStyle}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { navigate('/login'); setIsMenuOpen(false) }}
                    aria-label="Sign in"
                    style={mobileMenuItemStyle}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '10px',
  minWidth: '40px',
  minHeight: '40px',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const menuItemStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 16px',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  fontSize: '12px',
  color: 'var(--text-secondary)',
  cursor: 'pointer'
}

const mobileMenuItemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  fontSize: '13px',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  marginBottom: '16px'
}

const Badge = ({ count }: { count: number }) => (
  <motion.span
    key={count}
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    aria-hidden="true"
    style={{
      position: 'absolute',
      top: 2,
      right: 2,
      width: '12px',
      height: '12px',
      background: 'var(--text-primary)',
      color: 'var(--bg-primary)',
      fontSize: '8px',
      fontWeight: '600',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {count}
  </motion.span>
)

export default Navigation
