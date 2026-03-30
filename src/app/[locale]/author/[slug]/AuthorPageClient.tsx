'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Navbar } from '@/components/Navbar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AuthorInfo } from '@/data/authors';

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
  categoryName: string;
  priority: number;
}

interface AuthorPageClientProps {
  author: AuthorInfo;
  books: Book[];
}

export function AuthorPageClient({ author, books }: AuthorPageClientProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-[#070A12]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <Breadcrumb items={[{ label: author.name }]} />
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
          <div className="inline-flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {locale === 'zh' ? '作者' : 'Author'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{author.name}</h1>
          <p className="text-gray-400 text-base">{author.name_en}</p>
          <p className="text-sm text-gray-500">{locale === 'zh' ? `共 ${books.length} 本书籍` : `${books.length} books`}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-10">
        {/* Bio Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('author.aboutAuthor')}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{locale === 'zh' ? author.bio : author.bio_en}</p>
        </div>

        {/* Books Grid */}
        {books.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-5">
              {author.name} {t('author.booksByAuthor')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {books.map((book) => (
                <Link
                  key={book.id}
                  href={locale === 'zh' ? `/books/${book.id}` : `/${locale}/books/${book.id}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden relative bg-purple-900/40 ring-1 ring-white/10 group-hover:ring-purple-500/50 transition-all">
                    <Image
                      src={`/covers/${book.id}/cover.jpg`}
                      alt={locale === 'zh' ? book.title : book.title_en}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                      {locale === 'zh' ? book.title : book.title_en}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{book.title_en}</p>
                    <span className="inline-block mt-1.5 text-xs text-purple-400/80 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                      {book.categoryName}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {books.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            {t('author.noBooks')}
          </div>
        )}

        {/* SEO Text */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-3">
            {t('author.listenWisdom', { author: author.name, author_en: author.name_en })}
          </h2>
          <div className="text-gray-400 text-sm leading-relaxed space-y-2">
            <p>
              {t('author.seoText1', { author_en: author.name_en })}
            </p>
            <p>
              {t('author.seoText2', { author_en: author.name_en })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
