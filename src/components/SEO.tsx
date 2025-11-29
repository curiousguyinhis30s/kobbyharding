import { useEffect } from 'react'
import { SEO_CONFIG, getFullUrl, getFullImageUrl } from '../constants/seo'

export interface SEOProps {
  /**
   * Page title (will be appended with site name if not included)
   */
  title?: string

  /**
   * Meta description for the page
   */
  description?: string

  /**
   * Keywords for the page (comma-separated or array)
   */
  keywords?: string | string[]

  /**
   * Image URL for Open Graph and Twitter Card
   */
  image?: string

  /**
   * Alternative text for the image
   */
  imageAlt?: string

  /**
   * Canonical URL for the page
   */
  url?: string

  /**
   * Open Graph type (default: 'website')
   */
  type?: 'website' | 'article' | 'product'

  /**
   * Additional product metadata (for product pages)
   */
  product?: {
    price?: number
    currency?: string
    availability?: string
    category?: string
  }

  /**
   * Disable default title template
   */
  noTemplate?: boolean

  /**
   * Additional meta tags
   */
  additionalMetaTags?: Array<{
    name?: string
    property?: string
    content: string
  }>
}

/**
 * SEO Component
 * Manages all meta tags for SEO, Open Graph, and Twitter Cards
 * Uses direct DOM manipulation for dynamic updates
 */
const SEO = ({
  title,
  description = SEO_CONFIG.defaultDescription,
  keywords = SEO_CONFIG.defaultKeywords,
  image = SEO_CONFIG.defaultImage,
  imageAlt = SEO_CONFIG.defaultImageAlt,
  url,
  type = 'website',
  product,
  noTemplate = false,
  additionalMetaTags = [],
}: SEOProps) => {
  useEffect(() => {
    // Construct full title
    const fullTitle = noTemplate
      ? title || SEO_CONFIG.defaultTitle
      : title
      ? title.includes(SEO_CONFIG.siteName)
        ? title
        : `${title} | ${SEO_CONFIG.siteName}`
      : SEO_CONFIG.defaultTitle

    // Construct full URLs
    const fullUrl = url ? getFullUrl(url) : SEO_CONFIG.siteUrl
    const fullImageUrl = getFullImageUrl(image)

    // Process keywords
    const keywordString = Array.isArray(keywords) ? keywords.join(', ') : keywords

    // Update document title
    document.title = fullTitle

    // Helper to update or create meta tag
    const updateMetaTag = (selector: string, content: string) => {
      let tag = document.querySelector(selector)
      if (!tag) {
        tag = document.createElement('meta')
        const [attr, value] = selector.split('=')
        const cleanAttr = attr.replace('[', '').replace(']', '')
        const cleanValue = value.replace(/['"]/g, '')
        tag.setAttribute(cleanAttr, cleanValue)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    // Update or create link tag
    const updateLinkTag = (rel: string, href: string) => {
      let tag = document.querySelector(`link[rel="${rel}"]`)
      if (!tag) {
        tag = document.createElement('link')
        tag.setAttribute('rel', rel)
        document.head.appendChild(tag)
      }
      tag.setAttribute('href', href)
    }

    // Basic meta tags
    updateMetaTag('[name="description"]', description)
    updateMetaTag('[name="keywords"]', keywordString)
    updateMetaTag('[name="author"]', SEO_CONFIG.author)
    updateMetaTag('[name="theme-color"]', SEO_CONFIG.themeColor)

    // Canonical URL
    updateLinkTag('canonical', fullUrl)

    // Open Graph tags
    updateMetaTag('[property="og:type"]', type)
    updateMetaTag('[property="og:title"]', fullTitle)
    updateMetaTag('[property="og:description"]', description)
    updateMetaTag('[property="og:image"]', fullImageUrl)
    updateMetaTag('[property="og:image:alt"]', imageAlt)
    updateMetaTag('[property="og:url"]', fullUrl)
    updateMetaTag('[property="og:site_name"]', SEO_CONFIG.siteName)
    updateMetaTag('[property="og:locale"]', SEO_CONFIG.locale)

    // Twitter Card tags
    updateMetaTag('[name="twitter:card"]', SEO_CONFIG.twitter.card)
    updateMetaTag('[name="twitter:site"]', SEO_CONFIG.twitter.site)
    updateMetaTag('[name="twitter:creator"]', SEO_CONFIG.twitter.creator)
    updateMetaTag('[name="twitter:title"]', fullTitle)
    updateMetaTag('[name="twitter:description"]', description)
    updateMetaTag('[name="twitter:image"]', fullImageUrl)
    updateMetaTag('[name="twitter:image:alt"]', imageAlt)

    // Product-specific tags (Schema.org via Open Graph)
    if (type === 'product' && product) {
      if (product.price) {
        updateMetaTag('[property="product:price:amount"]', product.price.toString())
        updateMetaTag('[property="product:price:currency"]', product.currency || 'USD')
      }
      if (product.availability) {
        updateMetaTag('[property="product:availability"]', product.availability)
      }
      if (product.category) {
        updateMetaTag('[property="product:category"]', product.category)
      }
    }

    // Additional meta tags
    additionalMetaTags.forEach((tag) => {
      if (tag.name) {
        updateMetaTag(`[name="${tag.name}"]`, tag.content)
      } else if (tag.property) {
        updateMetaTag(`[property="${tag.property}"]`, tag.content)
      }
    })

    // Update structured data (JSON-LD)
    updateStructuredData({
      type,
      title: fullTitle,
      description,
      image: fullImageUrl,
      url: fullUrl,
      product,
    })
  }, [
    title,
    description,
    keywords,
    image,
    imageAlt,
    url,
    type,
    product,
    noTemplate,
    additionalMetaTags,
  ])

  return null
}

/**
 * Helper function to update structured data (JSON-LD)
 */
const updateStructuredData = ({
  type,
  title,
  description,
  image,
  url,
  product,
}: {
  type: string
  title: string
  description: string
  image: string
  url: string
  product?: SEOProps['product']
}) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }

  // Create base structured data
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': type === 'product' ? 'Product' : 'WebPage',
    name: title,
    description,
    image,
    url,
  }

  // Add product-specific data
  if (type === 'product' && product) {
    structuredData.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability: `https://schema.org/${product.availability === 'in stock' ? 'InStock' : 'OutOfStock'}`,
    }
    if (product.category) {
      structuredData.category = product.category
    }
  }

  // Add organization data for homepage
  if (type === 'website' && url === SEO_CONFIG.siteUrl) {
    structuredData['@type'] = 'Organization'
    structuredData.name = SEO_CONFIG.siteName
    structuredData.description = description
    structuredData.url = url
    structuredData.logo = image
    structuredData.founder = {
      '@type': 'Person',
      name: SEO_CONFIG.author,
    }
  }

  // Inject new structured data
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)
}

export default SEO
