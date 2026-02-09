# 内容 SEO 策略

## 概述
本文档定义 AIreading 的内容 SEO 策略，包括页面模板、内链结构、结构化数据实施和技术 SEO 最佳实践。目标是确保每个页面都针对搜索引擎和用户体验进行了优化。

---

## 1. 书籍页面 SEO 模板

### 1.1 URL 结构

**推荐格式**:
```
https://aireading.app/{locale}/book/{book-id}/{book-slug}/
```

**示例**:
```
中文: https://aireading.app/zh/book/123/atomic-habits/
英文: https://aireading.app/en/book/123/atomic-habits/
```

**最佳实践**:
- ✅ 使用语义化 slug（书名英文化）
- ✅ 包含 locale 便于 hreflang 配置
- ✅ 尾部斜杠保持一致性
- ❌ 避免过长的 URL（< 100 字符）
- ❌ 避免特殊字符和中文（slug 部分）

---

### 1.2 页面 Meta 标签模板

#### Title 标签公式

**中文**:
```
{书名} - {作者} | AI读书 - 15分钟精华摘要
```

**英文**:
```
{Book Title} by {Author} | AIreading - 15-Min Summary
```

**示例**:
```html
<!-- 中文 -->
<title>原子习惯 - 詹姆斯·克利尔 | AI读书 - 15分钟精华摘要</title>

<!-- 英文 -->
<title>Atomic Habits by James Clear | AIreading - 15-Min Summary</title>
```

**规则**:
- 长度: 50-60 字符（中文）/ 55-65 字符（英文）
- 包含: 书名 + 作者 + 品牌词 + 核心卖点
- 核心关键词前置

---

#### Description 标签公式

**中文**:
```
通过AI技术，15分钟读懂《{书名}》核心精华。{一句话简介}。涵盖{关键主题1}、{关键主题2}、{关键主题3}，让知识获取更高效。
```

**英文**:
```
Discover the key insights of "{Book Title}" by {Author} in just 15 minutes. {One-sentence summary}. Covering {topic1}, {topic2}, and {topic3}.
```

**示例**:
```html
<!-- 中文 -->
<meta name="description" content="通过AI技术，15分钟读懂《原子习惯》核心精华。揭示如何通过微小改变带来巨大成就。涵盖习惯养成、行为设计、持续改进，让知识获取更高效。" />

<!-- 英文 -->
<meta name="description" content="Discover the key insights of 'Atomic Habits' by James Clear in just 15 minutes. Learn how tiny changes lead to remarkable results. Covering habit formation, behavior design, and continuous improvement." />
```

**规则**:
- 长度: 140-160 字符
- 包含主关键词（自然融入）
- 突出核心价值（15分钟、AI技术）
- 包含 3 个关键主题（提升相关性）
- 行动导向，吸引点击

---

#### Keywords 标签（可选）

虽然 Google 不使用，但对其他搜索引擎仍有价值。

**公式**:
```
{书名}, {作者}, {书名}摘要, {书名}解读, {分类}, AI读书, 书籍摘要, 15分钟读书
```

**示例**:
```html
<meta name="keywords" content="原子习惯, 詹姆斯·克利尔, 原子习惯摘要, 原子习惯解读, 自我提升, AI读书, 书籍摘要, 15分钟读书" />
```

---

### 1.3 Open Graph 标签（社交分享优化）

**必需标签**:
```html
<meta property="og:type" content="book" />
<meta property="og:title" content="原子习惯 - 詹姆斯·克利尔 | AI读书" />
<meta property="og:description" content="15分钟读懂《原子习惯》核心精华，学习如何通过微小改变带来巨大成就。" />
<meta property="og:url" content="https://aireading.app/zh/book/123/atomic-habits/" />
<meta property="og:image" content="https://aireading.app/og-images/book-123.jpg" />
<meta property="og:image:alt" content="原子习惯书籍封面" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="AIreading" />
<meta property="og:locale" content="zh_CN" />
```

**书籍特定标签**:
```html
<meta property="book:author" content="詹姆斯·克利尔" />
<meta property="book:isbn" content="978-0735211292" />
<meta property="book:release_date" content="2018-10-16" />
<meta property="book:tag" content="自我提升" />
<meta property="book:tag" content="习惯养成" />
<meta property="book:tag" content="行为心理学" />
```

