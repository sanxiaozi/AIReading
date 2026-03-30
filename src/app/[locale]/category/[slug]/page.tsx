import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import booksData from '@/../content/booklist.json';
import { CategoryPageClient } from './CategoryPageClient';

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
  priority: number;
}

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const CATEGORY_NAMES: Record<string, { zh: string; en: string }> = {
  business: { zh: '商业管理', en: 'Business Management' },
  psychology: { zh: '心理学', en: 'Psychology' },
  history: { zh: '历史', en: 'History' },
  biography: { zh: '传记', en: 'Biography' },
  science: { zh: '科学', en: 'Science' },
  fiction: { zh: '文学小说', en: 'Literature & Fiction' },
  'self-help': { zh: '个人成长', en: 'Personal Growth' },
};

const CATEGORY_DESCRIPTIONS: Record<string, { zh: string; en: string }> = {
  business: {
    zh: '探索商业管理领域的经典著作，学习成功企业家的思维模式和决策原则。',
    en: 'Explore classic business management books and learn the thinking patterns and decision-making principles of successful entrepreneurs.',
  },
  psychology: {
    zh: '深入了解心理学经典，掌握人类思维、行为和情绪的奥秘。',
    en: 'Deep dive into psychology classics and master the mysteries of human thinking, behavior, and emotions.',
  },
  history: {
    zh: '重温历史经典，从过去的事件中汲取智慧，理解人类文明的发展。',
    en: 'Revisit historical classics, draw wisdom from past events, and understand the development of human civilization.',
  },
  biography: {
    zh: '阅读杰出人物的传记，从他们的经历中获得启示和灵感。',
    en: 'Read biographies of outstanding individuals and gain inspiration and insights from their experiences.',
  },
  science: {
    zh: '探索科学前沿，了解最新研究成果和科学发现。',
    en: 'Explore the frontiers of science and learn about the latest research findings and scientific discoveries.',
  },
  fiction: {
    zh: '沉浸于经典文学，体验人性的复杂和世界的多样。',
    en: 'Immerse yourself in classic literature and experience the complexity of human nature and the diversity of the world.',
  },
  'self-help': {
    zh: '提升自我，学习实用技巧，实现个人成长和目标。',
    en: 'Improve yourself, learn practical skills, and achieve personal growth and goals.',
  },
};

export async function generateStaticParams() {
  const { locales } = await import('@/i18n/config');
  const categories = booksData.categories as Record<string, string>;
  return locales.flatMap((locale) =>
    Object.keys(categories).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const categoryName = CATEGORY_NAMES[slug]?.[locale as 'zh' | 'en'] || slug;
  const categoryDesc = CATEGORY_DESCRIPTIONS[slug]?.[locale as 'zh' | 'en'] || '';

  return {
    title: `${categoryName} | AIreading`,
    description: categoryDesc,
    alternates: {
      canonical: locale === 'zh' ? `https://aireading.com/category/${slug}` : `https://aireading.com/${locale}/category/${slug}`,
      languages: {
        'zh': `https://aireading.com/category/${slug}`,
        'en': `https://aireading.com/en/category/${slug}`,
      },
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;

  const categoryName = CATEGORY_NAMES[slug]?.[locale as 'zh' | 'en'] || slug;
  const categoryDescription = CATEGORY_DESCRIPTIONS[slug]?.[locale as 'zh' | 'en'] || '';

  const books = (booksData.books as Book[])
    .filter((book) => book.category === slug)
    .sort((a, b) => a.priority - b.priority);

  return (
    <CategoryPageClient
      slug={slug}
      categoryName={categoryName}
      categoryDescription={categoryDescription}
      books={books}
    />
  );
}
