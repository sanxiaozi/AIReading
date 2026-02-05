# SEO Implementation Checklist

本检查清单用于追踪 AIreading 的 SEO 实施进度。

## 📋 高优先级任务

### ✅ 已完成的组件创建

- [x] 创建 `SEOHead.tsx` 组件
  - [x] 支持 Open Graph 标签
  - [x] 支持 Twitter Card 标签
  - [x] 支持基础 SEO 标签
  - [x] 支持多语言配置
  - [x] 支持 robots 配置

- [x] 创建 `StructuredData.tsx` 组件
  - [x] Book Schema（书籍结构化数据）
  - [x] WebSite Schema（网站结构化数据）
  - [x] Organization Schema（组织结构化数据）
  - [x] Breadcrumb Schema（面包屑导航）
  - [x] Article Schema（文章/博客）
  - [x] FAQ Schema（常见问题）
  - [x] ItemList Schema（列表页）

- [x] 创建 SEO 配置和工具
  - [x] `seo-config.ts` - 站点配置常量
  - [x] `seo-validator.ts` - SEO 验证工具
  - [x] 页面模板示例

- [x] 创建使用文档
  - [x] `README.md` - 完整使用指南
  - [x] `BookPageTemplate.tsx` - 书籍页面示例
  - [x] `HomePageTemplate.tsx` - 首页示例

---

## 🔧 待实施的页面集成

### 书籍页面 (`/[locale]/book/[id]/`)

- [ ] 集成 `generateBookMetadata`
- [ ] 添加 Book Schema
- [ ] 添加 Breadcrumb Schema
- [ ] 生成书籍 OG 图片（1200x630px）
- [ ] 修复 canonical URL（指向自身而非首页）
- [ ] 测试多语言版本

**文件位置**: `src/app/[locale]/book/[id]/page.tsx`

**优先级**: 🔴 HIGH（修复 canonical 错误）

---

### 首页 (`/[locale]/`)

- [ ] 集成 `generateHomeMetadata`
- [ ] 添加 WebSite Schema
- [ ] 添加 Organization Schema
- [ ] 添加 Featured Books ItemList Schema
- [ ] 生成首页 OG 图片（1200x630px，分别 en/zh 版本）
- [ ] 测试多语言版本

**文件位置**: `src/app/[locale]/page.tsx`

**优先级**: 🔴 HIGH

---

### 分类页面 (`/[locale]/category/[id]/`)

- [ ] 集成 `generateCategoryMetadata`
- [ ] 添加 ItemList Schema（分类下的书籍列表）
- [ ] 添加 Breadcrumb Schema
- [ ] 生成分类 OG 图片（7 个分类各一张）
- [ ] 测试所有分类

**文件位置**: `src/app/[locale]/category/[id]/page.tsx`

**优先级**: 🟡 MEDIUM

---

### 书库页面 (`/[locale]/library/`)

- [ ] 集成基础 metadata
- [ ] 添加 ItemList Schema（所有书籍）
- [ ] 添加 Breadcrumb Schema
- [ ] 生成 OG 图片

**文件位置**: `src/app/[locale]/library/page.tsx`

**优先级**: 🟡 MEDIUM

---

### 搜索页面 (`/[locale]/search/`)

- [ ] 集成基础 metadata
- [ ] 添加 `robots: noindex, follow`
- [ ] 确保不被搜索引擎索引

**文件位置**: `src/app/[locale]/search/page.tsx`

**优先级**: 🟡 MEDIUM

---

### 我的书库 (`/[locale]/my-library/`)

- [ ] 集成基础 metadata
- [ ] 添加 `robots: noindex, follow`
- [ ] 确保不被搜索引擎索引（个人化内容）

**文件位置**: `src/app/[locale]/my-library/page.tsx`

**优先级**: 🟢 LOW

---

### 条款和隐私页面

- [ ] 隐私政策页面 SEO
- [ ] 服务条款页面 SEO
- [ ] Article Schema（如适用）

**优先级**: 🟢 LOW

---

## 🎨 OG 图片生成

### 需要创建的图片

1. **书籍 OG 图片** (50 张)
   - [ ] 为每本书生成 1200x630px 图片
   - [ ] 包含书籍封面 + AIreading 品牌
   - [ ] 双语版本（或通用设计）
   - **脚本位置**: 待创建 `scripts/generate-og-images.ts`

2. **首页 OG 图片** (2 张)
   - [ ] 英文版: `og-images/home-en.jpg`
   - [ ] 中文版: `og-images/home-zh.jpg`

3. **分类 OG 图片** (7 张)
   - [ ] Business / 商业
   - [ ] Psychology / 心理学
   - [ ] Self-Improvement / 自我提升
   - [ ] History / 历史
   - [ ] Philosophy / 哲学
   - [ ] Science / 科学
   - [ ] Fiction / 小说

4. **默认 OG 图片** (1 张)
   - [ ] `og-images/default.jpg` (通用备用图)

**总计**: ~60 张图片

**优先级**: 🔴 HIGH

---

## 🧪 测试和验证

### Schema.org 验证

- [ ] 使用 [Schema.org Validator](https://validator.schema.org/) 测试所有 JSON-LD
- [ ] 使用 [Google Rich Results Test](https://search.google.com/test/rich-results) 测试
- [ ] 确保没有警告或错误

### Open Graph 验证

- [ ] 使用 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 测试
- [ ] 使用 [Twitter Card Validator](https://cards-dev.twitter.com/validator) 测试
- [ ] 使用 [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) 测试
- [ ] 确保图片正确显示

### Meta 标签验证

- [ ] 检查所有页面的 title 长度（中文 ≤30，英文 ≤60）
- [ ] 检查所有页面的 description 长度（中文 ≤80，英文 ≤160）
- [ ] 确保所有 canonical URL 正确

### URL 结构验证

- [ ] 使用 `seo-validator.ts` 验证所有 URL
- [ ] 确保 URL 都以 `/` 结尾
- [ ] 确保 URL 都是小写
- [ ] 没有双斜杠或特殊字符

---

## 📊 Google Search Console 设置

- [ ] 验证网站所有权
- [ ] 提交 sitemap.xml
  - [ ] `https://aireading.app/sitemap.xml`
- [ ] 监控索引状态
- [ ] 检查 Coverage 报告
- [ ] 检查 Enhancements（结构化数据）
- [ ] 设置 URL 检查

---

## 🔍 Bing Webmaster Tools 设置

- [ ] 验证网站所有权
- [ ] 提交 sitemap.xml
- [ ] 监控爬取统计
- [ ] 检查 SEO 报告

---

## 📈 性能监控

### Core Web Vitals

- [ ] 在 Google Search Console 中监控
- [ ] 确保所有页面 LCP < 2.5s
- [ ] 确保所有页面 FID < 100ms
- [ ] 确保所有页面 CLS < 0.1

### 页面速度

- [ ] 使用 [PageSpeed Insights](https://pagespeed.web.dev/) 测试关键页面
- [ ] 移动端分数 > 85
- [ ] 桌面端分数 > 90

---

## 🚀 部署前检查清单

### 生产环境发布前必须完成

- [ ] 所有 HIGH 优先级任务完成
- [ ] 所有页面通过 Schema.org 验证
- [ ] 所有 OG 图片已生成并上传
- [ ] robots.txt 正确配置
- [ ] sitemap.xml 正确生成
- [ ] canonical URL 全部正确
- [ ] 测试至少 5 个页面的社交分享预览
- [ ] 在开发环境运行 SEO 验证脚本

---

## 📝 持续维护任务

### 每周

- [ ] 检查 Google Search Console 的新错误
- [ ] 监控索引状态变化
- [ ] 检查新添加内容的 SEO 配置

### 每月

- [ ] 审查 Core Web Vitals
- [ ] 更新 sitemap lastmod 时间戳
- [ ] 检查竞争对手的 SEO 策略
- [ ] 分析搜索流量数据

### 每季度

- [ ] 全面 SEO 审计
- [ ] 更新关键词策略
- [ ] 优化表现不佳的页面
- [ ] 审查和更新结构化数据

---

## 🎯 成功指标

### 短期目标（30天）

- [ ] 100% 页面被 Google 索引
- [ ] 50+ 书籍页面出现富文本片段（rich snippets）
- [ ] 社交分享 CTR 提升 30%

### 中期目标（90天）

- [ ] 自然搜索流量增长 50%
- [ ] 10+ 关键词进入搜索结果前 10
- [ ] 平均 CTR 提升到 5%+

### 长期目标（180天）

- [ ] 自然搜索流量增长 100%
- [ ] 核心关键词排名前 5
- [ ] 品牌搜索量增长 3x

---

## 📞 需要帮助？

- **Schema.org 问题**: 查阅 [Schema.org 文档](https://schema.org/)
- **Next.js Metadata**: 查阅 [Next.js 文档](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- **Google Search Console**: [帮助中心](https://support.google.com/webmasters/)

---

**最后更新**: 2025-02-05  
**负责人**: SEO Team  
**状态**: 🟡 In Progress
