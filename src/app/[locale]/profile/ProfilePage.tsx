'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations, type Locale } from '@/lib/i18n';
import Link from 'next/link';

interface ProfilePageProps {
  locale: Locale;
}

export default function ProfilePage({ locale }: ProfilePageProps) {
  const { t } = useTranslations(locale);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [isAuthenticated, isLoading, locale, router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-0 via-bg-1 to-bg-2 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-1">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getSubscriptionBadgeColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'from-yellow-500 to-orange-500';
      case 'pro':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-0 via-bg-1 to-bg-2 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-text-1 hover:text-primary transition-colors mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t('profile.backToHome')}
          </Link>
          <h1 className="text-4xl font-display font-bold text-text-0">
            {t('profile.title')}
          </h1>
        </div>

        {/* User Info Card */}
        <div className="bg-bg-1/50 backdrop-blur-sm rounded-2xl p-8 border border-text-muted/10 shadow-glow mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                {user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase()}
              </div>
              {/* Subscription Badge */}
              <div
                className={`absolute -bottom-2 -right-2 bg-gradient-to-r ${getSubscriptionBadgeColor(
                  user.subscription_tier
                )} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
              >
                {user.subscription_tier.toUpperCase()}
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text-0 mb-2">
                {user.username || t('profile.noUsername')}
              </h2>
              <p className="text-text-1 mb-3">{user.email}</p>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {t('profile.memberSince')}: {new Date(user.created_at * 1000).toLocaleDateString()}
                  </span>
                </div>
                {user.last_login_at && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {t('profile.lastLogin')}: {new Date(user.last_login_at * 1000).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 rounded-lg transition-all"
            >
              {t('profile.logout')}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-bg-1/50 backdrop-blur-sm rounded-xl p-6 border border-text-muted/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-text-muted text-sm">{t('profile.favorites')}</p>
                <p className="text-2xl font-bold text-text-0">0</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-1/50 backdrop-blur-sm rounded-xl p-6 border border-text-muted/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-text-muted text-sm">{t('profile.listenHistory')}</p>
                <p className="text-2xl font-bold text-text-0">0</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-1/50 backdrop-blur-sm rounded-xl p-6 border border-text-muted/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-text-muted text-sm">{t('profile.totalListeningTime')}</p>
                <p className="text-2xl font-bold text-text-0">0h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Favorites Section */}
          <div className="bg-bg-1/50 backdrop-blur-sm rounded-2xl p-8 border border-text-muted/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text-0">{t('profile.myFavorites')}</h3>
              <Link
                href={`/${locale}/favorites`}
                className="text-primary hover:text-primary-2 text-sm transition-colors"
              >
                {t('profile.viewAll')} →
              </Link>
            </div>
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <p className="text-text-muted">{t('profile.noFavorites')}</p>
            </div>
          </div>

          {/* Listen History Section */}
          <div className="bg-bg-1/50 backdrop-blur-sm rounded-2xl p-8 border border-text-muted/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text-0">{t('profile.recentlyListened')}</h3>
              <Link
                href={`/${locale}/history`}
                className="text-primary hover:text-primary-2 text-sm transition-colors"
              >
                {t('profile.viewAll')} →
              </Link>
            </div>
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-text-muted">{t('profile.noHistory')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
