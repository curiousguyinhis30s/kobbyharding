import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface CheckoutProgressProps {
  currentStep: number
  steps: string[]
}

const CheckoutProgress = ({ currentStep, steps }: CheckoutProgressProps) => {
  return (
    <div style={{
      padding: '32px 0',
      marginBottom: '32px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Progress Line */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '0',
          right: '0',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0
        }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #F97316, #ea580c)'
            }}
          />
        </div>

        {/* Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1
        }}>
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep

            return (
              <div
                key={step}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1
                }}
              >
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isCompleted || isCurrent
                      ? 'linear-gradient(135deg, #F97316, #ea580c)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: isCurrent ? '2px solid rgba(249, 115, 22, 0.5)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '14px',
                    marginBottom: '12px',
                    position: 'relative',
                    boxShadow: isCurrent ? '0 0 0 8px rgba(249, 115, 22, 0.1)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check size={20} strokeWidth={3} />
                    </motion.div>
                  ) : (
                    stepNumber
                  )}
                </motion.div>

                {/* Step Label */}
                <div style={{
                  fontSize: '12px',
                  fontWeight: isCurrent ? '600' : '400',
                  color: isCompleted || isCurrent
                    ? '#fff'
                    : 'rgba(255, 255, 255, 0.4)',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  maxWidth: '100px'
                }}>
                  {step}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CheckoutProgress
