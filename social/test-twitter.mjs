#!/usr/bin/env node

import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🔍 检查环境变量...');
console.log('API Key:', process.env.TWITTER_API_KEY?.substring(0, 5) + '...');
console.log('API Secret:', process.env.TWITTER_API_SECRET?.substring(0, 5) + '...');
console.log('Access Token:', process.env.TWITTER_ACCESS_TOKEN?.substring(0, 10) + '...');
console.log('Access Secret:', process.env.TWITTER_ACCESS_SECRET?.substring(0, 5) + '...');

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

try {
  console.log('\n🧪 测试 API 连接...');
  const me = await client.v2.me();
  console.log('✅ 连接成功!');
  console.log('账号信息:', me.data);
} catch (error) {
  console.error('❌ 连接失败!');
  console.error('错误详情:', error);
  
  if (error.code === 401) {
    console.error('\n💡 401 错误通常意味着:');
    console.error('1. App 权限设置不正确（需要 Read and Write）');
    console.error('2. Access Token 在权限修改前生成（需要重新生成）');
    console.error('3. API Key 或 Secret 不匹配');
    console.error('\n请检查: https://developer.twitter.com/en/portal/dashboard');
  }
}
