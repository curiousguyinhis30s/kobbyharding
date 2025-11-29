import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, ArrowLeft, UserPlus, Eye, EyeOff, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'

type AuthMode = 'login' | 'register'

const Login = () => {
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
        addToast('success', `Welcome back, ${userData.name || 'there'}!`)
        navigate('/account')
      } else {
        setError('Invalid email or password')
        addToast('error', 'Invalid email or password')
      }
    } catch {
      setError('An error occurred during login')
      addToast('error', 'An error occurred. Please try again.')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
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
        addToast('success', 'Account created! Welcome to Kharding Classics.')
        navigate('/account')
      } else {
        setError(result.message)
        addToast('error', result.message)
      }
    } catch {
      setError('An error occurred during registration')
      addToast('error', 'An error occurred. Please try again.')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 14px 14px 44px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontSize: '16px',
              fontWeight: '200',
              letterSpacing: '0.3em',
              color: '#fff'
            }}>
              KHARDING
            </span>
          </Link>
          <p style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.2em',
            marginTop: '16px'
          }}>
            {mode === 'login' ? 'WELCOME BACK' : 'JOIN US'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          {mode === 'register' && (
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <User size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.4)'
              }} />
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <Mail size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.4)'
            }} />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: mode === 'register' ? '16px' : '20px', position: 'relative' }}>
            <Lock size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.4)'
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={mode === 'register' ? 'Password (min 8 characters)' : 'Password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ ...inputStyle, paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              {showPassword ? (
                <EyeOff size={18} color="rgba(255, 255, 255, 0.4)" />
              ) : (
                <Eye size={18} color="rgba(255, 255, 255, 0.4)" />
              )}
            </button>
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.4)'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                style={inputStyle}
              />
            </div>
          )}

          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              fontSize: '13px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: '#fff',
              color: '#000',
              border: 'none',
              fontSize: '12px',
              fontWeight: '500',
              letterSpacing: '0.15em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity 0.2s'
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
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '12px' }}>
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
              setFormData({ name: '', email: '', password: '', confirmPassword: '' })
            }}
            style={{
              padding: '12px 28px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '11px',
              letterSpacing: '0.15em',
              cursor: 'pointer'
            }}
          >
            {mode === 'login' ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </div>

        {/* Back */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              color: 'rgba(255, 255, 255, 0.4)',
              background: 'transparent',
              border: 'none',
              fontSize: '11px',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={14} />
            GO BACK
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
