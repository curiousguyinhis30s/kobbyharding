#!/usr/bin/env node

/**
 * Build Script: Generate Sitemap
 *
 * This script generates sitemap.xml from product data during build process.
 * Run with: node scripts/generateSitemap.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import product data
const mockDataPath = path.resolve(__dirname, '../src/data/mockData.ts');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf-8');

// Extract only mockPieces array content
const productsMatch = mockDataContent.match(/export const mockPieces = \[([\s\S]*?)\n\]/);

if (!productsMatch) {
  console.error('❌ Could not find mockPieces in mockData.ts');
  process.exit(1);
}

const mockPiecesContent = productsMatch[1];

// Split into individual product objects and parse each one
const productObjects = mockPiecesContent.split(/},\s*{/).map((obj, index, arr) => {
  // Add back the braces for proper parsing
  if (index === 0) obj = obj + '}';
  else if (index === arr.length - 1) obj = '{' + obj;
  else obj = '{' + obj + '}';
  return obj;
});

const products = productObjects.map(obj => {
  const idMatch = obj.match(/id: '([^']+)'/);
  const nameMatch = obj.match(/name: '([^']+)'/);
  const imageMatch = obj.match(/imageUrl: '([^']+)'/);

  return {
    id: idMatch?.[1] || '',
    name: nameMatch?.[1] || '',
    imageUrl: imageMatch?.[1] || '',
  };
}).filter(p => p.id && p.name); // Filter out any invalid entries

// Configuration
const domain = 'https://khardingclassics.com';
const currentDate = new Date().toISOString().split('T')[0];

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/collection', changefreq: 'daily', priority: 0.9 },
  { path: '/about', changefreq: 'monthly', priority: 0.7 },
  { path: '/contact', changefreq: 'monthly', priority: 0.6 },
  { path: '/festival', changefreq: 'weekly', priority: 0.7 },
];

// Escape XML
function escapeXml(unsafe) {
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

// Generate sitemap
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
sitemap += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n`;

// Static pages
sitemap += `  <!-- Static Pages -->\n`;
staticPages.forEach(page => {
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${domain}${page.path}</loc>\n`;
  sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
  sitemap += `    <priority>${page.priority.toFixed(1)}</priority>\n`;
  sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
  sitemap += `  </url>\n`;
});

// Product pages
sitemap += `\n  <!-- Product Pages -->\n`;
products.forEach(product => {
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${domain}/piece/${product.id}</loc>\n`;
  sitemap += `    <changefreq>weekly</changefreq>\n`;
  sitemap += `    <priority>0.8</priority>\n`;
  sitemap += `    <lastmod>${currentDate}</lastmod>\n`;

  if (product.imageUrl) {
    sitemap += `    <image:image>\n`;
    sitemap += `      <image:loc>${domain}${product.imageUrl}</image:loc>\n`;
    sitemap += `      <image:title>${escapeXml(product.name)} - Kharding Classics</image:title>\n`;
    sitemap += `    </image:image>\n`;
  }

  sitemap += `  </url>\n`;
});

sitemap += `\n</urlset>\n`;

// Save sitemap
const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf-8');

console.log('✅ Sitemap generated successfully!');
console.log(`📍 Location: ${outputPath}`);
console.log(`📊 Total URLs: ${staticPages.length + products.length}`);
console.log(`   - Static pages: ${staticPages.length}`);
console.log(`   - Product pages: ${products.length}`);
console.log(`📅 Last updated: ${currentDate}`);
