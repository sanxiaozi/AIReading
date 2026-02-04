# SEO Specialist Plan - AiReading

## Role Overview
负责网站搜索引擎优化，与内容团队紧密配合，确保每本书的内容能被搜索引擎良好收录和排名。

## Week 1: 技术SEO基础

### Day 1-2: 网站审计
- [ ] 运行技术SEO审计 (Screaming Frog / Ahrefs)
- [ ] 检查页面加载速度 (Core Web Vitals)
- [ ] 验证移动端适配
- [ ] 检查robots.txt和sitemap.xml

### Day 3-4: 基础优化
- [ ] 设置Google Search Console
- [ ] 设置Bing Webmaster Tools
- [ ] 配置结构化数据 (Book Schema)
- [ ] 优化meta标签模板

### Day 5: 与内容团队对接
- [ ] 建立关键词研究流程
- [ ] 制定内容优化清单
- [ ] 确定每本书的目标关键词格式

## Week 2-4: 内容SEO

### 关键词策略
每本书需要覆盖的关键词类型：

```
主关键词: {书名} + 读书笔记/书评/总结
长尾词: {书名} + 核心观点/主要内容/精华
问题词: {书名} + 讲了什么/值得读吗/适合谁
```

### 页面优化清单
每个书籍页面需要：

```markdown
□ Title: {书名}读书笔记 | 3分钟掌握核心观点 - AiReading
□ Meta Description: 150字内，包含书名+核心价值+行动号召
□ H1: 书名
□ H2: 关键要点、核心观点、作者介绍等
□ Alt Text: 所有图片添加描述性alt
□ Internal Links: 关联推荐书籍
□ Schema Markup: Book + Review + FAQ
```

### 内容协作流程
```
内容团队产出 → SEO审核优化 → 发布上线 → 监控排名
     ↑                                    |
     └────────── 根据数据反馈调整 ←────────┘
```

## 技术实现

### 1. 结构化数据模板
```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "书名",
  "author": { "@type": "Person", "name": "作者" },
  "review": {
    "@type": "Review",
    "reviewBody": "简短书评",
    "author": { "@type": "Organization", "name": "AiReading" }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "100"
  }
}
```

### 2. 动态Sitemap
- 每本书一个URL
- 包含lastmod日期
- 优先级: 首页1.0, 书籍页0.8, 分类页0.6

### 3. 内部链接策略
- 相同分类书籍互链
- "读完这本，推荐阅读"板块
- 首页热门/最新书籍轮换

## KPIs

### 月度目标
| 指标 | 目标 |
|------|------|
| 索引页面数 | 100% 书籍页被索引 |
| 平均排名 | 目标关键词前20 |
| 有机流量 | 月增长 30% |
| 点击率 | 搜索结果 CTR > 5% |

### 周报内容
1. 新索引页面数
2. 关键词排名变化
3. 流量来源分析
4. 下周优化计划

## 工具清单
- Google Search Console (必需)
- Ahrefs / SEMrush (关键词研究)
- Screaming Frog (技术审计)
- PageSpeed Insights (性能)
- Schema Markup Validator (结构化数据)

## 与内容团队的协作

### 内容发布前
1. 提供目标关键词
2. 审核标题和描述
3. 检查内容结构

### 内容发布后
1. 提交Search Console索引
2. 监控排名变化
3. 反馈优化建议

## Notes
- SEO是长期工作，3-6个月见效果
- 内容质量 > 关键词堆砌
- 用户体验是最重要的排名因素
