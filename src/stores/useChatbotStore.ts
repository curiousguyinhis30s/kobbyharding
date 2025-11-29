import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Fuse from 'fuse.js'

// Types
export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'shipping' | 'products' | 'sizing' | 'returns' | 'festival' | 'general'
  keywords: string[]
  priority: number
  enabled: boolean
}

export interface ChatbotSettings {
  greeting: string
  fallbackMessage: string
  handoffMessage: string
  personality: 'professional' | 'friendly' | 'minimal'
  includeProductPrices: boolean
  includeProductAvailability: boolean
  includeShippingInfo: boolean
  includeFestivalInfo: boolean
  responseDelay: number // ms for natural feel
}

export interface ConversationStarter {
  id: string
  text: string
  category: string
  enabled: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  matched?: {
    type: 'faq' | 'product' | 'rule' | 'fallback'
    confidence: number
    sourceId?: string
  }
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  startedAt: Date
  lastActivity: Date
}

interface ChatbotStore {
  // Knowledge Base
  faqs: FAQ[]
  conversationStarters: ConversationStarter[]

  // Settings
  settings: ChatbotSettings

  // Active Session
  currentSession: ChatSession | null
  sessionHistory: ChatSession[]

  // Fuse.js instances (not persisted)
  faqFuse: Fuse<FAQ> | null

  // FAQ Management
  addFaq: (faq: Omit<FAQ, 'id'>) => void
  updateFaq: (id: string, updates: Partial<FAQ>) => void
  deleteFaq: (id: string) => void
  toggleFaq: (id: string) => void

  // Conversation Starters
  addStarter: (starter: Omit<ConversationStarter, 'id'>) => void
  updateStarter: (id: string, updates: Partial<ConversationStarter>) => void
  deleteStarter: (id: string) => void

  // Settings
  updateSettings: (updates: Partial<ChatbotSettings>) => void

  // Session Management
  startSession: () => void
  endSession: () => void
  addMessage: (role: 'user' | 'assistant', content: string, matched?: ChatMessage['matched']) => void
  clearSession: () => void

  // Search Engine
  initializeFuse: () => void
  searchFaqs: (query: string) => { faq: FAQ; score: number }[]

  // Import/Export
  exportKnowledgeBase: () => string
  importKnowledgeBase: (data: string) => boolean
}

