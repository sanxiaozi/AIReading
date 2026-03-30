import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const booksData = JSON.parse(
    readFileSync(join(process.cwd(), 'content/booklist.json'), 'utf-8')
  );
  return NextResponse.json(booksData);
}
