#!/usr/bin/env node

/**
 * AIreading Twitter Bot
 * 自动发布推文到 @AIreadingHQ
 */

import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

// 初始化 Twitter 客户端
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// 调试输出
console.log('🔑 API Key:', process.env.TWITTER_API_KEY ? '✅ 已设置' : '❌ 未设置');
console.log('🔑 Access Token:', process.env.TWITTER_ACCESS_TOKEN ? '✅ 已设置' : '❌ 未设置');

const rwClient = client.readWrite;

/**
 * 发布推文
 */
async function tweet(text) {
  try {
    console.log('📤 发布推文...');
    console.log('内容:', text);
    
    const result = await rwClient.v2.tweet(text);
    
    console.log('✅ 发布成功!');
    console.log('推文 ID:', result.data.id);
    console.log('查看: https://twitter.com/AIreadingHQ/status/' + result.data.id);
    
    return result.data;
  } catch (error) {
    console.error('❌ 发布失败:', error);
    throw error;
  }
}

/**
 * 置顶推文
 */
async function pinTweet(tweetId) {
  try {
    console.log('📌 置顶推文:', tweetId);
    await rwClient.v2.pinTweet(tweetId);
    console.log('✅ 置顶成功!');
  } catch (error) {
    console.error('❌ 置顶失败:', error);
  }
}

/**
 * 回复推文
 */
async function reply(text, replyToId) {
  try {
    console.log('💬 回复推文...');
    const result = await rwClient.v2.tweet(text, {
      reply: { in_reply_to_tweet_id: replyToId }
    });
    console.log('✅ 回复成功!');
    return result.data;
  } catch (error) {
    console.error('❌ 回复失败:', error);
    throw error;
  }
}

/**
 * 发布线程（Thread）
 */
async function thread(tweets) {
  try {
    console.log(`🧵 发布线程 (${tweets.length} 条推文)...`);
    
    let previousTweetId = null;
    const results = [];
    
    for (let i = 0; i < tweets.length; i++) {
      console.log(`发布第 ${i + 1}/${tweets.length} 条...`);
      
      const options = previousTweetId 
        ? { reply: { in_reply_to_tweet_id: previousTweetId } }
        : {};
      
      const result = await rwClient.v2.tweet(tweets[i], options);
      results.push(result.data);
      previousTweetId = result.data.id;
      
      // 避免速率限制
      if (i < tweets.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('✅ 线程发布成功!');
    return results;
  } catch (error) {
    console.error('❌ 线程发布失败:', error);
    throw error;
  }
}

/**
 * 获取提及（Mentions）
 */
async function getMentions() {
  try {
    const me = await rwClient.v2.me();
    const mentions = await rwClient.v2.userMentionTimeline(me.data.id, {
      max_results: 10,
      'tweet.fields': ['created_at', 'author_id']
    });
    
    return mentions.data?.data || [];
  } catch (error) {
    console.error('❌ 获取提及失败:', error);
    return [];
  }
}

/**
 * 从文件读取今日推文
 */
function loadTodayTweets() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filePath = path.join(__dirname, 'posts', `${today}.md`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`今日推文文件不存在: ${filePath}`);
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 解析 Markdown 文件，提取推文内容
  const tweets = [];
  const tweetBlocks = content.match(/```\n([\s\S]*?)\n```/g);
  
  if (tweetBlocks) {
    tweetBlocks.forEach(block => {
      const text = block.replace(/```\n?/g, '').trim();
      if (text && !text.includes('bash') && !text.includes('javascript')) {
        tweets.push(text);
      }
    });
  }
  
  return tweets;
}

/**
 * CLI 命令
 */
const command = process.argv[2];
const arg = process.argv[3];

(async () => {
  try {
    switch (command) {
      case 'post':
        // 发布单条推文
        if (!arg) {
          console.error('用法: node twitter-bot.mjs post "推文内容"');
          process.exit(1);
        }
        await tweet(arg);
        break;
        
      case 'thread':
        // 发布线程
        const tweets = process.argv.slice(3);
        if (tweets.length === 0) {
          console.error('用法: node twitter-bot.mjs thread "推文1" "推文2" ...');
          process.exit(1);
        }
        await thread(tweets);
        break;
        
      case 'today':
        // 发布今日所有推文
        const todayTweets = loadTodayTweets();
        console.log(`📋 找到 ${todayTweets.length} 条今日推文`);
        
        for (let i = 0; i < todayTweets.length; i++) {
          console.log(`\n发布第 ${i + 1}/${todayTweets.length} 条...`);
          await tweet(todayTweets[i]);
          
          // 如果是第一条，置顶它
          if (i === 0) {
            const firstTweet = await rwClient.v2.me();
            // 需要获取刚发布的推文 ID 来置顶
          }
          
          // 间隔 1 分钟
          if (i < todayTweets.length - 1) {
            console.log('⏳ 等待 1 分钟...');
            await new Promise(resolve => setTimeout(resolve, 60000));
          }
        }
        break;
        
      case 'pin':
        // 置顶推文
        if (!arg) {
          console.error('用法: node twitter-bot.mjs pin <tweet_id>');
          process.exit(1);
        }
        await pinTweet(arg);
        break;
        
      case 'mentions':
        // 查看提及
        const mentions = await getMentions();
        console.log(`📬 收到 ${mentions.length} 条提及:`);
        mentions.forEach(m => {
          console.log(`- ${m.text}`);
        });
        break;
        
      case 'test':
        // 测试连接
        const me = await rwClient.v2.me();
        console.log('✅ API 连接成功!');
        console.log('账号信息:', me.data);
        break;
        
      default:
        console.log(`
AIreading Twitter Bot - 使用说明

命令:
  test                          测试 API 连接
  post "内容"                   发布单条推文
  thread "推文1" "推文2" ...    发布线程
  today                         发布今日所有推文
  pin <tweet_id>                置顶推文
  mentions                      查看提及

示例:
  node twitter-bot.mjs test
  node twitter-bot.mjs post "Hello World!"
  node twitter-bot.mjs today
        `);
    }
  } catch (error) {
    console.error('执行失败:', error.message);
    process.exit(1);
  }
})();
