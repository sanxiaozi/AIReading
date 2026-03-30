'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Navbar } from '@/components/Navbar';
import { Breadcrumb } from '@/components/Breadcrumb';

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
}

interface Props {
  slug: string;
  categoryName: string;
  categoryDescription: string;
  books: Book[];
}

const CATEGORY_MAP: Record<string, { zh: string; en: string }> = {
  business: { zh: '商业管理', en: 'Business' },
  psychology: { zh: '心理学', en: 'Psychology' },
  history: { zh: '历史', en: 'History' },
  biography: { zh: '传记', en: 'Biography' },
  science: { zh: '科学', en: 'Science' },
  fiction: { zh: '文学小说', en: 'Fiction' },
  'self-help': { zh: '个人成长', en: 'Self-Help' },
};

export function CategoryPageClient({
  slug,
  categoryName,
  categoryDescription,
  books,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-[#070A12]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <Breadcrumb items={[{ label: categoryName }]} />
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
            {categoryName}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            {categoryDescription}
          </p>
          <p className="text-sm text-gray-500">
            {locale === 'zh' ? `共 ${books.length} 本书籍` : `${books.length} books`}
          </p>
        </div>
      </div>

      {/* Book Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {books.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {locale === 'zh' ? '该分类暂无书籍' : 'No books in this category'}
          </div>
        ) : (
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
                  <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* SEO Content */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {locale === 'zh' ? `关于${categoryName}书籍` : `About ${categoryName} books`}
          </h2>
          <div className="text-gray-400 text-sm leading-relaxed space-y-3">
            <p>
              {locale === 'zh'
                ? `AIreading 精选${categoryName}领域优质书籍，通过 AI 技术提炼核心内容，制作成高质量有声摘要。每本书提供精华版和完整版两种音频，满足不同学习需求。`
                : `AIreading curates quality books in the ${categoryName} field, extracting core content through AI technology to create high-quality audio summaries. Each book provides both short and full audio versions to meet different learning needs.`
              }
            </p>
            <p>
              {locale === 'zh'
                ? '无论你是在通勤路上、运动健身还是休息放松，都可以随时随地聆听这些经典好书，高效获取知识，提升自我。'
                : 'Whether you are on your commute, exercising, or relaxing, you can listen to these classic books anytime, anywhere, efficiently acquire knowledge, and improve yourself.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
