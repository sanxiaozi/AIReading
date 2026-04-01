/**
 * 诊断 API - 测试 token 生成和验证
 * POST /api/diag/token-test
 * Body: { email: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyToken } from '@/lib/auth';
import { getUserByEmail } from '@/lib/models/user';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    
    // 获取用户
    let user = getUserByEmail(email);
    
    // 如果用户不存在，创建一个测试用户
    if (!user) {
      const now = Math.floor(Date.now() / 1000);
      const stmt = db.prepare(`
        INSERT INTO users (email, password_hash, username, locale, created_at, updated_at, last_login_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(email, '', email.split('@')[0], 'zh', now, now, now);
      const getStmt = db.prepare('SELECT * FROM users WHERE id = ?');
      user = getStmt.get(result.lastInsertRowid) as any;
    }
    
    // 生成 token
    const token = await generateToken(user!);
    
    // 尝试验证 token
    let verifyResult = 'N/A';
    let verifyError = 'N/A';
    
    try {
      const payload = await verifyToken(token);
      verifyResult = JSON.stringify({ userId: payload.userId, email: payload.email });
    } catch (err) {
      verifyError = err instanceof Error ? err.message : String(err);
    }
    
    return NextResponse.json({
      user: { id: user!.id, email: user!.email },
      token: {
        value: token,
        prefix: token.substring(0, 30) + '...',
        length: token.length,
      },
      verify: {
        result: verifyResult,
        error: verifyError,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
