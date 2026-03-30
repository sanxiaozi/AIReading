import { NextRequest, NextResponse } from 'next/server';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const BUCKET = 'aireading-audio';

export async function POST(request: NextRequest) {
  const { bookId, version, lang = 'zh' } = await request.json();

  if (!bookId || !version) {
    return NextResponse.json({ error: '缺少参数' }, { status: 400 });
  }

  const key = `${lang}/${bookId}/${version}.m4a`;

  // 用 Cloudflare R2 API 生成预签名 URL（使用 Workers API）
  // R2 暂不支持标准 S3 presign，改用服务端直接转发上传
  // 返回上传目标 key，前端把文件发给 /api/admin/audio/upload
  return NextResponse.json({ key, uploadUrl: `/api/admin/audio/upload` });
}