**OG 图片规范**:
- 尺寸: 1200×630 px（标准）
- 格式: JPG（小文件）或 PNG（高质量）
- 大小: < 300 KB
- 内容: 书籍封面 + 品牌 logo + "15分钟精华摘要"标签

---

### 1.4 Twitter Card 标签

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@aireading_app" />
<meta name="twitter:title" content="原子习惯 - 15分钟精华摘要" />
<meta name="twitter:description" content="学习如何通过微小改变带来巨大成就" />
<meta name="twitter:image" content="https://aireading.app/og-images/book-123-twitter.jpg" />
<meta name="twitter:image:alt" content="原子习惯书籍封面" />
```

**Twitter 图片规范**:
- 尺寸: 1200×675 px（16:9 比例）
- 可与 OG 图片共用

---

### 1.5 Canonical 标签

防止重复内容问题:

```html
<link rel="canonical" href="https://aireading.app/zh/book/123/atomic-habits/" />
```

**场景**:
- ✅ 如果书籍有多个 URL（如带参数）
- ✅ 如果同一书籍有中英文页面（指向对应语言的 canonical）
- ✅ 确保始终使用 HTTPS 和一致的域名（带或不带 www）

---

### 1.6 Hreflang 标签（多语言）

告诉搜索引擎页面的语言版本:

```html
<link rel="alternate" hreflang="zh" href="https://aireading.app/zh/book/123/atomic-habits/" />
<link rel="alternate" hreflang="en" href="https://aireading.app/en/book/123/atomic-habits/" />
<link rel="alternate" hreflang="x-default" href="https://aireading.app/en/book/123/atomic-habits/" />
```

**规则**:
- ✅ 双向链接（中文页面链接英文，英文页面链接中文）
- ✅ 包含 `x-default`（默认语言）
- ✅ URL 必须完整（包含 protocol）

---

### 1.7 页面结构建议

#### H1 标签（只能有 1 个）

**中文**:
```html
<h1>《原子习惯》- 詹姆斯·克利尔</h1>
```

**英文**:
```html
<h1>Atomic Habits by James Clear</h1>
```

**规则**:
- 包含书名和作者
- 与 Title 标签相似但不完全相同
- 前置核心关键词

---

#### H2 标签（章节标题）

```html
<h2>📖 书籍简介</h2>
<h2>💡 核心观点</h2>
<h2>🔑 关键要点</h2>
<h2>📝 章节精华</h2>
<h2>⭐ 用户评价</h2>
<h2>📚 相关推荐</h2>
<h2>👤 关于作者</h2>
<h2>❓ 常见问题</h2>
```

**SEO 优化**:
- 在 H2 中自然融入关键词（如"核心观点"可改为"《原子习惯》核心观点"）
- 使用语义化标签（不要跳级）
- Emoji 增加可读性（可选）

---

#### 内容区块建议

**1. 书籍简介**（顶部，300-500 字）:
```html
<section>
  <h2>书籍简介</h2>
  <p>
    《原子习惯》是{作者}的{类型}畅销书，深入探讨了{核心主题}。
    本书通过{方法}，揭示了{核心发现}。
    适合{目标读者}阅读。
  </p>
</section>
```

**SEO 关键词密度**:
- 在首段 100 字内出现主关键词（书名）
- 自然重复 2-3 次（避免堆砌）
- 包含相关关键词（作者名、分类）

---

**2. 核心观点**（结构化列表）:
```html
<section>
  <h2>核心观点</h2>
  <ul>
    <li><strong>微小改变带来巨大成就</strong>：1% 的日常改进...</li>
    <li><strong>四步习惯循环</strong>：提示、渴望、反应、奖赏...</li>
    <li><strong>环境设计</strong>：改变环境而非依赖意志力...</li>
  </ul>
</section>
```

**SEO 优化**:
- 使用 `<strong>` 标签突出关键点（搜索引擎权重）
- 列表格式利于 Featured Snippet
- 每点 50-100 字说明

---

**3. FAQ 区块**（结构化数据机会）:
```html
<section>
  <h2>常见问题</h2>
  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">《原子习惯》主要讲什么？</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">
        《原子习惯》主要讲述如何通过微小的日常改变（原子级习惯）...
      </p>
    </div>
  </div>
