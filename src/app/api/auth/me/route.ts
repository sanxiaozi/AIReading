/**
 * 获取当前用户信息 API
 * GET /api/auth/me
 * 
 * 直接从 JWT payload 返回用户信息，不查数据库
 * 这样即使 Vercel 无状态部署导致 SQLite 重置，登录状态也不会丢失
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  // 从 Authorization header 或 cookie 获取 token
  const authHeader = request.headers.get('Authorization');
  let token = authHeader?.replace('Bearer ', '').trim();

  if (!token) {
    token = request.cookies.get('auth-token')?.value;
  }

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'MISSING_TOKEN' },
      { status: 401 }
    );
  }

  try {
    // 验证 token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // 直接从 JWT payload 构建用户信息，不查数据库
    // 这样 Vercel 无状态部署不会影响登录状态
    const user = {
      id: payload.userId as number,
      email: payload.email as string,
      username: (payload.username as string) || (payload.email as string)?.split('@')[0],
      name: (payload.username as string) || (payload.email as string)?.split('@')[0],
      avatar_url: (payload.avatar_url as string) || null,
      locale: (payload.locale as string) || 'zh',
      theme: 'dark',
      playback_speed: 1.0,
      subscription_tier: (payload.subscription_tier as string) || 'free',
      user_tier: (payload.subscription_tier as string) || 'free',
      is_active: 1,
      created_at: payload.iat as number || Math.floor(Date.now() / 1000),
      updated_at: payload.iat as number || Math.floor(Date.now() / 1000),
    };

    return NextResponse.json({ user });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Get current user error:', {
      message: errorMessage,
      tokenPrefix: token ? token.substring(0, 20) + '...' : 'none',
    });

    return NextResponse.json(
      { error: 'Unauthorized', code: 'INVALID_TOKEN', detail: errorMessage },
      { status: 401 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}
