// i18n configuration
export const locales = ['zh', 'en'] as const;
export const defaultLocale = 'zh' as const;
export type Locale = typeof locales[number];

// Language display names
export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'EN',
};

// RTL languages (right-to-left)
export const rtlLocales: Locale[] = [];

// Map locale to language code for content files
export const contentLocaleMap: Record<Locale, string> = {
  zh: 'zh',
  en: 'en',
};
