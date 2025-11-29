import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Mail, Info, ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'

type AuthMode = 'login' | 'register'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const { addToast } = useToast()
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        const userData = JSON.parse(localStorage.getItem('koby_user') || '{}')
        addToast('success', `Welcome back, ${userData.name || 'User'}!`)
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const result = await register(formData.email, formData.password, formData.name)

      if (result.success) {
        addToast('success', 'Account created successfully! Welcome to Khardingclassics.')
        navigate('/account')
      } else {
        setError(result.message)
        addToast('error', result.message)
      }
    } catch (error) {
      setError('An error occurred during registration')
      addToast('error', 'An error occurred. Please try again.')
      console.error('Registration error:', error)
    }

    setLoading(false)
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
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
            KH
          </div>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '200',
            letterSpacing: '0.3em',
            color: '#fff',
            margin: '0 0 8px 0'
          }}>
            KHARDINGCLASSICS
          </h1>
          <p style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.15em'
          }}>
            {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          {/* Name Field (Register only) */}
          {mode === 'register' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '8px'
              }}>
                FULL NAME
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
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          )}

          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '8px'
            }}>
              EMAIL
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'border-color 0.3s'
            }}>
              <Mail size={16} style={{
                position: 'absolute',
                left: '12px',
                color: 'rgba(255, 255, 255, 0.4)'
              }} />
              <input
                type="email"
                placeholder="Enter your email"
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
          <div style={{ marginBottom: mode === 'register' ? '20px' : '24px' }}>
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
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'register' ? 'Min 6 characters' : 'Enter your password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 40px',
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? (
                  <EyeOff size={16} color="rgba(255, 255, 255, 0.4)" />
                ) : (
                  <Eye size={16} color="rgba(255, 255, 255, 0.4)" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Register only) */}
          {mode === 'register' && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '8px'
              }}>
                CONFIRM PASSWORD
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
          )}

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
              opacity: loading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
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
            {mode === 'register' && <UserPlus size={16} />}
            {loading
              ? (mode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...')
              : (mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')
            }
          </button>
        </form>

        {/* Switch Mode */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '12px'
          }}>
            {mode === 'login'
              ? "Don't have an account?"
              : "Already have an account?"
            }
          </p>
          <button
            onClick={switchMode}
            style={{
              padding: '10px 24px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '11px',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {mode === 'login' ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
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
              transition: 'color 0.3s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
          >
            <ArrowLeft size={14} />
            BACK TO SITE
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
