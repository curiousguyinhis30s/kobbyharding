import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import type { Piece } from '../../stores/useStore'

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  story: z.string().min(10, 'Story must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  fabricOrigin: z.string().min(3, 'Fabric origin is required'),
  denimType: z.string().min(3, 'Denim type is required'),
  vibe: z.string().min(3, 'Vibe is required'),
  category: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL'),
  createdFor: z.string().min(3, 'Created for description is required'),
  currentLocation: z.string().min(2, 'Location is required'),
  weight: z.number().min(0, 'Weight must be positive')
})

interface ProductFormProps {
  product?: Piece | null
  onSave: (product: Omit<Piece, 'id' | 'views' | 'hearts' | 'inquiries'> | Partial<Piece>) => void
  onCancel: () => void
  isEdit?: boolean
}

const categories = [
  't-shirts',
  'kh-specials',
  'limited',
  'denims',
  'kh-tailored',
  'khlassic-suits'
]

const ProductForm = ({ product, onSave, onCancel, isEdit = false }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    story: product?.story || '',
    price: product?.price || 0,
    fabricOrigin: product?.fabricOrigin || '',
    denimType: product?.denimType || '',
    vibe: product?.vibe || '',
    category: product?.category || '',
    imageUrl: product?.imageUrl || '',
    createdFor: product?.createdFor || '',
    currentLocation: product?.currentLocation || 'Bangkok',
    weight: product?.weight || 0,
    available: product?.available ?? true,
    videoUrl: product?.videoUrl || '',
    voiceNoteUrl: product?.voiceNoteUrl || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => ({ ...prev, [field]: true }))

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = () => {
    try {
      productSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouched(allTouched)

    if (validate()) {
      onSave(formData)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            color: '#000'
          }}>
            {isEdit ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            {/* Name */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                PRODUCT NAME *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${touched.name && errors.name ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
              {touched.name && errors.name && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  color: '#ef4444',
                  fontSize: '12px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Story */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                STORY *
              </label>
              <textarea
                value={formData.story}
                onChange={(e) => handleChange('story', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${touched.story && errors.story ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              {touched.story && errors.story && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  color: '#ef4444',
                  fontSize: '12px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.story}
                </div>
              )}
            </div>

            {/* Price */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                PRICE (USD) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${touched.price && errors.price ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
              {touched.price && errors.price && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  color: '#ef4444',
                  fontSize: '12px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.price}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                CATEGORY
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none',
                  background: '#fff'
                }}
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Vibe */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                VIBE *
              </label>
              <input
                type="text"
                value={formData.vibe}
                onChange={(e) => handleChange('vibe', e.target.value)}
                placeholder="e.g., Bold confidence"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${touched.vibe && errors.vibe ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
              {touched.vibe && errors.vibe && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  color: '#ef4444',
                  fontSize: '12px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.vibe}
                </div>
              )}
            </div>

            {/* Fabric Origin */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                FABRIC ORIGIN *
              </label>
              <input
                type="text"
                value={formData.fabricOrigin}
                onChange={(e) => handleChange('fabricOrigin', e.target.value)}
                placeholder="e.g., Kente cloth from Ghana"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${touched.fabricOrigin && errors.fabricOrigin ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
              {touched.fabricOrigin && errors.fabricOrigin && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  color: '#ef4444',
                  fontSize: '12px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.fabricOrigin}
                </div>
              )}
            </div>

            {/* Denim Type */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                DENIM TYPE *
              </label>
              <input
                type="text"
                value={formData.denimType}
                onChange={(e) => handleChange('denimType', e.target.value)}
                placeholder="e.g., 21oz Japanese selvedge"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${touched.denimType && errors.denimType ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
              {touched.denimType && errors.denimType && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  color: '#ef4444',
                  fontSize: '12px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.denimType}
                </div>
              )}
            </div>

            {/* Created For */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                CREATED FOR *
              </label>
              <input
                type="text"
                value={formData.createdFor}
                onChange={(e) => handleChange('createdFor', e.target.value)}
                placeholder="e.g., The soul who walks into rooms and changes the energy"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${touched.createdFor && errors.createdFor ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
              {touched.createdFor && errors.createdFor && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  color: '#ef4444',
                  fontSize: '12px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.createdFor}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                CURRENT LOCATION *
              </label>
              <input
                type="text"
                value={formData.currentLocation}
                onChange={(e) => handleChange('currentLocation', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${touched.currentLocation && errors.currentLocation ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
              {touched.currentLocation && errors.currentLocation && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  color: '#ef4444',
                  fontSize: '12px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.currentLocation}
                </div>
              )}
            </div>

            {/* Weight */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                WEIGHT (KG) *
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                min="0"
                step="0.1"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${touched.weight && errors.weight ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
              {touched.weight && errors.weight && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  color: '#ef4444',
                  fontSize: '12px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.weight}
                </div>
              )}
            </div>

            {/* Image URL */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                IMAGE URL *
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: `1px solid ${touched.imageUrl && errors.imageUrl ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '300',
                    outline: 'none'
                  }}
                />
                {formData.imageUrl && (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb'
                  }}>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23e5e7eb" width="48" height="48"/%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                )}
              </div>
              {touched.imageUrl && errors.imageUrl && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  color: '#ef4444',
                  fontSize: '12px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  {errors.imageUrl}
                </div>
              )}
            </div>

            {/* Video URL (optional) */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                VIDEO URL (OPTIONAL)
              </label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="https://example.com/video.mp4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
            </div>

            {/* Voice Note URL (optional) */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                VOICE NOTE URL (OPTIONAL)
              </label>
              <input
                type="text"
                value={formData.voiceNoteUrl}
                onChange={(e) => handleChange('voiceNoteUrl', e.target.value)}
                placeholder="https://example.com/audio.mp3"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '300',
                  outline: 'none'
                }}
              />
            </div>

            {/* Available Toggle */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => handleChange('available', e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.05em',
                  color: '#000'
                }}>
                  Available for Purchase
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              color: '#6b7280',
              fontSize: '13px',
              fontWeight: '300',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            CANCEL
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            style={{
              padding: '12px 24px',
              background: '#000',
              border: '1px solid #000',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '300',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {isEdit ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductForm
