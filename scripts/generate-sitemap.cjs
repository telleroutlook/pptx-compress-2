const fs = require('fs');
const path = require('path');

const routes = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/pptx-compressor', changefreq: 'weekly', priority: 0.9 },
  { url: '/audio-compressor', changefreq: 'weekly', priority: 0.9 },
  { url: '/privacy', changefreq: 'monthly', priority: 0.5 },
  { url: '/terms', changefreq: 'monthly', priority: 0.5 },
  { url: '/about', changefreq: 'monthly', priority: 0.7 },
  { url: '/faq', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
];

const hostname = 'https://byteslim.com';
const lastmod = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
                            http://www.google.com/schemas/sitemap-image/1.1
                            http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
${routes.map(route => `  <url>
    <loc>${hostname}${route.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Ensure the dist directory exists
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write the sitemap
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully!'); 