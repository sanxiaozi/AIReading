/**
 * 名人推荐数据模型
 * @module lib/models/recommendation
 */

import db from '../db';

export interface CelebrityRecommendation {
  id: number;
  book_id: number;
  celebrity_name: string;
  celebrity_title?: string;
  celebrity_avatar_url?: string;
  recommendation_text: string;
  recommendation_source?: string;
  source_url?: string;
  display_order: number;
  is_featured: number;
  is_active: number;
  created_at: number;
  updated_at: number;
}

export interface CreateRecommendationInput {
  book_id: number;
  celebrity_name: string;
  celebrity_title?: string;
  celebrity_avatar_url?: string;
  recommendation_text: string;
  recommendation_source?: string;
  source_url?: string;
  display_order?: number;
  is_featured?: boolean;
}

export interface UpdateRecommendationInput {
  celebrity_name?: string;
  celebrity_title?: string;
  celebrity_avatar_url?: string;
  recommendation_text?: string;
  recommendation_source?: string;
  source_url?: string;
  display_order?: number;
  is_featured?: boolean;
  is_active?: boolean;
}

/**
 * 创建名人推荐
 */
export function createRecommendation(input: CreateRecommendationInput): CelebrityRecommendation {
  const {
    book_id,
    celebrity_name,
    celebrity_title,
    celebrity_avatar_url,
    recommendation_text,
    recommendation_source,
    source_url,
    display_order = 0,
    is_featured = false,
  } = input;
  
  const now = Math.floor(Date.now() / 1000);
  
  const stmt = db.prepare(`
    INSERT INTO celebrity_recommendations (
      book_id, celebrity_name, celebrity_title, celebrity_avatar_url,
      recommendation_text, recommendation_source, source_url,
      display_order, is_featured, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    book_id,
    celebrity_name,
    celebrity_title,
    celebrity_avatar_url,
    recommendation_text,
    recommendation_source,
    source_url,
    display_order,
    is_featured ? 1 : 0,
    now,
    now
  );
  
  return getRecommendationById(result.lastInsertRowid as number);
}

/**
 * 根据ID获取推荐
 */
export function getRecommendationById(id: number): CelebrityRecommendation {
  const stmt = db.prepare('SELECT * FROM celebrity_recommendations WHERE id = ?');
  const recommendation = stmt.get(id) as CelebrityRecommendation;
  
  if (!recommendation) {
    throw new Error(`Recommendation not found: ${id}`);
  }
  
  return recommendation;
}

/**
 * 获取书籍的名人推荐列表
 */
export function getBookRecommendations(
  bookId: number,
  options?: {
    limit?: number;
    offset?: number;
    onlyActive?: boolean;
    onlyFeatured?: boolean;
  }
): CelebrityRecommendation[] {
  const { limit = 10, offset = 0, onlyActive = true, onlyFeatured = false } = options || {};
  
  let whereClause = 'book_id = ?';
  const params: any[] = [bookId];
  
  if (onlyActive) {
    whereClause += ' AND is_active = 1';
  }
  
  if (onlyFeatured) {
    whereClause += ' AND is_featured = 1';
  }
  
  const stmt = db.prepare(`
    SELECT * FROM celebrity_recommendations 
    WHERE ${whereClause}
    ORDER BY display_order ASC, created_at DESC
    LIMIT ? OFFSET ?
  `);
  
  params.push(limit, offset);
  
  return stmt.all(...params) as CelebrityRecommendation[];
}

/**
 * 获取所有精选推荐
 */
export function getFeaturedRecommendations(limit = 20): CelebrityRecommendation[] {
  const stmt = db.prepare(`
    SELECT * FROM celebrity_recommendations 
    WHERE is_featured = 1 AND is_active = 1
    ORDER BY display_order ASC, created_at DESC
    LIMIT ?
  `);
  
  return stmt.all(limit) as CelebrityRecommendation[];
}

/**
 * 更新推荐
 */
export function updateRecommendation(
  id: number,
  input: UpdateRecommendationInput
): CelebrityRecommendation {
  const fields: string[] = [];
  const values: any[] = [];
  
  if (input.celebrity_name !== undefined) {
    fields.push('celebrity_name = ?');
    values.push(input.celebrity_name);
  }
  if (input.celebrity_title !== undefined) {
    fields.push('celebrity_title = ?');
    values.push(input.celebrity_title);
  }
  if (input.celebrity_avatar_url !== undefined) {
    fields.push('celebrity_avatar_url = ?');
    values.push(input.celebrity_avatar_url);
  }
  if (input.recommendation_text !== undefined) {
    fields.push('recommendation_text = ?');
    values.push(input.recommendation_text);
  }
  if (input.recommendation_source !== undefined) {
    fields.push('recommendation_source = ?');
    values.push(input.recommendation_source);
  }
  if (input.source_url !== undefined) {
    fields.push('source_url = ?');
    values.push(input.source_url);
  }
  if (input.display_order !== undefined) {
    fields.push('display_order = ?');
    values.push(input.display_order);
  }
  if (input.is_featured !== undefined) {
    fields.push('is_featured = ?');
    values.push(input.is_featured ? 1 : 0);
  }
  if (input.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(input.is_active ? 1 : 0);
  }
  
  if (fields.length === 0) {
    return getRecommendationById(id);
  }
  
  fields.push('updated_at = ?');
  values.push(Math.floor(Date.now() / 1000));
  values.push(id);
  
  const stmt = db.prepare(`
    UPDATE celebrity_recommendations SET ${fields.join(', ')} 
    WHERE id = ?
  `);
  
  stmt.run(...values);
  
  return getRecommendationById(id);
}

/**
 * 删除推荐
 */
export function deleteRecommendation(id: number): boolean {
  const stmt = db.prepare('DELETE FROM celebrity_recommendations WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

/**
 * 设置推荐的激活状态
 */
export function setRecommendationActive(id: number, isActive: boolean): CelebrityRecommendation {
  const stmt = db.prepare(`
    UPDATE celebrity_recommendations SET is_active = ?, updated_at = ? 
    WHERE id = ?
  `);
  
  stmt.run(isActive ? 1 : 0, Math.floor(Date.now() / 1000), id);
  
  return getRecommendationById(id);
}

/**
 * 设置推荐为精选
 */
export function setRecommendationFeatured(id: number, isFeatured: boolean): CelebrityRecommendation {
  const stmt = db.prepare(`
    UPDATE celebrity_recommendations SET is_featured = ?, updated_at = ? 
    WHERE id = ?
  `);
  
  stmt.run(isFeatured ? 1 : 0, Math.floor(Date.now() / 1000), id);
  
  return getRecommendationById(id);
}

/**
 * 批量更新显示顺序
 */
export function updateRecommendationOrder(items: Array<{ id: number; order: number }>): void {
  const transaction = db.transaction(() => {
    const stmt = db.prepare(`
      UPDATE celebrity_recommendations SET display_order = ?, updated_at = ? 
      WHERE id = ?
    `);
    
    const now = Math.floor(Date.now() / 1000);
    
    for (const item of items) {
      stmt.run(item.order, now, item.id);
    }
  });
  
  transaction();
}

/**
 * 获取书籍的推荐统计
 */
export function getBookRecommendationStats(bookId: number): {
  total_count: number;
  active_count: number;
  featured_count: number;
} {
  const stmt = db.prepare(`
    SELECT 
      COUNT(*) as total_count,
      SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count,
      SUM(CASE WHEN is_featured = 1 AND is_active = 1 THEN 1 ELSE 0 END) as featured_count
    FROM celebrity_recommendations 
    WHERE book_id = ?
  `);
  
  const result = stmt.get(bookId) as any;
  
  return {
    total_count: result.total_count || 0,
    active_count: result.active_count || 0,
    featured_count: result.featured_count || 0,
  };
}
