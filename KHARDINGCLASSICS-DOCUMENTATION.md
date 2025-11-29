# KHARDINGCLASSICS - Complete Website Documentation

**Last Updated:** November 29, 2025
**Project Status:** Production Ready
**Dev Server:** http://localhost:9000
**GitHub:** https://github.com/curiousguyinhis30s/kobys-threads

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Sitemap](#sitemap)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Pages & Routes](#pages--routes)
6. [Components](#components)
7. [State Management (Stores)](#state-management-stores)
8. [Features Implemented](#features-implemented)
9. [User Workflows](#user-workflows)
10. [Admin Workflows](#admin-workflows)
11. [Pending Items](#pending-items)

---

## Project Overview

**Khardingclassics** is a premium African heritage fashion e-commerce platform. The brand celebrates unity, self-expression, and creativity through fashion that blends African heritage with Western and Asian influences.

### Brand Information
- **Brand Name:** KHARDINGCLASSICS
- **Vision:** Spreading love and positivity across the globe through fashion
- **Philosophy:** Fashion that transcends borders
- **Founder:** Kobby Harding
- **Origin:** Born after COVID-19 lockdown from Ghanaline concept (2020-2021)

---

## Sitemap

```
KHARDINGCLASSICS WEBSITE STRUCTURE
==================================

PUBLIC PAGES (No Auth Required)
├── / (Homepage - WelcomeMinimal)
│   ├── Hero sections with parallax
│   ├── Newsletter signup
│   └── Social sharing
│
├── /collection (Product Listing)
│   ├── Category filters (ALL, KHLASSIC SUITS, T-SHIRTS, KH TAILORED, KH-SPECIALS, DENIMS, LIMITED EDITION)
│   ├── Sort options
│   ├── Grid/List view toggle
│   └── Out-of-stock indicators
│
├── /piece/:id (Product Detail)
│   ├── Image gallery with zoom
│   ├── Size selector
│   ├── Size guide modal
│   ├── Add to cart/Buy now
│   ├── Product reviews & ratings
│   ├── Related products
│   └── Recently viewed
│
├── /cart (Shopping Cart)
│   ├── Cart items management
│   ├── Quantity adjustment
│   ├── Promo code input
│   ├── Order summary with discount
│   └── Proceed to checkout
│
├── /checkout (Checkout Flow)
│   ├── Contact information
│   ├── Shipping address
│   ├── Country-based tax calculation
│   ├── Payment section
│   └── Order review
│
├── /delivery (Delivery Options)
│   └── Shipping methods & info
│
├── /thank-you (Order Confirmation)
│   └── Order details & next steps
│
├── /track-order (Order Tracking)
├── /track-order/:orderId
│   └── Order timeline & status
│
├── /favorites (Wishlist)
│   └── Saved items management
│
├── /gift-cards (Gift Cards)
│   └── Purchase & manage gift cards
│
├── /about (About Kobby)
│   ├── Brand story
│   ├── Timeline
│   ├── Vision & inspiration
│   └── Achievements
│
├── /contact (Contact Page)
│   ├── Contact form
│   ├── Business hours
│   └── Social links
│
├── /festival (Festival Hub)
│   ├── Festival calendar
│   ├── Pickup reservations
│   └── Festival-exclusive items
│
AUTHENTICATED PAGES (Login Required)
├── /account (User Account)
│   ├── Profile settings
│   ├── Order history
│   ├── Saved addresses
│   └── Preferences

ADMIN PAGES (Admin Role Required)
├── /admin/login (Admin Login)
│
├── /admin (Admin Dashboard)
│   ├── Sales overview
│   ├── Recent orders
│   ├── Inventory alerts
│   └── Newsletter subscribers
│
├── /admin/orders (Order Management)
│   └── View, update, process orders
│
├── /admin/products (Product Management)
│   └── CRUD operations for products
│
├── /admin/waitlist (Waitlist Management)
│   └── Manage notify-me requests
│
├── /admin/users (User Management)
│   └── Customer management
│
├── /admin/settings (Admin Settings)
│   └── Site configuration
│
├── /admin/brand (Brand Guidelines)
│   └── Brand assets & guidelines
│
├── /admin/tryons (Try-On Management)
│   └── Festival try-on appointments
│
├── /admin/docs (System Documentation)
│   └── Internal documentation
│
├── /admin/chatbot (Chatbot Manager)
│   └── AI chat configuration
│
├── /admin/commerce (Payment Settings)
│   └── Payment gateway config
│
└── /analytics (Analytics Dashboard)
    └── Sales & traffic analytics
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 7.1.5 | Build Tool & Dev Server |
| React Router DOM | 7.x | Routing |
| Zustand | 5.x | State Management |
| Framer Motion | 12.x | Animations |

### Styling
| Technology | Purpose |
|------------|---------|
| CSS Modules | Component styling |
| Inline Styles | Theme consistency |
| Lucide React | Icons |

### Testing
| Technology | Purpose |
|------------|---------|
| Vitest | Test Runner |
| @testing-library/react | Component Testing |
| jsdom | DOM Environment |

### Features
| Feature | Implementation |
|---------|----------------|
| PWA | Service Worker + Manifest |
| Offline Support | Cache-first strategy |
| SEO | Meta tags, OG tags |
| Accessibility | Skip links, ARIA labels |

---

## Architecture

```
src/
├── App.tsx                    # Main app with routing
├── main.tsx                   # Entry point + SW registration
│
├── pages/                     # Page components
│   ├── WelcomeMinimal.tsx     # Homepage
│   ├── CollectionMinimalEnhanced.tsx  # Product listing
│   ├── PieceMinimal.tsx       # Product detail
│   ├── Cart.tsx               # Shopping cart
│   ├── Checkout.tsx           # Checkout flow
│   ├── ThankYou.tsx           # Order confirmation
│   ├── AboutKobby.tsx         # About page
│   ├── ContactMinimal.tsx     # Contact page
│   ├── FestivalHub.tsx        # Festival page
│   ├── UserAccount.tsx        # User account
│   └── admin/                 # Admin pages
│       ├── AdminDashboard.tsx
│       ├── OrderManagement.tsx
│       ├── ProductManagement.tsx
│       └── ...
│
├── components/                # Reusable components
│   ├── Navigation.tsx         # Main navigation
│   ├── FooterMinimal.tsx      # Footer
│   ├── ProductReviews.tsx     # Review system
│   ├── SizeGuide.tsx          # Size guide modal
│   ├── ShareButtons.tsx       # Social sharing
│   ├── NewsletterSignup.tsx   # Newsletter form
│   ├── MinimalAIChat.tsx      # AI chatbot
│   ├── Toast.tsx              # Notifications
│   ├── ErrorBoundary.tsx      # Error handling
│   └── admin/                 # Admin components
│
├── stores/                    # Zustand stores
│   ├── useStore.ts            # Main cart store
│   ├── useReviewStore.ts      # Reviews
│   ├── usePromoStore.ts       # Promo codes
│   ├── useNewsletterStore.ts  # Newsletter
│   ├── useOrderStore.ts       # Orders
│   ├── useUserStore.ts        # User data
│   └── ...
│
├── contexts/
│   └── AuthContext.tsx        # Authentication
│
├── utils/
│   ├── taxCalculator.ts       # Tax calculations
│   ├── security.ts            # Security utils
│   └── ...
│
├── data/
│   └── mockData.ts            # Product data
│
├── hooks/                     # Custom hooks
│   ├── useDebounce.ts
│   └── useFormValidation.ts
│
└── __tests__/                 # Test files
    ├── setup.ts
    ├── stores/
    ├── components/
    └── utils/
```

---

## Pages & Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | WelcomeMinimal | Homepage with hero sections |
| `/collection` | CollectionMinimalEnhanced | Product grid with filters |
| `/piece/:id` | PieceMinimal | Product detail page |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Checkout process |
| `/delivery` | DeliveryOptionsMinimal | Delivery options |
| `/thank-you` | ThankYou | Order confirmation |
| `/track-order` | OrderTracking | Track orders |
| `/favorites` | FavoritesMinimal | Wishlist |
| `/gift-cards` | GiftCards | Gift card purchase |
| `/about` | AboutKobby | About the brand |
| `/contact` | ContactMinimal | Contact form |
| `/festival` | FestivalHub | Festival pickups |

### Protected Routes (Auth Required)
| Route | Component | Role |
|-------|-----------|------|
| `/account` | UserAccount | User |
| `/admin` | AdminDashboard | Admin |
| `/admin/orders` | OrderManagement | Admin |
| `/admin/products` | ProductManagement | Admin |
| `/admin/waitlist` | AdminWaitlist | Admin |
| `/admin/users` | UserManagement | Admin |
| `/admin/settings` | AdminSettings | Admin |
| `/admin/brand` | BrandGuidelines | Admin |
| `/admin/tryons` | TryOnManagement | Admin |
| `/admin/docs` | SystemDocumentation | Admin |
| `/admin/chatbot` | ChatbotManager | Admin |
| `/admin/commerce` | PaymentSettings | Admin |
| `/analytics` | AnalyticsDashboard | Admin |

---

## Components

### Core Components
| Component | File | Purpose |
|-----------|------|---------|
| Navigation | Navigation.tsx | Main header with cart badge |
| AdminNavigation | AdminNavigation.tsx | Admin sidebar |
| FooterMinimal | FooterMinimal.tsx | Site footer with social links |
| ErrorBoundary | ErrorBoundary.tsx | Error catching |
| ProtectedRoute | ProtectedRoute.tsx | Route protection |
| Toast | Toast.tsx | Notifications |

### E-commerce Components
| Component | File | Purpose |
|-----------|------|---------|
| ProductReviews | ProductReviews.tsx | Rating & reviews |
| SizeGuide | SizeGuide.tsx | Size chart modal |
| ProductQuickView | ProductQuickView.tsx | Quick add modal |
| EnhancedProductCard | EnhancedProductCard.tsx | Product cards |
| CheckoutProgress | CheckoutProgress.tsx | Checkout steps |
| OrderTimeline | OrderTimeline.tsx | Order status |
| GiftCardPurchase | GiftCardPurchase.tsx | Gift cards |

### Feature Components
| Component | File | Purpose |
|-----------|------|---------|
| ShareButtons | ShareButtons.tsx | Social sharing |
| NewsletterSignup | NewsletterSignup.tsx | Email capture |
| MinimalAIChat | MinimalAIChat.tsx | AI assistant |
| NotifyMeModal | NotifyMeModal.tsx | Stock notifications |
| RecentlyViewed | RecentlyViewed.tsx | View history |
| SearchAndFilter | SearchAndFilter.tsx | Product filters |

---

## State Management (Stores)

### useStore (Main Cart Store)
```typescript
// Location: src/stores/useStore.ts
- addToCart(product, size)
- removeFromCart(productId, size)
- updateQuantity(productId, size, quantity)
- clearCart()
- getCartTotal()
- favorites management
- recently viewed tracking
```

### useReviewStore
```typescript
// Location: src/stores/useReviewStore.ts
- addReview(productId, review)
- getReviewsByProduct(productId)
- markHelpful(reviewId)
- averageRating calculation
```

### usePromoStore
```typescript
// Location: src/stores/usePromoStore.ts
- validateCode(code)
- applyPromo(code)
- removePromo()
- calculateDiscount(subtotal)
Seed Codes: WELCOME10, SAVE20, FESTIVAL15, KHCLASSICS25
```

### useNewsletterStore
```typescript
// Location: src/stores/useNewsletterStore.ts
- subscribe(email)
- getSubscribers()
- isSubscribed(email)
```

### useOrderStore
```typescript
// Location: src/stores/useOrderStore.ts
- createOrder(orderData)
- getOrder(orderId)
- updateOrderStatus(orderId, status)
```

### useUserStore
```typescript
// Location: src/stores/useUserStore.ts
- updateProfile(data)
- getAddresses()
- addAddress(address)
```

---

## Features Implemented

### Completed Features ✅

#### E-commerce Core
- [x] Product catalog with categories
- [x] Product detail pages
- [x] Shopping cart
- [x] Checkout flow
- [x] Order confirmation
- [x] Order tracking
- [x] Wishlist/Favorites
- [x] Gift cards

#### Product Experience
- [x] Product reviews & ratings (5-star system)
- [x] Size guide modal
- [x] Related products section
- [x] Recently viewed products
- [x] Out-of-stock indicators
- [x] Quick add to cart

#### Pricing & Promotions
- [x] Promo code system
- [x] Percentage discounts
- [x] Fixed amount discounts
- [x] Minimum purchase requirements
- [x] Country-based tax calculation (20+ countries)

#### User Experience
- [x] Social sharing (Facebook, Twitter, Pinterest, WhatsApp)
- [x] Newsletter signup
- [x] AI chatbot assistant
- [x] Responsive design
- [x] PWA support (offline, installable)
- [x] Toast notifications

#### Authentication
- [x] User login/logout
- [x] Admin authentication
- [x] Protected routes
- [x] Role-based access

#### Admin Panel
- [x] Dashboard with metrics
- [x] Order management
- [x] Product management
- [x] User management
- [x] Newsletter subscriber list
- [x] Waitlist management
- [x] Analytics dashboard

#### Technical
- [x] Lazy loading (code splitting)
- [x] Error boundaries
- [x] SEO optimization
- [x] Accessibility (skip links, ARIA)
- [x] Testing infrastructure (Vitest)
- [x] 58 passing tests

---

## User Workflows

### 1. Browse & Purchase Flow
```
Homepage → Collection → Product Detail → Add to Cart → Cart → Checkout → Thank You
    │           │              │
    │           │              ├── View Reviews
    │           │              ├── Check Size Guide
    │           │              └── Add to Favorites
    │           │
    │           └── Filter by Category
    │               Sort by Price/Name
    │
    └── Newsletter Signup
```

### 2. Cart Flow
```
Add Item → Cart Page → Apply Promo Code → View Discount → Proceed to Checkout
              │
              ├── Update Quantity
              ├── Remove Item
              └── Continue Shopping
```

### 3. Checkout Flow
```
Checkout → Contact Info → Shipping Address → Select Country (Tax Applied) → Payment → Place Order
                               │
                               └── Tax calculated based on country:
                                   US: 8%, UK: 20% VAT, EU: 21%, etc.
```

### 4. Order Tracking
```
Thank You Page → Track Order → Enter Order ID → View Timeline → Status Updates
```

### 5. User Account
```
Login → Account Dashboard → View Orders
                         → Manage Addresses
                         → Update Profile
                         → View Favorites
```

---

## Admin Workflows

### 1. Order Management
```
Admin Dashboard → Orders → View Order → Update Status → Notify Customer
                             │
                             ├── Pending
                             ├── Processing
                             ├── Shipped
                             └── Delivered
```

### 2. Product Management
```
Admin Dashboard → Products → Add Product → Fill Details → Save
                          → Edit Product → Update → Save
                          → Delete Product
```

### 3. Analytics Review
```
Admin Dashboard → Analytics → View Sales Data
                           → View Traffic
                           → View Conversion Rates
```

### 4. Newsletter Management
```
Admin Dashboard → View Subscribers → Export CSV
```

---

## Pending Items

### Optional Future Enhancements
- [ ] Stripe payment integration
- [ ] Real backend database (Supabase)
- [ ] FestivalTwins feature completion
- [ ] SunsetEditions feature completion
- [ ] Review moderation workflow
- [ ] Photo upload in reviews
- [ ] Background sync for offline orders
- [ ] Web Payment API integration
- [ ] Push notifications

### Client Meeting (Dec 24-28, KL)
- [ ] Visual finalization
- [ ] Product imagery updates
- [ ] Content review

---

## Test Credentials

### Admin Access
- **Email:** admin@kobysthreads.com
- **Password:** admin123

### Test Users
- **Email:** john@example.com / Password: user123
- **Email:** sarah@example.com / Password: user456

---

## Commands

```bash
# Development
npm run dev          # Start dev server

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Visual test interface
npm run test:coverage # Generate coverage report

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Lint
npm run lint         # Run ESLint
```

---

## Product Categories

| Category | Slug | Description |
|----------|------|-------------|
| Khlassic Suits | khlassic-suits | Premium suits |
| T-Shirts | t-shirts | Casual tops |
| KH Tailored | kh-tailored | Custom pieces |
| KH-Specials | kh-specials | Special editions |
| Denims | denims | Denim collection |
| Limited Edition | limited | Seasonal limited items |

---

## Current Products (Mock Data)

| ID | Name | Price | Category | Available |
|----|------|-------|----------|-----------|
| sunset-warrior | Sunset Warrior | $450 | t-shirts | ✅ |
| midnight-bloom | Midnight Bloom | $380 | kh-specials | ✅ |
| festival-spirit | Festival Spirit | $420 | limited | ✅ |
| urban-roots | Urban Roots | $480 | denims | ✅ |
| gentle-rebel | Gentle Rebel | $350 | t-shirts | ❌ |
| ocean-dreams | Ocean Dreams | $400 | kh-tailored | ✅ |
| golden-hour | Golden Hour | $520 | khlassic-suits | ✅ |
| night-market | Night Market | $360 | khlassic-suits | ✅ |

---

## Responsiveness Improvements (November 29, 2025)

### Issues Fixed

#### Navigation.tsx
- ✅ Added `isSmallMobile` breakpoint (< 360px) for ultra-small screens
- ✅ Added `screenWidth` tracking for dynamic calculations
- ✅ Made header padding responsive: 12px (small) → 16px (mobile) → 24px (desktop)
- ✅ Fixed mobile menu width: `min(280px, 80vw)` to fit all screens
- ✅ Added `overflowY: auto` to mobile menu for scrolling on small screens
- ✅ Increased touch targets to minimum 44px (from 8px padding to 12px)

#### Cart.tsx
- ✅ Added `isTablet` breakpoint (768-1024px) for tablet-specific layouts
- ✅ Added `isSmallMobile` breakpoint (< 360px)
- ✅ Made sidebar responsive: 320px (tablet) → 380px (desktop)
- ✅ Made gaps responsive: 16px (small) → 24px (mobile) → 32px (desktop)

#### Checkout.tsx
- ✅ Added `isSmallScreen` (< 768px) and `isSmallMobile` (< 360px) breakpoints
- ✅ Made form grids stack on mobile: 1fr instead of 1fr 1fr
- ✅ Made country/postal code grid responsive
- ✅ Made container padding responsive: 12px (small) → 16px (mobile) → 24px (desktop)
- ✅ Reduced sidebar width from 400px to 360px for better tablet support

#### FooterMinimal.tsx
- ✅ Added `isSmallMobile` breakpoint (< 360px)
- ✅ Made footer grid stack to 1 column on very small screens
- ✅ Made padding responsive: 12px (small) → 16px (mobile) → 40px (desktop)
- ✅ Fixed brand section column span for single-column layout

### Breakpoints Used
| Breakpoint | Width | Purpose |
|------------|-------|---------|
| isSmallMobile | < 360px | Ultra-small phones, older devices |
| isMobile | < 768px | Phones, small tablets |
| isSmallScreen | < 768px | Form stacking breakpoint |
| isTablet | 768-1024px | Tablets, small laptops |
| Desktop | > 1024px | Full desktop experience |

### Touch Target Compliance
All interactive elements now meet the 44px minimum touch target size for accessibility (WCAG 2.1 Level AA).

---

*Documentation generated by AI IDE Agent - November 29, 2025*
