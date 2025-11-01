# AiReading 域名配置文档

## 官方域名

**主域名**: `aireading.com`

---

## DNS 配置建议

### 主要记录

#### A 记录（用于主域名和 www）

```
类型    名称           值/目标
A       @              [Vercel IP 地址]
A       www            [Vercel IP 地址]
```

#### CNAME 记录（CDN 和服务）

```
类型    名称           值/目标
CNAME   api            api.aireading.com
CNAME   cdn            cdn.aireading.com
CNAME   storage        storage.aireading.com
```

### 邮箱配置（可选）

```
类型    名称           值/目标              优先级
MX      @              mail.aireading.com   10
```

### SSL/TLS

- 使用 Vercel 自动提供的 SSL 证书
- 或使用 Let's Encrypt 免费证书
- 强制 HTTPS 重定向

---

## 环境变量配置

### 前端（Next.js）

```env
# .env.production
NEXT_PUBLIC_SITE_URL=https://aireading.com
NEXT_PUBLIC_API_URL=https://api.aireading.com
NEXT_PUBLIC_CDN_URL=https://cdn.aireading.com
NEXT_PUBLIC_STORAGE_URL=https://storage.aireading.com

# 分析工具
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=aireading.com
```

### 后端（API）

```env
# .env.production
ALLOWED_ORIGINS=https://aireading.com,https://www.aireading.com
CORS_ORIGINS=https://aireading.com

# 数据库
DATABASE_URL=postgresql://user:pass@host:5432/aireading_production

# 对象存储
S3_BUCKET=aireading-production
MINIO_ENDPOINT=storage.aireading.com

# OAuth 回调
GOOGLE_OAUTH_REDIRECT_URI=https://aireading.com/auth/callback/google
```

---

## URL 结构规范

### 多语言路由

```
https://aireading.com/en        # 英语版首页
https://aireading.com/zh        # 中文版首页
https://aireading.com/th        # 泰语版首页
https://aireading.com/id        # 印尼语版首页
```

### 核心页面

```
https://aireading.com/[locale]/browse                    # 分类浏览
https://aireading.com/[locale]/category/business         # 分类详情
https://aireading.com/[locale]/book/atomic-habits        # 书籍详情
https://aireading.com/[locale]/library                   # 用户书架
https://aireading.com/[locale]/notes                     # 用户笔记
https://aireading.com/[locale]/search?q=productivity     # 搜索
https://aireading.com/[locale]/settings                  # 设置
```

### API 端点

```
https://api.aireading.com/v1/books                # 书籍列表
https://api.aireading.com/v1/books/:id            # 书籍详情
https://api.aireading.com/v1/auth/login           # 用户登录
https://api.aireading.com/v1/chat/book/:id        # AI 对话
```

### 静态资源

```
https://cdn.aireading.com/images/covers/book-123.jpg     # 书籍封面
https://cdn.aireading.com/og/book-123.png                # OG 图片
https://storage.aireading.com/audio/book-123-short.mp3   # 音频文件
```

---

## SEO 配置

### Canonical URLs

所有页面的 canonical URL 指向主域名：

```html
<link rel="canonical" href="https://aireading.com/en/book/atomic-habits" />
```

### Sitemap

```
https://aireading.com/sitemap.xml
https://aireading.com/sitemap-en.xml
https://aireading.com/sitemap-zh.xml
https://aireading.com/sitemap-th.xml
https://aireading.com/sitemap-id.xml
```

### Robots.txt

```
https://aireading.com/robots.txt
```

---

## 社交媒体链接

### 官方账号（示例）

- Twitter/X: https://twitter.com/aireading
- Facebook: https://facebook.com/aireading
- LinkedIn: https://linkedin.com/company/aireading
- YouTube: https://youtube.com/@aireading
- Instagram: https://instagram.com/aireading

---

## 品牌邮箱建议

```
support@aireading.com       # 用户支持
hello@aireading.com         # 通用邮箱
team@aireading.com          # 团队邮箱
security@aireading.com      # 安全报告
press@aireading.com         # 媒体联系
noreply@aireading.com       # 系统邮件（不接收回复）
```

---

## 子域名规划

| 子域名    | 用途                   | 示例                                |
| --------- | ---------------------- | ----------------------------------- |
| `www`     | 主站（重定向到根域名） | www.aireading.com → aireading.com   |
| `api`     | 后端 API 服务          | api.aireading.com/v1/books          |
| `cdn`     | CDN 静态资源           | cdn.aireading.com/images/logo.png   |
| `storage` | 对象存储（音频文件）   | storage.aireading.com/audio/123.mp3 |
| `admin`   | CMS 管理后台（内部）   | admin.aireading.com                 |
| `staging` | 预发布环境             | staging.aireading.com               |
| `dev`     | 开发环境               | dev.aireading.com                   |
| `docs`    | 文档站点               | docs.aireading.com                  |
| `status`  | 系统状态页             | status.aireading.com                |

---

## Vercel 部署配置

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://aireading.com"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_SITE_URL": "https://aireading.com"
    }
  }
}
```

### 自定义域名设置

1. 在 Vercel 项目设置中添加域名：`aireading.com`
2. 添加 www 重定向：`www.aireading.com` → `aireading.com`
3. 配置 DNS 记录（Vercel 会提供具体值）
4. 等待 SSL 证书自动生成

---

## 安全配置

### HTTPS 强制重定向

所有 HTTP 请求自动重定向到 HTTPS

### HSTS Header

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### CSP (Content Security Policy)

```
Content-Security-Policy: default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://cdn.aireading.com data:;
  media-src 'self' https://storage.aireading.com;
  connect-src 'self' https://api.aireading.com https://plausible.io;
  font-src 'self' data:;
  frame-ancestors 'none';
```

---

## 监控与分析

### Google Search Console

- 验证域名：aireading.com
- 提交 sitemap：https://aireading.com/sitemap.xml

### Analytics

- Plausible: aireading.com
- Google Analytics 4: aireading.com

### Uptime Monitoring

- UptimeRobot 监控：https://aireading.com
- 检查频率：每 5 分钟

---

## 备份域名（可选）

如果需要备用域名或品牌保护：

```
aireading.net      # 备用域名
aireading.io       # 技术社区域名
aireading.org      # 非盈利/教育域名
```

建议将这些域名重定向到主域名 `aireading.com`

---

## CDN 配置（CloudFlare 可选）

如果使用 CloudFlare：

1. 添加域名到 CloudFlare
2. 更新 DNS nameservers
3. 启用以下功能：
   - ✅ SSL/TLS（Full Strict）
   - ✅ Auto Minify（HTML, CSS, JS）
   - ✅ Brotli Compression
   - ✅ HTTP/2
   - ✅ HTTP/3 (QUIC)
   - ✅ 0-RTT Connection Resumption
   - ✅ WebSockets

---

## 检查清单

部署前检查：

- [ ] DNS 记录已配置
- [ ] SSL 证书已生效
- [ ] www 重定向到主域名
- [ ] API 子域名可访问
- [ ] CDN 子域名可访问
- [ ] 所有环境变量已设置
- [ ] CORS 配置正确
- [ ] OAuth 回调 URL 已更新
- [ ] Sitemap 可访问
- [ ] robots.txt 可访问
- [ ] 社交媒体分享测试通过
- [ ] Google Search Console 已验证
- [ ] Analytics 追踪正常

---

**最后更新**: 2025-11-01
**维护人**: DevOps 团队
**域名注册商**: [待填写]
**DNS 提供商**: [待填写]
**SSL 证书提供商**: Vercel / Let's Encrypt
