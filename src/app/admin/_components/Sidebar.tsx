'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const copy = {
  zh: {
    subtitle: '管理后台',
    overview: '概览',
    audio: '音频管理',
    books: '书籍管理',
    logout: '退出登录',
  },
  en: {
    subtitle: 'Admin Panel',
    overview: 'Overview',
    audio: 'Audio',
    books: 'Books',
    logout: 'Log out',
  },
  id: {
    subtitle: 'Panel Admin',
    overview: 'Ringkasan',
    audio: 'Audio',
    books: 'Buku',
    logout: 'Keluar',
  },
} as const;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');
  const lang = langParam === 'en' || langParam === 'id' ? langParam : 'zh';
  const t = copy[lang];
  const query = `?lang=${lang}`;
  const navItems = [
    { href: `/admin${query}`, label: t.overview, icon: '📊' },
    { href: `/admin/audio${query}`, label: t.audio, icon: '🎵' },
    { href: `/admin/books${query}`, label: t.books, icon: '📚' },
  ];

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <aside className="w-56 min-h-screen bg-gray-900 border-r border-white/10 flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="text-lg font-bold text-white">📚 AIreading</div>
        <div className="text-xs text-gray-500 mt-0.5">{t.subtitle}</div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href.replace(query, '');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <span>🚪</span>
          <span>{t.logout}</span>
        </button>
      </div>
    </aside>
  );
}
