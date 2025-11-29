import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Award, Globe, Users, Heart, Sparkles, Music, BookOpen, MessageCircle, Star, MapPin, Calendar } from 'lucide-react'
import SEO from '../components/SEO'
import { PAGE_SEO } from '../constants/seo'

const AboutKobby = () => {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const achievements = [
    { icon: Globe, text: '15+ years in Afro dance', highlight: true },
    { icon: Users, text: '10+ years teaching worldwide', highlight: true },
    { icon: Award, text: 'TED Speaker', highlight: true },
    { icon: BookOpen, text: 'Master\'s in Intercultural Communication', highlight: true }
  ]

  const countries = [
    'Ghana', 'China', 'Korea', 'Thailand', 'Kazakhstan',
    'Singapore', 'Japan', 'Hong Kong', 'Indonesia'
  ]

  const timeline = [
    { year: '2009', event: 'Started Afro dance journey in Ghana', icon: Music },
    { year: '2014', event: 'Began teaching dance internationally', icon: Globe },
    { year: '2018', event: 'TED Talk on cultural expression through dance', icon: MessageCircle },
    { year: '2020', event: 'Post-COVID: Conceived Ghanaline concept', icon: BookOpen },
    { year: '2021', event: 'Launched Khardingclassics - Unity through fashion', icon: Sparkles },
    { year: '2024', event: 'Expanding globally with love and positivity', icon: Heart }
  ]

  return (
    <>
      <SEO
        title={PAGE_SEO.about.title}
        description={PAGE_SEO.about.description}
        keywords={PAGE_SEO.about.keywords}
        image={PAGE_SEO.about.image}
        url="/about"
        type="article"
      />
      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff'
      }}>
        {/* Hero Section with Kobby's Photo */}
      <section style={{
        position: 'relative',
        minHeight: isMobile ? 'auto' : '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#000'
      }}>
        {/* Background Image - Only on desktop */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            backgroundImage: 'url(/kobby-assets/models/IMG_3479.JPG)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, #000 0%, transparent 30%)'
            }} />
          </div>
        )}

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '80px 20px 40px' : '100px 60px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Mobile Image */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                width: '100%',
                height: '300px',
                marginBottom: '32px',
                overflow: 'hidden'
              }}
            >
              <img
                src="/kobby-assets/models/IMG_3479.JPG"
                alt="Kobby Harding"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top'
                }}
              />
            </motion.div>
          )}

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: isMobile ? '100%' : '500px'
            }}
          >
            <div style={{
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '16px'
            }}>
              FOUNDER & CREATIVE DIRECTOR
            </div>

            <h1 style={{
              fontSize: isMobile ? '36px' : '56px',
              fontWeight: '200',
              letterSpacing: '0.15em',
              marginBottom: '24px',
              lineHeight: '1.1',
              color: '#fff'
            }}>
              KOBBY<br />HARDING
            </h1>

            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              lineHeight: '1.8',
              marginBottom: '32px',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: '300'
            }}>
              Spreading love and positivity across the globe through fashion that celebrates unity, self-expression, and creativity.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '32px'
            }}>
              {achievements.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <Icon style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.5)' }} />
                    <span style={{
                      fontSize: isMobile ? '12px' : '14px',
                      letterSpacing: '0.05em',
                      color: 'rgba(255,255,255,0.8)'
                    }}>
                      {item.text}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            <button
              onClick={() => navigate('/collection')}
              style={{
                padding: '14px 32px',
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
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
              EXPLORE COLLECTION
            </button>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section style={{
        padding: isMobile ? '48px 20px' : '80px 40px',
        background: '#000',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: '200',
              letterSpacing: '0.15em',
              marginBottom: isMobile ? '32px' : '48px',
              textAlign: 'center',
              color: '#fff'
            }}>
              THE JOURNEY
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '24px' : '32px',
              marginBottom: isMobile ? '32px' : '48px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '12px'
                }}>
                  THE ORIGIN
                </h3>
                <p style={{
                  fontSize: '13px',
                  lineHeight: '1.8',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  Born after the COVID-19 lockdown, Khardingclassics evolved from the Ghanaline concept. Kobby realized he didn't want to limit creativity to one culture - he saw a future where humanity stands as one.
                </p>
              </div>

              <div>
                <h3 style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '12px'
                }}>
                  THE VISION
                </h3>
                <p style={{
                  fontSize: '13px',
                  lineHeight: '1.8',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  Using fashion to spread positivity and love, Khardingclassics blends African heritage with Western and Asian influences, where love and unity transcend borders.
                </p>
              </div>

              <div>
                <h3 style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '12px'
                }}>
                  THE INSPIRATION
                </h3>
                <p style={{
                  fontSize: '13px',
                  lineHeight: '1.8',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  Kobby's mother, who made her own clothing and home designs with limited resources, taught him that creativity isn't about wealth—it's about passion, purpose, and positive impact.
                </p>
              </div>
            </div>

            {/* Quote */}
            <div style={{
              padding: isMobile ? '20px' : '32px',
              background: 'rgba(255,255,255,0.03)',
              borderLeft: '2px solid rgba(255,255,255,0.3)',
              margin: isMobile ? '32px 0' : '48px 0'
            }}>
              <p style={{
                fontSize: isMobile ? '14px' : '16px',
                fontStyle: 'italic',
                lineHeight: '1.8',
                marginBottom: '16px',
                color: 'rgba(255,255,255,0.9)'
              }}>
                "Creativity isn't about wealth—it's about passion, purpose, and how what we create can positively impact others. I saw a future where humanity stands as one, where love and unity transcend borders."
              </p>
              <p style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.5)'
              }}>
                — KOBBY HARDING
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section style={{
        padding: isMobile ? '48px 20px' : '80px 40px',
        background: '#000'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '200',
            letterSpacing: '0.15em',
            marginBottom: isMobile ? '32px' : '48px',
            textAlign: 'center',
            color: '#fff'
          }}>
            MILESTONES
          </h2>

          <div style={{ position: 'relative' }}>
            {/* Timeline Line */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: '1px',
                background: 'rgba(255,255,255,0.1)',
                transform: 'translateX(-50%)'
              }} />
            )}

            {/* Timeline Items */}
            {timeline.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: isMobile ? 'flex' : 'grid',
                    gridTemplateColumns: isMobile ? 'none' : '1fr 80px 1fr',
                    flexDirection: isMobile ? 'row' : undefined,
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '12px' : '0',
                    marginBottom: isMobile ? '24px' : '40px'
                  }}
                >
                  {isMobile ? (
                    <>
                      {/* Mobile Layout */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.6)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '300',
                          color: '#fff',
                          marginBottom: '4px'
                        }}>
                          {item.year}
                        </h3>
                        <p style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.6)',
                          lineHeight: '1.6'
                        }}>
                          {item.event}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Desktop Layout */}
                      <div style={{
                        textAlign: index % 2 === 0 ? 'right' : 'left',
                        paddingRight: index % 2 === 0 ? '32px' : 0,
                        paddingLeft: index % 2 === 1 ? '32px' : 0
                      }}>
                        {index % 2 === 0 && (
                          <>
                            <h3 style={{
                              fontSize: '20px',
                              fontWeight: '300',
                              color: '#fff',
                              marginBottom: '6px'
                            }}>
                              {item.year}
                            </h3>
                            <p style={{
                              fontSize: '13px',
                              color: 'rgba(255,255,255,0.6)',
                              lineHeight: '1.6'
                            }}>
                              {item.event}
                            </p>
                          </>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'transparent',
                          border: '1px solid rgba(255,255,255,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon style={{ width: '18px', height: '18px', color: 'rgba(255,255,255,0.6)' }} />
                        </div>
                      </div>

                      <div style={{
                        textAlign: index % 2 === 1 ? 'left' : 'right',
                        paddingLeft: index % 2 === 1 ? '32px' : 0,
                        paddingRight: index % 2 === 0 ? '32px' : 0
                      }}>
                        {index % 2 === 1 && (
                          <>
                            <h3 style={{
                              fontSize: '20px',
                              fontWeight: '300',
                              color: '#fff',
                              marginBottom: '6px'
                            }}>
                              {item.year}
                            </h3>
                            <p style={{
                              fontSize: '13px',
                              color: 'rgba(255,255,255,0.6)',
                              lineHeight: '1.6'
                            }}>
                              {item.event}
                            </p>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section style={{
        padding: isMobile ? '48px 20px' : '80px 40px',
        background: '#000',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '200',
            letterSpacing: '0.15em',
            marginBottom: '16px',
            color: '#fff'
          }}>
            GLOBAL REACH
          </h2>

          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '32px',
            maxWidth: '500px',
            margin: '0 auto 32px'
          }}>
            From Ghana to the world, spreading African culture through fashion and dance across continents.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center'
          }}>
            {countries.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '0',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'default',
                  transition: 'all 0.3s'
                }}
              >
                <MapPin style={{ width: '12px', height: '12px', opacity: 0.5 }} />
                {country}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: isMobile ? '48px 20px' : '64px 40px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: isMobile ? '20px' : '28px',
          fontWeight: '200',
          letterSpacing: '0.15em',
          marginBottom: '16px',
          color: '#fff'
        }}>
          JOIN THE MOVEMENT
        </h2>

        <p style={{
          fontSize: '13px',
          marginBottom: '24px',
          color: 'rgba(255,255,255,0.6)',
          maxWidth: '400px',
          margin: '0 auto 24px'
        }}>
          Experience the fusion of African heritage and contemporary fashion.
        </p>

        <button
          onClick={() => navigate('/collection')}
          style={{
            padding: '12px 32px',
            background: 'transparent',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
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
          SHOP NOW
        </button>
      </section>
      </div>
    </>
  )
}

export default AboutKobby