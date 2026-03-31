/**
 * Google OAuth 回调处理
 * GET /api/auth/google/callback
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/models/user';
import { generateToken } from '@/lib/auth';
import db from '@/lib/db';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aireading.com';
const REDIRECT_URI = `${SITE_URL}/api/auth/google/callback`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(`${SITE_URL}/login?error=google_denied`);
  }

  try {
    // 1. 用 code 换 access_token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('Google token error:', tokenData);
      return NextResponse.redirect(`${SITE_URL}/login?error=google_token`);
    }

    // 2. 获取用户信息
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${SITE_URL}/login?error=google_email`);
    }

    // 3. 查找或创建用户
    let user = getUserByEmail(googleUser.email);
    const now = Math.floor(Date.now() / 1000);

    if (!user) {
      const username = googleUser.name || googleUser.email.split('@')[0];
      const avatarUrl = googleUser.picture || null;
      const stmt = db.prepare(`
        INSERT INTO users (email, password_hash, username, avatar_url, locale, created_at, updated_at, last_login_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(googleUser.email, '', username, avatarUrl, 'zh', now, now, now);
      const getStmt = db.prepare('SELECT * FROM users WHERE id = ?');
      user = getStmt.get(result.lastInsertRowid) as any;
    } else {
      db.prepare('UPDATE users SET last_login_at = ?, avatar_url = COALESCE(avatar_url, ?) WHERE id = ?')
        .run(now, googleUser.picture || null, user!.id);
    }

    // 4. 生成 JWT token
    const token = await generateToken(user!);

    // 5. 返回一个中间页，把 token 写入 localStorage 再跳转
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>登录中...</title></head>
<body>
<script>
  try {
    localStorage.setItem('aireading_token', ${JSON.stringify(token)});
    window.location.href = '/';
  } catch(e) {
    window.location.href = '/login?error=google_failed';
  }
</script>
<p style="font-family:sans-serif;text-align:center;margin-top:40px;color:#666">登录中，请稍候...</p>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (err) {
    console.error('Google OAuth error:', err);
    return NextResponse.redirect(`${SITE_URL}/login?error=google_failed`);
  }
}
