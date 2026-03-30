import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AboutPageClient } from './AboutPageClient';

type PageProps = {
  params: Promise<{  locale: string }>,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'zh' ? 'https://aireading.com/about' : `https://aireading.com/${locale}/about`,
      languages: {
        'zh': 'https://aireading.com/about',
        'en': 'https://aireading.com/en/about',
      },
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  return <AboutPageClient />;
}
