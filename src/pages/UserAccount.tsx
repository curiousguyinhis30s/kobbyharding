import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  User, Package, Heart, Calendar, MapPin, Mail, Phone,
  ChevronRight, ShoppingBag, LogOut, Settings, Clock,
  TrendingUp, Star, CreditCard, Truck
} from 'lucide-react'
import { motion } from 'framer-motion'

const UserAccount = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/admin/login')
    }
    // Redirect admin users to admin dashboard
    if (user?.role === 'admin') {
      navigate('/admin')
    }
  }, [user, navigate])

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'tryons', label: 'Try-Ons', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#10b981'
      case 'shipped': return '#3b82f6'
      case 'pending': return '#f59e0b'
      case 'confirmed': return '#10b981'
      case 'completed': return '#10b981'
      default: return '#666'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      paddingTop: '64px'
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '20px 15px' : '32px 40px',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '20px' : '28px',
              fontWeight: '200',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              Welcome back, {user.name}
            </h1>
            <p style={{
              fontSize: isMobile ? '11px' : '12px',
              opacity: 0.6,
              letterSpacing: '0.1em'
            }}>
              Member since {formatDate(user.joinDate)}
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '11px',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ef4444'
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.color = '#fff'
            }}
          >
            <LogOut size={14} />
            {!isMobile && 'LOGOUT'}
          </button>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '250px 1fr',
        gap: isMobile ? '0' : '40px',
        padding: isMobile ? '0' : '40px'
      }}>
        {/* Sidebar Navigation */}
        <div style={{
          background: isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
          border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          height: 'fit-content',
          padding: isMobile ? '0' : '20px'
        }}>
          {isMobile ? (
            <div style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '16px 20px',
                    background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #fff' : '2px solid transparent',
                    color: activeTab === tab.id ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap',
                    flex: '0 0 auto'
                  }}
                >
                  {tab.label.toUpperCase()}
                </button>
              ))}
            </div>
          ) : (
            <nav>
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      marginBottom: '8px',
                      background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      border: '1px solid ' + (activeTab === tab.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent'),
                      color: activeTab === tab.id ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <Icon size={16} />
                    {tab.label.toUpperCase()}
                  </button>
                )
              })}
            </nav>
          )}
        </div>

        {/* Content Area */}
        <div style={{ padding: isMobile ? '20px' : '0' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '40px'
              }}>
                <div style={{
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}>
                  <ShoppingBag style={{ width: '24px', height: '24px', margin: '0 auto 12px', opacity: 0.6 }} />
                  <div style={{ fontSize: '24px', fontWeight: '200', marginBottom: '4px' }}>{user.orders.length}</div>
                  <div style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '0.1em' }}>TOTAL ORDERS</div>
                </div>

                <div style={{
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}>
                  <Heart style={{ width: '24px', height: '24px', margin: '0 auto 12px', opacity: 0.6 }} />
                  <div style={{ fontSize: '24px', fontWeight: '200', marginBottom: '4px' }}>{user.favorites.length}</div>
                  <div style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '0.1em' }}>FAVORITES</div>
                </div>

                <div style={{
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}>
                  <Calendar style={{ width: '24px', height: '24px', margin: '0 auto 12px', opacity: 0.6 }} />
                  <div style={{ fontSize: '24px', fontWeight: '200', marginBottom: '4px' }}>{user.tryOnRequests.length}</div>
                  <div style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '0.1em' }}>TRY-ONS</div>
                </div>

                <div style={{
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}>
                  <TrendingUp style={{ width: '24px', height: '24px', margin: '0 auto 12px', opacity: 0.6 }} />
                  <div style={{ fontSize: '24px', fontWeight: '200', marginBottom: '4px' }}>
                    ${user.orders.reduce((sum, order) => sum + order.total, 0)}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '0.1em' }}>TOTAL SPENT</div>
                </div>
              </div>

              {/* Recent Activity */}
              <h2 style={{
                fontSize: '14px',
                fontWeight: '300',
                letterSpacing: '0.2em',
                marginBottom: '24px'
              }}>
                RECENT ACTIVITY
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {user.orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    style={{
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', marginBottom: '8px' }}>Order #{order.id}</div>
                      <div style={{ fontSize: '11px', opacity: 0.5 }}>{formatDate(order.date)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', marginBottom: '4px' }}>${order.total}</div>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        background: `rgba(${getStatusColor(order.status).slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`,
                        border: `1px solid ${getStatusColor(order.status)}`,
                        borderRadius: '3px',
                        color: getStatusColor(order.status),
                        letterSpacing: '0.1em'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{
                fontSize: '14px',
                fontWeight: '300',
                letterSpacing: '0.2em',
                marginBottom: '24px'
              }}>
                ORDER HISTORY
              </h2>

              {user.orders.length === 0 ? (
                <div style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Package style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
                  <p style={{ fontSize: '13px', opacity: 0.5 }}>No orders yet</p>
                  <button
                    onClick={() => navigate('/collection')}
                    style={{
                      marginTop: '20px',
                      padding: '12px 24px',
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
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    SHOP NOW
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        padding: '24px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '20px'
                      }}>
                        <div>
                          <div style={{ fontSize: '14px', marginBottom: '8px', letterSpacing: '0.05em' }}>
                            Order #{order.id}
                          </div>
                          <div style={{ fontSize: '11px', opacity: 0.5 }}>{formatDate(order.date)}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', marginBottom: '8px' }}>${order.total}</div>
                          <span style={{
                            fontSize: '10px',
                            padding: '4px 10px',
                            background: `rgba(${getStatusColor(order.status).slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`,
                            border: `1px solid ${getStatusColor(order.status)}`,
                            borderRadius: '3px',
                            color: getStatusColor(order.status),
                            letterSpacing: '0.1em'
                          }}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: '20px'
                      }}>
                        {order.items.map((item, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '12px',
                            fontSize: '12px'
                          }}>
                            <div>
                              <span>{item.name}</span>
                              <span style={{ opacity: 0.5, marginLeft: '8px' }}>x{item.quantity}</span>
                            </div>
                            <span>${item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {order.status === 'shipped' && (
                        <div style={{
                          marginTop: '20px',
                          padding: '12px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '11px'
                        }}>
                          <Truck size={14} />
                          Your order is on the way! Track: #TRACK{order.id}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{
                fontSize: '14px',
                fontWeight: '300',
                letterSpacing: '0.2em',
                marginBottom: '24px'
              }}>
                YOUR FAVORITES
              </h2>

              {user.favorites.length === 0 ? (
                <div style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Heart style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
                  <p style={{ fontSize: '13px', opacity: 0.5 }}>No favorites yet</p>
                  <p style={{ fontSize: '11px', opacity: 0.3, marginTop: '8px' }}>
                    Heart items from the collection to save them here
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                  gap: '20px'
                }}>
                  {user.favorites.map((favId) => (
                    <div key={favId} style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer'
                    }}>
                      <div style={{
                        aspectRatio: '1',
                        background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ opacity: 0.3, fontSize: '12px' }}>Item #{favId}</span>
                      </div>
                      <div style={{ padding: '12px' }}>
                        <button
                          onClick={() => navigate(`/piece/${favId}`)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            fontSize: '10px',
                            letterSpacing: '0.15em',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          VIEW ITEM
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Try-Ons Tab */}
          {activeTab === 'tryons' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{
                fontSize: '14px',
                fontWeight: '300',
                letterSpacing: '0.2em',
                marginBottom: '24px'
              }}>
                FESTIVAL TRY-ON REQUESTS
              </h2>

              {user.tryOnRequests.length === 0 ? (
                <div style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Calendar style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
                  <p style={{ fontSize: '13px', opacity: 0.5 }}>No try-on requests</p>
                  <button
                    onClick={() => navigate('/pickup')}
                    style={{
                      marginTop: '20px',
                      padding: '12px 24px',
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
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    VIEW FESTIVALS
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {user.tryOnRequests.map((request, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '24px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <div style={{ fontSize: '14px', marginBottom: '8px' }}>{request.festivalName}</div>
                          <div style={{ fontSize: '11px', opacity: 0.5 }}>
                            Requested: {formatDate(request.date)}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '10px',
                          padding: '4px 10px',
                          background: `rgba(${getStatusColor(request.status).slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`,
                          border: `1px solid ${getStatusColor(request.status)}`,
                          borderRadius: '3px',
                          color: getStatusColor(request.status),
                          letterSpacing: '0.1em'
                        }}>
                          {request.status.toUpperCase()}
                        </span>
                      </div>

                      <div style={{
                        fontSize: '12px',
                        opacity: 0.7
                      }}>
                        {request.items.length} items requested for try-on
                      </div>

                      {request.status === 'confirmed' && (
                        <div style={{
                          marginTop: '16px',
                          padding: '12px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}>
                          ✓ Your try-on is confirmed! See you at the festival
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{
                fontSize: '14px',
                fontWeight: '300',
                letterSpacing: '0.2em',
                marginBottom: '24px'
              }}>
                ACCOUNT SETTINGS
              </h2>

              {/* Personal Information */}
              <div style={{
                marginBottom: '32px',
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  marginBottom: '20px',
                  opacity: 0.8
                }}>
                  PERSONAL INFORMATION
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={14} style={{ opacity: 0.5 }} />
                    <span style={{ fontSize: '12px' }}>{user.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} style={{ opacity: 0.5 }} />
                    <span style={{ fontSize: '12px' }}>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} style={{ opacity: 0.5 }} />
                      <span style={{ fontSize: '12px' }}>{user.phone}</span>
                    </div>
                  )}
                </div>

                <button
                  style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  EDIT PROFILE
                </button>
              </div>

              {/* Shipping Address */}
              {user.address && (
                <div style={{
                  marginBottom: '32px',
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    marginBottom: '20px',
                    opacity: 0.8
                  }}>
                    SHIPPING ADDRESS
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                    <MapPin size={14} style={{ opacity: 0.5, marginTop: '2px' }} />
                    <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                      {user.address.street}<br />
                      {user.address.city}, {user.address.postalCode}<br />
                      {user.address.country}
                    </div>
                  </div>

                  <button
                    style={{
                      marginTop: '20px',
                      padding: '10px 20px',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    UPDATE ADDRESS
                  </button>
                </div>
              )}

              {/* Account Actions */}
              <div style={{
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  marginBottom: '20px',
                  opacity: 0.8
                }}>
                  ACCOUNT ACTIONS
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    CHANGE PASSWORD
                  </button>

                  <button
                    style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    NOTIFICATION PREFERENCES
                  </button>

                  <button
                    style={{
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'left',
                      marginTop: '20px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    DELETE ACCOUNT
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserAccount