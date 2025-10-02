import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Music, Users, Globe, ChevronRight, Package, Check, X, ShoppingBag } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import useStore from '../stores/useStore'

const FestivalPickupMinimal = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { pieces, addTryOnReservation, getTryOnReservations } = useStore()
  const [selectedFestival, setSelectedFestival] = useState<string | null>(null)
  const [showTryOnModal, setShowTryOnModal] = useState(false)
  const [selectedPieces, setSelectedPieces] = useState<string[]>([])
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const festivals = [
    { 
      id: 'bangkok',
      name: 'BANGKOK KIZOMBA', 
      date: 'MAR 15-17', 
      location: 'Thailand',
      venue: 'Siam Paragon Convention Center',
      description: 'The biggest Kizomba festival in Southeast Asia',
      attendees: '500+ dancers',
      image: '/kobby-assets/models/IMG_3534.JPG'
    },
    { 
      id: 'singapore',
      name: 'SINGAPORE URBAN KIZ', 
      date: 'APR 5-7', 
      location: 'Singapore',
      venue: 'Marina Bay Sands',
      description: 'Urban Kiz meets modern city vibes',
      attendees: '300+ dancers',
      image: '/kobby-assets/models/IMG_3543.JPG'
    },
    { 
      id: 'bali',
      name: 'BALI TARRAXO FEST', 
      date: 'MAY 10-12', 
      location: 'Indonesia',
      venue: 'Potato Head Beach Club',
      description: 'Dance paradise meets tropical vibes',
      attendees: '400+ dancers',
      image: '/kobby-assets/models/IMG_3591.JPG'
    },
    { 
      id: 'tokyo',
      name: 'TOKYO KIZOMBA WEEK', 
      date: 'JUN 21-23', 
      location: 'Japan',
      venue: 'Shibuya Stream Hall',
      description: 'Where tradition meets modern dance',
      attendees: '250+ dancers',
      image: '/kobby-assets/models/IMG_3622.JPG'
    },
    { 
      id: 'seoul',
      name: 'SEOUL URBAN FEST', 
      date: 'JUL 12-14', 
      location: 'South Korea',
      venue: 'Gangnam COEX',
      description: 'K-culture meets African rhythm',
      attendees: '350+ dancers',
      image: '/kobby-assets/models/IMG_3670.JPG'
    },
    { 
      id: 'hongkong',
      name: 'HONG KONG KIZ', 
      date: 'AUG 9-11', 
      location: 'Hong Kong',
      venue: 'Central Harbourfront',
      description: 'Dancing with the skyline',
      attendees: '280+ dancers',
      image: '/kobby-assets/models/IMG_3679.JPG'
    }
  ]

  const handleTryOnReservation = (festivalId: string) => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    setSelectedFestival(festivalId)
    setShowTryOnModal(true)
    setSelectedPieces([])
  }

  const togglePieceSelection = (pieceId: string) => {
    if (selectedPieces.includes(pieceId)) {
      setSelectedPieces(selectedPieces.filter(id => id !== pieceId))
    } else if (selectedPieces.length < 5) {
      setSelectedPieces([...selectedPieces, pieceId])
    }
  }

  const submitTryOnRequest = () => {
    if (selectedPieces.length === 0) return
    
    const festival = festivals.find(f => f.id === selectedFestival)
    if (festival && isAuthenticated) {
      // Add each selected piece as a try-on reservation
      selectedPieces.forEach(pieceId => {
        addTryOnReservation(pieceId, festival.id)
      })
      
      setShowTryOnModal(false)
      setSelectedPieces([])
      setConfirmationMessage(`Your try-on request for ${festival.name} has been submitted! Koby will contact you soon.`)
      
      setTimeout(() => {
        setConfirmationMessage('')
      }, 5000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff'
    }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)'
        }} />
        
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '800px',
            padding: '0 40px'
          }}
        >
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: '100',
            letterSpacing: '0.3em',
            marginBottom: '20px'
          }}>
            FESTIVAL
          </h1>
          
          <h2 style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: '600',
            letterSpacing: '0.3em',
            marginBottom: '30px'
          }}>
            PICKUP
          </h2>

          <p style={{
            fontSize: '14px',
            lineHeight: '1.8',
            opacity: 0.8,
            letterSpacing: '0.1em',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Meet Koby at Kizomba festivals across Asia. 
            Try on pieces, feel the fabric, and take home your perfect festival outfit.
          </p>
        </motion.div>
      </section>

      {/* Confirmation Message */}
      <AnimatePresence>
        {confirmationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 255, 0, 0.1)',
              border: '1px solid rgba(0, 255, 0, 0.3)',
              padding: '16px 32px',
              zIndex: 1000,
              fontSize: '13px',
              letterSpacing: '0.1em',
              color: '#4ade80'
            }}
          >
            {confirmationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Festival Grid Section - Matching Homepage */}
      <section style={{
        padding: '80px 0',
        background: '#000'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              textAlign: 'center',
              marginBottom: '60px'
            }}
          >
            <h3 style={{
              fontSize: '14px',
              fontWeight: '300',
              letterSpacing: '0.3em',
              marginBottom: '16px',
              opacity: 0.7
            }}>
              2025 SEASON
            </h3>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '100',
              letterSpacing: '0.2em'
            }}>
              UPCOMING FESTIVALS
            </h2>
          </motion.div>

          {/* Seamless Festival Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '0',
            marginBottom: isMobile ? '40px' : '80px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
          className="festival-grid">
            {festivals.map((fest, index) => (
              <motion.div 
                key={fest.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  position: 'relative',
                  borderRight: index % 3 !== 2 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  borderBottom: index < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {/* Festival Image Background */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${fest.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0,
                  transition: 'opacity 0.5s',
                  filter: 'brightness(0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                />

                {/* Festival Info */}
                <div style={{
                  position: 'relative',
                  padding: '40px 30px',
                  textAlign: 'center',
                  zIndex: 1
                }}>
                  <div style={{
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    marginBottom: '12px',
                    opacity: 0.7
                  }}>
                    {fest.name}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    letterSpacing: '0.1em',
                    marginBottom: '8px',
                    fontWeight: '300'
                  }}>
                    {fest.date}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    opacity: 0.5,
                    marginBottom: '16px'
                  }}>
                    {fest.location}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    opacity: 0.4,
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    {fest.venue}
                  </div>

                  {/* Try-On Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTryOnReservation(fest.id)
                    }}
                    style={{
                      padding: '8px 20px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: '#fff',
                      fontSize: '9px',
                      letterSpacing: '0.2em',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#fff'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    RESERVE TRY-ON
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Try-On Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '60px',
              textAlign: 'center',
              marginBottom: '80px'
            }}
          >
            <Package style={{
              width: '32px',
              height: '32px',
              margin: '0 auto 24px',
              opacity: 0.6
            }} />
            
            <h3 style={{
              fontSize: '20px',
              fontWeight: '200',
              letterSpacing: '0.2em',
              marginBottom: '20px'
            }}>
              TRY-ON RESERVATION SERVICE
            </h3>

            <p style={{
              fontSize: '13px',
              opacity: 0.6,
              lineHeight: '1.8',
              marginBottom: '30px',
              maxWidth: '600px',
              margin: '0 auto 30px'
            }}>
              Select up to 5 pieces from our collection that you'd like to try on at the festival. 
              Koby will bring them specifically for you - no obligation to buy, just the opportunity 
              to feel the fabric and find your perfect fit.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '20px' : '30px',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              {[
                { number: '1', text: 'Choose your festival' },
                { number: '2', text: 'Select up to 5 pieces' },
                { number: '3', text: 'Meet Koby & try on' }
              ].map((step) => (
                <div key={step.number} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontSize: '14px'
                  }}>
                    {step.number}
                  </div>
                  <p style={{
                    fontSize: '11px',
                    opacity: 0.6,
                    letterSpacing: '0.1em'
                  }}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pickup Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '60px',
              textAlign: 'center'
            }}
          >
            <h3 style={{
              fontSize: '20px',
              fontWeight: '200',
              letterSpacing: '0.2em',
              marginBottom: '30px'
            }}>
              HOW FESTIVAL PICKUP WORKS
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: isMobile ? '24px' : '40px',
              marginBottom: '40px'
            }}>
              {[
                { icon: Globe, title: 'BROWSE ONLINE', desc: 'Select pieces from our collection' },
                { icon: Calendar, title: 'CHOOSE FESTIVAL', desc: 'Pick your festival location' },
                { icon: Users, title: 'MEET KOBY', desc: 'Find us at the festival venue' },
                { icon: Music, title: 'DANCE IN STYLE', desc: 'Take home your perfect outfit' }
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <Icon style={{
                      width: '24px',
                      height: '24px',
                      margin: '0 auto 16px',
                      opacity: 0.6
                    }} />
                    <h4 style={{
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      marginBottom: '8px',
                      opacity: 0.9
                    }}>
                      {step.title}
                    </h4>
                    <p style={{
                      fontSize: '10px',
                      opacity: 0.5,
                      lineHeight: '1.6'
                    }}>
                      {step.desc}
                    </p>
                  </div>
                )
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/collection')}
              style={{
                padding: '16px 48px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.5)',
                color: '#fff',
                fontSize: '11px',
                letterSpacing: '0.25em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fff'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              BROWSE COLLECTION
            </motion.button>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              marginTop: '80px',
              textAlign: 'center'
            }}
          >
            <h3 style={{
              fontSize: '24px',
              fontWeight: '100',
              letterSpacing: '0.2em',
              marginBottom: '40px'
            }}>
              WHY FESTIVAL PICKUP?
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '24px' : '40px'
            }}>
              {[
                {
                  title: 'NO SHIPPING FEES',
                  description: 'Save on international shipping costs'
                },
                {
                  title: 'TRY BEFORE YOU BUY',
                  description: 'Feel the fabric and check the fit'
                },
                {
                  title: 'MEET KOBY',
                  description: 'Get styling tips from the designer'
                },
                {
                  title: 'EXCLUSIVE PIECES',
                  description: 'Festival-only limited editions'
                },
                {
                  title: 'INSTANT PICKUP',
                  description: 'Take your outfit home immediately'
                },
                {
                  title: 'FESTIVAL COMMUNITY',
                  description: 'Connect with fellow dancers'
                }
              ].map((benefit, index) => (
                <div key={index} style={{
                  padding: '30px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.background = 'transparent'
                }}
                >
                  <h4 style={{
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    marginBottom: '12px',
                    opacity: 0.9
                  }}>
                    {benefit.title}
                  </h4>
                  <p style={{
                    fontSize: '11px',
                    opacity: 0.5,
                    lineHeight: '1.6'
                  }}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{
        padding: '80px 0',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '0 40px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '200',
            letterSpacing: '0.2em',
            marginBottom: '30px'
          }}>
            RESERVE YOUR PICKUP
          </h3>
          
          <p style={{
            fontSize: '13px',
            opacity: 0.6,
            lineHeight: '1.8',
            marginBottom: '40px'
          }}>
            Contact Koby directly to reserve your pieces for festival pickup. 
            WhatsApp or Instagram DM for fastest response.
          </p>

          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => window.open('https://wa.me/66987654321', '_blank')}
              style={{
                padding: '14px 32px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontSize: '11px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fff'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              WHATSAPP
            </button>
            
            <button
              onClick={() => window.open('https://www.instagram.com/hardingkobby', '_blank')}
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
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              INSTAGRAM
            </button>
          </div>
        </div>
      </section>

      {/* Try-On Selection Modal */}
      <AnimatePresence>
        {showTryOnModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTryOnModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(10px)',
                zIndex: 100
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '900px',
                maxHeight: '80vh',
                background: '#000',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 101,
                overflow: 'hidden'
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '200',
                    letterSpacing: '0.2em',
                    color: '#fff',
                    marginBottom: '8px'
                  }}>
                    SELECT TRY-ON PIECES
                  </h2>
                  <p style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    letterSpacing: '0.1em'
                  }}>
                    Choose up to 5 pieces • {selectedPieces.length}/5 selected
                  </p>
                </div>
                <button
                  onClick={() => setShowTryOnModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>

              {/* Pieces Grid */}
              <div style={{
                padding: '24px',
                overflowY: 'auto',
                maxHeight: 'calc(80vh - 180px)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: isMobile ? '16px' : '20px'
                }}>
                  {pieces.map((piece) => {
                    const isSelected = selectedPieces.includes(piece.id)
                    const isDisabled = !isSelected && selectedPieces.length >= 5
                    
                    return (
                      <div
                        key={piece.id}
                        onClick={() => !isDisabled && togglePieceSelection(piece.id)}
                        style={{
                          position: 'relative',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.3 : 1,
                          transition: 'all 0.3s'
                        }}
                      >
                        <div style={{
                          position: 'relative',
                          paddingBottom: '125%',
                          background: '#111',
                          overflow: 'hidden',
                          border: isSelected ? '2px solid #fff' : '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <img
                            src={piece.image}
                            alt={piece.name}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          
                          {isSelected && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              width: '24px',
                              height: '24px',
                              background: '#fff',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Check style={{ width: '14px', height: '14px', color: '#000' }} />
                            </div>
                          )}
                        </div>
                        
                        <div style={{ padding: '12px 0' }}>
                          <h4 style={{
                            fontSize: '11px',
                            letterSpacing: '0.1em',
                            marginBottom: '4px'
                          }}>
                            {piece.name}
                          </h4>
                          <p style={{
                            fontSize: '10px',
                            opacity: 0.5
                          }}>
                            ${piece.price}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <p style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: '0.1em'
                }}>
                  Festival: {festivals.find(f => f.id === selectedFestival)?.name}
                </p>
                
                <button
                  onClick={submitTryOnRequest}
                  disabled={selectedPieces.length === 0}
                  style={{
                    padding: '12px 32px',
                    background: selectedPieces.length > 0 ? '#fff' : 'rgba(255, 255, 255, 0.1)',
                    color: selectedPieces.length > 0 ? '#000' : 'rgba(255, 255, 255, 0.3)',
                    border: 'none',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    cursor: selectedPieces.length > 0 ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s'
                  }}
                >
                  SUBMIT REQUEST
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal removed - using /admin/login page instead */}

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .festival-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .festival-grid > div:nth-child(odd) {
            border-right: 1px solid rgba(255,255,255,0.2) !important;
          }
          .festival-grid > div:nth-child(even) {
            border-right: none !important;
          }
          .festival-grid > div:nth-last-child(-n+2) {
            border-bottom: none !important;
          }
        }
        @media (max-width: 480px) {
          .festival-grid {
            grid-template-columns: 1fr !important;
          }
          .festival-grid > div {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.2) !important;
          }
          .festival-grid > div:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default FestivalPickupMinimal