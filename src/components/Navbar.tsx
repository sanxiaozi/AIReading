'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { localeNames, type Locale } from '@/i18n/config';

function getLocaleFromPath(pathname: string | null): Locale {
  if (pathname?.startsWith('/en')) {
    return 'en';
  }

  return 'zh';
}

function stripLocalePrefix(pathname: string | null): string {
  if (!pathname || pathname === '/') {
    return '/';
  }

  if (pathname === '/en' || pathname === '/zh') {
    return '/';
  }

  if (pathname.startsWith('/en/')) {
    return pathname.slice(3);
  }

  if (pathname.startsWith('/zh/')) {
    return pathname.slice(3);
  }

  return pathname;
}

export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const basePath = stripLocalePrefix(pathname);
  const localeRoot = locale === 'en' ? '/en' : '/';
  const loginHref = locale === 'en' ? '/en/login' : '/login';
  const registerHref = locale === 'en' ? '/en/register' : '/register';

  const localizePath = (targetLocale: Locale) => {
    const localizedPath =
      targetLocale === 'en'
        ? basePath === '/'
          ? '/en'
          : `/en${basePath}`
        : basePath;
    
    return localizedPath;
  };

  return (
    <nav className="border-b border-white/10 bg-[#0B1020]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={localeRoot} className="text-lg font-bold text-white hover:text-purple-400 transition-colors">
          📚 AIreading
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-1">
            {(['zh', 'en'] as const).map((targetLocale) => {
              const isActive = locale === targetLocale;

              return (
                <Link
                  key={targetLocale}
                  href={localizePath(targetLocale)}
                  locale={false}
                  className={`px-2.5 py-1 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {localeNames[targetLocale]}
                </Link>
              );
            })}
          </div>

          {isLoading ? null : isAuthenticated ? (
            <>
              <span className="text-sm text-gray-400 hidden sm:block">
                {user?.username || user?.email}
              </span>
              <button
                onClick={() => logout()}
                className="text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                href={loginHref}
                className="text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                登录
              </Link>
              <Link
                href={registerHref}
                className="text-sm px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors font-medium"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
