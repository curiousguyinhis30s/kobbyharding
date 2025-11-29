import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const navigate = useNavigate()

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 0',
      fontSize: '11px',
      letterSpacing: '0.1em',
      color: 'rgba(255, 255, 255, 0.6)'
    }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {item.path && !isLast ? (
              <button
                onClick={() => item.path && navigate(item.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                {item.label}
              </button>
            ) : (
              <span
                style={{
                  color: isLast ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                  fontWeight: isLast ? '300' : '200'
                }}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight style={{ width: '12px', height: '12px', opacity: 0.4 }} />
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
