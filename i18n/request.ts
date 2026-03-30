import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Provide a static locale if requestLocale is not available
  if (!locale || !['zh', 'en'].includes(locale as any)) {
    locale = 'zh';
  }

  return {
    locale,
    messages: (await import(`../src/i18n/locales/${locale}.json`)).default,
    timeZone: 'Asia/Shanghai',
  };
});