</section>
```

**FAQ 问题建议**:
- {书名}主要讲什么？
- {书名}适合谁读？
- 读{书名}需要多久？
- {书名}和{竞品书}有什么区别？
- {作者}还有哪些著作？

---

**4. 作者简介**:
```html
<section>
  <h2>关于作者</h2>
  <p>
    <strong>{作者名}</strong>是{身份/职业}，{成就}。
    他的作品包括{其他著作}，{影响力描述}。
  </p>
  <a href="/zh/author/{author-id}/">查看更多{作者}的书籍 →</a>
</section>
```

**SEO 价值**:
- 增加页面内容深度
- 提供内链机会（作者页面）
- 增加页面停留时间

---

**5. 相关推荐**（内链金矿）:
```html
<section>
  <h2>如果你喜欢《{书名}》，你可能也喜欢</h2>
  <ul>
    <li><a href="/zh/book/456/deep-work/">《深度工作》- 卡尔·纽波特</a></li>
    <li><a href="/zh/book/789/thinking-fast-slow/">《思考快与慢》- 丹尼尔·卡尼曼</a></li>
  </ul>
</section>
```

**推荐算法**:
- 同一分类（自我提升）
- 同一作者
- 相似主题标签
- 用户行为数据（如购买记录）

---

### 1.8 Next.js Metadata 实现

使用现有的 `generateBookMetadata` 函数（已在 `SEOHead.tsx` 中）:

```typescript
// src/app/[locale]/book/[id]/page.tsx

import { generateBookMetadata } from '@/components/SEOHead'

export async function generateMetadata({ params }: { params: { locale: string; id: string } }) {
  const book = await getBookById(params.id)
  
  return generateBookMetadata({
    book: {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      coverImage: book.coverImage,
      rating: book.rating,
      reviewCount: book.reviewCount,
    },
    locale: params.locale as 'en' | 'zh',
    baseUrl: 'https://aireading.app',
  })
}
```

---

## 2. 内链策略

### 2.1 内链架构

**金字塔结构**:
```
首页 (Homepage)
  ├── 分类页 (Category Pages)
  │     ├── 书籍详情页 (Book Pages)
  │     ├── 书籍详情页
  │     └── 书籍详情页
  ├── 作者页 (Author Pages)
  │     ├── 书籍详情页
  │     └── 书籍详情页
  ├── 专题页 (Topic Pages)
  │     ├── 书籍详情页
  │     └── 书籍详情页
  └── 博客文章 (Blog Posts)
        └── 相关书籍详情页
```

**层级规则**:
- **Level 1 (首页)**: 最高权重，链接到主要分类和热门书籍
- **Level 2 (分类页、专题页)**: 链接到该分类下的所有书籍
- **Level 3 (书籍详情页)**: 互相链接（相关推荐）
- **最大深度**: 不超过 3 次点击到达任何页面

---

### 2.2 内链类型与锚文本

#### 类型 1: 导航内链

**位置**: Header / Footer / 侧边栏

**示例**:
```html
<!-- Header -->
<nav>
  <a href="/zh/">首页</a>
  <a href="/zh/categories/">全部分类</a>
  <a href="/zh/library/">我的书库</a>
</nav>

<!-- Footer -->
<footer>
  <h3>热门分类</h3>
  <ul>
    <li><a href="/zh/category/business/">商业管理</a></li>
    <li><a href="/zh/category/psychology/">心理学</a></li>
    <li><a href="/zh/category/self-improvement/">自我提升</a></li>
  </ul>
</footer>
```

**SEO 价值**:
- 分配页面权重（PageRank）
- 帮助搜索引擎发现新页面
- 降低跳出率

---

#### 类型 2: 上下文内链

**位置**: 内容正文中

**示例**:
```html
<p>
  如果你对习惯养成感兴趣，也推荐阅读
  <a href="/zh/book/456/power-of-habit/">《习惯的力量》</a>，
  该书从神经科学角度解析习惯形成机制。
</p>
```

**锚文本规则**:
- ✅ 使用描述性文字（书名 + 作者）
- ✅ 自然融入上下文
- ❌ 避免"点击这里"、"更多"等通用词
- ❌ 避免过度优化（重复同一关键词）

---

#### 类型 3: 相关推荐内链

**位置**: 页面底部

**示例**（使用卡片组件）:
```html
<section class="related-books">
  <h2>相关推荐</h2>
  <div class="book-grid">
    <article class="book-card">
      <a href="/zh/book/456/deep-work/">
        <img src="deep-work-cover.jpg" alt="深度工作封面" />
        <h3>深度工作</h3>
        <p>卡尔·纽波特</p>
      </a>
    </article>
    <!-- 更多推荐 -->
  </div>
</section>
```

**推荐数量**: 4-6 本（过多分散权重）

---

#### 类型 4: 面包屑导航

**位置**: 页面顶部

**示例**:
```html
<nav aria-label="breadcrumb">
  <ol>
    <li><a href="/zh/">首页</a></li>
    <li><a href="/zh/category/self-improvement/">自我提升</a></li>
    <li aria-current="page">原子习惯</li>
  </ol>
</nav>
```

**SEO 价值**:
- 显示页面层级关系
- 增强用户体验（减少迷失）
- 结构化数据机会（BreadcrumbList）

---

### 2.3 内链数量建议

| 页面类型 | 出链数量 | 入链目标 |
|---------|---------|---------|
| 首页 | 30-50 | 尽可能多 |
| 分类页 | 20-100（书籍列表） | 首页 + 其他分类 |
| 书籍详情页 | 10-20 | 分类页 + 相关书籍 |
| 博客文章 | 5-15 | 相关书籍 + 分类页 |

**规则**:
- ✅ 优先链接到重要页面
- ✅ 相关性 > 数量（不要硬凑）
- ❌ 避免单页过多出链（稀释权重）

---

### 2.4 孤岛页面检测与修复

**什么是孤岛页面**:
没有任何内链指向的页面（只能通过外部链接或 sitemap 发现）。

**检测方法**:
1. Google Search Console → 覆盖率 → 已发现但未编入索引
2. Screaming Frog SEO Spider → Orphan Pages
3. 自定义脚本检查数据库（所有页面 - 被链接页面）

**修复策略**:
- 从分类页链接到该页面
- 在相关书籍的推荐区块中添加
- 在博客文章中提及并链接

---

## 3. 面包屑导航

### 3.1 实现

**Next.js 组件示例**:

```typescript
// src/components/Breadcrumb.tsx

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-blue-600">
                {item.label}
              </a>
            ) : (
              <span className="text-gray-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

**使用示例**（书籍详情页）:

```typescript
// src/app/[locale]/book/[id]/page.tsx

<Breadcrumb
  items={[
    { label: '首页', href: '/zh/' },
    { label: '自我提升', href: '/zh/category/self-improvement/' },
    { label: '原子习惯' },
  ]}
/>
```

---

### 3.2 结构化数据（BreadcrumbList Schema）

**JSON-LD 格式**:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://aireading.app/zh/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "自我提升",
      "item": "https://aireading.app/zh/category/self-improvement/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "原子习惯"
    }
  ]
}
</script>
```

**效果**: Google 搜索结果中显示面包屑路径，提升点击率。

---

## 4. 结构化数据 (Schema.org)

### 4.1 Book Schema（书籍详情页）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "原子习惯",
  "alternateName": "Atomic Habits",
  "author": {
    "@type": "Person",
    "name": "詹姆斯·克利尔",
    "sameAs": "https://jamesclear.com"
  },
  "isbn": "978-0735211292",
  "bookFormat": "https://schema.org/EBook",
  "datePublished": "2018-10-16",
  "publisher": {
    "@type": "Organization",
    "name": "Avery"
  },
  "inLanguage": "zh-CN",
  "numberOfPages": 320,
  "genre": ["自我提升", "心理学"],
  "about": "如何通过微小的日常改变建立良好习惯",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1234",
    "bestRating": "5",
    "worstRating": "1"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "price": "0",
    "priceCurrency": "CNY"
  }
}
</script>
```

**关键字段**:
- `name`: 书名
- `author`: 作者信息
- `aggregateRating`: 评分（有助于获得星级展示）
- `offers`: 价格信息（免费也要标注）

---

