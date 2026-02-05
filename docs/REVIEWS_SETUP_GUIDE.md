# 🚀 评论和推荐功能设置指南

本指南将帮助你快速设置和使用新的评论和推荐功能。

---

## 📦 功能概览

### ✅ 已实现的功能

1. **用户评论系统**
   - ✅ 用户可以对书籍进行评论和评分（1-5星）
   - ✅ 支持点赞评论
   - ✅ 评论列表支持多种排序（最新、最热、最高分）
   - ✅ 评论统计（总数、平均分、评分分布）
   - ✅ 软删除机制（保留数据完整性）

2. **名人推荐系统**
   - ✅ 管理员可以添加名人推荐
   - ✅ 支持精选推荐
   - ✅ 自定义显示顺序
   - ✅ 推荐来源和链接

---

## 🛠️ 安装步骤

### 1. 运行数据库迁移

```bash
# 方式一：使用 Node.js 脚本（推荐）
npx tsx scripts/run-migration.ts

# 方式二：使用 SQLite 命令行
sqlite3 data/aireading.db < scripts/migrate-add-reviews.sql
```

### 2. 填充示例数据（可选）

```bash
npx tsx scripts/seed-reviews.ts
```

这将添加一些示例评论和名人推荐数据，方便开发和测试。

### 3. 验证安装

```bash
# 检查表是否创建成功
sqlite3 data/aireading.db "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%review%' OR name LIKE '%recommendation%';"
```

应该看到以下表：
- `reviews`
- `review_likes`
- `celebrity_recommendations`

---

## 📝 API 端点

### 用户评论 API

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/books/[id]/reviews` | 获取书籍评论列表 | 可选 |
| POST | `/api/books/[id]/reviews` | 添加评论 | 必需 |
| POST | `/api/reviews/[id]/like` | 点赞/取消点赞 | 必需 |

### 名人推荐 API

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/books/[id]/recommendations` | 获取名人推荐 | 不需要 |

详细的 API 文档请查看 [API_REVIEWS_RECOMMENDATIONS.md](./API_REVIEWS_RECOMMENDATIONS.md)

---

## 🔧 配置说明

### 数据库配置

新功能使用现有的 SQLite 数据库（`data/aireading.db`），无需额外配置。

### 认证配置

评论功能需要用户登录，使用现有的 JWT 认证系统：
- Token 通过 Cookie (`auth-token`) 或 Authorization Header 传递
- 认证逻辑在 `src/lib/auth.ts` 中实现

---

## 💻 前端集成

### 1. 在书籍详情页添加评论组件

```tsx
// src/app/[locale]/books/[id]/page.tsx

import ReviewSection from '@/components/ReviewSection';
import RecommendationSection from '@/components/RecommendationSection';

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const bookId = parseInt(params.id);
  
  return (
    <div>
      {/* 书籍信息 */}
      <BookInfo bookId={bookId} />
      
      {/* 名人推荐 */}
      <RecommendationSection bookId={bookId} />
      
      {/* 用户评论 */}
      <ReviewSection bookId={bookId} />
    </div>
  );
}
```

### 2. 创建评论组件

```tsx
// src/components/ReviewSection.tsx

'use client';

import { useState, useEffect } from 'react';

export default function ReviewSection({ bookId }: { bookId: number }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/books/${bookId}/reviews?limit=10`);
        const data = await res.json();
        setReviews(data.reviews);
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [bookId]);
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div className="review-section">
      <h2>用户评价</h2>
      
      {stats && (
        <div className="review-stats">
          <p>平均评分: {stats.average_rating.toFixed(1)} ⭐</p>
          <p>共 {stats.total_count} 条评论</p>
        </div>
      )}
      
      <div className="review-list">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
```

### 3. 创建推荐组件

```tsx
// src/components/RecommendationSection.tsx

'use client';

import { useState, useEffect } from 'react';

export default function RecommendationSection({ bookId }: { bookId: number }) {
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    async function loadRecommendations() {
      try {
        const res = await fetch(`/api/books/${bookId}/recommendations?featured=true`);
        const data = await res.json();
        setRecommendations(data.recommendations);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      }
    }
    loadRecommendations();
  }, [bookId]);
  
  if (recommendations.length === 0) return null;
  
  return (
    <div className="recommendation-section">
      <h2>名人推荐</h2>
      <div className="recommendation-list">
        {recommendations.map(rec => (
          <div key={rec.id} className="recommendation-card">
            {rec.celebrity_avatar_url && (
              <img src={rec.celebrity_avatar_url} alt={rec.celebrity_name} />
            )}
            <div>
              <h3>{rec.celebrity_name}</h3>
              {rec.celebrity_title && <p className="title">{rec.celebrity_title}</p>}
              <blockquote>{rec.recommendation_text}</blockquote>
              {rec.source_url && (
                <a href={rec.source_url} target="_blank" rel="noopener">
                  {rec.recommendation_source}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🧪 测试

### 1. 手动测试

```bash
# 测试获取评论
curl http://localhost:3000/api/books/1/reviews

# 测试添加评论（需要登录）
curl -X POST http://localhost:3000/api/books/1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"content":"测试评论","rating":5}'

# 测试点赞
curl -X POST http://localhost:3000/api/reviews/1/like \
  -H "Authorization: Bearer YOUR_TOKEN"

# 测试获取推荐
curl http://localhost:3000/api/books/1/recommendations
```

### 2. 使用测试工具

推荐使用 Postman 或 Thunder Client（VS Code 插件）进行 API 测试。

---

## 📊 数据库管理

### 查看评论数据

```sql
-- 查看所有评论
SELECT * FROM reviews WHERE is_deleted = 0;

-- 查看评论统计
SELECT 
  book_id,
  COUNT(*) as total_reviews,
  AVG(rating) as avg_rating,
  SUM(likes_count) as total_likes
FROM reviews 
WHERE is_deleted = 0
GROUP BY book_id;

-- 查看热门评论
SELECT * FROM reviews 
WHERE is_deleted = 0 
ORDER BY likes_count DESC 
LIMIT 10;
```

### 查看推荐数据

```sql
-- 查看所有推荐
SELECT * FROM celebrity_recommendations WHERE is_active = 1;

-- 查看精选推荐
SELECT * FROM celebrity_recommendations 
WHERE is_featured = 1 AND is_active = 1
ORDER BY display_order;
```

---

## 🔒 安全注意事项

1. **SQL 注入防护**: 所有数据模型都使用参数化查询
2. **XSS 防护**: 前端需要对用户输入的评论内容进行转义
3. **认证检查**: 所有写操作都需要验证用户身份
4. **权限控制**: 用户只能编辑/删除自己的评论
5. **防刷控制**: 建议添加评论频率限制（rate limiting）

---

## 🚀 性能优化

1. **数据库索引**: 已为常见查询添加索引
2. **分页加载**: 使用 limit/offset 实现分页
3. **缓存策略**: 建议对评论统计和推荐使用缓存
4. **CDN**: 名人头像建议使用 CDN 加速

---

## 🔄 未来改进

以下是可以考虑添加的功能：

- [ ] 评论回复功能
- [ ] 评论举报和审核
- [ ] 图片/视频评论
- [ ] 评论搜索
- [ ] 用户评论历史页面
- [ ] 推荐管理后台界面
- [ ] 评论导出功能
- [ ] 评论数据分析

---

## 📞 支持

如有问题，请查阅：
- [API 文档](./API_REVIEWS_RECOMMENDATIONS.md)
- [数据库 Schema](./DATABASE_SCHEMA.md)

---

**版本**: v1.0  
**创建日期**: 2026-02-05
