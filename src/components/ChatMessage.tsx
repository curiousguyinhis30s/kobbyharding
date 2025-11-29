import { memo } from 'react'
import { motion } from 'framer-motion'
import { Mail, Instagram } from 'lucide-react'

interface ChatMessageProps {
  message: {
    id: string
    text: string
    sender: 'user' | 'assistant'
    timestamp: Date
    confidence?: number
    matchType?: 'faq' | 'product' | 'rule' | 'fallback'
  }
}

const ChatMessage = memo(({ message }: ChatMessageProps) => {
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
        maxWidth: '85%'
      }}
    >
      <div style={{
        padding: '10px 14px',
        background: message.sender === 'user'
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${message.sender === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
        color: message.sender === 'user' ? '#fff' : 'rgba(255,255,255,0.85)',
        fontSize: '12px',
        lineHeight: '1.6',
        letterSpacing: '0.02em'
      }}>
        {message.text}
      </div>
      {message.sender === 'assistant' && message.matchType === 'fallback' && (
        <div style={{
          marginTop: '6px',
          display: 'flex',
          gap: '8px'
        }}>
          <a
            href="mailto:contact@khardingclassics.com"
            style={{
              fontSize: '9px',
              color: 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none'
            }}
          >
            <Mail size={10} /> Email us
          </a>
          <a
            href="https://www.instagram.com/Khardingclassics"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '9px',
              color: 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none'
            }}
          >
            <Instagram size={10} /> DM us
          </a>
        </div>
      )}
    </motion.div>
  )
})

ChatMessage.displayName = 'ChatMessage'

export default ChatMessage
