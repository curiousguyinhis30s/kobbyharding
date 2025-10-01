import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, X, Send, Music, Pause, Play, 
  Instagram, Twitter, Globe, ChevronUp, Sparkles,
  Heart, ShoppingBag, Volume2, VolumeX, Mic
} from 'lucide-react'
import useStore from '../stores/useStore'
import { useNavigate } from 'react-router-dom'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

// Koby's curated Afrobeat playlist
const kobyPlaylist = [
  { title: "Essence", artist: "Wizkid ft. Tems", url: "/music/essence.mp3" },
  { title: "Last Last", artist: "Burna Boy", url: "/music/lastlast.mp3" },
  { title: "Peru", artist: "Fireboy DML", url: "/music/peru.mp3" },
  { title: "Sungba", artist: "Asake", url: "/music/sungba.mp3" },
  { title: "Calm Down", artist: "Rema", url: "/music/calmdown.mp3" }
]

const MinimalAIChat = () => {
  const navigate = useNavigate()
  const { pieces, cartItems } = useStore()
  const audioRef = useRef<HTMLAudioElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [showVolume, setShowVolume] = useState(false)
  
  // Quick action buttons
  const quickActions = [
    { icon: ShoppingBag, label: 'Shop', action: () => navigate('/collection') },
    { icon: Heart, label: 'Festival', action: () => navigate('/festival-pickup') },
    { icon: Instagram, label: 'Instagram', action: () => window.open('https://www.instagram.com/hardingkobby/?hl=en', '_blank') },
    { icon: Music, label: 'Vibes', action: () => toggleMusic() }
  ]
  
  const toggleMusic = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % kobyPlaylist.length)
  }
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }
  
  const processMessage = async (text: string) => {
    const lowerText = text.toLowerCase()
    
    // Quick responses based on keywords
    if (lowerText.includes('size')) {
      return "I recommend checking our size guide! Most pieces run true to vintage sizing (slightly smaller than modern). What's your usual size?"
    }
    if (lowerText.includes('kizomba') || lowerText.includes('urban') || lowerText.includes('tarraxo')) {
      return "🎵 Koby loves Kizomba festivals! We'll be at Bangkok Kizomba (March), Singapore Urban Kiz (April), Bali Tarraxo Fest (May), Tokyo Kizomba Week (June), Seoul Urban Fest (July), and Hong Kong Kiz (August). Perfect pieces for dancing all night!"
    }
    if (lowerText.includes('festival')) {
      return "🎪 We specialize in Kizomba & Urban Kizomba festivals across Asia! Bangkok (March), Singapore (April), Bali (May), Tokyo (June), Seoul (July), Hong Kong (August). Which one are you attending?"
    }
    if (lowerText.includes('koby')) {
      return "Koby is currently in Bangkok creating new pieces and preparing for the Kizomba festival season! Follow @hardingkobby on Instagram for updates. 🌍"
    }
    if (lowerText.includes('price') || lowerText.includes('cost')) {
      return `Our handcrafted pieces range from $${Math.min(...pieces.map(p => p.price))} to $${Math.max(...pieces.map(p => p.price))}. Each one is unique and worth the investment!`
    }
    if (lowerText.includes('dance') || lowerText.includes('dancing')) {
      return "Our pieces are designed for movement! Perfect for Kizomba, Urban Kiz, and Tarraxo dancing. The fabrics breathe and flow with your body. 💃"
    }
    
    return "Let me help you find your perfect piece! What vibe are you looking for today?"
  }
  
  const handleSend = async () => {
    if (!inputValue.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    
    // Get AI response
    setTimeout(async () => {
      const response = await processMessage(inputValue)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 800)
  }
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  useEffect(() => {
    // Auto-play next track when current ends
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', nextTrack)
      return () => audioRef.current?.removeEventListener('ended', nextTrack)
    }
  }, [currentTrack])
  
  return (
    <>
      {/* Hidden audio element */}
      <audio 
        ref={audioRef}
        src={kobyPlaylist[currentTrack].url}
        onError={() => console.log('Audio not available - using placeholder')}
      />
      
      {/* Minimal floating widget */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 50
            }}
          >
            {/* Main button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${'#000000'}, ${'#333333'})`,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)'
              }}
            >
              <MessageCircle style={{ color: 'white', width: '24px', height: '24px' }} />
            </motion.button>
            
            {/* Quick action buttons (hidden until hover) */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: 'absolute',
                bottom: '70px',
                right: '0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {quickActions.map((action, idx) => (
                <motion.button
                  key={idx}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.action}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${'#e0e0e0'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={action.label}
                >
                  <action.icon style={{ color: '#000000', width: '18px', height: '18px' }} />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Compact chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: isExpanded ? '380px' : '320px',
              height: isExpanded ? '500px' : '400px',
              background: '#ffffff',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: `1px solid ${'#e0e0e0'}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              zIndex: 100,
              transition: 'all 0.3s ease'
            }}
          >
            {/* Compact header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${'#e0e0e0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles style={{ color: '#000000', width: '18px', height: '18px' }} />
                <span style={{ color: '#000000', fontSize: '14px', fontWeight: '600' }}>
                  Koby's Assistant
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {/* Music controls */}
                <button
                  onClick={toggleMusic}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#666666',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={isPlaying ? kobyPlaylist[currentTrack].title : 'Play Koby\'s Playlist'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                
                {/* Volume control */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowVolume(!showVolume)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#666666'
                    }}
                  >
                    {volume > 0 ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                  
                  {showVolume && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: '#ffffff',
                      border: `1px solid ${'#e0e0e0'}`,
                      borderRadius: '8px',
                      padding: '8px',
                      marginTop: '4px'
                    }}>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{
                          width: '80px',
                          height: '4px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Expand/collapse */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#666666'
                  }}
                >
                  <ChevronUp 
                    size={16} 
                    style={{ 
                      transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                      transition: 'transform 0.3s'
                    }}
                  />
                </button>
                
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#666666'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Currently playing (if music is on) */}
            {isPlaying && (
              <div style={{
                padding: '8px 16px',
                background: `linear-gradient(90deg, ${'#000000'}20, transparent)`,
                borderBottom: `1px solid ${'#e0e0e0'}`,
                fontSize: '12px',
                color: '#666666',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Music size={12} />
                <span>{kobyPlaylist[currentTrack].title} - {kobyPlaylist[currentTrack].artist}</span>
              </div>
            )}
            
            {/* Messages area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666666', fontSize: '13px', marginTop: '20px' }}>
                  <p>👋 Ask me anything about Koby's pieces!</p>
                  <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {['Size guide', 'Festival dates', 'About Koby', 'Best sellers'].map(q => (
                      <button
                        key={q}
                        onClick={() => setInputValue(q)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          background: '#ffffff',
                          border: `1px solid ${'#e0e0e0'}`,
                          color: '#000000',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%'
                    }}
                  >
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '12px',
                      background: message.sender === 'user' 
                        ? `linear-gradient(135deg, ${'#000000'}, ${'#333333'})`
                        : '#ffffff',
                      color: message.sender === 'user' ? 'white' : '#000000',
                      fontSize: '13px'
                    }}>
                      {message.text}
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Compact input area */}
            <div style={{
              padding: '12px',
              borderTop: `1px solid ${'#e0e0e0'}`,
              display: 'flex',
              gap: '8px',
              background: '#ffffff'
            }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '20px',
                  background: '#ffffff',
                  border: `1px solid ${'#e0e0e0'}`,
                  color: '#000000',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!inputValue.trim()}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  background: inputValue.trim() 
                    ? `linear-gradient(135deg, ${'#000000'}, ${'#333333'})`
                    : '#ffffff',
                  border: 'none',
                  cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} style={{ color: inputValue.trim() ? 'white' : '#666666' }} />
              </motion.button>
            </div>
            
            {/* Social media bar */}
            <div style={{
              padding: '8px',
              borderTop: `1px solid ${'#e0e0e0'}`,
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              background: '#ffffff'
            }}>
              <a 
                href="https://www.instagram.com/hardingkobby/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#666666' }}
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://twitter.com/hardingkobby" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#666666' }}
              >
                <Twitter size={16} />
              </a>
              <a 
                href="https://kobysthreads.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#666666' }}
              >
                <Globe size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MinimalAIChat