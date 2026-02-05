# SEO Components Usage Guide

本指南说明如何在 AIreading 项目中使用 SEO 组件和结构化数据。

## 📁 组件文件

- **SEOHead.tsx** - Meta 标签和 Open Graph / Twitter Card 配置
- **StructuredData.tsx** - Schema.org JSON-LD 结构化数据组件

---

## 🚀 快速开始

### 1. 书籍详情页 (Book Page)

在 `src/app/[locale]/book/[id]/page.tsx` 中：

```tsx
import { generateBookMetadata } from '@/components/SEOHead'
import { BookStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData'

// 生成 metadata（Next.js App Router）
export async function generateMetadata({ params }) {
  const book = await fetchBook(params.id)
  
  return generateBookMetadata({
    book: {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      coverImage: book.coverUrl,
      rating: book.rating,
      reviewCount: book.reviews,
    },
    locale: params.locale,
  })
}

// 页面组件
export default function BookPage({ params }) {
  const book = await fetchBook(params.id)
  
  return (
    <>
      {/* Book Schema */}
      <BookStructuredData
        book={{
          name: book.title,
          author: {
            name: book.author,
            url: `https://aireading.app/${params.locale}/author/${book.authorId}/`
          },
          description: book.description,
          bookFormat: 'AudiobookFormat',
          genre: book.category,
          inLanguage: ['en', 'zh'],
          url: `https://aireading.app/${params.locale}/book/${book.id}/`,
          image: book.coverUrl,
          aggregateRating: {
            ratingValue: book.rating,
            reviewCount: book.reviewCount,
          }
        }}
      />
      
      {/* Breadcrumb Schema */}
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: `https://aireading.app/${params.locale}/`, position: 1 },
          { name: 'Library', url: `https://aireading.app/${params.locale}/library/`, position: 2 },
          { name: book.title, url: `https://aireading.app/${params.locale}/book/${book.id}/`, position: 3 },
        ]}
      />
      
      {/* 页面内容 */}
      <div>...</div>
    </>
  )
}
```

---

### 2. 首页 (Homepage)

在 `src/app/[locale]/page.tsx` 中：

```tsx
import { generateHomeMetadata } from '@/components/SEOHead'
import { WebsiteStructuredData, OrganizationStructuredData } from '@/components/StructuredData'

export async function generateMetadata({ params }) {
  return generateHomeMetadata(params.locale)
}

export default function HomePage({ params }) {
  return (
    <>
      {/* Website Schema */}
      <WebsiteStructuredData
        site={{
          name: 'AIreading',
          url: 'https://aireading.app',
          description: 'AI-powered book summaries in 15 minutes',
          searchUrl: 'https://aireading.app/search/?q={search_term_string}',
          logo: 'https://aireading.app/logo.png',
          sameAs: [
            'https://twitter.com/aireading_app',
            'https://facebook.com/aireading',
            'https://linkedin.com/company/aireading',
          ],
        }}
      />
      
      {/* Organization Schema */}
      <OrganizationStructuredData
        org={{
          name: 'AIreading',
          url: 'https://aireading.app',
          logo: 'https://aireading.app/logo.png',
          description: 'AI-powered book summary platform',
          sameAs: [
            'https://twitter.com/aireading_app',
          ],
        }}
      />
      
      <div>...</div>
    </>
  )
}
```

---

### 3. 分类页 (Category Page)

在 `src/app/[locale]/category/[id]/page.tsx` 中：

```tsx
import { generateCategoryMetadata } from '@/components/SEOHead'
import { ItemListStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData'

export async function generateMetadata({ params }) {
  return generateCategoryMetadata(params.id, params.locale)
}

export default function CategoryPage({ params }) {
  const books = await fetchCategoryBooks(params.id)
  
  return (
    <>
      {/* ItemList Schema */}
      <ItemListStructuredData
        listName={`${params.id} Books`}
        items={books.map((book, index) => ({
          name: book.title,
          url: `https://aireading.app/${params.locale}/book/${book.id}/`,
          image: book.coverUrl,
          position: index + 1,
        }))}
      />
      
      {/* Breadcrumb Schema */}
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: `https://aireading.app/${params.locale}/`, position: 1 },
          { name: 'Categories', url: `https://aireading.app/${params.locale}/categories/`, position: 2 },
          { name: params.id, url: `https://aireading.app/${params.locale}/category/${params.id}/`, position: 3 },
        ]}
      />
      
      <div>...</div>
    </>
  )
}
```

---

### 4. 博客文章页 (Article/Blog Post)

```tsx
import { ArticleStructuredData } from '@/components/StructuredData'

export default function ArticlePage({ article }) {
  return (
    <>
      <ArticleStructuredData
        article={{
          headline: article.title,
          description: article.excerpt,
          image: article.featuredImage,
          datePublished: article.createdAt,
          dateModified: article.updatedAt,
          author: {
            name: article.author,
            url: `https://aireading.app/author/${article.authorId}/`,
          },
          publisher: {
            name: 'AIreading',
            logo: 'https://aireading.app/logo.png',
          },
          url: `https://aireading.app/blog/${article.slug}/`,
        }}
      />
      
      <div>...</div>
    </>
  )
}
```

---

### 5. 常见问题页 (FAQ Page)

```tsx
import { FAQStructuredData } from '@/components/StructuredData'

export default function FAQPage() {
  return (
    <>
      <FAQStructuredData
        faqs={[
          {
            question: 'How does AIreading work?',
            answer: 'AIreading uses AI to summarize books into 15-minute audio summaries...',
          },
          {
            question: 'Is AIreading free?',
            answer: 'We offer both free and premium plans...',
          },
        ]}
      />
      
      <div>...</div>
    </>
  )
}
```

---

## 🎯 SEO 最佳实践

### Meta 标签优化

1. **Title 长度**: 50-60 字符（中文）或 50-70 字符（英文）
2. **Description 长度**: 120-150 字符（中文）或 150-160 字符（英文）
3. **Keywords**: 5-10 个相关关键词
4. **Canonical URL**: 始终包含完整的 URL，带协议和尾部斜杠

### Open Graph 图片

1. **推荐尺寸**: 1200x630px
2. **最小尺寸**: 600x315px
3. **宽高比**: 1.91:1
4. **格式**: JPG 或 PNG
5. **文件大小**: < 8MB

### Twitter Card 图片

1. **Summary Card**: 144x144px (1:1)
2. **Summary Large Image**: 800x418px (1.91:1)
3. **格式**: JPG, PNG, WEBP, GIF
4. **文件大小**: < 5MB

---

## 🔍 测试工具

### 验证结构化数据

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/
- **JSON-LD Playground**: https://json-ld.org/playground/

### 验证社交分享

- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### 验证 Meta 标签

- **Open Graph Debugger**: https://www.opengraph.xyz/
- **Meta Tags Inspector**: https://metatags.io/

---

## 📊 监控和分析

### Google Search Console

1. 提交 sitemap: `https://aireading.app/sitemap.xml`
2. 监控索引状态
3. 查看搜索性能
4. 检查结构化数据错误

### Bing Webmaster Tools

1. 验证网站所有权
2. 提交 sitemap
3. 监控爬取统计

---

## 🚨 常见问题排查

### 1. Open Graph 图片不显示

**检查清单**:
- ✅ 图片 URL 是完整的绝对路径（包含 https://）
- ✅ 图片尺寸符合要求（1200x630px）
- ✅ 图片可公开访问（不需要登录）
- ✅ 服务器返回正确的 Content-Type

**清除缓存**:
- Facebook: 使用 Sharing Debugger 的 "Scrape Again" 按钮
- Twitter: 提交新的 URL 到 Card Validator

### 2. 结构化数据未被识别

**检查清单**:
- ✅ JSON-LD 语法正确（使用 JSON 验证器）
- ✅ 必填字段都已包含
- ✅ URL 格式正确（完整的绝对路径）
- ✅ 使用 Rich Results Test 验证

### 3. Canonical URL 不正确

**检查清单**:
- ✅ URL 包含协议 (https://)
- ✅ URL 包含尾部斜杠
- ✅ URL 指向当前页面（不是首页）
- ✅ 语言版本的 canonical 指向自己

---

## 📚 参考资源

- [Schema.org Documentation](https://schema.org/)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

---

## ✅ 检查清单

使用此清单确保每个页面类型都正确实现了 SEO：

### 所有页面
- [ ] Title 标签存在且唯一
- [ ] Meta description 存在且描述性强
- [ ] Canonical URL 正确
- [ ] Open Graph 标签完整
- [ ] Twitter Card 标签完整
- [ ] Hreflang 标签（多语言页面）

### 书籍页面
- [ ] Book Schema 实现
- [ ] Breadcrumb Schema 实现
- [ ] OG Image 使用书籍封面
- [ ] 包含评分数据（如有）

### 首页
- [ ] WebSite Schema 实现
- [ ] Organization Schema 实现
- [ ] SearchAction 配置

### 分类页面
- [ ] ItemList Schema 实现
- [ ] Breadcrumb Schema 实现

---

**维护者**: SEO Team  
**最后更新**: 2025-02-05  
**版本**: 1.0.0
