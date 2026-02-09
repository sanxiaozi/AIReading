/**
 * AudioPlayer Component
 * 音频播放器组件示例
 * 
 * 使用方法：
 * import { AudioPlayer } from '@/components/AudioPlayer';
 * <AudioPlayer bookId={29} language="zh" version="short" />
 */

'use client';

import { getAudioUrl } from '@/lib/config';
import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  bookId: string | number;
  language?: 'zh' | 'en';
  version?: 'short' | 'medium' | 'long';
  autoPlay?: boolean;
  className?: string;
}

export function AudioPlayer({
  bookId,
  language = 'zh',
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

  // 获取音频 URL
  const audioUrl = getAudioUrl(bookId, language, version);

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
      <div className={`audio-player-error ${className}`}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`audio-player ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        autoPlay={autoPlay}
      />
      
      <div className="controls">
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? '加载中...' : isPlaying ? '⏸' : '▶'}
        </button>
        
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <style jsx>{`
        .audio-player {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: #007bff;
          color: white;
          font-size: 20px;
          cursor: pointer;
          transition: background 0.2s;
        }

        button:hover:not(:disabled) {
          background: #0056b3;
        }

        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .time-display {
          font-family: monospace;
          font-size: 14px;
          color: #666;
        }

        .audio-player-error {
          padding: 1rem;
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 8px;
          color: #c00;
        }
      `}</style>
    </div>
  );
}

/**
 * 使用示例:
 * 
 * // 基础用法
 * <AudioPlayer bookId={29} />
 * 
 * // 完整配置
 * <AudioPlayer 
 *   bookId={3} 
 *   language="zh" 
 *   version="short" 
 *   autoPlay={false}
 *   className="my-custom-player"
 * />
 */
