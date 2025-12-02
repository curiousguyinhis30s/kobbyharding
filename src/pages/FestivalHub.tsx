import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Calendar, MapPin, Package, Clock, ChevronRight, Heart,
  Check, X, Sparkles, QrCode, ArrowRight, User,
  CheckCircle2, Circle, Ticket, Play, ShoppingBag, CreditCard
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import useStore from '../stores/useStore'
import useTryOnStore from '../stores/useTryOnStore'
import type { TryOnReservation } from '../stores/useTryOnStore'
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
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768)

  // Refs for scroll animations
  const howItWorksRef = useRef(null)
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" })

  const availableFestivals = getAvailableFestivals()
  const userReservations = user ? getUserReservations(user.id) : []

  useEffect(() => {
    if (pieces.length === 0) {
      setPieces(mockPieces)
    }
  }, [pieces.length, setPieces])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768)
    }
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

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff'
    }}>
      {/* BROWSE MODE - Awareness First Approach */}
      <AnimatePresence mode="wait">
        {step === 'browse' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Section - The Hook */}
            <section style={{
              position: 'relative',
              minHeight: isMobile ? '85vh' : '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Background with subtle animation */}
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.3, 0.35, 0.3]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  inset: '-10%',
                  backgroundImage: 'url(/kobby-assets/models/IMG_3523.JPG)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.4)'
                }}
              />

              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)'
              }} />

              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
                padding: isMobile ? '0 24px' : '0 48px',
                maxWidth: '900px'
              }}>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    marginBottom: isMobile ? '24px' : '32px',
                    fontSize: '11px',
                    letterSpacing: '0.2em'
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles size={14} />
                  </motion.div>
                  A NEW WAY TO SHOP
                </motion.div>

                {/* Main headline - Animated word by word */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    fontSize: isMobile ? '36px' : isTablet ? '48px' : '64px',
                    fontWeight: '200',
                    letterSpacing: '-0.02em',
                    marginBottom: isMobile ? '20px' : '28px',
                    lineHeight: 1.1
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ display: 'block' }}
                  >
                    Try Before You Buy.
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    style={{ display: 'block', color: 'rgba(255,255,255,0.6)' }}
                  >
                    At the Festival.
                  </motion.span>
                </motion.h1>

                {/* Subheadline - The explanation */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  style={{
                    fontSize: isMobile ? '15px' : '18px',
                    color: 'rgba(255,255,255,0.7)',
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: 1.8,
                    marginBottom: isMobile ? '32px' : '40px'
                  }}
                >
                  Reserve exclusive pieces online. Try them on in person at Kizomba festivals across Asia.
                  Only pay for what you love.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.95)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartReservation}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: isMobile ? '14px 28px' : '16px 36px',
                      background: '#fff',
                      color: '#000',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '500',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    START RESERVING
                    <ArrowRight size={16} />
                  </motion.button>

                  {isAuthenticated && userReservations.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.5)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowMyReservations(!showMyReservations)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: isMobile ? '14px 28px' : '16px 36px',
                        background: 'transparent',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.3)',
                        fontSize: '12px',
                        fontWeight: '400',
                        letterSpacing: '0.15em',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Ticket size={16} />
                      MY RESERVATIONS ({userReservations.length})
                    </motion.button>
                  )}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  style={{
                    position: 'absolute',
                    bottom: isMobile ? '-60px' : '-80px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'rgba(255,255,255,0.4)'
                    }}
                  >
                    <span style={{ fontSize: '10px', letterSpacing: '0.2em' }}>HOW IT WORKS</span>
                    <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* How It Works - Visual Explainer */}
            <section
              ref={howItWorksRef}
              style={{
                padding: isMobile ? '80px 24px' : '120px 48px',
                background: 'linear-gradient(to bottom, #000 0%, #0a0a0a 100%)'
              }}
            >
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <motion.div
                  initial="hidden"
                  animate={howItWorksInView ? "visible" : "hidden"}
                  variants={staggerContainer}
                  style={{ textAlign: 'center', marginBottom: isMobile ? '48px' : '72px' }}
                >
                  <motion.h2
                    variants={fadeInUp}
                    style={{
                      fontSize: isMobile ? '28px' : '40px',
                      fontWeight: '200',
                      letterSpacing: '-0.01em',
                      marginBottom: '16px'
                    }}
                  >
                    How Festival Try-On Works
                  </motion.h2>
                  <motion.p
                    variants={fadeInUp}
                    style={{
                      fontSize: isMobile ? '14px' : '16px',
                      color: 'rgba(255,255,255,0.5)',
                      maxWidth: '500px',
                      margin: '0 auto'
                    }}
                  >
                    Three simple steps to experience our pieces before you buy
                  </motion.p>
                </motion.div>

                {/* Steps - Animated Cards */}
                <motion.div
                  initial="hidden"
                  animate={howItWorksInView ? "visible" : "hidden"}
                  variants={staggerContainer}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: isMobile ? '24px' : '32px'
                  }}
                >
                  {[
                    {
                      step: '01',
                      icon: ShoppingBag,
                      title: 'Reserve Online',
                      desc: 'Browse our collection and select up to 3 pieces you want to try. No payment required.',
                      color: 'rgba(99, 102, 241, 0.15)',
                      borderColor: 'rgba(99, 102, 241, 0.3)'
                    },
                    {
                      step: '02',
                      icon: QrCode,
                      title: 'Get Your QR Code',
                      desc: 'Receive a unique QR code instantly. This is your try-on pass for the festival.',
                      color: 'rgba(16, 185, 129, 0.15)',
                      borderColor: 'rgba(16, 185, 129, 0.3)'
                    },
                    {
                      step: '03',
                      icon: CreditCard,
                      title: 'Try & Buy',
                      desc: 'Show your code at our booth. Try on your reserved pieces. Only pay for what you love.',
                      color: 'rgba(249, 115, 22, 0.15)',
                      borderColor: 'rgba(249, 115, 22, 0.3)'
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      variants={scaleIn}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      style={{
                        padding: isMobile ? '32px 24px' : '40px 32px',
                        background: item.color,
                        border: `1px solid ${item.borderColor}`,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Step number */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={howItWorksInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
                        style={{
                          position: 'absolute',
                          top: '20px',
                          right: '20px',
                          fontSize: '48px',
                          fontWeight: '100',
                          color: 'rgba(255,255,255,0.08)',
                          lineHeight: 1
                        }}
                      >
                        {item.step}
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={howItWorksInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: 0.4 + i * 0.15, type: 'spring' }}
                        style={{
                          width: '56px',
                          height: '56px',
                          background: 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '24px'
                        }}
                      >
                        <item.icon size={24} />
                      </motion.div>

                      <h3 style={{
                        fontSize: isMobile ? '18px' : '20px',
                        fontWeight: '400',
                        marginBottom: '12px',
                        letterSpacing: '0.02em'
                      }}>
                        {item.title}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.7
                      }}>
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Benefits callout */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                  style={{
                    marginTop: isMobile ? '48px' : '64px',
                    padding: isMobile ? '24px' : '32px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: isMobile ? '20px' : '32px',
                    textAlign: 'center'
                  }}
                >
                  {[
                    { label: 'No Upfront Payment', value: 'Zero Risk' },
                    { label: 'Reserved Just For You', value: 'Guaranteed Availability' },
                    { label: 'Experience In Person', value: 'Feel The Quality' }
                  ].map((benefit, i) => (
                    <div key={i}>
                      <div style={{
                        fontSize: isMobile ? '16px' : '18px',
                        fontWeight: '300',
                        marginBottom: '4px'
                      }}>
                        {benefit.value}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        color: 'rgba(255,255,255,0.4)'
                      }}>
                        {benefit.label.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Upcoming Festivals Section */}
            <section style={{
              padding: isMobile ? '60px 24px' : '100px 48px',
              background: '#0a0a0a'
            }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ marginBottom: isMobile ? '32px' : '48px' }}
                >
                  <h2 style={{
                    fontSize: isMobile ? '24px' : '32px',
                    fontWeight: '200',
                    marginBottom: '12px'
                  }}>
                    Upcoming Festivals
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.5)'
                  }}>
                    Find us at these Kizomba & urban dance festivals
                  </p>
                </motion.div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                  gap: '20px'
                }}>
                  {festivals.map((festival, index) => (
                    <motion.div
                      key={festival.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        y: -4,
                        borderColor: 'rgba(255,255,255,0.25)',
                        transition: { duration: 0.2 }
                      }}
                      onClick={() => {
                        if (festival.available) {
                          setPrimaryFestival(festival.id)
                          handleStartReservation()
                        }
                      }}
                      style={{
                        padding: isMobile ? '24px' : '28px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        cursor: festival.available ? 'pointer' : 'default',
                        opacity: festival.available ? 1 : 0.5,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          padding: '6px 12px',
                          background: festival.available ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${festival.available ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                          fontSize: '10px',
                          letterSpacing: '0.1em'
                        }}>
                          {festival.available ? 'OPEN FOR RESERVATIONS' : 'COMING SOON'}
                        </div>
                      </div>

                      <h3 style={{
                        fontSize: isMobile ? '18px' : '20px',
                        fontWeight: '400',
                        marginBottom: '16px'
                      }}>
                        {festival.name}
                      </h3>

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.6)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Calendar size={14} />
                          {festival.date}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <MapPin size={14} />
                          {festival.city}, {festival.country}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Package size={14} />
                          {festival.piecesAvailable} pieces available
                        </div>
                      </div>

                      {festival.available && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          style={{
                            marginTop: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            letterSpacing: '0.1em',
                            color: 'rgba(255,255,255,0.8)'
                          }}
                        >
                          RESERVE NOW
                          <ArrowRight size={14} />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Preview Pieces */}
            <section style={{
              padding: isMobile ? '60px 24px' : '100px 48px',
              background: '#000'
            }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: isMobile ? '32px' : '48px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <h2 style={{
                      fontSize: isMobile ? '24px' : '32px',
                      fontWeight: '200',
                      marginBottom: '8px'
                    }}>
                      Available for Try-On
                    </h2>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.5)'
                    }}>
                      Reserve these exclusive pieces for your festival experience
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartReservation}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: '#fff',
                      color: '#000',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: '500',
                      letterSpacing: '0.1em',
                      cursor: 'pointer'
                    }}
                  >
                    START RESERVING
                    <ArrowRight size={14} />
                  </motion.button>
                </motion.div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? 'repeat(2, 1fr)'
                    : isTablet
                      ? 'repeat(3, 1fr)'
                      : 'repeat(4, 1fr)',
                  gap: isMobile ? '12px' : '20px'
                }}>
                  {festivalPieces.slice(0, isMobile ? 6 : 8).map((piece, index) => (
                    <motion.div
                      key={piece.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -6 }}
                      onClick={() => navigate(`/piece/${piece.id}`)}
                      style={{
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255,255,255,0.02)'
                      }}
                    >
                      <div style={{
                        aspectRatio: '1',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                          src={piece.imageUrl}
                          alt={piece.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(piece.id)
                          }}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(10px)',
                            border: 'none',
                            borderRadius: '50%',
                            padding: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          <Heart
                            size={16}
                            fill={isFavorite(piece.id) ? '#fff' : 'none'}
                            color="#fff"
                          />
                        </motion.button>
                      </div>
                      <div style={{ padding: isMobile ? '14px' : '18px' }}>
                        <h3 style={{
                          fontSize: '13px',
                          fontWeight: '400',
                          letterSpacing: '0.08em',
                          marginBottom: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {piece.name}
                        </h3>
                        <span style={{
                          fontSize: '15px',
                          fontWeight: '300',
                          color: 'rgba(255,255,255,0.8)'
                        }}>
                          ${piece.price}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section style={{
              padding: isMobile ? '60px 24px' : '100px 48px',
              background: 'linear-gradient(to bottom, #0a0a0a 0%, #000 100%)',
              textAlign: 'center'
            }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ maxWidth: '600px', margin: '0 auto' }}
              >
                <h2 style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: '200',
                  marginBottom: '16px'
                }}>
                  Ready to Experience?
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '32px',
                  lineHeight: 1.7
                }}>
                  Reserve your pieces now and meet us at the next festival.
                  No commitment, no payment until you decide.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartReservation}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '18px 48px',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '500',
                    letterSpacing: '0.15em',
                    cursor: 'pointer'
                  }}
                >
                  START YOUR RESERVATION
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Progress Bar - Reservation Flow */}
      {step !== 'browse' && step !== 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            padding: isMobile ? '16px 20px' : '20px 40px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(20px)'
          }}
        >
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
                  <motion.div
                    animate={{
                      background: getStepNumber() > i ? '#fff' : 'transparent',
                      borderColor: getStepNumber() > i ? '#fff' : 'rgba(255,255,255,0.3)'
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '2px solid',
                      color: getStepNumber() > i ? '#000' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {getStepNumber() > i + 1 ? <Check size={14} /> : i + 1}
                  </motion.div>
                  {!isMobile && (
                    <span style={{ fontSize: '12px', letterSpacing: '0.1em' }}>{label}</span>
                  )}
                  {i < 2 && (
                    <motion.div
                      animate={{
                        background: getStepNumber() > i + 1 ? '#fff' : 'rgba(255,255,255,0.2)'
                      }}
                      style={{
                        width: isMobile ? '24px' : '48px',
                        height: '2px',
                        marginLeft: isMobile ? '8px' : '16px'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Step Content - Select Pieces */}
      <AnimatePresence mode="wait">
        {step === 'select-pieces' && (
          <motion.div
            key="select-pieces"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            style={{ padding: isMobile ? '24px 20px' : '48px' }}
          >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '300', marginBottom: '8px' }}>
                    Select Your Pieces
                  </h2>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                    Choose up to 3 pieces to try on at the festival
                  </p>
                </div>
                <motion.div
                  animate={{
                    background: selectedPieces.length === 3
                      ? 'rgba(16,185,129,0.15)'
                      : 'rgba(255,255,255,0.05)',
                    borderColor: selectedPieces.length === 3
                      ? 'rgba(16,185,129,0.4)'
                      : 'rgba(255,255,255,0.15)'
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {selectedPieces.length}/3 Selected
                </motion.div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? 'repeat(2, 1fr)'
                  : isTablet
                    ? 'repeat(3, 1fr)'
                    : 'repeat(4, 1fr)',
                gap: isMobile ? '12px' : '20px'
              }}>
                {festivalPieces.map((piece, index) => {
                  const isSelected = selectedPieces.includes(piece.id)
                  return (
                    <motion.div
                      key={piece.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectPiece(piece.id)}
                      style={{
                        position: 'relative',
                        background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                        border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              zIndex: 10,
                              width: '32px',
                              height: '32px',
                              background: '#fff',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Check size={18} color="#000" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                        <img
                          src={piece.imageUrl}
                          alt={piece.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: isSelected ? 0.85 : 1,
                            transition: 'opacity 0.2s'
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

              {/* Navigation */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '48px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetFlow}
                  style={{
                    padding: '14px 28px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer'
                  }}
                >
                  BACK
                </motion.button>
                <motion.button
                  whileHover={selectedPieces.length > 0 ? { scale: 1.02 } : {}}
                  whileTap={selectedPieces.length > 0 ? { scale: 0.98 } : {}}
                  onClick={() => selectedPieces.length > 0 && setStep('select-festival')}
                  disabled={selectedPieces.length === 0}
                  style={{
                    padding: '14px 36px',
                    background: selectedPieces.length > 0 ? '#fff' : 'rgba(255,255,255,0.1)',
                    color: selectedPieces.length > 0 ? '#000' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    cursor: selectedPieces.length > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  CONTINUE
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Festival */}
        {step === 'select-festival' && (
          <motion.div
            key="select-festival"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            style={{ padding: isMobile ? '24px 20px' : '48px' }}
          >
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '300', marginBottom: '8px' }}>
                Choose Your Festival
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '36px' }}>
                Select where you'd like to try on your pieces
              </p>

              {/* Primary Festival */}
              <div style={{ marginBottom: '36px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  marginBottom: '16px',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  PRIMARY FESTIVAL *
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {availableFestivals.map((festival, index) => (
                    <motion.div
                      key={festival.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ borderColor: 'rgba(255,255,255,0.3)' }}
                      onClick={() => setPrimaryFestival(festival.id)}
                      style={{
                        padding: '22px',
                        background: primaryFestival === festival.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                        border: primaryFestival === festival.id ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: '17px', fontWeight: '400', marginBottom: '10px' }}>
                            {festival.name}
                          </h3>
                          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={13} /> {festival.date}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin size={13} /> {festival.city}, {festival.country}
                            </span>
                          </div>
                        </div>
                        <motion.div
                          animate={{
                            scale: primaryFestival === festival.id ? 1 : 0.8,
                            opacity: primaryFestival === festival.id ? 1 : 0.3
                          }}
                        >
                          <CheckCircle2 size={22} />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Alternate Festival */}
              <div style={{ marginBottom: '36px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  marginBottom: '8px',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  ALTERNATE FESTIVAL (Optional)
                </label>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
                  In case you can't make it to your primary festival
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {availableFestivals
                    .filter(f => f.id !== primaryFestival)
                    .map((festival) => (
                      <motion.div
                        key={festival.id}
                        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
                        onClick={() => setAlternateFestival(alternateFestival === festival.id ? '' : festival.id)}
                        style={{
                          padding: '16px 20px',
                          background: alternateFestival === festival.id ? 'rgba(255,255,255,0.05)' : 'transparent',
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
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Navigation */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '48px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('select-pieces')}
                  style={{
                    padding: '14px 28px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer'
                  }}
                >
                  BACK
                </motion.button>
                <motion.button
                  whileHover={primaryFestival ? { scale: 1.02 } : {}}
                  whileTap={primaryFestival ? { scale: 0.98 } : {}}
                  onClick={() => primaryFestival && setStep('confirm')}
                  disabled={!primaryFestival}
                  style={{
                    padding: '14px 36px',
                    background: primaryFestival ? '#fff' : 'rgba(255,255,255,0.1)',
                    color: primaryFestival ? '#000' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    cursor: primaryFestival ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  CONTINUE
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            style={{ padding: isMobile ? '24px 20px' : '48px' }}
          >
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '300', marginBottom: '8px' }}>
                Confirm Reservation
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '36px' }}>
                Review your try-on reservation details
              </p>

              {/* Selected Pieces */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: '16px'
                }}
              >
                <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '20px', color: 'rgba(255,255,255,0.6)' }}>
                  SELECTED PIECES ({selectedPieces.length})
                </h3>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {selectedPieces.map(pieceId => {
                    const piece = pieces.find(p => p.id === pieceId)
                    return piece ? (
                      <div key={pieceId} style={{ flexShrink: 0, width: '100px' }}>
                        <img
                          src={piece.imageUrl}
                          alt={piece.name}
                          style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <p style={{ fontSize: '11px', marginTop: '10px', opacity: 0.8 }}>
                          {piece.name}
                        </p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                          ${piece.price}
                        </p>
                      </div>
                    ) : null
                  })}
                </div>
              </motion.div>

              {/* Festival Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: '16px'
                }}
              >
                <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '20px', color: 'rgba(255,255,255,0.6)' }}>
                  FESTIVAL DETAILS
                </h3>
                {(() => {
                  const primary = festivals.find(f => f.id === primaryFestival)
                  const alternate = alternateFestival ? festivals.find(f => f.id === alternateFestival) : null
                  return (
                    <div>
                      <div style={{ marginBottom: alternate ? '20px' : 0 }}>
                        <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>
                          PRIMARY
                        </span>
                        <p style={{ fontSize: '16px', marginTop: '6px', fontWeight: '400' }}>{primary?.name}</p>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                          {primary?.date} • {primary?.city}, {primary?.country}
                        </p>
                      </div>
                      {alternate && (
                        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>
                            ALTERNATE
                          </span>
                          <p style={{ fontSize: '14px', marginTop: '6px' }}>{alternate.name}</p>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                            {alternate.date} • {alternate.city}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </motion.div>

              {/* User Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: '24px'
                }}
              >
                <h3 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '16px', color: 'rgba(255,255,255,0.6)' }}>
                  RESERVATION FOR
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '400' }}>{user?.name || 'Guest'}</p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{user?.email}</p>
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '48px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('select-festival')}
                  style={{
                    padding: '14px 28px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer'
                  }}
                >
                  BACK
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmReservation}
                  style={{
                    padding: '16px 40px',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  CONFIRM RESERVATION
                  <Check size={16} />
                </motion.button>
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
            style={{ padding: isMobile ? '48px 20px' : '80px 40px' }}
          >
            <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{
                  width: '88px',
                  height: '88px',
                  background: 'rgba(16,185,129,0.15)',
                  border: '2px solid rgba(16,185,129,0.4)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 28px'
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <Check size={40} style={{ color: '#10b981' }} />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: isMobile ? '26px' : '32px', fontWeight: '300', marginBottom: '12px' }}
              >
                Reservation Confirmed!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '36px' }}
              >
                Show this QR code at the festival booth to try on your pieces
              </motion.p>

              {/* QR Code */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  padding: '36px',
                  background: '#fff',
                  display: 'inline-block',
                  marginBottom: '28px'
                }}
              >
                <QRCodeSVG
                  value={`https://khardingclassics.com/pickup/${newReservation.qrCode}`}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{
                  padding: '18px 28px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'inline-block',
                  marginBottom: '36px'
                }}
              >
                <p style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                  RESERVATION CODE
                </p>
                <p style={{ fontSize: '22px', fontWeight: '500', letterSpacing: '0.12em' }}>
                  {newReservation.qrCode}
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '36px' }}
              >
                A confirmation email has been sent to {user?.email}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    resetFlow()
                    setShowMyReservations(true)
                  }}
                  style={{
                    padding: '14px 28px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: '#fff',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer'
                  }}
                >
                  VIEW ALL RESERVATIONS
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetFlow}
                  style={{
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
                  DONE
                </motion.button>
              </motion.div>
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
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(12px)',
                zIndex: 100
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '85vh',
                background: '#0a0a0a',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderRadius: isMobile ? '16px 16px 0 0' : '20px 20px 0 0',
                zIndex: 101,
                overflowY: 'auto',
                padding: isMobile ? '28px 20px' : '40px 48px'
              }}
            >
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '28px'
                }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '300' }}>My Reservations</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMyReservations(false)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      padding: '10px',
                      borderRadius: '50%'
                    }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {userReservations.length === 0 ? (
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '48px' }}>
                    No reservations yet. Start by selecting pieces to try on!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {userReservations.map((res, index) => {
                      const festival = festivals.find(f => f.id === res.primaryFestival)
                      return (
                        <motion.div
                          key={res.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{
                            padding: '24px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '20px',
                            flexWrap: 'wrap',
                            gap: '16px'
                          }}>
                            <div>
                              <div style={{
                                display: 'inline-block',
                                padding: '5px 12px',
                                background: res.status === 'pending' ? 'rgba(234,179,8,0.12)' :
                                           res.status === 'confirmed' ? 'rgba(16,185,129,0.12)' :
                                           res.status === 'cancelled' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${res.status === 'pending' ? 'rgba(234,179,8,0.35)' :
                                                      res.status === 'confirmed' ? 'rgba(16,185,129,0.35)' :
                                                      res.status === 'cancelled' ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.1)'}`,
                                fontSize: '10px',
                                letterSpacing: '0.12em',
                                marginBottom: '10px',
                                textTransform: 'uppercase'
                              }}>
                                {res.status.replace('_', ' ')}
                              </div>
                              <h3 style={{ fontSize: '16px', fontWeight: '400' }}>{festival?.name}</h3>
                              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                                {festival?.date} • {festival?.city}
                              </p>
                            </div>
                            <div style={{
                              padding: '10px',
                              background: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <QRCodeSVG
                                value={`https://khardingclassics.com/pickup/${res.qrCode}`}
                                size={70}
                                level="M"
                              />
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                            alignItems: 'center'
                          }}>
                            {res.pieces.map(pieceId => {
                              const piece = pieces.find(p => p.id === pieceId)
                              return piece ? (
                                <img
                                  key={pieceId}
                                  src={piece.imageUrl}
                                  alt={piece.name}
                                  style={{
                                    width: '56px',
                                    height: '56px',
                                    objectFit: 'cover',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                  }}
                                />
                              ) : null
                            })}
                            <span style={{
                              fontSize: '11px',
                              color: 'rgba(255,255,255,0.4)',
                              marginLeft: '8px',
                              letterSpacing: '0.08em'
                            }}>
                              Code: {res.qrCode}
                            </span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FestivalHub
