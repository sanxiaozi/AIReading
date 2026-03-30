'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { BookCard } from '@/components/BookCard';
import booksData from '@/../content/booklist.json';

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
  priority: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  business: '💼',
  psychology: '🧠',
  history: '📜',
  biography: '👤',
  science: '🔬',
  fiction: '📖',
  'self-help': '🚀',
};

export default function HomeClient() {
  const t = useTranslations();
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const books = booksData.books as Book[];

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.title_en.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q);
      const matchCategory =
        activeCategory === 'all' || book.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [books, search, activeCategory]);

  // Get category names from translations
  const categories: Record<string, string> = {
    business: t('category.business'),
    psychology: t('category.psychology'),
    history: t('category.history'),
    biography: t('category.biography'),
    science: t('category.science'),
    fiction: t('category.fiction'),
    'self-help': t('category.self-help'),
  };

  const allLabel = locale === 'zh' ? '全部' : 'All';

  return (
    <div className="min-h-screen bg-[#070A12]">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden py-16 sm:py-24 px-4">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, #7C5CFF 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            {t('home.title')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('home.subtitle')}
          </p>
          <div className="relative mt-6 max-w-md mx-auto">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">📚 {t('home.categories')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {Object.entries(categories).map(([key, label]) => (
            <Link
              key={key}
              href={`/${locale === 'zh' ? '' : locale + '/'}category/${key}`}
              className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all"
            >
              <span className="text-2xl">{CATEGORY_ICONS[key] || '📚'}</span>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
              activeCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            {allLabel}
          </button>
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                activeCategory === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Book grid */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{t('home.noResults')}</div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {locale === 'zh' ? `共 ${filtered.length} 本书` : `${filtered.length} books`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* SEO Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* About Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {t('about.whatIsIt')}
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {t('about.description')}
            </p>
          </div>

          {/* Features Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {t('about.features.title')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="text-xl">📚</span>
                <div>
                  <h3 className="text-white font-medium">{t('about.features.feature1.name')}</h3>
                  <p className="text-gray-500 text-sm">{t('about.features.feature1.desc')}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <h3 className="text-white font-medium">{t('about.features.feature2.name')}</h3>
                  <p className="text-gray-500 text-sm">{t('about.features.feature2.desc')}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">🎧</span>
                <div>
                  <h3 className="text-white font-medium">{t('about.features.feature3.name')}</h3>
                  <p className="text-gray-500 text-sm">{t('about.features.feature3.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; 2026 AIreading. {t('home.subtitle')}.</p>
        </div>
      </footer>
    </div>
  );
}
