/**
 * Homepage Template with Complete SEO Implementation
 * 首页完整 SEO 实现示例
 */

import { Metadata } from 'next'
import { generateHomeMetadata } from '../SEOHead'
import { WebsiteStructuredData, OrganizationStructuredData, ItemListStructuredData } from '../StructuredData'
import { SITE_CONFIG, getFullUrl } from '@/lib/seo-config'

/**
 * 首页参数接口
 */
interface HomePageProps {
  params: {
    locale: 'en' | 'zh'
  }
}

/**
 * 生成首页的 Metadata
 */
export function generateHomePageMetadata({ params }: HomePageProps): Metadata {
  return generateHomeMetadata(params.locale, SITE_CONFIG.url)
}

/**
 * 首页组件（包含所有 SEO 元素）
 */
export function HomePageWithSEO({ 
  params, 
  featuredBooks = [] 
}: HomePageProps & { 
  featuredBooks?: Array<{
    id: string | number
    title: string
    coverUrl: string
  }> 
}) {
  const locale = params.locale
  const baseUrl = SITE_CONFIG.url

  return (
    <>
      {/* Website Schema - 网站结构化数据 */}
      <WebsiteStructuredData
        site={{
          name: SITE_CONFIG.name,
          url: baseUrl,
          description: locale === 'zh'
            ? '通过AI技术，将经典书籍浓缩为15分钟精华内容'
            : 'AI-powered book summaries in 15 minutes',
          searchUrl: `${baseUrl}/${locale}/search/?q={search_term_string}`,
          logo: SITE_CONFIG.logo,
          sameAs: [
            SITE_CONFIG.social.twitter,
            SITE_CONFIG.social.facebook,
            SITE_CONFIG.social.linkedin,
            SITE_CONFIG.social.youtube,
          ],
        }}
      />

      {/* Organization Schema - 组织结构化数据 */}
      <OrganizationStructuredData
        org={{
          name: SITE_CONFIG.name,
          url: baseUrl,
          logo: SITE_CONFIG.logo,
          description: locale === 'zh'
            ? 'AI驱动的书籍摘要平台，帮助用户快速获取知识'
            : 'AI-powered book summary platform for efficient learning',
          sameAs: [
            SITE_CONFIG.social.twitter,
            SITE_CONFIG.social.facebook,
            SITE_CONFIG.social.linkedin,
          ],
          contactPoint: {
            contactType: SITE_CONFIG.contact.type,
            email: SITE_CONFIG.contact.email,
          },
        }}
      />

      {/* Featured Books ItemList Schema - 精选书籍列表 */}
      {featuredBooks.length > 0 && (
        <ItemListStructuredData
          listName={locale === 'zh' ? '精选书籍' : 'Featured Books'}
          items={featuredBooks.map((book, index) => ({
            name: book.title,
            url: getFullUrl(`/${locale}/book/${book.id}`),
            image: book.coverUrl,
            position: index + 1,
          }))}
        />
      )}

      {/* 页面内容 */}
      <main>
        {/* Hero Section */}
        <section>
          <h1>
            {locale === 'zh' 
              ? 'AI读书 - 15分钟听完一本书'
              : 'AIreading - 15-Minute Book Summaries'}
          </h1>
          <p>
            {locale === 'zh'
              ? '通过AI技术，将经典书籍浓缩为精华内容'
              : 'AI-powered summaries of classic books'}
          </p>
        </section>

        {/* Featured Books */}
        <section>
          <h2>{locale === 'zh' ? '精选书籍' : 'Featured Books'}</h2>
          {/* 书籍列表 */}
        </section>

        {/* Categories */}
        <section>
          <h2>{locale === 'zh' ? '浏览分类' : 'Browse Categories'}</h2>
          {/* 分类列表 */}
        </section>
      </main>
    </>
  )
}

/**
 * 使用示例 - 在实际的 page.tsx 中
 * 
 * ```tsx
 * // src/app/[locale]/page.tsx
 * 
 * import { generateHomePageMetadata, HomePageWithSEO } from '@/components/seo/HomePageTemplate'
 * import { fetchFeaturedBooks } from '@/lib/api'
 * 
 * export async function generateMetadata({ params }: { params: { locale: 'en' | 'zh' } }) {
 *   return generateHomePageMetadata({ params })
 * }
 * 
 * export default async function HomePage({ params }: { params: { locale: 'en' | 'zh' } }) {
 *   const featuredBooks = await fetchFeaturedBooks(params.locale)
 *   return <HomePageWithSEO params={params} featuredBooks={featuredBooks} />
 * }
 * ```
 */
