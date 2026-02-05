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
-- 6. Schema版本表
-- =====================================================
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at INTEGER NOT NULL
);

-- 插入初始版本
INSERT OR IGNORE INTO schema_migrations (version, name, applied_at)
VALUES (1, 'initial_schema', unixepoch());

-- =====================================================
-- 7. 性能优化
-- =====================================================

-- 分析表统计信息
ANALYZE;

-- =====================================================
-- 初始化完成
-- =====================================================
