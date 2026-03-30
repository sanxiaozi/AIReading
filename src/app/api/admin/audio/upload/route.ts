import { NextRequest, NextResponse } from 'next/server';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const BUCKET = 'aireading-audio';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const bookId = formData.get('bookId') as string;
  const version = formData.get('version') as string;
  const lang = (formData.get('lang') as string) || 'zh';

  if (!file || !bookId || !version) {
    return NextResponse.json({ error: '缺少参数' }, { status: 400 });
  }

  const key = `${lang}/${bookId}/${version}.m4a`;
  const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects/${key}`;

  try {
    const buffer = await file.arrayBuffer();

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'audio/mp4',
      },
      body: buffer,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('R2 upload error:', res.status, text);
      return NextResponse.json({ error: '上传到 R2 失败', detail: text }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      key,
      url: `https://audio.aireading.com/${key}`,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: '上传失败', detail: String(err) }, { status: 500 });
  }
}
