# 书籍详情页新功能 - 评论与推荐

## 📦 已创建的组件

### 1. BookReviews.tsx - 用户评论板块

**功能特性：**
- ✅ 显示用户评论列表（头像、用户名、评分、内容、时间）
- ✅ 5星评分系统（悬停高亮效果）
- ✅ 添加评论表单（支持评分和文字评论）
- ✅ 登录验证（未登录用户显示登录提示）
- ✅ 点赞评论功能（带状态切换）
- ✅ 智能时间显示（今天/昨天/N天前/具体日期）
- ✅ 空状态提示（无评论时显示友好提示）
- ✅ 响应式设计（手机/平板/桌面）
- ✅ 中英文双语支持

**使用方式：**
```tsx
import BookReviews from '@/components/BookReviews';

<BookReviews
  bookId={bookId}
  locale={locale}
  reviews={reviews}
  currentUser={currentUser}
  onSubmitReview={handleSubmitReview}
  onLikeReview={handleLikeReview}
/>
```

**Props 说明：**
```typescript
interface BookReviewsProps {
  bookId: string | number;           // 书籍ID
  locale: 'en' | 'zh';                // 语言设置
  reviews?: Review[];                 // 评论列表（可选）
  currentUser?: {                     // 当前用户（未登录为 null）
    id: string;
    name: string;
    avatar: string;
  } | null;
  onSubmitReview?: (review: {        // 提交评论回调
    rating: number;
    content: string;
  }) => Promise<void>;
  onLikeReview?: (reviewId: string) => Promise<void>;  // 点赞回调
}
```

---

### 2. CelebrityRecommendations.tsx - 名人推荐板块

**功能特性：**
- ✅ 卡片式布局展示名人推荐
- ✅ 显示头像、姓名、职业/身份、推荐语
- ✅ 认证标识（蓝色勾选图标）
- ✅ 悬停动画效果（边框高亮、阴影、背景渐变）
- ✅ 引号装饰元素（增强视觉设计）
- ✅ 响应式网格布局（移动端单列、桌面端双列）
- ✅ 无数据时自动隐藏
- ✅ 中英文双语支持

**使用方式：**
```tsx
import CelebrityRecommendations from '@/components/CelebrityRecommendations';

<CelebrityRecommendations
  bookId={bookId}
  locale={locale}
  celebrities={celebrities}
/>
```

**Props 说明：**
```typescript
interface CelebrityRecommendationsProps {
  bookId: string | number;           // 书籍ID
  locale: 'en' | 'zh';                // 语言设置
  celebrities?: Celebrity[];          // 名人推荐列表（可选）
}

interface Celebrity {
  id: string;
  name: string;                       // 名人姓名
  title: string;                      // 职业/身份
  avatar: string;                     // 头像URL
  recommendation: string;             // 推荐语
  verified?: boolean;                 // 是否认证（显示蓝勾）
}
```

---

## 🎨 设计亮点

### 深色主题设计
- 使用项目配置的深色主题配色方案
- 背景色：`bg-bg-1` (主容器), `bg-bg-2` (次级元素)
- 文字色：`text-text-0` (标题), `text-text-1` (正文), `text-text-muted` (次要信息)
- 主色调：`primary` (紫色), `accent` (青色), `warning` (金色 - 星星)

### 交互细节
- 星级评分悬停效果
- 评论卡片悬停边框高亮
- 名人推荐卡片悬停动画（渐变背景 + 阴影）
- 点赞按钮状态切换
- 提交按钮加载状态

### 响应式设计
- 移动端优先设计
- 平板/桌面使用网格布局
- 合理的间距和字体大小调整

---

## 🌍 国际化

已更新的翻译文件：
- `src/i18n/messages/zh.json`
- `src/i18n/messages/en.json`

添加的翻译键：
- `bookReviews.*` - 评论板块所有文本
- `celebrityRecommendations.*` - 名人推荐板块所有文本

---

## 📋 集成清单

### 1. 后端 API 需求

#### 评论相关
```
GET  /api/books/:id/reviews        # 获取评论列表
POST /api/books/:id/reviews        # 提交新评论
POST /api/reviews/:id/like         # 点赞/取消点赞评论
```

