import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useChatbotStore } from '../stores/useChatbotStore'
import useStore from '../stores/useStore'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import QuickReplies from './QuickReplies'
import TypingIndicator from './TypingIndicator'
import { sanitizeText } from '../utils/sanitize'

interface DisplayMessage {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  confidence?: number
  matchType?: 'faq' | 'product' | 'rule' | 'fallback'
}

const MinimalAIChat = () => {
  const navigate = useNavigate()
  const { pieces } = useStore()
  const {
    faqs, conversationStarters, settings,
    searchFaqs, addMessage, currentSession, startSession, initializeFuse
  } = useChatbotStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Initialize Fuse.js for product search
  const productFuse = useRef<Fuse<typeof pieces[0]> | null>(null)

  useEffect(() => {
    initializeFuse()
    productFuse.current = new Fuse(pieces, {
      keys: [
        { name: 'name', weight: 0.3 },
        { name: 'story', weight: 0.2 },
        { name: 'vibe', weight: 0.2 },
        { name: 'fabricOrigin', weight: 0.2 },
        { name: 'denimType', weight: 0.1 }
      ],
      threshold: 0.4,
      includeScore: true
    })
  }, [pieces, initializeFuse])

  // Show greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startSession()
      setTimeout(() => {
        const greetingMessage: DisplayMessage = {
          id: `greeting-${Date.now()}`,
          text: settings.greeting,
          sender: 'assistant',
          timestamp: new Date(),
          matchType: 'rule'
        }
        setMessages([greetingMessage])
        addMessage('assistant', settings.greeting, { type: 'rule', confidence: 1 })
      }, 300)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Intelligent response engine - memoized
  const processMessage = useCallback(async (text: string): Promise<{ response: string; confidence: number; type: 'faq' | 'product' | 'rule' | 'fallback' }> => {
    const lowerText = text.toLowerCase().trim()

    // 1. Check for navigation intents (rule-based)
    if (lowerText.includes('shop') || lowerText.includes('browse') || lowerText.includes('collection')) {
      return {
        response: "I'd love to help you explore our collection! Click here to browse all pieces, or tell me what style you're looking for.",
        confidence: 0.95,
        type: 'rule'
      }
    }

    if (lowerText.includes('cart') || lowerText.includes('checkout')) {
      return {
        response: "Ready to complete your order? Your cart is waiting! Let me know if you need any help with the checkout process.",
        confidence: 0.95,
        type: 'rule'
      }
    }

    if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('speak') || lowerText.includes('human') || lowerText.includes('person')) {
      return {
        response: settings.handoffMessage,
        confidence: 1,
        type: 'rule'
      }
    }

    // 2. Search FAQs using Fuse.js
    const faqResults = searchFaqs(text)
    if (faqResults.length > 0 && faqResults[0].score > 0.6) {
      const bestMatch = faqResults[0]
      return {
        response: bestMatch.faq.answer,
        confidence: bestMatch.score,
        type: 'faq'
      }
    }

    // 3. Check for product-related queries
    const productKeywords = ['piece', 'outfit', 'wear', 'style', 'denim', 'fabric', 'jacket', 'shirt', 'pants', 'look']
    const isProductQuery = productKeywords.some(kw => lowerText.includes(kw))

    if (isProductQuery && productFuse.current) {
      const productResults = productFuse.current.search(text)
      if (productResults.length > 0) {
        const topProducts = productResults.slice(0, 3)
        const productNames = topProducts.map(r => r.item.name).join(', ')
        const priceRange = `$${Math.min(...topProducts.map(r => r.item.price))} - $${Math.max(...topProducts.map(r => r.item.price))}`

        let response = `Based on what you're looking for, I'd recommend checking out: ${productNames}. `

        if (settings.includeProductPrices) {
          response += `Price range: ${priceRange}. `
        }

        response += "Would you like me to tell you more about any of these?"

        return {
          response,
          confidence: 1 - (productResults[0].score || 0),
          type: 'product'
        }
      }
    }

    // 4. Check for price queries
    if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('expensive') || lowerText.includes('cheap') || lowerText.includes('affordable')) {
      const minPrice = Math.min(...pieces.map(p => p.price))
      const maxPrice = Math.max(...pieces.map(p => p.price))
      const avgPrice = Math.round(pieces.reduce((sum, p) => sum + p.price, 0) / pieces.length)

      return {
        response: `Our handcrafted pieces range from $${minPrice} to $${maxPrice}, with an average around $${avgPrice}. Each piece is unique - the African fabrics alone travel thousands of miles to reach you. Would you like to see pieces in a specific price range?`,
        confidence: 0.9,
        type: 'rule'
      }
    }

    // 5. Check for availability/stock queries
    if (lowerText.includes('available') || lowerText.includes('in stock') || lowerText.includes('sold out')) {
      const availableCount = pieces.filter(p => p.available).length
      return {
        response: `We currently have ${availableCount} pieces available in our collection. Many are one-of-a-kind, so once they're gone, they're gone! Browse the collection to see what's currently available.`,
        confidence: 0.85,
        type: 'rule'
      }
    }

    // 6. Lower threshold FAQ search for partial matches
    if (faqResults.length > 0 && faqResults[0].score > 0.4) {
      const bestMatch = faqResults[0]
      return {
        response: bestMatch.faq.answer,
        confidence: bestMatch.score,
        type: 'faq'
      }
    }

    // 7. Fallback response
    return {
      response: settings.fallbackMessage,
      confidence: 0,
      type: 'fallback'
    }
  }, [searchFaqs, pieces, productFuse, settings])

  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return

    // Sanitize user input to prevent XSS
    const sanitizedInput = sanitizeText(inputValue.trim())

    const userMessage: DisplayMessage = {
      id: `user-${Date.now()}`,
      text: sanitizedInput,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    addMessage('user', sanitizedInput)
    setInputValue('')
    setIsTyping(true)

    // Get intelligent response (using sanitized input)
    const { response, confidence, type } = await processMessage(sanitizedInput)

    // Add natural delay based on settings
    setTimeout(() => {
      const assistantMessage: DisplayMessage = {
        id: `assistant-${Date.now()}`,
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
        confidence,
        matchType: type
      }
      setMessages(prev => [...prev, assistantMessage])
      addMessage('assistant', response, { type, confidence })
      setIsTyping(false)
    }, settings.responseDelay)
  }, [inputValue, addMessage, processMessage, settings.responseDelay])

  const handleStarterClick = useCallback((text: string) => {
    setInputValue(text)
    setTimeout(() => handleSend(), 100)
  }, [handleSend])

  const enabledStarters = useMemo(() =>
    conversationStarters.filter(s => s.enabled).slice(0, 4),
    [conversationStarters]
  )

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '52px',
              height: '52px',
              background: '#000',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}
          >
            <Sparkles size={20} color="#fff" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '340px',
              height: '480px',
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 1000,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '400',
                  letterSpacing: '0.15em',
                  color: '#fff'
                }}>
                  KHARDING ASSISTANT
                </div>
                <div style={{
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '2px',
                  letterSpacing: '0.05em'
                }}>
                  Trained on our collection & policies
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {/* Typing indicator */}
              {isTyping && <TypingIndicator />}

              {/* Conversation starters (show when no messages yet) */}
              {messages.length <= 1 && enabledStarters.length > 0 && (
                <QuickReplies
                  starters={enabledStarters}
                  onStarterClick={handleStarterClick}
                />
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <ChatInput
              inputValue={inputValue}
              inputRef={inputRef}
              isTyping={isTyping}
              onInputChange={setInputValue}
              onSend={handleSend}
            />

            {/* Footer */}
            <div style={{
              padding: '8px 12px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.4)'
            }}>
              <span>{faqs.filter(f => f.enabled).length} FAQs loaded</span>
              <span>|</span>
              <button
                onClick={() => navigate('/collection')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontSize: '9px',
                  letterSpacing: '0.05em'
                }}
              >
                BROWSE COLLECTION
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MinimalAIChat