### 4.2 ItemList Schema（分类页、书单页）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "自我提升类书籍",
  "description": "精选自我提升领域经典书籍的AI摘要",
  "url": "https://aireading.app/zh/category/self-improvement/",
  "numberOfItems": 50,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Book",
        "name": "原子习惯",
        "url": "https://aireading.app/zh/book/123/atomic-habits/",
        "image": "https://aireading.app/covers/atomic-habits.jpg"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Book",
        "name": "深度工作",
        "url": "https://aireading.app/zh/book/456/deep-work/"
      }
    }
    // ... 更多项目
  ]
}
</script>
```

**效果**: 可能获得 Rich Results（富媒体结果），如轮播展示。

---

### 4.3 FAQPage Schema（FAQ 区块）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "《原子习惯》主要讲什么？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "《原子习惯》主要讲述如何通过微小的日常改变（原子级习惯）来实现个人和职业上的巨大成就。作者詹姆斯·克利尔提出了"1%法则"..."
      }
    },
    {
      "@type": "Question",
      "name": "读完《原子习惯》需要多久？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "通过AIreading的AI摘要，你可以在15分钟内掌握《原子习惯》的核心精华。如果想阅读完整书籍，大约需要5-6小时。"
      }
    }
  ]
}
</script>
```

**效果**: 有机会出现在 Google 的 FAQ 富媒体结果中。

---

### 4.4 Review Schema（用户评价）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Book",
    "name": "原子习惯"
  },
  "author": {
    "@type": "Person",
    "name": "张三"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "reviewBody": "这本书改变了我对习惯养成的认知，通过AIreading的摘要快速掌握了核心要点，非常推荐！",
  "datePublished": "2024-02-01"
}
</script>
```

**注意**: 
- 只标记真实评价
- 避免虚假评价（违反 Google 政策）

---

### 4.5 Organization Schema（网站整体）

**放在首页**:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AIreading",
  "alternateName": "AI读书",
  "url": "https://aireading.app",
  "logo": "https://aireading.app/logo.png",
  "sameAs": [
    "https://twitter.com/aireading_app",
    "https://www.facebook.com/aireading",
    "https://www.linkedin.com/company/aireading"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "support@aireading.app"
  }
}
</script>
```

---

### 4.6 WebSite Schema（搜索框功能）

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AIreading",
  "url": "https://aireading.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://aireading.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

**效果**: Google 搜索结果中显示网站搜索框。

---

### 4.7 实施建议

**Next.js 实现**:

使用现有的 `StructuredData.tsx` 组件（已在项目中）:

```typescript
// src/components/StructuredData.tsx 已有实现

// 在页面中使用:
import { BookStructuredData } from '@/components/StructuredData'

export default function BookPage({ book }) {
  return (
    <>
      <BookStructuredData book={book} />
      {/* 页面内容 */}
    </>
  )
}
```

**验证工具**:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/

---

## 5. 技术 SEO 检查清单

### 5.1 页面性能

| 指标 | 目标 | 工具 |
|-----|------|------|
| **LCP** (最大内容绘制) | < 2.5s | PageSpeed Insights |
| **FID** (首次输入延迟) | < 100ms | Chrome DevTools |
| **CLS** (累积布局偏移) | < 0.1 | PageSpeed Insights |
| **TTFB** (首字节时间) | < 600ms | WebPageTest |
| **页面大小** | < 3 MB | Chrome DevTools |

**优化建议**:
- ✅ 使用 Next.js `<Image>` 组件（自动优化）
- ✅ 启用静态生成 (SSG) 优先于服务器渲染 (SSR)
- ✅ 实施代码分割和懒加载
- ✅ 使用 CDN（如 Vercel Edge Network）
- ✅ 压缩图片（WebP 格式）

---

### 5.2 移动端优化

**必须通过的测试**:
- ✅ Google Mobile-Friendly Test
- ✅ 字体大小 ≥ 16px
- ✅ 可点击元素间距 ≥ 48px
- ✅ 视口宽度正确配置: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- ✅ 避免横向滚动

---

### 5.3 索引控制

**Robots Meta 标签**:

```html
<!-- 允许索引（默认） -->
<meta name="robots" content="index, follow" />

<!-- 禁止索引（如登录页） -->
<meta name="robots" content="noindex, nofollow" />

<!-- 允许索引但不跟踪链接（如隐私页） -->
<meta name="robots" content="index, nofollow" />
```

**何时使用 noindex**:
- 登录/注册页面
- 搜索结果页（带参数）
- 用户个人资料页
- 重复内容页

---

### 5.4 分页处理

如果分类页有分页:

```html
<!-- 第 2 页 -->
<link rel="prev" href="https://aireading.app/zh/category/business/" />
<link rel="next" href="https://aireading.app/zh/category/business/?page=3" />
<link rel="canonical" href="https://aireading.app/zh/category/business/?page=2" />
```

