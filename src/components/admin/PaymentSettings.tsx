import { useState } from 'react'
import { useCommerceStore, type PaymentProvider, type PaymentProviderType } from '../../stores/useCommerceStore'
import {
  CreditCard, DollarSign, Settings, Truck, Globe, ShoppingBag,
  Plus, Trash2, Edit2, Save, X, Check, AlertCircle, RefreshCw,
  ToggleLeft, ToggleRight, ChevronDown, ChevronUp, ExternalLink,
  Zap, Store, Percent, Package, FileText
} from 'lucide-react'

const PaymentSettings = () => {
  const {
    paymentProviders, shopify, tax, shipping, currency, checkout,
    updatePaymentProvider, toggleProviderEnabled, deletePaymentProvider,
    testProviderConnection, updateShopify, connectShopify, disconnectShopify,
    updateTax, updateShipping, updateCurrency, updateCheckout
  } = useCommerceStore()

  const [activeTab, setActiveTab] = useState<'providers' | 'shopify' | 'tax' | 'shipping' | 'currency' | 'checkout'>('providers')
  const [editingProvider, setEditingProvider] = useState<string | null>(null)
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null)
  const [testingProvider, setTestingProvider] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null)
  const [shopifyConnecting, setShopifyConnecting] = useState(false)
  const [shopifyForm, setShopifyForm] = useState({ shopName: '', accessToken: '' })

  const handleTestConnection = async (providerId: string) => {
    setTestingProvider(providerId)
    setTestResult(null)
    const result = await testProviderConnection(providerId)
    setTestResult({ id: providerId, ...result })
    setTestingProvider(null)
  }

  const handleConnectShopify = async () => {
    if (!shopifyForm.shopName || !shopifyForm.accessToken) return
    setShopifyConnecting(true)
    await connectShopify(shopifyForm.shopName, shopifyForm.accessToken)
    setShopifyConnecting(false)
  }

  const getProviderIcon = (type: PaymentProviderType) => {
    switch (type) {
      case 'stripe': return '💳'
      case 'paypal': return '🅿️'
      case 'square': return '⬛'
      case 'shopify': return '🛍️'
      case 'manual': return '🏦'
      case 'cod': return '💵'
      default: return '💰'
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '0',
    color: '#fff',
    fontSize: '13px'
  }

  const buttonStyle = {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '0',
    color: '#fff',
    fontSize: '11px',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  }

  const labelStyle = {
    fontSize: '10px',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.6)',
    display: 'block',
    marginBottom: '6px'
  }

  const tabs = [
    { id: 'providers', label: 'Payment Providers', icon: CreditCard },
    { id: 'shopify', label: 'Shopify', icon: Store },
    { id: 'tax', label: 'Tax', icon: Percent },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'checkout', label: 'Checkout', icon: ShoppingBag }
  ]

  return (
    <div style={{ padding: '24px', background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '300', letterSpacing: '0.15em', color: '#fff', margin: 0 }}>
          COMMERCE SETTINGS
        </h1>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
          Configure payment gateways, shipping, taxes, and checkout
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #fff' : '2px solid transparent',
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payment Providers Tab */}
      {activeTab === 'providers' && (
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              {paymentProviders.filter(p => p.enabled).length} of {paymentProviders.length} providers enabled
            </p>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {paymentProviders.sort((a, b) => a.priority - b.priority).map(provider => (
              <div key={provider.id} style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${provider.enabled ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                opacity: provider.enabled ? 1 : 0.7
              }}>
                {/* Provider Header */}
                <div
                  onClick={() => setExpandedProvider(expandedProvider === provider.id ? null : provider.id)}
                  style={{
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{getProviderIcon(provider.type)}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#fff', fontWeight: '400' }}>
                          {provider.displayName}
                        </span>
                        {provider.testMode && (
                          <span style={{
                            padding: '2px 6px',
                            background: 'rgba(251, 191, 36, 0.2)',
                            border: '1px solid rgba(251, 191, 36, 0.4)',
                            fontSize: '9px',
                            color: '#fbbf24'
                          }}>
                            TEST MODE
                          </span>
                        )}
                        {provider.priority === 1 && provider.enabled && (
                          <span style={{
                            padding: '2px 6px',
                            background: 'rgba(74, 222, 128, 0.2)',
                            border: '1px solid rgba(74, 222, 128, 0.4)',
                            fontSize: '9px',
                            color: '#4ade80'
                          }}>
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                        {provider.description}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {provider.flatFee > 0 || provider.percentageFee > 0 ? (
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                        {provider.percentageFee}% + ${provider.flatFee}
                      </span>
                    ) : null}

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleProviderEnabled(provider.id) }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: provider.enabled ? '#4ade80' : 'rgba(255,255,255,0.3)' }}
                    >
                      {provider.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>

                    {expandedProvider === provider.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Expanded Settings */}
                {expandedProvider === provider.id && (
                  <div style={{
                    padding: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(0,0,0,0.3)'
                  }}>
                    {/* API Keys */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
                        API CONFIGURATION
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>PUBLIC KEY / CLIENT ID</label>
                          <input
                            type="text"
                            value={provider.publicKey}
                            onChange={(e) => updatePaymentProvider(provider.id, { publicKey: e.target.value })}
                            placeholder={provider.type === 'stripe' ? 'pk_test_...' : 'Enter public key'}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>SECRET KEY</label>
                          <input
                            type="password"
                            value={provider.secretKey}
                            onChange={(e) => updatePaymentProvider(provider.id, { secretKey: e.target.value })}
                            placeholder={provider.type === 'stripe' ? 'sk_test_...' : 'Enter secret key'}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>WEBHOOK SECRET</label>
                          <input
                            type="password"
                            value={provider.webhookSecret}
                            onChange={(e) => updatePaymentProvider(provider.id, { webhookSecret: e.target.value })}
                            placeholder="whsec_..."
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>WEBHOOK URL</label>
                          <input
                            type="text"
                            value={provider.webhookUrl}
                            onChange={(e) => updatePaymentProvider(provider.id, { webhookUrl: e.target.value })}
                            placeholder="/api/webhooks/..."
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      {/* Test Connection */}
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => handleTestConnection(provider.id)}
                          disabled={testingProvider === provider.id}
                          style={{
                            ...buttonStyle,
                            opacity: testingProvider === provider.id ? 0.5 : 1
                          }}
                        >
                          {testingProvider === provider.id ? (
                            <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <Zap size={14} />
                          )}
                          TEST CONNECTION
                        </button>

                        {testResult?.id === provider.id && (
                          <span style={{
                            fontSize: '11px',
                            color: testResult.success ? '#4ade80' : '#f87171',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {testResult.success ? <Check size={14} /> : <AlertCircle size={14} />}
                            {testResult.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Provider Settings */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
                        SETTINGS
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>MIN AMOUNT ($)</label>
                          <input
                            type="number"
                            value={provider.minAmount}
                            onChange={(e) => updatePaymentProvider(provider.id, { minAmount: parseFloat(e.target.value) || 0 })}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>MAX AMOUNT ($)</label>
                          <input
                            type="number"
                            value={provider.maxAmount}
                            onChange={(e) => updatePaymentProvider(provider.id, { maxAmount: parseFloat(e.target.value) || 0 })}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>PRIORITY</label>
                          <input
                            type="number"
                            min="1"
                            value={provider.priority}
                            onChange={(e) => updatePaymentProvider(provider.id, { priority: parseInt(e.target.value) || 1 })}
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '12px' }}>
                        <div>
                          <label style={labelStyle}>FLAT FEE ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={provider.flatFee}
                            onChange={(e) => updatePaymentProvider(provider.id, { flatFee: parseFloat(e.target.value) || 0 })}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>PERCENTAGE FEE (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={provider.percentageFee}
                            onChange={(e) => updatePaymentProvider(provider.id, { percentageFee: parseFloat(e.target.value) || 0 })}
                            style={inputStyle}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'end' }}>
                          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={provider.passFeeToCustomer}
                              onChange={(e) => updatePaymentProvider(provider.id, { passFeeToCustomer: e.target.checked })}
                            />
                            Pass fee to customer
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Stripe-specific Settings */}
                    {provider.type === 'stripe' && provider.stripeConfig && (
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
                          STRIPE OPTIONS
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={labelStyle}>STATEMENT DESCRIPTOR</label>
                            <input
                              type="text"
                              maxLength={22}
                              value={provider.stripeConfig.statementDescriptor}
                              onChange={(e) => updatePaymentProvider(provider.id, {
                                stripeConfig: { ...provider.stripeConfig!, statementDescriptor: e.target.value }
                              })}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>CAPTURE METHOD</label>
                            <select
                              value={provider.stripeConfig.captureMethod}
                              onChange={(e) => updatePaymentProvider(provider.id, {
                                stripeConfig: { ...provider.stripeConfig!, captureMethod: e.target.value as 'automatic' | 'manual' }
                              })}
                              style={inputStyle}
                            >
                              <option value="automatic" style={{ background: '#1a1a1a' }}>Automatic</option>
                              <option value="manual" style={{ background: '#1a1a1a' }}>Manual</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                          {[
                            { key: 'enableApplePay', label: 'Apple Pay' },
                            { key: 'enableGooglePay', label: 'Google Pay' },
                            { key: 'enableLink', label: 'Stripe Link' }
                          ].map(option => (
                            <label key={option.key} style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={provider.stripeConfig![option.key as keyof typeof provider.stripeConfig] as boolean}
                                onChange={(e) => updatePaymentProvider(provider.id, {
                                  stripeConfig: { ...provider.stripeConfig!, [option.key]: e.target.checked }
                                })}
                              />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Manual Payment Instructions */}
                    {(provider.type === 'manual' || provider.type === 'cod') && provider.manualConfig && (
                      <div>
                        <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
                          PAYMENT INSTRUCTIONS
                        </h4>
                        <textarea
                          value={provider.manualConfig.instructions}
                          onChange={(e) => updatePaymentProvider(provider.id, {
                            manualConfig: { ...provider.manualConfig!, instructions: e.target.value }
                          })}
                          rows={5}
                          placeholder="Enter payment instructions shown to customers..."
                          style={{ ...inputStyle, resize: 'vertical' }}
                        />
                        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={provider.manualConfig.requiresApproval}
                            onChange={(e) => updatePaymentProvider(provider.id, {
                              manualConfig: { ...provider.manualConfig!, requiresApproval: e.target.checked }
                            })}
                          />
                          Require admin approval before processing
                        </label>
                      </div>
                    )}

                    {/* Toggle Test Mode */}
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={provider.testMode}
                          onChange={(e) => updatePaymentProvider(provider.id, { testMode: e.target.checked })}
                        />
                        Test/Sandbox Mode
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shopify Tab */}
      {activeTab === 'shopify' && (
        <div style={{ maxWidth: '600px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '32px' }}>🛍️</span>
              <div>
                <h3 style={{ fontSize: '14px', color: '#fff', margin: 0 }}>Shopify Integration</h3>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
                  Sync products, inventory, and orders with your Shopify store
                </p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                {shopify.connected ? (
                  <span style={{
                    padding: '4px 10px',
                    background: 'rgba(74, 222, 128, 0.2)',
                    border: '1px solid rgba(74, 222, 128, 0.4)',
                    fontSize: '10px',
                    color: '#4ade80'
                  }}>
                    CONNECTED
                  </span>
                ) : (
                  <span style={{
                    padding: '4px 10px',
                    background: 'rgba(255,255,255,0.1)',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.5)'
                  }}>
                    NOT CONNECTED
                  </span>
                )}
              </div>
            </div>

            {!shopify.connected ? (
              <div>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>SHOPIFY STORE NAME</label>
                    <input
                      type="text"
                      value={shopifyForm.shopName}
                      onChange={(e) => setShopifyForm({ ...shopifyForm, shopName: e.target.value })}
                      placeholder="your-store.myshopify.com"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>ACCESS TOKEN</label>
                    <input
                      type="password"
                      value={shopifyForm.accessToken}
                      onChange={(e) => setShopifyForm({ ...shopifyForm, accessToken: e.target.value })}
                      placeholder="shpat_..."
                      style={inputStyle}
                    />
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                      Generate from Shopify Admin → Settings → Apps → Develop apps
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleConnectShopify}
                  disabled={shopifyConnecting || !shopifyForm.shopName || !shopifyForm.accessToken}
                  style={{
                    ...buttonStyle,
                    background: 'rgba(255,255,255,0.15)',
                    opacity: shopifyConnecting ? 0.5 : 1
                  }}
                >
                  {shopifyConnecting ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <ExternalLink size={14} />}
                  CONNECT SHOPIFY
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
                  Connected to: <strong>{shopify.shopName}</strong>
                  {shopify.lastSync && (
                    <span style={{ marginLeft: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      Last sync: {new Date(shopify.lastSync).toLocaleString()}
                    </span>
                  )}
                </p>
                <button
                  onClick={disconnectShopify}
                  style={{ ...buttonStyle, borderColor: 'rgba(248, 113, 113, 0.5)', color: '#f87171' }}
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {shopify.connected && (
            <>
              {/* Sync Settings */}
              <div style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '20px'
              }}>
                <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
                  SYNC SETTINGS
                </h4>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {[
                    { key: 'autoSyncProducts', label: 'Auto-sync products' },
                    { key: 'autoSyncInventory', label: 'Auto-sync inventory levels' },
                    { key: 'autoSyncOrders', label: 'Auto-sync orders' }
                  ].map(option => (
                    <div key={option.key} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      background: 'rgba(255,255,255,0.02)'
                    }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{option.label}</span>
                      <button
                        onClick={() => updateShopify({
                          syncSettings: { ...shopify.syncSettings, [option.key]: !shopify.syncSettings[option.key as keyof typeof shopify.syncSettings] }
                        })}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {shopify.syncSettings[option.key as keyof typeof shopify.syncSettings] ?
                          <ToggleRight size={24} color="#4ade80" /> :
                          <ToggleLeft size={24} color="rgba(255,255,255,0.3)" />
                        }
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={labelStyle}>CONFLICT RESOLUTION</label>
                  <select
                    value={shopify.syncSettings.conflictResolution}
                    onChange={(e) => updateShopify({
                      syncSettings: { ...shopify.syncSettings, conflictResolution: e.target.value as 'local' | 'shopify' | 'manual' | 'newest' }
                    })}
                    style={inputStyle}
                  >
                    <option value="newest" style={{ background: '#1a1a1a' }}>Use newest data</option>
                    <option value="local" style={{ background: '#1a1a1a' }}>Prefer local data</option>
                    <option value="shopify" style={{ background: '#1a1a1a' }}>Prefer Shopify data</option>
                    <option value="manual" style={{ background: '#1a1a1a' }}>Manual review</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tax Tab */}
      {activeTab === 'tax' && (
        <div style={{ maxWidth: '600px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#fff', margin: 0 }}>TAX CALCULATION</h4>
              <button
                onClick={() => updateTax({ enabled: !tax.enabled })}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {tax.enabled ? <ToggleRight size={24} color="#4ade80" /> : <ToggleLeft size={24} color="rgba(255,255,255,0.3)" />}
              </button>
            </div>

            {tax.enabled && (
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>DEFAULT TAX RATE (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tax.defaultRate}
                    onChange={(e) => updateTax({ defaultRate: parseFloat(e.target.value) || 0 })}
                    style={inputStyle}
                  />
                </div>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={tax.includeInPrice}
                    onChange={(e) => updateTax({ includeInPrice: e.target.checked })}
                  />
                  Prices include tax
                </label>
              </div>
            )}
          </div>

          {/* Tax Rates by Country */}
          {tax.enabled && (
            <div style={{
              padding: '20px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
                TAX RATES BY REGION
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {tax.taxRates.map(rate => (
                  <div key={rate.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    background: 'rgba(255,255,255,0.02)'
                  }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{rate.name}</span>
                    <span style={{ fontSize: '12px', color: '#fff' }}>{rate.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shipping Tab */}
      {activeTab === 'shipping' && (
        <div style={{ maxWidth: '800px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#fff', margin: 0 }}>SHIPPING</h4>
              <button
                onClick={() => updateShipping({ enabled: !shipping.enabled })}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {shipping.enabled ? <ToggleRight size={24} color="#4ade80" /> : <ToggleLeft size={24} color="rgba(255,255,255,0.3)" />}
              </button>
            </div>

            {shipping.enabled && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>FREE SHIPPING THRESHOLD ($)</label>
                  <input
                    type="number"
                    value={shipping.freeShippingThreshold || ''}
                    onChange={(e) => updateShipping({ freeShippingThreshold: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="Leave empty for no free shipping"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>DEFAULT WEIGHT ({shipping.weightUnit})</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shipping.defaultWeight}
                    onChange={(e) => updateShipping({ defaultWeight: parseFloat(e.target.value) || 0.5 })}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Shipping Zones */}
          {shipping.enabled && (
            <div style={{ display: 'grid', gap: '12px' }}>
              {shipping.zones.map(zone => (
                <div key={zone.id} style={{
                  padding: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <h4 style={{ fontSize: '12px', color: '#fff', marginBottom: '12px' }}>
                    {zone.name}
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px' }}>
                      {zone.countries.join(', ')}
                    </span>
                  </h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {zone.methods.map(method => (
                      <div key={method.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        background: 'rgba(255,255,255,0.02)',
                        opacity: method.enabled ? 1 : 0.5
                      }}>
                        <div>
                          <span style={{ fontSize: '12px', color: '#fff' }}>{method.name}</span>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px' }}>
                            {method.description}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '12px', color: '#fff' }}>${method.price}</span>
                          {method.freeAbove && (
                            <span style={{ fontSize: '9px', color: '#4ade80' }}>Free above ${method.freeAbove}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Currency Tab */}
      {activeTab === 'currency' && (
        <div style={{ maxWidth: '600px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
              CURRENCY SETTINGS
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={labelStyle}>PRIMARY CURRENCY</label>
                <select
                  value={currency.primary}
                  onChange={(e) => updateCurrency({ primary: e.target.value })}
                  style={inputStyle}
                >
                  {['USD', 'EUR', 'GBP', 'THB', 'SGD', 'JPY'].map(curr => (
                    <option key={curr} value={curr} style={{ background: '#1a1a1a' }}>{curr}</option>
                  ))}
                </select>
              </div>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={currency.autoConvert}
                  onChange={(e) => updateCurrency({ autoConvert: e.target.checked })}
                />
                Enable automatic currency conversion
              </label>
            </div>
          </div>

          {/* Display Format */}
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
              DISPLAY FORMAT
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>SYMBOL POSITION</label>
                <select
                  value={currency.displayFormat.symbolPosition}
                  onChange={(e) => updateCurrency({
                    displayFormat: { ...currency.displayFormat, symbolPosition: e.target.value as 'before' | 'after' }
                  })}
                  style={inputStyle}
                >
                  <option value="before" style={{ background: '#1a1a1a' }}>Before ($100)</option>
                  <option value="after" style={{ background: '#1a1a1a' }}>After (100$)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>DECIMAL PLACES</label>
                <select
                  value={currency.displayFormat.decimals}
                  onChange={(e) => updateCurrency({
                    displayFormat: { ...currency.displayFormat, decimals: parseInt(e.target.value) }
                  })}
                  style={inputStyle}
                >
                  <option value="0" style={{ background: '#1a1a1a' }}>0 ($100)</option>
                  <option value="2" style={{ background: '#1a1a1a' }}>2 ($100.00)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Tab */}
      {activeTab === 'checkout' && (
        <div style={{ maxWidth: '600px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
              CHECKOUT OPTIONS
            </h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                { key: 'guestCheckout', label: 'Allow guest checkout' },
                { key: 'requirePhone', label: 'Require phone number' },
                { key: 'showOrderNotes', label: 'Show order notes field' },
                { key: 'termsRequired', label: 'Require terms acceptance' }
              ].map(option => (
                <div key={option.key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.02)'
                }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{option.label}</span>
                  <button
                    onClick={() => updateCheckout({ [option.key]: !checkout[option.key as keyof typeof checkout] })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {checkout[option.key as keyof typeof checkout] ?
                      <ToggleRight size={24} color="#4ade80" /> :
                      <ToggleLeft size={24} color="rgba(255,255,255,0.3)" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Abandoned Cart */}
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                ABANDONED CART RECOVERY
              </h4>
              <button
                onClick={() => updateCheckout({
                  abandonedCart: { ...checkout.abandonedCart, enabled: !checkout.abandonedCart.enabled }
                })}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {checkout.abandonedCart.enabled ?
                  <ToggleRight size={24} color="#4ade80" /> :
                  <ToggleLeft size={24} color="rgba(255,255,255,0.3)" />
                }
              </button>
            </div>
            {checkout.abandonedCart.enabled && (
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>REMINDER DELAY (hours)</label>
                  <input
                    type="number"
                    value={checkout.abandonedCart.reminderDelay}
                    onChange={(e) => updateCheckout({
                      abandonedCart: { ...checkout.abandonedCart, reminderDelay: parseInt(e.target.value) || 24 }
                    })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>DISCOUNT CODE (optional)</label>
                  <input
                    type="text"
                    value={checkout.abandonedCart.discountCode || ''}
                    onChange={(e) => updateCheckout({
                      abandonedCart: { ...checkout.abandonedCart, discountCode: e.target.value || null }
                    })}
                    placeholder="e.g., COMEBACK10"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default PaymentSettings
