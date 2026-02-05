# 📖 评论和推荐 API 文档

> 书籍详情页的评论和名人推荐功能 API  
> **版本**: v1.0  
> **日期**: 2026-02-05

---

## 📋 目录

1. [用户评论 API](#用户评论-api)
2. [名人推荐 API](#名人推荐-api)
3. [数据模型](#数据模型)
4. [错误处理](#错误处理)
5. [使用示例](#使用示例)

---

## 用户评论 API

### 1. 获取书籍评论列表

**接口**: `GET /api/books/[id]/reviews`

**描述**: 获取指定书籍的评论列表，支持分页和排序。

**认证**: 可选（登录用户可以看到自己是否点赞）

**请求参数**:

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `limit` | number | 否 | 20 | 每页数量（1-100） |
| `offset` | number | 否 | 0 | 偏移量 |
| `sortBy` | string | 否 | 'latest' | 排序方式：`latest`（最新）, `likes`（点赞数）, `rating`（评分） |

**请求示例**:
```bash
GET /api/books/1/reviews?limit=10&offset=0&sortBy=likes
```

**响应示例**:
```json
{
  "reviews": [
    {
      "id": 1,
      "user_id": 1,
      "book_id": 1,
      "content": "这本书非常精彩！作者的洞察力令人惊叹。",
      "rating": 5,
      "likes_count": 42,
      "is_verified_purchase": 1,
      "is_pinned": 0,
      "is_deleted": 0,
      "created_at": 1738569600,
      "updated_at": 1738569600,
      "username": "张三",
      "avatar_url": "/avatars/user1.jpg",
      "user_liked": true
    }
  ],
  "stats": {
    "total_count": 123,
    "average_rating": 4.5,
    "rating_distribution": {
      "1": 2,
      "2": 5,
      "3": 15,
      "4": 40,
      "5": 61
    }
  },
  "pagination": {
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}
```

**状态码**:
- `200`: 成功
- `400`: 无效的书籍 ID
- `500`: 服务器错误

---

### 2. 添加评论

**接口**: `POST /api/books/[id]/reviews`

**描述**: 为指定书籍添加评论（需要登录）。

**认证**: 必需

**请求体**:
```json
{
  "content": "这本书非常精彩！强烈推荐。",
  "rating": 5
}
```

**字段说明**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `content` | string | 是 | 评论内容，不能为空 |
| `rating` | number | 是 | 评分（1-5星） |

**响应示例**:
```json
{
  "review": {
    "id": 123,
    "user_id": 1,
    "book_id": 1,
    "content": "这本书非常精彩！强烈推荐。",
    "rating": 5,
    "likes_count": 0,
    "is_verified_purchase": 0,
    "is_pinned": 0,
    "is_deleted": 0,
    "created_at": 1738569600,
    "updated_at": 1738569600
  },
  "message": "Review created successfully"
}
```

**状态码**:
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未登录
- `409`: 已经评论过该书籍
- `500`: 服务器错误

---

### 3. 点赞/取消点赞评论

**接口**: `POST /api/reviews/[id]/like`

**描述**: 点赞或取消点赞指定评论（需要登录）。此接口为切换操作，如果已点赞则取消，如果未点赞则点赞。

**认证**: 必需

**请求示例**:
```bash
POST /api/reviews/123/like
```

**响应示例**:
```json
{
  "success": true,
  "action": "liked",
  "liked": true,
  "likes_count": 43
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 操作是否成功 |
| `action` | string | 执行的操作：`liked`（点赞）或 `unliked`（取消点赞） |
| `liked` | boolean | 当前是否已点赞 |
| `likes_count` | number | 更新后的点赞总数 |

**状态码**:
- `200`: 成功
- `400`: 无效的评论 ID
- `401`: 未登录
- `404`: 评论不存在
- `500`: 服务器错误

---

## 名人推荐 API

### 4. 获取书籍的名人推荐

**接口**: `GET /api/books/[id]/recommendations`

**描述**: 获取指定书籍的名人推荐列表。

**认证**: 不需要

**请求参数**:

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `limit` | number | 否 | 10 | 每页数量（1-50） |
| `offset` | number | 否 | 0 | 偏移量 |
| `featured` | boolean | 否 | false | 是否只返回精选推荐 |

**请求示例**:
```bash
GET /api/books/1/recommendations?limit=5&featured=true
```

**响应示例**:
```json
{
  "recommendations": [
    {
      "id": 1,
      "book_id": 1,
      "celebrity_name": "Bill Gates",
      "celebrity_title": "微软创始人",
      "celebrity_avatar_url": "/avatars/bill-gates.jpg",
      "recommendation_text": "这是今年最好的书之一，每个人都应该读一读。",
      "recommendation_source": "2024年度书单",
      "source_url": "https://www.gatesnotes.com",
      "display_order": 1,
      "is_featured": 1,
      "is_active": 1,
      "created_at": 1738569600,
      "updated_at": 1738569600
    }
  ],
  "stats": {
    "total_count": 3,
    "active_count": 3,
    "featured_count": 2
  },
  "pagination": {
    "limit": 5,
    "offset": 0,
    "has_more": false
  }
}
```

**状态码**:
- `200`: 成功
- `400`: 无效的书籍 ID
- `500`: 服务器错误

---

## 数据模型

### Review（评论）

```typescript
interface Review {
  id: number;
  user_id: number;
  book_id: number;
  content: string;
  rating: number;                    // 1-5
  likes_count: number;
  is_verified_purchase: number;      // 0 或 1
  is_pinned: number;                 // 0 或 1（置顶）
  is_deleted: number;                // 0 或 1（软删除）
  created_at: number;                // Unix timestamp
  updated_at: number;                // Unix timestamp
}
```

### ReviewWithUser（带用户信息的评论）

```typescript
interface ReviewWithUser extends Review {
  username?: string;
  avatar_url?: string;
  user_liked?: boolean;              // 当前用户是否点赞
}
```

### ReviewStats（评论统计）

```typescript
interface ReviewStats {
  total_count: number;               // 总评论数
  average_rating: number;            // 平均评分
  rating_distribution: {             // 评分分布
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
```

### CelebrityRecommendation（名人推荐）

```typescript
interface CelebrityRecommendation {
  id: number;
  book_id: number;
  celebrity_name: string;
  celebrity_title?: string;
  celebrity_avatar_url?: string;
  recommendation_text: string;
  recommendation_source?: string;
  source_url?: string;
  display_order: number;
  is_featured: number;               // 0 或 1
  is_active: number;                 // 0 或 1
  created_at: number;                // Unix timestamp
  updated_at: number;                // Unix timestamp
}
```

---

## 错误处理

### 错误响应格式

```json
{
  "error": "错误描述信息"
}
```

### 常见错误码

| 状态码 | 说明 | 示例 |
|--------|------|------|
| `400` | 请求参数错误 | 无效的 ID、缺少必填字段等 |
| `401` | 未认证 | 需要登录但未提供有效的认证信息 |
| `403` | 禁止访问 | 账户被禁用等 |
| `404` | 资源不存在 | 评论或书籍不存在 |
| `409` | 冲突 | 重复评论、重复点赞等 |
| `500` | 服务器错误 | 内部错误 |

---

## 使用示例

### 前端集成示例

#### 1. 获取和显示评论

```typescript
// 获取评论列表
async function fetchReviews(bookId: number, sortBy: string = 'latest') {
  const response = await fetch(
    `/api/books/${bookId}/reviews?limit=10&offset=0&sortBy=${sortBy}`,
    {
      headers: {
        'Authorization': `Bearer ${token}` // 可选
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  
  const data = await response.json();
  return data;
}

// 使用示例
const { reviews, stats } = await fetchReviews(1, 'likes');
console.log(`平均评分: ${stats.average_rating}⭐`);
console.log(`共 ${stats.total_count} 条评论`);
```

#### 2. 添加评论

```typescript
async function addReview(bookId: number, content: string, rating: number) {
  const response = await fetch(`/api/books/${bookId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content, rating })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return await response.json();
}

// 使用示例
try {
  const result = await addReview(1, '这本书很棒！', 5);
  console.log('评论成功:', result.message);
} catch (error) {
  console.error('评论失败:', error.message);
}
```

#### 3. 点赞评论

```typescript
async function toggleLike(reviewId: number) {
  const response = await fetch(`/api/reviews/${reviewId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to toggle like');
  }
  
  return await response.json();
}

// 使用示例
const result = await toggleLike(123);
console.log(`${result.action}: 现在有 ${result.likes_count} 个赞`);
```

#### 4. 获取名人推荐

```typescript
async function fetchRecommendations(bookId: number, featured: boolean = false) {
  const url = `/api/books/${bookId}/recommendations${featured ? '?featured=true' : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }
  
  return await response.json();
}

// 使用示例
const { recommendations } = await fetchRecommendations(1, true);
recommendations.forEach(rec => {
  console.log(`${rec.celebrity_name}: ${rec.recommendation_text}`);
});
```

---

## React 组件示例

### 评论列表组件

```tsx
import { useState, useEffect } from 'react';

function ReviewList({ bookId }: { bookId: number }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  
  useEffect(() => {
    async function loadReviews() {
      const data = await fetchReviews(bookId, sortBy);
      setReviews(data.reviews);
      setStats(data.stats);
    }
    loadReviews();
  }, [bookId, sortBy]);
  
  return (
    <div className="reviews">
      {/* 评论统计 */}
      {stats && (
        <div className="stats">
          <h3>用户评价</h3>
          <p>平均评分: {stats.average_rating.toFixed(1)} ⭐</p>
          <p>共 {stats.total_count} 条评论</p>
        </div>
      )}
      
      {/* 排序选项 */}
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="latest">最新</option>
        <option value="likes">最热</option>
        <option value="rating">最高分</option>
      </select>
      
      {/* 评论列表 */}
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
```

---

## 性能优化建议

1. **分页加载**: 使用 `limit` 和 `offset` 实现分页或无限滚动
2. **缓存策略**: 对评论统计和名人推荐使用客户端缓存（5-10分钟）
3. **懒加载**: 评论列表可以在用户滚动时按需加载
4. **防抖处理**: 点赞操作建议添加防抖，防止重复请求
5. **乐观更新**: 点赞操作可以先更新 UI，失败时再回滚

---

**文档版本**: v1.0  
**最后更新**: 2026-02-05  
**维护者**: 后端开发团队
