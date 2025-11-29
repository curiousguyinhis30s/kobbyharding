/**
 * SEO Constants for Khardingclassics
 * Centralized configuration for metadata, Open Graph, and Twitter Card tags
 */

export const SEO_CONFIG = {
  // Site information
  siteName: 'Khardingclassics',
  siteUrl: 'https://kobysthreads.com',

  // Default metadata
  defaultTitle: 'Khardingclassics | African Heritage Fashion',
  defaultDescription: 'Handcrafted African heritage fashion with modern expression. Limited edition pieces designed by Kobby Harding in Ghana, perfect for Kizomba and Urban Kiz festivals.',
  defaultKeywords: 'Khardingclassics, African fashion, Ghana fashion, Kobby Harding, Kizomba fashion, Urban Kiz, handcrafted clothing, African heritage, dance fashion, festival wear, sustainable fashion',

  // Social media
  social: {
    instagram: '@khardingclassics',
    facebook: 'khardingclassics',
  },

  // Default Open Graph image
  defaultImage: '/og-image.jpg',
  defaultImageAlt: 'Khardingclassics - African Heritage Fashion',

  // Author
  author: 'Kobby Harding',

  // Theme
  themeColor: '#000000',

  // Locale
  locale: 'en_US',

  // Twitter
  twitter: {
    card: 'summary_large_image' as const,
    site: '@khardingclassics',
    creator: '@kobbyharding',
  },
} as const

/**
 * Page-specific SEO configurations
 */
export const PAGE_SEO = {
  home: {
    title: 'Khardingclassics | African Heritage Fashion',
    description: 'Handcrafted African heritage fashion with modern expression. Limited edition pieces from Ghana, perfect for Kizomba and Urban Kiz festivals worldwide.',
    keywords: 'African fashion, Ghana fashion, Kizomba clothing, dance fashion, handcrafted clothing, limited edition fashion',
    image: '/og-image.jpg',
  },

  collection: {
    title: 'Collection | Khardingclassics',
    description: 'Explore our handcrafted collection of African-inspired fashion pieces. Limited editions designed for movement, culture, and self-expression.',
    keywords: 'fashion collection, African clothing, Kizomba wear, festival fashion, dance clothing',
    image: '/og-collection.jpg',
  },

  about: {
    title: 'About Kobby Harding | Khardingclassics',
    description: 'Meet Kobby Harding - TED Speaker, Afro dance instructor for 15+ years, and founder of Khardingclassics. Spreading love and positivity through fashion.',
    keywords: 'Kobby Harding, African designer, Kizomba teacher, TED speaker, fashion designer Ghana',
    image: '/og-about.jpg',
  },

  contact: {
    title: 'Contact Us | Khardingclassics',
    description: 'Get in touch with Khardingclassics for custom orders, festival try-ons, collaborations, or general inquiries. Based in Bangkok, Thailand.',
    keywords: 'contact Khardingclassics, custom fashion orders, festival try-on appointments',
    image: '/og-contact.jpg',
  },

  festival: {
    title: 'Festival Collection | Khardingclassics',
    description: 'Festival-ready fashion for Kizomba and Urban Kiz dancers. Book a try-on appointment at upcoming festivals across Asia.',
    keywords: 'festival fashion, Kizomba festival, Urban Kiz wear, dance festival clothing',
    image: '/og-festival.jpg',
  },
} as const

/**
 * Generate product-specific SEO metadata
 */
export const generateProductSEO = (product: {
  name: string
  price: number
  vibe: string
  category?: string
  imageUrl: string
}) => ({
  title: `${product.name} | Khardingclassics`,
  description: `${product.vibe} - ${product.name} by Khardingclassics. $${product.price}. Handcrafted African heritage fashion, perfect for Kizomba and Urban Kiz festivals.`,
  keywords: `${product.name}, ${product.category || 'fashion'}, African fashion, dance wear, festival fashion, ${product.vibe}`,
  image: product.imageUrl,
  type: 'product' as const,
  product: {
    price: product.price,
    currency: 'USD',
    availability: 'in stock',
    category: product.category || 'Apparel',
  },
})

/**
 * Helper to construct full URL
 */
export const getFullUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SEO_CONFIG.siteUrl}${cleanPath}`
}

/**
 * Helper to construct full image URL
 */
export const getFullImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) return imagePath
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${SEO_CONFIG.siteUrl}${cleanPath}`
}
