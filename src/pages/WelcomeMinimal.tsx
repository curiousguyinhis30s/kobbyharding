import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { useProductStore } from '../stores/useProductStore'
import { ArrowRight, ChevronDown } from 'lucide-react'
import SEO from '../components/SEO'
import { PAGE_SEO } from '../constants/seo'
import NewsletterSignup from '../components/NewsletterSignup'
import RecentlyViewed from '../components/RecentlyViewed'
import { useTheme } from '../contexts/ThemeContext'

const WelcomeMinimal = () => {
  const navigate = useNavigate()
  const { setPieces } = useStore()
  const { products, initialized, initializeFromMockData } = useProductStore()
  const { isDark } = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData()
    }
  }, [initialized, initializeFromMockData])

  useEffect(() => {
    if (products.length > 0) {
      setPieces(products)
    }
  }, [products, setPieces])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <SEO
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        keywords={PAGE_SEO.home.keywords}
        image={PAGE_SEO.home.image}
        url="/"
        type="website"
        noTemplate
      />
      <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
        {/* Hero - Redesigned for mobile readability */}
      <section style={{
        position: 'relative',
        height: isMobile ? '100svh' : '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image with Parallax */}
        <div style={{
          position: 'absolute',
          inset: '-20%',
          backgroundImage: 'url(/kobby-assets/models/IMG_3479.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          filter: isDark ? 'brightness(0.35)' : 'brightness(0.25)',
          transform: 'scale(1.1)'
        }} />

        {/* Gradient Overlay for better text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isMobile
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.8) 100%)'
            : 'radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
          zIndex: 0
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: isMobile ? '0 24px' : '0 20px',
          maxWidth: '800px'
        }}>
          {/* Main Title - Full brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            style={{
              fontSize: isMobile ? '28px' : '48px',
              fontWeight: '300',
              letterSpacing: '0.15em',
              margin: 0,
              lineHeight: 1.2,
              color: '#fff',
              textShadow: '0 4px 30px rgba(0,0,0,0.5)'
            }}
          >
            KOBY HARDING
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontSize: isMobile ? '18px' : '28px',
              fontWeight: '200',
              letterSpacing: '0.3em',
              margin: isMobile ? '8px 0 24px 0' : '12px 0 28px 0',
              color: '#fff',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)'
            }}
          >
            CLASSICS
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            style={{
              fontSize: isMobile ? '12px' : '13px',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: isMobile ? '32px' : '40px',
              fontWeight: '300',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            AFRICAN HERITAGE · MODERN EXPRESSION
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/collection')}
            style={{
              padding: isMobile ? '14px 32px' : '16px 48px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.5)',
              color: '#fff',
              fontSize: isMobile ? '11px' : '11px',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            EXPLORE COLLECTION
            <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Scroll Indicator - Inside hero at bottom */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2
            }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <ChevronDown size={28} color="rgba(255,255,255,0.8)" />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Story - Horizontal Scroll on Mobile */}
      <section style={{
        padding: isMobile ? '48px 0' : '64px 40px',
        maxWidth: isMobile ? '100%' : '1100px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px', padding: isMobile ? '0 16px' : 0 }}>
          <h2 style={{
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: '300',
            letterSpacing: '0.15em',
            color: 'var(--text-primary)'
          }}>
            OUR STORY
          </h2>
        </div>

        {/* Mobile: Infinite scroll carousel */}
        {isMobile ? (
          <div style={{
            overflow: 'hidden',
            marginBottom: '32px',
            paddingLeft: '24px'
          }}>
            <style>{`
              @keyframes infiniteScroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .story-carousel {
                display: flex;
                gap: 16px;
                animation: infiniteScroll 20s linear infinite;
                width: fit-content;
              }
              .story-carousel:hover {
                animation-play-state: paused;
              }
            `}</style>
            <div className="story-carousel">
              {/* Render cards twice for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                [
                  {
                    img: '/kobby-assets/models/IMG_3481.JPG',
                    label: 'ORIGINS',
                    title: 'African Roots',
                    text: 'Born in Ghana, raised by tradition. Every thread carries history.'
                  },
                  {
                    img: '/kobby-assets/models/IMG_3591.JPG',
                    label: 'JOURNEY',
                    title: 'The Path East',
                    text: 'From Accra to Bangkok, following the rhythm of Kizomba.'
                  },
                  {
                    img: '/kobby-assets/models/IMG_3622.JPG',
                    label: 'CRAFT',
                    title: 'Dance & Design',
                    text: 'Every piece tested on the dance floor. Fashion that moves.'
                  }
                ].map((item, i) => (
                  <div
                    key={`${setIndex}-${item.label}`}
                    style={{
                      flexShrink: 0,
                      width: '280px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '200px',
                      backgroundImage: `url(${item.img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                    <div style={{ padding: '16px' }}>
                      <div style={{
                        fontSize: '9px',
                        letterSpacing: '0.25em',
                        color: 'var(--text-muted)',
                        marginBottom: '8px'
                      }}>
                        {item.label}
                      </div>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '300',
                        letterSpacing: '0.05em',
                        marginBottom: '8px',
                        color: 'var(--text-primary)'
                      }}>
                        {item.title}
                      </h4>
                      <p style={{
                        fontSize: '11px',
                        lineHeight: '1.7',
                        color: 'var(--text-secondary)'
                      }}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>
        ) : (
          /* Desktop: Grid layout */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '48px'
          }}>
            {[
              {
                img: '/kobby-assets/models/IMG_3481.JPG',
                label: 'ORIGINS',
                title: 'African Roots',
                text: 'Born in Ghana, raised by tradition. Every thread carries history.'
              },
              {
                img: '/kobby-assets/models/IMG_3591.JPG',
                label: 'JOURNEY',
                title: 'The Path East',
                text: 'From Accra to Bangkok, following the rhythm of Kizomba.'
              },
              {
                img: '/kobby-assets/models/IMG_3622.JPG',
                label: 'CRAFT',
                title: 'Dance & Design',
                text: 'Every piece tested on the dance floor. Fashion that moves.'
              }
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{
                  width: '100%',
                  height: '240px',
                  backgroundImage: `url(${item.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginBottom: '16px'
                }} />
                <div style={{
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  color: 'var(--text-muted)',
                  marginBottom: '8px'
                }}>
                  {item.label}
                </div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '300',
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                  color: 'var(--text-primary)'
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontSize: '12px',
                  lineHeight: '1.7',
                  color: 'var(--text-secondary)'
                }}>
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quote Section - With proper spacing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            padding: isMobile ? '40px 20px' : '56px 40px',
            margin: isMobile ? '32px 16px' : '48px 0',
            borderTop: '1px solid var(--border-primary)',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)'
          }}
        >
          <blockquote style={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: '300',
            fontStyle: 'italic',
            letterSpacing: '0.03em',
            lineHeight: '1.8',
            maxWidth: '600px',
            margin: '0 auto',
            color: 'var(--text-primary)'
          }}>
            "I create companions for your journey - pieces that understand movement
            and speak the universal language of dance."
          </blockquote>
          <cite style={{
            display: 'block',
            marginTop: '16px',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'var(--text-muted)'
          }}>
            — KOBY HARDING
          </cite>
        </motion.div>
      </section>

      {/* Festival Section - Enhanced visibility */}
      <section style={{
        position: 'relative',
        padding: isMobile ? '56px 16px' : '80px 40px',
        background: '#000'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/kobby-assets/models/IMG_3523.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.25
        }} />
        {/* Dark overlay for better text visibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)'
        }} />

        <div style={{
          position: 'relative',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: isMobile ? '10px' : '11px',
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '12px'
          }}>
            2025 SEASON
          </h2>
          <h3 style={{
            fontSize: isMobile ? '26px' : '36px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            marginBottom: '32px',
            color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Festival Ready
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '40px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
          }}>
            {[
              { name: 'Bangkok Kizomba', date: 'MAR 15-17', loc: 'Thailand' },
              { name: 'Singapore Urban', date: 'APR 5-7', loc: 'Singapore' },
              { name: 'Bali Tarraxo', date: 'MAY 10-12', loc: 'Indonesia' },
              { name: 'Tokyo Kizomba', date: 'JUN 21-23', loc: 'Japan' },
              { name: 'Seoul Urban', date: 'JUL 12-14', loc: 'Korea' },
              { name: 'Hong Kong Kiz', date: 'AUG 9-11', loc: 'Hong Kong' }
            ].map((fest, i, arr) => (
              <div
                key={fest.name}
                style={{
                  padding: isMobile ? '18px 14px' : '24px',
                  borderRight: (isMobile ? i % 2 === 0 : i % 3 !== 2) ? '1px solid rgba(255,255,255,0.15)' : 'none',
                  borderBottom: (isMobile ? i < arr.length - 2 : i < 3) ? '1px solid rgba(255,255,255,0.15)' : 'none'
                }}
              >
                <div style={{
                  fontSize: isMobile ? '9px' : '10px',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '8px'
                }}>
                  {fest.name.toUpperCase()}
                </div>
                <div style={{
                  fontSize: isMobile ? '13px' : '15px',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                  color: '#fff',
                  fontWeight: '400'
                }}>
                  {fest.date}
                </div>
                <div style={{
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.5)'
                }}>
                  {fest.loc}
                </div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/festival')}
            style={{
              padding: '14px 40px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: '#fff',
              fontSize: '11px',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            RESERVE TRY-ON
          </motion.button>
        </div>
      </section>

      {/* Recently Viewed Section - Show only if user has viewed items */}
      <RecentlyViewed isMobile={isMobile} maxItems={6} showClearButton={false} />

      {/* Newsletter Section */}
      <section style={{
        padding: isMobile ? '48px 16px' : '64px 40px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-secondary)',
        background: `linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))`
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <h2 style={{
            fontSize: isMobile ? '10px' : '11px',
            letterSpacing: '0.25em',
            color: 'var(--text-muted)',
            marginBottom: '12px'
          }}>
            EXCLUSIVE ACCESS
          </h2>
          <h3 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            Join Our Journey
          </h3>
          <p style={{
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            letterSpacing: '0.03em'
          }}>
            Be the first to know about new pieces, festival announcements, and exclusive collections.
          </p>
          <NewsletterSignup isMobile={isMobile} />
        </motion.div>
      </section>

      {/* Location Badge - Compact */}
      <section style={{
        padding: isMobile ? '32px 16px' : '40px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-secondary)'
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: 'var(--text-subtle)',
          marginBottom: '8px'
        }}>
          CURRENTLY CREATING IN
        </div>
        <div style={{
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: '300',
          letterSpacing: '0.1em',
          color: 'var(--text-primary)'
        }}>
          China
        </div>
      </section>
      </div>
    </>
  )
}

export default WelcomeMinimal
