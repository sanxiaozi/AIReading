import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HomeClient from './HomeClient';

type Props = {
  params: Promise<{  locale: string }>,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL('https://aireading.com'),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: locale === 'zh' ? 'https://aireading.com' : `https://aireading.com/${locale}`,
      languages: {
        'zh': 'https://aireading.com',
        'en': 'https://aireading.com/en',
      },
    },
  };
}

export default async function HomePage({ params }: Props) {
  return <HomeClient />;
}
