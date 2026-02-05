/**
 * 评论数据模型
 * @module lib/models/review
 */

import db from '../db';

export interface Review {
  id: number;
  user_id: number;
  book_id: number;
  content: string;
  rating: number;
  likes_count: number;
  is_verified_purchase: number;
  is_pinned: number;
  is_deleted: number;
  created_at: number;
  updated_at: number;
}

export interface ReviewWithUser extends Review {
  username?: string;
  avatar_url?: string;
  user_liked?: boolean; // 当前用户是否点赞
}

export interface CreateReviewInput {
  user_id: number;
  book_id: number;
  content: string;
  rating: number;
}

export interface UpdateReviewInput {
  content?: string;
  rating?: number;
}

/**
 * 创建评论
 */
export function createReview(input: CreateReviewInput): Review {
  const { user_id, book_id, content, rating } = input;
  const now = Math.floor(Date.now() / 1000);
  
  // 验证评分范围
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  const stmt = db.prepare(`
    INSERT INTO reviews (user_id, book_id, content, rating, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(user_id, book_id, content, rating, now, now);
  
  return getReviewById(result.lastInsertRowid as number);
}

/**
 * 根据ID获取评论
 */
export function getReviewById(id: number): Review {
  const stmt = db.prepare('SELECT * FROM reviews WHERE id = ? AND is_deleted = 0');
  const review = stmt.get(id) as Review;
  
  if (!review) {
    throw new Error(`Review not found: ${id}`);
  }
  
  return review;
}

/**
 * 获取书籍的评论列表（带用户信息）
 */
export function getBookReviews(
  bookId: number,
  currentUserId?: number,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'latest' | 'likes' | 'rating';
  }
): ReviewWithUser[] {
  const { limit = 20, offset = 0, sortBy = 'latest' } = options || {};
  
  let orderBy = 'r.created_at DESC';
  if (sortBy === 'likes') {
    orderBy = 'r.likes_count DESC, r.created_at DESC';
  } else if (sortBy === 'rating') {
    orderBy = 'r.rating DESC, r.created_at DESC';
  }
  
  const stmt = db.prepare(`
    SELECT 
      r.*,
      u.username,
      u.avatar_url,
      ${currentUserId ? `
        EXISTS(
          SELECT 1 FROM review_likes 
          WHERE review_id = r.id AND user_id = ?
        ) as user_liked
      ` : '0 as user_liked'}
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.book_id = ? AND r.is_deleted = 0
    ORDER BY r.is_pinned DESC, ${orderBy}
    LIMIT ? OFFSET ?
  `);
  
  if (currentUserId) {
    return stmt.all(currentUserId, bookId, limit, offset) as ReviewWithUser[];
  } else {
    return stmt.all(bookId, limit, offset) as ReviewWithUser[];
  }
}

/**
 * 获取用户的评论列表
 */
export function getUserReviews(userId: number, limit = 50, offset = 0): Review[] {
  const stmt = db.prepare(`
    SELECT * FROM reviews 
    WHERE user_id = ? AND is_deleted = 0
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `);
  
  return stmt.all(userId, limit, offset) as Review[];
}

/**
 * 更新评论
 */
export function updateReview(id: number, userId: number, input: UpdateReviewInput): Review {
  const fields: string[] = [];
  const values: any[] = [];
  
  if (input.content !== undefined) {
    fields.push('content = ?');
    values.push(input.content);
  }
  if (input.rating !== undefined) {
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    fields.push('rating = ?');
    values.push(input.rating);
  }
  
  if (fields.length === 0) {
    return getReviewById(id);
  }
  
  fields.push('updated_at = ?');
  values.push(Math.floor(Date.now() / 1000));
  values.push(id);
  values.push(userId);
  
  const stmt = db.prepare(`
    UPDATE reviews SET ${fields.join(', ')} 
    WHERE id = ? AND user_id = ? AND is_deleted = 0
  `);
  
  const result = stmt.run(...values);
  
  if (result.changes === 0) {
    throw new Error('Review not found or permission denied');
  }
  
  return getReviewById(id);
}

/**
 * 删除评论（软删除）
 */
export function deleteReview(id: number, userId: number): boolean {
  const stmt = db.prepare(`
    UPDATE reviews SET is_deleted = 1, updated_at = ? 
    WHERE id = ? AND user_id = ? AND is_deleted = 0
  `);
  
  const result = stmt.run(Math.floor(Date.now() / 1000), id, userId);
  return result.changes > 0;
}

/**
 * 点赞评论
 */
export function likeReview(reviewId: number, userId: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  
  try {
    // 使用事务确保原子性
    const transaction = db.transaction(() => {
      // 添加点赞记录
      const insertStmt = db.prepare(`
        INSERT INTO review_likes (review_id, user_id, created_at)
        VALUES (?, ?, ?)
      `);
      insertStmt.run(reviewId, userId, now);
      
      // 增加点赞数
      const updateStmt = db.prepare(`
        UPDATE reviews SET likes_count = likes_count + 1 
        WHERE id = ?
      `);
      updateStmt.run(reviewId);
    });
    
    transaction();
    return true;
  } catch (error: any) {
    // 如果是唯一约束冲突（已经点赞过），返回 false
    if (error.message.includes('UNIQUE constraint failed')) {
      return false;
    }
    throw error;
  }
}

/**
 * 取消点赞评论
 */
export function unlikeReview(reviewId: number, userId: number): boolean {
  try {
    // 使用事务确保原子性
    const transaction = db.transaction(() => {
      // 删除点赞记录
      const deleteStmt = db.prepare(`
        DELETE FROM review_likes WHERE review_id = ? AND user_id = ?
      `);
      const result = deleteStmt.run(reviewId, userId);
      
      if (result.changes === 0) {
        throw new Error('Like not found');
      }
      
      // 减少点赞数
      const updateStmt = db.prepare(`
        UPDATE reviews SET likes_count = likes_count - 1 
        WHERE id = ? AND likes_count > 0
      `);
      updateStmt.run(reviewId);
    });
    
    transaction();
    return true;
  } catch (error: any) {
    if (error.message === 'Like not found') {
      return false;
    }
    throw error;
  }
}

/**
 * 检查用户是否已点赞
 */
export function hasUserLiked(reviewId: number, userId: number): boolean {
  const stmt = db.prepare(`
    SELECT 1 FROM review_likes WHERE review_id = ? AND user_id = ?
  `);
  return stmt.get(reviewId, userId) !== undefined;
}

/**
 * 获取书籍的评论统计
 */
export interface ReviewStats {
  total_count: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export function getBookReviewStats(bookId: number): ReviewStats {
  const stmt = db.prepare(`
    SELECT 
      COUNT(*) as total_count,
      AVG(rating) as average_rating,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5
    FROM reviews 
    WHERE book_id = ? AND is_deleted = 0
  `);
  
  const result = stmt.get(bookId) as any;
  
  return {
    total_count: result.total_count || 0,
    average_rating: result.average_rating || 0,
    rating_distribution: {
      1: result.rating_1 || 0,
      2: result.rating_2 || 0,
      3: result.rating_3 || 0,
      4: result.rating_4 || 0,
      5: result.rating_5 || 0,
    },
  };
}

/**
 * 检查用户是否已评论过该书籍
 */
export function hasUserReviewedBook(userId: number, bookId: number): boolean {
  const stmt = db.prepare(`
    SELECT 1 FROM reviews 
    WHERE user_id = ? AND book_id = ? AND is_deleted = 0
  `);
  return stmt.get(userId, bookId) !== undefined;
}
