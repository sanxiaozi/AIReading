# 📊 数据库 Schema 设计 - AIreading

> **数据库类型**: SQLite  
> **ORM**: better-sqlite3  
> **创建日期**: 2026-02-05  
> **版本**: v1.0

---

## 📋 目录

1. [总体设计](#总体设计)
2. [用户表 (users)](#用户表-users)
3. [收藏表 (favorites)](#收藏表-favorites)
4. [历史记录表 (listening_history)](#历史记录表-listening_history)
5. [笔记表 (notes)](#笔记表-notes)
6. [会话表 (sessions)](#会话表-sessions)
7. [评论表 (reviews)](#评论表-reviews)
8. [名人推荐表 (celebrity_recommendations)](#名人推荐表-celebrity_recommendations)
9. [索引策略](#索引策略)
10. [初始化脚本](#初始化脚本)

---

## 总体设计

### 设计原则
- ✅ **简单性优先**: 使用 SQLite 的原生特性
- ✅ **扩展性**: 为未来功能预留字段
- ✅ **性能优化**: 合理的索引设计
- ✅ **数据完整性**: 外键约束 + 唯一约束
- ✅ **隐私安全**: 密码哈希存储

### 关系图
```
┌─────────────┐
│   users     │───┐
└─────────────┘   │
       │          │
       │ 1        │ 1
       │          │
       │ *        │ *
┌──────▼──────┐  ┌▼────────────┐
│  favorites  │  │  listening  │
│             │  │  _history   │
└─────────────┘  └─────────────┘
       │               │
       │ *             │ *
       │               │
       │ 1             │ 1
    ┌──▼───────────────▼──┐
    │      notes          │
    └─────────────────────┘
```

---

## 用户表 (users)

### 字段设计
```sql
CREATE TABLE users (
  -- 主键
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- 登录凭证
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  
  -- 用户信息
  username TEXT,
  avatar_url TEXT,
  
  -- 偏好设置
  locale TEXT DEFAULT 'en',              -- 语言偏好: en, zh, es, etc.
  theme TEXT DEFAULT 'light',            -- 主题: light, dark, auto
  playback_speed REAL DEFAULT 1.0,       -- 播放速度: 0.5-2.0
  
  -- 订阅状态
  subscription_tier TEXT DEFAULT 'free', -- 订阅等级: free, pro, premium
  subscription_expires_at INTEGER,       -- Unix timestamp
  
  -- 系统字段
  is_active INTEGER DEFAULT 1,           -- 0=禁用, 1=正常
  created_at INTEGER NOT NULL,           -- Unix timestamp
  updated_at INTEGER NOT NULL,           -- Unix timestamp
  last_login_at INTEGER,                 -- Unix timestamp
  
  -- 约束
  CONSTRAINT email_format CHECK (email LIKE '%@%'),
  CONSTRAINT speed_range CHECK (playback_speed >= 0.5 AND playback_speed <= 2.0)
);
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | INTEGER | 用户唯一标识，自增主键 | 1, 2, 3 |
| `email` | TEXT | 邮箱，唯一，用于登录 | user@example.com |
| `password_hash` | TEXT | bcrypt 哈希密码 | $2b$10$... |
| `username` | TEXT | 用户名（可选） | John Doe |
| `avatar_url` | TEXT | 头像URL（可选） | /avatars/user1.jpg |
| `locale` | TEXT | 语言偏好 | en, zh, es |
| `theme` | TEXT | 主题偏好 | light, dark, auto |
| `playback_speed` | REAL | 默认播放速度 | 1.0, 1.25, 1.5 |
| `subscription_tier` | TEXT | 订阅等级 | free, pro, premium |
| `subscription_expires_at` | INTEGER | 订阅到期时间（时间戳） | 1738809600 |
| `is_active` | INTEGER | 账户是否激活 | 0=禁用, 1=正常 |
| `created_at` | INTEGER | 创建时间（时间戳） | 1738569600 |
| `updated_at` | INTEGER | 更新时间（时间戳） | 1738569600 |
| `last_login_at` | INTEGER | 最后登录时间（时间戳） | 1738569600 |

### 索引
```sql
-- 唯一索引
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- 查询索引
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_expires_at);
CREATE INDEX idx_users_active ON users(is_active);
```

---

## 收藏表 (favorites)

### 字段设计
```sql
CREATE TABLE favorites (
  -- 主键
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- 关联字段
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  
  -- 元数据
  notes TEXT,                           -- 收藏备注
  tags TEXT,                            -- JSON数组: ["tag1", "tag2"]
  
  -- 系统字段
  created_at INTEGER NOT NULL,
  
  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- 唯一约束
  CONSTRAINT unique_user_book UNIQUE (user_id, book_id)
);
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | INTEGER | 收藏记录ID | 1, 2, 3 |
| `user_id` | INTEGER | 用户ID（外键） | 1 |
| `book_id` | INTEGER | 书籍ID | 42 |
| `notes` | TEXT | 收藏备注 | "很喜欢这本书" |
| `tags` | TEXT | 自定义标签（JSON） | `["科幻", "经典"]` |
| `created_at` | INTEGER | 收藏时间 | 1738569600 |

### 索引
```sql
-- 唯一索引（防止重复收藏）
CREATE UNIQUE INDEX idx_favorites_user_book ON favorites(user_id, book_id);

-- 查询索引
CREATE INDEX idx_favorites_user ON favorites(user_id, created_at DESC);
CREATE INDEX idx_favorites_book ON favorites(book_id);
```

---

## 历史记录表 (listening_history)

### 字段设计
```sql
CREATE TABLE listening_history (
  -- 主键
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- 关联字段
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  
  -- 播放信息
  summary_type TEXT NOT NULL,            -- short, medium, long
  progress_seconds INTEGER DEFAULT 0,    -- 当前进度（秒）
  total_seconds INTEGER,                 -- 总时长（秒）
  playback_speed REAL DEFAULT 1.0,       -- 播放速度
  
  -- 状态
  is_completed INTEGER DEFAULT 0,        -- 0=未完成, 1=已完成
  completion_rate REAL GENERATED ALWAYS AS (
    CASE 
      WHEN total_seconds > 0 THEN CAST(progress_seconds AS REAL) / total_seconds 
      ELSE 0 
    END
  ) VIRTUAL,                            -- 完成率（虚拟列）
  
  -- 系统字段
  created_at INTEGER NOT NULL,          -- 首次播放时间
  last_played_at INTEGER NOT NULL,      -- 最后播放时间
  play_count INTEGER DEFAULT 1,         -- 播放次数
  
  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- 约束
  CONSTRAINT progress_valid CHECK (progress_seconds >= 0),
  CONSTRAINT speed_valid CHECK (playback_speed >= 0.5 AND playback_speed <= 2.0)
);
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | INTEGER | 记录ID | 1, 2, 3 |
| `user_id` | INTEGER | 用户ID（外键） | 1 |
| `book_id` | INTEGER | 书籍ID | 42 |
| `summary_type` | TEXT | 摘要类型 | short, medium, long |
| `progress_seconds` | INTEGER | 播放进度（秒） | 120 |
| `total_seconds` | INTEGER | 总时长（秒） | 300 |
| `playback_speed` | REAL | 播放速度 | 1.0, 1.5 |
| `is_completed` | INTEGER | 是否完成 | 0=未完成, 1=完成 |
| `completion_rate` | REAL | 完成率（虚拟列） | 0.4 (40%) |
| `created_at` | INTEGER | 首次播放时间 | 1738569600 |
| `last_played_at` | INTEGER | 最后播放时间 | 1738656000 |
| `play_count` | INTEGER | 播放次数 | 3 |

### 索引
```sql
-- 查询索引
CREATE INDEX idx_history_user_recent ON listening_history(user_id, last_played_at DESC);
CREATE INDEX idx_history_book ON listening_history(book_id);
CREATE INDEX idx_history_completed ON listening_history(user_id, is_completed);

-- 复合索引（用于"继续播放"功能）
CREATE INDEX idx_history_resume ON listening_history(user_id, is_completed, last_played_at DESC)
  WHERE is_completed = 0 AND progress_seconds > 0;
```

---

## 笔记表 (notes)

### 字段设计
```sql
CREATE TABLE notes (
  -- 主键
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- 关联字段
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  
  -- 笔记内容
  content TEXT NOT NULL,
  summary_type TEXT,                    -- short, medium, long (可选)
  timestamp_seconds INTEGER,            -- 音频时间点（秒）
  
  -- 元数据
  is_highlighted INTEGER DEFAULT 0,     -- 0=普通, 1=高亮
  color TEXT DEFAULT 'yellow',          -- 高亮颜色
  
  -- 系统字段
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- 约束
  CONSTRAINT content_not_empty CHECK (LENGTH(content) > 0),
  CONSTRAINT timestamp_valid CHECK (timestamp_seconds IS NULL OR timestamp_seconds >= 0)
);
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | INTEGER | 笔记ID | 1, 2, 3 |
| `user_id` | INTEGER | 用户ID（外键） | 1 |
| `book_id` | INTEGER | 书籍ID | 42 |
| `content` | TEXT | 笔记内容 | "这段话很精彩" |
| `summary_type` | TEXT | 摘要类型（可选） | short, medium, long |
| `timestamp_seconds` | INTEGER | 音频时间点（可选） | 120 |
| `is_highlighted` | INTEGER | 是否高亮 | 0=否, 1=是 |
| `color` | TEXT | 高亮颜色 | yellow, green, blue |
| `created_at` | INTEGER | 创建时间 | 1738569600 |
| `updated_at` | INTEGER | 更新时间 | 1738656000 |

### 索引
```sql
-- 查询索引
CREATE INDEX idx_notes_user ON notes(user_id, book_id, created_at DESC);
CREATE INDEX idx_notes_book ON notes(book_id);
CREATE INDEX idx_notes_highlighted ON notes(user_id, is_highlighted)
  WHERE is_highlighted = 1;
```

---

## 会话表 (sessions)

### 字段设计
```sql
CREATE TABLE sessions (
  -- 主键
  id TEXT PRIMARY KEY,                  -- UUID or random token
  
  -- 关联字段
  user_id INTEGER NOT NULL,
  
  -- 会话信息
  token_hash TEXT NOT NULL,             -- Token 哈希值
  ip_address TEXT,
  user_agent TEXT,
  
  -- 系统字段
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL,
  
  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | TEXT | 会话ID（UUID） | abc123... |
| `user_id` | INTEGER | 用户ID（外键） | 1 |
| `token_hash` | TEXT | Token 哈希值 | sha256(...) |
| `ip_address` | TEXT | IP地址 | 192.168.1.1 |
| `user_agent` | TEXT | 浏览器UA | Mozilla/5.0... |
| `created_at` | INTEGER | 创建时间 | 1738569600 |
| `expires_at` | INTEGER | 过期时间 | 1739174400 |
| `last_active_at` | INTEGER | 最后活跃时间 | 1738656000 |

### 索引
```sql
-- 查询索引
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_sessions_token ON sessions(token_hash);
```

---

## 评论表 (reviews)

### 字段设计
```sql
CREATE TABLE reviews (
  -- 主键
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- 关联字段
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  
  -- 评论内容
  content TEXT NOT NULL,
  rating INTEGER NOT NULL,               -- 评分：1-5星
  
  -- 互动数据
  likes_count INTEGER DEFAULT 0,         -- 点赞数
  
  -- 状态标记
  is_verified_purchase INTEGER DEFAULT 0, -- 是否已验证购买/听过
  is_pinned INTEGER DEFAULT 0,           -- 是否置顶（管理员）
  is_deleted INTEGER DEFAULT 0,          -- 软删除标记
  
  -- 系统字段
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- 约束
  CONSTRAINT content_not_empty CHECK (LENGTH(content) > 0),
  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
);
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | INTEGER | 评论ID | 1, 2, 3 |
| `user_id` | INTEGER | 用户ID（外键） | 1 |
| `book_id` | INTEGER | 书籍ID | 42 |
| `content` | TEXT | 评论内容 | "这本书很棒！" |
| `rating` | INTEGER | 评分（1-5星） | 5 |
| `likes_count` | INTEGER | 点赞数 | 10 |
| `is_verified_purchase` | INTEGER | 是否验证购买 | 0=否, 1=是 |
| `is_pinned` | INTEGER | 是否置顶 | 0=否, 1=是 |
| `is_deleted` | INTEGER | 是否删除 | 0=否, 1=是 |
| `created_at` | INTEGER | 创建时间 | 1738569600 |
| `updated_at` | INTEGER | 更新时间 | 1738656000 |

### 索引
```sql
-- 查询索引
CREATE INDEX idx_reviews_book ON reviews(book_id, is_deleted, created_at DESC);
CREATE INDEX idx_reviews_user ON reviews(user_id, is_deleted);
CREATE INDEX idx_reviews_rating ON reviews(book_id, rating);
CREATE INDEX idx_reviews_likes ON reviews(book_id, likes_count DESC)
  WHERE is_deleted = 0;
```

---

## 评论点赞表 (review_likes)

### 字段设计
```sql
CREATE TABLE review_likes (
  -- 主键
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- 关联字段
  user_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  
  -- 系统字段
  created_at INTEGER NOT NULL,
  
  -- 外键约束
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  
  -- 唯一约束（一个用户只能给一条评论点赞一次）
  CONSTRAINT unique_user_review UNIQUE (user_id, review_id)
);
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | INTEGER | 点赞记录ID | 1, 2, 3 |
| `user_id` | INTEGER | 用户ID（外键） | 1 |
| `review_id` | INTEGER | 评论ID（外键） | 42 |
| `created_at` | INTEGER | 点赞时间 | 1738569600 |

### 索引
```sql
-- 唯一索引
CREATE UNIQUE INDEX idx_review_likes_user_review ON review_likes(user_id, review_id);

-- 查询索引
CREATE INDEX idx_review_likes_review ON review_likes(review_id);
```

---

## 名人推荐表 (celebrity_recommendations)

### 字段设计
```sql
CREATE TABLE celebrity_recommendations (
  -- 主键
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- 关联字段
  book_id INTEGER NOT NULL,
  
  -- 名人信息
  celebrity_name TEXT NOT NULL,
  celebrity_title TEXT,                  -- 名人头衔/身份
  celebrity_avatar_url TEXT,             -- 名人头像URL
  
  -- 推荐内容
  recommendation_text TEXT NOT NULL,     -- 推荐语
  recommendation_source TEXT,            -- 推荐来源（采访、书评等）
  source_url TEXT,                       -- 来源链接
  
  -- 展示控制
  display_order INTEGER DEFAULT 0,       -- 显示顺序（数字越小越靠前）
  is_featured INTEGER DEFAULT 0,         -- 是否精选展示
  is_active INTEGER DEFAULT 1,           -- 是否激活显示
  
  -- 系统字段
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  -- 约束
  CONSTRAINT name_not_empty CHECK (LENGTH(celebrity_name) > 0),
  CONSTRAINT recommendation_not_empty CHECK (LENGTH(recommendation_text) > 0)
);
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | INTEGER | 推荐ID | 1, 2, 3 |
| `book_id` | INTEGER | 书籍ID | 42 |
| `celebrity_name` | TEXT | 名人姓名 | "Bill Gates" |
| `celebrity_title` | TEXT | 名人头衔 | "微软创始人" |
| `celebrity_avatar_url` | TEXT | 头像URL | "/avatars/bill-gates.jpg" |
| `recommendation_text` | TEXT | 推荐语 | "这是今年最好的书之一" |
| `recommendation_source` | TEXT | 推荐来源 | "2024年度书单" |
| `source_url` | TEXT | 来源链接 | "https://..." |
| `display_order` | INTEGER | 显示顺序 | 1, 2, 3 |
| `is_featured` | INTEGER | 是否精选 | 0=否, 1=是 |
| `is_active` | INTEGER | 是否激活 | 0=否, 1=是 |
| `created_at` | INTEGER | 创建时间 | 1738569600 |
| `updated_at` | INTEGER | 更新时间 | 1738656000 |

### 索引
```sql
-- 查询索引
CREATE INDEX idx_celebrity_recommendations_book ON celebrity_recommendations(book_id, is_active, display_order);
CREATE INDEX idx_celebrity_recommendations_featured ON celebrity_recommendations(is_featured, is_active)
  WHERE is_featured = 1 AND is_active = 1;
```

---

## 索引策略

### 索引设计原则
1. **主键自动索引**: SQLite 自动为主键创建索引
2. **唯一约束自动索引**: UNIQUE 约束自动创建索引
3. **外键查询**: 为外键字段创建索引（user_id, book_id）
4. **时间排序**: 为常用的时间字段创建降序索引
5. **复合查询**: 为常见的组合查询创建复合索引
6. **部分索引**: 使用 WHERE 子句优化特定查询

### 索引维护
```sql
-- 查看所有索引
SELECT name, tbl_name, sql FROM sqlite_master WHERE type = 'index';

-- 分析索引使用情况（需要在查询前后运行）
EXPLAIN QUERY PLAN SELECT * FROM listening_history WHERE user_id = 1;

-- 重建索引（优化性能）
REINDEX;

-- 分析数据库统计信息
ANALYZE;
```

---

## 初始化脚本

### 完整建表脚本
```sql
-- =====================================================
-- AIreading 数据库初始化脚本
-- 数据库: SQLite
-- 版本: v1.0
-- 日期: 2026-02-05
-- =====================================================

-- 开启外键约束
PRAGMA foreign_keys = ON;

-- 设置性能优化
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -64000;

-- =====================================================
-- 1. 用户表
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  username TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  playback_speed REAL DEFAULT 1.0,
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires_at INTEGER,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_login_at INTEGER,
  
  CONSTRAINT email_format CHECK (email LIKE '%@%'),
  CONSTRAINT speed_range CHECK (playback_speed >= 0.5 AND playback_speed <= 2.0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_tier, subscription_expires_at);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- =====================================================
-- 2. 收藏表
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  notes TEXT,
  tags TEXT,
  created_at INTEGER NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_book UNIQUE (user_id, book_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_user_book ON favorites(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_book ON favorites(book_id);

-- =====================================================
-- 3. 历史记录表
-- =====================================================
CREATE TABLE IF NOT EXISTS listening_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  summary_type TEXT NOT NULL,
  progress_seconds INTEGER DEFAULT 0,
  total_seconds INTEGER,
  playback_speed REAL DEFAULT 1.0,
  is_completed INTEGER DEFAULT 0,
  completion_rate REAL GENERATED ALWAYS AS (
    CASE 
      WHEN total_seconds > 0 THEN CAST(progress_seconds AS REAL) / total_seconds 
      ELSE 0 
    END
  ) VIRTUAL,
  created_at INTEGER NOT NULL,
  last_played_at INTEGER NOT NULL,
  play_count INTEGER DEFAULT 1,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT progress_valid CHECK (progress_seconds >= 0),
  CONSTRAINT speed_valid CHECK (playback_speed >= 0.5 AND playback_speed <= 2.0)
);

CREATE INDEX IF NOT EXISTS idx_history_user_recent ON listening_history(user_id, last_played_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_book ON listening_history(book_id);
CREATE INDEX IF NOT EXISTS idx_history_completed ON listening_history(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_history_resume ON listening_history(user_id, is_completed, last_played_at DESC)
  WHERE is_completed = 0 AND progress_seconds > 0;

-- =====================================================
-- 4. 笔记表
-- =====================================================
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  summary_type TEXT,
  timestamp_seconds INTEGER,
  is_highlighted INTEGER DEFAULT 0,
  color TEXT DEFAULT 'yellow',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT content_not_empty CHECK (LENGTH(content) > 0),
  CONSTRAINT timestamp_valid CHECK (timestamp_seconds IS NULL OR timestamp_seconds >= 0)
);

CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id, book_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_book ON notes(book_id);
CREATE INDEX IF NOT EXISTS idx_notes_highlighted ON notes(user_id, is_highlighted)
  WHERE is_highlighted = 1;

-- =====================================================
-- 5. 会话表
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);

-- =====================================================
-- 6. 评论表
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_verified_purchase INTEGER DEFAULT 0,
  is_pinned INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT content_not_empty CHECK (LENGTH(content) > 0),
  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
);

CREATE INDEX IF NOT EXISTS idx_reviews_book ON reviews(book_id, is_deleted, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(book_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_likes ON reviews(book_id, likes_count DESC)
  WHERE is_deleted = 0;

-- =====================================================
-- 7. 评论点赞表
-- =====================================================
CREATE TABLE IF NOT EXISTS review_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_review UNIQUE (user_id, review_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_review_likes_user_review ON review_likes(user_id, review_id);
CREATE INDEX IF NOT EXISTS idx_review_likes_review ON review_likes(review_id);

-- =====================================================
-- 8. 名人推荐表
-- =====================================================
CREATE TABLE IF NOT EXISTS celebrity_recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL,
  celebrity_name TEXT NOT NULL,
  celebrity_title TEXT,
  celebrity_avatar_url TEXT,
  recommendation_text TEXT NOT NULL,
  recommendation_source TEXT,
  source_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  CONSTRAINT name_not_empty CHECK (LENGTH(celebrity_name) > 0),
  CONSTRAINT recommendation_not_empty CHECK (LENGTH(recommendation_text) > 0)
);

CREATE INDEX IF NOT EXISTS idx_celebrity_recommendations_book ON celebrity_recommendations(book_id, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_celebrity_recommendations_featured ON celebrity_recommendations(is_featured, is_active)
  WHERE is_featured = 1 AND is_active = 1;

-- =====================================================
-- 9. 初始数据（可选）
-- =====================================================

-- 测试用户（开发环境）
-- INSERT INTO users (email, password_hash, username, created_at, updated_at)
-- VALUES ('test@aireading.com', '$2b$10$...', 'Test User', unixepoch(), unixepoch());

-- =====================================================
-- 10. 性能优化
-- =====================================================

-- 分析表统计信息
ANALYZE;

-- =====================================================
-- 初始化完成
-- =====================================================
```

### 使用方法

#### 1. Node.js 环境初始化
```javascript
// src/lib/db.ts
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const db = new Database('data/aireading.db');

// 开启外键约束
db.pragma('foreign_keys = ON');

// 性能优化
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

// 初始化表结构
export function initDatabase() {
  const schema = readFileSync(join(__dirname, '../../scripts/init-db.sql'), 'utf8');
  db.exec(schema);
  console.log('✅ Database initialized successfully');
}

export default db;
```

#### 2. 命令行初始化
```bash
# 创建数据目录
mkdir -p data

# 使用 SQLite 命令行工具
sqlite3 data/aireading.db < scripts/init-db.sql

# 或使用 Node.js 脚本
node scripts/init-db.js
```

---

## 数据迁移策略

### 版本管理
```sql
-- 版本表
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at INTEGER NOT NULL
);

-- 示例：添加字段的迁移
-- Version: 2
ALTER TABLE users ADD COLUMN bio TEXT;

INSERT INTO schema_migrations (version, name, applied_at)
VALUES (2, 'add_user_bio', unixepoch());
```

### 迁移脚本示例
```javascript
// scripts/migrate.js
import db from '../src/lib/db';

const migrations = [
  {
    version: 1,
    name: 'initial_schema',
    up: () => {
      // 初始化表结构
      db.exec(readFileSync('scripts/init-db.sql', 'utf8'));
    },
  },
  {
    version: 2,
    name: 'add_user_bio',
    up: () => {
      db.exec('ALTER TABLE users ADD COLUMN bio TEXT;');
    },
  },
];

function getCurrentVersion() {
  try {
    const row = db.prepare('SELECT MAX(version) as version FROM schema_migrations').get();
    return row?.version || 0;
  } catch {
    return 0;
  }
}

function runMigrations() {
  const current = getCurrentVersion();
  const pending = migrations.filter(m => m.version > current);
  
  for (const migration of pending) {
    console.log(`Running migration ${migration.version}: ${migration.name}`);
    migration.up();
    
    db.prepare(`
      INSERT INTO schema_migrations (version, name, applied_at)
      VALUES (?, ?, ?)
    `).run(migration.version, migration.name, Date.now());
  }
  
  console.log(`✅ All migrations completed. Current version: ${getCurrentVersion()}`);
}

runMigrations();
```

---

## 性能建议

### 1. 查询优化
```sql
-- ❌ 慢查询（全表扫描）
SELECT * FROM listening_history WHERE book_id = 42;

-- ✅ 优化查询（使用索引）
SELECT * FROM listening_history WHERE user_id = 1 AND book_id = 42;

-- ✅ 使用 LIMIT
SELECT * FROM listening_history 
WHERE user_id = 1 
ORDER BY last_played_at DESC 
LIMIT 20;
```

### 2. 事务处理
```javascript
// 批量插入使用事务
const insertMany = db.transaction((records) => {
  const insert = db.prepare('INSERT INTO favorites (user_id, book_id, created_at) VALUES (?, ?, ?)');
  for (const record of records) {
    insert.run(record.userId, record.bookId, Date.now());
  }
});

insertMany([
  { userId: 1, bookId: 1 },
  { userId: 1, bookId: 2 },
  { userId: 1, bookId: 3 },
]);
```

### 3. 定期维护
```sql
-- 清理过期会话
DELETE FROM sessions WHERE expires_at < unixepoch();

-- 真空优化（回收空间）
VACUUM;

-- 更新统计信息
ANALYZE;
```

---

## 安全建议

### 1. 参数化查询
```javascript
// ❌ 危险：SQL注入风险
const email = req.body.email;
db.prepare(`SELECT * FROM users WHERE email = '${email}'`).get();

// ✅ 安全：使用参数化查询
const email = req.body.email;
db.prepare('SELECT * FROM users WHERE email = ?').get(email);
```

### 2. 密码处理
```javascript
import bcrypt from 'bcryptjs';

// 注册时
const passwordHash = await bcrypt.hash(password, 10);
db.prepare('INSERT INTO users (email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?)')
  .run(email, passwordHash, Date.now(), Date.now());

// 登录时
const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
const isValid = await bcrypt.compare(password, user.password_hash);
```

### 3. 数据备份
```bash
# 备份数据库
sqlite3 data/aireading.db ".backup data/backup-$(date +%Y%m%d).db"

# 定期备份（cron）
0 2 * * * sqlite3 /path/to/aireading.db ".backup /path/to/backups/aireading-$(date +\%Y\%m\%d).db"
```

---

## 附录

### SQLite 数据类型映射
| SQL类型 | SQLite存储类 | JavaScript类型 | 说明 |
|---------|-------------|----------------|------|
| INTEGER | INTEGER | number | 整数 |
| REAL | REAL | number | 浮点数 |
| TEXT | TEXT | string | 字符串 |
| BLOB | BLOB | Buffer | 二进制 |
| NULL | NULL | null | 空值 |

### 时间戳处理
```sql
-- SQLite 时间函数
SELECT unixepoch();                    -- 当前时间戳
SELECT datetime(1738569600, 'unixepoch');  -- 时间戳转日期
SELECT strftime('%Y-%m-%d', 'now');    -- 格式化日期
```

### 常用查询示例
```sql
-- 获取用户的最近播放
SELECT * FROM listening_history 
WHERE user_id = 1 
ORDER BY last_played_at DESC 
LIMIT 10;

-- 获取用户的收藏统计
SELECT COUNT(*) as total_favorites 
FROM favorites 
WHERE user_id = 1;

-- 获取完成率最高的书籍
SELECT book_id, AVG(completion_rate) as avg_completion
FROM listening_history
WHERE user_id = 1
GROUP BY book_id
ORDER BY avg_completion DESC;
```

---

**文档版本**: v1.0  
**最后更新**: 2026-02-05  
**维护者**: 后端开发团队
