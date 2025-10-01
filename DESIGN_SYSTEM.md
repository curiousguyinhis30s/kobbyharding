# KOBBY HARDING DESIGN SYSTEM
**Last Updated:** 2025-09-20
**Version:** 2.0

## 🎨 VISUAL IDENTITY

### Brand Colors
```css
/* Primary Palette */
--black: #000000
--white: #FFFFFF
--orange-accent: #F97316 /* Festival energy */

/* Grayscale */
--gray-900: #111111
--gray-800: #1F1F1F
--gray-700: #2D2D2D
--gray-600: #404040
--gray-500: #666666
--gray-400: #999999
--gray-300: #CCCCCC
--gray-200: #E5E5E5
--gray-100: #F5F5F5

/* Functional Colors */
--success: #10B981
--warning: #F59E0B
--error: #EF4444
--info: #3B82F6
```

### Typography
```css
/* Font Stack */
font-family: system-ui, -apple-system, BlinkMacSystemFont,
            'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif

/* Headings */
h1: 64px / 900 weight / 1.1 line-height
h2: 48px / 800 weight / 1.2 line-height
h3: 32px / 700 weight / 1.3 line-height
h4: 24px / 600 weight / 1.4 line-height

/* Body Text */
body: 16px / 400 weight / 1.6 line-height
small: 14px / 400 weight / 1.5 line-height
caption: 12px / 300 weight / 1.4 line-height

/* Special */
price: 20px / 600 weight / monospace
button: 14px / 500 weight / uppercase / 0.1em letter-spacing
```

## 🎭 DESIGN PRINCIPLES

### 1. **Minimalist Luxury**
- Clean black/white base with strategic orange accents
- Generous white space
- Focus on product photography
- No visual clutter

### 2. **Festival Energy**
- Dynamic parallax scrolling
- Smooth animations (Framer Motion)
- Interactive hover states
- Vibrant call-to-actions

### 3. **Mobile-First Responsive**
- Touch-optimized interactions
- Thumb-friendly navigation
- Adaptive layouts
- Performance over aesthetics on mobile

## 🏗️ COMPONENT PATTERNS

### Navigation
```tsx
/* Header Pattern */
- Fixed position with blur backdrop
- Logo left, nav center, actions right
- Mobile: Hamburger menu with slide-out drawer
- Active state: Orange underline
```

### Product Cards
```tsx
/* Grid Card Pattern */
- Image aspect ratio: 3:4
- Hover: Subtle scale (1.02) + shadow
- Quick actions: Heart (top-right), Add to Cart (bottom)
- Price display: Bold, prominent
- Stock indicator: Subtle text
```

### Buttons
```tsx
/* Primary Button */
background: #F97316
color: white
padding: 12px 24px
border-radius: 4px
text-transform: uppercase
hover: brightness(110%)

/* Secondary Button */
background: transparent
border: 1px solid currentColor
hover: background fill animation

/* Ghost Button */
background: transparent
hover: text color change to orange
```

### Forms
```tsx
/* Input Fields */
border: 1px solid #E5E5E5
focus: orange border
padding: 12px
font-size: 14px
placeholder: gray-400

/* Validation */
error: red border + message below
success: green checkmark icon
```

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile First Approach */
sm: 640px   /* Landscape phones */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Wide screens */
2xl: 1536px /* Ultra-wide */
```

## 🎬 ANIMATION PATTERNS

### Page Transitions
```tsx
/* Fade In Up */
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.5 }

/* Stagger Children */
container: { staggerChildren: 0.1 }
item: { fadeInUp animation }

/* Parallax Scroll */
speed: 0.5 for backgrounds
speed: 0.8 for foreground elements
```

### Micro-interactions
```tsx
/* Hover States */
scale: 1.02
transition: 200ms ease
cursor: pointer

/* Loading States */
skeleton screens for content
spinner for actions
progress bar for uploads

/* Success Feedback */
checkmark animation
toast notification
confetti for purchases
```

## 🖼️ IMAGE GUIDELINES

### Product Photography
- **Primary:** Model wearing the item
- **Secondary:** Flat lay or detail shots
- **Aspect Ratio:** 3:4 for cards, 16:9 for heroes
- **Format:** WebP with JPG fallback
- **Size:** <500KB optimized

### Hero Images
- **Full width:** 1920px minimum
- **Parallax enabled:** Yes
- **Text overlay:** Dark gradient for readability
- **Mobile:** Different crop for portrait

## 🏪 PAGE-SPECIFIC STYLES

### Homepage
- **Hero:** Full viewport height with parallax
- **Story Sections:** Alternating image/text layout
- **Festival Grid:** 3 columns desktop, 1 mobile
- **CTA:** Floating orange buttons

### Collection
- **Filters:** Sticky sidebar desktop, modal mobile
- **Grid:** 4 columns desktop, 2 mobile
- **Sort:** Dropdown right-aligned
- **Load More:** Infinite scroll with skeleton

### Product Detail
- **Gallery:** Left 60%, Details right 40%
- **Thumbnails:** Bottom scrollable row
- **Size Selector:** Radio buttons styled as boxes
- **Add to Cart:** Sticky on mobile

### Cart
- **Layout:** Items left, summary right
- **Update:** Inline quantity selector
- **Remove:** Trash icon with confirmation
- **Checkout:** Multi-step with progress bar

## 🔧 TECHNICAL IMPLEMENTATION

### CSS Architecture
```scss
/* Utility-First with Tailwind */
@layer base {
  /* Reset and base styles */
}

@layer components {
  /* Reusable component classes */
  .btn-primary { @apply ... }
  .card { @apply ... }
}

@layer utilities {
  /* Single-purpose utilities */
}
```

### State Management
```tsx
/* Zustand Store Pattern */
- Cart state: items, total, methods
- UI state: theme, modals, navigation
- User state: auth, preferences
- Product state: filters, sort, search
```

## 🎯 ACCESSIBILITY

### ARIA Labels
- All interactive elements labeled
- Screen reader announcements
- Focus indicators visible
- Keyboard navigation complete

### Color Contrast
- Text: WCAG AAA compliant
- Buttons: WCAG AA minimum
- Error states: High contrast
- Dark mode: Tested separately

## 🚀 PERFORMANCE TARGETS

### Core Web Vitals
- **LCP:** < 2.5s (Largest Contentful Paint)
- **FID:** < 100ms (First Input Delay)
- **CLS:** < 0.1 (Cumulative Layout Shift)
- **TTI:** < 3.5s (Time to Interactive)

### Optimization Techniques
- Code splitting by route
- Image lazy loading
- Critical CSS inline
- Service worker caching
- CDN for static assets

## 📐 SPACING SYSTEM

```css
/* Base unit: 4px */
spacing-1: 4px
spacing-2: 8px
spacing-3: 12px
spacing-4: 16px
spacing-5: 20px
spacing-6: 24px
spacing-8: 32px
spacing-10: 40px
spacing-12: 48px
spacing-16: 64px
spacing-20: 80px
```

## 🎨 DARK MODE (Future)

### Color Inversions
```css
/* Planned Dark Theme */
--bg: #000000
--text: #FFFFFF
--surface: #111111
--border: #2D2D2D
--orange: #F97316 /* Stays same */
```

---

**This design system ensures consistency across the Kobby Harding platform while maintaining the brand's unique festival fashion identity.**