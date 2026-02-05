'use client';

import { useState } from 'react';
import { useTranslations, type Locale } from '@/lib/i18n';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

interface BookReviewsProps {
  bookId: string | number;
  locale: Locale;
  reviews?: Review[];
  currentUser?: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  onSubmitReview?: (review: { rating: number; content: string }) => Promise<void>;
  onLikeReview?: (reviewId: string) => Promise<void>;
}

export default function BookReviews({
  bookId,
  locale,
  reviews = [],
  currentUser,
  onSubmitReview,
  onLikeReview,
}: BookReviewsProps) {
  const { t } = useTranslations(locale);
  
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitReview?.({ rating, content });
      setContent('');
      setRating(5);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    await onLikeReview?.(reviewId);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return t('bookReviews.today');
    } else if (diffInDays === 1) {
      return t('bookReviews.yesterday');
    } else if (diffInDays < 7) {
      return t('bookReviews.daysAgo').replace('{days}', diffInDays.toString());
    } else {
      return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="w-full bg-bg-1 rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-text-0 mb-6">
        {t('bookReviews.title')}
        {reviews.length > 0 && (
          <span className="text-text-muted ml-3 text-lg font-normal">
            ({reviews.length})
          </span>
        )}
      </h2>

      {/* 添加评论表单 */}
      <div className="mb-8 bg-bg-2 rounded-xl p-6 border border-bg-2 hover:border-primary/30 transition-colors">
        <h3 className="text-lg font-semibold text-text-0 mb-4">
          {t('bookReviews.writeReview')}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* 评分选择器 */}
          <div className="mb-4">
            <label className="block text-text-1 mb-2 text-sm">
              {t('bookReviews.yourRating')}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                  disabled={!currentUser}
                >
                  <span
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'text-warning'
                        : 'text-text-muted'
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
              <span className="ml-2 text-text-1 self-center">
                {rating}/5
              </span>
            </div>
          </div>

          {/* 评论内容 */}
          <div className="mb-4">
            <label className="block text-text-1 mb-2 text-sm">
              {t('bookReviews.yourReview')}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('bookReviews.reviewPlaceholder')}
              rows={4}
              disabled={!currentUser}
              className="w-full bg-bg-0 border border-bg-2 rounded-xl px-4 py-3 text-text-0 placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* 提交按钮或登录提示 */}
          {currentUser ? (
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="px-6 py-3 bg-primary hover:bg-primary-2 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow"
            >
              {isSubmitting ? t('bookReviews.submitting') : t('bookReviews.submit')}
            </button>
          ) : (
            <div className="bg-bg-0 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
              <p className="text-text-1">
                {t('bookReviews.loginRequired')}
              </p>
              <a
                href={`/${locale}/login`}
                className="px-4 py-2 bg-primary hover:bg-primary-2 text-white font-semibold rounded-lg transition-all hover:shadow-glow"
              >
                {t('bookReviews.loginButton')}
              </a>
            </div>
          )}
        </form>
      </div>

      {/* 评论列表 */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <p className="text-lg">{t('bookReviews.noReviews')}</p>
          <p className="text-sm mt-2">{t('bookReviews.beFirst')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-bg-2 rounded-xl p-6 border border-bg-2 hover:border-primary/20 transition-all"
            >
              {/* 用户信息和评分 */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-bg-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-text-0">
                      {review.userName}
                    </h4>
                    <span className="text-sm text-text-muted">
                      {formatTimestamp(review.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= review.rating ? 'text-warning' : 'text-text-muted'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-text-1 ml-1">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* 评论内容 */}
              <p className="text-text-1 leading-relaxed mb-4">
                {review.content}
              </p>

              {/* 点赞按钮 */}
              <button
                onClick={() => handleLike(review.id)}
                disabled={!currentUser}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  review.isLiked
                    ? 'bg-primary/20 text-primary'
                    : 'bg-bg-0 text-text-1 hover:bg-bg-0/70'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg
                  className="w-5 h-5"
                  fill={review.isLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <span>{review.likes}</span>
                <span className="hidden sm:inline">
                  {t('bookReviews.helpful')}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
