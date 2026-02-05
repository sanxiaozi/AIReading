#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 使用方法: node scripts/init-db.js
 */

const { initDatabase, getDatabaseInfo } = require('../src/lib/db.ts');

async function main() {
  console.log('🚀 Initializing AIreading Database...\n');
  
  try {
    // 初始化数据库
    initDatabase();
    
    // 显示数据库信息
    const info = getDatabaseInfo();
    console.log('\n📊 Database Information:');
    console.log(`   Path: ${info.path}`);
    console.log(`   Size: ${(info.size / 1024).toFixed(2)} KB`);
    console.log(`   Version: ${info.version}`);
    console.log(`   Tables: ${info.tables.length}`);
    console.log('\n📋 Tables:');
    info.tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
    
    console.log('\n✅ Database initialization completed successfully!');
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
