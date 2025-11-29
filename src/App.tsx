import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navigation from './components/Navigation'
import AdminNavigation from './components/AdminNavigation'
import FooterMinimal from './components/FooterMinimal'
import MinimalAIChat from './components/MinimalAIChat'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import ToastContainer from './components/Toast'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

// Lazy load pages for better performance
const Welcome = lazy(() => import('./pages/WelcomeMinimal'))
const Collection = lazy(() => import('./pages/CollectionMinimal'))
const Piece = lazy(() => import('./pages/PieceMinimal'))
const Favorites = lazy(() => import('./pages/FavoritesMinimal'))
const Cart = lazy(() => import('./pages/Cart'))
const GiftCards = lazy(() => import('./pages/GiftCards'))
const DeliveryOptions = lazy(() => import('./pages/DeliveryOptionsMinimal'))
const Checkout = lazy(() => import('./pages/Checkout'))
const ThankYou = lazy(() => import('./pages/ThankYou'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.tsx'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.tsx'))
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement.tsx'))
const BrandGuidelines = lazy(() => import('./pages/admin/BrandGuidelines.tsx'))
const TryOnManagement = lazy(() => import('./pages/admin/TryOnManagement.tsx'))
const SystemDocumentation = lazy(() => import('./pages/admin/SystemDocumentation.tsx'))
const ChatbotManager = lazy(() => import('./components/admin/ChatbotManager.tsx'))
const PaymentSettings = lazy(() => import('./components/admin/PaymentSettings.tsx'))
const UserManagement = lazy(() => import('./components/admin/UserManagement.tsx'))
const AboutKobby = lazy(() => import('./pages/AboutKobby'))
const Contact = lazy(() => import('./pages/ContactMinimal'))
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const Login = lazy(() => import('./pages/Login'))
const UserAccount = lazy(() => import('./pages/UserAccount'))
const FestivalHub = lazy(() => import('./pages/FestivalHub'))
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement.tsx'))
const AdminWaitlist = lazy(() => import('./pages/admin/AdminWaitlist.tsx'))

// Loading component for Suspense
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000'
  }}>
    <div style={{
      fontSize: '11px',
      letterSpacing: '0.2em',
      color: 'rgba(255, 255, 255, 0.4)'
    }}>
      LOADING...
    </div>
  </div>
)

const AppContent = () => {
  const location = useLocation()
  const hideNavRoutes = ['/checkout', '/thank-you', '/delivery', '/login', '/admin/login']
  const isAdminRoute = (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') || location.pathname === '/analytics'
  const showNav = !hideNavRoutes.includes(location.pathname) && !isAdminRoute && location.pathname !== '/admin/login'
  const showFooter = !hideNavRoutes.includes(location.pathname) && !isAdminRoute && location.pathname !== '/admin/login' && !location.pathname.startsWith('/fabric-dna')

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000' }}>
      {/* Skip Links */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 9999,
          padding: '12px 24px',
          background: '#fff',
          color: '#000',
          fontSize: '14px',
          fontWeight: '500',
          textDecoration: 'none',
          letterSpacing: '0.05em',
          border: '2px solid #000',
          borderRadius: '4px'
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '16px'
          e.currentTarget.style.top = '16px'
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px'
        }}
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        style={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 9999,
          padding: '12px 24px',
          background: '#fff',
          color: '#000',
          fontSize: '14px',
          fontWeight: '500',
          textDecoration: 'none',
          letterSpacing: '0.05em',
          border: '2px solid #000',
          borderRadius: '4px'
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '16px'
          e.currentTarget.style.top = '64px'
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px'
        }}
      >
        Skip to navigation
      </a>

      <div id="navigation">
        {showNav && <Navigation />}
        {isAdminRoute && <AdminNavigation />}
      </div>
      {/* Add proper spacing for fixed header */}
      <main id="main-content" role="main" style={{ paddingTop: showNav || isAdminRoute ? '64px' : '0' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/piece/:id" element={<Piece />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/gift-cards" element={<GiftCards />} />
            <Route path="/delivery" element={<DeliveryOptions />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/track-order/:orderId" element={<OrderTracking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/admin/settings" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <AdminSettings />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/admin/orders" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <OrderManagement />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/admin/products" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <ProductManagement />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/admin/brand" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <BrandGuidelines />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/admin/tryons" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <TryOnManagement />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/admin/docs" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <SystemDocumentation />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/admin/chatbot" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <ChatbotManager />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/admin/commerce" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <PaymentSettings />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/admin/users" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/admin/waitlist" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <AdminWaitlist />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/about" element={<AboutKobby />} />
            <Route path="/analytics" element={
              <ErrorBoundary>
                <ProtectedRoute adminOnly>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              </ErrorBoundary>
            } />
            <Route path="/festival" element={<FestivalHub />} />
            <Route path="/pickup" element={<Navigate to="/festival" replace />} />
            <Route path="/festival-pickup" element={<Navigate to="/festival" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={
              <ProtectedRoute>
                <UserAccount />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/collection" replace />} />
          </Routes>
        </Suspense>
      </main>
      {showFooter && <FooterMinimal />}
      <MinimalAIChat />
      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App