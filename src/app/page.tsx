'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import booksData from '../../content/booklist.json';

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
  priority: number;
}

const categories = booksData.categories as Record<string, string>;

export default function HomePage() {
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
            用耳朵读好书
          </h1>
          <p className="text-gray-400 text-lg">
            精选 50 本好书，AI 提炼精华，随时随地聆听
          </p>

          {/* Search box */}
          <div className="relative mt-6 max-w-md mx-auto">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索书名或作者..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
            />
          </div>
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
            全部
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
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            没有找到相关书籍
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              共 {filtered.length} 本书
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const coverUrl = `/covers/${book.id}/cover.jpg`;

  return (
    <Link
      href={`/books/${book.id}`}
      className="group block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Cover */}
      <div className="aspect-[3/4] bg-gradient-to-br from-purple-900/40 to-blue-900/40 relative overflow-hidden">
        <Image
          src={coverUrl}
          alt={book.title}
          fill
          className="object-cover"
          onError={(e) => {
            // Hide broken image, show gradient fallback
            (e.target as HTMLImageElement).style.display = 'none';
          }}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          unoptimized
        />
        {/* Fallback text on cover */}
        <div className="absolute inset-0 flex items-center justify-center p-2 opacity-0 group-hover:opacity-0">
          <span className="text-3xl">📖</span>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
          <span className="text-4xl mb-2">📖</span>
          <span className="text-xs text-white/60 leading-tight line-clamp-3">
            {book.title}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
      </div>
    </Link>
  );
}
