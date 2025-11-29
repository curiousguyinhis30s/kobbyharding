import { useState } from 'react'
import { Ruler, Palette, Code, ShieldCheck, Box, Layout, FileText, Settings } from 'lucide-react'

const SystemDocumentation = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'security' | 'design' | 'api'>('components')

  const componentSpecs = [
    {
      name: 'Product Card (Collection)',
      file: 'src/pages/CollectionMinimal.tsx',
      dimensions: {
        desktop: '280px × auto',
        tablet: '240px × auto',
        mobile: '160px × auto'
      },
      structure: {
        image: '100% width, aspect-ratio 3:4',
        title: 'font-size: 14px, weight: 300',
        price: 'font-size: 16px, weight: 400',
        padding: '0px (no padding)',
        gap: '8px between elements'
      },
      colors: {
        background: '#000000 (black)',
        text: '#ffffff (white)',
        border: 'rgba(255, 255, 255, 0.1)',
        hover: 'opacity: 0.7'
      },
      functionality: [
        'Click navigates to /piece/:id',
        'Image lazy loading enabled',
        'Hover effect: opacity transition',
        'Responsive grid: 4-5 cols desktop, 2-3 tablet, 2 mobile'
      ]
    },
    {
      name: 'Navigation Header',
      file: 'src/components/Navigation.tsx',
      dimensions: {
        height: '64px fixed',
        maxWidth: '1920px',
        padding: '0 40px'
      },
      structure: {
        logo: 'Left aligned, font-size: 20px',
        icons: 'Right aligned, 3 icons (search, cart, user)',
        cartBadge: '18px circle, absolute positioned'
      },
      colors: {
        background: 'rgba(0, 0, 0, 0.95) with backdrop-blur',
        text: '#ffffff',
        border: '1px solid #e5e7eb'
      },
      functionality: [
        'Fixed position at top',
        'Backdrop blur effect',
        'Cart badge shows item count',
        'User icon opens account menu',
        'Search icon (placeholder)',
        'Transparent on scroll up'
      ]
    },
    {
      name: 'Product Detail Page',
      file: 'src/pages/PieceMinimal.tsx',
      dimensions: {
        container: 'max-width: 1400px',
        imageGallery: '50% width on desktop',
        productInfo: '50% width on desktop'
      },
      structure: {
        imageGallery: 'Main image + thumbnails, zoom on click',
        sizeSelector: '6 sizes (XS, S, M, L, XL, XXL)',
        quantityPicker: 'Min: 1, Max: 10',
        addToCart: 'Primary button, full width on mobile'
      },
      colors: {
        background: '#000000',
        text: '#ffffff',
        selectedSize: '#ffffff with black text',
        unselectedSize: 'transparent with white border'
      },
      functionality: [
        'Image carousel with prev/next',
        'Size selection required',
        'Quantity increment/decrement',
        'Add to cart updates badge',
        'Buy now (direct checkout - not implemented)',
        'Product details accordion'
      ]
    },
    {
      name: 'Cart Page',
      file: 'src/pages/Cart.tsx',
      dimensions: {
        cartList: '60% width on desktop',
        orderSummary: '40% width on desktop, sticky'
      },
      structure: {
        cartItem: 'Image (80px) + Details + Quantity + Remove',
        orderSummary: 'Subtotal, Shipping, Tax, Total',
        checkoutButton: 'Full width, prominent'
      },
      colors: {
        background: '#000000',
        itemBorder: 'rgba(255, 255, 255, 0.1)',
        summaryBackground: 'rgba(255, 255, 255, 0.05)'
      },
      functionality: [
        'Update quantity in cart',
        'Remove item from cart',
        'Calculate subtotal automatically',
        'Free shipping indicator',
        'Proceed to checkout button',
        'Empty cart message'
      ]
    },
    {
      name: 'Admin Dashboard',
      file: 'src/pages/admin/AdminDashboard.tsx',
      dimensions: {
        metrics: '4 cards, equal width',
        recentOrders: 'Full width table',
        navigation: '64px height'
      },
      structure: {
        metricCard: '25% width, padding: 24px',
        ordersTable: 'Columns: ID, Customer, Total, Status',
        activityFeed: 'List with timestamps'
      },
      colors: {
        background: '#000000',
        cardBorder: 'rgba(255, 255, 255, 0.1)',
        statusBadge: 'Green (shipped), Yellow (processing), Red (pending)'
      },
      functionality: [
        'Real-time metrics display',
        'Revenue tracking',
        'Order status updates',
        'Customer count',
        'Recent activity log',
        'Navigation to detailed views'
      ]
    }
  ]

  const securityFeatures = [
    {
      feature: 'Authentication',
      implementation: 'React Context + Protected Routes',
      location: 'src/contexts/AuthContext.tsx',
      details: [
        'Test accounts hardcoded (demo only)',
        'JWT token stored in localStorage',
        'Session persistence across page reloads',
        'Auto-logout on token expiration'
      ],
      security: [
        '⚠️ DEMO MODE: Hardcoded credentials',
        '⚠️ No password hashing (client-side)',
        '✅ Protected routes redirect to login',
        '⚠️ TODO: Implement backend authentication'
      ]
    },
    {
      feature: 'Protected Routes',
      implementation: 'HOC Component',
      location: 'src/components/ProtectedRoute.tsx',
      details: [
        'Checks authentication status',
        'Redirects to /admin/login if not authenticated',
        'Logs unauthorized access attempts',
        'Preserves intended destination'
      ],
      security: [
        '✅ Route protection working',
        '✅ Console logging for security monitoring',
        '✅ Graceful redirect to login',
        '⚠️ No role-based access control yet'
      ]
    },
    {
      feature: 'Data Validation',
      implementation: 'Form validation utilities',
      location: 'src/utils/security.ts',
      details: [
        'Input sanitization',
        'Email validation',
        'XSS prevention',
        'SQL injection prevention'
      ],
      security: [
        '✅ Client-side validation',
        '⚠️ TODO: Server-side validation required',
        '✅ Basic XSS protection',
        '⚠️ No rate limiting'
      ]
    }
  ]

  const designSystem = {
    colors: {
      primary: {
        black: '#000000',
        white: '#ffffff'
      },
      functional: {
        border: 'rgba(255, 255, 255, 0.1)',
        borderSubtle: 'rgba(255, 255, 255, 0.05)',
        overlay: 'rgba(0, 0, 0, 0.95)',
        surface: 'rgba(255, 255, 255, 0.05)',
        textMuted: '#666666'
      }
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      weights: {
        ultraLight: 100,
        light: 200,
        normal: 300,
        medium: 400,
        semibold: 500,
        bold: 600
      },
      letterSpacing: {
        headers: '0.4em',
        subheaders: '0.2em',
        body: '0.05em',
        buttons: '0.15em'
      }
    },
    layout: {
      maxWidth: '1400px',
      containerPadding: {
        desktop: '40px',
        tablet: '24px',
        mobile: '20px'
      },
      gridGaps: {
        small: '12px',
        medium: '24px',
        large: '40px'
      }
    },
    breakpoints: {
      mobile: '≤768px',
      tablet: '769px - 1024px',
      desktop: '>1024px'
    }
  }

  const apiEndpoints = [
    {
      category: 'Products',
      endpoints: [
        { method: 'GET', path: '/api/products', description: 'List all products', implemented: false },
        { method: 'GET', path: '/api/products/:id', description: 'Get product details', implemented: false },
        { method: 'POST', path: '/api/products', description: 'Create product (admin)', implemented: false }
      ]
    },
    {
      category: 'Orders',
      endpoints: [
        { method: 'GET', path: '/api/orders', description: 'List orders (admin)', implemented: false },
        { method: 'GET', path: '/api/orders/:id', description: 'Get order details', implemented: false },
        { method: 'POST', path: '/api/orders', description: 'Create order', implemented: false },
        { method: 'PATCH', path: '/api/orders/:id', description: 'Update order status', implemented: false }
      ]
    },
    {
      category: 'Authentication',
      endpoints: [
        { method: 'POST', path: '/api/auth/login', description: 'User login', implemented: false },
        { method: 'POST', path: '/api/auth/register', description: 'User registration', implemented: false },
        { method: 'POST', path: '/api/auth/logout', description: 'User logout', implemented: false },
        { method: 'GET', path: '/api/auth/me', description: 'Get current user', implemented: false }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Header */}
      <div className="border-b border-white/10 sticky top-0 bg-black/95 backdrop-blur-xl z-50">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.history.back()}
                  className="text-white/60 hover:text-white transition text-sm tracking-wider"
                >
                  ← BACK TO ADMIN
                </button>
                <div className="h-4 w-px bg-white/20" />
                <h1 className="text-sm font-light tracking-[0.2em]">SYSTEM DOCUMENTATION</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('components')}
                className={`px-4 py-2 text-xs tracking-wider transition ${
                  activeTab === 'components'
                    ? 'bg-white text-black'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                COMPONENTS
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 text-xs tracking-wider transition ${
                  activeTab === 'security'
                    ? 'bg-white text-black'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                SECURITY
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`px-4 py-2 text-xs tracking-wider transition ${
                  activeTab === 'design'
                    ? 'bg-white text-black'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                DESIGN SYSTEM
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`px-4 py-2 text-xs tracking-wider transition ${
                  activeTab === 'api'
                    ? 'bg-white text-black'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                API
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {activeTab === 'components' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <Box className="w-6 h-6" />
              <h2 className="text-xl font-light tracking-[0.15em]">COMPONENT SPECIFICATIONS</h2>
            </div>

            {componentSpecs.map((component, idx) => (
              <div key={idx} className="border border-white/10 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-light tracking-[0.1em]">{component.name}</h3>
                  <code className="text-xs text-white/60 bg-white/5 px-3 py-1">{component.file}</code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dimensions */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Ruler className="w-4 h-4" />
                      <span className="tracking-wider">DIMENSIONS</span>
                    </div>
                    <div className="bg-white/5 p-4 space-y-1 text-sm">
                      {Object.entries(component.dimensions).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-white/60 capitalize">{key}:</span>
                          <code className="text-white">{value}</code>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Structure */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Layout className="w-4 h-4" />
                      <span className="tracking-wider">STRUCTURE</span>
                    </div>
                    <div className="bg-white/5 p-4 space-y-1 text-sm">
                      {Object.entries(component.structure).map(([key, value]) => (
                        <div key={key} className="flex justify-between gap-4">
                          <span className="text-white/60 capitalize">{key}:</span>
                          <code className="text-white text-right">{value}</code>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Palette className="w-4 h-4" />
                      <span className="tracking-wider">COLORS</span>
                    </div>
                    <div className="bg-white/5 p-4 space-y-1 text-sm">
                      {Object.entries(component.colors).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center gap-4">
                          <span className="text-white/60 capitalize">{key}:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-white">{value}</code>
                            {value.startsWith('#') && (
                              <div className="w-4 h-4 border border-white/20" style={{ background: value }} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Functionality */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Settings className="w-4 h-4" />
                      <span className="tracking-wider">FUNCTIONALITY</span>
                    </div>
                    <div className="bg-white/5 p-4 space-y-2 text-sm">
                      {component.functionality.map((func, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-white/40">•</span>
                          <span className="text-white/80">{func}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-xl font-light tracking-[0.15em]">SECURITY FEATURES</h2>
            </div>

            {securityFeatures.map((security, idx) => (
              <div key={idx} className="border border-white/10 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-light tracking-[0.1em]">{security.feature}</h3>
                  <div className="text-right">
                    <div className="text-sm text-white/60">{security.implementation}</div>
                    <code className="text-xs text-white/40">{security.location}</code>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-white/80 tracking-wider">IMPLEMENTATION DETAILS</div>
                    <div className="bg-white/5 p-4 space-y-2 text-sm">
                      {security.details.map((detail, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-white/40">•</span>
                          <span className="text-white/80">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-white/80 tracking-wider">SECURITY ASSESSMENT</div>
                    <div className="bg-white/5 p-4 space-y-2 text-sm">
                      {security.security.map((item, i) => (
                        <div key={i} className="flex gap-2">
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <Palette className="w-6 h-6" />
              <h2 className="text-xl font-light tracking-[0.15em]">DESIGN SYSTEM</h2>
            </div>

            {/* Colors */}
            <div className="border border-white/10 p-8 space-y-6">
              <h3 className="text-lg font-light tracking-[0.1em]">COLOR PALETTE</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-sm text-white/80 tracking-wider">PRIMARY COLORS</div>
                  {Object.entries(designSystem.colors.primary).map(([name, value]) => (
                    <div key={name} className="flex items-center justify-between bg-white/5 p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border border-white/20" style={{ background: value }} />
                        <div>
                          <div className="text-sm capitalize">{name}</div>
                          <code className="text-xs text-white/60">{value}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-white/80 tracking-wider">FUNCTIONAL COLORS</div>
                  {Object.entries(designSystem.colors.functional).map(([name, value]) => (
                    <div key={name} className="flex items-center justify-between bg-white/5 p-4">
                      <div>
                        <div className="text-sm capitalize">{name.replace(/([A-Z])/g, ' $1')}</div>
                        <code className="text-xs text-white/60">{value}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="border border-white/10 p-8 space-y-6">
              <h3 className="text-lg font-light tracking-[0.1em]">TYPOGRAPHY</h3>
              <div className="space-y-4">
                <div className="text-sm text-white/60">Font Family: {designSystem.typography.fontFamily}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-4 space-y-2">
                    <div className="text-sm tracking-wider">FONT WEIGHTS</div>
                    {Object.entries(designSystem.typography.weights).map(([name, value]) => (
                      <div key={name} className="flex justify-between text-sm">
                        <span className="text-white/60 capitalize">{name}:</span>
                        <code>{value}</code>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 p-4 space-y-2">
                    <div className="text-sm tracking-wider">LETTER SPACING</div>
                    {Object.entries(designSystem.typography.letterSpacing).map(([name, value]) => (
                      <div key={name} className="flex justify-between text-sm">
                        <span className="text-white/60 capitalize">{name}:</span>
                        <code>{value}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Layout */}
            <div className="border border-white/10 p-8 space-y-6">
              <h3 className="text-lg font-light tracking-[0.1em]">LAYOUT SYSTEM</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-4 space-y-2">
                  <div className="text-sm tracking-wider">CONTAINER</div>
                  <div className="text-sm text-white/60">Max Width: {designSystem.layout.maxWidth}</div>
                </div>
                <div className="bg-white/5 p-4 space-y-2">
                  <div className="text-sm tracking-wider">PADDING</div>
                  {Object.entries(designSystem.layout.containerPadding).map(([device, value]) => (
                    <div key={device} className="flex justify-between text-sm">
                      <span className="text-white/60 capitalize">{device}:</span>
                      <code>{value}</code>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 p-4 space-y-2">
                  <div className="text-sm tracking-wider">GRID GAPS</div>
                  {Object.entries(designSystem.layout.gridGaps).map(([size, value]) => (
                    <div key={size} className="flex justify-between text-sm">
                      <span className="text-white/60 capitalize">{size}:</span>
                      <code>{value}</code>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 p-4 space-y-2">
                <div className="text-sm tracking-wider">BREAKPOINTS</div>
                {Object.entries(designSystem.breakpoints).map(([device, value]) => (
                  <div key={device} className="flex justify-between text-sm">
                    <span className="text-white/60 capitalize">{device}:</span>
                    <code>{value}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <Code className="w-6 h-6" />
              <h2 className="text-xl font-light tracking-[0.15em]">API ENDPOINTS</h2>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 mb-8">
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Note: Currently Mock Data</span>
              </div>
              <p className="text-sm text-white/60">
                All data is currently stored in mock files. Backend API implementation is required for production.
              </p>
            </div>

            {apiEndpoints.map((category, idx) => (
              <div key={idx} className="border border-white/10 p-8 space-y-4">
                <h3 className="text-lg font-light tracking-[0.1em]">{category.category}</h3>
                <div className="space-y-2">
                  {category.endpoints.map((endpoint, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-4">
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 text-xs font-mono ${
                          endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                          endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                          endpoint.method === 'PATCH' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm">{endpoint.path}</code>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-white/60">{endpoint.description}</span>
                        <span className={`text-xs px-2 py-1 ${
                          endpoint.implemented
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {endpoint.implemented ? 'IMPLEMENTED' : 'TODO'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SystemDocumentation