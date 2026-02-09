/**
 * JWT 认证工具
 * @module lib/auth
 */

import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { User } from './models/user';

// JWT 配置
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);
const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRATION = '7d'; // 7天过期

export interface JWTPayload {
  userId: number;
  email: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * 生成 JWT Token
 */
export async function generateToken(user: Pick<User, 'id' | 'email'>): Promise<string> {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * 验证 JWT Token
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    });

    return payload as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * 从请求中提取 Token
 */
export function extractToken(request: NextRequest): string | null {
  // 从 Authorization header 提取
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 从 Cookie 提取（可选）
  const cookieToken = request.cookies.get('token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * API 路由认证中间件
 * 用于保护需要登录的 API 路由
 */
export function requireAuth(
  handler: (
    request: NextRequest,
    context: { params?: any; user: JWTPayload }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: { params?: any }): Promise<NextResponse> => {
    try {
      // 提取 token
      const token = extractToken(request);
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required', code: 'AUTH_REQUIRED' },
          { status: 401 }
        );
      }

      // 验证 token
      const payload = await verifyToken(token);

      // 将用户信息传递给处理器
      return handler(request, { ...context, user: payload });
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }
  };
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证密码强度
 * 要求：至少8个字符，包含大小写字母和数字
 */
export function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  return { valid: true };
}

/**
 * 清理用户数据（移除敏感信息）
 */
export function sanitizeUser(user: User): Omit<User, 'password_hash'> {
  const { password_hash, ...sanitized } = user;
  return sanitized;
}
