/**
 * 评论和推荐示例数据填充脚本
 * 使用方法: npx tsx scripts/seed-reviews.ts
 */

import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'aireading.db');

function seedData() {
  console.log('🌱 Seeding sample data for reviews and recommendations...\n');
  
  try {
    const db = new Database(DB_PATH);
    db.pragma('foreign_keys = ON');
    
    const now = Math.floor(Date.now() / 1000);
    
    // 首先创建测试用户（如果不存在）
    console.log('👤 Checking/Creating test user...');
    const userCheck = db.prepare('SELECT id FROM users WHERE email = ?').get('test@aireading.com');
    
    if (!userCheck) {
      const insertUser = db.prepare(`
        INSERT INTO users (email, password_hash, username, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertUser.run('test@aireading.com', '$2b$10$dummy', 'Test User', now, now);
      console.log('   ✅ Created test user');
    } else {
      console.log('   ✅ Test user already exists');
    }
    
    // 示例评论数据
    const sampleReviews = [
      {
        user_id: 1,
        book_id: 1,
        content: '这本书非常精彩！作者的洞察力令人惊叹，每一页都让人受益匪浅。',
        rating: 5,
      },
      {
        user_id: 1,
        book_id: 1,
        content: '很好的一本书，但有些章节稍显冗长。不过总体来说值得一读。',
        rating: 4,
      },
      {
        user_id: 1,
        book_id: 1,
        content: '内容不错，但感觉有些观点比较陈旧了。期待作者的下一本作品。',
        rating: 3,
      },
    ];
    
    // 示例名人推荐数据
    const sampleRecommendations = [
      {
        book_id: 1,
        celebrity_name: 'Bill Gates',
        celebrity_title: '微软创始人',
        celebrity_avatar_url: '/avatars/bill-gates.jpg',
        recommendation_text: '这是今年最好的书之一，每个人都应该读一读。它改变了我对世界的看法。',
        recommendation_source: '2024年度书单',
        source_url: 'https://www.gatesnotes.com',
        display_order: 1,
        is_featured: 1,
      },
      {
        book_id: 1,
        celebrity_name: 'Elon Musk',
        celebrity_title: 'Tesla & SpaceX CEO',
        celebrity_avatar_url: '/avatars/elon-musk.jpg',
        recommendation_text: '非常有启发性的一本书，强烈推荐给所有对未来感兴趣的人。',
        recommendation_source: 'Twitter 推荐',
        display_order: 2,
        is_featured: 1,
      },
      {
        book_id: 1,
        celebrity_name: 'Warren Buffett',
        celebrity_title: '伯克希尔·哈撒韦董事长',
        celebrity_avatar_url: '/avatars/warren-buffett.jpg',
        recommendation_text: '这本书提供了深刻的商业洞察，值得反复阅读。',
        recommendation_source: '年度股东信',
        display_order: 3,
        is_featured: 0,
      },
    ];
    
    // 插入评论
    console.log('📝 Inserting sample reviews...');
    const insertReview = db.prepare(`
      INSERT INTO reviews (user_id, book_id, content, rating, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    for (const review of sampleReviews) {
      try {
        insertReview.run(
          review.user_id,
          review.book_id,
          review.content,
          review.rating,
          now,
          now
        );
        console.log(`   ✅ Added review: "${review.content.substring(0, 30)}..."`);
      } catch (error: any) {
        console.log(`   ⚠️  Skipped (may already exist): "${review.content.substring(0, 30)}..."`);
      }
    }
    
    // 插入名人推荐
    console.log('\n⭐ Inserting celebrity recommendations...');
    const insertRecommendation = db.prepare(`
      INSERT INTO celebrity_recommendations (
        book_id, celebrity_name, celebrity_title, celebrity_avatar_url,
        recommendation_text, recommendation_source, source_url,
        display_order, is_featured, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const rec of sampleRecommendations) {
      try {
        insertRecommendation.run(
          rec.book_id,
          rec.celebrity_name,
          rec.celebrity_title,
          rec.celebrity_avatar_url,
          rec.recommendation_text,
          rec.recommendation_source,
          rec.source_url || null,
          rec.display_order,
          rec.is_featured,
          now,
          now
        );
        console.log(`   ✅ Added recommendation from: ${rec.celebrity_name}`);
      } catch (error: any) {
        console.log(`   ⚠️  Skipped (may already exist): ${rec.celebrity_name}`);
      }
    }
    
    // 统计信息
    const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get() as any;
    const recCount = db.prepare('SELECT COUNT(*) as count FROM celebrity_recommendations').get() as any;
    
    console.log('\n📊 Current data stats:');
    console.log(`   - Reviews: ${reviewCount.count}`);
    console.log(`   - Celebrity Recommendations: ${recCount.count}`);
    
    db.close();
    console.log('\n✨ Seeding completed!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedData();
