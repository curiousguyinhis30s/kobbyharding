import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { useProductStore } from '../stores/useProductStore'
import { ArrowRight } from 'lucide-react'
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
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/kobby-assets/models/IMG_3479.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: isDark ? 'brightness(0.35)' : 'brightness(0.25)'
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
          {/* Brand Mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{
              marginBottom: isMobile ? '16px' : '24px'
            }}
          >
            <span style={{
              display: 'inline-block',
              fontSize: isMobile ? '14px' : '12px',
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.6)',
              borderBottom: '1px solid rgba(255,255,255,0.3)',
              paddingBottom: '8px'
            }}>
              KOBY HARDING PRESENTS
            </span>
          </motion.div>

          {/* Main Title - Full brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            style={{
              fontSize: isMobile ? '28px' : '48px',
              fontWeight: '300',
              letterSpacing: '0.25em',
              margin: 0,
              lineHeight: 1.2,
              textShadow: '0 4px 30px rgba(0,0,0,0.5)'
            }}
          >
            KHARDING
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              fontSize: isMobile ? '18px' : '28px',
              fontWeight: '200',
              letterSpacing: '0.4em',
              margin: isMobile ? '8px 0 20px 0' : '12px 0 24px 0',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)'
            }}
          >
            CLASSICS
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            style={{
              fontSize: isMobile ? '13px' : '14px',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.85)',
              marginBottom: isMobile ? '28px' : '36px',
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
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/collection')}
            style={{
              padding: isMobile ? '16px 36px' : '16px 48px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.5)',
              color: '#fff',
              fontSize: isMobile ? '12px' : '11px',
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

          {/* Scroll indicator for mobile */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{
                position: 'absolute',
                bottom: '-60px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{
                fontSize: '9px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.5)'
              }}>
                SCROLL
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: '1px',
                  height: '24px',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)'
                }}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Story - Compact Grid */}
      <section style={{
        padding: isMobile ? '48px 16px' : '64px 40px',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '40px' }}>
          <h2 style={{
            fontSize: isMobile ? '10px' : '11px',
            letterSpacing: '0.25em',
            color: 'var(--text-muted)',
            marginBottom: '8px'
          }}>
            THE STORY OF
          </h2>
          <h3 style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            color: 'var(--text-primary)'
          }}>
            KH CLASSICS
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? '24px' : '20px',
          marginBottom: isMobile ? '32px' : '48px'
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
                height: isMobile ? '200px' : '240px',
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

        {/* Quote - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            padding: isMobile ? '24px 0' : '32px 0',
            borderTop: '1px solid var(--border-primary)',
            borderBottom: '1px solid var(--border-primary)'
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

      {/* Festival Section - Compact */}
      <section style={{
        position: 'relative',
        padding: isMobile ? '48px 16px' : '64px 40px',
        background: `linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))`
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/kobby-assets/models/IMG_3523.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isDark ? 0.15 : 0.08
        }} />

        <div style={{
          position: 'relative',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: isMobile ? '10px' : '11px',
            letterSpacing: '0.25em',
            color: 'var(--text-muted)',
            marginBottom: '8px'
          }}>
            2025 SEASON
          </h2>
          <h3 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            marginBottom: '24px',
            color: 'var(--text-primary)'
          }}>
            Festival Ready
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            border: '1px solid var(--border-primary)',
            marginBottom: '32px',
            background: 'var(--bg-card)'
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
                  padding: isMobile ? '16px 12px' : '20px',
                  borderRight: (isMobile ? i % 2 === 0 : i % 3 !== 2) ? '1px solid var(--border-primary)' : 'none',
                  borderBottom: (isMobile ? i < arr.length - 2 : i < 3) ? '1px solid var(--border-primary)' : 'none'
                }}
              >
                <div style={{
                  fontSize: isMobile ? '9px' : '10px',
                  letterSpacing: '0.15em',
                  color: 'var(--text-muted)',
                  marginBottom: '6px'
                }}>
                  {fest.name.toUpperCase()}
                </div>
                <div style={{
                  fontSize: isMobile ? '11px' : '13px',
                  letterSpacing: '0.1em',
                  marginBottom: '4px',
                  color: 'var(--text-primary)'
                }}>
                  {fest.date}
                </div>
                <div style={{
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: 'var(--text-subtle)'
                }}>
                  {fest.loc}
                </div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/festival')}
            style={{
              padding: '12px 32px',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-hover)',
              color: 'var(--text-primary)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              cursor: 'pointer'
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
          Bangkok, Thailand
        </div>
      </section>
      </div>
    </>
  )
}

export default WelcomeMinimal
