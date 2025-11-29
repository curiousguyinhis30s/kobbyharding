# K Harding Classics

Premium African heritage fashion e-commerce platform for Kizomba, Urban Kizomba, and Tarraxo dance festivals across Asia.

## Quick Start

```bash
npm install
npm run dev
```

Development server runs at `http://localhost:9000`

---

## Demo Credentials

### Admin Access
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kobysthreads.com | admin123 |
| Test User 1 | user1@test.com | user123 |
| Test User 2 | user2@test.com | user456 |

**Legacy Login:** `admin` / `admin`

---

## Site Map

```
K Harding Classics
│
├── PUBLIC PAGES
│   ├── /                    → Welcome/Landing Page (Hero + Story + Festival sections)
│   ├── /collection          → Product Catalog (Grid with filters & search)
│   ├── /piece/:id           → Product Detail Page (Images, story, sizing, add to cart)
│   ├── /about               → About Kobby (Brand story & philosophy)
│   ├── /contact             → Contact Page (Form, social links, WhatsApp)
│   └── /festival            → Festival Hub (Try-on reservations at festivals)
│
├── SHOPPING FLOW
│   ├── /favorites           → Wishlist/Saved Items
│   ├── /cart                → Shopping Cart
│   ├── /delivery            → Delivery Options Selection
│   ├── /checkout            → Checkout Form (Payment & shipping)
│   └── /thank-you           → Order Confirmation
│
├── USER ACCOUNT (Protected)
│   └── /account             → User Profile, Orders, Try-on Requests
│
├── ADMIN PANEL (Protected - Admin Only)
│   ├── /admin/login         → Admin Login Page
│   ├── /admin               → Admin Dashboard (Overview & metrics)
│   ├── /admin/orders        → Order Management
│   ├── /admin/settings      → Admin Settings
│   ├── /admin/brand         → Brand Guidelines
│   ├── /admin/tryons        → Try-On Request Management
│   ├── /admin/docs          → System Documentation
│   └── /analytics           → Analytics Dashboard (Charts & insights)
│
└── REDIRECTS
    ├── /pickup              → Redirects to /festival
    ├── /festival-pickup     → Redirects to /festival
    └── /*                   → Redirects to /collection (404 fallback)
```

---

## Features

### Customer Features
- **Product Browsing** - Grid view with search, filters (price, vibe, category), sorting
- **Product Details** - High-res images, fabric story, sizing guide, "worn by" gallery
- **Shopping Cart** - Add/remove items, quantity adjustment, size selection
- **Wishlist** - Save favorites for later
- **Festival Try-On** - Reserve up to 5 pieces to try at upcoming festivals
- **AI Chat Assistant** - Built-in chat for product recommendations
- **User Accounts** - Order history, saved items, try-on requests

### Admin Features
- **Dashboard** - Sales overview, top products, recent orders
- **Order Management** - View, update, track orders
- **Try-On Management** - Manage festival reservation requests
- **Analytics** - Product views, conversion rates, demographics
- **Brand Guidelines** - Internal style guide

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Routing | React Router v7 |
| State | Zustand (persisted) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Styling | CSS-in-JS (inline) |
| Database | Supabase (configured, not active) |

---

## Project Structure

```
kobys-threads/
├── public/
│   └── kobby-assets/        # Product images, model photos
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.tsx
│   │   ├── AdminNavigation.tsx
│   │   ├── FooterMinimal.tsx
│   │   ├── MinimalAIChat.tsx
│   │   ├── SearchAndFilter.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Toast.tsx
│   │   └── admin/           # Admin-specific components
│   ├── pages/               # Route pages
│   │   ├── WelcomeMinimal.tsx
│   │   ├── CollectionMinimalEnhanced.tsx
│   │   ├── PieceMinimal.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── FestivalHub.tsx
│   │   ├── UserAccount.tsx
│   │   └── admin/           # Admin pages
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── ThemeContext.tsx # Theme management
│   ├── stores/
│   │   └── useStore.ts      # Zustand store (cart, filters, favorites)
│   ├── data/
│   │   └── mockData.ts      # Product catalog data
│   ├── utils/
│   │   └── security.ts      # Input validation, rate limiting
│   ├── types/               # TypeScript interfaces
│   ├── hooks/               # Custom React hooks
│   └── styles/              # Global styles
├── .env                     # Environment variables
├── .env.example             # Example env template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── package.json
```

---

## Environment Variables

Create a `.env` file in the root:

```env
# Application
VITE_APP_TITLE=K Harding Classics
VITE_ENV=development

# API (when backend is ready)
VITE_API_URL=http://localhost:3000/api

# Stripe (replace with real keys for production)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx

# Analytics (optional)
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_GTM_ID=GTM-XXXXXXX

# Feature Flags
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_FESTIVAL_PICKUP=true
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Festivals Supported

| Festival | Location | Typical Dates |
|----------|----------|---------------|
| Bangkok Kizomba Festival | Thailand | February |
| Singapore Sensual Festival | Singapore | March |
| Bali Soul Festival | Indonesia | April |
| Tokyo Kizomba Weekend | Japan | May |
| Seoul Urban Dance | South Korea | June |
| Hong Kong Afro Festival | Hong Kong | August |

---

## Design System

### Colors
- **Background:** `#000000` (Black)
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `rgba(255, 255, 255, 0.6)`
- **Borders:** `rgba(255, 255, 255, 0.1)` to `rgba(255, 255, 255, 0.3)`
- **Accent (Success):** Green (minimal use)

### Typography
- **Font Weights:** 100-300 (light/thin)
- **Letter Spacing:** 0.1em - 0.3em
- **Style:** Minimalist, fashion-forward

---

## Security Features

- **Protected Routes** - Admin pages require authentication
- **Input Sanitization** - XSS prevention on all user inputs
- **Rate Limiting** - 5 login attempts/min, 100 API calls/min
- **Quantity Limits** - Max 10 items per product
- **Session Management** - Encoded localStorage

---

## Known Limitations (Demo Mode)

- Authentication is demo-only (hardcoded credentials)
- No real payment processing
- Analytics data is randomly generated
- No email/SMS notifications
- Festival dates are static

---

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Manual
```bash
npm run build
# Deploy /dist folder to any static host
```

---

## Contact

- **Instagram:** @hardingkobby
- **WhatsApp:** +66 98 765 4321 (demo)
- **Email:** hello@khardingclassics.com

---

## License

Private - All Rights Reserved

---

*Last Updated: November 2025*
*Version: 1.0.0*
