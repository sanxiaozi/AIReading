import { notFound } from 'next/navigation';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import booksData from '../../../../content/booklist.json';
import { BookDetailClient } from './BookDetailClient';

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
  priority: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return (booksData.books as Book[]).map((book) => ({
    id: String(book.id),
  }));
}

function getBookContent(id: number) {
  const filePath = join(process.cwd(), 'content', 'books', String(id), 'zh.json');
  if (!existsSync(filePath)) return null;
  try {
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params;
  const bookId = parseInt(id, 10);

  const book = (booksData.books as Book[]).find((b) => b.id === bookId);
  if (!book) notFound();

  const content = getBookContent(bookId);
  const summary = content?.summary_short || '暂无简介';

  return (
    <BookDetailClient
      book={book}
      summary={summary}
    />
  );
}
