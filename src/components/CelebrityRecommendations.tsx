'use client';

import { useTranslations, type Locale } from '@/lib/i18n';

interface Celebrity {
  id: string;
  name: string;
  title: string;
  avatar: string;
  recommendation: string;
  verified?: boolean;
}

interface CelebrityRecommendationsProps {
  bookId: string | number;
  locale: Locale;
  celebrities?: Celebrity[];
}

export default function CelebrityRecommendations({
  bookId,
  locale,
  celebrities = [],
}: CelebrityRecommendationsProps) {
  const { t } = useTranslations(locale);

  if (celebrities.length === 0) {
    return null; // 如果没有名人推荐，不显示此板块
  }

  return (
    <div className="w-full bg-bg-1 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-text-0">
          {t('celebrityRecommendations.title')}
        </h2>
        <svg
          className="w-6 h-6 text-accent"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>

      <p className="text-text-1 mb-8">
        {t('celebrityRecommendations.subtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {celebrities.map((celebrity) => (
          <div
            key={celebrity.id}
            className="group bg-bg-2 rounded-xl p-6 border border-bg-2 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden"
          >
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* 内容 */}
            <div className="relative z-10">
              {/* 引号装饰 */}
              <div className="absolute -top-2 -left-2 text-6xl text-primary/20 font-serif leading-none">
                "
              </div>

              {/* 用户信息 */}
              <div className="flex items-start gap-4 mb-4 relative">
                <div className="relative">
                  <img
                    src={celebrity.avatar}
                    alt={celebrity.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                  />
                  {celebrity.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-accent rounded-full p-1">
                      <svg
                        className="w-4 h-4 text-bg-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text-0 text-lg mb-1 truncate">
                    {celebrity.name}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {celebrity.title}
                  </p>
                </div>
              </div>

              {/* 推荐语 */}
              <blockquote className="text-text-1 leading-relaxed italic pl-4 border-l-2 border-primary/30">
                {celebrity.recommendation}
              </blockquote>

              {/* 悬停效果装饰 */}
              <div className="absolute bottom-0 right-0 text-8xl text-primary/10 font-serif leading-none transform translate-x-4 translate-y-4 opacity-0 group-hover:opacity-100 transition-opacity">
                "
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 如果名人推荐很多，可以添加"查看更多"按钮 */}
      {celebrities.length > 4 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-bg-2 hover:bg-bg-0 text-text-0 font-semibold rounded-xl transition-all border border-primary/20 hover:border-primary/40 hover:shadow-glow">
            {t('celebrityRecommendations.seeMore')}
          </button>
        </div>
      )}
    </div>
  );
}
