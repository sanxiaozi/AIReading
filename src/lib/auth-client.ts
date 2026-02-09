/**
 * 客户端认证工具函数
 */

interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterInput {
  email: string;
  password: string;
  username?: string;
  locale?: string;
}

interface User {
  id: number;
  email: string;
  username?: string;
  avatar_url?: string;
  locale: string;
  theme: string;
  playback_speed: number;
  subscription_tier: 'free' | 'pro' | 'premium';
  is_active: number;
  created_at: number;
  updated_at: number;
  last_login_at?: number;
}

interface AuthResponse {
  user: User;
  token: string;
}

/**
 * 获取 Authorization header
 */
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('aireading_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * 用户登录
 */
export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

/**
 * 用户注册
 */
export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 验证密码强度
 * @returns {object} { isValid: boolean, strength: 'weak' | 'medium' | 'strong' }
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
} {
  if (!password || password.length < 8) {
    return { isValid: false, strength: 'weak' };
  }

  let strength = 0;

  // Length
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const hasRequiredChars = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);

  let strengthLevel: 'weak' | 'medium' | 'strong' = 'weak';
  if (strength <= 2) {
    strengthLevel = 'weak';
  } else if (strength <= 4) {
    strengthLevel = 'medium';
  } else {
    strengthLevel = 'strong';
  }

  return {
    isValid: hasRequiredChars && password.length >= 8,
    strength: strengthLevel,
  };
}
