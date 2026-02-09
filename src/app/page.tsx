'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/en/');
  }, [router]);

  return (
    <div>
      <script dangerouslySetInnerHTML={{ __html: "window.location.href='/en/';" }} />
      Redirecting...
    </div>
  );
}
