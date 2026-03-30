import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { FaqPageClient } from './FaqPageClient';

type PageProps = {
  params: Promise<{  locale: string }>,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: `${t('faq.title')} | AIreading`,
    description: t('faq.subtitle'),
    alternates: {
      canonical: locale === 'zh' ? 'https://aireading.com/faq' : `https://aireading.com/${locale}/faq`,
      languages: {
        'zh': 'https://aireading.com/faq',
        'en': 'https://aireading.com/en/faq',
      },
    },
  };
}

export default async function FaqPage({ params }: PageProps) {
  return <FaqPageClient />;
}
