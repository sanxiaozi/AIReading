'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations, type Locale } from '@/lib/i18n';

interface UserNavProps {
  locale: Locale;
}

export default function UserNav({ locale }: UserNavProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslations(locale);

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-text-muted/10 animate-pulse" />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/login`}
          className="px-4 py-2 text-text-0 hover:text-primary transition-colors"
        >
          {t('auth.login.submit')}
        </Link>
        <Link
          href={`/${locale}/register`}
          className="px-4 py-2 bg-gradient-to-r from-primary to-primary-2 text-white font-medium rounded-lg hover:shadow-glow transition-all"
        >
          {t('auth.register.submit')}
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={`/${locale}/profile`}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-2 transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
        {user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase()}
      </div>
      <span className="text-text-0 font-medium group-hover:text-primary transition-colors">
        {user.username || user.email.split('@')[0]}
      </span>
    </Link>
  );
}
