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
        background: '#ffffff',
        color: '#000000'
      }}>
        {/* Hero Section with Kobby's Photo */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '60px 20px' : '80px 40px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: isMobile ? '40px' : '60px',
          alignItems: 'center'
        }}>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{
              fontSize: 'clamp(48px, 6vw, 72px)',
              fontWeight: '100',
              letterSpacing: '0.2em',
              marginBottom: '30px',
              lineHeight: '1.1'
            }}>
              KOBBY<br />HARDING
            </h1>

            <p style={{
              fontSize: '18px',
              lineHeight: '1.8',
              marginBottom: '30px',
              color: '#666666',
              fontWeight: '300'
            }}>
              Spreading love and positivity across the globe through fashion that celebrates unity, self-expression, and creativity.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '40px'
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
                      gap: '16px'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `${'#000000'}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon style={{ width: '20px', height: '20px', color: '#000000' }} />
                    </div>
                    <span style={{
                      fontSize: '16px',
                      letterSpacing: '0.05em',
                      color: '#000000'
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
                background: '#000000',
                color: 'white',
                border: 'none',
                fontSize: '14px',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              EXPLORE COLLECTION
            </button>
          </motion.div>

          {/* Kobby's Photo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              position: 'relative',
              height: isMobile ? '400px' : '600px',
              borderRadius: '8px',
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
              onError={(e) => {
                // Fallback to another photo if the first one doesn't work
                e.currentTarget.src = '/kobby-assets/models/IMG_3665.JPG'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
              padding: '30px',
              color: 'white'
            }}>
              <p style={{
                fontSize: '14px',
                letterSpacing: '0.1em',
                opacity: 0.9
              }}>
                FOUNDER & CREATIVE DIRECTOR
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 40px',
        background: '#ffffff',
        borderTop: `1px solid ${'#e0e0e0'}`
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: '200',
              letterSpacing: isMobile ? '0.1em' : '0.15em',
              marginBottom: isMobile ? '30px' : '50px',
              textAlign: 'center'
            }}>
              THE JOURNEY
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: isMobile ? '30px' : '40px',
              marginBottom: isMobile ? '40px' : '60px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '14px',
                  letterSpacing: '0.2em',
                  color: '#000000',
                  marginBottom: '16px'
                }}>
                  THE ORIGIN
                </h3>
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.8',
                  color: '#666666'
                }}>
                  Born after the COVID-19 lockdown, Khardingclassics evolved from the Ghanaline concept. Kobby realized he didn't want to limit creativity to one culture - he saw a future where humanity stands as one.
                </p>
              </div>

              <div>
                <h3 style={{
                  fontSize: '14px',
                  letterSpacing: '0.2em',
                  color: '#000000',
                  marginBottom: '16px'
                }}>
                  THE VISION
                </h3>
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.8',
                  color: '#666666'
                }}>
                  Using fashion to spread positivity and love, Khardingclassics blends African heritage with Western and Asian influences, where love and unity transcend borders.
                </p>
              </div>

              <div>
                <h3 style={{
                  fontSize: '14px',
                  letterSpacing: '0.2em',
                  color: '#000000',
                  marginBottom: '16px'
                }}>
                  THE INSPIRATION
                </h3>
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.8',
                  color: '#666666'
                }}>
                  Kobby's mother, who made her own clothing and home designs with limited resources, taught him that creativity isn't about wealth—it's about passion, purpose, and positive impact.
                </p>
              </div>
            </div>

            {/* Quote */}
            <div style={{
              padding: isMobile ? '24px' : '40px',
              background: 'rgba(0, 0, 0, 0.05)',
              borderLeft: `4px solid ${'#000000'}`,
              margin: isMobile ? '40px 0' : '60px 0'
            }}>
              <p style={{
                fontSize: isMobile ? '16px' : '20px',
                fontStyle: 'italic',
                lineHeight: '1.6',
                marginBottom: '20px',
                color: '#000000'
              }}>
                "Creativity isn't about wealth—it's about passion, purpose, and how what we create can positively impact others. I saw a future where humanity stands as one, where love and unity transcend borders."
              </p>
              <p style={{
                fontSize: '14px',
                letterSpacing: '0.1em',
                color: '#000000'
              }}>
                — KOBBY HARDING
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 40px',
        background: '#ffffff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '200',
            letterSpacing: isMobile ? '0.1em' : '0.15em',
            marginBottom: isMobile ? '40px' : '60px',
            textAlign: 'center'
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
                background: '#e0e0e0',
                transform: 'translateX(-50%)'
              }} />
            )}

            {/* Timeline Items */}
            {timeline.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: isMobile ? 'flex' : 'grid',
                    gridTemplateColumns: isMobile ? 'none' : '1fr 100px 1fr',
                    flexDirection: isMobile ? 'row' : undefined,
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '16px' : '0',
                    marginBottom: isMobile ? '32px' : '60px'
                  }}
                >
                  {isMobile ? (
                    <>
                      {/* Mobile Layout */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: `2px solid ${'#000000'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon style={{ width: '20px', height: '20px', color: '#000000' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: '300',
                          color: '#000000',
                          marginBottom: '4px'
                        }}>
                          {item.year}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#666666',
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
                        paddingRight: index % 2 === 0 ? '40px' : 0,
                        paddingLeft: index % 2 === 1 ? '40px' : 0
                      }}>
                        {index % 2 === 0 && (
                          <>
                            <h3 style={{
                              fontSize: '24px',
                              fontWeight: '300',
                              color: '#000000',
                              marginBottom: '8px'
                            }}>
                              {item.year}
                            </h3>
                            <p style={{
                              fontSize: '15px',
                              color: '#666666',
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
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: `2px solid ${'#000000'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon style={{ width: '24px', height: '24px', color: '#000000' }} />
                        </div>
                      </div>

                      <div style={{
                        textAlign: index % 2 === 1 ? 'left' : 'right',
                        paddingLeft: index % 2 === 1 ? '40px' : 0,
                        paddingRight: index % 2 === 0 ? '40px' : 0
                      }}>
                        {index % 2 === 1 && (
                          <>
                            <h3 style={{
                              fontSize: '24px',
                              fontWeight: '300',
                              color: '#000000',
                              marginBottom: '8px'
                            }}>
                              {item.year}
                            </h3>
                            <p style={{
                              fontSize: '15px',
                              color: '#666666',
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
        padding: isMobile ? '60px 20px' : '100px 40px',
        background: '#ffffff',
        borderTop: `1px solid ${'#e0e0e0'}`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '200',
            letterSpacing: isMobile ? '0.1em' : '0.15em',
            marginBottom: '20px'
          }}>
            GLOBAL REACH
          </h2>

          <p style={{
            fontSize: '16px',
            color: '#666666',
            marginBottom: '50px',
            maxWidth: '600px',
            margin: '0 auto 50px'
          }}>
            From Ghana to the world, spreading African culture through fashion and dance across continents.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {countries.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  border: `1px solid ${'#e0e0e0'}`,
                  borderRadius: '30px',
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                whileHover={{
                  background: '#000000',
                  color: 'white',
                  borderColor: '#000000'
                }}
              >
                <MapPin style={{ width: '14px', height: '14px' }} />
                {country}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: isMobile ? '60px 20px' : '80px 40px',
        background: `linear-gradient(135deg, ${'#000000'} 0%, ${'#000000'}dd 100%)`,
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: '200',
          letterSpacing: isMobile ? '0.1em' : '0.15em',
          marginBottom: '20px',
          color: 'white'
        }}>
          JOIN THE MOVEMENT
        </h2>

        <p style={{
          fontSize: '16px',
          marginBottom: '30px',
          opacity: 0.9,
          color: 'white',
          maxWidth: '500px',
          margin: '0 auto 30px'
        }}>
          Experience the fusion of African heritage and contemporary fashion.
        </p>

        <button
          onClick={() => navigate('/collection')}
          style={{
            padding: isMobile ? '12px 24px' : '14px 32px',
            background: 'white',
            color: '#000000',
            border: 'none',
            fontSize: isMobile ? '12px' : '14px',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
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