// Default FAQs for K Harding Classics
const defaultFaqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship worldwide. Shipping to Asia (where most dance festivals are) typically takes 5-7 business days. We offer free shipping on orders over $300.',
    category: 'shipping',
    keywords: ['ship', 'shipping', 'international', 'worldwide', 'deliver', 'delivery'],
    priority: 1,
    enabled: true
  },
  {
    id: 'faq-2',
    question: 'What sizes do you carry?',
    answer: 'We carry sizes XS to XXL. Each piece is designed with dancers in mind - slightly relaxed fit for movement. Check our size guide on each product page for exact measurements.',
    category: 'sizing',
    keywords: ['size', 'sizing', 'fit', 'measurement', 'xs', 's', 'm', 'l', 'xl', 'xxl'],
    priority: 1,
    enabled: true
  },
  {
    id: 'faq-3',
    question: 'Can I try on pieces at festivals?',
    answer: 'Absolutely! Koby travels to major Kizomba festivals across Asia. Book a try-on session through our Festival page - we bring pieces to Bangkok, Singapore, Bali, Tokyo, Seoul, and Hong Kong events.',
    category: 'festival',
    keywords: ['try', 'try-on', 'festival', 'event', 'kizomba', 'bachata', 'meet'],
    priority: 1,
    enabled: true
  },
  {
    id: 'faq-4',
    question: 'What is the return policy?',
    answer: 'We accept returns within 14 days of delivery for unworn items with original tags. Festival try-on pieces have a special 7-day return window. Contact us to initiate a return.',
    category: 'returns',
    keywords: ['return', 'refund', 'exchange', 'policy', 'money back'],
    priority: 1,
    enabled: true
  },
  {
    id: 'faq-5',
    question: 'Where do the fabrics come from?',
    answer: 'Our fabrics are sourced directly from artisan communities across Africa - Kente from Ghana, Adire from Nigeria, Bogolan from Mali, and Shweshwe from South Africa. Each piece tells a story of its origin.',
    category: 'products',
    keywords: ['fabric', 'material', 'african', 'kente', 'adire', 'bogolan', 'origin', 'source'],
    priority: 1,
    enabled: true
  },
  {
    id: 'faq-6',
    question: 'How do I care for my piece?',
    answer: 'Hand wash cold or machine wash on gentle cycle. Hang dry to preserve the African fabric patterns. Iron on medium heat, avoiding direct contact with printed areas. The denim will soften beautifully with wear.',
    category: 'products',
    keywords: ['wash', 'care', 'clean', 'iron', 'maintain', 'laundry'],
    priority: 2,
    enabled: true
  },
  {
    id: 'faq-7',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. All transactions are secure and encrypted.',
    category: 'general',
    keywords: ['payment', 'pay', 'credit card', 'paypal', 'apple pay', 'checkout'],
    priority: 2,
    enabled: true
  },
  {
    id: 'faq-8',
    question: 'How long does shipping take?',
    answer: 'Standard shipping: 7-14 business days. Express shipping: 3-5 business days. Festival rush delivery (for upcoming events): 2-3 business days at select locations.',
    category: 'shipping',
    keywords: ['shipping time', 'delivery time', 'how long', 'days', 'arrive', 'when'],
    priority: 1,
    enabled: true
  },
  {
    id: 'faq-9',
    question: 'Are the pieces one-of-a-kind?',
    answer: 'Many of our pieces are limited edition or one-of-a-kind. The African fabrics we source often come in limited quantities, making each piece unique. Check product availability on the collection page.',
    category: 'products',
    keywords: ['unique', 'one of a kind', 'limited', 'edition', 'exclusive', 'special'],
    priority: 2,
    enabled: true
  },
  {
    id: 'faq-10',
    question: 'What festivals will Koby attend?',
    answer: 'Check our Festival page for the current schedule! We regularly attend Kizomba festivals in Bangkok, Singapore, Bali, Tokyo, Seoul, and Hong Kong. New events are added monthly.',
    category: 'festival',
    keywords: ['schedule', 'events', 'calendar', 'where', 'when', 'upcoming'],
    priority: 1,
    enabled: true
  }
]

const defaultStarters: ConversationStarter[] = [
  { id: 'start-1', text: 'Help me find the perfect festival outfit', category: 'shopping', enabled: true },
  { id: 'start-2', text: 'Tell me about your African fabrics', category: 'products', enabled: true },
  { id: 'start-3', text: 'When is the next festival?', category: 'festival', enabled: true },
  { id: 'start-4', text: 'What are your shipping options?', category: 'shipping', enabled: true }
]

