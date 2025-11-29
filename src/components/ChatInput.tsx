import { memo } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  inputValue: string
  inputRef: React.RefObject<HTMLInputElement | null>
  isTyping: boolean
  onInputChange: (value: string) => void
  onSend: () => void
}

const ChatInput = memo(({ inputValue, inputRef, isTyping, onInputChange, onSend }: ChatInputProps) => {
  return (
    <div style={{
      padding: '12px',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      gap: '8px'
    }}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
        placeholder="Ask about shipping, sizing, festivals..."
        style={{
          flex: 1,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '0',
          color: '#fff',
          fontSize: '12px',
          outline: 'none',
          letterSpacing: '0.02em'
        }}
      />
      <button
        onClick={onSend}
        disabled={!inputValue.trim() || isTyping}
        style={{
          padding: '10px 14px',
          background: inputValue.trim() && !isTyping ? '#fff' : 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '0',
          cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s'
        }}
      >
        <Send size={16} color={inputValue.trim() && !isTyping ? '#000' : 'rgba(255,255,255,0.3)'} />
      </button>
    </div>
  )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput
