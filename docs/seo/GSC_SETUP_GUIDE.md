# Google Search Console 配置指南

## 概述
Google Search Console (GSC) 是 Google 提供的免费工具，用于监控和维护网站在 Google 搜索结果中的表现。本指南将帮助你完成从验证域名到日常监控的完整配置流程。

---

## 1. 前期准备

### 1.1 需要准备的内容
- ✅ 已完成的 `robots.txt` (位于 `/public/robots.txt`)
- ✅ 已生成的 `sitemap.xml` (位于 `/public/sitemap.xml`)
- 域名管理权限（DNS 或服务器文件访问权限）
- Google 账号

### 1.2 访问 Google Search Console
1. 访问: https://search.google.com/search-console
2. 使用 Google 账号登录
3. 点击"添加资源"开始配置

---

## 2. 验证域名所有权

Google 提供多种验证方式，选择最适合你的一种：

### 方式 1: DNS 验证（推荐）⭐

**优点**: 
- 一次验证，覆盖所有子域名
- 永久有效，无需维护
- 最安全

**步骤**:
1. 在 GSC 中选择"域名资源"类型
2. 输入域名: `aireading.app`
3. Google 会提供一个 TXT 记录，格式如下:
   ```
   google-site-verification=xxxxxxxxxxxxxxxxxxxxx
   ```
4. 登录域名提供商的 DNS 管理面板（如 Cloudflare, Namecheap）
5. 添加新的 DNS 记录:
   - **类型**: TXT
   - **名称/主机**: @ 或留空
   - **值**: 粘贴 Google 提供的验证码
   - **TTL**: 自动或 3600
6. 保存记录，等待 DNS 传播（通常 5-60 分钟）
7. 返回 GSC 点击"验证"

**示例**（Cloudflare）:
```
Type: TXT
Name: @
Content: google-site-verification=ABC123XYZ789...
TTL: Auto
```

---

### 方式 2: HTML 文件验证

**优点**: 
- 简单快捷
- 不需要 DNS 权限

**步骤**:
1. 在 GSC 中选择"网址前缀"类型
2. 输入完整 URL: `https://aireading.app`
3. 选择"HTML 文件"验证方式
4. 下载 Google 提供的 HTML 文件（如 `google1234567890abcdef.html`）
5. 将文件上传到网站根目录: `/public/google1234567890abcdef.html`
6. 确保可以访问: `https://aireading.app/google1234567890abcdef.html`
7. 返回 GSC 点击"验证"

**Next.js 项目位置**:
```
/public/
  ├── google1234567890abcdef.html  ← 放这里
  ├── robots.txt
  └── sitemap.xml
```

---

### 方式 3: HTML Meta 标签验证

**优点**: 
- 适合有代码访问权限的开发者
- 易于版本控制

**步骤**:
1. Google 会提供一个 meta 标签:
   ```html
   <meta name="google-site-verification" content="ABC123..." />
   ```
2. 在 Next.js 中添加到根 layout 或 metadata:

**方法 A: 在 `app/layout.tsx` 添加 metadata**
```typescript
export const metadata: Metadata = {
  verification: {
    google: 'ABC123...',  // 只需要 content 部分
  },
  // ... 其他 metadata
}
```

**方法 B: 在 SEOHead.tsx 的 generateMetadata 函数中添加**
```typescript
export interface SEOProps {
  // ... 现有字段
  googleVerification?: string  // 新增
}

export function generateMetadata(props: SEOProps): Metadata {
  return {
    // ... 现有配置
    verification: props.googleVerification ? {
      google: props.googleVerification,
    } : undefined,
  }
}
```

3. 部署更新后，返回 GSC 点击"验证"

---

### 方式 4: Google Analytics 验证

如果网站已配置 Google Analytics (GA4):
1. 确保使用相同的 Google 账号
2. GSC 会自动检测 GA 跟踪代码
3. 直接点击"验证"即可

---

### 方式 5: Google Tag Manager 验证

如果网站已配置 GTM:
1. 确保 GTM 容器代码在 `<head>` 中
2. GSC 会自动检测
3. 直接点击"验证"

---

## 3. 提交 Sitemap.xml

验证成功后，立即提交 sitemap：

### 3.1 提交步骤
1. 进入 GSC 控制台
2. 选择你的资源（网站）
3. 左侧菜单 → **站点地图**（Sitemaps）
4. 输入 sitemap URL: `sitemap.xml`
5. 点击"提交"

### 3.2 多语言配置
如果项目有中英文 sitemap:
```
sitemap.xml          (主索引)
sitemap-en.xml       (英文页面)
sitemap-zh.xml       (中文页面)
```

分别提交所有 sitemap URL。

### 3.3 验证提交成功
- 提交后，状态会显示"待处理"
- 通常 24-48 小时后会显示"成功"和已发现的 URL 数量
- 如果失败，检查错误信息并修复

### 3.4 常见错误处理

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| 无法获取 sitemap | URL 不可访问 | 检查 `/public/sitemap.xml` 是否存在，确保 robots.txt 没有屏蔽 |
| Sitemap 是 HTML | 返回了 HTML 页面而非 XML | 检查服务器配置，确保正确的 MIME 类型 `application/xml` |
| 格式错误 | XML 语法错误 | 使用 XML 验证器检查语法 |
| URL 超过限制 | 单个 sitemap > 50,000 URL | 拆分成多个 sitemap，使用 sitemap 索引文件 |

---

## 4. 配置监控指标

### 4.1 核心指标概览

| 指标 | 说明 | 目标 |
|-----|------|-----|
| **点击次数** | 用户从搜索结果点击的次数 | 持续增长 |
| **展示次数** | 页面在搜索结果中显示的次数 | 持续增长 |
| **点击率 (CTR)** | 点击次数 / 展示次数 | > 3% (平均) |
| **平均排名** | 页面在搜索结果中的平均位置 | < 10 (首页) |
| **覆盖率** | 被索引的页面数 | 接近 sitemap 中的 URL 数 |
| **移动设备可用性** | 移动端友好度 | 0 错误 |
| **页面体验** | Core Web Vitals | 绿色（良好）|

### 4.2 设置电子邮件通知
1. GSC 控制台 → **设置**（右上角齿轮图标）
2. **用户和权限** → 添加邮箱
3. **电子邮件通知** → 勾选:
   - ✅ 严重网站错误（如索引问题）
   - ✅ 手动操作（如处罚通知）
   - ✅ Sitemap 问题
   - ✅ 移动设备可用性问题
   - ✅ 安全问题

### 4.3 监控重点页面
使用"效果"报告筛选器:
```
过滤条件: 页面
规则: 包含 /book/
```
这样可以单独监控书籍详情页的表现。

### 4.4 设置自定义数据导出
1. 效果报告 → 点击"导出"按钮
2. 选择 Google Sheets 自动同步
3. 设置每周自动报告

---

## 5. 日常监控任务

### 5.1 每日检查（5 分钟）
- [ ] 查看"效果"概览，确认无异常下降
- [ ] 检查"覆盖率" → "错误"标签，处理新错误

### 5.2 每周检查（15 分钟）
- [ ] 分析"热门查询"，记录新关键词机会
- [ ] 检查"页面体验" → Core Web Vitals
- [ ] 查看"链接"报告，了解外链增长

### 5.3 每月检查（30 分钟）
- [ ] 导出数据，生成月度报告
- [ ] 对比上月数据，分析趋势
- [ ] 检查竞品排名变化
- [ ] 规划下月 SEO 优化重点

---

## 6. 常见问题处理

### Q1: 验证后多久能看到数据？
**A**: 通常需要 2-3 天。新网站可能需要 1-2 周才有足够数据。

### Q2: Sitemap 已提交，但 URL 未被索引？
**A**: 
1. 检查 robots.txt 是否允许抓取
2. 查看"覆盖率" → "已排除"，了解原因
3. 使用"网址检查"工具请求索引
4. 确保页面有独特的、高质量的内容

### Q3: "抓取错误"数量增加怎么办？
**A**:
1. 进入"覆盖率" → "错误"查看详情
2. 常见错误:
   - **404 错误**: 删除已不存在的 URL，或设置 301 重定向
   - **服务器错误 (5xx)**: 检查服务器稳定性
   - **Robots.txt 屏蔽**: 调整 robots.txt 规则
3. 修复后，使用"验证修复"功能

### Q4: 点击率低怎么办？
**A**:
1. 优化 Title 和 Description，增加吸引力
2. 使用数字、问题、行动号召（如"马上了解"）
3. 添加结构化数据，获得富媒体展示
4. 分析高 CTR 页面，复制成功经验

### Q5: 移动端可用性问题？
**A**:
1. 检查"移动设备可用性"报告
2. 常见问题:
   - 文字太小
   - 可点击元素距离太近
   - 内容宽度超过屏幕
3. 使用 Chrome DevTools 移动模拟器测试
4. 确保响应式设计正确

### Q6: Core Web Vitals 不达标？
**A**:
1. 使用 PageSpeed Insights 诊断: https://pagespeed.web.dev/
2. 优化重点:
   - **LCP (最大内容绘制)**: 优化图片、字体加载
   - **FID (首次输入延迟)**: 减少 JavaScript 执行时间
   - **CLS (累积布局偏移)**: 为图片/广告预留空间
3. 实施 Next.js 性能优化:
   - 使用 `next/image` 组件
   - 启用静态生成 (SSG)
   - 实施代码分割

---

## 7. 高级功能

### 7.1 URL 检查工具
手动测试单个 URL 的索引状态:
1. 左侧菜单 → **网址检查**
2. 输入完整 URL
3. 查看:
   - 是否已收录
   - 最后抓取时间
   - 移动/桌面端可用性
4. 点击"请求编入索引"加速收录

### 7.2 移除 URL
临时移除搜索结果中的页面:
1. 左侧菜单 → **移除**
2. 点击"新请求"
3. 输入 URL
4. 选择移除类型（临时移除 6 个月）

**注意**: 这是临时方案，永久移除需要:
- 返回 404/410 状态码，或
- 添加 `noindex` meta 标签

### 7.3 链接分析
了解外部链接和内部链接结构:
1. 左侧菜单 → **链接**
2. 查看:
   - **外部链接**: 哪些网站链接到你
   - **内部链接**: 站内链接分布
   - **热门链接页面**: 最受欢迎的页面

---

## 8. 与其他工具整合

### 8.1 Google Analytics 4 (GA4)
将 GSC 数据导入 GA4:
1. GA4 控制台 → **管理** → **Search Console 链接**
2. 点击"链接"，选择 GSC 资源
3. 在 GA4 报告中查看搜索数据

### 8.2 Looker Studio (原 Data Studio)
创建自定义 SEO 仪表盘:
1. 访问: https://lookerstudio.google.com/
2. 创建新报告
3. 添加数据源 → 选择 Search Console
4. 创建可视化图表（流量趋势、热门关键词等）

### 8.3 自动化报告
使用 Google Sheets 插件:
1. Google Sheets → **扩展程序** → **附加组件市场**
2. 搜索"Search Console"
3. 安装并授权
4. 自动拉取每日数据

---

## 9. 检查清单

### 首次配置
- [ ] 验证域名所有权（DNS 推荐）
- [ ] 提交 sitemap.xml
- [ ] 配置电子邮件通知
- [ ] 关联 Google Analytics（如有）
- [ ] 添加团队成员（如需要）

### 上线后 24 小时内
- [ ] 确认 sitemap 提交成功
- [ ] 使用"网址检查"工具测试关键页面
- [ ] 检查 robots.txt 是否正确配置

### 上线后 1 周
- [ ] 查看初步数据（展示/点击）
- [ ] 检查"覆盖率"是否有错误
- [ ] 验证移动端可用性

### 上线后 1 个月
- [ ] 生成首份月度报告
- [ ] 分析热门查询关键词
- [ ] 制定优化计划

---

## 10. 参考资源

- **官方文档**: https://support.google.com/webmasters
- **SEO 入门指南**: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- **结构化数据测试**: https://search.google.com/test/rich-results
- **移动友好测试**: https://search.google.com/test/mobile-friendly
- **PageSpeed Insights**: https://pagespeed.web.dev/

---

## 总结

Google Search Console 是 SEO 的核心工具。关键点:
1. ✅ 及时验证域名并提交 sitemap
2. 📊 定期检查核心指标，不要等问题爆发
3. 🔧 快速响应错误和警告
4. 📈 持续优化，基于数据而非猜测

**记住**: SEO 是长期工作，耐心和持续优化是成功的关键。
