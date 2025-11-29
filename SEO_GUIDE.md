# SEO Quick Reference - Khardingclassics

## File Locations

### Core SEO Files
- **Constants**: `/src/constants/seo.ts` - All SEO configuration
- **Component**: `/src/components/SEO.tsx` - Dynamic SEO component
- **Base HTML**: `/index.html` - Static meta tags

### Implementation Locations
- **Homepage**: `/src/pages/WelcomeMinimal.tsx`
- **Collection**: `/src/pages/CollectionMinimalEnhanced.tsx`
- **Products**: `/src/pages/PieceMinimal.tsx`
- **About**: `/src/pages/AboutKobby.tsx`
- **Contact**: `/src/pages/ContactMinimal.tsx`

## Usage Examples

### Static Page SEO
```tsx
import SEO from '../components/SEO'
import { PAGE_SEO } from '../constants/seo'

function MyPage() {
  return (
    <>
      <SEO
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        keywords={PAGE_SEO.home.keywords}
        image={PAGE_SEO.home.image}
        url="/"
        type="website"
      />
      {/* Page content */}
    </>
  )
}
```

### Dynamic Product SEO
```tsx
import SEO from '../components/SEO'
import { generateProductSEO } from '../constants/seo'

function ProductPage({ product }) {
  const productSEO = generateProductSEO(product)
  
  return (
    <>
      <SEO
        title={productSEO.title}
        description={productSEO.description}
        keywords={productSEO.keywords}
        image={productSEO.image}
        url={`/piece/${product.id}`}
        type="product"
        product={productSEO.product}
      />
      {/* Product content */}
    </>
  )
}
```

## SEO Props Reference

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `title` | string | Page title | No (uses default) |
| `description` | string | Meta description | No (uses default) |
| `keywords` | string or string[] | SEO keywords | No (uses default) |
| `image` | string | Open Graph image URL | No (uses default) |
| `imageAlt` | string | Image alt text | No |
| `url` | string | Canonical URL path | No |
| `type` | 'website' \| 'article' \| 'product' | OG type | No (default: 'website') |
| `product` | ProductMeta | Product-specific data | No |
| `noTemplate` | boolean | Skip title template | No (default: false) |

## Brand Constants

```typescript
// From /src/constants/seo.ts
SEO_CONFIG.siteName = 'Khardingclassics'
SEO_CONFIG.siteUrl = 'https://kobysthreads.com'
SEO_CONFIG.author = 'Kobby Harding'
SEO_CONFIG.twitter.site = '@khardingclassics'
SEO_CONFIG.twitter.creator = '@kobbyharding'
```

## Page-Specific SEO

### Homepage
```typescript
PAGE_SEO.home = {
  title: 'Khardingclassics | African Heritage Fashion',
  description: 'Handcrafted African heritage fashion...',
  keywords: 'African fashion, Ghana fashion, Kizomba...',
  image: '/og-image.jpg',
}
```

### Collection
```typescript
PAGE_SEO.collection = {
  title: 'Collection | Khardingclassics',
  description: 'Explore our handcrafted collection...',
  keywords: 'fashion collection, African clothing...',
  image: '/og-collection.jpg',
}
```

### About
```typescript
PAGE_SEO.about = {
  title: 'About Kobby Harding | Khardingclassics',
  description: 'Meet Kobby Harding - TED Speaker...',
  keywords: 'Kobby Harding, African designer...',
  image: '/og-about.jpg',
}
```

### Contact
```typescript
PAGE_SEO.contact = {
  title: 'Contact Us | Khardingclassics',
  description: 'Get in touch with Khardingclassics...',
  keywords: 'contact Khardingclassics...',
  image: '/og-contact.jpg',
}
```

## Helper Functions

### Generate Product SEO
```typescript
import { generateProductSEO } from '../constants/seo'

const product = {
  name: 'Kizomba Sunset Jacket',
  price: 299,
  vibe: 'Bold elegance meets festival energy',
  category: 'Jackets',
  imageUrl: '/products/jacket.jpg'
}

const seo = generateProductSEO(product)
// Returns complete SEO config for product
```

### Get Full URL
```typescript
import { getFullUrl } from '../constants/seo'

const url = getFullUrl('/collection')
// Returns: 'https://kobysthreads.com/collection'
```

### Get Full Image URL
```typescript
import { getFullImageUrl } from '../constants/seo'

const imageUrl = getFullImageUrl('/og-image.jpg')
// Returns: 'https://kobysthreads.com/og-image.jpg'
```

## Meta Tags Generated

### Basic Meta
```html
<title>Khardingclassics | African Heritage Fashion</title>
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta name="author" content="Kobby Harding">
<meta name="theme-color" content="#000000">
<link rel="canonical" href="https://kobysthreads.com/">
```

### Open Graph
```html
<meta property="og:type" content="website">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">
<meta property="og:site_name" content="Khardingclassics">
```

### Twitter Card
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@khardingclassics">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

### Product Schema (JSON-LD)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Kizomba Sunset Jacket",
  "description": "...",
  "image": "...",
  "offers": {
    "@type": "Offer",
    "price": "299",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

## Updating SEO

### Add New Page Type
1. Add to `PAGE_SEO` in `/src/constants/seo.ts`
2. Import in page component
3. Use `<SEO />` component with config

### Modify Default Values
Edit `/src/constants/seo.ts`:
```typescript
export const SEO_CONFIG = {
  defaultTitle: 'Your New Title',
  defaultDescription: 'Your new description',
  // ...
}
```

### Add New Keywords
Update page-specific or default keywords in `/src/constants/seo.ts`

## Testing Tools

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Google Rich Results**: https://search.google.com/test/rich-results
- **Schema Validator**: https://validator.schema.org/

## Common Issues & Solutions

**Meta tags not updating?**
- Clear browser cache
- Hard refresh (Ctrl+F5)
- Check SEO component is imported

**Social media not showing image?**
- Use Facebook Debugger to force re-scrape
- Ensure images are absolute URLs
- Check image dimensions (min 1200x630px)

**Structured data errors?**
- Validate at validator.schema.org
- Check JSON-LD syntax
- Verify required fields present

---

**For detailed testing instructions, see: SEO_TESTING_GUIDE.md**
**For implementation details, see: SEO_IMPLEMENTATION_SUMMARY.md**
