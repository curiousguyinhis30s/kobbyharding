import { useState } from 'react'
import { useChatbotStore, type FAQ, type ConversationStarter, type ChatbotSettings } from '../../stores/useChatbotStore'
import {
  MessageSquare, Plus, Trash2, Edit2, Save, X, Download, Upload,
  ToggleLeft, ToggleRight, Settings, HelpCircle, Zap, ChevronDown, ChevronUp
} from 'lucide-react'

const categories = ['shipping', 'products', 'sizing', 'returns', 'festival', 'general'] as const

const ChatbotManager = () => {
  const {
    faqs, conversationStarters, settings,
    addFaq, updateFaq, deleteFaq, toggleFaq,
    addStarter, updateStarter, deleteStarter,
    updateSettings, exportKnowledgeBase, importKnowledgeBase
  } = useChatbotStore()

  const [activeTab, setActiveTab] = useState<'faqs' | 'starters' | 'settings'>('faqs')
  const [editingFaq, setEditingFaq] = useState<string | null>(null)
  const [editingStarter, setEditingStarter] = useState<string | null>(null)
  const [showAddFaq, setShowAddFaq] = useState(false)
  const [showAddStarter, setShowAddStarter] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  // Form states
  const [faqForm, setFaqForm] = useState<Partial<FAQ>>({
    question: '', answer: '', category: 'general', keywords: [], priority: 2, enabled: true
  })
  const [starterForm, setStarterForm] = useState<Partial<ConversationStarter>>({
    text: '', category: 'general', enabled: true
  })
  const [keywordInput, setKeywordInput] = useState('')

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !faqForm.keywords?.includes(keywordInput.trim())) {
      setFaqForm({ ...faqForm, keywords: [...(faqForm.keywords || []), keywordInput.trim().toLowerCase()] })
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setFaqForm({ ...faqForm, keywords: faqForm.keywords?.filter(k => k !== keyword) })
  }

  const handleSaveFaq = () => {
    if (faqForm.question && faqForm.answer) {
      if (editingFaq) {
        updateFaq(editingFaq, faqForm)
        setEditingFaq(null)
      } else {
        addFaq(faqForm as Omit<FAQ, 'id'>)
      }
      setFaqForm({ question: '', answer: '', category: 'general', keywords: [], priority: 2, enabled: true })
      setShowAddFaq(false)
    }
  }

  const handleEditFaq = (faq: FAQ) => {
    setFaqForm(faq)
    setEditingFaq(faq.id)
    setShowAddFaq(true)
  }

  const handleSaveStarter = () => {
    if (starterForm.text) {
      if (editingStarter) {
        updateStarter(editingStarter, starterForm)
        setEditingStarter(null)
      } else {
        addStarter(starterForm as Omit<ConversationStarter, 'id'>)
      }
      setStarterForm({ text: '', category: 'general', enabled: true })
      setShowAddStarter(false)
    }
  }

  const handleExport = () => {
    const data = exportKnowledgeBase()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chatbot-knowledge-base.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const success = importKnowledgeBase(event.target?.result as string)
        if (success) {
          alert('Knowledge base imported successfully!')
        } else {
          alert('Failed to import. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '0',
    color: '#fff',
    fontSize: '13px'
  }

  const buttonStyle = {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '0',
    color: '#fff',
    fontSize: '11px',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  }

  return (
    <div style={{ padding: '24px', background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '300',
            letterSpacing: '0.15em',
            color: '#fff',
            margin: 0
          }}>
            CHATBOT KNOWLEDGE BASE
          </h1>
          <p style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '4px'
          }}>
            Train your chatbot with FAQs and custom responses
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExport} style={buttonStyle}>
            <Download size={14} /> EXPORT
          </button>
          <label style={{ ...buttonStyle, cursor: 'pointer' }}>
            <Upload size={14} /> IMPORT
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {[
          { id: 'faqs', label: 'FAQs', icon: HelpCircle, count: faqs.length },
          { id: 'starters', label: 'Quick Actions', icon: Zap, count: conversationStarters.length },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #fff' : '2px solid transparent',
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '2px 6px',
                fontSize: '10px'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <span key={cat} style={{
                  padding: '4px 10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.6)',
                  textTransform: 'uppercase'
                }}>
                  {cat}: {faqs.filter(f => f.category === cat).length}
                </span>
              ))}
            </div>
            <button
              onClick={() => { setShowAddFaq(true); setEditingFaq(null); setFaqForm({ question: '', answer: '', category: 'general', keywords: [], priority: 2, enabled: true }) }}
              style={{ ...buttonStyle, background: 'rgba(255,255,255,0.15)' }}
            >
              <Plus size={14} /> ADD FAQ
            </button>
          </div>

          {/* Add/Edit FAQ Form */}
          {showAddFaq && (
            <div style={{
              padding: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#fff', margin: 0 }}>
                  {editingFaq ? 'EDIT FAQ' : 'NEW FAQ'}
                </h3>
                <button onClick={() => { setShowAddFaq(false); setEditingFaq(null) }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>QUESTION</label>
                  <input
                    value={faqForm.question || ''}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    placeholder="What question will trigger this response?"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>ANSWER</label>
                  <textarea
                    value={faqForm.answer || ''}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    placeholder="The response the chatbot will give"
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>CATEGORY</label>
                    <select
                      value={faqForm.category || 'general'}
                      onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value as FAQ['category'] })}
                      style={inputStyle}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} style={{ background: '#1a1a1a' }}>{cat.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>PRIORITY (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={faqForm.priority || 2}
                      onChange={(e) => setFaqForm({ ...faqForm, priority: parseInt(e.target.value) })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>
                    KEYWORDS (improve matching)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      placeholder="Add keyword and press Enter"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button onClick={handleAddKeyword} style={buttonStyle}>ADD</button>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {faqForm.keywords?.map(kw => (
                      <span key={kw} style={{
                        padding: '4px 8px',
                        background: 'rgba(255,255,255,0.1)',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {kw}
                        <X size={10} style={{ cursor: 'pointer' }} onClick={() => handleRemoveKeyword(kw)} />
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <button onClick={() => { setShowAddFaq(false); setEditingFaq(null) }} style={buttonStyle}>CANCEL</button>
                  <button onClick={handleSaveFaq} style={{ ...buttonStyle, background: 'rgba(255,255,255,0.2)' }}>
                    <Save size={14} /> SAVE FAQ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FAQ List */}
          <div style={{ display: 'grid', gap: '8px' }}>
            {faqs.map(faq => (
              <div key={faq.id} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                opacity: faq.enabled ? 1 : 0.5
              }}>
                <div
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '2px 6px',
                        background: 'rgba(255,255,255,0.1)',
                        fontSize: '9px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}>
                        {faq.category}
                      </span>
                      <span style={{ fontSize: '13px', color: '#fff' }}>{faq.question}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFaq(faq.id) }}
                      style={{ background: 'none', border: 'none', color: faq.enabled ? '#4ade80' : 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                    >
                      {faq.enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditFaq(faq) }}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); if(confirm('Delete this FAQ?')) deleteFaq(faq.id) }}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                    {expandedFaq === faq.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>

                {expandedFaq === faq.id && (
                  <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(0,0,0,0.2)'
                  }}>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 12px' }}>
                      {faq.answer}
                    </p>
                    {faq.keywords.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {faq.keywords.map(kw => (
                          <span key={kw} style={{
                            padding: '2px 6px',
                            background: 'rgba(255,255,255,0.05)',
                            fontSize: '9px',
                            color: 'rgba(255,255,255,0.5)'
                          }}>
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Tab */}
      {activeTab === 'starters' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Quick action buttons shown to users when they open the chat
            </p>
            <button
              onClick={() => { setShowAddStarter(true); setEditingStarter(null); setStarterForm({ text: '', category: 'general', enabled: true }) }}
              style={{ ...buttonStyle, background: 'rgba(255,255,255,0.15)' }}
            >
              <Plus size={14} /> ADD ACTION
            </button>
          </div>

          {showAddStarter && (
            <div style={{
              padding: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>BUTTON TEXT</label>
                  <input
                    value={starterForm.text || ''}
                    onChange={(e) => setStarterForm({ ...starterForm, text: e.target.value })}
                    placeholder="e.g., Help me find an outfit"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>CATEGORY</label>
                  <select
                    value={starterForm.category || 'general'}
                    onChange={(e) => setStarterForm({ ...starterForm, category: e.target.value })}
                    style={inputStyle}
                  >
                    {['shopping', 'products', 'festival', 'shipping', 'general'].map(cat => (
                      <option key={cat} value={cat} style={{ background: '#1a1a1a' }}>{cat.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button onClick={() => setShowAddStarter(false)} style={buttonStyle}>CANCEL</button>
                  <button onClick={handleSaveStarter} style={{ ...buttonStyle, background: 'rgba(255,255,255,0.2)' }}>
                    <Save size={14} /> SAVE
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gap: '8px' }}>
            {conversationStarters.map(starter => (
              <div key={starter.id} style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: starter.enabled ? 1 : 0.5
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MessageSquare size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <span style={{ fontSize: '13px', color: '#fff' }}>{starter.text}</span>
                  <span style={{
                    padding: '2px 6px',
                    background: 'rgba(255,255,255,0.05)',
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.5)'
                  }}>
                    {starter.category}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => updateStarter(starter.id, { enabled: !starter.enabled })}
                    style={{ background: 'none', border: 'none', color: starter.enabled ? '#4ade80' : 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                  >
                    {starter.enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                  <button
                    onClick={() => { if(confirm('Delete this action?')) deleteStarter(starter.id) }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
          <div>
            <h3 style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
              MESSAGES
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>
                  GREETING MESSAGE
                </label>
                <textarea
                  value={settings.greeting}
                  onChange={(e) => updateSettings({ greeting: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>
                  FALLBACK MESSAGE (when no match found)
                </label>
                <textarea
                  value={settings.fallbackMessage}
                  onChange={(e) => updateSettings({ fallbackMessage: e.target.value })}
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>
                  HANDOFF MESSAGE (connect to human)
                </label>
                <textarea
                  value={settings.handoffMessage}
                  onChange={(e) => updateSettings({ handoffMessage: e.target.value })}
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
              BEHAVIOR
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>
                  PERSONALITY
                </label>
                <select
                  value={settings.personality}
                  onChange={(e) => updateSettings({ personality: e.target.value as typeof settings.personality })}
                  style={inputStyle}
                >
                  <option value="professional" style={{ background: '#1a1a1a' }}>Professional</option>
                  <option value="friendly" style={{ background: '#1a1a1a' }}>Friendly</option>
                  <option value="minimal" style={{ background: '#1a1a1a' }}>Minimal</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>
                  RESPONSE DELAY (ms) - adds natural feel
                </label>
                <input
                  type="number"
                  value={settings.responseDelay}
                  onChange={(e) => updateSettings({ responseDelay: parseInt(e.target.value) || 0 })}
                  min="0"
                  max="3000"
                  step="100"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
              KNOWLEDGE TOGGLES
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { key: 'includeProductPrices', label: 'Include product prices in responses' },
                { key: 'includeProductAvailability', label: 'Include availability info' },
                { key: 'includeShippingInfo', label: 'Include shipping information' },
                { key: 'includeFestivalInfo', label: 'Include festival information' }
              ].map(toggle => (
                <div key={toggle.key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{toggle.label}</span>
                  <button
                    onClick={() => updateSettings({ [toggle.key]: !settings[toggle.key as keyof ChatbotSettings] })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: settings[toggle.key as keyof ChatbotSettings] ? '#4ade80' : 'rgba(255,255,255,0.3)' }}
                  >
                    {settings[toggle.key as keyof ChatbotSettings] ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatbotManager
