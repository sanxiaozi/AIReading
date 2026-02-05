# SEO Quick Start Guide

快速上手 AIreading 的 SEO 组件，10 分钟内完成第一个页面的 SEO 配置。

## 🚀 5 步快速开始

### 步骤 1: 导入组件

在你的页面文件中导入所需的 SEO 组件：

```tsx
// src/app/[locale]/book/[id]/page.tsx
import { generateBookMetadata } from '@/components/SEOHead'
import { BookStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData'
```

---

### 步骤 2: 生成 Metadata

使用 Next.js App Router 的 `generateMetadata` 导出：

```tsx
export async function generateMetadata({ params }) {
  const book = await fetchBook(params.id)
  
  return generateBookMetadata({
    book: {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
    },
    locale: params.locale,
  })
}
```

---

### 步骤 3: 添加结构化数据

在页面组件中添加 JSON-LD Schema：

```tsx
export default async function BookPage({ params }) {
  const book = await fetchBook(params.id)
  
  return (
    <>
      {/* Book Schema */}
      <BookStructuredData
        book={{
          name: book.title,
          author: { name: book.author },
          description: book.description,
          bookFormat: 'AudiobookFormat',
          genre: book.category,
          inLanguage: ['en', 'zh'],
          url: `https://aireading.app/${params.locale}/book/${book.id}/`,
        }}
      />
      
      {/* Your page content */}
      <div>{/* ... */}</div>
    </>
  )
}
```

---

### 步骤 4: 添加面包屑导航

```tsx
<BreadcrumbStructuredData
  items={[
    { name: 'Home', url: 'https://aireading.app/zh/', position: 1 },
    { name: '书库', url: 'https://aireading.app/zh/library/', position: 2 },
    { name: book.title, url: `https://aireading.app/zh/book/${book.id}/`, position: 3 },
  ]}
/>
```

---

### 步骤 5: 测试验证

1. **运行开发服务器**: `npm run dev`
2. **查看页面源代码**: 右键 → 查看网页源代码
3. **验证 Meta 标签**: 确保包含 `og:title`, `og:image`, `twitter:card` 等
4. **验证 JSON-LD**: 查找 `<script type="application/ld+json">`
5. **在线验证**:
   - Schema: https://validator.schema.org/
   - OG: https://www.opengraph.xyz/

✅ 完成！你的页面现在已经 SEO 就绪。

---

## 📋 常用代码片段

### 首页 SEO

```tsx
// src/app/[locale]/page.tsx
import { generateHomeMetadata } from '@/components/SEOHead'
import { WebsiteStructuredData, OrganizationStructuredData } from '@/components/StructuredData'
import { SITE_CONFIG } from '@/lib/seo-config'

export async function generateMetadata({ params }) {
  return generateHomeMetadata(params.locale)
}

export default function HomePage({ params }) {
  return (
    <>
      <WebsiteStructuredData
        site={{
          name: 'AIreading',
          url: SITE_CONFIG.url,
          description: 'AI-powered book summaries',
          searchUrl: `${SITE_CONFIG.url}/search/?q={search_term_string}`,
          logo: SITE_CONFIG.logo,
        }}
      />
      
      <OrganizationStructuredData
        org={{
          name: 'AIreading',
          url: SITE_CONFIG.url,
          logo: SITE_CONFIG.logo,
        }}
      />
      
      {/* Content */}
    </>
  )
}
```

---

### 分类页 SEO

```tsx
// src/app/[locale]/category/[id]/page.tsx
import { generateCategoryMetadata } from '@/components/SEOHead'
import { ItemListStructuredData } from '@/components/StructuredData'

export async function generateMetadata({ params }) {
  return generateCategoryMetadata(params.id, params.locale)
}

export default function CategoryPage({ params }) {
  const books = await fetchCategoryBooks(params.id)
  
  return (
    <>
      <ItemListStructuredData
        listName={`${params.id} Books`}
        items={books.map((book, i) => ({
          name: book.title,
          url: `https://aireading.app/${params.locale}/book/${book.id}/`,
          position: i + 1,
        }))}
      />
      
      {/* Content */}
    </>
  )
}
```

---

### 自定义 Meta 标签

```tsx
import { generateMetadata } from '@/components/SEOHead'

export async function generateMetadata() {
  return generateMetadata({
    title: '我的自定义标题 | AIreading',
    description: '这是一个自定义的描述文本...',
    keywords: ['关键词1', '关键词2', '关键词3'],
    canonical: 'https://aireading.app/zh/custom-page/',
    ogImage: 'https://aireading.app/images/custom-og.jpg',
    locale: 'zh_CN',
  })
}
```

---

## 🎨 生成 OG 图片

### 使用 Vercel OG Image

安装依赖：

```bash
npm install @vercel/og
```

创建动态 OG 图片 API：

```tsx
// src/app/api/og/route.tsx
import { ImageResponse } from '@vercel/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'AIreading'
  
  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #667eea, #764ba2)',
      }}>
        <h1 style={{ fontSize: 72, color: 'white' }}>{title}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

使用动态 OG 图片：

```tsx
ogImage: `https://aireading.app/api/og?title=${encodeURIComponent(book.title)}`
```

---

## 🔧 配置站点信息

编辑 `src/lib/seo-config.ts`:

```tsx
export const SITE_CONFIG = {
  name: 'AIreading',
  domain: 'aireading.app',
  url: 'https://aireading.app',
  
  social: {
    twitter: '@aireading_app',
    // 更新你的社交媒体账号
  },
  
  logo: 'https://aireading.app/logo.png',
  defaultOGImage: 'https://aireading.app/og-images/default.jpg',
}
```

---

## 🚨 常见问题

### Q: OG 图片不显示？

**A**: 检查以下几点：
1. 图片 URL 是完整的绝对路径（包含 `https://`）
2. 图片尺寸为 1200x630px
3. 图片可公开访问（不需要登录）
4. 清除 Facebook/Twitter 缓存

### Q: Schema 验证失败？

**A**: 使用 [Schema.org Validator](https://validator.schema.org/) 检查：
1. JSON 语法是否正确
2. 必填字段是否都包含
3. URL 格式是否正确（完整的绝对路径）

### Q: Canonical URL 指向错误？

**A**: 确保：
```tsx
canonical: 'https://aireading.app/zh/book/1/' // 正确
// 不要:
canonical: 'https://aireading.app/zh/' // 错误：指向首页
```

---

## 📚 更多资源

- **完整文档**: `src/components/seo/README.md`
- **实施检查清单**: `docs/seo/IMPLEMENTATION_CHECKLIST.md`
- **技术审计**: `docs/seo/TECHNICAL_AUDIT.md`
- **Next.js Metadata**: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **Schema.org**: https://schema.org/

---

## 🎯 下一步

1. ✅ 完成第一个页面的 SEO 配置
2. 📊 使用在线工具验证
3. 🚀 部署到生产环境
4. 📈 在 Google Search Console 监控

---

**需要帮助？** 查看完整文档或联系 SEO 团队。

**最后更新**: 2025-02-05
