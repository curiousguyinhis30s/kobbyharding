import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit, Save, X, Image, Link, Plus, Trash2 } from 'lucide-react'
import { useToast } from '../Toast'

interface ContentSection {
  id: string
  type: 'hero' | 'banner' | 'about' | 'announcement' | 'feature'
  title: string
  subtitle?: string
  content?: string
  image?: string
  link?: string
  buttonText?: string
  active: boolean
  order: number
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const ContentManager = () => {
  const { addToast } = useToast()
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'homepage' | 'about' | 'faqs' | 'policies'>('homepage')
  const [showAddFaqModal, setShowAddFaqModal] = useState(false)
  const [aboutContent, setAboutContent] = useState('')
  const [policiesContent, setPoliciesContent] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = () => {
    const storedContent = localStorage.getItem('admin_content_sections')
    if (storedContent) {
      setContentSections(JSON.parse(storedContent))
    } else {
      // Initialize with default content
      const defaultSections: ContentSection[] = [
        {
          id: '1',
          type: 'hero',
          title: 'KOBBY HARDING',
          subtitle: 'Where African Heritage Meets Modern Style',
          content: 'Discover authentic African fashion reimagined for the modern world. Each piece tells a story of culture, craftsmanship, and contemporary elegance.',
          image: '/kobby-assets/models/hero-image.jpg',
          buttonText: 'Shop Collection',
          link: '/collection',
          active: true,
          order: 1
        },
        {
          id: '2',
          type: 'announcement',
          title: 'New Collection Drop',
          content: 'Festival Collection 2025 - Limited pieces available. Get yours before they sell out!',
          active: true,
          order: 0
        },
        {
          id: '3',
          type: 'feature',
          title: 'Sustainable Fashion',
          subtitle: 'Ethically Made in Africa',
          content: 'Every KOBBY HARDING piece is crafted with care by local artisans using sustainable materials and traditional techniques.',
          image: '/kobby-assets/feature-sustainable.jpg',
          active: true,
          order: 2
        }
      ]
      setContentSections(defaultSections)
      localStorage.setItem('admin_content_sections', JSON.stringify(defaultSections))
    }

    const storedFaqs = localStorage.getItem('admin_faqs')
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs))
    } else {
      // Initialize with default FAQs
      const defaultFaqs: FAQ[] = [
        {
          id: '1',
          question: 'What makes KOBBY HARDING unique?',
          answer: 'KOBBY HARDING combines authentic African craftsmanship with modern fashion design. Each piece is handcrafted by skilled artisans using traditional techniques and sustainable materials.',
          category: 'general'
        },
        {
          id: '2',
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 5-7 business days within the US. International shipping typically takes 10-14 business days. Express shipping options are available at checkout.',
          category: 'shipping'
        },
        {
          id: '3',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for unworn items with original tags. Custom or sale items are final sale. Please visit our returns page for detailed information.',
          category: 'returns'
        }
      ]
      setFaqs(defaultFaqs)
      localStorage.setItem('admin_faqs', JSON.stringify(defaultFaqs))
    }

    // Load About content
    const storedAbout = localStorage.getItem('admin_about_content')
    if (storedAbout) {
      setAboutContent(storedAbout)
    } else {
      const defaultAbout = `# About KOBBY HARDING

KOBBY HARDING is where African heritage meets modern style. We create authentic fashion that tells a story of culture, craftsmanship, and contemporary elegance.

## Our Story

Founded with a passion for celebrating African culture through fashion, KOBBY HARDING brings you handcrafted pieces that blend traditional techniques with modern design sensibilities.

## Our Mission

To empower local artisans while delivering exceptional fashion that honors African heritage and meets the demands of the modern world.

## Our Values

- **Authenticity**: Every piece is genuine and crafted with care
- **Sustainability**: We use eco-friendly materials and ethical production methods
- **Quality**: Uncompromising standards in every stitch
- **Community**: Supporting local artisans and their families`
      setAboutContent(defaultAbout)
      localStorage.setItem('admin_about_content', defaultAbout)
    }

    // Load Policies content
    const storedPolicies = localStorage.getItem('admin_policies_content')
    if (storedPolicies) {
      setPoliciesContent(storedPolicies)
    } else {
      const defaultPolicies = `# Store Policies

## Shipping Policy

- Standard shipping: 5-7 business days
- Express shipping: 2-3 business days
- International shipping: 10-14 business days
- Free shipping on orders over $200

## Return Policy

- 30-day return window for unworn items with original tags
- Custom and sale items are final sale
- Refunds processed within 7 business days
- Customer responsible for return shipping costs

## Privacy Policy

We respect your privacy and protect your personal information. We collect only necessary data for order fulfillment and never share your information with third parties without consent.

## Terms of Service

By using our website, you agree to our terms of service. All products are authentic and guaranteed against defects in materials and workmanship.`
      setPoliciesContent(defaultPolicies)
      localStorage.setItem('admin_policies_content', defaultPolicies)
    }
  }

  const saveSection = (section: ContentSection) => {
    try {
      const updated = editingSection
        ? contentSections.map(s => s.id === editingSection ? section : s)
        : [...contentSections, { ...section, id: Date.now().toString() }]

      setContentSections(updated)
      localStorage.setItem('admin_content_sections', JSON.stringify(updated))
      setEditingSection(null)
      addToast('success', `${editingSection ? 'Updated' : 'Created'} ${section.type} section`)
    } catch (error) {
      addToast('error', 'Failed to save content section. Please try again.')
      console.error('Error saving section:', error)
    }
  }

  const deleteSection = (id: string) => {
    const section = contentSections.find(s => s.id === id)
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        const updated = contentSections.filter(s => s.id !== id)
        setContentSections(updated)
        localStorage.setItem('admin_content_sections', JSON.stringify(updated))
        addToast('success', `Deleted ${section?.type || 'content'} section`)
      } catch (error) {
        addToast('error', 'Failed to delete content section. Please try again.')
        console.error('Error deleting section:', error)
      }
    }
  }

  const saveFaq = (question: string, answer: string, category: string) => {
    try {
      const newFaq: FAQ = {
        id: Date.now().toString(),
        question,
        answer,
        category
      }
      const updated = [...faqs, newFaq]
      setFaqs(updated)
      localStorage.setItem('admin_faqs', JSON.stringify(updated))
      addToast('success', 'Added FAQ')
      setShowAddFaqModal(false)
    } catch (error) {
      addToast('error', 'Failed to add FAQ. Please try again.')
      console.error('Error saving FAQ:', error)
    }
  }

  const saveAboutContent = () => {
    try {
      localStorage.setItem('admin_about_content', aboutContent)
      addToast('success', 'About page content saved')
    } catch (error) {
      addToast('error', 'Failed to save About content. Please try again.')
      console.error('Error saving About content:', error)
    }
  }

  const savePoliciesContent = () => {
    try {
      localStorage.setItem('admin_policies_content', policiesContent)
      addToast('success', 'Policies content saved')
    } catch (error) {
      addToast('error', 'Failed to save Policies content. Please try again.')
      console.error('Error saving Policies content:', error)
    }
  }

  const deleteFaq = (id: string) => {
    try {
      const updated = faqs.filter(f => f.id !== id)
      setFaqs(updated)
      localStorage.setItem('admin_faqs', JSON.stringify(updated))
      addToast('success', 'Deleted FAQ')
    } catch (error) {
      addToast('error', 'Failed to delete FAQ. Please try again.')
      console.error('Error deleting FAQ:', error)
    }
  }

  const cardStyle = {
    background: '#ffffff',
    border: `1px solid ${'#e0e0e0'}`,
    borderRadius: '8px',
    padding: '24px',
    transition: 'all 0.3s'
  }

  const buttonStyle = {
    padding: '10px 20px',
    background: '#000000',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '300',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.3s'
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    background: 'rgba(0, 0, 0, 0.05)',
    border: `1px solid ${'#e0e0e0'}`,
    borderRadius: '4px',
    color: '#000000',
    fontSize: '14px',
    outline: 'none'
  }

  const renderHomepageContent = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '300', color: '#000000' }}>Homepage Sections</h3>
        <button
          onClick={() => setEditingSection('new')}
          style={buttonStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
          Add Section
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {contentSections
          .sort((a, b) => a.order - b.order)
          .map(section => (
            <motion.div
              key={section.id}
              style={cardStyle}
              whileHover={{ y: -2 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      background: `${'#000000'}20`,
                      color: '#000000',
                      textTransform: 'uppercase'
                    }}>
                      {section.type}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      background: section.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                      color: section.active ? '#10b981' : '#666666'
                    }}>
                      {section.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {editingSection === section.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input
                        type="text"
                        defaultValue={section.title}
                        placeholder="Title"
                        style={inputStyle}
                        id={`title-${section.id}`}
                      />
                      <input
                        type="text"
                        defaultValue={section.subtitle}
                        placeholder="Subtitle (optional)"
                        style={inputStyle}
                        id={`subtitle-${section.id}`}
                      />
                      <textarea
                        defaultValue={section.content}
                        placeholder="Content"
                        rows={3}
                        style={inputStyle}
                        id={`content-${section.id}`}
                      />
                      <input
                        type="text"
                        defaultValue={section.image}
                        placeholder="Image URL"
                        style={inputStyle}
                        id={`image-${section.id}`}
                      />
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                          type="text"
                          defaultValue={section.buttonText}
                          placeholder="Button Text"
                          style={{ ...inputStyle, flex: 1 }}
                          id={`buttonText-${section.id}`}
                        />
                        <input
                          type="text"
                          defaultValue={section.link}
                          placeholder="Link URL"
                          style={{ ...inputStyle, flex: 1 }}
                          id={`link-${section.id}`}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => {
                            const title = (document.getElementById(`title-${section.id}`) as HTMLInputElement).value
                            const subtitle = (document.getElementById(`subtitle-${section.id}`) as HTMLInputElement).value
                            const content = (document.getElementById(`content-${section.id}`) as HTMLTextAreaElement).value
                            const image = (document.getElementById(`image-${section.id}`) as HTMLInputElement).value
                            const buttonText = (document.getElementById(`buttonText-${section.id}`) as HTMLInputElement).value
                            const link = (document.getElementById(`link-${section.id}`) as HTMLInputElement).value

                            saveSection({
                              ...section,
                              title,
                              subtitle,
                              content,
                              image,
                              buttonText,
                              link
                            })
                          }}
                          style={buttonStyle}
                        >
                          <Save style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSection(null)}
                          style={{
                            ...buttonStyle,
                            background: 'transparent',
                            border: `1px solid ${'#e0e0e0'}`,
                            color: '#666666'
                          }}
                        >
                          <X style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h4 style={{ fontSize: '16px', fontWeight: '400', color: '#000000', marginBottom: '8px' }}>
                        {section.title}
                      </h4>
                      {section.subtitle && (
                        <p style={{ fontSize: '14px', color: '#666666', marginBottom: '8px' }}>
                          {section.subtitle}
                        </p>
                      )}
                      {section.content && (
                        <p style={{ fontSize: '13px', color: '#666666', marginBottom: '12px' }}>
                          {section.content}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#666666' }}>
                        {section.image && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Image style={{ width: '14px', height: '14px' }} />
                            Has Image
                          </span>
                        )}
                        {section.link && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Link style={{ width: '14px', height: '14px' }} />
                            {section.link}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {editingSection !== section.id && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEditingSection(section.id)}
                      style={{
                        padding: '8px',
                        background: 'transparent',
                        border: `1px solid ${'#e0e0e0'}`,
                        borderRadius: '4px',
                        color: '#000000',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      style={{
                        padding: '8px',
                        background: 'transparent',
                        border: `1px solid ${'#e0e0e0'}`,
                        borderRadius: '4px',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  )

  const renderFAQs = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '300', color: '#000000' }}>Frequently Asked Questions</h3>
        <button
          onClick={() => setShowAddFaqModal(true)}
          style={buttonStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
          Add FAQ
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map(faq => (
          <motion.div
            key={faq.id}
            style={cardStyle}
            whileHover={{ y: -2 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  background: `${'#000000'}20`,
                  color: '#000000',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  display: 'inline-block'
                }}>
                  {faq.category}
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#000000', marginBottom: '8px' }}>
                  {faq.question}
                </h4>
                <p style={{ fontSize: '13px', color: '#666666', lineHeight: '1.5' }}>
                  {faq.answer}
                </p>
              </div>
              <button
                onClick={() => deleteFaq(faq.id)}
                style={{
                  padding: '8px',
                  background: 'transparent',
                  border: `1px solid ${'#e0e0e0'}`,
                  borderRadius: '4px',
                  color: '#ef4444',
                  cursor: 'pointer'
                }}
              >
                <Trash2 style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '200', color: '#000000', marginBottom: '8px' }}>
          Content Management
        </h2>
        <p style={{ fontSize: '14px', color: '#666666' }}>
          Manage website content, announcements, and customer information
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: `1px solid ${'#e0e0e0'}` }}>
        {(['homepage', 'about', 'faqs', 'policies'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: activeTab === tab ? '#000000' : '#666666',
              borderBottom: activeTab === tab ? `2px solid ${'#000000'}` : 'none',
              paddingBottom: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'homepage' && renderHomepageContent()}
      {activeTab === 'faqs' && renderFAQs()}
      {activeTab === 'about' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '300', color: '#000000' }}>
              About Page Content
            </h3>
            <button
              onClick={saveAboutContent}
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Save style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
              Save Changes
            </button>
          </div>
          <p style={{ fontSize: '13px', color: '#666666', marginBottom: '16px' }}>
            Edit the About page content using Markdown format
          </p>
          <textarea
            value={aboutContent}
            onChange={(e) => setAboutContent(e.target.value)}
            rows={20}
            style={{
              ...inputStyle,
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: '1.6'
            }}
            placeholder="Enter About page content in Markdown format..."
          />
        </div>
      )}
      {activeTab === 'policies' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '300', color: '#000000' }}>
              Store Policies
            </h3>
            <button
              onClick={savePoliciesContent}
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Save style={{ width: '16px', height: '16px', display: 'inline', marginRight: '8px' }} />
              Save Changes
            </button>
          </div>
          <p style={{ fontSize: '13px', color: '#666666', marginBottom: '16px' }}>
            Edit store policies including Shipping, Returns, Privacy, and Terms
          </p>
          <textarea
            value={policiesContent}
            onChange={(e) => setPoliciesContent(e.target.value)}
            rows={20}
            style={{
              ...inputStyle,
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: '1.6'
            }}
            placeholder="Enter store policies in Markdown format..."
          />
        </div>
      )}

      {/* Add FAQ Modal */}
      {showAddFaqModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowAddFaqModal(false)}
        >
          <div
            style={{
              ...cardStyle,
              maxWidth: '600px',
              width: '100%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '300', color: '#000000', marginBottom: '20px' }}>
              Add New FAQ
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              saveFaq(
                formData.get('question') as string,
                formData.get('answer') as string,
                formData.get('category') as string
              )
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666666', marginBottom: '8px' }}>
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    style={inputStyle}
                  >
                    <option value="general">General</option>
                    <option value="shipping">Shipping</option>
                    <option value="returns">Returns</option>
                    <option value="products">Products</option>
                    <option value="orders">Orders</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666666', marginBottom: '8px' }}>
                    Question
                  </label>
                  <input
                    name="question"
                    type="text"
                    required
                    placeholder="What is your question?"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666666', marginBottom: '8px' }}>
                    Answer
                  </label>
                  <textarea
                    name="answer"
                    required
                    rows={4}
                    placeholder="Provide a clear and helpful answer..."
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddFaqModal(false)}
                    style={{
                      ...buttonStyle,
                      background: 'transparent',
                      border: `1px solid ${'#e0e0e0'}`,
                      color: '#666666'
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={buttonStyle}>
                    Add FAQ
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentManager