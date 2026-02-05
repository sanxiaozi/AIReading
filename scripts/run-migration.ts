/**
 * 数据库迁移脚本运行器
 * 使用方法: npx tsx scripts/run-migration.ts
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'aireading.db');
const MIGRATION_FILE = join(process.cwd(), 'scripts', 'migrate-add-reviews.sql');

function runMigration() {
  console.log('🚀 Starting database migration...\n');
  
  try {
    // 连接数据库
    const db = new Database(DB_PATH);
    console.log(`✅ Connected to database: ${DB_PATH}`);
    
    // 开启外键约束
    db.pragma('foreign_keys = ON');
    
    // 读取迁移脚本
    const migrationSQL = readFileSync(MIGRATION_FILE, 'utf8');
    console.log(`✅ Loaded migration file: ${MIGRATION_FILE}\n`);
    
    // 执行迁移
    console.log('⏳ Running migration...');
    db.exec(migrationSQL);
    
    // 检查表是否创建成功
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('reviews', 'review_likes', 'celebrity_recommendations')
      ORDER BY name
    `).all();
    
    console.log('\n✅ Migration completed successfully!\n');
    console.log('📊 Created tables:');
    tables.forEach((table: any) => {
      console.log(`   - ${table.name}`);
    });
    
    // 显示版本信息
    const version = db.prepare('SELECT MAX(version) as version FROM schema_migrations').get() as any;
    console.log(`\n📌 Current schema version: ${version.version}`);
    
    db.close();
    console.log('\n✨ Done!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
