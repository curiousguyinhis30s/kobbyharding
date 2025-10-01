# KOBY'S THREADS - Project Context Summary

## CRITICAL UPDATE - 2025-01-23

### Black Screen Issue RESOLVED
- **Problem**: Collection page had persistent black screen overlay for 5 days
- **Root Cause**: Multiple CSS files (OVERLAY_FIX.css, index.css) forcing black backgrounds
- **Solution**: Removed problematic CSS imports, created CollectionFixed.tsx
- **Status**: ✅ FIXED

### Current Phase: Theme System & CMS Planning
- **Active Work**: Implementing 3-theme system (Light/Dark/Artisan)
- **Next Priority**: CMS system for admin panel
- **User Requirement**: No-code editing for landing/collection pages

## Project Overview
A premium festival fashion e-commerce platform focused on Kizomba, Urban Kizomba, and Tarraxo dance festivals across Asia. Now features a multi-theme system with Light, Dark, and Artisan themes.

## Core Features Implemented

### 1. Authentication System
- **Login Credentials**: admin/admin (dummy auth)
- **User Context**: AuthContext managing user state, orders, favorites, and try-on requests
- **Protected Routes**: Admin and analytics dashboards require authentication
- **Session Storage**: Local storage with encoded data for persistence

### 2. Festival Try-On Reservation
- **Functionality**: Users can select up to 5 pieces per festival for try-on
- **Festivals**: 6 major Asian festivals (Bangkok, Singapore, Bali, Tokyo, Seoul, Hong Kong)
- **Modal Interface**: Clean selection UI with visual feedback
- **Integration**: Saves requests to user profile for tracking

### 3. Analytics Dashboard
- **Metrics Tracked**:
  - Product views, likes, cart adds, purchases
  - User demographics (68% Asia Pacific, 22% Europe, 10% Americas)
  - Festival interest levels
  - Conversion rates (3.8% average)
- **Features**:
  - Top performing products table
  - Rating distribution charts
  - Real-time engagement scores
  - Time range filtering (7d, 30d, 90d)

### 4. Product Feedback System
- **Components**:
  - 5-star rating system
  - Customer review submission
  - Review helpfulness voting
  - Rating distribution visualization
- **Display**: Shows on each product page with average rating and review count

### 5. Security Implementation
- **Protection Layers**:
  - ProtectedRoute component for admin pages
  - Input sanitization (XSS prevention)
  - Rate limiting (5 login attempts/minute, 100 API calls/minute)
  - Product quantity limits (max 10 per item)
  - Security event logging for audit trails
- **Validation**:
  - Email format validation
  - Password strength requirements
  - Product ID validation (alphanumeric only)
  - Festival selection validation (max 5 pieces)

## Technical Stack

### Frontend
- **React 19** with TypeScript
- **Vite 7** build system
- **Framer Motion** for animations
- **React Router** for navigation
- **Zustand** for state management

### Styling
- **Pure CSS-in-JS** (no Tailwind in components)
- **Black & White Theme**:
  - Background: #000
  - Text: #fff with opacity variations
  - Borders: rgba(255,255,255,0.1-0.3)
  - Accent: Minimal use of green for success states

### Data Management
- **Local State**: Zustand store for cart and products
- **Auth State**: Context API with localStorage
- **Mock Data**: 18 products with African-inspired designs

## File Structure

```
/src
├── components/
│   ├── Navigation.tsx          # Main navigation with auth integration
│   ├── LoginModal.tsx          # Authentication modal
│   ├── ProductFeedback.tsx     # Review system component
│   ├── ProtectedRoute.tsx      # Route protection wrapper
│   └── MinimalAIChat.tsx       # AI chatbot with music player
├── contexts/
│   ├── AuthContext.tsx         # Authentication context
│   └── ThemeContext.tsx        # Theme management
├── pages/
│   ├── WelcomeMinimal.tsx      # Homepage
│   ├── CollectionMinimal.tsx   # Product grid
│   ├── PieceMinimal.tsx        # Product detail
│   ├── FestivalPickupMinimal.tsx # Festival reservations
│   ├── AnalyticsDashboard.tsx  # Analytics page
│   └── admin/
│       └── AdminDashboard.tsx  # Admin control panel
├── stores/
│   └── useStore.ts            # Zustand store
└── utils/
    └── security.ts            # Security utilities
```

## Design Philosophy

### Visual Identity
- **Minimalist**: Clean, uncluttered interface
- **Typography**: Light font weights (100-300), generous letter spacing
- **Grid Layouts**: Seamless borders, hover effects
- **No Colors**: Pure black/white except product images

### User Experience
- **Mobile-First**: Responsive design for all devices
- **Fast Loading**: Lazy loading with Suspense
- **Smooth Animations**: Framer Motion transitions
- **Accessibility**: Clear contrast, readable fonts

## Key User Flows

### 1. Shopping Flow
Welcome → Collection → Product Detail → Cart → Checkout → Thank You

### 2. Festival Reservation
Festival Page → Select Festival → Choose 5 Pieces → Submit Request

### 3. Admin Flow
Login → Admin Dashboard → Analytics → Product Management

### 4. Review Flow
Product Page → Write Review → Rate & Comment → Submit

## API Endpoints (Mock)
- No real backend - all data is mocked
- Authentication simulated with hardcoded credentials
- Cart persistence via localStorage
- Analytics data generated randomly

## Environment
- **Development**: http://localhost:5174
- **Node Version**: Compatible with Node 18+
- **Package Manager**: npm

## Security Considerations
1. **Input Validation**: All user inputs sanitized
2. **Rate Limiting**: Prevents brute force attacks
3. **Session Management**: Encoded localStorage
4. **Protected Routes**: Admin pages require auth
5. **XSS Prevention**: HTML tags stripped from inputs
6. **Audit Logging**: Security events tracked

## Performance Optimizations
1. **Code Splitting**: Lazy loading for all pages
2. **Image Optimization**: External CDN images
3. **Minimal Dependencies**: Lightweight libraries
4. **CSS-in-JS**: No external CSS files
5. **State Management**: Efficient Zustand store

## Future Enhancements (Not Implemented)
- Real backend API integration
- Payment processing
- Email notifications
- Order tracking
- Inventory management
- Real-time chat support
- Multi-language support
- PWA features

## Known Issues
- Authentication is dummy (admin/admin only)
- Analytics data is randomly generated
- No real payment processing
- No email/SMS notifications
- Festival dates are hardcoded

## Development Commands
```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Contact
- **Instagram**: @hardingkobby
- **WhatsApp**: +66987654321 (mock number)

---

*Last Updated: January 2025*
*Version: 1.0.0*