'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '../_components/Sidebar';

const categoryNames: Record<string, Record<'zh' | 'en' | 'id', string>> = {
  business: { zh: '商业管理', en: 'Business', id: 'Bisnis' },
  psychology: { zh: '心理学', en: 'Psychology', id: 'Psikologi' },
  history: { zh: '历史', en: 'History', id: 'Sejarah' },
  biography: { zh: '传记', en: 'Biography', id: 'Biografi' },
  science: { zh: '科学', en: 'Science', id: 'Sains' },
  fiction: { zh: '文学小说', en: 'Fiction', id: 'Fiksi' },
  'self-help': { zh: '个人成长', en: 'Self-Help', id: 'Pengembangan Diri' },
};

const copy = {
  zh: {
    title: '书籍管理',
    publishedCount: '已发布',
    total: '共',
    books: '本',
    all: '全部',
    published: '已发布',
    draft: '未审核',
    bookTitle: '书名',
    author: '作者',
    category: '分类',
    status: '状态',
  },
  en: {
    title: 'Book Management',
    publishedCount: 'Published',
    total: 'of',
    books: 'books',
    all: 'All',
    published: 'Published',
    draft: 'Draft',
    bookTitle: 'Title',
    author: 'Author',
    category: 'Category',
    status: 'Status',
  },
  id: {
    title: 'Manajemen Buku',
    publishedCount: 'Diterbitkan',
    total: 'dari',
    books: 'buku',
    all: 'Semua',
    published: 'Diterbitkan',
    draft: 'Draft',
    bookTitle: 'Judul',
    author: 'Penulis',
    category: 'Kategori',
    status: 'Status',
  },
} as const;

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
  priority: number;
  published?: boolean;
}

function BooksPageContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');
  const lang = langParam === 'en' || langParam === 'id' ? langParam : 'zh';
  const t = copy[lang];
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetch('/api/admin/books')
      .then((r) => r.json())
      .then((data) => setBooks(data.books));
  }, []);

  const filtered = books.filter((b) => {
    if (filter === 'published') return !!b.published;
    if (filter === 'draft') return !b.published;
    return true;
  });

  const publishedCount = books.filter((b) => b.published).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">📚 {t.title}</h1>
          <span className="text-sm text-gray-500">{t.publishedCount} {publishedCount} / {t.total} {books.length} {t.books}</span>
        </div>

        <div className="flex gap-2 mb-5">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {{
                all: t.all,
                published: `✅ ${t.published}`,
                draft: `⏸ ${t.draft}`,
              }[f]}
            </button>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-500 text-xs">
                <th className="text-left px-5 py-3 w-10">ID</th>
                <th className="text-left px-5 py-3">{t.bookTitle}</th>
                <th className="text-left px-5 py-3">{t.author}</th>
                <th className="text-left px-5 py-3">{t.category}</th>
                <th className="text-left px-5 py-3">{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3.5 text-gray-500">{book.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="text-white">{lang === 'zh' ? book.title : book.title_en || book.title}</div>
                    <div className="text-xs text-gray-500">{book.title_en}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">{book.author}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-lg">
                      {categoryNames[book.category]?.[lang] || book.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {book.published ? (
                      <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-lg">{t.published}</span>
                    ) : (
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-lg">{t.draft}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense>
      <BooksPageContent />
    </Suspense>
  );
}
