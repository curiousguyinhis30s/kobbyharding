/**
 * Dynamic Sitemap Generator for Kharding Classics
 *
 * This utility generates sitemap.xml dynamically from product data.
 * Use this during build process to ensure sitemap stays up-to-date with current products.
 */

import { mockPieces } from '../data/mockData';

interface SitemapUrl {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
  imageUrl?: string;
  imageTitle?: string;
}

interface SitemapConfig {
  domain: string;
  staticPages: Array<Omit<SitemapUrl, 'loc'> & { path: string }>;
}

const config: SitemapConfig = {
  domain: 'https://khardingclassics.com',
  staticPages: [
    {
      path: '/',
      changefreq: 'weekly',
      priority: 1.0,
    },
    {
      path: '/collection',
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      path: '/about',
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      path: '/contact',
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      path: '/festival',
      changefreq: 'weekly',
      priority: 0.7,
    },
  ],
};

/**
 * Get current date in ISO format for lastmod field
 */
function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Generate a single URL entry for the sitemap
 */
function generateUrlEntry(url: SitemapUrl): string {
  const lastmod = url.lastmod || getCurrentDate();

  let entry = `  <url>\n`;
  entry += `    <loc>${escapeXml(url.loc)}</loc>\n`;
  entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
  entry += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
  entry += `    <lastmod>${lastmod}</lastmod>\n`;

  if (url.imageUrl && url.imageTitle) {
    entry += `    <image:image>\n`;
    entry += `      <image:loc>${escapeXml(url.imageUrl)}</image:loc>\n`;
    entry += `      <image:title>${escapeXml(url.imageTitle)}</image:title>\n`;
    entry += `    </image:image>\n`;
  }

  entry += `  </url>\n`;

  return entry;
}

/**
 * Generate product URLs from mockData
 */
function generateProductUrls(): SitemapUrl[] {
  return mockPieces.map(piece => ({
    loc: `${config.domain}/piece/${piece.id}`,
    changefreq: 'weekly' as const,
    priority: 0.8,
    lastmod: getCurrentDate(),
    imageUrl: `${config.domain}${piece.imageUrl}`,
    imageTitle: `${piece.name} - Kharding Classics`,
  }));
}

/**
 * Generate static page URLs
 */
function generateStaticUrls(): SitemapUrl[] {
  return config.staticPages.map(page => ({
    loc: `${config.domain}${page.path}`,
    changefreq: page.changefreq,
    priority: page.priority,
    lastmod: getCurrentDate(),
  }));
}

/**
 * Generate complete sitemap XML
 */
export function generateSitemap(): string {
  const staticUrls = generateStaticUrls();
  const productUrls = generateProductUrls();
  const allUrls = [...staticUrls, ...productUrls];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  sitemap += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n`;

  // Add comment sections for clarity
  sitemap += `  <!-- Static Pages -->\n`;
  staticUrls.forEach(url => {
    sitemap += generateUrlEntry(url);
  });

  sitemap += `\n  <!-- Product Pages -->\n`;
  productUrls.forEach(url => {
    sitemap += generateUrlEntry(url);
  });

  sitemap += `\n</urlset>\n`;

  return sitemap;
}

/**
 * Generate sitemap and save to public directory
 * Use this in a build script or pre-build hook
 */
export async function saveSitemap(outputPath: string = 'public/sitemap.xml'): Promise<void> {
  const sitemapContent = generateSitemap();

  // In a Node.js environment (build script)
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');

    const fullPath = path.resolve(process.cwd(), outputPath);
    fs.writeFileSync(fullPath, sitemapContent, 'utf-8');
    console.log(`✅ Sitemap generated successfully at ${fullPath}`);
    console.log(`📊 Total URLs: ${mockPieces.length + config.staticPages.length}`);
  }
}

/**
 * Get sitemap statistics
 */
export function getSitemapStats() {
  return {
    totalProducts: mockPieces.length,
    totalStaticPages: config.staticPages.length,
    totalUrls: mockPieces.length + config.staticPages.length,
    domain: config.domain,
    lastGenerated: getCurrentDate(),
  };
}

/**
 * Validate sitemap URLs
 * Check for broken links or missing data
 */
export function validateSitemap(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for products without images
  mockPieces.forEach(piece => {
    if (!piece.imageUrl) {
      errors.push(`Product ${piece.id} is missing imageUrl`);
    }
    if (!piece.name) {
      errors.push(`Product ${piece.id} is missing name`);
    }
  });

  // Check for duplicate product IDs
  const ids = mockPieces.map(p => p.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate product IDs found: ${duplicates.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Export for use in build scripts
export default {
  generateSitemap,
  saveSitemap,
  getSitemapStats,
  validateSitemap,
};
