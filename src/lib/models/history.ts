/**
 * 播放历史数据模型
 * @module lib/models/history
 */

import db from '../db';

export interface ListeningHistory {
  id: number;
  user_id: number;
  book_id: number;
  summary_type: 'short' | 'medium' | 'long';
  progress_seconds: number;
  total_seconds: number;
  playback_speed: number;
  is_completed: number;
  completion_rate: number; // Virtual column
  created_at: number;
  last_played_at: number;
  play_count: number;
}

export interface CreateHistoryInput {
  user_id: number;
  book_id: number;
  summary_type: 'short' | 'medium' | 'long';
  total_seconds: number;
  playback_speed?: number;
}

export interface UpdateProgressInput {
  progress_seconds: number;
  playback_speed?: number;
}

/**
 * 创建播放记录
 */
export function createHistory(input: CreateHistoryInput): ListeningHistory {
  const { user_id, book_id, summary_type, total_seconds, playback_speed = 1.0 } = input;
  const now = Math.floor(Date.now() / 1000);
  
  const stmt = db.prepare(`
    INSERT INTO listening_history 
    (user_id, book_id, summary_type, total_seconds, playback_speed, created_at, last_played_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(user_id, book_id, summary_type, total_seconds, playback_speed, now, now);
  
  return getHistoryById(result.lastInsertRowid as number);
}

/**
 * 根据ID获取历史记录
 */
export function getHistoryById(id: number): ListeningHistory {
  const stmt = db.prepare('SELECT * FROM listening_history WHERE id = ?');
  const history = stmt.get(id) as ListeningHistory;
  
  if (!history) {
    throw new Error(`History not found: ${id}`);
  }
  
  return history;
}

/**
 * 获取或创建播放记录
 */
export function getOrCreateHistory(input: CreateHistoryInput): ListeningHistory {
  const { user_id, book_id, summary_type } = input;
  
  // 查找现有记录
  const stmt = db.prepare(`
    SELECT * FROM listening_history 
    WHERE user_id = ? AND book_id = ? AND summary_type = ?
  `);
  
  const existing = stmt.get(user_id, book_id, summary_type) as ListeningHistory | undefined;
  
  if (existing) {
    return existing;
  }
  
  // 创建新记录
  return createHistory(input);
}

/**
 * 更新播放进度
 */
export function updateProgress(
  userId: number,
  bookId: number,
  summaryType: string,
  input: UpdateProgressInput
): ListeningHistory {
  const { progress_seconds, playback_speed } = input;
  const now = Math.floor(Date.now() / 1000);
  
  // 获取现有记录
  const existing = db.prepare(`
    SELECT * FROM listening_history 
    WHERE user_id = ? AND book_id = ? AND summary_type = ?
  `).get(userId, bookId, summaryType) as ListeningHistory;
  
  if (!existing) {
    throw new Error('History record not found');
  }
  
  // 判断是否完成
  const is_completed = progress_seconds >= existing.total_seconds ? 1 : 0;
  
  // 更新进度
  const updateStmt = db.prepare(`
    UPDATE listening_history 
    SET progress_seconds = ?,
        playback_speed = ?,
        is_completed = ?,
        last_played_at = ?,
        play_count = play_count + 1
    WHERE user_id = ? AND book_id = ? AND summary_type = ?
  `);
  
  updateStmt.run(
    progress_seconds,
    playback_speed || existing.playback_speed,
    is_completed,
    now,
    userId,
    bookId,
    summaryType
  );
  
  return getHistoryById(existing.id);
}

/**
 * 获取用户的播放历史
 */
export function getUserHistory(userId: number, limit = 50, offset = 0): ListeningHistory[] {
  const stmt = db.prepare(`
    SELECT * FROM listening_history 
    WHERE user_id = ? 
    ORDER BY last_played_at DESC 
    LIMIT ? OFFSET ?
  `);
  
  return stmt.all(userId, limit, offset) as ListeningHistory[];
}

/**
 * 获取未完成的播放记录（用于"继续播放"）
 */
export function getResumeList(userId: number, limit = 10): ListeningHistory[] {
  const stmt = db.prepare(`
    SELECT * FROM listening_history 
    WHERE user_id = ? 
      AND is_completed = 0 
      AND progress_seconds > 0
    ORDER BY last_played_at DESC 
    LIMIT ?
  `);
  
  return stmt.all(userId, limit) as ListeningHistory[];
}

/**
 * 获取已完成的播放记录
 */
export function getCompletedList(userId: number, limit = 50, offset = 0): ListeningHistory[] {
  const stmt = db.prepare(`
    SELECT * FROM listening_history 
    WHERE user_id = ? AND is_completed = 1
    ORDER BY last_played_at DESC 
    LIMIT ? OFFSET ?
  `);
  
  return stmt.all(userId, limit, offset) as ListeningHistory[];
}

/**
 * 获取播放统计
 */
export function getListeningStats(userId: number): {
  total_books: number;
  completed_books: number;
  total_listening_time: number;
  avg_completion_rate: number;
} {
  const stmt = db.prepare(`
    SELECT 
      COUNT(DISTINCT book_id) as total_books,
      SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed_books,
      SUM(progress_seconds) as total_listening_time,
      AVG(completion_rate) as avg_completion_rate
    FROM listening_history
    WHERE user_id = ?
  `);
  
  return stmt.get(userId) as any;
}

/**
 * 删除播放记录
 */
export function deleteHistory(id: number): boolean {
  const stmt = db.prepare('DELETE FROM listening_history WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
