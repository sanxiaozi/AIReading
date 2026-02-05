/**
 * Schema.org Structured Data Components
 * 生成 JSON-LD 格式的结构化数据，提升 SEO 和搜索引擎理解度
 */

import Script from 'next/script'

/**
 * Book Schema Interface
 * 基于 Schema.org Book 类型
 */
export interface BookSchema {
  name: string
  author: {
    name: string
    url?: string
  }
  description: string
  bookFormat?: 'AudiobookFormat' | 'EBook' | 'Hardcover' | 'Paperback'
  genre?: string
  inLanguage: string[]
  url: string
  image?: string
  isbn?: string
  numberOfPages?: number
  publisher?: {
    name: string
    url?: string
  }
  datePublished?: string
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
    bestRating?: number
    worstRating?: number
  }
  offers?: {
    price: string
    priceCurrency: string
    availability?: string
  }
}

/**
 * Book Schema Component
 * 为书籍详情页生成 JSON-LD
 */
export function BookStructuredData({ book }: { book: BookSchema }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.name,
    author: {
      '@type': 'Person',
      name: book.author.name,
      ...(book.author.url && { url: book.author.url }),
    },
    description: book.description,
    bookFormat: book.bookFormat ? `https://schema.org/${book.bookFormat}` : 'https://schema.org/AudiobookFormat',
    genre: book.genre,
    inLanguage: book.inLanguage,
    url: book.url,
    ...(book.image && { image: book.image }),
    ...(book.isbn && { isbn: book.isbn }),
    ...(book.numberOfPages && { numberOfPages: book.numberOfPages }),
    ...(book.publisher && {
      publisher: {
        '@type': 'Organization',
        name: book.publisher.name,
        ...(book.publisher.url && { url: book.publisher.url }),
      },
    }),
    ...(book.datePublished && { datePublished: book.datePublished }),
    ...(book.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: book.aggregateRating.ratingValue,
        reviewCount: book.aggregateRating.reviewCount,
        bestRating: book.aggregateRating.bestRating || 5,
        worstRating: book.aggregateRating.worstRating || 1,
      },
    }),
    ...(book.offers && {
      offers: {
        '@type': 'Offer',
        price: book.offers.price,
        priceCurrency: book.offers.priceCurrency,
        availability: book.offers.availability || 'https://schema.org/InStock',
      },
    }),
  }

  return (
    <Script
      id="book-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="beforeInteractive"
    />
  )
}

/**
 * Website Schema Component
 * 用于首页和主要落地页
 */
export interface WebsiteSchema {
  name: string
  url: string
  description: string
  searchUrl?: string
  logo?: string
  sameAs?: string[] // 社交媒体链接
}

export function WebsiteStructuredData({ site }: { site: WebsiteSchema }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
    ...(site.logo && {
      logo: {
        '@type': 'ImageObject',
        url: site.logo,
      },
    }),
    ...(site.searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: site.searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
    ...(site.sameAs && { sameAs: site.sameAs }),
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="beforeInteractive"
    />
  )
}

/**
 * Organization Schema Component
 * 公司/组织信息
 */
export interface OrganizationSchema {
  name: string
  url: string
  logo: string
  description?: string
  sameAs?: string[]
  contactPoint?: {
    contactType: string
    email?: string
    telephone?: string
  }
}

export function OrganizationStructuredData({ org }: { org: OrganizationSchema }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: {
      '@type': 'ImageObject',
      url: org.logo,
    },
    ...(org.description && { description: org.description }),
    ...(org.sameAs && { sameAs: org.sameAs }),
    ...(org.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: org.contactPoint.contactType,
        ...(org.contactPoint.email && { email: org.contactPoint.email }),
        ...(org.contactPoint.telephone && { telephone: org.contactPoint.telephone }),
      },
    }),
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="beforeInteractive"
    />
  )
}

/**
 * Breadcrumb Schema Interface
 */
export interface BreadcrumbItem {
  name: string
  url: string
  position: number
}

/**
 * Breadcrumb List Schema Component
 * 面包屑导航结构化数据
 */
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="beforeInteractive"
    />
  )
}

/**
 * Article Schema Interface
 * 用于博客文章或长篇内容
 */
export interface ArticleSchema {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: {
    name: string
    url?: string
  }
  publisher: {
    name: string
    logo: string
  }
  url: string
}

export function ArticleStructuredData({ article }: { article: ArticleSchema }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author.name,
      ...(article.author.url && { url: article.author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: article.publisher.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  }

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="beforeInteractive"
    />
  )
}

/**
 * FAQPage Schema Interface
 * 用于常见问题页面
 */
export interface FAQItem {
  question: string
  answer: string
}

export function FAQStructuredData({ faqs }: { faqs: FAQItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="beforeInteractive"
    />
  )
}

/**
 * ItemList Schema Component
 * 用于列表页面（如分类页、搜索结果）
 */
export interface ListItem {
  name: string
  url: string
  image?: string
  position: number
}

export function ItemListStructuredData({ items, listName }: { items: ListItem[]; listName?: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(listName && { name: listName }),
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      url: item.url,
      name: item.name,
      ...(item.image && { image: item.image }),
    })),
  }

  return (
    <Script
      id="itemlist-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="beforeInteractive"
    />
  )
}
