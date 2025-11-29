import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

const sizeChart = {
  'XS': { chest: '32-34', waist: '24-26', length: '26' },
  'S': { chest: '34-36', waist: '26-28', length: '27' },
  'M': { chest: '36-38', waist: '28-30', length: '28' },
  'L': { chest: '38-40', waist: '30-32', length: '29' },
  'XL': { chest: '40-42', waist: '32-34', length: '30' },
  'XXL': { chest: '42-44', waist: '34-36', length: '31' }
}

const SizeGuide = ({ isOpen, onClose, isMobile = false }: SizeGuideProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              zIndex: 9998,
              cursor: 'pointer'
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#000',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: isMobile ? '24px' : '40px',
              maxWidth: isMobile ? '90vw' : '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 9999
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h2 style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '100',
                letterSpacing: '0.3em',
                color: '#fff'
              }}>
                SIZE GUIDE
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Size Chart */}
            <div style={{
              overflowX: 'auto',
              marginBottom: '24px'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: isMobile ? '11px' : '12px',
                letterSpacing: '0.1em'
              }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: isMobile ? '12px 8px' : '16px 12px',
                      textAlign: 'left',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '300',
                      letterSpacing: '0.15em'
                    }}>
                      SIZE
                    </th>
                    <th style={{
                      padding: isMobile ? '12px 8px' : '16px 12px',
                      textAlign: 'left',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '300',
                      letterSpacing: '0.15em'
                    }}>
                      CHEST (in)
                    </th>
                    <th style={{
                      padding: isMobile ? '12px 8px' : '16px 12px',
                      textAlign: 'left',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '300',
                      letterSpacing: '0.15em'
                    }}>
                      WAIST (in)
                    </th>
                    <th style={{
                      padding: isMobile ? '12px 8px' : '16px 12px',
                      textAlign: 'left',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '300',
                      letterSpacing: '0.15em'
                    }}>
                      LENGTH (in)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sizeChart).map(([size, measurements]) => (
                    <tr key={size}>
                      <td style={{
                        padding: isMobile ? '12px 8px' : '16px 12px',
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: '300',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {size}
                      </td>
                      <td style={{
                        padding: isMobile ? '12px 8px' : '16px 12px',
                        color: 'rgba(255,255,255,0.6)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {measurements.chest}
                      </td>
                      <td style={{
                        padding: isMobile ? '12px 8px' : '16px 12px',
                        color: 'rgba(255,255,255,0.6)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {measurements.waist}
                      </td>
                      <td style={{
                        padding: isMobile ? '12px 8px' : '16px 12px',
                        color: 'rgba(255,255,255,0.6)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {measurements.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Measurement Guide */}
            <div style={{
              padding: isMobile ? '16px' : '20px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: '300',
                letterSpacing: '0.2em',
                marginBottom: '16px',
                color: 'rgba(255,255,255,0.8)'
              }}>
                HOW TO MEASURE
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '11px',
                lineHeight: '1.8',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.05em'
              }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.8)' }}>CHEST:</strong> Measure around the fullest part of your chest
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.8)' }}>WAIST:</strong> Measure around your natural waistline
                </li>
                <li>
                  <strong style={{ color: 'rgba(255,255,255,0.8)' }}>LENGTH:</strong> Measure from top of shoulder to desired length
                </li>
              </ul>
            </div>

            {/* Note */}
            <div style={{
              marginTop: '20px',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.1em',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              All measurements are in inches. For a relaxed fit, size up.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SizeGuide
