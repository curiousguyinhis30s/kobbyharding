import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useStore from '../stores/useStore'
import { mockPieces } from '../data/mockData'
import {
  ArrowRight, ChevronDown
} from 'lucide-react'

const WelcomeMinimal = () => {
  const navigate = useNavigate()
  const { setPieces, addToCart } = useStore()
  const { scrollY } = useScroll()
  const [currentSection, setCurrentSection] = useState(0)
  
  // Parallax effects
  const section1Y = useTransform(scrollY, [0, 1000], [0, -200])
  const section2Y = useTransform(scrollY, [500, 1500], [100, -100])
  const section3Y = useTransform(scrollY, [1000, 2000], [100, -100])
  const textOpacity = useTransform(scrollY, [0, 200], [1, 0])
  
  useEffect(() => {
    setPieces(mockPieces)
  }, [setPieces])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const newSection = Math.floor(scrollPosition / windowHeight)
      setCurrentSection(newSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Section backgrounds with different outfit images
  const sections = [
    {
      id: 'hero',
      bg: '/kobby-assets/models/IMG_3479.JPG',
      title: 'KOBBY',
      subtitle: 'HARDING',
      description: 'African heritage. Modern expression.',
      cta: 'Enter Collection',
      action: () => navigate('/collection')
    },
    {
      id: 'story',
      bg: '/kobby-assets/models/IMG_3495.JPG',
      title: 'THE',
      subtitle: 'STORY',
      description: 'Each thread carries history. Each piece tells tomorrow.',
      cta: 'Discover Journey',
      action: () => navigate('/collection')
    },
    {
      id: 'festival',
      bg: '/kobby-assets/models/IMG_3523.JPG',
      title: 'FESTIVAL',
      subtitle: 'READY',
      description: 'From Bangkok to Black Rock. Ready for your adventure.',
      cta: 'Shop Festival',
      action: () => navigate('/festival-pickup')
    }
  ]

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#000',
      color: '#fff',
      overflow: 'hidden'
    }}>
      {/* Hero Section with Koby's image */}
      <section style={{ 
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            y: section1Y
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${sections[0].bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)'
          }} />
        </motion.div>

        <motion.div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            opacity: textOpacity
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            style={{
              fontSize: 'clamp(60px, 12vw, 180px)',
              fontWeight: '100',
              letterSpacing: '0.05em',
              lineHeight: '0.9',
              margin: '0 0 20px 0'
            }}
          >
            {sections[0].title}
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{
              fontSize: 'clamp(60px, 12vw, 180px)',
              fontWeight: '600',
              letterSpacing: '0.05em',
              lineHeight: '0.9',
              margin: '0 0 40px 0'
            }}
          >
            {sections[0].subtitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            style={{
              fontSize: '14px',
              letterSpacing: '0.2em',
              opacity: 0.7,
              marginBottom: '60px'
            }}
          >
            {sections[0].description}
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sections[0].action}
            style={{
              padding: '16px 48px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              fontSize: '13px',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
            }}
          >
            {sections[0].cta}
            <ArrowRight size={14} style={{ display: 'inline', marginLeft: '12px' }} />
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.5
          }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* Koby's Story Section */}
      <section style={{ 
        position: 'relative',
        minHeight: '100vh',
        background: '#000',
        padding: '100px 0'
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 40px'
          }}
        >
          {/* Section Title */}
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: 'clamp(40px, 8vw, 100px)',
              fontWeight: '100',
              letterSpacing: '0.1em',
              marginBottom: '20px'
            }}>
              THE STORY OF
            </h2>
            <h3 style={{
              fontSize: 'clamp(40px, 8vw, 100px)',
              fontWeight: '600',
              letterSpacing: '0.1em',
              marginBottom: '40px'
            }}>
              KOBBY HARDING
            </h3>
          </div>

          {/* Story Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '60px',
            marginBottom: '80px'
          }}>
            {/* Chapter 1: Origins */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div style={{
                width: '100%',
                height: '400px',
                backgroundImage: 'url(/kobby-assets/models/IMG_3481.JPG)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '30px',
                filter: 'grayscale(100%) contrast(1.2)'
              }} />
              <h4 style={{
                fontSize: '11px',
                letterSpacing: '0.3em',
                marginBottom: '15px',
                opacity: 0.5
              }}>
                CHAPTER ONE
              </h4>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                marginBottom: '20px'
              }}>
                African Roots
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.8',
                opacity: 0.7,
                letterSpacing: '0.02em'
              }}>
                Born in Ghana, raised by tradition. Koby learned the art of storytelling through fabric from his grandmother, 
                who taught him that every thread carries the weight of history and the promise of tomorrow.
              </p>
            </motion.div>

            {/* Chapter 2: Journey */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div style={{
                width: '100%',
                height: '400px',
                backgroundImage: 'url(/kobby-assets/models/IMG_3591.JPG)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '30px',
                filter: 'grayscale(100%) contrast(1.2)'
              }} />
              <h4 style={{
                fontSize: '11px',
                letterSpacing: '0.3em',
                marginBottom: '15px',
                opacity: 0.5
              }}>
                CHAPTER TWO
              </h4>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                marginBottom: '20px'
              }}>
                The Journey East
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.8',
                opacity: 0.7,
                letterSpacing: '0.02em'
              }}>
                From Accra to Bangkok, following the rhythm of Kizomba festivals. Each city adding a new layer to his vision - 
                creating pieces that move with dancers, breathe with the music, and tell stories without words.
              </p>
            </motion.div>

            {/* Chapter 3: Philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div style={{
                width: '100%',
                height: '400px',
                backgroundImage: 'url(/kobby-assets/models/IMG_3622.JPG)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '30px',
                filter: 'grayscale(100%) contrast(1.2)'
              }} />
              <h4 style={{
                fontSize: '11px',
                letterSpacing: '0.3em',
                marginBottom: '15px',
                opacity: 0.5
              }}>
                CHAPTER THREE
              </h4>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '300',
                letterSpacing: '0.05em',
                marginBottom: '20px'
              }}>
                Dance & Design
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.8',
                opacity: 0.7,
                letterSpacing: '0.02em'
              }}>
                Every piece is tested on the dance floor. If it doesn't flow with Kizomba, if it restricts the Tarraxo, 
                if it can't survive an Urban Kiz session - it doesn't leave the studio. Fashion that dances.
              </p>
            </motion.div>
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              textAlign: 'center',
              padding: '60px 0',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              margin: '80px 0'
            }}
          >
            <blockquote style={{
              fontSize: '24px',
              fontWeight: '100',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
              lineHeight: '1.8',
              maxWidth: '800px',
              margin: '0 auto',
              opacity: 0.9
            }}>
              "I don't just make clothes. I create companions for your journey - 
              pieces that understand movement, celebrate heritage, and speak the universal language of dance."
            </blockquote>
            <cite style={{
              display: 'block',
              marginTop: '30px',
              fontSize: '13px',
              letterSpacing: '0.2em',
              opacity: 0.5
            }}>
              — KOBBY HARDING
            </cite>
          </motion.div>

          {/* Current Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              textAlign: 'center',
              padding: '40px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '0',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <h4 style={{
              fontSize: '11px',
              letterSpacing: '0.3em',
              marginBottom: '20px',
              opacity: 0.5
            }}>
              CURRENTLY CREATING IN
            </h4>
            <h3 style={{
              fontSize: '32px',
              fontWeight: '300',
              letterSpacing: '0.1em',
              marginBottom: '10px'
            }}>
              Bangkok, Thailand
            </h3>
            <p style={{
              fontSize: '14px',
              opacity: 0.7,
              letterSpacing: '0.05em'
            }}>
              Preparing for the 2025 Kizomba festival season across Asia
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Festival Section */}
      <section style={{ 
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            y: section3Y
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${sections[2].bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3) saturate(1.5)'
          }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '800px',
            padding: '0 40px'
          }}
        >
          <h2 style={{
            fontSize: 'clamp(40px, 8vw, 120px)',
            fontWeight: '100',
            letterSpacing: '0.1em',
            marginBottom: '20px'
          }}>
            {sections[2].title}
          </h2>
          
          <h3 style={{
            fontSize: 'clamp(40px, 8vw, 120px)',
            fontWeight: '600',
            letterSpacing: '0.1em',
            marginBottom: '40px'
          }}>
            {sections[2].subtitle}
          </h3>

          <p style={{
            fontSize: '16px',
            lineHeight: '1.8',
            opacity: 0.8,
            marginBottom: '80px',
            letterSpacing: '0.05em'
          }}>
            {sections[2].description}
          </p>

          {/* Kizomba & Urban Kizomba Festival dates in Asia - Seamless Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0',
            marginBottom: '60px',
            maxWidth: '900px',
            margin: '0 auto 60px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {[
              { name: 'BANGKOK KIZOMBA', date: 'MAR 15-17', location: 'Thailand' },
              { name: 'SINGAPORE URBAN KIZ', date: 'APR 5-7', location: 'Singapore' },
              { name: 'BALI TARRAXO FEST', date: 'MAY 10-12', location: 'Indonesia' },
              { name: 'TOKYO KIZOMBA WEEK', date: 'JUN 21-23', location: 'Japan' },
              { name: 'SEOUL URBAN FEST', date: 'JUL 12-14', location: 'South Korea' },
              { name: 'HONG KONG KIZ', date: 'AUG 9-11', location: 'Hong Kong' }
            ].map((fest, index) => (
              <div key={fest.name} style={{
                padding: '30px 20px',
                borderRight: index % 3 !== 2 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                borderBottom: index < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.transform = 'scale(1)'
              }}>
                <div style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  marginBottom: '12px',
                  opacity: 0.7,
                  textAlign: 'center'
                }}>
                  {fest.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  textAlign: 'center',
                  fontWeight: '300'
                }}>
                  {fest.date}
                </div>
                <div style={{
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  opacity: 0.5,
                  textAlign: 'center'
                }}>
                  {fest.location}
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile responsive seamless grid */}
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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sections[2].action}
            style={{
              padding: '16px 48px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.5)',
              color: '#fff',
              fontSize: '13px',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.borderColor = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
            }}
          >
            {sections[2].cta}
          </motion.button>
        </motion.div>
      </section>

      {/* Minimal Footer */}
      <footer style={{
        padding: '60px 40px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#000'
      }}>
        <div>
          <p style={{
            fontSize: '12px',
            letterSpacing: '0.1em',
            opacity: 0.5,
            margin: 0
          }}>
            © 2025 KOBBY HARDING
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '40px'
        }}>
          <a
            href="https://www.instagram.com/hardingkobby/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#fff',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              opacity: 0.5,
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
          >
            INSTAGRAM
          </a>
          <a
            href="/contact"
            style={{
              color: '#fff',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              opacity: 0.5,
              transition: 'opacity 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
          >
            CONTACT
          </a>
        </div>
      </footer>

      {/* Section indicators */}
      <div style={{
        position: 'fixed',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100
      }}>
        {sections.map((_, idx) => (
          <div
            key={idx}
            onClick={() => window.scrollTo({ 
              top: idx * window.innerHeight, 
              behavior: 'smooth' 
            })}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: currentSection === idx ? '#fff' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              margin: '16px 0',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default WelcomeMinimal