**或使用 "View All" 页面**:
```html
<!-- 分页页面都指向完整列表 -->
<link rel="canonical" href="https://aireading.app/zh/category/business/all/" />
```

---

### 5.5 404 页面优化

**SEO 友好的 404 页面应包含**:
- 清晰的错误说明
- 搜索框
- 热门分类链接
- 返回首页链接
- 正确的 HTTP 状态码（404，而非 200）

**Next.js 实现**:
```typescript
// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>页面未找到</h1>
      <p>您访问的书籍可能已下架或 URL 有误</p>
      <SearchBox />
      <PopularCategories />
    </div>
  )
}
```

---

## 6. 内容生产工作流

### 6.1 新书上线 SEO 检查清单

- [ ] 书籍 slug 符合 SEO 规范（小写、连字符）
- [ ] Title 标签包含书名、作者、品牌词（50-60 字符）
- [ ] Description 吸引人且包含核心关键词（140-160 字符）
- [ ] H1 标签唯一且包含核心关键词
- [ ] 至少 300 字的书籍简介（原创内容）
- [ ] 包含 3-5 个核心观点（结构化列表）
- [ ] 至少 3 个 FAQ（带结构化数据）
- [ ] 作者简介和链接
- [ ] 4-6 本相关推荐（内链）
- [ ] Open Graph 图片（1200×630 px）
- [ ] Canonical 标签正确
- [ ] Hreflang 标签（如有多语言）
- [ ] Book Schema.org 结构化数据
- [ ] Breadcrumb 导航和 Schema
- [ ] 图片 alt 标签（封面、图表）
- [ ] 从分类页和相关书籍链接到新页面

---

### 6.2 内容更新频率

| 页面类型 | 更新频率 | 原因 |
|---------|---------|------|
| 书籍详情页 | 初次发布后很少更新 | 内容相对固定 |
| 分类页 | 每周（新书上线时） | 保持新鲜度 |
| 首页 | 每周 | 展示最新内容 |
| 博客/文章 | 每周 2-3 篇 | 吸引新流量 |
| 排行榜 | 每月 | 用户兴趣变化 |

---

## 7. 监控与迭代

### 7.1 关键指标

**使用 Google Search Console 监控**:
- 页面索引数量（覆盖率）
- 点击率（CTR）
- 平均排名
- 展示次数
- 热门查询词

**目标**:
- 索引率 > 95%（已提交 sitemap 的页面）
- 平均 CTR > 3%
- 首页关键词排名 < 20（前两页）

---

### 7.2 A/B 测试

**可测试元素**:
- Title 标签不同写法（包含"15分钟" vs "快速"）
- Description 长度（120 字 vs 160 字）
- H1 格式（书名 + 作者 vs 仅书名）
- OG 图片设计（纯封面 vs 封面+文字）

**工具**: Google Optimize, Vercel A/B Testing

---

### 7.3 季度复盘

**每季度检查**:
1. 哪些页面表现最好？（高流量、低跳出率）
2. 哪些关键词排名提升/下降？
3. 竞品有什么新动作？
4. 用户搜索意图有无变化？
5. 技术 SEO 有无新问题？

**行动**:
- 复制成功页面的模式
- 优化表现差的页面
- 调整内容策略

---

## 8. 总结

### 核心原则

1. **用户优先**: SEO 的最终目的是服务用户，而非欺骗搜索引擎
2. **内容为王**: 高质量、原创的内容是 SEO 的基础
3. **技术保障**: 快速的加载速度、良好的结构是前提
4. **持续优化**: SEO 是马拉松，而非短跑

### 快速启动

**Week 1 行动项**:
1. ✅ 为现有书籍页面添加完整的 Meta 标签
2. ✅ 实施面包屑导航和结构化数据
3. ✅ 优化前 20 本书的内容（至少 500 字）
4. ✅ 创建内链（相关推荐区块）
5. ✅ 提交 sitemap 到 Google Search Console

**持续改进**:
- 每周上线 5-10 本新书
- 每周发布 2 篇博客文章
- 每月检查 SEO 指标并调整策略

---

**文档版本**: 1.0  
**最后更新**: 2024-02-09  
**下次复盘**: 2024-05-09
