import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Calendar, MapPin, User, Package, Check, X, Clock, Filter,
  ChevronDown, QrCode, Camera, Search, DollarSign,
  CheckCircle, AlertCircle, Scan, CreditCard, ShoppingBag
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import useStore from '../../stores/useStore'
import useTryOnStore from '../../stores/useTryOnStore'
import type { TryOnReservation, Festival } from '../../stores/useTryOnStore'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/Toast'

type ViewMode = 'scanner' | 'list' | 'detail'

const TryOnManagement = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { pieces } = useStore()
  const {
    reservations,
    festivals,
    getReservationByQR,
    checkInReservation,
    processPayment,
    markPickedUp,
    addNote,
    updateReservation,
    cancelReservation
  } = useTryOnStore()
  const { addToast } = useToast()

  const [viewMode, setViewMode] = useState<ViewMode>('scanner')
  const [qrInput, setQrInput] = useState('')
  const [selectedReservation, setSelectedReservation] = useState<TryOnReservation | null>(null)
  const [selectedFestival, setSelectedFestival] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isScanning, setIsScanning] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [selectedPurchasePieces, setSelectedPurchasePieces] = useState<string[]>([])
  const [noteText, setNoteText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated || user?.email !== 'admin@kobysthreads.com') {
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  // Focus input on scanner mode
  useEffect(() => {
    if (viewMode === 'scanner' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [viewMode])

  // Handle QR code lookup
  const handleQRLookup = () => {
    if (!qrInput.trim()) {
      addToast('error', 'Please enter a reservation code')
      return
    }

    const reservation = getReservationByQR(qrInput.trim().toUpperCase())
    if (reservation) {
      setSelectedReservation(reservation)
      setViewMode('detail')
      setQrInput('')
      addToast('success', 'Reservation found!')
    } else {
      addToast('error', 'Reservation not found. Please check the code.')
    }
  }

  // Handle check-in
  const handleCheckIn = (id: string) => {
    checkInReservation(id)
    const updated = reservations.find(r => r.id === id)
    if (updated) {
      setSelectedReservation({ ...updated, status: 'checked_in', checkedInAt: new Date().toISOString() })
    }
    addToast('success', 'Customer checked in successfully!')
  }

  // Handle payment processing
  const handleProcessPayment = (id: string) => {
    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      addToast('error', 'Please enter a valid payment amount')
      return
    }

    processPayment(id, amount, selectedPurchasePieces)
    const updated = reservations.find(r => r.id === id)
    if (updated) {
      setSelectedReservation({
        ...updated,
        status: 'ready',
        paymentStatus: 'paid',
        paymentAmount: amount,
        selectedForPurchase: selectedPurchasePieces
      })
    }
    setPaymentAmount('')
    setSelectedPurchasePieces([])
    addToast('success', `Payment of $${amount.toFixed(2)} processed!`)
  }

  // Handle pickup completion
  const handleMarkPickedUp = (id: string) => {
    markPickedUp(id)
    const updated = reservations.find(r => r.id === id)
    if (updated) {
      setSelectedReservation({ ...updated, status: 'picked_up', pickedUpAt: new Date().toISOString() })
    }
    addToast('success', 'Order marked as picked up!')
  }

  // Handle adding note
  const handleAddNote = (id: string) => {
    if (!noteText.trim()) return
    addNote(id, `[${new Date().toLocaleString()}] ${noteText}`)
    const reservation = selectedReservation
    if (reservation) {
      const newNote = reservation.notes
        ? `${reservation.notes}\n[${new Date().toLocaleString()}] ${noteText}`
        : `[${new Date().toLocaleString()}] ${noteText}`
      setSelectedReservation({ ...reservation, notes: newNote })
    }
    setNoteText('')
    addToast('success', 'Note added')
  }

  // Handle cancel
  const handleCancel = (id: string) => {
    cancelReservation(id)
    setSelectedReservation(null)
    setViewMode('list')
    addToast('success', 'Reservation cancelled')
  }

  // Filter reservations
  const filteredReservations = reservations.filter(r => {
    if (selectedFestival !== 'all' && r.primaryFestival !== selectedFestival) return false
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false
    return true
  })

  // Get status styling
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'pending': return { bg: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' }
      case 'confirmed': return { bg: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: 'rgba(52, 211, 153, 0.3)' }
      case 'ready': return { bg: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' }
      case 'checked_in': return { bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', border: 'rgba(168, 85, 247, 0.3)' }
      case 'picked_up': return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' }
      case 'cancelled': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' }
      default: return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', border: 'rgba(107, 114, 128, 0.3)' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock style={{ width: '14px', height: '14px' }} />
      case 'confirmed': return <Check style={{ width: '14px', height: '14px' }} />
      case 'ready': return <Package style={{ width: '14px', height: '14px' }} />
      case 'checked_in': return <Scan style={{ width: '14px', height: '14px' }} />
      case 'picked_up': return <CheckCircle style={{ width: '14px', height: '14px' }} />
      case 'cancelled': return <X style={{ width: '14px', height: '14px' }} />
      default: return null
    }
  }

  const getFestivalName = (id: string) => {
    const festival = festivals.find(f => f.id === id)
    return festival?.name || id
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: '64px',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '300',
              letterSpacing: '0.2em',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <QrCode style={{ width: '24px', height: '24px' }} />
              FESTIVAL PICKUP MANAGER
            </h1>

            <div style={{ display: 'flex', gap: '8px' }}>
              {(['scanner', 'list'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '10px 20px',
                    background: viewMode === mode ? '#fff' : 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: viewMode === mode ? '#000' : '#fff',
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  {mode === 'scanner' ? <Scan style={{ width: '14px', height: '14px' }} /> : <Package style={{ width: '14px', height: '14px' }} />}
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'flex', gap: '24px', fontSize: '13px', opacity: 0.7 }}>
            <span>Total: {reservations.length}</span>
            <span>Pending: {reservations.filter(r => r.status === 'pending').length}</span>
            <span>Checked In: {reservations.filter(r => r.status === 'checked_in').length}</span>
            <span>Ready: {reservations.filter(r => r.status === 'ready').length}</span>
            <span>Completed: {reservations.filter(r => r.status === 'picked_up').length}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        <AnimatePresence mode="wait">
          {/* Scanner View */}
          {viewMode === 'scanner' && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}
            >
              <div style={{
                width: '120px',
                height: '120px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px'
              }}>
                <QrCode style={{ width: '64px', height: '64px', opacity: 0.5 }} />
              </div>

              <h2 style={{
                fontSize: '24px',
                fontWeight: '200',
                letterSpacing: '0.15em',
                marginBottom: '12px'
              }}>
                SCAN OR ENTER CODE
              </h2>
              <p style={{
                fontSize: '14px',
                opacity: 0.6,
                marginBottom: '40px'
              }}>
                Scan customer's QR code or manually enter the reservation code
              </p>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '32px'
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleQRLookup()}
                  placeholder="KH-XXXXXXXX"
                  style={{
                    flex: 1,
                    padding: '16px 20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '18px',
                    letterSpacing: '0.15em',
                    textAlign: 'center',
                    borderRadius: '8px'
                  }}
                />
                <button
                  onClick={handleQRLookup}
                  style={{
                    padding: '16px 32px',
                    background: '#fff',
                    border: 'none',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Search style={{ width: '18px', height: '18px' }} />
                  LOOKUP
                </button>
              </div>

              <p style={{ fontSize: '12px', opacity: 0.4 }}>
                Use a barcode scanner for quick entry
              </p>
            </motion.div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Filters */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedFestival}
                    onChange={(e) => setSelectedFestival(e.target.value)}
                    style={{
                      padding: '12px 40px 12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '13px',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      appearance: 'none',
                      minWidth: '220px'
                    }}
                  >
                    <option value="all" style={{ background: '#000' }}>All Festivals</option>
                    {festivals.filter(f => f.available).map(festival => (
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
                    pointerEvents: 'none',
                    opacity: 0.5
                  }} />
                </div>

                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      padding: '12px 40px 12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontSize: '13px',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      appearance: 'none',
                      minWidth: '180px'
                    }}
                  >
                    <option value="all" style={{ background: '#000' }}>All Status</option>
                    <option value="pending" style={{ background: '#000' }}>Pending</option>
                    <option value="confirmed" style={{ background: '#000' }}>Confirmed</option>
                    <option value="checked_in" style={{ background: '#000' }}>Checked In</option>
                    <option value="ready" style={{ background: '#000' }}>Ready</option>
                    <option value="picked_up" style={{ background: '#000' }}>Picked Up</option>
                    <option value="cancelled" style={{ background: '#000' }}>Cancelled</option>
                  </select>
                  <ChevronDown style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '16px',
                    height: '16px',
                    pointerEvents: 'none',
                    opacity: 0.5
                  }} />
                </div>
              </div>

              {filteredReservations.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  opacity: 0.5
                }}>
                  <Package style={{ width: '64px', height: '64px', margin: '0 auto 24px', opacity: 0.3 }} />
                  <p style={{ fontSize: '18px', marginBottom: '8px' }}>No reservations found</p>
                  <p style={{ fontSize: '14px', opacity: 0.7 }}>Reservations will appear here when customers book try-ons</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {filteredReservations.map((reservation) => {
                    const statusStyle = getStatusStyle(reservation.status)

                    return (
                      <motion.div
                        key={reservation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                          setSelectedReservation(reservation)
                          setViewMode('detail')
                        }}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 1fr auto auto',
                          gap: '20px',
                          padding: '20px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        whileHover={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {/* QR Code Preview */}
                        <div style={{
                          background: '#fff',
                          padding: '8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <QRCodeSVG value={reservation.qrCode} size={80} />
                        </div>

                        {/* Reservation Info */}
                        <div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            letterSpacing: '0.1em',
                            marginBottom: '8px'
                          }}>
                            {reservation.qrCode}
                          </div>
                          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>
                            {reservation.userEmail} {reservation.userName && `(${reservation.userName})`}
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.5 }}>
                            {reservation.pieces.length} pieces • {getFestivalName(reservation.primaryFestival)}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div style={{
                          padding: '8px 16px',
                          background: statusStyle.bg,
                          border: `1px solid ${statusStyle.border}`,
                          color: statusStyle.color,
                          borderRadius: '20px',
                          fontSize: '12px',
                          letterSpacing: '0.1em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          textTransform: 'uppercase'
                        }}>
                          {getStatusIcon(reservation.status)}
                          {reservation.status.replace('_', ' ')}
                        </div>

                        {/* Time */}
                        <div style={{ fontSize: '12px', opacity: 0.5, textAlign: 'right' }}>
                          {new Date(reservation.createdAt).toLocaleDateString()}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Detail View */}
          {viewMode === 'detail' && selectedReservation && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button
                onClick={() => {
                  setViewMode('scanner')
                  setSelectedReservation(null)
                }}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  marginBottom: '32px'
                }}
              >
                ← BACK TO SCANNER
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px' }}>
                {/* Left: QR & Customer Info */}
                <div>
                  <div style={{
                    background: '#fff',
                    padding: '24px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '24px'
                  }}>
                    <QRCodeSVG value={selectedReservation.qrCode} size={200} />
                    <div style={{
                      marginTop: '16px',
                      fontSize: '24px',
                      fontWeight: '600',
                      color: '#000',
                      letterSpacing: '0.1em'
                    }}>
                      {selectedReservation.qrCode}
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px'
                  }}>
                    <h3 style={{
                      fontSize: '12px',
                      letterSpacing: '0.2em',
                      opacity: 0.5,
                      marginBottom: '16px'
                    }}>
                      CUSTOMER INFO
                    </h3>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>
                        {selectedReservation.userName || 'Guest'}
                      </div>
                      <div style={{ fontSize: '14px', opacity: 0.7 }}>
                        {selectedReservation.userEmail}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.5 }}>
                      Booked: {new Date(selectedReservation.createdAt).toLocaleString()}
                    </div>
                    {selectedReservation.checkedInAt && (
                      <div style={{ fontSize: '13px', opacity: 0.5, marginTop: '4px' }}>
                        Checked in: {new Date(selectedReservation.checkedInAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Details & Actions */}
                <div>
                  {/* Status Banner */}
                  <div style={{
                    padding: '20px 24px',
                    background: getStatusStyle(selectedReservation.status).bg,
                    border: `1px solid ${getStatusStyle(selectedReservation.status).border}`,
                    borderRadius: '12px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: getStatusStyle(selectedReservation.status).color
                    }}>
                      {getStatusIcon(selectedReservation.status)}
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        {selectedReservation.status.replace('_', ' ')}
                      </span>
                    </div>
                    {selectedReservation.paymentStatus === 'paid' && (
                      <div style={{
                        fontSize: '14px',
                        color: '#22c55e',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <CheckCircle style={{ width: '16px', height: '16px' }} />
                        Paid: ${selectedReservation.paymentAmount?.toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Festival Info */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{
                      fontSize: '12px',
                      letterSpacing: '0.2em',
                      opacity: 0.5,
                      marginBottom: '16px'
                    }}>
                      FESTIVAL
                    </h3>
                    <div style={{ fontSize: '18px', fontWeight: '400', marginBottom: '8px' }}>
                      {getFestivalName(selectedReservation.primaryFestival)}
                    </div>
                    {selectedReservation.alternateFestival && (
                      <div style={{ fontSize: '13px', opacity: 0.5 }}>
                        Alternate: {getFestivalName(selectedReservation.alternateFestival)}
                      </div>
                    )}
                  </div>

                  {/* Reserved Pieces */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{
                      fontSize: '12px',
                      letterSpacing: '0.2em',
                      opacity: 0.5,
                      marginBottom: '16px'
                    }}>
                      RESERVED PIECES ({selectedReservation.pieces.length})
                    </h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {selectedReservation.pieces.map(pieceId => {
                        const piece = pieces.find(p => p.id === pieceId)
                        if (!piece) return null

                        const isSelectedForPurchase = selectedPurchasePieces.includes(pieceId) ||
                          selectedReservation.selectedForPurchase?.includes(pieceId)

                        return (
                          <div
                            key={pieceId}
                            style={{
                              display: 'flex',
                              gap: '16px',
                              padding: '12px',
                              background: isSelectedForPurchase
                                ? 'rgba(34, 197, 94, 0.1)'
                                : 'rgba(255, 255, 255, 0.02)',
                              border: `1px solid ${isSelectedForPurchase
                                ? 'rgba(34, 197, 94, 0.3)'
                                : 'rgba(255, 255, 255, 0.05)'}`,
                              borderRadius: '8px',
                              alignItems: 'center',
                              cursor: selectedReservation.status === 'checked_in' ? 'pointer' : 'default'
                            }}
                            onClick={() => {
                              if (selectedReservation.status === 'checked_in') {
                                setSelectedPurchasePieces(prev =>
                                  prev.includes(pieceId)
                                    ? prev.filter(id => id !== pieceId)
                                    : [...prev, pieceId]
                                )
                              }
                            }}
                          >
                            <img
                              src={piece.imageUrl}
                              alt={piece.name}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                                {piece.name}
                              </div>
                              <div style={{ fontSize: '12px', opacity: 0.6 }}>
                                ${piece.price.toLocaleString()}
                              </div>
                            </div>
                            {selectedReservation.status === 'checked_in' && (
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                border: isSelectedForPurchase
                                  ? '2px solid #22c55e'
                                  : '2px solid rgba(255, 255, 255, 0.3)',
                                background: isSelectedForPurchase ? '#22c55e' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {isSelectedForPurchase && <Check style={{ width: '14px', height: '14px', color: '#000' }} />}
                              </div>
                            )}
                            {selectedReservation.selectedForPurchase?.includes(pieceId) && (
                              <div style={{
                                padding: '4px 8px',
                                background: 'rgba(34, 197, 94, 0.2)',
                                borderRadius: '4px',
                                fontSize: '11px',
                                color: '#22c55e'
                              }}>
                                PURCHASED
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Action Buttons based on status */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px'
                  }}>
                    <h3 style={{
                      fontSize: '12px',
                      letterSpacing: '0.2em',
                      opacity: 0.5,
                      marginBottom: '16px'
                    }}>
                      ACTIONS
                    </h3>

                    {/* Pending: Confirm or Cancel */}
                    {selectedReservation.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => {
                            updateReservation(selectedReservation.id, { status: 'confirmed', confirmedAt: new Date().toISOString() })
                            setSelectedReservation({ ...selectedReservation, status: 'confirmed' })
                            addToast('success', 'Reservation confirmed!')
                          }}
                          style={{
                            flex: 1,
                            padding: '16px',
                            background: '#22c55e',
                            border: 'none',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '500',
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <Check style={{ width: '18px', height: '18px' }} />
                          CONFIRM RESERVATION
                        </button>
                        <button
                          onClick={() => handleCancel(selectedReservation.id)}
                          style={{
                            padding: '16px 24px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            fontSize: '14px',
                            fontWeight: '500',
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            borderRadius: '8px'
                          }}
                        >
                          CANCEL
                        </button>
                      </div>
                    )}

                    {/* Confirmed: Check In */}
                    {selectedReservation.status === 'confirmed' && (
                      <button
                        onClick={() => handleCheckIn(selectedReservation.id)}
                        style={{
                          width: '100%',
                          padding: '16px',
                          background: '#a855f7',
                          border: 'none',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '500',
                          letterSpacing: '0.1em',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <Scan style={{ width: '18px', height: '18px' }} />
                        CHECK IN CUSTOMER
                      </button>
                    )}

                    {/* Checked In: Process Payment */}
                    {selectedReservation.status === 'checked_in' && (
                      <div>
                        <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '16px' }}>
                          Select pieces customer wants to purchase, then process payment
                        </p>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                          <div style={{ position: 'relative', flex: 1 }}>
                            <DollarSign style={{
                              position: 'absolute',
                              left: '16px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '18px',
                              height: '18px',
                              opacity: 0.5
                            }} />
                            <input
                              type="number"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              placeholder="Enter amount"
                              style={{
                                width: '100%',
                                padding: '16px 16px 16px 44px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#fff',
                                fontSize: '16px',
                                borderRadius: '8px'
                              }}
                            />
                          </div>
                          <button
                            onClick={() => handleProcessPayment(selectedReservation.id)}
                            style={{
                              padding: '16px 32px',
                              background: '#22c55e',
                              border: 'none',
                              color: '#fff',
                              fontSize: '14px',
                              fontWeight: '500',
                              letterSpacing: '0.1em',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <CreditCard style={{ width: '18px', height: '18px' }} />
                            PROCESS PAYMENT
                          </button>
                        </div>
                        {selectedPurchasePieces.length > 0 && (
                          <p style={{ fontSize: '12px', opacity: 0.5 }}>
                            {selectedPurchasePieces.length} piece(s) selected for purchase
                          </p>
                        )}
                      </div>
                    )}

                    {/* Ready: Mark Picked Up */}
                    {selectedReservation.status === 'ready' && (
                      <button
                        onClick={() => handleMarkPickedUp(selectedReservation.id)}
                        style={{
                          width: '100%',
                          padding: '16px',
                          background: '#3b82f6',
                          border: 'none',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '500',
                          letterSpacing: '0.1em',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <ShoppingBag style={{ width: '18px', height: '18px' }} />
                        MARK AS PICKED UP
                      </button>
                    )}

                    {/* Picked Up: Complete */}
                    {selectedReservation.status === 'picked_up' && (
                      <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '8px'
                      }}>
                        <CheckCircle style={{ width: '48px', height: '48px', color: '#22c55e', margin: '0 auto 12px' }} />
                        <p style={{ fontSize: '16px', color: '#22c55e', fontWeight: '500' }}>
                          ORDER COMPLETE
                        </p>
                        <p style={{ fontSize: '13px', opacity: 0.7, marginTop: '8px' }}>
                          Picked up: {selectedReservation.pickedUpAt && new Date(selectedReservation.pickedUpAt).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Cancelled */}
                    {selectedReservation.status === 'cancelled' && (
                      <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px'
                      }}>
                        <X style={{ width: '48px', height: '48px', color: '#ef4444', margin: '0 auto 12px' }} />
                        <p style={{ fontSize: '16px', color: '#ef4444', fontWeight: '500' }}>
                          RESERVATION CANCELLED
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Notes Section */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginTop: '24px'
                  }}>
                    <h3 style={{
                      fontSize: '12px',
                      letterSpacing: '0.2em',
                      opacity: 0.5,
                      marginBottom: '16px'
                    }}>
                      NOTES
                    </h3>
                    {selectedReservation.notes && (
                      <div style={{
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        opacity: 0.8,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {selectedReservation.notes}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedReservation.id)}
                        placeholder="Add a note..."
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          fontSize: '14px',
                          borderRadius: '6px'
                        }}
                      />
                      <button
                        onClick={() => handleAddNote(selectedReservation.id)}
                        style={{
                          padding: '12px 20px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          fontSize: '12px',
                          letterSpacing: '0.1em',
                          cursor: 'pointer',
                          borderRadius: '6px'
                        }}
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TryOnManagement
