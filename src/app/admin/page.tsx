'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './_components/Sidebar';

interface BookStatus {
  id: number;
  title: string;
  author: string;
  shortOk: boolean;
  longOk: boolean;
}

interface Stats {
  total: number;
  withBoth: number;
  withAny: number;
  missing: number;
}

const copy = {
  zh: {
    title: '概览',
    loading: '正在检测音频状态，请稍候...',
    total: '总书数',
    complete: '音频完整',
    partial: '部分缺失',
    missing: '完全缺失',
    progress: '音频完成进度',
    pending: '待上传音频',
    upload: '去上传',
    missingTag: '缺失',
    more: '还有',
    books: '本',
  },
  en: {
    title: 'Overview',
    loading: 'Checking audio status...',
    total: 'Total Books',
    complete: 'Complete Audio',
    partial: 'Partial Missing',
    missing: 'Fully Missing',
    progress: 'Audio Completion',
    pending: 'Audio Pending Upload',
    upload: 'Upload',
    missingTag: 'Missing',
    more: 'More',
    books: 'books',
  },
  id: {
    title: 'Ringkasan',
    loading: 'Memeriksa status audio...',
    total: 'Total Buku',
    complete: 'Audio Lengkap',
    partial: 'Sebagian Hilang',
    missing: 'Semua Hilang',
    progress: 'Progres Audio',
    pending: 'Audio Belum Diunggah',
    upload: 'Unggah',
    missingTag: 'Hilang',
    more: 'Masih ada',
    books: 'buku',
  },
} as const;

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');
  const lang = langParam === 'en' || langParam === 'id' ? langParam : 'zh';
  const t = copy[lang];
  const [books, setBooks] = useState<BookStatus[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/audio/status?lang=${lang}`)
      .then((r) => r.json())
      .then((data) => {
        setBooks(data.books);
        setStats(data.stats);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  const missing = books.filter((b) => !b.shortOk && !b.longOk);
  const partial = books.filter((b) => (b.shortOk || b.longOk) && !(b.shortOk && b.longOk));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-white mb-6">{t.title}</h1>

        {loading ? (
          <div className="text-gray-400">{t.loading}</div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard label={t.total} value={stats?.total ?? 0} color="gray" />
              <StatCard label={t.complete} value={stats?.withBoth ?? 0} color="green" />
              <StatCard label={t.partial} value={partial.length} color="yellow" />
              <StatCard label={t.missing} value={stats?.missing ?? 0} color="red" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{t.progress}</span>
                <span>{stats?.withBoth ?? 0} / {stats?.total ?? 0}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all"
                  style={{ width: `${((stats?.withBoth ?? 0) / (stats?.total ?? 1)) * 100}%` }}
                />
              </div>
            </div>

            {missing.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white">
                    ⚠️ {t.pending} ({missing.length} {t.books})
                  </h2>
                  <Link href={`/admin/audio?lang=${lang}`} className="text-sm text-purple-400 hover:text-purple-300">
                    {t.upload} →
                  </Link>
                </div>
                <div className="space-y-2">
                  {missing.slice(0, 10).map((book) => (
                    <div key={book.id} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div>
                        <span className="text-sm text-white">{book.title}</span>
                        <span className="text-xs text-gray-500 ml-2">ID: {book.id}</span>
                      </div>
                      <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded-lg">{t.missingTag}</span>
                    </div>
                  ))}
                  {missing.length > 10 && (
                    <p className="text-xs text-gray-500 pt-1">{t.more} {missing.length - 10} {t.books}...</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense>
      <AdminDashboardContent />
    </Suspense>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    gray: 'text-gray-300',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className={`text-3xl font-bold ${colorMap[color]}`}>{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}
