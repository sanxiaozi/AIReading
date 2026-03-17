import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n/config';

// Create i18n middleware
const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

// Admin route protection (excluding login page)
function adminGuard(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken || adminToken !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  return null;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n middleware for admin routes
  if (pathname.startsWith('/admin')) {
    return adminGuard(request);
  }

  // Apply i18n middleware for other routes
  return i18nMiddleware(request);
}

export const config = {
  // Exclude Next.js internals, static assets, and SEO-critical files from i18n middleware.
  // sitemap.xml and robots.txt must NOT be rewritten to /[locale]/ paths.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp3|woff|woff2|ttf)).*)',
  ],
};