#### 名人推荐
```
GET  /api/books/:id/celebrities    # 获取名人推荐列表
```

### 2. 数据库表结构建议

#### reviews 表
```sql
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY,
  book_id INT NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_book_id (book_id),
  INDEX idx_user_id (user_id)
);
```

#### review_likes 表
```sql
CREATE TABLE review_likes (
  review_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (review_id, user_id),
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);
```

#### celebrity_recommendations 表
```sql
CREATE TABLE celebrity_recommendations (
  id VARCHAR(36) PRIMARY KEY,
  book_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) NOT NULL,
  recommendation TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_book_id (book_id)
);
```

### 3. 在书籍详情页中使用

```tsx
// app/[locale]/book/[id]/page.tsx

import BookReviews from '@/components/BookReviews';
import CelebrityRecommendations from '@/components/CelebrityRecommendations';

export default async function BookPage({ params }: { params: { id: string, locale: 'en' | 'zh' } }) {
  // 获取书籍数据
  const book = await getBookById(params.id);
  
  // 获取评论
  const reviews = await getBookReviews(params.id);
  
  // 获取名人推荐
  const celebrities = await getCelebrityRecommendations(params.id);
  
  // 获取当前用户
  const currentUser = await getCurrentUser();

  return (
    <div className="space-y-8">
      {/* 书籍基本信息 */}
      <BookInfo book={book} />
      
      {/* 名人推荐 */}
      <CelebrityRecommendations
        bookId={params.id}
        locale={params.locale}
        celebrities={celebrities}
      />
      
      {/* 用户评论 */}
      <BookReviews
        bookId={params.id}
        locale={params.locale}
        reviews={reviews}
        currentUser={currentUser}
        onSubmitReview={handleSubmitReview}
        onLikeReview={handleLikeReview}
      />
    </div>
  );
}
```

---

## 🎯 下一步优化建议

### 功能增强
- [ ] 评论排序（最新/最热/评分）
- [ ] 评论分页或无限滚动
- [ ] 评论举报功能
- [ ] 评论回复功能（嵌套评论）
- [ ] 图片上传（评论配图）
- [ ] 评分统计（显示各星级百分比）
- [ ] 名人推荐视频/音频片段

### 性能优化
- [ ] 评论列表虚拟滚动（大量评论时）
- [ ] 图片懒加载
- [ ] 服务端分页
- [ ] 缓存策略

### SEO优化
- [ ] 评论的结构化数据（Schema.org Review）
- [ ] 名人推荐的结构化数据（Schema.org Endorsement）

---

## 📸 组件截图说明

### BookReviews 组件
- 顶部：标题 + 评论数量
- 中部：添加评论表单（星级评分 + 文本输入）
- 底部：评论列表（头像 + 用户信息 + 评分 + 内容 + 点赞按钮）
- 空状态：友好的"暂无评论"提示

### CelebrityRecommendations 组件
- 标题栏：带星标图标
- 副标题：引导性说明文字
- 卡片网格：2列布局（移动端1列）
- 每张卡片：头像（带认证标识） + 姓名 + 职位 + 引用样式的推荐语
- 悬停效果：边框高亮 + 柔和阴影 + 背景渐变

---

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: TailwindCSS
- **语言**: TypeScript
- **国际化**: 自定义 i18n 方案
- **图标**: 内联 SVG

---

## 📝 维护说明

如需修改样式或文案：
1. **样式**: 直接修改组件中的 TailwindCSS 类名
2. **文案**: 修改 `src/i18n/messages/{locale}.json` 中的对应键值
3. **数据结构**: 修改组件 Props 的 TypeScript 接口

如需添加新功能：
1. 在对应组件中添加新的 state 和处理函数
2. 如需新文案，记得同步更新中英文 i18n 文件
3. 更新 Props 类型定义

---

## 🎉 完成清单

- ✅ BookReviews.tsx 组件
- ✅ CelebrityRecommendations.tsx 组件
- ✅ 中英文国际化配置
- ✅ TypeScript 类型定义
- ✅ 响应式设计
- ✅ 深色主题样式
- ✅ 交互动画效果
- ✅ 使用示例文档
- ✅ 集成说明文档

所有组件已就绪，可以立即集成到书籍详情页！🚀
