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
const Cart = lazy(() => import('./pages/Cart'))
const DeliveryOptions = lazy(() => import('./pages/DeliveryOptionsMinimal'))
const Checkout = lazy(() => import('./pages/Checkout'))
const ThankYou = lazy(() => import('./pages/ThankYou'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'))
const BrandGuidelines = lazy(() => import('./pages/admin/BrandGuidelines'))
const TryOnManagement = lazy(() => import('./pages/admin/TryOnManagement'))
const SystemDocumentation = lazy(() => import('./pages/admin/SystemDocumentation'))
const AboutKobby = lazy(() => import('./pages/AboutKobby'))
const FestivalPickup = lazy(() => import('./pages/FestivalPickupMinimal'))
const Contact = lazy(() => import('./pages/ContactMinimal'))
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const UserAccount = lazy(() => import('./pages/UserAccount'))

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
  const hideNavRoutes = ['/checkout', '/thank-you', '/delivery', '/admin/login']
  const isAdminRoute = (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') || location.pathname === '/analytics'
  const showNav = !hideNavRoutes.includes(location.pathname) && !isAdminRoute && location.pathname !== '/admin/login'
  const showFooter = !hideNavRoutes.includes(location.pathname) && !isAdminRoute && location.pathname !== '/admin/login'

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#000' }}>
      {showNav && <Navigation />}
      {isAdminRoute && <AdminNavigation />}
      {/* Add proper spacing for fixed header */}
      <main style={{ paddingTop: showNav || isAdminRoute ? '64px' : '0' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/piece/:id" element={<Piece />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/delivery" element={<DeliveryOptions />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute adminOnly>
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute adminOnly>
                <OrderManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/brand" element={
              <ProtectedRoute adminOnly>
                <BrandGuidelines />
              </ProtectedRoute>
            } />
            <Route path="/admin/tryons" element={
              <ProtectedRoute adminOnly>
                <TryOnManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/docs" element={
              <ProtectedRoute adminOnly>
                <SystemDocumentation />
              </ProtectedRoute>
            } />
            <Route path="/about" element={<AboutKobby />} />
            <Route path="/analytics" element={
              <ProtectedRoute adminOnly>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            <Route path="/pickup" element={<FestivalPickup />} />
            <Route path="/festival-pickup" element={<FestivalPickup />} />
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