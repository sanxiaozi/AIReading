/**
 * 诊断 API - 检查 JWT_SECRET 是否正确配置
 * GET /api/diag/jwt-secret
 */

import { NextResponse } from 'next/server';
import { JWT_SECRET } from '@/lib/auth-server';
import { SignJWT } from 'jose';

export async function GET() {
  const secretFromEnv = process.env.JWT_SECRET;
  const isDefaultSecret = !secretFromEnv || secretFromEnv === 'your-secret-key-change-this-in-production';
  
  // 尝试用当前 secret 生成一个测试 token
  let testToken = 'N/A';
  let tokenError = 'N/A';
  
  try {
    testToken = await new SignJWT({ userId: 1, email: 'test@test.com' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(JWT_SECRET);
  } catch (err) {
    tokenError = err instanceof Error ? err.message : String(err);
  }
  
  return NextResponse.json({
    jwtSecret: {
      configured: !!secretFromEnv,
      isDefault: isDefaultSecret,
      value: secretFromEnv ? `[configured, length: ${secretFromEnv.length}]` : '[not set, using default]',
    },
    testToken: {
      generated: testToken !== 'N/A',
      prefix: testToken.substring(0, 30) + '...',
      error: tokenError,
    },
    timestamp: new Date().toISOString(),
  });
}
