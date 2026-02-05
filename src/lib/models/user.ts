/**
 * 用户数据模型
 * @module lib/models/user
 */

import db from '../db';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  username?: string;
  avatar_url?: string;
  locale: string;
  theme: string;
  playback_speed: number;
  subscription_tier: 'free' | 'pro' | 'premium';
  subscription_expires_at?: number;
  is_active: number;
  created_at: number;
  updated_at: number;
  last_login_at?: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
  username?: string;
  locale?: string;
}

export interface UpdateUserInput {
  username?: string;
  avatar_url?: string;
  locale?: string;
  theme?: string;
  playback_speed?: number;
}

/**
 * 创建新用户
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  const { email, password, username, locale = 'en' } = input;
  
  // 哈希密码
  const password_hash = await bcrypt.hash(password, 10);
  const now = Math.floor(Date.now() / 1000);
  
  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, username, locale, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(email, password_hash, username, locale, now, now);
  
  return getUserById(result.lastInsertRowid as number);
}

/**
 * 根据ID获取用户
 */
export function getUserById(id: number): User {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = stmt.get(id) as User;
  
  if (!user) {
    throw new Error(`User not found: ${id}`);
  }
  
  return user;
}

/**
 * 根据邮箱获取用户
 */
export function getUserByEmail(email: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User | undefined;
}

/**
 * 验证用户密码
 */
export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password_hash);
}

/**
 * 更新用户信息
 */
export function updateUser(id: number, input: UpdateUserInput): User {
  const fields: string[] = [];
  const values: any[] = [];
  
  if (input.username !== undefined) {
    fields.push('username = ?');
    values.push(input.username);
  }
  if (input.avatar_url !== undefined) {
    fields.push('avatar_url = ?');
    values.push(input.avatar_url);
  }
  if (input.locale !== undefined) {
    fields.push('locale = ?');
    values.push(input.locale);
  }
  if (input.theme !== undefined) {
    fields.push('theme = ?');
    values.push(input.theme);
  }
  if (input.playback_speed !== undefined) {
    fields.push('playback_speed = ?');
    values.push(input.playback_speed);
  }
  
  if (fields.length === 0) {
    return getUserById(id);
  }
  
  fields.push('updated_at = ?');
  values.push(Math.floor(Date.now() / 1000));
  values.push(id);
  
  const stmt = db.prepare(`
    UPDATE users SET ${fields.join(', ')} WHERE id = ?
  `);
  
  stmt.run(...values);
  
  return getUserById(id);
}

/**
 * 更新最后登录时间
 */
export function updateLastLogin(id: number): void {
  const stmt = db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?');
  stmt.run(Math.floor(Date.now() / 1000), id);
}

/**
 * 删除用户（软删除）
 */
export function deactivateUser(id: number): void {
  const stmt = db.prepare('UPDATE users SET is_active = 0, updated_at = ? WHERE id = ?');
  stmt.run(Math.floor(Date.now() / 1000), id);
}

/**
 * 永久删除用户
 */
export function deleteUser(id: number): void {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(id);
}
