/**
 * AudioPlayer Component (legacy - use BookAudioPlayer for the new UI)
 */

'use client';

import { getAudioUrl } from '@/lib/config';
import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  bookId: string | number;
  version?: 'short' | 'long';
  autoPlay?: boolean;
  className?: string;
}

export function AudioPlayer({
  bookId,
  version = 'long',
  autoPlay = false,
  className = '',
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioUrl = getAudioUrl(bookId, version);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    const handleError = () => {
      setError('音频加载失败，请稍后重试');
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className={`p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        autoPlay={autoPlay}
      />

      <button
        onClick={togglePlayPause}
        disabled={isLoading}
        className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 flex items-center justify-center text-xl transition-all"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
      </button>

      <div className="font-mono text-sm text-gray-400">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}
