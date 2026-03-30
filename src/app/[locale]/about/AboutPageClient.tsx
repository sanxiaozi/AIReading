'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Navbar } from '@/components/Navbar';
import { Breadcrumb } from '@/components/Breadcrumb';

const CATEGORY_ICONS: Record<string, string> = {
  business: '💼',
  psychology: '🧠',
  history: '📜',
  biography: '👤',
  science: '🔬',
  fiction: '📖',
  'self-help': '🚀',
};

const CATEGORY_SLUGS = [
  'business',
  'psychology',
  'history',
  'biography',
  'science',
  'fiction',
  'self-help',
] as const;

export function AboutPageClient() {
  const t = useTranslations();
  const locale = useLocale();

  const categoryNames: Record<string, string> = {
    business: t('category.business'),
    psychology: t('category.psychology'),
    history: t('category.history'),
    biography: t('category.biography'),
    science: t('category.science'),
    fiction: t('category.fiction'),
    'self-help': t('category.self-help'),
  };

  return (
    <div className="min-h-screen bg-[#070A12]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <Breadcrumb items={[{ label: t('nav.about') }]} />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden py-12 sm:py-16 px-4">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, #7C5CFF 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {t('about.title')}
          </h1>
          <p className="text-gray-400 text-lg">{t('about.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        {/* What is it section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t('about.whatIsIt')}
          </h2>
          <p className="text-gray-400 leading-relaxed">{t('about.description')}</p>
        </div>

        {/* Features section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            {t('about.features.title')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="text-white font-medium text-base mb-1">
                  {t('about.features.feature1.name')}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t('about.features.feature1.desc')}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">🎧</span>
              <div>
                <h3 className="text-white font-medium text-base mb-1">
                  {t('about.features.feature2.name')}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t('about.features.feature2.desc')}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">🌍</span>
              <div>
                <h3 className="text-white font-medium text-base mb-1">
                  {t('about.features.feature3.name')}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t('about.features.feature3.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            {t('about.categories')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {CATEGORY_SLUGS.map((slug) => (
              <Link
                key={slug}
                href={locale === 'zh' ? `/category/${slug}` : `/${locale}/category/${slug}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all"
              >
                <span className="text-3xl">{CATEGORY_ICONS[slug] || '📚'}</span>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {categoryNames[slug]}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {t('about.title')}
            </h2>
            <div className="text-gray-400 text-sm leading-relaxed space-y-3">
              <p>{t('about.seoText1')}</p>
              <p>{t('about.seoText2')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
