import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Image, Palette, Type, Layout, Camera, Download, Info, Check, X, Copy } from 'lucide-react'

const BrandGuidelines = () => {
  const navigate = useNavigate()
  const [copiedItem, setCopiedItem] = useState('')

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(item)
    setTimeout(() => setCopiedItem(''), 2000)
  }

  const imageSpecs = [
    {
      category: 'PRODUCT IMAGES',
      specs: [
        { type: 'Main Product Photo', dimensions: '1200 x 1500 px', ratio: '4:5', format: 'JPG/PNG', size: '< 500KB', note: 'White or transparent background preferred' },
        { type: 'Product Gallery', dimensions: '1200 x 1500 px', ratio: '4:5', format: 'JPG/PNG', size: '< 500KB', note: 'Max 6 images per product' },
        { type: 'Product Thumbnail', dimensions: '400 x 500 px', ratio: '4:5', format: 'JPG', size: '< 100KB', note: 'Auto-generated from main image' }
      ]
    },
    {
      category: 'HERO IMAGES',
      specs: [
        { type: 'Homepage Hero', dimensions: '1920 x 1080 px', ratio: '16:9', format: 'JPG', size: '< 1MB', note: 'Dark overlay will be applied' },
        { type: 'Collection Banner', dimensions: '1920 x 600 px', ratio: '16:5', format: 'JPG', size: '< 800KB', note: 'Minimal text overlay' },
        { type: 'Mobile Hero', dimensions: '800 x 1200 px', ratio: '2:3', format: 'JPG', size: '< 400KB', note: 'Portrait orientation' }
      ]
    },
    {
      category: 'FESTIVAL IMAGES',
      specs: [
        { type: 'Festival Card', dimensions: '800 x 600 px', ratio: '4:3', format: 'JPG', size: '< 300KB', note: 'Vibrant, high energy shots' },
        { type: 'Festival Hero', dimensions: '1600 x 900 px', ratio: '16:9', format: 'JPG', size: '< 600KB', note: 'Crowd or venue shots' }
      ]
    },
    {
      category: 'SOCIAL MEDIA',
      specs: [
        { type: 'Instagram Post', dimensions: '1080 x 1080 px', ratio: '1:1', format: 'JPG', size: '< 300KB', note: 'Square format' },
        { type: 'Instagram Story', dimensions: '1080 x 1920 px', ratio: '9:16', format: 'JPG', size: '< 400KB', note: 'Vertical format' }
      ]
    }
  ]

  const colorPalette = [
    { name: 'Primary Black', hex: '#000000', rgb: 'rgb(0, 0, 0)', usage: 'Background, text' },
    { name: 'Pure White', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', usage: 'Text, buttons' },
    { name: 'Light Gray', hex: '#666666', rgb: 'rgb(102, 102, 102)', usage: 'Subtle text' },
    { name: 'Border Gray', hex: '#1A1A1A', rgb: 'rgb(26, 26, 26)', usage: 'Borders, dividers' },
    { name: 'Success Green', hex: '#4ADE80', rgb: 'rgb(74, 222, 128)', usage: 'Success states only' },
    { name: 'Error Red', hex: '#FF6B6B', rgb: 'rgb(255, 107, 107)', usage: 'Error states only' }
  ]

  const typography = [
    { name: 'Display', size: '60-180px', weight: '100', spacing: '0.05em', usage: 'Hero titles' },
    { name: 'Headline', size: '32-48px', weight: '100', spacing: '0.2em', usage: 'Section headers' },
    { name: 'Title', size: '24-28px', weight: '200', spacing: '0.2em', usage: 'Page titles' },
    { name: 'Subtitle', size: '18-20px', weight: '300', spacing: '0.15em', usage: 'Subtitles' },
    { name: 'Body', size: '14-16px', weight: '400', spacing: '0.1em', usage: 'Body text' },
    { name: 'Caption', size: '11-12px', weight: '400', spacing: '0.2em', usage: 'Small text, labels' },
    { name: 'Button', size: '11-13px', weight: '400', spacing: '0.25em', usage: 'CTA buttons' }
  ]

  const guidelines = [
    {
      title: 'PHOTOGRAPHY STYLE',
      rules: [
        'High contrast black & white for lifestyle shots',
        'Clean product shots on white/neutral background',
        'Natural lighting preferred over studio lighting',
        'Minimal props - let the garment speak',
        'Show diversity in models and body types',
        'Capture movement for dance-related shots'
      ]
    },
    {
      title: 'TONE OF VOICE',
      rules: [
        'Minimal and sophisticated',
        'Confident but not arrogant',
        'Inclusive and welcoming',
        'Focus on quality over quantity',
        'Emphasize craftsmanship and heritage',
        'Use UPPERCASE for emphasis sparingly'
      ]
    },
    {
      title: 'DESIGN PRINCIPLES',
      rules: [
        'Minimalism is key - less is more',
        'Black & white only - no colors except in product images',
        'Generous white space for breathing room',
        'Light font weights (100-400 max)',
        'Wide letter spacing for elegance',
        'Seamless grid layouts with thin borders'
      ]
    },
    {
      title: 'CONTENT GUIDELINES',
      rules: [
        'Product names: Simple, descriptive (e.g., "Sunset Warrior")',
        'Descriptions: 2-3 sentences max, focus on feeling',
        'Prices: No decimal points for whole numbers',
        'Categories: Single word when possible',
        'CTAs: ALL CAPS, wide letter spacing',
        'Error messages: Helpful, not technical'
      ]
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      color: '#000'
    }}>
      {/* Header */}
      <section style={{
        padding: '40px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '100',
              letterSpacing: '0.2em',
              marginBottom: '8px'
            }}>
              BRAND GUIDELINES
            </h1>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              letterSpacing: '0.1em'
            }}>
              Visual identity and content standards for Koby's Threads
            </p>
          </div>

          <button
            onClick={() => navigate('/admin')}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid #d1d5db',
              color: '#000',
              fontSize: '11px',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#000'
              e.currentTarget.style.background = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            BACK TO ADMIN
          </button>
        </div>
      </section>

      {/* Image Specifications */}
      <section style={{
        padding: '60px 40px',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px'
          }}>
            <Camera style={{ width: '24px', height: '24px', opacity: 0.6 }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '100',
              letterSpacing: '0.2em'
            }}>
              IMAGE SPECIFICATIONS
            </h2>
          </div>

          {/* Important Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'start',
            gap: '12px',
            padding: '20px',
            background: 'rgba(74, 222, 128, 0.05)',
            border: '1px solid rgba(74, 222, 128, 0.2)',
            marginBottom: '40px'
          }}>
            <Info style={{ width: '20px', height: '20px', color: '#4ade80', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{
                fontSize: '12px',
                letterSpacing: '0.15em',
                marginBottom: '8px',
                color: '#4ade80'
              }}>
                OPTIMAL IMAGE GUIDELINES
              </h4>
              <p style={{
                fontSize: '11px',
                lineHeight: '1.6',
                opacity: 0.8
              }}>
                Following these specifications ensures fast loading, consistent display across devices, 
                and professional presentation. Images outside these specs will be automatically resized 
                but may lose quality.
              </p>
            </div>
          </div>

          {imageSpecs.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              style={{
                marginBottom: '40px'
              }}
            >
              <h3 style={{
                fontSize: '14px',
                letterSpacing: '0.2em',
                marginBottom: '20px',
                opacity: 0.7
              }}>
                {category.category}
              </h3>

              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                {category.specs.map((spec, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '200px 150px 80px 100px 100px 1fr',
                      gap: '20px',
                      padding: '16px 20px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      alignItems: 'center',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db'
                      e.currentTarget.style.background = '#f9fafb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.background = '#f9fafb'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '300' }}>{spec.type}</div>
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      fontFamily: 'monospace',
                      opacity: 0.8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {spec.dimensions}
                      <button
                        onClick={() => copyToClipboard(spec.dimensions, spec.type)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedItem === spec.type ? '#4ade80' : 'rgba(255, 255, 255, 0.3)',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                      >
                        {copiedItem === spec.type ? 
                          <Check style={{ width: '12px', height: '12px' }} /> :
                          <Copy style={{ width: '12px', height: '12px' }} />
                        }
                      </button>
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>{spec.ratio}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>{spec.format}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>{spec.size}</div>
                    <div style={{ fontSize: '10px', opacity: 0.5, fontStyle: 'italic' }}>{spec.note}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Quick Upload Guide */}
          <div style={{
            padding: '24px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            marginTop: '40px'
          }}>
            <h4 style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              marginBottom: '16px'
            }}>
              QUICK UPLOAD CHECKLIST
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {[
                '✓ Check dimensions match specifications',
                '✓ Optimize file size (use TinyPNG or similar)',
                '✓ Use consistent naming: product-name-01.jpg',
                '✓ Ensure good lighting and sharp focus',
                '✓ Remove backgrounds for product shots',
                '✓ Maintain consistent style across sets'
              ].map((item, index) => (
                <div key={index} style={{
                  fontSize: '11px',
                  opacity: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section style={{
        padding: '60px 40px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px'
          }}>
            <Palette style={{ width: '24px', height: '24px', opacity: 0.6 }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '100',
              letterSpacing: '0.2em'
            }}>
              COLOR PALETTE
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {colorPalette.map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                style={{
                  border: '1px solid #d1d5db',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  height: '100px',
                  background: color.hex,
                  border: color.hex === '#FFFFFF' ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'
                }} />
                <div style={{
                  padding: '16px',
                  background: '#f9fafb'
                }}>
                  <h4 style={{
                    fontSize: '12px',
                    fontWeight: '300',
                    marginBottom: '8px'
                  }}>
                    {color.name}
                  </h4>
                  <div style={{
                    fontSize: '10px',
                    opacity: 0.6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'monospace' }}>{color.hex}</span>
                      <button
                        onClick={() => copyToClipboard(color.hex, color.name)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedItem === color.name ? '#4ade80' : 'rgba(255, 255, 255, 0.3)',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                      >
                        {copiedItem === color.name ? 
                          <Check style={{ width: '10px', height: '10px' }} /> :
                          <Copy style={{ width: '10px', height: '10px' }} />
                        }
                      </button>
                    </div>
                    <span style={{ fontFamily: 'monospace' }}>{color.rgb}</span>
                    <span style={{ fontStyle: 'italic', marginTop: '4px' }}>
                      {color.usage}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section style={{
        padding: '60px 40px',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px'
          }}>
            <Type style={{ width: '24px', height: '24px', opacity: 0.6 }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '100',
              letterSpacing: '0.2em'
            }}>
              TYPOGRAPHY
            </h2>
          </div>

          <div style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            marginBottom: '40px',
            padding: '24px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{
              fontSize: '14px',
              opacity: 0.7,
              marginBottom: '12px'
            }}>
              PRIMARY FONT FAMILY
            </p>
            <p style={{
              fontSize: '24px',
              fontWeight: '100',
              letterSpacing: '0.1em'
            }}>
              System UI / San Francisco / Segoe UI
            </p>
          </div>

          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {typography.map((type, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 120px 100px 120px 1fr',
                  gap: '20px',
                  padding: '20px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  fontSize: '12px',
                  fontWeight: '300'
                }}>
                  {type.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  opacity: 0.7
                }}>
                  {type.size}
                </div>
                <div style={{
                  fontSize: '11px',
                  opacity: 0.7
                }}>
                  Weight: {type.weight}
                </div>
                <div style={{
                  fontSize: '11px',
                  opacity: 0.7
                }}>
                  Spacing: {type.spacing}
                </div>
                <div style={{
                  fontSize: '10px',
                  opacity: 0.5,
                  fontStyle: 'italic'
                }}>
                  {type.usage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section style={{
        padding: '60px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px'
          }}>
            <Layout style={{ width: '24px', height: '24px', opacity: 0.6 }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '100',
              letterSpacing: '0.2em'
            }}>
              BRAND GUIDELINES
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '40px'
          }}>
            {guidelines.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  padding: '24px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb'
                }}
              >
                <h3 style={{
                  fontSize: '14px',
                  letterSpacing: '0.2em',
                  marginBottom: '20px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  {section.title}
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0
                }}>
                  {section.rules.map((rule, idx) => (
                    <li key={idx} style={{
                      fontSize: '11px',
                      lineHeight: '1.8',
                      opacity: 0.7,
                      marginBottom: '8px',
                      paddingLeft: '20px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        opacity: 0.4
                      }}>•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section style={{
        padding: '60px 40px',
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <Download style={{
            width: '32px',
            height: '32px',
            margin: '0 auto 24px',
            opacity: 0.6
          }} />
          
          <h3 style={{
            fontSize: '20px',
            fontWeight: '100',
            letterSpacing: '0.2em',
            marginBottom: '16px'
          }}>
            BRAND ASSETS
          </h3>
          
          <p style={{
            fontSize: '12px',
            opacity: 0.6,
            marginBottom: '32px',
            lineHeight: '1.8'
          }}>
            Download logos, templates, and brand assets for consistent communication
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              style={{
                padding: '14px 32px',
                background: 'transparent',
                border: '1px solid #d1d5db',
                color: '#000',
                fontSize: '11px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#000'
                e.currentTarget.style.background = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              LOGO PACK
            </button>
            
            <button
              style={{
                padding: '14px 32px',
                background: 'transparent',
                border: '1px solid #d1d5db',
                color: '#000',
                fontSize: '11px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#000'
                e.currentTarget.style.background = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              TEMPLATES
            </button>
            
            <button
              style={{
                padding: '14px 32px',
                background: '#fff',
                border: 'none',
                color: '#000',
                fontSize: '11px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              FULL BRAND GUIDE PDF
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BrandGuidelines