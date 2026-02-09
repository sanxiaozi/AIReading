# 音频 CDN 配置说明

## 📋 概述

为了优化 Vercel 部署性能和减少构建时间，音频文件已迁移到独立的 CDN 服务器。

### 架构设计

```
aireading.com (Vercel)
    ↓ 前端代码
    ↓ 引用音频
    ↓
trading.aireading.com (本地服务器 + Cloudflare Tunnel)
    ↓ 音频文件 (308MB+)
    ↓ 静态文件服务
```

---

## 🔧 配置文件

### 1. 环境变量

**`.env.production`** (生产环境)
```env
NEXT_PUBLIC_AUDIO_CDN_URL=https://trading.aireading.com
NEXT_PUBLIC_SITE_URL=https://aireading.com
```

**`.env.local`** (本地开发)
```env
NEXT_PUBLIC_AUDIO_CDN_URL=http://localhost:3457
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 配置工具

**`src/lib/config.ts`**
```typescript
import { getAudioUrl } from '@/lib/config';

// 获取音频 URL
const url = getAudioUrl(29, 'zh', 'short');
// 返回: https://trading.aireading.com/audio/29/zh_short.mp3
```

---

## 🎯 使用方法

### 方式 1: 使用配置函数（推荐）

```typescript
import { getAudioUrl } from '@/lib/config';

function BookPage({ bookId }: { bookId: number }) {
  const audioUrl = getAudioUrl(bookId, 'zh', 'long');
  
  return <audio src={audioUrl} controls />;
}
```

### 方式 2: 使用 AudioPlayer 组件

```typescript
import { AudioPlayer } from '@/components/AudioPlayer';

function BookPage({ bookId }: { bookId: number }) {
  return (
    <AudioPlayer 
      bookId={bookId}
      language="zh"
      version="short"
    />
  );
}
```

### 方式 3: 直接使用环境变量

```typescript
const audioUrl = `${process.env.NEXT_PUBLIC_AUDIO_CDN_URL}/audio/${bookId}/zh_long.mp3`;
```

---

## 📁 音频文件路径规范

### URL 格式
```
{CDN_URL}/audio/{bookId}/{language}_{version}.mp3
```

### 示例
```
https://trading.aireading.com/audio/3/zh_short.mp3    # 人类简史 - 概要版
https://trading.aireading.com/audio/3/zh_long.mp3     # 人类简史 - 完整版
https://trading.aireading.com/audio/29/zh_short.mp3   # Elon Musk - 概要版
https://trading.aireading.com/audio/29/zh_long.mp3    # Elon Musk - 完整版
```

### 参数说明
- `bookId`: 书籍 ID (1-50)
- `language`: 语言代码
  - `zh`: 中文
  - `en`: 英文
- `version`: 版本类型
  - `short`: 概要版 (3-5 分钟)
  - `medium`: 中等版 (8-12 分钟)
  - `long`: 完整版 (15-20 分钟)

---

## 🚀 部署步骤

### 1. 本地开发
```bash
# 启动本地音频服务器
pm2 start aireading

# 本地预览
npm run dev
```

### 2. 部署到 Vercel
```bash
# 提交代码
git add .
git commit -m "feat: configure audio CDN"
git push origin main

# Vercel 会自动部署
```

### 3. 验证
访问以下 URL 确认音频可用：
- https://aireading.com/audio/3/zh_short.mp3 ❌ (会 404，因为重定向到实际 CDN)
- https://trading.aireading.com/audio/3/zh_short.mp3 ✅

---

## ⚙️ CDN 服务器配置

### 本地服务器 (trading.aireading.com)

**位置**: `/Users/arcade/aireading/public/audio/`

**服务**: Next.js + PM2
```bash
# 查看状态
pm2 list

# 重启服务
pm2 restart aireading

# 查看日志
pm2 logs aireading
```

**隧道**: Cloudflare Tunnel
```bash
# 配置文件
cat ~/.cloudflared/config.yml

# 重启隧道
launchctl kickstart -k gui/$(id -u)/com.cloudflare.cloudflared
```

---

## 🔍 故障排查

### 问题 1: 音频无法加载

**检查步骤**:
1. 确认 CDN 服务器运行正常
   ```bash
   curl -I https://trading.aireading.com/audio/3/zh_short.mp3
   ```

2. 检查环境变量是否正确
   ```bash
   echo $NEXT_PUBLIC_AUDIO_CDN_URL
   ```

3. 查看浏览器控制台错误

### 问题 2: 本地开发音频加载失败

**解决方案**:
```bash
# 1. 确保本地服务运行
pm2 list

# 2. 检查端口
curl -I http://localhost:3457/audio/3/zh_short.mp3

# 3. 使用正确的 .env.local 配置
cat .env.local
```

### 问题 3: 生产环境音频加载慢

**优化方案**:
1. 启用浏览器缓存（Service Worker 已配置）
2. 使用 `preload` 属性预加载音频
3. 考虑迁移到专业 CDN (Cloudflare R2, AWS S3)

---

## 📊 优势对比

| 方案 | Vercel 直接托管 | CDN 分离（当前） |
|------|----------------|-----------------|
| 部署时间 | 5-10 分钟 | 1-2 分钟 |
| 文件大小限制 | 受限 | 无限制 |
| 更新速度 | 慢 | 快 |
| 成本 | 高（需升级套餐） | 低（本地服务器） |
| 灵活性 | 低 | 高 |

---

## 📝 维护清单

### 每次添加新音频
1. ✅ 将音频文件放入 `public/audio/{bookId}/`
2. ✅ 重启 PM2 服务: `pm2 restart aireading`
3. ✅ 验证访问: `curl -I https://trading.aireading.com/audio/{bookId}/zh_short.mp3`
4. ❌ **不需要**重新部署 Vercel

### 定期检查
- [ ] 每周检查 CDN 服务器状态
- [ ] 监控音频访问日志
- [ ] 备份音频文件

---

## 🔗 相关文件

- 配置文件: `src/lib/config.ts`
- 组件示例: `src/components/AudioPlayer.tsx`
- 环境变量: `.env.production`, `.env.local`
- Service Worker: `public/sw.js`
- 部署指南: `VERCEL_DEPLOY_GUIDE.md`

---

**最后更新**: 2026-02-09  
**维护人员**: Clawdbot
