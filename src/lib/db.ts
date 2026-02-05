/**
 * 数据库连接和初始化
 * @module lib/db
 */

import Database from 'better-sqlite3';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// 数据库文件路径
const DB_PATH = process.env.DATABASE_PATH || join(process.cwd(), 'data/aireading.db');

// 创建数据库连接
const db = new Database(DB_PATH, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
});

// 开启外键约束
db.pragma('foreign_keys = ON');

// 性能优化设置
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -64000'); // 64MB cache

/**
 * 初始化数据库表结构
 */
export function initDatabase() {
  try {
    const schemaPath = join(process.cwd(), 'scripts/init-db.sql');
    
    if (!existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    
    const schema = readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    
    console.log('✅ Database initialized successfully');
    console.log(`📁 Database location: ${DB_PATH}`);
    
    // 显示当前版本
    const version = db.prepare('SELECT MAX(version) as version FROM schema_migrations').get() as { version: number };
    console.log(`📊 Schema version: ${version.version}`);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

/**
 * 获取数据库信息
 */
export function getDatabaseInfo() {
  const info = {
    path: DB_PATH,
    size: db.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()').get() as { size: number },
    tables: db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all() as { name: string }[],
    version: db.prepare('SELECT MAX(version) as version FROM schema_migrations').get() as { version: number },
  };
  
  return info;
}

/**
 * 清理过期会话
 */
export function cleanExpiredSessions() {
  const result = db.prepare('DELETE FROM sessions WHERE expires_at < unixepoch()').run();
  console.log(`🧹 Cleaned ${result.changes} expired sessions`);
  return result.changes;
}

/**
 * 数据库备份
 */
export function backupDatabase(backupPath?: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = backupPath || join(process.cwd(), `data/backup-${timestamp}.db`);
  
  db.backup(path);
  console.log(`💾 Database backed up to: ${path}`);
  
  return path;
}

/**
 * 优化数据库
 */
export function optimizeDatabase() {
  console.log('🔧 Optimizing database...');
  
  // 清理过期会话
  cleanExpiredSessions();
  
  // 分析表统计
  db.exec('ANALYZE');
  
  // 真空优化
  db.exec('VACUUM');
  
  console.log('✅ Database optimization completed');
}

// 导出数据库实例
export default db;
