import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AiReading - Understand Any Book in 15 Minutes with AI',
  description:
    'AI-powered book summaries, audiobooks, and intelligent discussions in multiple languages.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aireading.com'),
  openGraph: {
    title: 'AiReading - Understand Any Book in 15 Minutes with AI',
    description:
      'AI-powered book summaries, audiobooks, and intelligent discussions in multiple languages.',
    url: 'https://aireading.com',
    siteName: 'AiReading',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AiReading - Understand Any Book in 15 Minutes with AI',
    description:
      'AI-powered book summaries, audiobooks, and intelligent discussions in multiple languages.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
