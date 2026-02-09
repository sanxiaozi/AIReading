/**
 * 用户登录 API
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword, updateLastLogin } from '@/lib/models/user';
import { generateToken, isValidEmail, sanitizeUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { email, password } = body;

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required', code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // 检查账户是否激活
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated', code: 'ACCOUNT_DEACTIVATED' },
        { status: 403 }
      );
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(user, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // 更新最后登录时间
    updateLastLogin(user.id);

    // 生成 JWT token
    const token = await generateToken(user);

    // 返回用户信息（不含密码）
    const sanitizedUser = sanitizeUser(user);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

// 不允许其他 HTTP 方法
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}
