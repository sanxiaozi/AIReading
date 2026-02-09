/**
 * Application Configuration
 * 应用配置文件
 */

// 音频 CDN 配置
export const AUDIO_CDN_URL = process.env.NEXT_PUBLIC_AUDIO_CDN_URL || 'https://trading.aireading.com';

/**
 * 获取音频文件 URL
 * @param bookId 书籍 ID
 * @param language 语言代码 (zh, en)
 * @param version 版本 (short, medium, long)
 * @returns 完整的音频 URL
 */
export function getAudioUrl(
  bookId: string | number,
  language: 'zh' | 'en' = 'zh',
  version: 'short' | 'medium' | 'long' = 'long'
): string {
  return `${AUDIO_CDN_URL}/audio/${bookId}/${language}_${version}.mp3`;
}

/**
 * 网站配置
 */
export const SITE_CONFIG = {
  name: 'AIreading',
  url: 'https://aireading.com',
  description: 'AI-powered book summaries',
  
  // 社交媒体
  social: {
    twitter: '@aireading_app',
  },
  
  // API 配置
  api: {
    timeout: 10000, // 10 seconds
  },
} as const;

/**
 * 开发环境检测
 */
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * 功能开关
 */
export const FEATURES = {
  enableAnalytics: isProduction,
  enablePWA: true,
  enableAudioCache: true,
} as const;
