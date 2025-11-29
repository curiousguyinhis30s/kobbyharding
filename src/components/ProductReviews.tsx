import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, User, CheckCircle } from 'lucide-react'
import useReviewStore from '../stores/useReviewStore'
import { useToast } from './Toast'

interface ProductReviewsProps {
  productId: string
  isMobile?: boolean
}

const ProductReviews = ({ productId, isMobile = false }: ProductReviewsProps) => {
  const {
    getReviewsByProduct,
    addReview,
    markHelpful,
    getAverageRating,
    getRatingDistribution
  } = useReviewStore()
  const { addToast } = useToast()

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
    author: ''
  })

  const reviews = getReviewsByProduct(productId) || []
  const averageRating = getAverageRating(productId) || 0
  const distribution = getRatingDistribution(productId) || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  const totalReviews = reviews?.length || 0

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.author) {
      addToast('error', 'Please fill in all fields')
      return
    }

    addReview({
      productId,
      rating: formData.rating,
      title: formData.title,
      content: formData.content,
      author: formData.author,
      verified: false
    })

    addToast('success', 'Review submitted successfully!')
    setFormData({ rating: 5, title: '', content: '', author: '' })
    setShowReviewForm(false)
  }

  const handleMarkHelpful = (reviewId: string) => {
    markHelpful(reviewId)
    addToast('success', 'Thanks for your feedback!')
  }

  const renderStars = (rating: number, size: number = 16, interactive: boolean = false) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              fill: star <= rating ? '#f59e0b' : 'none',
              stroke: star <= rating ? '#f59e0b' : 'rgba(255, 255, 255, 0.3)',
              cursor: interactive ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
          />
        ))}
      </div>
    )
  }

  const sectionStyle = {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: isMobile ? '24px 16px' : '32px 24px',
    marginTop: isMobile ? '24px' : '40px',
    borderRadius: '0'
  }

  const reviewCardStyle = {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: isMobile ? '16px' : '20px',
    marginBottom: '16px',
    borderRadius: '0',
    transition: 'all 0.3s'
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0',
    color: '#ffffff',
    fontSize: isMobile ? '13px' : '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.3s'
  }

  const buttonStyle = {
    padding: isMobile ? '10px 20px' : '12px 24px',
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    fontSize: isMobile ? '11px' : '13px',
    fontWeight: '300' as const,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    borderRadius: '0',
    transition: 'all 0.3s'
  }

  return (
    <div style={sectionStyle}>
      {/* Rating Summary */}
      <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
        <h2 style={{
          fontSize: isMobile ? '16px' : '20px',
          fontWeight: '300',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '20px',
          color: '#ffffff'
        }}>
          Customer Reviews
        </h2>

        {totalReviews > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '200px 1fr',
            gap: isMobile ? '20px' : '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Average Rating */}
            <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
              <div style={{
                fontSize: isMobile ? '36px' : '48px',
                fontWeight: '200',
                color: '#ffffff',
                marginBottom: '8px'
              }}>
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating), isMobile ? 18 : 20)}
              <div style={{
                fontSize: isMobile ? '11px' : '13px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '8px'
              }}>
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>

            {/* Rating Distribution */}
            <div>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distribution[rating]
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                return (
                  <div key={rating} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '8px' : '12px',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      minWidth: isMobile ? '40px' : '50px',
                      fontSize: isMobile ? '11px' : '13px',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      {rating}
                      <Star style={{
                        width: '12px',
                        height: '12px',
                        fill: '#f59e0b',
                        stroke: '#f59e0b'
                      }} />
                    </div>
                    <div style={{
                      flex: 1,
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: rating * 0.1 }}
                        style={{
                          height: '100%',
                          background: 'linear-gradient(to right, #f59e0b, #d97706)',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                    <div style={{
                      minWidth: isMobile ? '30px' : '40px',
                      fontSize: isMobile ? '11px' : '13px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'right'
                    }}>
                      {count}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: isMobile ? '24px' : '32px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: isMobile ? '13px' : '14px'
          }}>
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>

      {/* Write Review Button */}
      <div style={{ marginBottom: isMobile ? '24px' : '32px', textAlign: 'center' }}>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          style={{
            ...buttonStyle,
            background: showReviewForm ? 'transparent' : '#ffffff',
            border: showReviewForm ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
            color: showReviewForm ? '#ffffff' : '#000000'
          }}
          onMouseEnter={(e) => {
            if (!showReviewForm) {
              e.currentTarget.style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {showReviewForm ? 'CANCEL' : 'WRITE A REVIEW'}
        </button>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              marginBottom: isMobile ? '24px' : '32px'
            }}
          >
            <form onSubmit={handleSubmitReview} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: isMobile ? '20px' : '24px',
              borderRadius: '0'
            }}>
              <h3 style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '300',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                color: '#ffffff'
              }}>
                Share Your Experience
              </h3>

              {/* Rating */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: isMobile ? '11px' : '13px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '8px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  Your Rating *
                </label>
                {renderStars(formData.rating, isMobile ? 24 : 28, true)}
              </div>

              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: isMobile ? '11px' : '13px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '8px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Enter your name"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                  required
                />
              </div>

              {/* Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: isMobile ? '11px' : '13px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '8px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  Review Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Summarize your experience"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                  required
                />
              </div>

              {/* Content */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: isMobile ? '11px' : '13px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '8px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  Your Review *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tell us what you think about this piece..."
                  rows={isMobile ? 4 : 5}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                  required
                />
              </div>

              <button
                type="submit"
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(249, 115, 22, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                SUBMIT REVIEW
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {reviews && reviews.length > 0 && (
        <div>
          <h3 style={{
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: '300',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            All Reviews ({totalReviews})
          </h3>

          {reviews.map((review, index) => review && (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={reviewCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Review Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                gap: isMobile ? '8px' : '0'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <User style={{
                      width: isMobile ? '16px' : '18px',
                      height: isMobile ? '16px' : '18px',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }} />
                    <span style={{
                      fontSize: isMobile ? '13px' : '14px',
                      fontWeight: '400',
                      color: '#ffffff'
                    }}>
                      {review?.author || 'Anonymous'}
                    </span>
                    {review?.verified && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        color: '#10b981',
                        letterSpacing: '0.05em'
                      }}>
                        <CheckCircle style={{ width: '12px', height: '12px' }} />
                        VERIFIED
                      </span>
                    )}
                  </div>
                  {renderStars(review.rating, isMobile ? 14 : 16)}
                </div>
                <div style={{
                  fontSize: isMobile ? '10px' : '11px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.05em'
                }}>
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {/* Review Title */}
              {review?.title && (
                <h4 style={{
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: '400',
                  color: '#ffffff',
                  marginBottom: '8px',
                  letterSpacing: '0.02em'
                }}>
                  {review.title}
                </h4>
              )}

              {/* Review Content */}
              {review?.content && (
                <p style={{
                  fontSize: isMobile ? '12px' : '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6',
                  marginBottom: '16px'
                }}>
                  {review.content}
                </p>
              )}

              {/* Helpful Button */}
              {review?.id && (
                <button
                  onClick={() => handleMarkHelpful(review.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: isMobile ? '10px' : '11px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  <ThumbsUp style={{ width: '12px', height: '12px' }} />
                  Helpful ({review?.helpfulCount || 0})
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductReviews
