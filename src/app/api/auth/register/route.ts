/**
 * 用户注册 API
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/models/user';
import { generateToken, isValidEmail, isValidPassword, sanitizeUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { email, password, username } = body;

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

    // 验证密码强度
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error, code: 'WEAK_PASSWORD' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered', code: 'EMAIL_EXISTS' },
        { status: 409 }
      );
    }

    // 创建用户
    const user = await createUser({
      email,
      password,
      username: username || undefined,
    });

    // 生成 JWT token
    const token = await generateToken(user);

    // 返回用户信息（不含密码）
    const sanitizedUser = sanitizeUser(user);

    return NextResponse.json(
      {
        message: 'User registered successfully',
        token,
        user: sanitizedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

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