const defaultSettings: ChatbotSettings = {
  greeting: "Welcome to K Harding Classics! I'm here to help you find your perfect piece of African heritage fashion. What brings you here today?",
  fallbackMessage: "I'm not sure I understood that. Could you rephrase, or would you like to email us at contact@khardingclassics.com?",
  handoffMessage: "I'd love to connect you with Koby directly! Please email contact@khardingclassics.com or DM us on Instagram @Khardingclassics.",
  personality: 'friendly',
  includeProductPrices: true,
  includeProductAvailability: true,
  includeShippingInfo: true,
  includeFestivalInfo: true,
  responseDelay: 800
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const useChatbotStore = create<ChatbotStore>()(
  persist(
    (set, get) => ({
      // Initial State
      faqs: defaultFaqs,
      conversationStarters: defaultStarters,
      settings: defaultSettings,
      currentSession: null,
      sessionHistory: [],
      faqFuse: null,

      // FAQ Management
      addFaq: (faq) => {
        const newFaq: FAQ = { ...faq, id: generateId() }
        set((state) => ({ faqs: [...state.faqs, newFaq] }))
        get().initializeFuse()
      },

      updateFaq: (id, updates) => {
        set((state) => ({
          faqs: state.faqs.map((faq) =>
            faq.id === id ? { ...faq, ...updates } : faq
          )
        }))
        get().initializeFuse()
      },

      deleteFaq: (id) => {
        set((state) => ({ faqs: state.faqs.filter((faq) => faq.id !== id) }))
        get().initializeFuse()
      },

      toggleFaq: (id) => {
        set((state) => ({
          faqs: state.faqs.map((faq) =>
            faq.id === id ? { ...faq, enabled: !faq.enabled } : faq
          )
        }))
      },

      // Conversation Starters
      addStarter: (starter) => {
        const newStarter: ConversationStarter = { ...starter, id: generateId() }
        set((state) => ({ conversationStarters: [...state.conversationStarters, newStarter] }))
      },

      updateStarter: (id, updates) => {
        set((state) => ({
          conversationStarters: state.conversationStarters.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          )
        }))
      },

      deleteStarter: (id) => {
        set((state) => ({
          conversationStarters: state.conversationStarters.filter((s) => s.id !== id)
        }))
      },

      // Settings
      updateSettings: (updates) => {
        set((state) => ({ settings: { ...state.settings, ...updates } }))
      },

      // Session Management
      startSession: () => {
        const session: ChatSession = {
          id: generateId(),
          messages: [],
          startedAt: new Date(),
          lastActivity: new Date()
        }
        set({ currentSession: session })
      },

      endSession: () => {
        const { currentSession, sessionHistory } = get()
        if (currentSession && currentSession.messages.length > 0) {
          set({
            sessionHistory: [...sessionHistory, currentSession].slice(-50), // Keep last 50 sessions
            currentSession: null
          })
        } else {
          set({ currentSession: null })
        }
      },

      addMessage: (role, content, matched) => {
        const message: ChatMessage = {
          id: generateId(),
          role,
          content,
          timestamp: new Date(),
          matched
        }
        set((state) => ({
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                messages: [...state.currentSession.messages, message],
                lastActivity: new Date()
              }
            : {
                id: generateId(),
                messages: [message],
                startedAt: new Date(),
                lastActivity: new Date()
              }
        }))
      },

      clearSession: () => {
        set({ currentSession: null })
      },

      // Search Engine
      initializeFuse: () => {
        const { faqs } = get()
        const enabledFaqs = faqs.filter((f) => f.enabled)

        const fuse = new Fuse(enabledFaqs, {
          keys: [
            { name: 'question', weight: 0.4 },
            { name: 'keywords', weight: 0.4 },
            { name: 'answer', weight: 0.2 }
          ],
          threshold: 0.4,
          includeScore: true,
          minMatchCharLength: 2
        })

        set({ faqFuse: fuse })
      },

      searchFaqs: (query) => {
        const { faqFuse, faqs } = get()

        // Initialize if not done
        if (!faqFuse) {
          get().initializeFuse()
        }

        const fuse = get().faqFuse
        if (!fuse) return []

        const results = fuse.search(query)

        return results.map((r) => ({
          faq: r.item,
          score: 1 - (r.score || 0) // Convert to confidence (higher is better)
        })).sort((a, b) => {
          // Sort by priority first, then score
          if (a.faq.priority !== b.faq.priority) {
            return a.faq.priority - b.faq.priority
          }
          return b.score - a.score
        })
      },

      // Import/Export
      exportKnowledgeBase: () => {
        const { faqs, conversationStarters, settings } = get()
        return JSON.stringify({ faqs, conversationStarters, settings }, null, 2)
      },

      importKnowledgeBase: (data) => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.faqs) set({ faqs: parsed.faqs })
          if (parsed.conversationStarters) set({ conversationStarters: parsed.conversationStarters })
          if (parsed.settings) set({ settings: { ...defaultSettings, ...parsed.settings } })
          get().initializeFuse()
          return true
        } catch {
          return false
        }
      }
    }),
    {
      name: 'chatbot-knowledge',
      partialize: (state) => ({
        faqs: state.faqs,
        conversationStarters: state.conversationStarters,
        settings: state.settings,
        sessionHistory: state.sessionHistory.slice(-20) // Only persist last 20 sessions
      })
    }
  )
)

// Initialize Fuse on first load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useChatbotStore.getState().initializeFuse()
  }, 100)
}
