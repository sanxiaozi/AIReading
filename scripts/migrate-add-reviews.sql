-- =====================================================
-- AIreading 数据库迁移：添加评论和推荐功能
-- 版本: v1.1
-- 日期: 2026-02-05
-- =====================================================

-- 开启外键约束
PRAGMA foreign_keys = ON;

-- =====================================================
-- 1. 评论表
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
-- 2. 评论点赞表
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
-- 3. 名人推荐表
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
-- 4. 示例数据（可选）
-- =====================================================

-- 测试评论
-- INSERT INTO reviews (user_id, book_id, content, rating, created_at, updated_at)
-- VALUES (1, 1, '这本书非常棒！强烈推荐！', 5, unixepoch(), unixepoch());

-- 测试名人推荐
-- INSERT INTO celebrity_recommendations (
--   book_id, celebrity_name, celebrity_title, recommendation_text,
--   display_order, is_featured, created_at, updated_at
-- )
-- VALUES (
--   1, 'Bill Gates', '微软创始人', '这是今年最好的书之一，每个人都应该读一读。',
--   1, 1, unixepoch(), unixepoch()
-- );

-- =====================================================
-- 5. 更新数据库版本
-- =====================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO schema_migrations (version, name, applied_at)
VALUES (2, 'add_reviews_and_recommendations', unixepoch());

-- =====================================================
-- 6. 性能优化
-- =====================================================

ANALYZE;

-- =====================================================
-- 迁移完成
-- =====================================================

SELECT '✅ Migration completed: Reviews and Recommendations tables added' as result;
