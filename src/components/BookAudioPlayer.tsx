'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { getAudioUrl } from '@/lib/config';

interface BookAudioPlayerProps {
  bookId: string | number;
  bookTitle: string;
  coverUrl: string;
}

export function BookAudioPlayer({
  bookId,
  bookTitle,
  coverUrl,
}: BookAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [version, setVersion] = useState<'short' | 'long'>('short');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const TRIAL_SECONDS = 999999; // 已取消登录限制，所有用户可完整播放
  const audioUrl = getAudioUrl(bookId, version);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setError(null);
    audio.load();
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => { setDuration(audio.duration); setIsLoading(false); };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // 已取消登录限制，所有用户可完整播放
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => { setError('音频加载失败，文件可能尚未上传'); setIsLoading(false); };
    const onCanPlay = () => setIsLoading(false);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setError('播放失败'));
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const formatTime = (t: number) => {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressMax = duration || 0;
  const progressValue = currentTime;

  return (
    <div className="space-y-4">
      {/* Version toggle */}
      <div className="flex gap-2">
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

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {error ? (
        <div className="text-center py-4 text-red-400 text-sm bg-red-400/10 rounded-xl">{error}</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          {/* Progress */}
          <div className="space-y-1 mb-4">
            <div className="relative">
              <input
                type="range"
                min={0}
                max={progressMax}
                value={progressValue}
                onChange={handleSeek}
                disabled={isLoading}
                className="w-full h-1.5 accent-purple-500 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Play button */}
          <div className="flex items-center justify-center">
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center text-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              {isLoading ? <span className="text-base animate-spin">⏳</span>
                : isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 悬浮播放器（页面底部，播放时出现）───
interface FloatingPlayerProps {
  bookTitle: string;
  coverUrl: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onClose: () => void;
}

export function FloatingPlayer({
  bookTitle,
  coverUrl,
  isPlaying,
  currentTime,
  duration,
  onToggle,
  onClose,
}: FloatingPlayerProps) {
  const formatTime = (t: number) => {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111827]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center gap-3 shadow-2xl">
      {/* 关闭 */}
      <button onClick={onClose} className="text-gray-400 hover:text-white text-lg shrink-0">✕</button>

      {/* 封面 */}
      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative bg-purple-900/40">
        <Image src={coverUrl} alt={bookTitle} fill className="object-cover" unoptimized />
      </div>

      {/* 书名 + 进度 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{bookTitle}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 播放/暂停 */}
      <button
        onClick={onToggle}
        className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-lg shrink-0 transition-all"
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
    </div>
  );
}
