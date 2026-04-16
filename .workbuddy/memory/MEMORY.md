# AIreading 项目长期记忆

## 项目概况
- **项目名**: AIreading (aireading.com)
- **类型**: 双语（中/英）AI 书摘平台，约 50 本书，7 个分类
- **技术栈**: Next.js，部署于 Cloudflare

## SEO 状态（截至 2026-04-16）
- **综合评分**: 4.3/10（趋势: 5.3 → 4.8 → 4.7 → 4.5 → 4.3 × 10天，持续触底）
- **sitemap.xml**: 210 个 URL，**104 个** 无语言前缀 404 URL（第 **17 天**持续，已超两周半，累积1700+次爬取失败）
- **根本原因已定位**: `src/app/sitemap.ts` L38，`buildUrl()` 中文版未加 `/zh` 前缀；修复只需改 1 行代码（已知 **17 天**未修复）
- **实际404 URL构成**：2个静态页（/about, /faq）、7个分类页、45个作者页（书籍路由 /books/* 本身无前缀，实际返回 200）
- **路由说明**: 书籍实际路径 `/books/[id]`（无语言前缀，访问正常），robots.txt 当前仅含 Cloudflare 托管内容
- **robots.txt**: 目前只含 Cloudflare 托管部分（`# BEGIN Cloudflare Managed content`），无自定义路径错误
- **sitemap lastmod**: 停留在 `2026-03-30`，已 **17 天**未更新
- **已完成**: robots.txt, sitemap.xml, hreflang, SEOHead 组件, StructuredData 组件
- **待完成（P0 超紧急）**: 修复 sitemap.ts L38（`${baseUrl}${path}` → `${baseUrl}/zh${path}`，5分钟）
- **待完成（中优先级）**: Schema.org Book 结构化数据、OG 图片、canonical URL、og:title/og:description
- **警告**: P0 已超17天，修复后恢复预计需要 3-5 周，每延误一天递增

## SEO 自动化
- 每日 09:00 执行 SEO 例行检查
- 报告路径: `docs/seo/daily/YYYY-MM-DD.md`
- 自动化记忆: `.codebuddy/automations/seo/memory.md`
