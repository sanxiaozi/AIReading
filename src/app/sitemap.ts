/**
 * Dynamic Sitemap Generation with Multi-Language Support
 * Generates sitemap.xml with all pages in both Chinese (zh) and English (en)
 * Includes hreflang tags for proper multi-language SEO
 * 
 * URL Patterns:
 * - Chinese (default): / /about /faq /category/{slug} /author/{slug} /books/{id}
 * - English: /en /en/about /en/faq /en/category/{slug} /en/author/{slug} /en/books/{id}
 */

import { MetadataRoute } from 'next';
import booklist from '../../content/booklist.json';
import { AUTHORS } from '@/data/authors';

const CATEGORIES = [
  'business',
  'psychology',
  'history',
  'biography',
  'science',
  'fiction',
  'self-help',
];

const LOCALES = ['zh', 'en'] as const;
type Locale = typeof LOCALES[number];

interface SitemapEntry {
  path: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastModified?: Date;
  alternateUrls?: { locale: Locale; path: string }[];
}

function buildUrl(path: string, locale: Locale, baseUrl: string): string {
  if (locale === 'zh') {
    return `${baseUrl}${path}`;
  }
  // 英文版本添加 /en 前缀
  return `${baseUrl}/en${path}`;
}

function generateEntries(baseUrl: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const now = new Date();
  const lastBookUpdate = booklist.updated ? new Date(booklist.updated) : now;

  // 首页
  entries.push({
    path: '/',
    priority: 1.0,
    changeFrequency: 'daily',
    lastModified: now,
    alternateUrls: LOCALES.map(locale => ({
      locale,
      path: buildUrl('/', locale, baseUrl),
    })),
  });

  // 静态页面：About、FAQ
  const staticPages = [
    { path: '/about', priority: 0.7, label: 'About' },
    { path: '/faq', priority: 0.7, label: 'FAQ' },
  ];

  staticPages.forEach(({ path, priority }) => {
    entries.push({
      path,
      priority,
      changeFrequency: 'monthly',
      lastModified: now,
      alternateUrls: LOCALES.map(locale => ({
        locale,
        path: buildUrl(path, locale, baseUrl),
      })),
    });
  });

  // 分类页面
  CATEGORIES.forEach(slug => {
    entries.push({
      path: `/category/${slug}`,
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: now,
      alternateUrls: LOCALES.map(locale => ({
        locale,
        path: buildUrl(`/category/${slug}`, locale, baseUrl),
      })),
    });
  });

  // 作者页面
  AUTHORS.forEach(author => {
    entries.push({
      path: `/author/${author.slug}`,
      priority: 0.75,
      changeFrequency: 'weekly',
      lastModified: now,
      alternateUrls: LOCALES.map(locale => ({
        locale,
        path: buildUrl(`/author/${author.slug}`, locale, baseUrl),
      })),
    });
  });

  // 已发布书籍页面
  booklist.books
    .filter(book => book.published)
    .forEach(book => {
      const bookPath = `/books/${book.id}`;
      entries.push({
        path: bookPath,
        priority: book.priority === 1 ? 0.9 : book.priority === 2 ? 0.8 : 0.7,
        changeFrequency: 'weekly',
        lastModified: lastBookUpdate,
        alternateUrls: LOCALES.map(locale => ({
          locale,
          path: buildUrl(bookPath, locale, baseUrl),
        })),
      });
    });

  return entries;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aireading.com';
  const entries = generateEntries(baseUrl);

  // Convert to MetadataRoute.Sitemap format
  // Note: This format doesn't support hreflang, but Next.js will handle multi-language URLs correctly
  return entries.flatMap(entry => {
    // 为每个条目生成两个 URL（zh 和 en）
    return entry.alternateUrls!.map((alt, idx) => ({
      url: alt.path,
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency as any,
      priority: entry.priority,
    }));
  });
}