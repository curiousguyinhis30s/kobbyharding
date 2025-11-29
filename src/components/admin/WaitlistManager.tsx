import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Bell, Mail, Trash2, Send, Check, AlertCircle, Users } from 'lucide-react'
import { useWaitlistStore } from '../../stores/useWaitlistStore'
import useStore from '../../stores/useStore'
import { useToast } from '../Toast'

const WaitlistManager = () => {
  const { waitlist, removeFromWaitlist, markAsNotified, clearNotifiedEntries } = useWaitlistStore()
  const { pieces } = useStore()
  const { addToast } = useToast()

  const [selectedProduct, setSelectedProduct] = useState<string>('all')
  const [searchEmail, setSearchEmail] = useState('')

  // Group waitlist by product
  const waitlistByProduct = useMemo(() => {
    const grouped: Record<string, { productName: string; entries: typeof waitlist }> = {}

    waitlist.forEach(entry => {
      const product = pieces.find(p => p.id === entry.productId)
      const productName = product?.name || 'Unknown Product'

      if (!grouped[entry.productId]) {
        grouped[entry.productId] = {
          productName,
          entries: []
        }
      }

      grouped[entry.productId].entries.push(entry)
    })

    return grouped
  }, [waitlist, pieces])

  // Filter entries
  const filteredEntries = useMemo(() => {
    let entries = [...waitlist]

    if (selectedProduct !== 'all') {
      entries = entries.filter(e => e.productId === selectedProduct)
    }

    if (searchEmail.trim()) {
      entries = entries.filter(e =>
        e.email.toLowerCase().includes(searchEmail.toLowerCase())
      )
    }

    return entries
  }, [waitlist, selectedProduct, searchEmail])

  // Statistics
  const stats = useMemo(() => {
    const totalSubscribers = waitlist.length
    const notifiedCount = waitlist.filter(e => e.notified).length
    const pendingCount = totalSubscribers - notifiedCount
    const productsCount = Object.keys(waitlistByProduct).length

    return {
      totalSubscribers,
      notifiedCount,
      pendingCount,
      productsCount
    }
  }, [waitlist, waitlistByProduct])

  const handleNotify = (productId: string, email: string) => {
    // Mock notification - in production, this would call an API
    setTimeout(() => {
      markAsNotified(productId, email)
      addToast('success', `Notification sent to ${email}`)
    }, 500)
  }

  const handleNotifyAll = (productId: string) => {
    const entries = waitlistByProduct[productId]?.entries || []
    const pending = entries.filter(e => !e.notified)

    if (pending.length === 0) {
      addToast('info', 'No pending notifications for this product')
      return
    }

    // Mock bulk notification
    setTimeout(() => {
      pending.forEach(entry => {
        markAsNotified(productId, entry.email)
      })
      addToast('success', `Sent ${pending.length} notification${pending.length > 1 ? 's' : ''}`)
    }, 1000)
  }

  const handleRemove = (productId: string, email: string) => {
    removeFromWaitlist(productId, email)
    addToast('success', 'Entry removed from waitlist')
  }

  const handleClearNotified = () => {
    if (window.confirm('Clear all notified entries?')) {
      clearNotifiedEntries()
      addToast('success', 'Notified entries cleared')
    }
  }

  return (
    <div style={{
      padding: '24px',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '300',
          letterSpacing: '0.15em',
          marginBottom: '8px'
        }}>
          WAITLIST MANAGEMENT
        </h2>
        <p style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          letterSpacing: '0.05em'
        }}>
          Manage customer notifications for out-of-stock products
        </p>
      </div>

      {/* Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <Users style={{ width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />
            <span style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              TOTAL SUBSCRIBERS
            </span>
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '200',
            letterSpacing: '0.05em'
          }}>
            {stats.totalSubscribers}
          </div>
        </div>

        <div style={{
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <Bell style={{ width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />
            <span style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              PENDING NOTIFICATIONS
            </span>
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '200',
            letterSpacing: '0.05em',
            color: stats.pendingCount > 0 ? '#fbbf24' : '#fff'
          }}>
            {stats.pendingCount}
          </div>
        </div>

        <div style={{
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <Check style={{ width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />
            <span style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              NOTIFIED
            </span>
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '200',
            letterSpacing: '0.05em',
            color: stats.notifiedCount > 0 ? '#10b981' : '#fff'
          }}>
            {stats.notifiedCount}
          </div>
        </div>

        <div style={{
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />
            <span style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              PRODUCTS
            </span>
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '200',
            letterSpacing: '0.05em'
          }}>
            {stats.productsCount}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '8px'
          }}>
            FILTER BY PRODUCT
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '12px',
              letterSpacing: '0.05em',
              outline: 'none'
            }}
          >
            <option value="all">All Products ({waitlist.length})</option>
            {Object.entries(waitlistByProduct).map(([productId, { productName, entries }]) => (
              <option key={productId} value={productId}>
                {productName} ({entries.length})
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '8px'
          }}>
            SEARCH BY EMAIL
          </label>
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="customer@example.com"
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '12px',
              letterSpacing: '0.05em',
              outline: 'none'
            }}
          />
        </div>

        {stats.notifiedCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleClearNotified}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                color: 'rgba(239, 68, 68, 0.9)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'
              }}
            >
              CLEAR NOTIFIED
            </button>
          </div>
        )}
      </div>

      {/* Waitlist Table */}
      {filteredEntries.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <Bell style={{
            width: '48px',
            height: '48px',
            color: 'rgba(255, 255, 255, 0.3)',
            margin: '0 auto 16px'
          }} />
          <p style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.1em'
          }}>
            No waitlist entries found
          </p>
        </div>
      ) : (
        <div style={{
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1.5fr 100px 150px',
            gap: '16px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            <div>PRODUCT</div>
            <div>EMAIL</div>
            <div>SUBSCRIBED</div>
            <div>STATUS</div>
            <div>ACTIONS</div>
          </div>

          {/* Table Body */}
          {filteredEntries.map((entry, index) => {
            const product = pieces.find(p => p.id === entry.productId)
            const productName = product?.name || 'Unknown Product'
            const date = new Date(entry.timestamp)

            return (
              <motion.div
                key={`${entry.productId}-${entry.email}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 100px 150px',
                  gap: '16px',
                  padding: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  alignItems: 'center',
                  fontSize: '12px',
                  background: entry.notified ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                }}
              >
                <div style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {productName}
                </div>

                <div style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  {entry.email}
                </div>

                <div style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '11px'
                }}>
                  {date.toLocaleDateString()}
                </div>

                <div>
                  {entry.notified ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      color: '#10b981'
                    }}>
                      <Check style={{ width: '12px', height: '12px' }} />
                      NOTIFIED
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      color: '#fbbf24'
                    }}>
                      <Bell style={{ width: '12px', height: '12px' }} />
                      PENDING
                    </span>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  {!entry.notified && (
                    <button
                      onClick={() => handleNotify(entry.productId, entry.email)}
                      title="Send notification"
                      style={{
                        padding: '6px',
                        background: 'transparent',
                        border: '1px solid rgba(16, 185, 129, 0.5)',
                        color: '#10b981',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <Send style={{ width: '14px', height: '14px' }} />
                    </button>
                  )}

                  <button
                    onClick={() => handleRemove(entry.productId, entry.email)}
                    title="Remove from waitlist"
                    style={{
                      padding: '6px',
                      background: 'transparent',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      color: 'rgba(239, 68, 68, 0.9)',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Bulk Actions per Product */}
      {selectedProduct !== 'all' && waitlistByProduct[selectedProduct] && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <h3 style={{
            fontSize: '12px',
            fontWeight: '300',
            letterSpacing: '0.15em',
            marginBottom: '16px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            BULK ACTIONS FOR {waitlistByProduct[selectedProduct].productName.toUpperCase()}
          </h3>

          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => handleNotifyAll(selectedProduct)}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                color: '#10b981',
                fontSize: '11px',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'
                e.currentTarget.style.borderColor = '#10b981'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)'
              }}
            >
              <Send style={{ width: '14px', height: '14px' }} />
              NOTIFY ALL PENDING
            </button>

            <span style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.05em'
            }}>
              {waitlistByProduct[selectedProduct].entries.filter(e => !e.notified).length} pending notification(s)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default WaitlistManager
