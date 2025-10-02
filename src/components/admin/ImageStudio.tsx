import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, Download, Wand2, Image, Sparkles, 
  Save, AlertCircle, Loader,
  Camera, User, Layers
} from 'lucide-react'

interface ImageTemplate {
  id: string
  name: string
  description: string
  prompt: string
  style: string
  icon: React.ComponentType<{ size?: number }>
}

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: string
  original?: string
}

const ImageStudio = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; imageUrl?: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [activeTab, setActiveTab] = useState<'upload' | 'enhance' | 'gallery'>('upload')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [modelSettings, setModelSettings] = useState({
    pose: 'standing',
    background: 'studio',
    lighting: 'natural',
    style: 'minimal'
  })

  // Predefined templates for consistent brand imagery
  const templates: ImageTemplate[] = [
    {
      id: 'model-studio',
      name: 'Studio Model',
      description: 'Professional model in studio setting',
      prompt: 'Professional fashion model wearing [PRODUCT], studio lighting, minimal background, high fashion photography',
      style: 'studio',
      icon: User
    },
    {
      id: 'street-style',
      name: 'Street Style',
      description: 'Urban street fashion look',
      prompt: 'Fashion model wearing [PRODUCT], urban street style, natural lighting, city background, candid pose',
      style: 'street',
      icon: Camera
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      description: 'Natural lifestyle setting',
      prompt: 'Person wearing [PRODUCT] in natural lifestyle setting, warm lighting, comfortable pose, authentic look',
      style: 'lifestyle',
      icon: Sparkles
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Clean minimalist aesthetic',
      prompt: 'Model wearing [PRODUCT], minimalist aesthetic, clean background, soft lighting, editorial style',
      style: 'minimal',
      icon: Layers
    }
  ]

  // Mock products from localStorage
  const getProducts = (): any[] => {
    const stored = localStorage.getItem('admin_products')
    return stored ? JSON.parse(stored) : []
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setActiveTab('enhance')
      }
      reader.readAsDataURL(file)
    }
  }

  const generateImage = async () => {
    setIsGenerating(true)
    
    // Simulate AI image generation
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: selectedImage || '/api/placeholder/600/800',
        prompt: customPrompt || templates.find(t => t.id === selectedTemplate)?.prompt || '',
        timestamp: new Date().toISOString(),
        original: selectedImage || undefined
      }
      
      setGeneratedImages([newImage, ...generatedImages])
      setIsGenerating(false)
      setActiveTab('gallery')
    }, 3000)
  }

  const saveToProduct = (imageUrl: string) => {
    if (!selectedProduct) return
    
    // Update product with new image
    const products = getProducts()
    const updatedProducts = products.map((p: any) => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          images: [...(p.images || []), imageUrl],
          updatedAt: new Date().toISOString()
        }
      }
      return p
    })
    
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts))
    alert('Image saved to product!')
  }

  // Styles
  const containerStyle = {
    padding: '24px',
    background: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${'#e0e0e0'}`
  }

  const tabStyle = (active: boolean) => ({
    padding: '12px 24px',
    background: active ? '#000000' : 'transparent',
    color: active ? 'white' : '#666666',
    border: 'none',
    fontSize: '14px',
    fontWeight: '300',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  })

  const uploadAreaStyle = {
    border: `2px dashed ${'#e0e0e0'}`,
    borderRadius: '12px',
    padding: '60px 20px',
    textAlign: 'center' as const,
    background: '#d1d5db',
    cursor: 'pointer',
    transition: 'all 0.3s'
  }

  const templateCardStyle = (selected: boolean) => ({
    padding: '16px',
    border: `2px solid ${selected ? '#000000' : '#e0e0e0'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    background: selected ? `${'#000000'}15` : '#ffffff',
    transition: 'all 0.3s'
  })

  const settingControlStyle = {
    padding: '12px',
    border: `1px solid ${'#e0e0e0'}`,
    borderRadius: '6px',
    background: 'transparent',
    color: '#000000',
    fontSize: '14px',
    width: '100%'
  }

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '300', 
          letterSpacing: '0.1em',
          color: '#000000',
          marginBottom: '8px'
        }}>
          IMAGE STUDIO
        </h2>
        <p style={{ color: '#666666', fontSize: '14px' }}>
          AI-powered image enhancement and model generation for your products
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveTab('upload')}
          style={tabStyle(activeTab === 'upload')}
        >
          <Upload size={16} />
          Upload
        </button>
        <button 
          onClick={() => setActiveTab('enhance')}
          style={tabStyle(activeTab === 'enhance')}
          disabled={!selectedImage}
        >
          <Wand2 size={16} />
          Enhance
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          style={tabStyle(activeTab === 'gallery')}
        >
          <Image size={16} />
          Gallery
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Product Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '13px',
              color: '#666666',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Select Product
            </label>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const products = getProducts()
                setSelectedProduct(products.find((p: any) => p.id === e.target.value))
              }}
              style={{
                ...settingControlStyle,
                cursor: 'pointer'
              }}
            >
              <option value="">Choose a product...</option>
              {getProducts().map((product: any) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={uploadAreaStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#000000'
              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <Upload size={48} style={{ margin: '0 auto 16px', color: '#666666' }} />
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '300',
              color: '#000000',
              marginBottom: '8px'
            }}>
              Upload Product Image
            </h3>
            <p style={{ color: '#666666', fontSize: '14px' }}>
              Click to browse or drag and drop your image here
            </p>
            <p style={{ color: '#666666', fontSize: '12px', marginTop: '8px' }}>
              Supports: JPG, PNG, WEBP (Max 10MB)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </motion.div>
      )}

      {/* Enhance Tab */}
      {activeTab === 'enhance' && selectedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Original Image */}
            <div>
              <h3 style={{ 
                fontSize: '14px',
                fontWeight: '300',
                letterSpacing: '0.1em',
                color: '#666666',
                marginBottom: '12px',
                textTransform: 'uppercase'
              }}>
                Original Image
              </h3>
              <img 
                src={selectedImage} 
                alt="Original"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: `1px solid ${'#e0e0e0'}`
                }}
              />
            </div>

            {/* Enhancement Options */}
            <div>
              <h3 style={{ 
                fontSize: '14px',
                fontWeight: '300',
                letterSpacing: '0.1em',
                color: '#666666',
                marginBottom: '12px',
                textTransform: 'uppercase'
              }}>
                Enhancement Options
              </h3>

              {/* Templates */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px',
                  fontSize: '13px',
                  color: '#666666'
                }}>
                  Choose Template
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {templates.map((template) => {
                    const Icon = template.icon
                    return (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        style={templateCardStyle(selectedTemplate === template.id)}
                        onMouseEnter={(e) => {
                          if (selectedTemplate !== template.id) {
                            e.currentTarget.style.borderColor = '#000000'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedTemplate !== template.id) {
                            e.currentTarget.style.borderColor = '#e0e0e0'
                          }
                        }}
                      >
                        <div style={{ marginBottom: '8px', color: '#000000' }}>
                          <Icon size={20} />
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#000000' }}>
                          {template.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666666', marginTop: '4px' }}>
                          {template.description}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Model Settings */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px',
                  fontSize: '13px',
                  color: '#666666'
                }}>
                  Model Settings
                </label>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>
                      Pose
                    </label>
                    <select
                      value={modelSettings.pose}
                      onChange={(e) => setModelSettings({...modelSettings, pose: e.target.value})}
                      style={settingControlStyle}
                    >
                      <option value="standing">Standing</option>
                      <option value="sitting">Sitting</option>
                      <option value="walking">Walking</option>
                      <option value="casual">Casual</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>
                      Background
                    </label>
                    <select
                      value={modelSettings.background}
                      onChange={(e) => setModelSettings({...modelSettings, background: e.target.value})}
                      style={settingControlStyle}
                    >
                      <option value="studio">Studio</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="urban">Urban</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>
                      Lighting
                    </label>
                    <select
                      value={modelSettings.lighting}
                      onChange={(e) => setModelSettings({...modelSettings, lighting: e.target.value})}
                      style={settingControlStyle}
                    >
                      <option value="natural">Natural</option>
                      <option value="studio">Studio</option>
                      <option value="golden">Golden Hour</option>
                      <option value="soft">Soft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Custom Prompt */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontSize: '13px',
                  color: '#666666'
                }}>
                  Custom Instructions (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add specific instructions for the AI..."
                  style={{
                    ...settingControlStyle,
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateImage}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: isGenerating 
                    ? '#666666' 
                    : 'linear-gradient(to right, #f97316, #ea580c)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Enhanced Image
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {generatedImages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Image size={48} style={{ margin: '0 auto 16px', color: '#666666' }} />
              <p style={{ color: '#666666' }}>
                No generated images yet. Upload and enhance a product image to get started.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {generatedImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    border: `1px solid ${'#e0e0e0'}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#ffffff'
                  }}
                >
                  <img 
                    src={image.url} 
                    alt="Generated"
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '12px' }}>
                    <p style={{ 
                      fontSize: '11px', 
                      color: '#666666',
                      marginBottom: '8px'
                    }}>
                      {new Date(image.timestamp).toLocaleString()}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => saveToProduct(image.url)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: '#000000',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Save size={14} />
                        Save
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: 'transparent',
                          color: '#666666',
                          border: `1px solid ${'#e0e0e0'}`,
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Download size={14} />
                        Export
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* AI Provider Notice */}
      <div style={{
        marginTop: '32px',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.02)',
        border: `1px solid ${'#000000'}`,
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <AlertCircle size={20} style={{ color: '#000000', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ color: '#000000', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              AI Integration Ready
            </p>
            <p style={{ color: '#666666', fontSize: '13px', lineHeight: '1.5' }}>
              This Image Studio is ready to integrate with AI services like Stable Diffusion, DALL-E, Midjourney, or Replicate. 
              Configure your preferred AI provider's API key in the settings to enable real image generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageStudio