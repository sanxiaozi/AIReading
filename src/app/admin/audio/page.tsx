'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../_components/Sidebar';

interface BookStatus {
  id: number;
  title: string;
  author: string;
  category: string;
  shortOk: boolean;
  longOk: boolean;
  shortUrl: string;
  longUrl: string;
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error';

const LANG_OPTIONS = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英语' },
  { value: 'id', label: '印尼语' },
] as const;

type AudioLang = typeof LANG_OPTIONS[number]['value'];

const copy = {
  zh: {
    title: '音频管理',
    currentLang: '当前语言',
    refresh: '刷新状态',
    searchPlaceholder: '搜索书名或ID...',
    all: '全部',
    missing: '缺失',
    done: '已完成',
    checking: '正在检测所有书籍音频状态...',
    bookTitle: '书名',
    short: '精华版',
    long: '完整版',
    noMatch: '没有匹配的书籍',
    uploading: '上传中',
    uploadSuccess: '上传成功',
    failed: '失败',
    retry: '重试',
    uploaded: '已上传',
    preview: '试听',
    replace: '替换',
    upload: '上传文件',
  },
  en: {
    title: 'Audio Management',
    currentLang: 'Current language',
    refresh: 'Refresh',
    searchPlaceholder: 'Search title or ID...',
    all: 'All',
    missing: 'Missing',
    done: 'Done',
    checking: 'Checking audio status for all books...',
    bookTitle: 'Title',
    short: 'Short',
    long: 'Long',
    noMatch: 'No matching books',
    uploading: 'Uploading',
    uploadSuccess: 'Uploaded',
    failed: 'Failed',
    retry: 'Retry',
    uploaded: 'Available',
    preview: 'Preview',
    replace: 'Replace',
    upload: 'Upload',
  },
  id: {
    title: 'Manajemen Audio',
    currentLang: 'Bahasa saat ini',
    refresh: 'Muat ulang',
    searchPlaceholder: 'Cari judul atau ID...',
    all: 'Semua',
    missing: 'Hilang',
    done: 'Selesai',
    checking: 'Memeriksa status audio semua buku...',
    bookTitle: 'Judul',
    short: 'Singkat',
    long: 'Penuh',
    noMatch: 'Tidak ada buku yang cocok',
    uploading: 'Mengunggah',
    uploadSuccess: 'Berhasil',
    failed: 'Gagal',
    retry: 'Coba lagi',
    uploaded: 'Tersedia',
    preview: 'Pratinjau',
    replace: 'Ganti',
    upload: 'Unggah',
  },
} as const;

function AudioManagePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedLang = searchParams.get('lang');
  const selectedLang = (LANG_OPTIONS.some((item) => item.value === requestedLang)
    ? requestedLang
    : 'zh') as AudioLang;
  const t = copy[selectedLang];
  const [books, setBooks] = useState<BookStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'missing' | 'done'>('all');
  const [search, setSearch] = useState('');
  const [uploadStates, setUploadStates] = useState<Record<string, { state: UploadState; progress: number; error?: string }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUpload = useRef<{ bookId: number; version: 'short' | 'long' } | null>(null);

  const loadStatus = () => {
    setLoading(true);
    fetch(`/api/admin/audio/status?lang=${selectedLang}`)
      .then((r) => r.json())
      .then((data) => setBooks(data.books))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStatus(); }, [selectedLang]);

  const filtered = books.filter((b) => {
    const matchSearch = b.title.includes(search) || String(b.id).includes(search);
    if (filter === 'missing') return matchSearch && !b.shortOk && !b.longOk;
    if (filter === 'done') return matchSearch && b.shortOk && b.longOk;
    return matchSearch;
  });

  const triggerUpload = (bookId: number, version: 'short' | 'long') => {
    pendingUpload.current = { bookId, version };
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const pending = pendingUpload.current;
    if (!file || !pending) return;
    e.target.value = '';

    const key = `${selectedLang}-${pending.bookId}-${pending.version}`;
    setUploadStates((prev) => ({ ...prev, [key]: { state: 'uploading', progress: 0 } }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bookId', String(pending.bookId));
    formData.append('version', pending.version);
    formData.append('lang', selectedLang);

    try {
      // 用 XMLHttpRequest 显示上传进度
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/admin/audio/upload');
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const pct = Math.round((ev.loaded / ev.total) * 100);
            setUploadStates((prev) => ({ ...prev, [key]: { state: 'uploading', progress: pct } }));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) resolve();
          else reject(new Error(JSON.parse(xhr.responseText)?.error || '上传失败'));
        };
        xhr.onerror = () => reject(new Error('网络错误'));
        xhr.send(formData);
      });

      setUploadStates((prev) => ({ ...prev, [key]: { state: 'done', progress: 100 } }));
      // 刷新状态
      setTimeout(loadStatus, 1000);
    } catch (err) {
      setUploadStates((prev) => ({
        ...prev,
        [key]: { state: 'error', progress: 0, error: String(err) },
      }));
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* 隐藏文件选择器 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".m4a,audio/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🎵 {t.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t.currentLang}: {LANG_OPTIONS.find((item) => item.value === selectedLang)?.label}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-1">
              {LANG_OPTIONS.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => router.replace(`/admin/audio?lang=${lang.value}`)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    selectedLang === lang.value
                      ? 'bg-white/15 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <button
              onClick={loadStatus}
              className="text-sm text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              🔄 {t.refresh}
            </button>
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center gap-3 mb-5">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 w-48"
          />
          {(['all', 'missing', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {{ all: t.all, missing: `⚠️ ${t.missing}`, done: `✅ ${t.done}` }[f]}
            </button>
          ))}
        </div>

        {/* 书单表格 */}
        {loading ? (
          <div className="text-gray-400 text-sm py-12 text-center">{t.checking}</div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs">
                  <th className="text-left px-5 py-3 w-10">ID</th>
                  <th className="text-left px-5 py-3">{t.bookTitle}</th>
                  <th className="text-left px-5 py-3">{t.short} (short)</th>
                  <th className="text-left px-5 py-3">{t.long} (long)</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => {
                  const shortKey = `${selectedLang}-${book.id}-short`;
                  const longKey = `${selectedLang}-${book.id}-long`;
                  return (
                    <tr key={book.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3.5 text-gray-500">{book.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-white font-medium">{book.title}</div>
                        <div className="text-xs text-gray-500">{book.author}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <AudioCell
                          ok={book.shortOk}
                          url={book.shortUrl}
                          uploadState={uploadStates[shortKey]}
                          onUpload={() => triggerUpload(book.id, 'short')}
                          lang={selectedLang}
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <AudioCell
                          ok={book.longOk}
                          url={book.longUrl}
                          uploadState={uploadStates[longKey]}
                          onUpload={() => triggerUpload(book.id, 'long')}
                          lang={selectedLang}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-12">{t.noMatch}</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AudioManagePage() {
  return (
    <Suspense>
      <AudioManagePageContent />
    </Suspense>
  );
}

function AudioCell({
  ok,
  url,
  uploadState,
  onUpload,
  lang,
}: {
  ok: boolean;
  url: string;
  uploadState?: { state: UploadState; progress: number; error?: string };
  onUpload: () => void;
  lang: AudioLang;
}) {
  const t = copy[lang];

  if (uploadState?.state === 'uploading') {
    return (
      <div className="w-36">
        <div className="text-xs text-gray-400 mb-1">{t.uploading} {uploadState.progress}%</div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div
            className="bg-purple-500 h-1.5 rounded-full transition-all"
            style={{ width: `${uploadState.progress}%` }}
          />
        </div>
      </div>
    );
  }

  if (uploadState?.state === 'done') {
    return <span className="text-green-400 text-xs">✅ {t.uploadSuccess}</span>;
  }

  if (uploadState?.state === 'error') {
    return (
      <div>
        <span className="text-red-400 text-xs">❌ {t.failed}</span>
        <button onClick={onUpload} className="ml-2 text-xs text-gray-500 underline">{t.retry}</button>
      </div>
    );
  }

  if (ok) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-green-400 text-xs">✅ {t.uploaded}</span>
        <a href={url} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-gray-300">▶ {t.preview}</a>
        <button onClick={onUpload} className="text-xs text-gray-600 hover:text-gray-400 underline">{t.replace}</button>
      </div>
    );
  }

  return (
    <button
      onClick={onUpload}
      className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400 px-3 py-1.5 rounded-lg transition-colors"
    >
      ⬆ {t.upload}
    </button>
  );
}
