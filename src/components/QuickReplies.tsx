import { memo } from 'react'
import { ExternalLink } from 'lucide-react'

interface QuickRepliesProps {
  starters: Array<{
    id: string
    text: string
    enabled: boolean
  }>
  onStarterClick: (text: string) => void
}

const QuickReplies = memo(({ starters, onStarterClick }: QuickRepliesProps) => {
  if (starters.length === 0) return null

  return (
    <div style={{
      marginTop: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }}>
      {starters.map(starter => (
        <button
          key={starter.id}
          onClick={() => onStarterClick(starter.text)}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '11px',
            letterSpacing: '0.02em',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
          }}
        >
          <ExternalLink size={12} />
          {starter.text}
        </button>
      ))}
    </div>
  )
})

QuickReplies.displayName = 'QuickReplies'

export default QuickReplies
