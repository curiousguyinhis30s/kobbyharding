import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
  redirectTo?: string
}

const ProtectedRoute = ({
  children,
  adminOnly = false,
  redirectTo = '/admin/login'
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth()
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Security logging for audit trail
    if (!isAuthenticated) {
      console.warn('[Security] Unauthorized access attempt to protected route')
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
    }
  }, [isAuthenticated])

  // Check authentication
  if (!isAuthenticated) {
    return (
      <>
        {showWarning && (
          <div style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            padding: '16px 32px',
            zIndex: 1000,
            fontSize: '13px',
            letterSpacing: '0.1em',
            color: '#ff6b6b'
          }}>
            Authentication required to access this page
          </div>
        )}
        <Navigate to={redirectTo} replace />
      </>
    )
  }

  // Check admin permissions
  if (adminOnly && user?.role !== 'admin') {
    console.warn('[Security] Non-admin user attempted to access admin route')
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '100',
          letterSpacing: '0.2em'
        }}>
          ACCESS DENIED
        </h1>
        <p style={{
          fontSize: '12px',
          opacity: 0.5,
          letterSpacing: '0.1em'
        }}>
          Admin privileges required
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '12px 32px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#fff',
            fontSize: '11px',
            letterSpacing: '0.2em',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          GO BACK
        </button>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute