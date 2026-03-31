# AIreading 项目长期记忆

## 项目概况
- **项目名**: AIreading (aireading.com)
- **类型**: 双语（中/英）AI 书摘平台，约 50 本书，7 个分类
- **技术栈**: Next.js，部署于 Cloudflare

## SEO 状态（截至 2026-03-31）
- **综合评分**: 5.3/10
- **sitemap.xml**: 210 个 URL，但存在约 20+ 无语言前缀的 404 URL（/about, /faq, /category/*）
- **路由问题**: 书籍页面实际路径为 `/books/[id]`，而 `/zh/book/[id]/` 308→404，路由命名不一致
- **已完成**: robots.txt, sitemap.xml, hreflang, SEOHead 组件, StructuredData 组件
- **待完成**: Schema.org Book 结构化数据、OG 图片生成、canonical URL 修复、sitemap 路由修复

## SEO 自动化
- 每日 09:00 执行 SEO 例行检查
- 报告路径: `docs/seo/daily/YYYY-MM-DD.md`
- 自动化记忆: `.codebuddy/automations/seo/memory.md`
