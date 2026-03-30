import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const booksData = JSON.parse(
  readFileSync(join(process.cwd(), 'content/booklist.json'), 'utf-8')
);

const CDN_BASE = 'https://audio.aireading.com';

interface Book {
  id: number;
  title: string;
  title_en?: string;
  author: string;
  category: string;
}

const SUPPORTED_LANGS = new Set(['zh', 'en', 'id']);

export async function GET(request: NextRequest) {
  const requestedLang = request.nextUrl.searchParams.get('lang') ?? 'zh';
  const lang = SUPPORTED_LANGS.has(requestedLang) ? requestedLang : 'zh';

  const results = await Promise.all(
    (booksData.books as Book[]).map(async (book) => {
      const shortUrl = `${CDN_BASE}/${lang}/${book.id}/short.m4a`;
      const longUrl = `${CDN_BASE}/${lang}/${book.id}/long.m4a`;

      const [shortOk, longOk] = await Promise.all([
        checkUrl(shortUrl),
        checkUrl(longUrl),
      ]);

      return {
        id: book.id,
        title: lang === 'en' ? book.title_en || book.title : book.title,
        author: book.author,
        category: book.category,
        shortOk,
        longOk,
        shortUrl,
        longUrl,
      };
    })
  );

  const total = results.length;
  const withBoth = results.filter((r) => r.shortOk && r.longOk).length;
  const withAny = results.filter((r) => r.shortOk || r.longOk).length;
  const missing = results.filter((r) => !r.shortOk && !r.longOk).length;

  return NextResponse.json({ books: results, lang, stats: { total, withBoth, withAny, missing } });
}

async function checkUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}
