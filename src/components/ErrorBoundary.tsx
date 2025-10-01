import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: '#fff',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '24px',
            fontWeight: '300'
          }}>
            !
          </div>

          <h1 style={{
            fontSize: '18px',
            fontWeight: '200',
            letterSpacing: '0.3em',
            marginBottom: '16px'
          }}>
            SOMETHING WENT WRONG
          </h1>

          <p style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '32px',
            maxWidth: '400px',
            lineHeight: '1.6'
          }}>
            We apologize for the inconvenience. The application has encountered an error.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '24px',
              borderRadius: '4px',
              fontSize: '11px',
              textAlign: 'left',
              maxWidth: '600px',
              fontFamily: 'monospace'
            }}>
              <div style={{ color: '#ef4444', marginBottom: '8px' }}>
                {this.state.error.name}: {this.state.error.message}
              </div>
              <pre style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.5)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error.stack}
              </pre>
            </div>
          )}

          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 32px',
              background: '#fff',
              color: '#000',
              border: 'none',
              fontSize: '11px',
              fontWeight: '500',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            GO TO HOME
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary