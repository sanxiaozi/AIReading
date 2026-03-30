import { notFound } from 'next/navigation';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Metadata, ResolvingMetadata } from 'next';
import { getTranslations } from 'next-intl/server';
import booksData from '@/../content/booklist.json';
import { BookDetailClient } from '@/app/books/[id]/BookDetailClient';

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
  priority: number;
}

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

function getBookContent(id: number, locale: string) {
  const contentLocale = locale === 'zh' ? 'zh' : 'en';
  const filePath = join(process.cwd(), 'content', 'books', String(id), `${contentLocale}.json`);
  if (!existsSync(filePath)) return null;
  try {
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
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

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'book' });
  const bookId = parseInt(id, 10);

  const book = booksData.books.find((b: Book) => b.id === bookId);
  if (!book) return {};

  const content = getBookContent(bookId, locale);
  const summary = content?.summary_short || (locale === 'zh' ? '暂无简介' : 'No description available');
  const truncatedSummary = summary.length > 150 ? `${summary.substring(0, 147)}...` : summary;

  const baseUrl = 'https://aireading.com';
  const coverUrl = `${baseUrl}/covers/${bookId}/cover.jpg`;
  const shortAudioUrl = `https://audio.aireading.com/${locale}/${bookId}/short.m4a`;
  const longAudioUrl = `https://audio.aireading.com/${locale}/${bookId}/long.m4a`;

  const categoryName = CATEGORY_MAP[book.category]?.[locale as 'zh' | 'en'] || book.category;
  const bookTitle = locale === 'zh' ? book.title : book.title_en;

  const metaTitle = locale === 'zh'
    ? `《${book.title}》有声书摘要 - ${book.author} | AIreading`
    : `${book.title_en} Audiobook Summary - ${book.author} | AIreading`;
  const metaDesc = truncatedSummary.length > 50
    ? truncatedSummary
    : (locale === 'zh'
      ? `聆听${book.author}的经典著作《${book.title}》有声摘要，快速掌握书中精华，提升${categoryName}认知。`
      : `Listen to ${book.title_en} audiobook summary by ${book.author}, quickly grasp key insights and enhance ${categoryName} knowledge.`);

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: locale === 'zh'
      ? [book.title, book.title_en, book.author, `${book.title}摘要`, `${book.title}有声书`, `${categoryName}书籍推荐`]
      : [book.title, book.title_en, book.author, `${book.title} summary`, `${book.title} audiobook`, `${categoryName} book recommendations`],
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: locale === 'zh' ? `${baseUrl}/books/${bookId}` : `${baseUrl}/${locale}/books/${bookId}`,
      images: [
        {
          url: coverUrl,
          width: 800,
          height: 1200,
          alt: locale === 'zh' ? `${book.title} 封面` : `${book.title_en} cover`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [coverUrl],
    },
    alternates: {
      canonical: locale === 'zh' ? `${baseUrl}/books/${bookId}` : `${baseUrl}/${locale}/books/${bookId}`,
      languages: {
        'zh': `${baseUrl}/books/${bookId}`,
        'en': `${baseUrl}/en/books/${bookId}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateStaticParams() {
  const { locales } = await import('@/i18n/config');
  return (booksData.books as Book[])
    .flatMap((book) =>
      locales.map((locale) => ({
        locale,
        id: String(book.id),
      }))
    );
}

export default async function BookDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const bookId = parseInt(id, 10);

  const book = (booksData.books as Book[]).find((b) => b.id === bookId);
  if (!book) notFound();

  const content = getBookContent(bookId, locale);
  const summary = content?.summary_short || (locale === 'zh' ? '暂无简介' : 'No description available');
  const keyTakeaways = content?.keyTakeaways || [];

  return (
    <BookDetailClient
      book={book}
      summary={summary}
      keyTakeaways={keyTakeaways}
      locale={locale as 'zh' | 'en'}
    />
  );
}
