'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

interface Book {
  id: number;
  title: string;
  title_en: string;
  author: string;
  category: string;
  priority: number;
}

export function BookCard({ book }: { book: Book }) {
  const locale = useLocale();
  const coverUrl = `/covers/${book.id}/cover.jpg`;

  return (
    <Link
      href={locale === 'zh' ? `/books/${book.id}` : `/${locale}/books/${book.id}`}
      className="group block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Cover */}
      <div className="aspect-[3/4] bg-gradient-to-br from-purple-900/40 to-blue-900/40 relative overflow-hidden">
        {/*
          CSS 方案：img 加载成功时自动覆盖下面的 fallback 文字。
          img 用 object-fit:cover 铺满容器，加载失败时 broken image 不显示内容。
          fallback 文字在 img 下面（z-index 低），图片加载成功自然被遮住。
        */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-0">
          <span className="text-xs text-white/60 leading-tight line-clamp-3">
            {book.title}
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover z-10"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
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
