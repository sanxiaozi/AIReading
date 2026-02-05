/**
 * 服务端认证工具函数
 * 用于 API 路由中验证用户身份
 */

import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

interface AuthPayload {
  userId: number;
  email: string;
}

/**
 * 验证 API 请求中的用户身份
 * @param request NextRequest 对象
 * @returns 包含 userId 和 email 的认证信息
 * @throws Error 如果未认证或 token 无效
 */
export async function verifyAuth(request: NextRequest): Promise<AuthPayload> {
  // 从 cookie 获取 token
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    // 验证 token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      userId: payload.userId as number,
      email: payload.email as string,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Unauthorized');
  }
}

/**
 * 可选的认证验证（不抛出错误）
 * @param request NextRequest 对象
 * @returns 认证信息或 null
 */
export async function verifyAuthOptional(request: NextRequest): Promise<AuthPayload | null> {
  try {
    return await verifyAuth(request);
  } catch {
    return null;
  }
}
