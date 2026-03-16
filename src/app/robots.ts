import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/login/', '/register/', '/digest', '/digest-data.json'],
      },
      // Block AI training crawlers
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ClaudeBot',
        disallow: ['/'],
      },
      {
        userAgent: 'Google-Extended',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'Bytespider',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://aireading.com/sitemap.xml',
  };
}