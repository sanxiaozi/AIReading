'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { BookAudioPlayer } from '@/components/BookAudioPlayer';

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
}

interface Props {
  book: Book;
  summary: string;
}

export function BookDetailClient({ book, summary }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const coverUrl = `/covers/${book.id}/cover.jpg`;
  
  const categories: Record<string, string> = {
    business: '商业管理',
    psychology: '心理学',
    history: '历史',
    biography: '传记',
    science: '科学',
    fiction: '文学小说',
    'self-help': '个人成长',
  };

  return (
    <div className="min-h-screen bg-[#070A12]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          ← 返回书单
        </Link>

        {/* Book header */}
        <div className="flex gap-6 mb-8">
          {/* Cover */}
          <div className="flex-shrink-0 w-28 sm:w-36 aspect-[3/4] bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-xl overflow-hidden relative">
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              unoptimized
            />
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              📖
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 text-xs mb-3">
              {categories[book.category] || book.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-sm text-gray-400 mb-1">{book.title_en}</p>
            <p className="text-base text-gray-300">{book.author}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">
            内容简介
          </h2>
          <p className="text-gray-300 leading-relaxed">{summary}</p>
        </div>

        {/* Audio Player section */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">🎧 听书</h2>
          {isLoading ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-500">
              加载中...
            </div>
          ) : isAuthenticated ? (
            <BookAudioPlayer bookId={book.id} />
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-4">
              <div className="text-4xl">🔒</div>
              <p className="text-gray-300">登录后即可收听音频</p>
              <div className="flex gap-3 justify-center">
                <Link
                  href={`/login`}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
                >
                  立即登录
                </Link>
                <Link
                  href={`/register`}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                >
                  免费注册
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
