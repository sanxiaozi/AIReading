明白你的目标：让“他/生成器”在自动建站时默认就把 SEO（S）、用户体验/用户（U）与“记忆/个性化”、以及 AI 优化都一并纳入，不需要你每次重复提醒。下面给你一套可直接落地的「总控提示词 + 配置规范 + 生成流程 + 模板清单」，无论你用 v0、Framer AI、Cursor、Replit Agent、或你自己的生成器，都能套用。

一、总控提示词（放到系统级 / 每个项目默认加载）

把这段作为System / Developer Prompt固定加载（中英双语，直接复制用）。

中文版（推荐）

你是一名“AI 网站生成与优化工程师”。从现在起，为我生成的每一个网站都必须默认满足以下四大维度：
	1.	S（SEO）：

	•	语义化 HTML、H1-H3 结构与目录；每页唯一 <title>、meta description；
	•	自动生成并注入 Schema.org JSON-LD（根据页面类型选择 Article/Product/FAQ/Breadcrumb 等）；
	•	自动生成 sitemap.xml、robots.txt、canonical、Open Graph、Twitter Cards；
	•	站内链接策略（内容页↔列表页↔专题页），避免孤页；
	•	生成“关键词地图（Keyword Map）”与“专题集群（Topic Cluster）”，并将文案与链接锚文本对齐。

	2.	U（User/UX）：

	•	移动优先、可访问性（a11y）、Lighthouse ≥ 90（Performance/SEO/Best Practices/Accessibility）；
	•	首屏清晰价值主张、CTA 显著；
	•	关键路径 3 步内完成（咨询、下单、预约等）；
	•	结构化导航与面包屑；
	•	国际化与多语言（若配置）；深色/浅色模式；
	•	隐私与合规（Cookie/Consent、GDPR/PDPA 提示）。

	3.	记忆/个性化（Memory）：

	•	内置“站点记忆层”（见配置）：匿名/登录两种档位；
	•	记录事件：访问、停留、滚动、点击 CTA、搜索词、购买/提交表单；
	•	使用安全的本地存储 + 后端会话（可选）形成“偏好配置”（如语言、主题、常看分类）；
	•	个性化位点：推荐区块、标题副案、CTA 文案、默认筛选；
	•	明示用户可重置/关闭个性化（隐私优先）。

	4.	AI 优化（持续学习）：

	•	为每个关键页面提供“AI 文案/结构可调参数”（如标题变体、CTA 变体、区块顺序）；
	•	预置 轻量 A/B（或多臂老虎机） 开关与埋点；
	•	每 7 天产出一份“改进建议清单”（基于埋点指标：转化率、首屏交互时间、滚动深度、跳出率）；
	•	重要：不影响隐私与合规的前提下进行；任何个性化与优化均可一键关闭。

交付物要求：
	•	生成 /config/site.config.yaml（见下述规范）；
	•	输出一份 SEO&UX 审核清单.md（填好本次站点的要点与风险）；
	•	输出 /ai/ab-variants.json（列出每页的可调参数与默认变体）；
	•	代码内置 Lighthouse CI 与数据埋点（如自托管 Plausible/Umami 或 GA4，可在 config 里选择）；
	•	对于每个页面，附带自动生成的 JSON-LD 片段与放置位置。
如无特别说明，前端默认 Next.js（App Router）或 Astro，Tailwind，站点必须通过构建脚本自动产出 sitemap/robots。

English (if needed)

You are an “AI Website Generator & Optimizer.” For every site you create, enforce by default: SEO, User/UX, Memory/Personalization, and AI Optimization as first-class requirements…（同上要点的英文缩写版）

⸻

二、项目配置文件（site.config.yaml）

生成器每次新站点都读取它，确保“默认即最佳实践”。

site:
  name: "BrandName"
  domain: "example.com"
  locales: ["en", "zh"]
  defaultLocale: "en"
  darkMode: true
  compliance:
    cookie_consent: true
    privacy_page: "/privacy"
    terms_page: "/terms"

seo:
  keyword_map:
    - page: "/"
      primary: "核心关键词"
      secondary: ["同义词A","同义词B"]
    - page: "/category/ai-tools"
      primary: "AI 工具"
      secondary: ["AI 建站","AI 自动化"]
  topic_clusters:
    - hub: "/guides/seo"
      spokes: ["/guides/seo/basics","/guides/seo/technical","/guides/seo/content"]
  open_graph: true
  twitter_cards: true
  canonical: true
  sitemap: true
  robots: true
  jsonld:
    enabled: true
    types:
      - route: "/"
        type: "WebSite"
      - route: "/blog/[slug]"
        type: "Article"

ux:
  lighthouse_target: 90
  a11y: true
  cta:
    primary_text: "Get Started"
    secondary_text: "Contact Sales"
  nav:
    breadcrumbs: true
    max_depth: 3
  i18n_switcher: true

memory:
  enabled: true
  mode: "anonymous"   # "anonymous" | "account"
  store:
    client: "localStorage"
    server: "optional"
  track_events:
    - "page_view"
    - "scroll_depth"
    - "cta_click"
    - "search_query"
    - "form_submit"
  personalization_slots:
    - id: "home_reco"
      strategy: "recent_category"
    - id: "cta_copy"
      strategy: "best_performing"

ai_optimization:
  ab_test: "on"        # "on" | "off"
  bandit: "on"
  analytics: "plausible"  # "plausible" | "umami" | "ga4"
  weekly_recommendations: true


⸻

