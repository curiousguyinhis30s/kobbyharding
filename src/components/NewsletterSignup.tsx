import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { useNewsletterStore } from '../stores/useNewsletterStore'

interface NewsletterSignupProps {
  inline?: boolean
  isMobile?: boolean
}

const NewsletterSignup = ({ inline = false, isMobile = false }: NewsletterSignupProps) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const { subscribe } = useNewsletterStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = subscribe(email)

    if (result.success) {
      setStatus('success')
      setMessage(result.message)
      setEmail('')
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    } else {
      setStatus('error')
      setMessage(result.message)
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 4000)
    }
  }

  if (inline) {
    return (
      <div>
        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'success'}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'transparent',
              border: status === 'error'
                ? '1px solid rgba(239, 68, 68, 0.5)'
                : status === 'success'
                ? '1px solid rgba(16, 185, 129, 0.5)'
                : '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: '11px',
              letterSpacing: '0.05em',
              marginBottom: '8px',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => {
              if (status === 'idle') {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              }
            }}
            onBlur={(e) => {
              if (status === 'idle') {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }
            }}
          />
          <button
            type="submit"
            disabled={status === 'success'}
            style={{
              width: '100%',
              padding: '10px',
              background: status === 'success'
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(255,255,255,0.1)',
              border: status === 'success'
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: '10px',
              letterSpacing: '0.15em',
              cursor: status === 'success' ? 'default' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (status !== 'success') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (status !== 'success') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }
            }}
          >
            {status === 'success' ? (
              <>
                <CheckCircle style={{ width: '14px', height: '14px' }} />
                SUBSCRIBED
              </>
            ) : (
              'SUBSCRIBE'
            )}
          </button>
        </form>
        {message && (
          <p style={{
            fontSize: '10px',
            marginTop: '8px',
            color: status === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
            letterSpacing: '0.05em',
          }}>
            {message}
          </p>
        )}
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'stretch',
        }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'success'}
            style={{
              flex: 1,
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: status === 'error'
                ? '1px solid rgba(239, 68, 68, 0.5)'
                : status === 'success'
                ? '1px solid rgba(16, 185, 129, 0.5)'
                : '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '12px',
              letterSpacing: '0.05em',
              outline: 'none',
              transition: 'all 0.3s',
            }}
            onFocus={(e) => {
              if (status === 'idle') {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              }
            }}
            onBlur={(e) => {
              if (status === 'idle') {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }
            }}
          />
          <button
            type="submit"
            disabled={status === 'success'}
            style={{
              padding: '14px 32px',
              background: status === 'success'
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(255,255,255,0.1)',
              border: status === 'success'
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: '11px',
              letterSpacing: '0.15em',
              cursor: status === 'success' ? 'default' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (status !== 'success') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (status !== 'success') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }
            }}
          >
            {status === 'success' ? (
              <>
                <CheckCircle style={{ width: '16px', height: '16px' }} />
                SUBSCRIBED
              </>
            ) : (
              <>
                <Mail style={{ width: '16px', height: '16px' }} />
                SUBSCRIBE
              </>
            )}
          </button>
        </div>
        {message && (
          <p style={{
            fontSize: '11px',
            marginTop: '12px',
            color: status === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
            letterSpacing: '0.05em',
          }}>
            {message}
          </p>
        )}
      </form>
    </div>
  )
}

export default NewsletterSignup
