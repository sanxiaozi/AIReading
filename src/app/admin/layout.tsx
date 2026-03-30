import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIreading 管理后台',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {children}
    </div>
  );
}
