import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, Download, Wand2, Image, Sparkles, 
  Save, Loader, User, 
  Layers, Palette, Sliders, Sun, Moon,
  Zap, Paintbrush, Heart, Globe, Cpu
} from 'lucide-react'

interface StyleTemplate {
  id: string
  name: string
  category: string
  description: string
  prompt: string
  style: string
  icon: React.ComponentType<{ size?: number }>
  examples: string[]
}

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  timestamp: string
  settings: ImageSettings
}

interface ImageSettings {
  style: string
  colorPalette: string
  lighting: string
  composition: string
  mood: string
  artisticStyle: string
  cameraAngle: string
  timeOfDay: string
  season: string
  texture: string
  pattern: string
  culturalInfluence: string
}

const ImageStudioEnhanced = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [activeTab, setActiveTab] = useState<'generate' | 'enhance' | 'gallery'>('generate')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [customPrompt, setCustomPrompt] = useState('')
  const [freeformText, setFreeformText] = useState('')
  
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    style: 'photorealistic',
    colorPalette: 'vibrant',
    lighting: 'golden-hour',
    composition: 'rule-of-thirds',
    mood: 'energetic',
    artisticStyle: 'contemporary',
    cameraAngle: 'eye-level',
    timeOfDay: 'sunset',
    season: 'summer',
    texture: 'smooth',
    pattern: 'geometric',
    culturalInfluence: 'african'
  })

  // Expanded style templates with more variety
  const styleCategories = {
    'Festival Fashion': [
      {
        id: 'coachella-vibes',
        name: 'Coachella Desert Dream',
        category: 'Festival Fashion',
        description: 'Sun-kissed bohemian style with desert backdrop',
        prompt: 'bohemian festival fashion, desert sunset, palm trees, golden hour lighting',
        style: 'vibrant, dreamy, warm tones',
        icon: Sun,
        examples: ['boho-dress.jpg', 'desert-outfit.jpg']
      },
      {
        id: 'burning-man',
        name: 'Playa Warrior',
        category: 'Festival Fashion',
        description: 'Dust-proof dystopian fashion meets art',
        prompt: 'post-apocalyptic festival wear, dust storm, goggles, LED accessories',
        style: 'gritty, futuristic, high contrast',
        icon: Zap,
        examples: ['burning-man.jpg', 'playa-fashion.jpg']
      },
      {
        id: 'afrofuturism',
        name: 'Afrofuturist Vision',
        category: 'Festival Fashion',
        description: 'African heritage meets sci-fi aesthetics',
        prompt: 'afrofuturistic fashion, tribal patterns, metallic accents, cosmic background',
        style: 'bold, cultural, futuristic',
        icon: Globe,
        examples: ['afrofuture.jpg', 'cosmic-african.jpg']
      }
    ],
    'Artistic Styles': [
      {
        id: 'watercolor',
        name: 'Watercolor Dreams',
        category: 'Artistic Styles',
        description: 'Soft, flowing watercolor painting effect',
        prompt: 'watercolor painting style, soft edges, color bleeds, artistic',
        style: 'ethereal, soft, painterly',
        icon: Paintbrush,
        examples: ['watercolor1.jpg', 'watercolor2.jpg']
      },
      {
        id: 'street-art',
        name: 'Urban Graffiti',
        category: 'Artistic Styles',
        description: 'Bold street art and graffiti inspired',
        prompt: 'street art style, graffiti, bold colors, urban backdrop, spray paint effect',
        style: 'urban, edgy, colorful',
        icon: Palette,
        examples: ['graffiti1.jpg', 'street-art.jpg']
      },
      {
        id: 'minimalist',
        name: 'Minimalist Chic',
        category: 'Artistic Styles',
        description: 'Clean lines and simple elegance',
        prompt: 'minimalist fashion, clean background, simple lines, monochrome',
        style: 'clean, modern, sophisticated',
        icon: Layers,
        examples: ['minimal1.jpg', 'minimal2.jpg']
      }
    ],
    'Cultural Heritage': [
      {
        id: 'kente-inspired',
        name: 'Kente Pattern Master',
        category: 'Cultural Heritage',
        description: 'Traditional Kente cloth patterns reimagined',
        prompt: 'kente cloth patterns, traditional African textiles, geometric designs, vibrant colors',
        style: 'cultural, geometric, colorful',
        icon: Heart,
        examples: ['kente1.jpg', 'kente2.jpg']
      },
      {
        id: 'ankara-fusion',
        name: 'Ankara Modern',
        category: 'Cultural Heritage',
        description: 'Contemporary takes on Ankara prints',
        prompt: 'modern Ankara prints, African wax fabric, contemporary fashion, bold patterns',
        style: 'traditional, modern fusion',
        icon: Globe,
        examples: ['ankara1.jpg', 'ankara2.jpg']
      },
      {
        id: 'tribal-contemporary',
        name: 'Tribal Contemporary',
        category: 'Cultural Heritage',
        description: 'Ancient tribal aesthetics meet modern design',
        prompt: 'tribal patterns, contemporary interpretation, earth tones, cultural symbols',
        style: 'ancestral, modern, symbolic',
        icon: User,
        examples: ['tribal1.jpg', 'tribal2.jpg']
      }
    ],
    'Seasonal Moods': [
      {
        id: 'summer-festival',
        name: 'Summer Festival Heat',
        category: 'Seasonal Moods',
        description: 'Bright, energetic summer festival vibes',
        prompt: 'summer festival fashion, bright sunlight, vibrant colors, outdoor setting',
        style: 'bright, energetic, warm',
        icon: Sun,
        examples: ['summer1.jpg', 'summer2.jpg']
      },
      {
        id: 'autumn-earth',
        name: 'Autumn Earth Tones',
        category: 'Seasonal Moods',
        description: 'Warm, earthy autumn palette',
        prompt: 'autumn fashion, earth tones, fallen leaves, golden light, cozy textures',
        style: 'warm, earthy, textured',
        icon: Palette,
        examples: ['autumn1.jpg', 'autumn2.jpg']
      },
      {
        id: 'midnight-rave',
        name: 'Midnight Rave',
        category: 'Seasonal Moods',
        description: 'Dark, neon-lit night festival aesthetic',
        prompt: 'night festival, neon lights, dark background, glowing accessories, UV reactive',
        style: 'dark, neon, electric',
        icon: Moon,
        examples: ['night1.jpg', 'night2.jpg']
      }
    ],
    'AI Experimental': [
      {
        id: 'neural-dreams',
        name: 'Neural Network Dreams',
        category: 'AI Experimental',
        description: 'Abstract AI-generated patterns',
        prompt: 'neural network visualization, abstract patterns, data-inspired fashion, digital art',
        style: 'abstract, digital, experimental',
        icon: Cpu,
        examples: ['neural1.jpg', 'neural2.jpg']
      },
      {
        id: 'glitch-art',
        name: 'Glitch Aesthetic',
        category: 'AI Experimental',
        description: 'Digital glitch and corruption effects',
        prompt: 'glitch art fashion, digital corruption, RGB shift, pixelated elements',
        style: 'glitchy, digital, distorted',
        icon: Zap,
        examples: ['glitch1.jpg', 'glitch2.jpg']
      },
      {
        id: 'quantum-fashion',
        name: 'Quantum Fashion',
        category: 'AI Experimental',
        description: 'Quantum-inspired impossible geometries',
        prompt: 'quantum physics inspired, impossible geometry, fractal patterns, multidimensional',
        style: 'surreal, mathematical, mind-bending',
        icon: Sparkles,
        examples: ['quantum1.jpg', 'quantum2.jpg']
      }
    ]
  }

  const allTemplates: StyleTemplate[] = Object.values(styleCategories).flat()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateImage = async (template?: StyleTemplate) => {
    setIsGenerating(true)
    
    // Combine all settings into a comprehensive prompt
    const fullPrompt = `
      ${template ? template.prompt : customPrompt}
      Style: ${imageSettings.style}
      Color Palette: ${imageSettings.colorPalette}
      Lighting: ${imageSettings.lighting}
      Composition: ${imageSettings.composition}
      Mood: ${imageSettings.mood}
      Artistic Style: ${imageSettings.artisticStyle}
      Camera Angle: ${imageSettings.cameraAngle}
      Time of Day: ${imageSettings.timeOfDay}
      Season: ${imageSettings.season}
      Texture: ${imageSettings.texture}
      Pattern: ${imageSettings.pattern}
      Cultural Influence: ${imageSettings.culturalInfluence}
      Additional: ${freeformText}
    `.trim()
    
    // Simulate AI generation
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: `https://source.unsplash.com/800x800/?fashion,${template?.style || 'artistic'}`,
        prompt: fullPrompt,
        style: template?.name || 'Custom',
        timestamp: new Date().toISOString(),
        settings: { ...imageSettings }
      }
      
      setGeneratedImages(prev => [newImage, ...prev])
      setIsGenerating(false)
    }, 2000)
  }

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `koby-design-${Date.now()}.jpg`
    link.click()
  }

  return (
    <div style={{
      padding: '40px',
      background: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '40px' }}
      >
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#000000',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Sparkles size={32} style={{ color: '#000000' }} />
          AI Image Studio Pro
        </h1>
        <p style={{ color: '#666666', fontSize: '16px' }}>
          Generate unique fashion designs with advanced AI customization
        </p>
      </motion.div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
        borderBottom: `1px solid ${'#e0e0e0'}`,
        paddingBottom: '16px'
      }}>
        {(['generate', 'enhance', 'gallery'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab ? '#000000' : 'transparent',
              color: activeTab === tab ? 'white' : '#000000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          {/* Settings Panel */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${'#e0e0e0'}`,
            height: 'fit-content'
          }}>
            <h3 style={{ color: '#000000', marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>
              <Sliders size={20} style={{ display: 'inline', marginRight: '8px' }} />
              Advanced Settings
            </h3>

            {/* Category Filter */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#666666', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                Style Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: `1px solid ${'#e0e0e0'}`,
                  color: '#000000',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Categories</option>
                {Object.keys(styleCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Image Settings */}
            {Object.entries({
              'Color Palette': ['vibrant', 'muted', 'monochrome', 'pastel', 'earth-tones', 'neon'],
              'Lighting': ['golden-hour', 'studio', 'natural', 'dramatic', 'soft', 'harsh'],
              'Mood': ['energetic', 'calm', 'mysterious', 'playful', 'elegant', 'edgy'],
              'Cultural Influence': ['african', 'asian', 'european', 'latin', 'middle-eastern', 'fusion'],
              'Camera Angle': ['eye-level', 'low-angle', 'high-angle', 'dutch-angle', 'birds-eye', 'close-up'],
              'Texture': ['smooth', 'rough', 'glossy', 'matte', 'metallic', 'organic']
            }).map(([setting, options]) => (
              <div key={setting} style={{ marginBottom: '16px' }}>
                <label style={{ 
                  color: '#666666', 
                  fontSize: '12px', 
                  display: 'block', 
                  marginBottom: '8px' 
                }}>
                  {setting}
                </label>
                <select
                  value={imageSettings[setting.toLowerCase().replace(' ', '-') as keyof ImageSettings]}
                  onChange={(e) => setImageSettings(prev => ({
                    ...prev,
                    [setting.toLowerCase().replace(' ', '-')]: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: `1px solid ${'#e0e0e0'}`,
                    color: '#000000',
                    fontSize: '13px'
                  }}
                >
                  {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}

            {/* Free-form Text Input */}
            <div style={{ marginTop: '24px' }}>
              <label style={{ 
                color: '#666666', 
                fontSize: '12px', 
                display: 'block', 
                marginBottom: '8px' 
              }}>
                Additional Instructions (Free Text)
              </label>
              <textarea
                value={freeformText}
                onChange={(e) => setFreeformText(e.target.value)}
                placeholder="Add any specific details, references, or creative ideas..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: `1px solid ${'#e0e0e0'}`,
                  color: '#000000',
                  fontSize: '13px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Custom Prompt */}
            <div style={{ marginTop: '24px' }}>
              <label style={{ 
                color: '#666666', 
                fontSize: '12px', 
                display: 'block', 
                marginBottom: '8px' 
              }}>
                Custom Prompt Override
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter a complete custom prompt..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  border: `1px solid ${'#e0e0e0'}`,
                  color: '#000000',
                  fontSize: '13px',
                  resize: 'vertical'
                }}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => generateImage()}
                disabled={isGenerating || !customPrompt}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '12px',
                  background: customPrompt 
                    ? `linear-gradient(135deg, ${'#000000'}, ${'#333333'})`
                    : '#ffffff',
                  color: customPrompt ? 'white' : '#666666',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: customPrompt ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isGenerating ? <Loader className="spin" size={16} /> : <Wand2 size={16} />}
                Generate with Custom Prompt
              </motion.button>
            </div>
          </div>

          {/* Templates Grid */}
          <div>
            <h3 style={{ 
              color: '#000000', 
              marginBottom: '24px', 
              fontSize: '20px', 
              fontWeight: '600' 
            }}>
              Style Templates
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {allTemplates
                .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
                .map(template => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => generateImage(template)}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '16px',
                      border: `1px solid ${'#e0e0e0'}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ color: '#000000' }}>
                        <template.icon size={24} />
                      </div>
                      <span style={{
                        fontSize: '10px',
                        color: '#666666',
                        background: '#ffffff',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        {template.category}
                      </span>
                    </div>
                    <h4 style={{
                      color: '#000000',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      {template.name}
                    </h4>
                    <p style={{
                      color: '#666666',
                      fontSize: '12px',
                      lineHeight: '1.4'
                    }}>
                      {template.description}
                    </p>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {generatedImages.map(image => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: `1px solid ${'#e0e0e0'}`
                }}
              >
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundImage: `url(${image.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                <div style={{ padding: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      color: '#000000',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {image.style}
                    </span>
                    <button
                      onClick={() => downloadImage(image.url)}
                      style={{
                        background: '#000000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                  <p style={{
                    color: '#666666',
                    fontSize: '11px',
                    marginBottom: '8px'
                  }}>
                    {new Date(image.timestamp).toLocaleString()}
                  </p>
                  <details style={{ color: '#666666', fontSize: '11px' }}>
                    <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                      View Settings
                    </summary>
                    <pre style={{
                      background: '#ffffff',
                      padding: '8px',
                      borderRadius: '6px',
                      overflow: 'auto',
                      fontSize: '10px'
                    }}>
                      {JSON.stringify(image.settings, null, 2)}
                    </pre>
                  </details>
                </div>
              </motion.div>
            ))}
          </div>

          {generatedImages.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#666666'
            }}>
              <Image size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No images generated yet. Start creating!</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default ImageStudioEnhanced