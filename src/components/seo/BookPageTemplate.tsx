/**
 * Book Page Template with Complete SEO Implementation
 * 这是一个完整的书籍页面示例，展示如何正确使用所有 SEO 组件
 */

import { Metadata } from 'next'
import { generateBookMetadata } from '../SEOHead'
import { BookStructuredData, BreadcrumbStructuredData } from '../StructuredData'
import { SITE_CONFIG, LOCALE_CONFIG, getFullUrl, getBookOGImage, getBookLanguages } from '@/lib/seo-config'

/**
 * 书籍数据接口（示例）
 */
interface Book {
  id: string | number
  title: string
  author: string
  authorId?: string
  description: string
  category: string
  categorySlug: string
  coverUrl?: string
  rating?: number
  reviewCount?: number
  isbn?: string
  publishedDate?: string
  numberOfPages?: number
  publisher?: string
  price?: string
  priceCurrency?: string
}

/**
 * 页面参数接口
 */
interface BookPageProps {
  params: {
    locale: 'en' | 'zh'
    id: string
  }
}

/**
 * 生成书籍页面的 Metadata
 * 在 Next.js App Router 中作为 generateMetadata 导出
 */
export async function generateBookPageMetadata(
  { params }: BookPageProps,
  book: Book
): Promise<Metadata> {
  return generateBookMetadata({
    book: {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      coverImage: book.coverUrl,
      rating: book.rating,
      reviewCount: book.reviewCount,
    },
    locale: params.locale,
    baseUrl: SITE_CONFIG.url,
  })
}

/**
 * 书籍页面组件
 * 包含所有必需的 SEO 元素
 */
export function BookPageWithSEO({ params, book }: BookPageProps & { book: Book }) {
  const locale = params.locale
  const baseUrl = SITE_CONFIG.url
  const bookUrl = getFullUrl(`/${locale}/book/${book.id}`)
  const categoryUrl = getFullUrl(`/${locale}/category/${book.categorySlug}`)
  const authorUrl = book.authorId 
    ? getFullUrl(`/${locale}/author/${book.authorId}`)
    : undefined

  // Breadcrumb items
  const breadcrumbs = [
    {
      name: locale === 'zh' ? '首页' : 'Home',
      url: getFullUrl(`/${locale}`),
      position: 1,
    },
    {
      name: locale === 'zh' ? '书库' : 'Library',
      url: getFullUrl(`/${locale}/library`),
      position: 2,
    },
    {
      name: book.category,
      url: categoryUrl,
      position: 3,
    },
    {
      name: book.title,
      url: bookUrl,
      position: 4,
    },
  ]

  return (
    <>
      {/* Book Schema - 书籍结构化数据 */}
      <BookStructuredData
        book={{
          name: book.title,
          author: {
            name: book.author,
            url: authorUrl,
          },
          description: book.description,
          bookFormat: 'AudiobookFormat', // AIreading 提供音频摘要
          genre: book.category,
          inLanguage: getBookLanguages(),
          url: bookUrl,
          image: book.coverUrl || getBookOGImage(book.id),
          isbn: book.isbn,
          numberOfPages: book.numberOfPages,
          publisher: book.publisher ? {
            name: book.publisher,
          } : undefined,
          datePublished: book.publishedDate,
          aggregateRating: (book.rating && book.reviewCount) ? {
            ratingValue: book.rating,
            reviewCount: book.reviewCount,
            bestRating: 5,
            worstRating: 1,
          } : undefined,
          offers: book.price ? {
            price: book.price,
            priceCurrency: book.priceCurrency || 'USD',
            availability: 'https://schema.org/InStock',
          } : undefined,
        }}
      />

      {/* Breadcrumb Schema - 面包屑导航 */}
      <BreadcrumbStructuredData items={breadcrumbs} />

      {/* 页面内容 */}
      <main>
        {/* 实际页面内容在这里 */}
        <article>
          <h1>{book.title}</h1>
          <p>by {book.author}</p>
          <p>{book.description}</p>
          {/* ... 更多内容 ... */}
        </article>
      </main>
    </>
  )
}

/**
 * 使用示例 - 在实际的 page.tsx 中
 * 
 * ```tsx
 * // src/app/[locale]/book/[id]/page.tsx
 * 
 * import { generateBookPageMetadata, BookPageWithSEO } from '@/components/seo/BookPageTemplate'
 * import { fetchBook } from '@/lib/api'
 * 
 * export async function generateMetadata({ params }: { params: { locale: 'en' | 'zh', id: string } }) {
 *   const book = await fetchBook(params.id, params.locale)
 *   return generateBookPageMetadata({ params }, book)
 * }
 * 
 * export default async function BookPage({ params }: { params: { locale: 'en' | 'zh', id: string } }) {
 *   const book = await fetchBook(params.id, params.locale)
 *   return <BookPageWithSEO params={params} book={book} />
 * }
 * ```
 */

/**
 * 生成静态路径（如果使用 SSG）
 * 
 * ```tsx
 * export async function generateStaticParams() {
 *   const books = await fetchAllBooks()
 *   const locales = ['en', 'zh']
 *   
 *   return books.flatMap(book =>
 *     locales.map(locale => ({
 *       locale,
 *       id: book.id.toString(),
 *     }))
 *   )
 * }
 * ```
 */
