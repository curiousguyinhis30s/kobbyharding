import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Package,
  Settings, Palette, Calendar, BarChart2, LogOut, FileText, MessageSquare, CreditCard, Users, Bell
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const AdminNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

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
  
  return (
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
          onClick={() => navigate('/admin')}
          style={{
            fontSize: '18px',
            fontWeight: '200',
            letterSpacing: '0.2em',
            cursor: 'pointer',
            color: '#000'
          }}
        >
          KOBBY HARDING ADMIN
        </div>
        
        {/* Navigation Items */}
        <div style={{
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
                onClick={() => navigate(item.path)}
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
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminNavigation