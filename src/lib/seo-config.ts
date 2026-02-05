/**
 * SEO Configuration Constants
 * 集中管理站点的 SEO 相关常量
 */

export const SITE_CONFIG = {
  // 基础信息
  name: 'AIreading',
  domain: 'aireading.app',
  url: 'https://aireading.app',
  
  // 社交媒体
  social: {
    twitter: '@aireading_app',
    facebook: 'https://facebook.com/aireading',
    linkedin: 'https://linkedin.com/company/aireading',
    youtube: 'https://youtube.com/@aireading',
  },
  
  // Logo 和图片
  logo: 'https://aireading.app/logo.png',
  logoWidth: 512,
  logoHeight: 512,
  
  // 默认 OG 图片
  defaultOGImage: 'https://aireading.app/og-images/default.jpg',
  
  // 联系信息
  contact: {
    email: 'support@aireading.app',
    type: 'Customer Service',
  },
} as const

/**
 * 语言配置
 */
export const LOCALE_CONFIG = {
  en: {
    name: 'English',
    code: 'en',
    ogLocale: 'en_US',
    hreflang: 'en',
    dir: 'ltr',
  },
  zh: {
    name: '简体中文',
    code: 'zh',
    ogLocale: 'zh_CN',
    hreflang: 'zh',
    dir: 'ltr',
  },
} as const

export type Locale = keyof typeof LOCALE_CONFIG

/**
 * 页面类型的默认 SEO 配置
 */
export const PAGE_DEFAULTS = {
  home: {
    en: {
      title: 'AIreading - AI-Powered Book Summaries in 15 Minutes',
      description: 'AI-powered book summaries that distill classic books into 15-minute insights. Covering business, self-improvement, psychology, and more.',
      keywords: ['AI reading', 'book summaries', 'quick reads', 'efficient learning', 'knowledge management'],
    },
    zh: {
      title: 'AI读书 - AI智能讲书，15分钟听完一本书',
      description: '通过AI技术，将经典书籍浓缩为15分钟精华内容。涵盖商业、自我提升、心理学等多个领域，让知识获取更高效。',
      keywords: ['AI读书', '书籍摘要', '15分钟读书', '高效阅读', '知识管理', 'AI讲书'],
    },
  },
  library: {
    en: {
      title: 'Library - All Book Summaries | AIreading',
      description: 'Browse our complete collection of AI-powered book summaries across business, psychology, self-improvement, and more.',
      keywords: ['book library', 'book collection', 'summaries', 'reading list'],
    },
    zh: {
      title: '书库 - 所有书籍摘要 | AI读书',
      description: '浏览我们完整的书籍摘要收藏，涵盖商业、心理学、自我提升等多个领域。',
      keywords: ['书库', '书籍收藏', '摘要', '阅读列表'],
    },
  },
  categories: {
    en: {
      title: 'Categories - Browse by Topic | AIreading',
      description: 'Explore book summaries organized by category: Business, Psychology, Self-Improvement, and more.',
      keywords: ['book categories', 'topics', 'genres', 'browse books'],
    },
    zh: {
      title: '分类 - 按主题浏览 | AI读书',
      description: '按分类浏览书籍摘要：商业、心理学、自我提升等。',
      keywords: ['书籍分类', '主题', '类型', '浏览书籍'],
    },
  },
  search: {
    en: {
      title: 'Search Books | AIreading',
      description: 'Search our library of AI-powered book summaries.',
      keywords: ['search books', 'find summaries'],
    },
    zh: {
      title: '搜索书籍 | AI读书',
      description: '搜索我们的AI书籍摘要库。',
      keywords: ['搜索书籍', '查找摘要'],
    },
  },
  myLibrary: {
    en: {
      title: 'My Library | AIreading',
      description: 'Your personal collection of book summaries.',
      keywords: ['my library', 'saved books', 'bookmarks'],
    },
    zh: {
      title: '我的书库 | AI读书',
      description: '您的个人书籍摘要收藏。',
      keywords: ['我的书库', '收藏的书', '书签'],
    },
  },
} as const

/**
 * 分类名称映射（用于 SEO）
 */
export const CATEGORY_NAMES = {
  business: {
    en: 'Business',
    zh: '商业',
  },
  psychology: {
    en: 'Psychology',
    zh: '心理学',
  },
  'self-improvement': {
    en: 'Self-Improvement',
    zh: '自我提升',
  },
  history: {
    en: 'History',
    zh: '历史',
  },
  philosophy: {
    en: 'Philosophy',
    zh: '哲学',
  },
  science: {
    en: 'Science',
    zh: '科学',
  },
  fiction: {
    en: 'Fiction',
    zh: '小说',
  },
} as const

export type CategorySlug = keyof typeof CATEGORY_NAMES

/**
 * Robots meta 标签配置
 */
export const ROBOTS_CONFIG = {
  // 允许索引的页面
  index: {
    index: true,
    follow: true,
  },
  // 不索引的页面（个人化内容）
  noindex: {
    index: false,
    follow: true,
  },
  // 完全不索引
  noindexNofollow: {
    index: false,
    follow: false,
  },
} as const

/**
 * 需要 noindex 的页面路径
 */
export const NOINDEX_PATHS = [
  '/search',
  '/my-library',
  '/api',
  '/_next',
] as const

/**
 * 生成完整的 URL
 */
export function getFullUrl(path: string): string {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  // 确保路径以 / 结尾（除非是文件）
  const finalPath = normalizedPath.endsWith('/') || normalizedPath.includes('.') 
    ? normalizedPath 
    : `${normalizedPath}/`
  
  return `${SITE_CONFIG.url}${finalPath}`
}

/**
 * 生成书籍的 OG 图片 URL
 */
export function getBookOGImage(bookId: string | number): string {
  return `${SITE_CONFIG.url}/og-images/book-${bookId}.jpg`
}

/**
 * 生成分类的 OG 图片 URL
 */
export function getCategoryOGImage(categorySlug: string): string {
  return `${SITE_CONFIG.url}/og-images/category-${categorySlug}.jpg`
}

/**
 * 检查路径是否应该 noindex
 */
export function shouldNoIndex(path: string): boolean {
  return NOINDEX_PATHS.some(noindexPath => path.startsWith(noindexPath))
}

/**
 * 生成 hreflang 链接
 */
export function generateHreflangLinks(path: string) {
  return {
    en: getFullUrl(`/en${path}`),
    zh: getFullUrl(`/zh${path}`),
    'x-default': getFullUrl(`/en${path}`),
  }
}

/**
 * 格式化日期为 ISO 8601
 */
export function formatDateForSEO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString()
}

/**
 * 截断文本到指定长度（用于 meta description）
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  
  // 尝试在单词边界截断
  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

/**
 * 清理和规范化关键词
 */
export function normalizeKeywords(keywords: string[]): string[] {
  return keywords
    .map(k => k.trim().toLowerCase())
    .filter((k, index, self) => k && self.indexOf(k) === index) // 去重
    .slice(0, 10) // 最多 10 个
}

/**
 * 生成书籍 Schema.org 的 inLanguage 数组
 */
export function getBookLanguages(): string[] {
  return Object.keys(LOCALE_CONFIG)
}

/**
 * 验证和规范化 URL
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url, SITE_CONFIG.url)
    // 确保使用正确的协议和域名
    urlObj.protocol = 'https:'
    urlObj.hostname = SITE_CONFIG.domain
    // 确保路径以 / 结尾
    if (!urlObj.pathname.endsWith('/') && !urlObj.pathname.includes('.')) {
      urlObj.pathname += '/'
    }
    return urlObj.toString()
  } catch (error) {
    console.error('Invalid URL:', url, error)
    return getFullUrl('/')
  }
}
