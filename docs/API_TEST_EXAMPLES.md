# 🧪 API 测试示例

快速测试新的评论和推荐 API 功能。

## 前提条件

确保开发服务器正在运行：
```bash
npm run dev
```

---

## 测试命令

### 1. 获取书籍评论（无需登录）

```bash
# 获取 book_id=1 的评论
curl http://localhost:3000/api/books/1/reviews

# 分页获取
curl "http://localhost:3000/api/books/1/reviews?limit=5&offset=0"

# 按点赞数排序
curl "http://localhost:3000/api/books/1/reviews?sortBy=likes"

# 按评分排序
curl "http://localhost:3000/api/books/1/reviews?sortBy=rating"
```

**预期响应**：
```json
{
  "reviews": [
    {
      "id": 1,
      "user_id": 1,
      "book_id": 1,
      "content": "这本书非常精彩！...",
      "rating": 5,
      "likes_count": 0,
      "username": "Test User",
      "user_liked": false
    }
  ],
  "stats": {
    "total_count": 3,
    "average_rating": 4,
    "rating_distribution": {
      "1": 0,
      "2": 0,
      "3": 1,
      "4": 1,
      "5": 1
    }
  },
  "pagination": {
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

---

### 2. 添加评论（需要登录）

首先需要登录获取 token：

```bash
# 登录（使用测试用户）
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@aireading.com","password":"test123"}'

# 保存返回的 token
# 假设返回的 token 是: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

然后添加评论：

```bash
curl -X POST http://localhost:3000/api/books/1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "这是一本非常棒的书，强烈推荐！",
    "rating": 5
  }'
```

**预期响应（成功）**：
```json
{
  "review": {
    "id": 4,
    "user_id": 1,
    "book_id": 1,
    "content": "这是一本非常棒的书，强烈推荐！",
    "rating": 5,
    "likes_count": 0,
    "created_at": 1738569600
  },
  "message": "Review created successfully"
}
```

**预期响应（未登录）**：
```json
{
  "error": "You must be logged in to post a review"
}
```

**预期响应（重复评论）**：
```json
{
  "error": "You have already reviewed this book"
}
```

---

### 3. 点赞评论（需要登录）

```bash
# 点赞 review_id=1 的评论
curl -X POST http://localhost:3000/api/reviews/1/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**预期响应（点赞成功）**：
```json
{
  "success": true,
  "action": "liked",
  "liked": true,
  "likes_count": 1
}
```

**预期响应（取消点赞）**：
```json
{
  "success": true,
  "action": "unliked",
  "liked": false,
  "likes_count": 0
}
```

**再次点赞（切换）**：
```bash
# 第二次调用同一接口会取消点赞
curl -X POST http://localhost:3000/api/reviews/1/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4. 获取名人推荐（无需登录）

```bash
# 获取 book_id=1 的推荐
curl http://localhost:3000/api/books/1/recommendations

# 只获取精选推荐
curl "http://localhost:3000/api/books/1/recommendations?featured=true"

# 限制数量
curl "http://localhost:3000/api/books/1/recommendations?limit=2"
```

**预期响应**：
```json
{
  "recommendations": [
    {
      "id": 1,
      "book_id": 1,
      "celebrity_name": "Bill Gates",
      "celebrity_title": "微软创始人",
      "celebrity_avatar_url": "/avatars/bill-gates.jpg",
      "recommendation_text": "这是今年最好的书之一...",
      "recommendation_source": "2024年度书单",
      "source_url": "https://www.gatesnotes.com",
      "display_order": 1,
      "is_featured": 1,
      "is_active": 1
    }
  ],
  "stats": {
    "total_count": 3,
    "active_count": 3,
    "featured_count": 2
  },
  "pagination": {
    "limit": 10,
    "offset": 0,
    "has_more": false
  }
}
```

---

## 浏览器测试

### 使用浏览器开发者工具

1. 打开浏览器开发者工具（F12）
2. 切换到 Console 标签
3. 复制以下代码：

