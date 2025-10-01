import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Key, Save, Eye, EyeOff, Shield, Database, Mail, Globe, AlertCircle, Check } from 'lucide-react'
import { secureStorage } from '../../utils/security'

interface ApiConfig {
  geminiApiKey: string
  stripePublicKey: string
  stripeSecretKey: string
  emailApiKey: string
  smsApiKey: string
  instagramToken: string
  whatsappToken: string
}

const AdminSettings = () => {
  const navigate = useNavigate()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    geminiApiKey: '',
    stripePublicKey: '',
    stripeSecretKey: '',
    emailApiKey: '',
    smsApiKey: '',
    instagramToken: '',
    whatsappToken: ''
  })

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'KOBY\'S THREADS',
    contactEmail: 'contact@kobysthreads.com',
    contactPhone: '+66987654321',
    instagramHandle: '@hardingkobby',
    currency: 'USD',
    taxRate: 0,
    shippingFee: 20,
    freeShippingThreshold: 200
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    shipmentTracking: true,
    promotionalEmails: false,
    smsNotifications: false,
    adminAlerts: true
  })

  useEffect(() => {
    // Load saved settings
    const savedApiConfig = secureStorage.getItem('api_config')
    const savedGeneralSettings = secureStorage.getItem('general_settings')
    const savedNotifications = secureStorage.getItem('notification_settings')
    
    if (savedApiConfig) setApiConfig(savedApiConfig)
    if (savedGeneralSettings) setGeneralSettings(savedGeneralSettings)
    if (savedNotifications) setNotificationSettings(savedNotifications)
  }, [])

  const handleApiKeyChange = (key: keyof ApiConfig, value: string) => {
    setApiConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleGeneralSettingChange = (key: string, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleNotificationChange = (key: string) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  const saveSettings = () => {
    // Save all settings securely
    secureStorage.setItem('api_config', apiConfig)
    secureStorage.setItem('general_settings', generalSettings)
    secureStorage.setItem('notification_settings', notificationSettings)
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    
    console.log('[Admin] Settings saved successfully')
  }

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const maskKey = (key: string) => {
    if (!key) return ''
    if (key.length <= 8) return '•'.repeat(key.length)
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4)
  }

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
          maxWidth: '1200px',
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
              ADMIN SETTINGS
            </h1>
            <p style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.1em'
            }}>
              Configure API keys and system settings
            </p>
          </div>

          <button
            onClick={() => navigate('/admin')}
            style={{
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
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            BACK TO DASHBOARD
          </button>
        </div>
      </section>

      {/* Save Notification */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 255, 0, 0.1)',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            padding: '16px 32px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Check style={{ width: '16px', height: '16px', color: '#4ade80' }} />
          <span style={{ fontSize: '13px', letterSpacing: '0.1em', color: '#4ade80' }}>
            Settings saved successfully
          </span>
        </motion.div>
      )}

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '40px'
      }}>
        {/* API Keys Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <Key style={{ width: '20px', height: '20px', opacity: 0.6 }} />
            <h2 style={{
              fontSize: '18px',
              fontWeight: '200',
              letterSpacing: '0.2em'
            }}>
              API CONFIGURATIONS
            </h2>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            background: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            marginBottom: '24px'
          }}>
            <AlertCircle style={{ width: '14px', height: '14px', color: '#ffa500' }} />
            <p style={{
              fontSize: '11px',
              color: '#ffa500',
              letterSpacing: '0.05em'
            }}>
              Keep your API keys secure. Never share them publicly.
            </p>
          </div>

          {/* Google Gemini API Key - HIGHLIGHTED */}
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            background: 'rgba(74, 222, 128, 0.05)',
            border: '1px solid rgba(74, 222, 128, 0.2)'
          }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              letterSpacing: '0.15em',
              marginBottom: '8px',
              opacity: 0.7
            }}>
              GOOGLE GEMINI API KEY (AI FEATURES)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showKeys['gemini'] ? 'text' : 'password'}
                value={apiConfig.geminiApiKey}
                onChange={(e) => handleApiKeyChange('geminiApiKey', e.target.value)}
                placeholder="Enter your Google Gemini API key"
                style={{
                  width: '100%',
                  padding: '12px',
                  paddingRight: '40px',
                  background: 'transparent',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility('gemini')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer'
                }}
              >
                {showKeys['gemini'] ? 
                  <EyeOff style={{ width: '16px', height: '16px' }} /> :
                  <Eye style={{ width: '16px', height: '16px' }} />
                }
              </button>
            </div>
            <p style={{
              fontSize: '10px',
              color: 'rgba(74, 222, 128, 0.7)',
              marginTop: '8px'
            }}>
              Required for AI chatbot and smart recommendations
            </p>
          </div>

          {/* Other API Keys */}
          {[
            { key: 'stripePublicKey', label: 'STRIPE PUBLIC KEY', placeholder: 'pk_live_...' },
            { key: 'stripeSecretKey', label: 'STRIPE SECRET KEY', placeholder: 'sk_live_...' },
            { key: 'emailApiKey', label: 'EMAIL API KEY (SENDGRID)', placeholder: 'SG...' },
            { key: 'smsApiKey', label: 'SMS API KEY (TWILIO)', placeholder: 'AC...' },
            { key: 'instagramToken', label: 'INSTAGRAM ACCESS TOKEN', placeholder: 'IGQ...' },
            { key: 'whatsappToken', label: 'WHATSAPP API TOKEN', placeholder: 'EAAI...' }
          ].map((field) => (
            <div key={field.key} style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                letterSpacing: '0.15em',
                marginBottom: '8px',
                opacity: 0.6
              }}>
                {field.label}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showKeys[field.key] ? 'text' : 'password'}
                  value={apiConfig[field.key as keyof ApiConfig]}
                  onChange={(e) => handleApiKeyChange(field.key as keyof ApiConfig, e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '40px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none',
                    fontFamily: 'monospace',
                    transition: 'border 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility(field.key)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer'
                  }}
                >
                  {showKeys[field.key] ? 
                    <EyeOff style={{ width: '16px', height: '16px' }} /> :
                    <Eye style={{ width: '16px', height: '16px' }} />
                  }
                </button>
              </div>
            </div>
          ))}
        </motion.section>

        {/* General Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <Globe style={{ width: '20px', height: '20px', opacity: 0.6 }} />
            <h2 style={{
              fontSize: '18px',
              fontWeight: '200',
              letterSpacing: '0.2em'
            }}>
              GENERAL SETTINGS
            </h2>
          </div>

          {/* Site Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              marginBottom: '20px',
              opacity: 0.7
            }}>
              SITE INFORMATION
            </h3>

            {[
              { key: 'siteName', label: 'SITE NAME', type: 'text' },
              { key: 'contactEmail', label: 'CONTACT EMAIL', type: 'email' },
              { key: 'contactPhone', label: 'CONTACT PHONE', type: 'tel' },
              { key: 'instagramHandle', label: 'INSTAGRAM HANDLE', type: 'text' }
            ].map((field) => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  marginBottom: '8px',
                  opacity: 0.6
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={generalSettings[field.key as keyof typeof generalSettings]}
                  onChange={(e) => handleGeneralSettingChange(field.key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none',
                    transition: 'border 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
              </div>
            ))}
          </div>

          {/* Commerce Settings */}
          <div>
            <h3 style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              marginBottom: '20px',
              opacity: 0.7
            }}>
              COMMERCE SETTINGS
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  marginBottom: '8px',
                  opacity: 0.6
                }}>
                  CURRENCY
                </label>
                <select
                  value={generalSettings.currency}
                  onChange={(e) => handleGeneralSettingChange('currency', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#000',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="THB">THB (฿)</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  marginBottom: '8px',
                  opacity: 0.6
                }}>
                  TAX RATE (%)
                </label>
                <input
                  type="number"
                  value={generalSettings.taxRate}
                  onChange={(e) => handleGeneralSettingChange('taxRate', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  marginBottom: '8px',
                  opacity: 0.6
                }}>
                  SHIPPING FEE
                </label>
                <input
                  type="number"
                  value={generalSettings.shippingFee}
                  onChange={(e) => handleGeneralSettingChange('shippingFee', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  marginBottom: '8px',
                  opacity: 0.6
                }}>
                  FREE SHIPPING ABOVE
                </label>
                <input
                  type="number"
                  value={generalSettings.freeShippingThreshold}
                  onChange={(e) => handleGeneralSettingChange('freeShippingThreshold', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Notification Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <Mail style={{ width: '20px', height: '20px', opacity: 0.6 }} />
            <h2 style={{
              fontSize: '18px',
              fontWeight: '200',
              letterSpacing: '0.2em'
            }}>
              NOTIFICATIONS
            </h2>
          </div>

          {[
            { key: 'orderConfirmation', label: 'Order Confirmation Emails' },
            { key: 'shipmentTracking', label: 'Shipment Tracking Updates' },
            { key: 'promotionalEmails', label: 'Promotional Emails' },
            { key: 'smsNotifications', label: 'SMS Notifications' },
            { key: 'adminAlerts', label: 'Admin Alert Emails' }
          ].map((setting) => (
            <div
              key={setting.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onClick={() => handleNotificationChange(setting.key)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{
                fontSize: '12px',
                letterSpacing: '0.1em'
              }}>
                {setting.label}
              </span>
              <div style={{
                width: '48px',
                height: '24px',
                background: notificationSettings[setting.key as keyof typeof notificationSettings] 
                  ? 'rgba(74, 222, 128, 0.3)' 
                  : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                position: 'relative',
                transition: 'background 0.3s'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: notificationSettings[setting.key as keyof typeof notificationSettings] ? '26px' : '2px',
                  width: '20px',
                  height: '20px',
                  background: notificationSettings[setting.key as keyof typeof notificationSettings] ? '#4ade80' : '#666',
                  borderRadius: '50%',
                  transition: 'all 0.3s'
                }} />
              </div>
            </div>
          ))}
        </motion.section>

        {/* Security Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <Shield style={{ width: '20px', height: '20px', opacity: 0.6 }} />
            <h2 style={{
              fontSize: '18px',
              fontWeight: '200',
              letterSpacing: '0.2em'
            }}>
              SECURITY STATUS
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {[
              { label: 'API Keys Configured', status: apiConfig.geminiApiKey ? 'active' : 'inactive' },
              { label: 'SSL Certificate', status: 'active' },
              { label: 'Two-Factor Authentication', status: 'inactive' },
              { label: 'Rate Limiting', status: 'active' },
              { label: 'Data Encryption', status: 'active' },
              { label: 'Backup System', status: 'inactive' }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <span style={{
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  opacity: 0.7
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontSize: '10px',
                  padding: '4px 12px',
                  background: item.status === 'active' 
                    ? 'rgba(74, 222, 128, 0.2)' 
                    : 'rgba(255, 0, 0, 0.2)',
                  color: item.status === 'active' ? '#4ade80' : '#ff6b6b',
                  border: `1px solid ${item.status === 'active' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`,
                  letterSpacing: '0.1em'
                }}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Save Button */}
      <section style={{
        padding: '40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveSettings}
            style={{
              padding: '16px 48px',
              background: '#fff',
              color: '#000',
              border: 'none',
              fontSize: '12px',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            SAVE ALL SETTINGS
          </motion.button>

          <button
            onClick={() => navigate('/admin')}
            style={{
              padding: '16px 48px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              fontSize: '12px',
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
            CANCEL
          </button>
        </div>
      </section>
    </div>
  )
}

export default AdminSettings