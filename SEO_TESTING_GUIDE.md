# SEO Testing Guide - Khardingclassics

## How to Test SEO Implementation

### 1. View Meta Tags in Browser

**During Development:**
```bash
npm run dev
```

Open browser and navigate to different pages:
- http://localhost:9000/ (Homepage)
- http://localhost:9000/collection (Collection)
- http://localhost:9000/piece/1 (Product page)
- http://localhost:9000/about (About)
- http://localhost:9000/contact (Contact)

**Inspect Meta Tags:**
1. Right-click on page → "View Page Source"
2. Look for `<meta>` tags in `<head>` section
3. Verify title, description, and Open Graph tags

### 2. Browser DevTools Inspection

**Chrome/Edge:**
1. Press F12 or right-click → "Inspect"
2. Go to "Elements" tab
3. Expand `<head>` section
4. Look for `<meta>` tags with properties:
   - `name="description"`
   - `property="og:*"`
   - `name="twitter:*"`

### 3. Test Social Media Sharing

**Facebook Sharing Debugger:**
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter URL: https://kobysthreads.com/
3. Click "Debug" to see how Facebook sees your page
4. Check:
   - Title
   - Description
   - Image preview
   - All Open Graph tags

**Twitter Card Validator:**
1. Go to: https://cards-dev.twitter.com/validator
2. Enter URL: https://kobysthreads.com/
3. Preview how tweets will look with your link
4. Verify Twitter Card metadata

**LinkedIn Post Inspector:**
1. Go to: https://www.linkedin.com/post-inspector/
2. Enter URL: https://kobysthreads.com/
3. See LinkedIn preview
4. Verify Open Graph data

### 4. Test Structured Data

**Google Rich Results Test:**
1. Go to: https://search.google.com/test/rich-results
2. Enter URL or paste HTML
3. Verify structured data (JSON-LD) is recognized
4. Check for:
   - Organization schema (homepage)
   - Product schema (product pages)
   - No errors or warnings

**Schema.org Validator:**
1. Go to: https://validator.schema.org/
2. Paste HTML or enter URL
3. Validate JSON-LD markup

### 5. Test Product Pages

**Verify Dynamic SEO for Products:**
1. Navigate to any product page
2. View page source
3. Check that:
   - Title includes product name
   - Description includes product vibe and price
   - og:image shows product image
   - Product schema includes price, availability

**Test Different Products:**
- `/piece/1` - Kizomba Sunset Jacket
- `/piece/2` - Urban Motion Shirt
- `/piece/3` - Festival Denim
- Verify each has unique metadata

### 6. Mobile Testing

**Mobile Viewport:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone, Android)
4. Check meta viewport tag:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5">
   ```

### 7. SEO Browser Extensions

**Recommended Extensions:**

**Meta SEO Inspector (Chrome):**
- Shows all meta tags in popup
- Validates Open Graph and Twitter Cards
- Checks canonical URLs

**SEO Meta in 1 Click (Chrome/Firefox):**
- Quick overview of all SEO meta tags
- Highlights issues

**Facebook Pixel Helper (Chrome):**
- Validates Open Graph tags
- Shows what Facebook sees

### 8. Google Search Console Testing

**After Deployment:**

1. **Submit Sitemap:**
   - Go to Google Search Console
   - Add property: https://kobysthreads.com
   - Submit sitemap: https://kobysthreads.com/sitemap.xml

2. **URL Inspection Tool:**
   - Test individual URLs
   - Request indexing
   - Check mobile usability

3. **Rich Results Test:**
   - Test product pages for rich snippets
   - Verify structured data

### 9. Lighthouse SEO Audit

**Run Lighthouse:**
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "SEO" category
4. Click "Generate report"

**Target Scores:**
- SEO: 100/100
- Check for:
  - Meta description ✅
  - Page title ✅
  - Crawlable links ✅
  - robots.txt ✅

### 10. Test Checklist

**Homepage:**
- [ ] Title: "Khardingclassics | African Heritage Fashion"
- [ ] Meta description present
- [ ] Open Graph image: /og-image.jpg
- [ ] Twitter Card type: summary_large_image
- [ ] Structured data: Organization schema

**Collection Page:**
- [ ] Title: "Collection | Khardingclassics"
- [ ] Unique description
- [ ] Keywords include "fashion collection"
- [ ] Open Graph type: website

**Product Pages:**
- [ ] Title: "{Product Name} | Khardingclassics"
- [ ] Description includes product vibe and price
- [ ] Open Graph image: Product image URL
- [ ] Product schema with price
- [ ] Availability status (in stock/out of stock)
- [ ] Product category in schema

**About Page:**
- [ ] Title: "About Kobby Harding | Khardingclassics"
- [ ] Biography description
- [ ] Open Graph type: article
- [ ] Keywords include "Kobby Harding", "TED speaker"

**Contact Page:**
- [ ] Title: "Contact Us | Khardingclassics"
- [ ] Location mentioned (Bangkok, Thailand)
- [ ] Business inquiry keywords

### 11. Debugging Tips

**If meta tags don't appear:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check browser console for errors
4. Verify SEO component is imported

**If Open Graph not working:**
1. Use Facebook Debugger to force re-scrape
2. Check image URLs are absolute (not relative)
3. Verify image dimensions (min 1200x630px recommended)
4. Check robots.txt doesn't block crawlers

**If structured data invalid:**
1. Check JSON-LD syntax in page source
2. Validate at validator.schema.org
3. Ensure all required properties present
4. Check for typos in schema types

### 12. Performance Monitoring

**Monitor SEO Performance:**
1. Google Search Console - Search performance
2. Google Analytics - Organic traffic
3. Click-through rates from search results
4. Social media shares and engagement

---

## Quick Test Commands

**View all pages with curl:**
```bash
# Homepage meta
curl -s http://localhost:9000 | grep -i "<meta"

# Product page meta
curl -s http://localhost:9000/piece/1 | grep -i "<meta"
```

**Check structured data:**
```bash
# Extract JSON-LD
curl -s http://localhost:9000 | grep -A20 'application/ld+json'
```

**Test build:**
```bash
npm run build
npm run preview
```

---

**Remember:** After deployment, always test with actual production URLs for most accurate results!
