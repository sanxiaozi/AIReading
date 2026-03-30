'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { getAudioUrl } from '@/lib/config';

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
  keyTakeaways?: string[];
  locale?: 'zh' | 'en';
}

const CATEGORY_MAP: Record<string, string> = {
  business: '商业管理',
  psychology: '心理学',
  history: '历史',
  biography: '传记',
  science: '科学',
  fiction: '文学小说',
  'self-help': '个人成长',
};

export function BookDetailClient({
  book,
  summary,
  keyTakeaways = [],
  locale = 'zh',
}: Props) {
  const { isLoading } = useAuth();
  const coverUrl = `/covers/${book.id}/cover.jpg`;
  const homeHref = locale === 'zh' ? '/' : `/${locale}`;

  // 悬浮播放器状态
  const [showFloating, setShowFloating] = useState(false);
  const [floatingPlaying, setFloatingPlaying] = useState(false);
  const [floatingTime, setFloatingTime] = useState(0);
  const [floatingDuration, setFloatingDuration] = useState(0);
  const [version, setVersion] = useState<'short' | 'long'>('short');

  // 共享 audio ref（传给两个播放器同步状态）
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrl = getAudioUrl(book.id, version, locale);

  // 初始化 audio 元素
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setFloatingTime(audio.currentTime);
    };
    const onMeta = () => setFloatingDuration(audio.duration);
    const onPlay = () => { setFloatingPlaying(true); setShowFloating(true); };
    const onPause = () => setFloatingPlaying(false);
    const onEnded = () => setFloatingPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = audioUrl;
    audio.load();
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (floatingPlaying) audio.pause();
    else audio.play().catch(console.error);
  }, [floatingPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
  }, []);

  const formatTime = (t: number) => {
    if (!isFinite(t)) return '0:00';
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  };

  const progressMax = floatingDuration || 0;

  return (
    <div className="min-h-screen bg-[#070A12]">
      <Navbar />

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* ── Hero 区 ── */}
      <div className="relative overflow-hidden">
        {/* 背景：封面模糊渐变 */}
        <div className="absolute inset-0 z-0">
          <Image
            src={coverUrl}
            alt=""
            fill
            className="object-cover scale-110 blur-2xl opacity-30"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070A12]/40 via-[#070A12]/60 to-[#070A12]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-10 pb-12 flex flex-col items-center text-center">
          {/* 返回 */}
          <Link
            href={homeHref}
            className="self-start inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-8"
          >
            ← 返回书单
          </Link>

          {/* 封面 */}
          <div className="w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative bg-purple-900/40 mb-6 ring-1 ring-white/10">
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* 分类标签 */}
          <span className="px-3 py-0.5 rounded-full bg-purple-600/30 text-purple-300 text-xs mb-3">
            {CATEGORY_MAP[book.category] || book.category}
          </span>

          {/* 书名 */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
            {book.title}
          </h1>
          <p className="text-sm text-gray-400 mb-1">{book.title_en}</p>
          <p className="text-base text-gray-300 mb-4">{book.author}</p>

          {/* 社交信任 */}
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>⭐ 4.8</span>
            <span>·</span>
            <span>🎧 12,480 人已听</span>
          </div>
        </div>
      </div>

      {/* ── 内容区 ── */}
      <div className="max-w-3xl mx-auto px-4 pb-32 space-y-6">

        {/* 听书模块 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">🎧 听书</h2>

          {/* Version toggle */}
          <div className="flex gap-2 mb-4">
            {(['short', 'long'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  version === v
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {v === 'short' ? '⚡ 精华版' : '📖 完整版'}
                <span className="block text-xs opacity-70 font-normal mt-0.5">
                  {v === 'short' ? '1-3 分钟' : '15-30 分钟'}
                </span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-500">
              加载中...
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              {/* 进度条 */}
              <div className="space-y-1 mb-4">
                <input
                  type="range"
                  min={0}
                  max={progressMax}
                  value={floatingTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatTime(floatingTime)}</span>
                  <span>{formatTime(floatingDuration)}</span>
                </div>
              </div>

              {/* 播放按钮 */}
              <div className="flex items-center justify-center">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  {floatingPlaying ? '⏸' : '▶'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 内容简介 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">内容简介</h2>
          <p className="text-gray-300 leading-relaxed">{summary}</p>
        </div>

        {/* 金句卡片 */}
        {keyTakeaways.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">💡 核心观点</h2>
            <div className="space-y-3">
              {keyTakeaways.slice(0, 3).map((quote, i) => (
                <div
                  key={i}
                  className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <div className="w-1 shrink-0 rounded-full bg-purple-500 self-stretch" />
                  <p className="text-gray-300 leading-relaxed text-sm">{quote}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 悬浮播放器 ── */}
      {showFloating && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111827]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center gap-3 shadow-2xl">
          <button
            onClick={() => { audioRef.current?.pause(); setShowFloating(false); }}
            className="text-gray-400 hover:text-white text-lg shrink-0"
          >
            ✕
          </button>

          {/* 封面 */}
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative bg-purple-900/40">
            <Image src={coverUrl} alt={book.title} fill className="object-cover" unoptimized />
          </div>

          {/* 书名 + 进度 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{book.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: floatingDuration > 0 ? `${(floatingTime / floatingDuration) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {formatTime(floatingTime)} / {formatTime(floatingDuration)}
              </span>
            </div>
          </div>

          {/* 播放/暂停 */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-lg shrink-0 transition-all"
          >
            {floatingPlaying ? '⏸' : '▶'}
          </button>
        </div>
      )}
    </div>
  );
}
