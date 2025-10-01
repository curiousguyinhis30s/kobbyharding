import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, User, Package, Check, X, Clock, Filter, ChevronDown } from 'lucide-react'
import useStore from '../../stores/useStore'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/Toast'

const TryOnManagement = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { pieces, getTryOnReservations, removeTryOnReservation } = useStore()
  const { addToast } = useToast()
  const [selectedFestival, setSelectedFestival] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [localReservations, setLocalReservations] = useState(getTryOnReservations())
  
  // Check admin access
  useEffect(() => {
    if (!isAuthenticated || user?.email !== 'admin@kobysthreads.com') {
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  // Sync with store on mount
  useEffect(() => {
    setLocalReservations(getTryOnReservations())
  }, [getTryOnReservations])
  
  const festivals = [
    { id: 'bangkok', name: 'BANGKOK KIZOMBA', date: 'MAR 15-17' },
    { id: 'singapore', name: 'SINGAPORE URBAN KIZ', date: 'APR 5-7' },
    { id: 'bali', name: 'BALI TARRAXO FEST', date: 'MAY 10-12' },
    { id: 'tokyo', name: 'TOKYO KIZOMBA WEEK', date: 'JUN 21-23' },
    { id: 'seoul', name: 'SEOUL URBAN FEST', date: 'JUL 12-14' },
    { id: 'hongkong', name: 'HONG KONG KIZ', date: 'AUG 9-11' }
  ]
  
  // Filter reservations
  let filteredReservations = localReservations
  if (selectedFestival !== 'all') {
    filteredReservations = filteredReservations.filter(r => r.festivalId === selectedFestival)
  }
  if (selectedStatus !== 'all') {
    filteredReservations = filteredReservations.filter(r => r.status === selectedStatus)
  }

  // Group reservations by festival
  const groupedReservations = filteredReservations.reduce((acc, reservation) => {
    if (!acc[reservation.festivalId]) {
      acc[reservation.festivalId] = []
    }
    acc[reservation.festivalId].push(reservation)
    return acc
  }, {} as Record<string, typeof filteredReservations>)

  const updateReservationStatus = (pieceId: string, festivalId: string, status: 'confirmed' | 'completed') => {
    try {
      setLocalReservations(prev =>
        prev.map(res =>
          res.pieceId === pieceId && res.festivalId === festivalId
            ? { ...res, status }
            : res
        )
      )
      const statusText = status.charAt(0).toUpperCase() + status.slice(1)
      addToast('success', `Reservation marked as ${statusText}`)
    } catch (error) {
      addToast('error', 'Failed to update reservation status. Please try again.')
      console.error('Error updating reservation status:', error)
    }
  }

  const handleCancelReservation = (pieceId: string, festivalId: string) => {
    try {
      removeTryOnReservation(pieceId, festivalId)
      setLocalReservations(prev =>
        prev.filter(res => !(res.pieceId === pieceId && res.festivalId === festivalId))
      )
      addToast('success', 'Reservation cancelled')
    } catch (error) {
      addToast('error', 'Failed to cancel reservation. Please try again.')
      console.error('Error cancelling reservation:', error)
    }
  }
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#fbbf24'
      case 'confirmed': return '#34d399'
      case 'completed': return '#818cf8'
      default: return '#6b7280'
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock style={{ width: '14px', height: '14px' }} />
      case 'confirmed': return <Check style={{ width: '14px', height: '14px' }} />
      case 'completed': return <Package style={{ width: '14px', height: '14px' }} />
      default: return null
    }
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      paddingTop: '80px'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: '64px',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '200',
              letterSpacing: '0.2em'
            }}>
              TRY-ON RESERVATIONS
            </h1>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            }}>
              <div style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                fontSize: '13px',
                letterSpacing: '0.1em'
              }}>
                Total: {filteredReservations.length} reservations
              </div>
            </div>
          </div>
          
          {/* Filters */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {/* Festival Filter */}
            <div style={{ position: 'relative' }}>
              <select
                value={selectedFestival}
                onChange={(e) => setSelectedFestival(e.target.value)}
                style={{
                  padding: '10px 40px 10px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  appearance: 'none',
                  minWidth: '200px'
                }}
              >
                <option value="all" style={{ background: '#000' }}>All Festivals</option>
                {festivals.map(festival => (
                  <option key={festival.id} value={festival.id} style={{ background: '#000' }}>
                    {festival.name}
                  </option>
                ))}
              </select>
              <ChevronDown style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                pointerEvents: 'none'
              }} />
            </div>
            
            {/* Status Filter */}
            <div style={{ position: 'relative' }}>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: '10px 40px 10px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  appearance: 'none',
                  minWidth: '150px'
                }}
              >
                <option value="all" style={{ background: '#000' }}>All Status</option>
                <option value="pending" style={{ background: '#000' }}>Pending</option>
                <option value="confirmed" style={{ background: '#000' }}>Confirmed</option>
                <option value="completed" style={{ background: '#000' }}>Completed</option>
              </select>
              <ChevronDown style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                pointerEvents: 'none'
              }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {Object.keys(groupedReservations).length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            opacity: 0.5
          }}>
            <Package style={{ width: '64px', height: '64px', margin: '0 auto 24px', opacity: 0.3 }} />
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>No try-on reservations found</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>Reservations will appear here when customers request try-ons at festivals</p>
          </div>
        ) : (
          Object.entries(groupedReservations).map(([festivalId, reservations]) => {
            const festival = festivals.find(f => f.id === festivalId)
            if (!festival) return null
            
            return (
              <motion.div
                key={festivalId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginBottom: '40px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                {/* Festival Header */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '20px 24px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '300',
                        letterSpacing: '0.15em',
                        marginBottom: '8px'
                      }}>
                        {festival.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '13px', opacity: 0.7 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar style={{ width: '14px', height: '14px' }} />
                          {festival.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Package style={{ width: '14px', height: '14px' }} />
                          {reservations.length} items
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Reservations List */}
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {reservations.map((reservation) => {
                      const piece = pieces.find(p => p.id === reservation.pieceId)
                      if (!piece) return null
                      
                      return (
                        <div
                          key={`${reservation.pieceId}-${reservation.festivalId}`}
                          style={{
                            display: 'flex',
                            gap: '16px',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px',
                            alignItems: 'center'
                          }}
                        >
                          {/* Product Image */}
                          <img
                            src={piece.imageUrl}
                            alt={piece.name}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                          
                          {/* Product Info */}
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '400',
                              letterSpacing: '0.1em',
                              marginBottom: '4px'
                            }}>
                              {piece.name}
                            </h4>
                            <p style={{
                              fontSize: '12px',
                              opacity: 0.6,
                              marginBottom: '8px'
                            }}>
                              {piece.vibe}
                            </p>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '12px',
                              color: getStatusColor(reservation.status)
                            }}>
                              {getStatusIcon(reservation.status)}
                              <span style={{ textTransform: 'capitalize' }}>{reservation.status}</span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {reservation.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateReservationStatus(reservation.pieceId, reservation.festivalId, 'confirmed')}
                                  style={{
                                    padding: '8px 16px',
                                    background: 'rgba(52, 211, 153, 0.1)',
                                    border: '1px solid rgba(52, 211, 153, 0.3)',
                                    color: '#34d399',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    transition: 'all 0.3s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(52, 211, 153, 0.2)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(52, 211, 153, 0.1)'
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleCancelReservation(reservation.pieceId, reservation.festivalId)}
                                  style={{
                                    padding: '8px 16px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    transition: 'all 0.3s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {reservation.status === 'confirmed' && (
                              <button
                                onClick={() => updateReservationStatus(reservation.pieceId, reservation.festivalId, 'completed')}
                                style={{
                                  padding: '8px 16px',
                                  background: 'rgba(129, 140, 248, 0.1)',
                                  border: '1px solid rgba(129, 140, 248, 0.3)',
                                  color: '#818cf8',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  borderRadius: '4px',
                                  transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'rgba(129, 140, 248, 0.2)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'rgba(129, 140, 248, 0.1)'
                                }}
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default TryOnManagement