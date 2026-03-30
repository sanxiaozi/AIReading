import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import booksData from '@/../content/booklist.json';
import { getAuthorBySlug } from '@/data/authors';
import { AuthorPageClient } from './AuthorPageClient';

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
  priority: number;
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const { locales } = await import('@/i18n/config');
  const { AUTHORS } = await import('@/data/authors');
  return locales.flatMap((locale) =>
    AUTHORS.map((author) => ({ locale, slug: author.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const author = getAuthorBySlug(slug);

  if (!author) return {};

  const books = (booksData.books as Book[]).filter(
    (book) => book.author === author.name
  );

  const bookListStr = books.map(b => (locale === 'zh' ? `《${b.title}》` : b.title_en)).join('、');
  const metaTitle = locale === 'zh'
    ? `${author.name} 书籍推荐 | ${author.name_en}代表作 - AIreading`
    : `${author.name_en} Books | ${author.name} Works - AIreading`;
  const metaDesc = locale === 'zh'
    ? `${author.name_en}的经典著作有声摘要，包含${bookListStr}等作品。聆听${author.name_en}的智慧结晶，提升认知与思维。`
    : `Classic works audiobook summaries by ${author.name_en}, including ${bookListStr} and more. Listen to ${author.name_en}'s wisdom.`;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: locale === 'zh' ? `https://aireading.com/author/${slug}` : `https://aireading.com/${locale}/author/${slug}`,
      siteName: 'AIreading',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
    },
    alternates: {
      canonical: locale === 'zh' ? `https://aireading.com/author/${slug}` : `https://aireading.com/${locale}/author/${slug}`,
      languages: {
        'zh': `https://aireading.com/author/${slug}`,
        'en': `https://aireading.com/en/author/${slug}`,
      },
    },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    const { notFound } = await import('next/navigation');
    notFound();
  }

  const authorName = author?.name || '';
  const books = (booksData.books as Book[]).filter(
    (book) => book.author === authorName
  );

  // Get category info for each book
  const categoryMap = booksData.categories as Record<string, string>;
  const booksWithCategory = books.map(book => ({
    ...book,
    categoryName: categoryMap[book.category] || book.category,
  }));

  return (
    <AuthorPageClient
      author={author!}
      books={booksWithCategory}
    />
  );
}
