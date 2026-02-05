/**
 * 收藏数据模型
 * @module lib/models/favorite
 */

import db from '../db';

export interface Favorite {
  id: number;
  user_id: number;
  book_id: number;
  notes?: string;
  tags?: string; // JSON string array
  created_at: number;
}

export interface CreateFavoriteInput {
  user_id: number;
  book_id: number;
  notes?: string;
  tags?: string[];
}

/**
 * 添加收藏
 */
export function addFavorite(input: CreateFavoriteInput): Favorite {
  const { user_id, book_id, notes, tags } = input;
  const now = Math.floor(Date.now() / 1000);
  
  const stmt = db.prepare(`
    INSERT INTO favorites (user_id, book_id, notes, tags, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const tagsJson = tags ? JSON.stringify(tags) : null;
  const result = stmt.run(user_id, book_id, notes, tagsJson, now);
  
  return getFavoriteById(result.lastInsertRowid as number);
}

/**
 * 根据ID获取收藏
 */
export function getFavoriteById(id: number): Favorite {
  const stmt = db.prepare('SELECT * FROM favorites WHERE id = ?');
  const favorite = stmt.get(id) as Favorite;
  
  if (!favorite) {
    throw new Error(`Favorite not found: ${id}`);
  }
  
  return favorite;
}

/**
 * 获取用户的所有收藏
 */
export function getUserFavorites(userId: number, limit = 50, offset = 0): Favorite[] {
  const stmt = db.prepare(`
    SELECT * FROM favorites 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `);
  
  return stmt.all(userId, limit, offset) as Favorite[];
}

/**
 * 检查是否已收藏
 */
export function isFavorited(userId: number, bookId: number): boolean {
  const stmt = db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND book_id = ?');
  return stmt.get(userId, bookId) !== undefined;
}

/**
 * 删除收藏
 */
export function removeFavorite(userId: number, bookId: number): boolean {
  const stmt = db.prepare('DELETE FROM favorites WHERE user_id = ? AND book_id = ?');
  const result = stmt.run(userId, bookId);
  return result.changes > 0;
}

/**
 * 更新收藏笔记
 */
export function updateFavoriteNotes(id: number, notes: string): Favorite {
  const stmt = db.prepare('UPDATE favorites SET notes = ? WHERE id = ?');
  stmt.run(notes, id);
  return getFavoriteById(id);
}

/**
 * 更新收藏标签
 */
export function updateFavoriteTags(id: number, tags: string[]): Favorite {
  const stmt = db.prepare('UPDATE favorites SET tags = ? WHERE id = ?');
  stmt.run(JSON.stringify(tags), id);
  return getFavoriteById(id);
}

/**
 * 获取收藏统计
 */
export function getFavoriteStats(userId: number): { total: number } {
  const stmt = db.prepare('SELECT COUNT(*) as total FROM favorites WHERE user_id = ?');
  return stmt.get(userId) as { total: number };
}
