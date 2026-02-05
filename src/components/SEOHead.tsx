import type { Metadata } from 'next'

/**
 * SEO Metadata Configuration Interface
 * 支持 Open Graph, Twitter Card 和基础 SEO 标签
 */
export interface SEOProps {
  // 基础 SEO
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  
  // Open Graph
  ogType?: 'website' | 'article' | 'book' | 'profile'
  ogImage?: string
  ogImageAlt?: string
  ogImageWidth?: number
  ogImageHeight?: number
  
  // Twitter Card
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterSite?: string
  twitterCreator?: string
  twitterImage?: string
  
  // 语言和本地化
  locale?: string
  alternates?: {
    languages?: Record<string, string>
    canonical?: string
  }
  
  // Robots
  robots?: {
    index?: boolean
    follow?: boolean
    nocache?: boolean
    googleBot?: {
      index?: boolean
      follow?: boolean
    }
  }
  
  // 其他
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

/**
 * 生成 Next.js Metadata 对象
 * 用于 App Router 的 metadata 导出
 */
export function generateMetadata(props: SEOProps): Metadata {
  const {
    title,
    description,
    keywords,
    canonical,
    ogType = 'website',
    ogImage,
    ogImageAlt,
    ogImageWidth = 1200,
    ogImageHeight = 630,
    twitterCard = 'summary_large_image',
    twitterSite = '@aireading_app',
    twitterCreator,
    twitterImage,
    locale = 'zh_CN',
    alternates,
    robots,
    author,
    publishedTime,
    modifiedTime,
  } = props

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.join(', '),
    authors: author ? [{ name: author }] : undefined,
    
    // Open Graph
    openGraph: {
      title,
      description,
      type: ogType,
      locale,
      url: canonical,
      siteName: 'AIreading',
      images: ogImage ? [{
        url: ogImage,
        width: ogImageWidth,
        height: ogImageHeight,
        alt: ogImageAlt || title,
      }] : undefined,
      publishedTime,
      modifiedTime,
    },
    
    // Twitter
    twitter: {
      card: twitterCard,
      site: twitterSite,
      creator: twitterCreator,
      title,
      description,
      images: twitterImage || ogImage ? [twitterImage || ogImage!] : undefined,
    },
    
    // Alternates
    alternates: alternates || (canonical ? { canonical } : undefined),
    
    // Robots
    robots: robots ? {
      index: robots.index ?? true,
      follow: robots.follow ?? true,
      nocache: robots.nocache,
      googleBot: robots.googleBot,
    } : undefined,
  }

  return metadata
}

/**
 * 默认 SEO 配置
 */
export const DEFAULT_SEO: Pick<SEOProps, 'twitterSite' | 'ogType' | 'twitterCard'> = {
  twitterSite: '@aireading_app',
  ogType: 'website',
  twitterCard: 'summary_large_image',
}

/**
 * 生成书籍页面的 SEO 配置
 */
export interface BookSEOProps {
  book: {
    id: string | number
    title: string
    author: string
    description: string
    category: string
    coverImage?: string
    rating?: number
    reviewCount?: number
  }
  locale: 'en' | 'zh'
  baseUrl?: string
}

export function generateBookMetadata({ book, locale, baseUrl = 'https://aireading.app' }: BookSEOProps): Metadata {
  const localePrefix = `/${locale}`
  const bookUrl = `${baseUrl}${localePrefix}/book/${book.id}/`
  const categoryUrl = `${baseUrl}${localePrefix}/category/${book.category.toLowerCase()}/`
  
  const ogImage = book.coverImage 
    ? `${baseUrl}/og-images/book-${book.id}.jpg`
    : `${baseUrl}/og-images/default-book.jpg`
  
  const title = locale === 'zh' 
    ? `${book.title} - ${book.author} | AI读书`
    : `${book.title} by ${book.author} | AIreading`
  
  const description = book.description.slice(0, 160)
  
  const keywords = [
    book.title,
    book.author,
    book.category,
    locale === 'zh' ? 'AI读书' : 'AI book summary',
    locale === 'zh' ? '书籍摘要' : 'book summary',
    locale === 'zh' ? '15分钟读完' : '15-minute read',
  ]

  return generateMetadata({
    title,
    description,
    keywords,
    canonical: bookUrl,
    ogType: 'book',
    ogImage,
    ogImageAlt: `${book.title} cover`,
    locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    alternates: {
      languages: {
        'en': `${baseUrl}/en/book/${book.id}/`,
        'zh': `${baseUrl}/zh/book/${book.id}/`,
        'x-default': `${baseUrl}/en/book/${book.id}/`,
      },
      canonical: bookUrl,
    },
    author: book.author,
  })
}

/**
 * 生成首页 SEO 配置
 */
export function generateHomeMetadata(locale: 'en' | 'zh', baseUrl = 'https://aireading.app'): Metadata {
  const title = locale === 'zh'
    ? 'AI读书 - AI智能讲书，15分钟听完一本书'
    : 'AIreading - AI-Powered Book Summaries in 15 Minutes'
  
  const description = locale === 'zh'
    ? '通过AI技术，将经典书籍浓缩为15分钟精华内容。涵盖商业、自我提升、心理学等多个领域，让知识获取更高效。'
    : 'AI-powered book summaries that distill classic books into 15-minute insights. Covering business, self-improvement, psychology, and more.'
  
  const keywords = locale === 'zh'
    ? ['AI读书', '书籍摘要', '15分钟读书', '高效阅读', '知识管理', 'AI讲书']
    : ['AI reading', 'book summaries', 'quick reads', 'efficient learning', 'knowledge management']

  return generateMetadata({
    title,
    description,
    keywords,
    canonical: `${baseUrl}/${locale}/`,
    ogType: 'website',
    ogImage: `${baseUrl}/og-images/home-${locale}.jpg`,
    locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    alternates: {
      languages: {
        'en': `${baseUrl}/en/`,
        'zh': `${baseUrl}/zh/`,
        'x-default': `${baseUrl}/en/`,
      },
    },
  })
}

/**
 * 生成分类页面 SEO 配置
 */
export function generateCategoryMetadata(
  categoryName: string, 
  locale: 'en' | 'zh', 
  baseUrl = 'https://aireading.app'
): Metadata {
  const categorySlug = categoryName.toLowerCase()
  const categoryUrl = `${baseUrl}/${locale}/category/${categorySlug}/`
  
  const title = locale === 'zh'
    ? `${categoryName}类书籍 | AI读书`
    : `${categoryName} Books | AIreading`
  
  const description = locale === 'zh'
    ? `浏览${categoryName}分类下的精选书籍，通过AI技术快速掌握核心知识点。`
    : `Browse curated ${categoryName} books with AI-powered summaries for quick learning.`

  return generateMetadata({
    title,
    description,
    canonical: categoryUrl,
    ogType: 'website',
    locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    alternates: {
      languages: {
        'en': `${baseUrl}/en/category/${categorySlug}/`,
        'zh': `${baseUrl}/zh/category/${categorySlug}/`,
      },
    },
  })
}
