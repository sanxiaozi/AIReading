/**
 * 国际化工具函数
 */

import enMessages from '@/i18n/messages/en.json';
import zhMessages from '@/i18n/messages/zh.json';

export type Locale = 'en' | 'zh';

const messages = {
  en: enMessages,
  zh: zhMessages,
};

export function useTranslations(locale: Locale) {
  return {
    t: (key: string): string => {
      const keys = key.split('.');
      let value: any = messages[locale];
      
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key;
        }
      }
      
      return typeof value === 'string' ? value : key;
    },
  };
}
