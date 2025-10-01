import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Info } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCredentials, setShowCredentials] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        // Get the user data after login
        const userData = JSON.parse(localStorage.getItem('koby_user') || '{}')
        addToast('success', `Welcome back, ${userData.name || 'User'}!`)
        // Redirect based on user role
        if (userData.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/account')
        }
      } else {
        setError('Invalid email or password')
        addToast('error', 'Invalid email or password')
      }
    } catch (error) {
      setError('An error occurred during login')
      addToast('error', 'An error occurred during login. Please try again.')
      console.error('Login error:', error)
    }

    setLoading(false)
  }

  const testCredentials = [
    { email: 'admin@kobysthreads.com', password: 'admin123', role: 'Admin' },
    { email: 'john@example.com', password: 'user123', role: 'Normal User' },
    { email: 'sarah@example.com', password: 'user456', role: 'Normal User' }
  ]

  const handleQuickLogin = (email: string, password: string) => {
    setFormData({ email, password })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#000',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px'
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px',
            fontWeight: '300',
            color: '#fff',
            background: 'rgba(255, 255, 255, 0.05)'
          }}>
            K
          </div>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '200',
            letterSpacing: '0.3em',
            color: '#fff',
            margin: '0 0 8px 0'
          }}>
            KOBBY HARDING
          </h1>
          <p style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.15em'
          }}>
            SIGN IN
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '8px'
            }}>
              EMAIL / USERNAME
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'border-color 0.3s'
            }}>
              <User size={16} style={{
                position: 'absolute',
                left: '12px',
                color: 'rgba(255, 255, 255, 0.4)'
              }} />
              <input
                type="text"
                placeholder="Try: admin@kobysthreads.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  const parent = e.currentTarget.parentElement
                  if (parent) parent.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                }}
                onBlur={(e) => {
                  const parent = e.currentTarget.parentElement
                  if (parent) parent.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '8px'
            }}>
              PASSWORD
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'border-color 0.3s'
            }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '12px',
                color: 'rgba(255, 255, 255, 0.4)'
              }} />
              <input
                type="password"
                placeholder="Try: admin123"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  const parent = e.currentTarget.parentElement
                  if (parent) parent.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                }}
                onBlur={(e) => {
                  const parent = e.currentTarget.parentElement
                  if (parent) parent.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '10px',
              marginBottom: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '12px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#fff',
              color: '#000',
              border: 'none',
              fontSize: '12px',
              fontWeight: '500',
              letterSpacing: '0.15em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#fff'
              }
            }}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        {/* Test Credentials */}
        {showCredentials && (
          <div style={{
            marginTop: '32px',
            padding: '16px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '10px',
              letterSpacing: '0.15em'
            }}>
              <Info size={12} />
              TEST ACCOUNTS
            </div>
            <div style={{ fontSize: '12px' }}>
              {testCredentials.map((cred, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickLogin(cred.email, cred.password)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: index < testCredentials.length - 1 ? '8px' : '0',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '11px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div>
                    <div style={{ marginBottom: '4px', color: '#fff' }}>{cred.email}</div>
                    <div style={{ opacity: 0.5, fontSize: '10px' }}>Password: {cred.password}</div>
                  </div>
                  <span style={{
                    padding: '2px 8px',
                    background: cred.role === 'Admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    border: `1px solid ${cred.role === 'Admin' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    color: cred.role === 'Admin' ? '#ef4444' : '#60a5fa'
                  }}>
                    {cred.role.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Don't have an account */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.05em'
        }}>
          Don't have an account?
        </div>

        {/* Back to Site */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              color: 'rgba(255, 255, 255, 0.4)',
              background: 'transparent',
              border: 'none',
              fontSize: '11px',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
          >
            ← BACK TO SITE
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin