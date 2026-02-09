/**
 * 用户信息 API（需要认证）
 * GET /api/user/profile - 获取当前用户信息
 * PUT /api/user/profile - 更新用户信息
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/models/user';
import { requireAuth, sanitizeUser } from '@/lib/auth';

/**
 * 获取当前用户信息
 */
export const GET = requireAuth(async (request, { user }) => {
  try {
    // 从数据库获取完整用户信息
    const fullUser = getUserById(user.userId);

    // 返回用户信息（不含密码）
    const sanitizedUser = sanitizeUser(fullUser);

    return NextResponse.json({
      user: sanitizedUser,
    });
  } catch (error) {
    console.error('Get profile error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch user profile', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
});

/**
 * 更新用户信息
 */
export const PUT = requireAuth(async (request, { user }) => {
  try {
    // 解析请求体
    const body = await request.json();
    const { username, avatar_url, locale, theme, playback_speed } = body;

    // 验证 playback_speed 范围
    if (playback_speed !== undefined && (playback_speed < 0.5 || playback_speed > 2.0)) {
      return NextResponse.json(
        { error: 'Playback speed must be between 0.5 and 2.0', code: 'INVALID_SPEED' },
        { status: 400 }
      );
    }

    // 验证 theme 值
    if (theme !== undefined && !['light', 'dark', 'auto'].includes(theme)) {
      return NextResponse.json(
        { error: 'Theme must be one of: light, dark, auto', code: 'INVALID_THEME' },
        { status: 400 }
      );
    }

    // 更新用户信息
    const updatedUser = updateUser(user.userId, {
      username,
      avatar_url,
      locale,
      theme,
      playback_speed,
    });

    // 返回更新后的用户信息（不含密码）
    const sanitizedUser = sanitizeUser(updatedUser);

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: sanitizedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);

    return NextResponse.json(
      { error: 'Failed to update user profile', code: 'UPDATE_ERROR' },
      { status: 500 }
    );
  }
});

// 不允许其他 HTTP 方法
export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
    { status: 405 }
  );
}
