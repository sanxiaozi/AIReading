/**
 * 获取当前用户信息 API
 * GET /api/auth/me
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getUserById } from '@/lib/models/user';
import { sanitizeUser } from '@/lib/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
  try {
    // 从 Authorization header 或 cookie 获取 token
    const authHeader = request.headers.get('Authorization');
    let token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      token = request.cookies.get('auth-token')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_TOKEN' },
        { status: 401 }
      );
    }

    // 验证 token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    // 获取用户信息
    const user = getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 检查账户是否激活
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated', code: 'ACCOUNT_DEACTIVATED' },
        { status: 403 }
      );
    }

    // 返回用户信息（不含密码）
    const sanitizedUser = sanitizeUser(user);

    return NextResponse.json({
      user: sanitizedUser,
    });
  } catch (error) {
    console.error('Get current user error:', error);

    return NextResponse.json(
      { error: 'Unauthorized', code: 'INVALID_TOKEN' },
      { status: 401 }
    );
  }
}

// 不允许其他 HTTP 方法
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}
