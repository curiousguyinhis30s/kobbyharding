import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Calendar, MapPin, Package, Star, Clock, ChevronRight, Heart,
  Check, X, Sparkles, QrCode, ArrowRight, User, Mail,
  CheckCircle2, Circle, Ticket
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import useStore from '../stores/useStore'
import useTryOnStore from '../stores/useTryOnStore'
import type { Festival, TryOnReservation } from '../stores/useTryOnStore'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'
import { mockPieces } from '../data/mockData'

type ReservationStep = 'browse' | 'select-pieces' | 'select-festival' | 'confirm' | 'success'

const FestivalHub = () => {
  const navigate = useNavigate()
  const { pieces, setPieces, toggleFavorite, isFavorite } = useStore()
  const {
    festivals,
    getAvailableFestivals,
    createReservation,
    getUserReservations
  } = useTryOnStore()
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useToast()

  const [step, setStep] = useState<ReservationStep>('browse')
  const [selectedPieces, setSelectedPieces] = useState<string[]>([])
  const [primaryFestival, setPrimaryFestival] = useState<string>('')
  const [alternateFestival, setAlternateFestival] = useState<string>('')
  const [newReservation, setNewReservation] = useState<TryOnReservation | null>(null)
  const [showMyReservations, setShowMyReservations] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const availableFestivals = getAvailableFestivals()
  const userReservations = user ? getUserReservations(user.id) : []

  useEffect(() => {
    if (pieces.length === 0) {
      setPieces(mockPieces)
    }
  }, [pieces.length, setPieces])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const festivalPieces = pieces.filter(p => p.available).slice(0, 12)

  const handleSelectPiece = (pieceId: string) => {
    if (selectedPieces.includes(pieceId)) {
      setSelectedPieces(prev => prev.filter(id => id !== pieceId))
    } else if (selectedPieces.length < 3) {
      setSelectedPieces(prev => [...prev, pieceId])
    } else {
      addToast('info', 'Maximum 3 pieces per reservation')
    }
  }

  const handleStartReservation = () => {
    if (!isAuthenticated) {
      addToast('info', 'Please sign in to reserve try-ons')
      navigate('/login', { state: { from: '/festival' } })
      return
    }
    setStep('select-pieces')
  }

  const handleConfirmReservation = () => {
    if (!user || selectedPieces.length === 0 || !primaryFestival) {
      addToast('error', 'Please complete all required fields')
      return
    }

    const reservation = createReservation({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      pieces: selectedPieces,
      primaryFestival,
      alternateFestival: alternateFestival || undefined
    })

    setNewReservation(reservation)
    setStep('success')
    addToast('success', 'Reservation created! Show your QR code at the festival.')
  }

  const resetFlow = () => {
    setStep('browse')
    setSelectedPieces([])
    setPrimaryFestival('')
    setAlternateFestival('')
    setNewReservation(null)
  }

  const getStepNumber = () => {
    switch (step) {
      case 'select-pieces': return 1
      case 'select-festival': return 2
      case 'confirm': return 3
      case 'success': return 4
      default: return 0
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff'
    }}>
      {/* Hero Section */}
      <AnimatePresence mode="wait">
        {step === 'browse' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'relative',
              padding: isMobile ? '80px 20px 40px' : '100px 40px 60px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: '24px',
                  fontSize: '11px',
                  letterSpacing: '0.15em'
                }}>
                  <Sparkles size={12} />
                  EXCLUSIVE FESTIVAL EXPERIENCE
                </div>

                <h1 style={{
                  fontSize: isMobile ? '32px' : '48px',
                  fontWeight: '200',
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                  lineHeight: '1.2'
                }}>
                  Try Before You Buy
                </h1>

                <p style={{
                  fontSize: isMobile ? '14px' : '16px',
                  color: 'rgba(255,255,255,0.6)',
                  maxWidth: '600px',
                  lineHeight: '1.7',
                  marginBottom: '32px'
                }}>
                  Reserve up to 3 exclusive pieces for try-on at any festival.
                  Show your QR code, experience the craftsmanship, and only pay for what you love.
                </p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartReservation}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 28px',
                      background: '#fff',
                      color: '#000',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '500',
                      letterSpacing: '0.1em',
                      cursor: 'pointer'
                    }}
                  >
                    RESERVE TRY-ON
                    <ArrowRight size={16} />
                  </motion.button>

                  {isAuthenticated && userReservations.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowMyReservations(!showMyReservations)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '14px 28px',
                        background: 'transparent',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.3)',
                        fontSize: '12px',
                        fontWeight: '400',
                        letterSpacing: '0.1em',
                        cursor: 'pointer'
                      }}
                    >
                      <Ticket size={16} />
                      MY RESERVATIONS ({userReservations.length})
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* How it works */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                  gap: '24px',
                  marginTop: '48px'
                }}
              >
                {[
                  { icon: Package, title: 'Choose 3 Pieces', desc: 'Select up to 3 exclusive pieces to try on' },
                  { icon: Calendar, title: 'Pick Your Festival', desc: 'Choose primary and backup festival locations' },
                  { icon: QrCode, title: 'Show QR Code', desc: 'Present your code at the festival booth' }
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '24px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <item.icon size={18} style={{ opacity: 0.8 }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Progress Bar */}
      {step !== 'browse' && step !== 'success' && (
        <div style={{
          padding: isMobile ? '20px' : '24px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {['Select Pieces', 'Choose Festival', 'Confirm'].map((label, i) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    opacity: getStepNumber() > i ? 1 : 0.4
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: getStepNumber() > i ? '#fff' : 'transparent',
                    border: getStepNumber() > i ? 'none' : '1px solid rgba(255,255,255,0.3)',
                    color: getStepNumber() > i ? '#000' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {getStepNumber() > i + 1 ? <Check size={14} /> : i + 1}
                  </div>
                  {!isMobile && (
                    <span style={{ fontSize: '12px', letterSpacing: '0.1em' }}>{label}</span>
                  )}
                  {i < 2 && (
                    <div style={{
                      width: isMobile ? '30px' : '60px',
                      height: '1px',
                      background: getStepNumber() > i + 1 ? '#fff' : 'rgba(255,255,255,0.2)',
                      marginLeft: isMobile ? '8px' : '16px'
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Select Pieces */}
        {step === 'select-pieces' && (
          <motion.div
            key="select-pieces"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ padding: isMobile ? '24px 20px' : '40px' }}
          >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
              }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '300', marginBottom: '8px' }}>
                    Select Your Pieces
                  </h2>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                    Choose up to 3 pieces to try on at the festival
                  </p>
                </div>
                <div style={{
                  padding: '8px 16px',
                  background: selectedPieces.length === 3 ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selectedPieces.length === 3 ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {selectedPieces.length}/3 Selected
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: isMobile ? '12px' : '20px'
              }}>
                {festivalPieces.map((piece) => {
                  const isSelected = selectedPieces.includes(piece.id)
                  return (
                    <motion.div
                      key={piece.id}
                      whileHover={{ y: -4 }}
                      onClick={() => handleSelectPiece(piece.id)}
                      style={{
                        position: 'relative',
                        background: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                        border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          zIndex: 10,
                          width: '28px',
                          height: '28px',
                          background: '#fff',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={16} color="#000" />
                        </div>
                      )}

                      <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                        <img
                          src={piece.imageUrl}
                          alt={piece.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: isSelected ? 0.9 : 1
                          }}
                        />
                      </div>

                      <div style={{ padding: isMobile ? '12px' : '16px' }}>
                        <h3 style={{
                          fontSize: '12px',
                          fontWeight: '400',
                          letterSpacing: '0.1em',
                          marginBottom: '6px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {piece.name}
                        </h3>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontSize: '14px', fontWeight: '300' }}>
                            ${piece.price}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(piece.id)
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <Heart
                              size={16}
                              fill={isFavorite(piece.id) ? '#fff' : 'none'}
                              color="#fff"
                              style={{ opacity: 0.6 }}
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <button
                  onClick={resetFlow}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer'
                  }}
                >
                  BACK
                </button>
                <button
                  onClick={() => selectedPieces.length > 0 && setStep('select-festival')}
                  disabled={selectedPieces.length === 0}
                  style={{
                    padding: '12px 32px',
                    background: selectedPieces.length > 0 ? '#fff' : 'rgba(255,255,255,0.1)',
                    color: selectedPieces.length > 0 ? '#000' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    cursor: selectedPieces.length > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  CONTINUE
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Festival */}
        {step === 'select-festival' && (
          <motion.div
            key="select-festival"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ padding: isMobile ? '24px 20px' : '40px' }}
          >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '300', marginBottom: '8px' }}>
                Choose Your Festival
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
                Select where you'd like to try on your pieces
              </p>

              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  marginBottom: '12px',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  PRIMARY FESTIVAL *
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {availableFestivals.map((festival) => (
                    <div
                      key={festival.id}
                      onClick={() => setPrimaryFestival(festival.id)}
                      style={{
                        padding: '20px',
                        background: primaryFestival === festival.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                        border: primaryFestival === festival.id ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '400', marginBottom: '8px' }}>
                            {festival.name}
                          </h3>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={12} /> {festival.date}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin size={12} /> {festival.city}, {festival.country}
                            </span>
                          </div>
                        </div>
                        {primaryFestival === festival.id && (
                          <CheckCircle2 size={20} style={{ color: '#fff' }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  marginBottom: '12px',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  ALTERNATE FESTIVAL (Optional)
                </label>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>
                  In case you can't make it to your primary festival
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {availableFestivals
                    .filter(f => f.id !== primaryFestival)
                    .map((festival) => (
                      <div
                        key={festival.id}
                        onClick={() => setAlternateFestival(alternateFestival === festival.id ? '' : festival.id)}
                        style={{
                          padding: '16px 20px',
                          background: alternateFestival === festival.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                          border: alternateFestival === festival.id ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h3 style={{ fontSize: '14px', fontWeight: '400', marginBottom: '4px' }}>
                              {festival.name}
                            </h3>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                              {festival.date}
                            </span>
                          </div>
                          {alternateFestival === festival.id ? (
                            <CheckCircle2 size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
                          ) : (
                            <Circle size={18} style={{ color: 'rgba(255,255,255,0.2)' }} />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <button
                  onClick={() => setStep('select-pieces')}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer'
                  }}
                >
                  BACK
                </button>
                <button
                  onClick={() => primaryFestival && setStep('confirm')}
                  disabled={!primaryFestival}
                  style={{
                    padding: '12px 32px',
                    background: primaryFestival ? '#fff' : 'rgba(255,255,255,0.1)',
                    color: primaryFestival ? '#000' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    cursor: primaryFestival ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  CONTINUE
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ padding: isMobile ? '24px 20px' : '40px' }}
          >
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '300', marginBottom: '8px' }}>
                Confirm Reservation
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
                Review your try-on reservation details
              </p>

              {/* Selected Pieces */}
              <div style={{
                padding: '24px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '16px'
              }}>
                <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '16px', color: 'rgba(255,255,255,0.6)' }}>
                  SELECTED PIECES ({selectedPieces.length})
                </h3>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
                  {selectedPieces.map(pieceId => {
                    const piece = pieces.find(p => p.id === pieceId)
                    return piece ? (
                      <div key={pieceId} style={{ flexShrink: 0, width: '100px' }}>
                        <img
                          src={piece.imageUrl}
                          alt={piece.name}
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <p style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>
                          {piece.name}
                        </p>
                      </div>
                    ) : null
                  })}
                </div>
              </div>

              {/* Festival Details */}
              <div style={{
                padding: '24px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '16px'
              }}>
                <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '16px', color: 'rgba(255,255,255,0.6)' }}>
                  FESTIVAL DETAILS
                </h3>
                {(() => {
                  const primary = festivals.find(f => f.id === primaryFestival)
                  const alternate = alternateFestival ? festivals.find(f => f.id === alternateFestival) : null
                  return (
                    <div>
                      <div style={{ marginBottom: '16px' }}>
                        <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>
                          PRIMARY
                        </span>
                        <p style={{ fontSize: '15px', marginTop: '4px' }}>{primary?.name}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                          {primary?.date} • {primary?.city}
                        </p>
                      </div>
                      {alternate && (
                        <div>
                          <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>
                            ALTERNATE
                          </span>
                          <p style={{ fontSize: '14px', marginTop: '4px' }}>{alternate.name}</p>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            {alternate.date} • {alternate.city}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* User Details */}
              <div style={{
                padding: '24px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '16px', color: 'rgba(255,255,255,0.6)' }}>
                  RESERVATION FOR
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={18} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px' }}>{user?.name || 'Guest'}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{user?.email}</p>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <button
                  onClick={() => setStep('select-festival')}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer'
                  }}
                >
                  BACK
                </button>
                <button
                  onClick={handleConfirmReservation}
                  style={{
                    padding: '14px 32px',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  CONFIRM RESERVATION
                  <Check size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && newReservation && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ padding: isMobile ? '40px 20px' : '60px 40px' }}
          >
            <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(16,185,129,0.1)',
                  border: '2px solid rgba(16,185,129,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}
              >
                <Check size={36} style={{ color: '#10b981' }} />
              </motion.div>

              <h2 style={{ fontSize: '28px', fontWeight: '300', marginBottom: '12px' }}>
                Reservation Confirmed!
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
                Show this QR code at the festival booth to try on your pieces
              </p>

              {/* QR Code */}
              <div style={{
                padding: '32px',
                background: '#fff',
                display: 'inline-block',
                marginBottom: '24px'
              }}>
                <QRCodeSVG
                  value={`https://khardingclassics.com/pickup/${newReservation.qrCode}`}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div style={{
                padding: '16px 24px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'inline-block',
                marginBottom: '32px'
              }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                  RESERVATION CODE
                </p>
                <p style={{ fontSize: '20px', fontWeight: '500', letterSpacing: '0.1em' }}>
                  {newReservation.qrCode}
                </p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  A confirmation email has been sent to {user?.email}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    resetFlow()
                    setShowMyReservations(true)
                  }}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer'
                  }}
                >
                  VIEW ALL RESERVATIONS
                </button>
                <button
                  onClick={resetFlow}
                  style={{
                    padding: '12px 24px',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    cursor: 'pointer'
                  }}
                >
                  DONE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Reservations Modal */}
      <AnimatePresence>
        {showMyReservations && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMyReservations(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 100
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '80vh',
                background: '#0a0a0a',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                zIndex: 101,
                overflowY: 'auto',
                padding: isMobile ? '24px 20px' : '32px 40px'
              }}
            >
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '300' }}>My Reservations</h2>
                  <button
                    onClick={() => setShowMyReservations(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: '8px'
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {userReservations.length === 0 ? (
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '40px' }}>
                    No reservations yet. Start by selecting pieces to try on!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {userReservations.map((res) => {
                      const festival = festivals.find(f => f.id === res.primaryFestival)
                      return (
                        <div
                          key={res.id}
                          style={{
                            padding: '20px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '16px'
                          }}>
                            <div>
                              <div style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                background: res.status === 'pending' ? 'rgba(234,179,8,0.1)' :
                                           res.status === 'confirmed' ? 'rgba(16,185,129,0.1)' :
                                           res.status === 'cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${res.status === 'pending' ? 'rgba(234,179,8,0.3)' :
                                                      res.status === 'confirmed' ? 'rgba(16,185,129,0.3)' :
                                                      res.status === 'cancelled' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                fontSize: '10px',
                                letterSpacing: '0.1em',
                                marginBottom: '8px',
                                textTransform: 'uppercase'
                              }}>
                                {res.status.replace('_', ' ')}
                              </div>
                              <h3 style={{ fontSize: '15px', fontWeight: '400' }}>{festival?.name}</h3>
                              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                                {festival?.date}
                              </p>
                            </div>
                            <div style={{
                              padding: '8px',
                              background: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <QRCodeSVG
                                value={`https://khardingclassics.com/pickup/${res.qrCode}`}
                                size={60}
                                level="M"
                              />
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap'
                          }}>
                            {res.pieces.map(pieceId => {
                              const piece = pieces.find(p => p.id === pieceId)
                              return piece ? (
                                <img
                                  key={pieceId}
                                  src={piece.imageUrl}
                                  alt={piece.name}
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                  }}
                                />
                              ) : null
                            })}
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '11px',
                              color: 'rgba(255,255,255,0.4)',
                              marginLeft: '8px'
                            }}>
                              Code: {res.qrCode}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Browse Festivals Section (when in browse mode) */}
      {step === 'browse' && (
        <div style={{ padding: isMobile ? '40px 20px' : '60px 40px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Upcoming Festivals */}
            <div style={{ marginBottom: '60px' }}>
              <h2 style={{
                fontSize: '12px',
                fontWeight: '400',
                letterSpacing: '0.2em',
                marginBottom: '24px',
                color: 'rgba(255,255,255,0.8)'
              }}>
                UPCOMING FESTIVALS
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '16px'
              }}>
                {festivals.map((festival, index) => (
                  <motion.div
                    key={festival.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      padding: '24px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      opacity: festival.available ? 1 : 0.5,
                      cursor: festival.available ? 'pointer' : 'default'
                    }}
                    onClick={() => {
                      if (festival.available) {
                        setPrimaryFestival(festival.id)
                        handleStartReservation()
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (festival.available) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '400', marginBottom: '12px' }}>
                          {festival.name}
                        </h3>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.5)'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={14} />
                            {festival.date}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={14} />
                            {festival.city}, {festival.country}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Package size={14} />
                            {festival.piecesAvailable} pieces available
                          </span>
                        </div>
                        {festival.description && (
                          <p style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.4)',
                            marginTop: '12px'
                          }}>
                            {festival.description}
                          </p>
                        )}
                      </div>
                      {festival.available ? (
                        <ChevronRight size={20} style={{ opacity: 0.5 }} />
                      ) : (
                        <span style={{
                          fontSize: '10px',
                          letterSpacing: '0.1em',
                          padding: '4px 8px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                          COMING SOON
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Festival Favorites */}
            <div>
              <h2 style={{
                fontSize: '12px',
                fontWeight: '400',
                letterSpacing: '0.2em',
                marginBottom: '24px',
                color: 'rgba(255,255,255,0.8)'
              }}>
                FESTIVAL FAVORITES
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: isMobile ? '12px' : '20px'
              }}>
                {festivalPieces.slice(0, 8).map((piece) => (
                  <motion.div
                    key={piece.id}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/piece/${piece.id}`)}
                    style={{
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.1)',
                      transition: 'border-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  >
                    <div style={{ aspectRatio: '1', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={piece.imageUrl}
                        alt={piece.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(piece.id)
                        }}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(0,0,0,0.5)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          borderRadius: '50%',
                          padding: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <Heart
                          size={16}
                          fill={isFavorite(piece.id) ? '#fff' : 'none'}
                          color="#fff"
                        />
                      </button>
                    </div>
                    <div style={{ padding: isMobile ? '12px' : '16px' }}>
                      <h3 style={{
                        fontSize: '12px',
                        fontWeight: '400',
                        letterSpacing: '0.1em',
                        marginBottom: '6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {piece.name}
                      </h3>
                      <span style={{ fontSize: '14px', fontWeight: '300' }}>
                        ${piece.price}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FestivalHub
