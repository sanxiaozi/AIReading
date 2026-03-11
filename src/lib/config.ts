/**
 * Application Configuration
 */

// 音频 CDN 配置
export const AUDIO_CDN_URL = process.env.NEXT_PUBLIC_AUDIO_CDN_URL || '';

/**
 * 获取音频文件 URL
 * @param bookId 书籍 ID
 * @param version 版本 (short | long)
 * @param lang 语言代码 (zh | en)，默认中文
 * @returns 完整的音频 URL
 */
export function getAudioUrl(
  bookId: string | number,
  version: 'short' | 'long' = 'short',
  lang: string = 'zh'
): string {
  const base = AUDIO_CDN_URL || '';
  return `${base}/${lang}/${bookId}/${version}.m4a`;
}

/**
 * 网站配置
 */
export const SITE_CONFIG = {
  name: 'AIreading',
  description: '用耳朵读好书',
} as const;

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