```javascript
// 测试获取评论
async function testGetReviews() {
  const response = await fetch('/api/books/1/reviews');
  const data = await response.json();
  console.log('Reviews:', data);
}

testGetReviews();
```

```javascript
// 测试添加评论（需要登录）
async function testAddReview() {
  const response = await fetch('/api/books/1/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: '浏览器测试评论',
      rating: 4
    })
  });
  const data = await response.json();
  console.log('Add review:', data);
}

testAddReview();
```

```javascript
// 测试点赞
async function testLikeReview() {
  const response = await fetch('/api/reviews/1/like', {
    method: 'POST'
  });
  const data = await response.json();
  console.log('Like review:', data);
}

testLikeReview();
```

```javascript
// 测试获取推荐
async function testGetRecommendations() {
  const response = await fetch('/api/books/1/recommendations');
  const data = await response.json();
  console.log('Recommendations:', data);
}

testGetRecommendations();
```

---

## Postman / Thunder Client 测试

### 导入以下集合

```json
{
  "name": "AIreading - Reviews & Recommendations",
  "requests": [
    {
      "name": "Get Reviews",
      "method": "GET",
      "url": "http://localhost:3000/api/books/1/reviews"
    },
    {
      "name": "Add Review",
      "method": "POST",
      "url": "http://localhost:3000/api/books/1/reviews",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer {{token}}"
      },
      "body": {
        "content": "测试评论",
        "rating": 5
      }
    },
    {
      "name": "Like Review",
      "method": "POST",
      "url": "http://localhost:3000/api/reviews/1/like",
      "headers": {
        "Authorization": "Bearer {{token}}"
      }
    },
    {
      "name": "Get Recommendations",
      "method": "GET",
      "url": "http://localhost:3000/api/books/1/recommendations"
    }
  ]
}
```

---

## 数据库查询测试

### 验证数据是否正确插入

```bash
# 查看评论表
sqlite3 data/aireading.db "SELECT * FROM reviews;"

# 查看评论统计
sqlite3 data/aireading.db "
SELECT 
  book_id,
  COUNT(*) as total,
  AVG(rating) as avg_rating,
  SUM(likes_count) as total_likes
FROM reviews 
GROUP BY book_id;
"

# 查看推荐表
sqlite3 data/aireading.db "SELECT * FROM celebrity_recommendations;"

# 查看点赞记录
sqlite3 data/aireading.db "SELECT * FROM review_likes;"
```

---

## 常见问题

### 1. 401 Unauthorized

**问题**：添加评论或点赞时返回 401

**解决**：
- 确保已登录并获取了 token
- 检查 Authorization header 格式：`Bearer <token>`
- 验证 token 是否过期

### 2. 404 Not Found

**问题**：API 返回 404

**解决**：
- 检查 URL 是否正确
- 确保开发服务器正在运行（`npm run dev`）
- 检查路由文件是否存在

### 3. 409 Conflict

**问题**：添加评论时返回 409

**解决**：
- 这是正常的，说明你已经评论过该书籍
- 一个用户只能对同一本书评论一次

### 4. 500 Internal Server Error

**问题**：服务器错误

**解决**：
- 查看服务器日志
- 检查数据库表是否存在（运行迁移脚本）
- 验证数据库连接

---

## 自动化测试脚本

创建 `test-api.sh`：

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🧪 Testing AIreading Reviews & Recommendations API"
echo ""

# 测试获取评论
echo "1️⃣ Testing GET /api/books/1/reviews"
curl -s "$BASE_URL/api/books/1/reviews" | jq .
echo ""

# 测试获取推荐
echo "2️⃣ Testing GET /api/books/1/recommendations"
curl -s "$BASE_URL/api/books/1/recommendations" | jq .
echo ""

echo "✅ Tests completed!"
```

运行：
```bash
chmod +x test-api.sh
./test-api.sh
```

---

**创建日期**: 2026-02-05  
**维护者**: 后端开发团队
