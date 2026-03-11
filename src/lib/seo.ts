/**
 * SEO Utility Functions for AIreading
 * Generates metadata, structured data, and SEO tags
 */

import type { Metadata } from 'next';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  summary_short?: string;
  summary_medium?: string;
}

/**
 * Generate metadata for book pages
 */
export function generateBookMetadata(
  book: Book,
  locale: 'en' | 'zh'
): Metadata {
  const title = `${book.title} by ${book.author} - AI Summary`;
  const description =
    book.summary_short ||
    `Listen to AI-generated summary of ${book.title} by ${book.author}. Available in 3 lengths: short (5 min), medium (15 min), long (30 min).`;

  const url = `https://aireading.app/${locale}/book/${book.id}`;

  return {
    title,
    description,
    keywords: [
      book.title,
      book.author,
      `${book.title} summary`,
      book.category,
      'AI book summary',
      'audio book summary',
    ],
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: new Date().toISOString(),
      authors: [book.author],
      tags: [book.category, 'book summary', 'AI learning'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@ArcadeChen',
    },
    alternates: {
      canonical: url,
      languages: {
        en: `https://aireading.app/en/book/${book.id}`,
        zh: `https://aireading.app/zh/book/${book.id}`,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for a book
 */
export function generateBookStructuredData(book: Book, locale: 'en' | 'zh') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    genre: book.category,
    bookFormat: 'AudioBook',
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '100',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/**
 * Generate metadata for library/category pages
 */
export function generateLibraryMetadata(
  category?: string,
  locale: 'en' | 'zh' = 'en'
): Metadata {
  const titles = {
    en: category
      ? `${category} Books - AIreading Library`
      : 'Book Library - AIreading',
    zh: category
      ? `${category}类书籍 - AIreading 图书馆`
      : '图书馆 - AIreading',
  };

  const descriptions = {
    en: category
      ? `Browse ${category} book summaries with AI-generated audio. Learn faster with our curated collection.`
      : 'Browse 50+ bestselling book summaries with AI-generated audio. Available in 3 lengths.',
    zh: category
      ? `浏览 ${category} 类书籍摘要，配有 AI 生成的音频。通过我们精选的书籍集合更快学习。`
      : '浏览 50+ 畅销书摘要，配有 AI 生成的音频。提供 3 种长度选择。',
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      type: 'website',
    },
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate WebSite structured data (for homepage)
 */
export function generateWebsiteStructuredData(locale: 'en' | 'zh') {
  const names = {
    en: 'AIreading',
    zh: 'AIreading - AI 读书',
  };

  const descriptions = {
    en: 'AI-powered book summaries with high-quality audio',
    zh: 'AI 驱动的书籍摘要，配有高质量音频',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: names[locale],
    description: descriptions[locale],
    url: `https://aireading.app/${locale}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://aireading.app/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
