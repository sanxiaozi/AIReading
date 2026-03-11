'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <nav className="border-b border-white/10 bg-[#0B1020]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-white hover:text-purple-400 transition-colors">
          📚 AIreading
        </Link>

        <div className="flex items-center gap-3">
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
                href="/login"
                className="text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
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