三、生成流程（让“他”固定遵守）
	1.	读取 site.config.yaml → 构建信息架构（IA）与路由。
	2.	生成基础骨架（Next.js/Astro）：布局、导航、页脚、国际化、暗色模式。
	3.	注入 SEO：<title>/<meta>、canonical、OG/Twitter、JSON-LD、sitemap、robots。
	4.	注入 UX：可访问性属性、移动端测试、首屏价值主张与 CTA、面包屑。
	5.	接入记忆层：
	•	前端：监听事件（view/scroll/cta/form/search）；
	•	本地存储偏好；
	•	个性化“位点”组件（基于策略选择内容/文案）。
	6.	接入 AI 优化：
	•	生成 /ai/ab-variants.json，例如：

{
  "/": {
    "hero_title": ["AI网站生成更快", "让AI为你构建增长型网站"],
    "cta_primary": ["免费开始", "立即体验"]
  }
}


	•	埋点 + 轻量 A/B 或 Bandit；
	•	输出“每周优化建议”。

	7.	生成审核清单（SEO&UX 审核清单.md）并在构建日志里打印关键分数。

⸻

四、页面级必备模板（片段可直接复用）

1) Head 模板（Next.js App Router）

export const metadata = {
  title: "页面标题 | 品牌名",
  description: "不超过 160 字，包含主关键词与价值点。",
  alternates: { canonical: "https://example.com/route" },
  openGraph: {
    title: "页面标题",
    description: "简述价值点",
    url: "https://example.com/route",
    siteName: "品牌名",
    images: [{ url: "/og.jpg" }],
    type: "website"
  },
  twitter: { card: "summary_large_image" }
}

2) JSON-LD（Article 示例）

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"Article",
  "headline":"文章标题",
  "datePublished":"2025-10-31",
  "dateModified":"2025-10-31",
  "author":{"@type":"Person","name":"Brand Team"},
  "publisher":{"@type":"Organization","name":"BrandName"},
  "mainEntityOfPage":{"@type":"WebPage","@id":"https://example.com/blog/slug"}
}
</script>

3) robots.txt（含重要规则）

User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://example.com/sitemap.xml

4) 面包屑（Breadcrumb JSON-LD）

<script type="application/ld+json">
{
 "@context":"https://schema.org",
 "@type":"BreadcrumbList",
 "itemListElement":[
   {"@type":"ListItem","position":1,"name":"首页","item":"https://example.com/"},
   {"@type":"ListItem","position":2,"name":"博客","item":"https://example.com/blog"}
 ]
}
</script>


⸻

五、埋点与记忆（轻量实现思路）
	•	事件监听器：page_view（路由变更）、scroll_depth（25/50/75%）、cta_click（data-attr 标识）、search_query、form_submit。
	•	客户端存储（匿名）：
	•	preferredLocale、theme、lastVisitedCategory、recentViewed（最多 10 条）。
	•	个性化组件：
	•	推荐区块：优先显示用户最近浏览分类/主题；
	•	CTA 文案：根据历史点击率/停留时间选择变体；
	•	隐私：
	•	提供“关闭个性化”与“一键清空本地偏好”按钮；
	•	若切到“account”模式，再使用后端会话/用户表去保存更细粒度的偏好（加上同意书）。

⸻

六、AI 优化落地（不侵入业务的最小闭环）
	•	数据：用 Plausible/Umami 自托管（无 Cookie 模式可选），或 GA4。
	•	算法：默认先 A/B（易解释），转化样本足够后切多臂老虎机（缩短收敛期）。
	•	目标：每个页面定义 1 个主目标（如提交表单/购买），以及 1-2 个次目标（滚动深度/二跳）。
	•	产出：
	•	/ai/ab-variants.json 管变体；
	•	/ai/weekly-report.md 自动汇总本周对比、显著性、下一步建议（如“将首页 hero_title 固定为变体 B；为 /pricing 添加 FAQ JSON-LD；把 CTA 从折扣语换为价值语”）。

⸻

七、审核清单（生成器每次都要自填）

SEO：标题/描述唯一；H 标签分层；内链；JSON-LD；sitemap/robots；图片 alt；5 条以上相关外链策略。
UX：首屏 3 秒可理解；CTA 醒目；移动端可点击区间≥44px；表单 < 6 字段；可访问性对比度通过。
记忆：事件是否记录？个性化可关？隐私文本是否到位？
AI 优化：变体是否生效？目标是否采集？周报是否产出？

⸻

八、团队对接与“告诉他怎么集成”
	1.	把上面的系统级 Prompt固化到你们的生成器“系统提示”位置。
	2.	模板仓库预置 /config/site.config.yaml、/ai/ab-variants.json、JSON-LD 片段与 Head 模板。
	3.	脚手架命令：npx create-site --with-seo-ux-memory-ai（内部命令即可）
	4.	CI：
	•	构建后跑 Lighthouse CI，分数低于阈值直接失败；
	•	自动生成并上传 sitemap.xml，校验 robots；
	•	触发一次“周报生成”dry-run。
	5.	运行时：加载 site.config.yaml → 注入 SEO/UX → 记忆层 hook → AI 变体渲染 → 埋点。
	6.	文档：在 README 顶部写“本项目已默认启用：SEO|UX|Memory|AI-Optimization”，附上关停方法。

⸻

九、给“他”的一句话启动命令（你每次新站只说这一句即可）

“按默认 S|U|记忆|AI 优化规范创建网站：读取 site.config.yaml，生成页面与 JSON-LD，产出 SEO&UX 审核清单.md 与 /ai/ab-variants.json，开启埋点与最小 A/B，并输出一份周报模板。”

⸻
