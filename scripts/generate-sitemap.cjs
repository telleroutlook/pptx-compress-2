const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const BASE_URL = 'https://byteslim.com';
const SITEMAP_PATH = path.resolve(__dirname, '../dist/sitemap.xml');

const routes = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date(),
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        title: 'ByteSlim - Free Online Tool',
        caption: 'Free online file compression tools',
        geo_location: 'Worldwide',
        license: `${BASE_URL}/license`
      }
    ]
  },
  {
    url: '/pptx-compressor',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date(),
    images: [
      {
        url: `${BASE_URL}/pptx-compressor-preview.jpg`,
        title: 'PPTX Compressor Tool',
        caption: 'Compress PowerPoint files online',
        geo_location: 'Worldwide',
        license: `${BASE_URL}/license`
      }
    ]
  },
  {
    url: '/audio-compressor',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date(),
    images: [
      {
        url: `${BASE_URL}/audio-compressor-preview.jpg`,
        title: 'Audio Compressor Tool',
        caption: 'Compress audio files online',
        geo_location: 'Worldwide',
        license: `${BASE_URL}/license`
      }
    ]
  },
  {
    url: '/privacy',
    changefreq: 'monthly',
    priority: 0.5,
    lastmod: new Date()
  },
  {
    url: '/terms',
    changefreq: 'monthly',
    priority: 0.5,
    lastmod: new Date()
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date()
  },
  {
    url: '/faq',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date()
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date()
  },
  {
    url: '/blog',
    changefreq: 'daily',
    priority: 0.8,
    lastmod: new Date()
  },
  {
    url: '/support',
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date()
  }
];

function generateSitemap() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
                            http://www.google.com/schemas/sitemap-image/1.1
                            http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd
                            http://www.google.com/schemas/sitemap-video/1.1
                            http://www.google.com/schemas/sitemap-video/1.1/sitemap-video.xsd
                            http://www.google.com/schemas/sitemap-news/0.9
                            http://www.google.com/schemas/sitemap-news/0.9/sitemap-news.xsd">
${routes.map(route => {
  const lastmod = format(route.lastmod, 'yyyy-MM-dd');
  const images = route.images ? route.images.map(image => `
    <image:image>
      <image:loc>${image.url}</image:loc>
      <image:title>${image.title}</image:title>
      <image:caption>${image.caption}</image:caption>
      <image:geo_location>${image.geo_location}</image:geo_location>
      <image:license>${image.license}</image:license>
    </image:image>`).join('') : '';
  
  return `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${images}
  </url>`;
}).join('\n')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log('Sitemap generated successfully!');
}

generateSitemap(); 