'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getAudioUrl } from '@/lib/config';

interface BookAudioPlayerProps {
  bookId: string | number;
}

export function BookAudioPlayer({ bookId }: BookAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [version, setVersion] = useState<'short' | 'long'>('short');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioUrl = getAudioUrl(bookId, version);

  // Reset state when version or bookId changes
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

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      setError('音频加载失败，文件可能尚未上传');
      setIsLoading(false);
    };
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
      audio.play().catch(() => setError('播放失败，请检查音频文件'));
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

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
      {/* Version toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setVersion('short')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            version === 'short'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white/10 text-gray-400 hover:bg-white/20'
          }`}
        >
          ⚡ 精华版
          <span className="block text-xs opacity-70 font-normal mt-0.5">1-3 分钟</span>
        </button>
        <button
          onClick={() => setVersion('long')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            version === 'long'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white/10 text-gray-400 hover:bg-white/20'
          }`}
        >
          📖 完整版
          <span className="block text-xs opacity-70 font-normal mt-0.5">15-30 分钟</span>
        </button>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {error ? (
        <div className="text-center py-4 text-red-400 text-sm bg-red-400/10 rounded-xl">
          {error}
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              disabled={isLoading || duration === 0}
              className="w-full h-1.5 accent-purple-500 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center">
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center text-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isLoading ? (
                <span className="text-base animate-spin">⏳</span>
              ) : isPlaying ? (
                '⏸'
              ) : (
                '▶'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
