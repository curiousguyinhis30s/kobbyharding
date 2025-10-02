import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BarChart, TrendingUp, Users, Package, Heart, Eye, ShoppingBag, Star, ArrowUp, ArrowDown } from 'lucide-react'
import useStore from '../stores/useStore'

interface ProductAnalytics {
  id: string
  name: string
  views: number
  likes: number
  addedToCart: number
  purchased: number
  rating: number
  reviews: number
  engagement: number
}

interface UserAnalytics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  returningUsers: number
}

const AnalyticsDashboard = () => {
  const navigate = useNavigate()
  const { pieces } = useStore()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics[]>([])
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics>({
    totalUsers: 2847,
    activeUsers: 892,
    newUsers: 234,
    returningUsers: 658
  })

  useEffect(() => {
    // Generate mock analytics data for products
    const analytics = pieces.map(piece => ({
      id: piece.id,
      name: piece.name,
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 200) + 20,
      addedToCart: Math.floor(Math.random() * 100) + 10,
      purchased: Math.floor(Math.random() * 50) + 5,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      reviews: Math.floor(Math.random() * 30) + 5,
      engagement: 0
    }))

    // Calculate engagement score
    analytics.forEach(item => {
      item.engagement = (item.views * 0.1 + item.likes * 0.3 + item.addedToCart * 0.4 + item.purchased * 0.2) / 100
    })

    // Sort by engagement
    analytics.sort((a, b) => b.engagement - a.engagement)
    
    setProductAnalytics(analytics)
  }, [pieces, timeRange])

  const topProducts = productAnalytics.slice(0, 5)
  const totalViews = productAnalytics.reduce((sum, p) => sum + p.views, 0)
  const totalLikes = productAnalytics.reduce((sum, p) => sum + p.likes, 0)
  const totalPurchases = productAnalytics.reduce((sum, p) => sum + p.purchased, 0)
  const averageRating = productAnalytics.length > 0
    ? (productAnalytics.reduce((sum, p) => sum + p.rating, 0) / productAnalytics.length).toFixed(1)
    : '0.0'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      paddingTop: '64px'
    }}>
      {/* Header */}
      <section style={{
        padding: '40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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
              ANALYTICS DASHBOARD
            </h1>
            <p style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.1em'
            }}>
              Track product engagement and user preferences
            </p>
          </div>

          {/* Time Range Selector */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '8px 20px',
                  background: timeRange === range ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: timeRange === range ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {range === '7d' ? 'LAST 7 DAYS' : range === '30d' ? 'LAST 30 DAYS' : 'LAST 90 DAYS'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Overview Stats */}
      <section style={{ padding: '40px' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {/* Stat Cards */}
            {[
              { 
                icon: Eye, 
                label: 'TOTAL VIEWS', 
                value: totalViews.toLocaleString(), 
                change: '+12.5%',
                positive: true 
              },
              { 
                icon: Heart, 
                label: 'TOTAL LIKES', 
                value: totalLikes.toLocaleString(), 
                change: '+8.3%',
                positive: true 
              },
              { 
                icon: ShoppingBag, 
                label: 'PURCHASES', 
                value: totalPurchases.toLocaleString(), 
                change: '+15.7%',
                positive: true 
              },
              { 
                icon: Star, 
                label: 'AVG RATING', 
                value: averageRating, 
                change: '+0.2',
                positive: true 
              },
              { 
                icon: Users, 
                label: 'ACTIVE USERS', 
                value: userAnalytics.activeUsers.toLocaleString(), 
                change: '-2.1%',
                positive: false 
              },
              { 
                icon: TrendingUp, 
                label: 'CONVERSION', 
                value: '3.8%', 
                change: '+0.5%',
                positive: true 
              }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: '24px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <Icon style={{
                        width: '20px',
                        height: '20px',
                        marginBottom: '12px',
                        opacity: 0.6
                      }} />
                      <p style={{
                        fontSize: '10px',
                        letterSpacing: '0.2em',
                        marginBottom: '8px',
                        opacity: 0.5
                      }}>
                        {stat.label}
                      </p>
                      <p style={{
                        fontSize: '24px',
                        fontWeight: '300'
                      }}>
                        {stat.value}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '8px'
                    }}>
                      {stat.positive ? (
                        <ArrowUp style={{ width: '12px', height: '12px', color: '#4ade80' }} />
                      ) : (
                        <ArrowDown style={{ width: '12px', height: '12px', color: '#ef4444' }} />
                      )}
                      <span style={{
                        fontSize: '11px',
                        color: stat.positive ? '#4ade80' : '#ef4444'
                      }}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Top Products */}
          <div style={{
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '200',
              letterSpacing: '0.2em',
              marginBottom: '24px'
            }}>
              TOP PERFORMING PRODUCTS
            </h2>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden'
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 1fr 1fr 1fr',
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                opacity: 0.5
              }}>
                <div>#</div>
                <div>PRODUCT</div>
                <div style={{ textAlign: 'center' }}>VIEWS</div>
                <div style={{ textAlign: 'center' }}>LIKES</div>
                <div style={{ textAlign: 'center' }}>CART ADDS</div>
                <div style={{ textAlign: 'center' }}>PURCHASES</div>
                <div style={{ textAlign: 'center' }}>RATING</div>
                <div style={{ textAlign: 'center' }}>ENGAGEMENT</div>
              </div>

              {/* Table Rows */}
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 1fr 1fr 1fr',
                    padding: '20px 24px',
                    borderBottom: index < topProducts.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    fontSize: '12px',
                    transition: 'background 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => navigate(`/piece/${product.id}`)}
                >
                  <div style={{ opacity: 0.5 }}>{index + 1}</div>
                  <div style={{ fontWeight: '300' }}>{product.name}</div>
                  <div style={{ textAlign: 'center', opacity: 0.8 }}>{product.views}</div>
                  <div style={{ textAlign: 'center', opacity: 0.8 }}>{product.likes}</div>
                  <div style={{ textAlign: 'center', opacity: 0.8 }}>{product.addedToCart}</div>
                  <div style={{ textAlign: 'center', opacity: 0.8 }}>{product.purchased}</div>
                  <div style={{ textAlign: 'center', opacity: 0.8 }}>
                    <span style={{ color: '#fbbf24' }}>★</span> {product.rating}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '60px',
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      margin: '0 auto',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${(product.engagement / 10) * 100}%`,
                        background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                        transition: 'width 0.5s'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Insights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          }}>
            {/* User Demographics */}
            <div style={{
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '200',
                letterSpacing: '0.2em',
                marginBottom: '20px'
              }}>
                USER DEMOGRAPHICS
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>Asia Pacific</span>
                  <span style={{ fontSize: '11px' }}>68%</span>
                </div>
                <div style={{
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '68%',
                    background: 'rgba(255, 255, 255, 0.5)'
                  }} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>Europe</span>
                  <span style={{ fontSize: '11px' }}>22%</span>
                </div>
                <div style={{
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '22%',
                    background: 'rgba(255, 255, 255, 0.5)'
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>Americas</span>
                  <span style={{ fontSize: '11px' }}>10%</span>
                </div>
                <div style={{
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '10%',
                    background: 'rgba(255, 255, 255, 0.5)'
                  }} />
                </div>
              </div>
            </div>

            {/* Festival Interest */}
            <div style={{
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '200',
                letterSpacing: '0.2em',
                marginBottom: '20px'
              }}>
                FESTIVAL INTEREST
              </h3>

              {[
                { name: 'Bangkok Kizomba', interest: 85 },
                { name: 'Singapore Urban Kiz', interest: 72 },
                { name: 'Bali Tarraxo Fest', interest: 90 },
                { name: 'Tokyo Kizomba Week', interest: 65 }
              ].map((festival, index) => (
                <div key={index} style={{ marginBottom: index < 3 ? '16px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', opacity: 0.7 }}>{festival.name}</span>
                    <span style={{ fontSize: '11px' }}>{festival.interest}%</span>
                  </div>
                  <div style={{
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${festival.interest}%`,
                      background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                      transition: 'width 0.5s'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section style={{
        padding: '40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              padding: '14px 32px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              fontSize: '11px',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#fff'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            BACK TO ADMIN
          </button>
        </div>
      </section>
    </div>
  )
}

export default AnalyticsDashboard