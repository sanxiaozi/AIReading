/**
 * 书籍详情页使用示例
 * 展示如何集成 BookReviews 和 CelebrityRecommendations 组件
 */

import BookReviews from '@/components/BookReviews';
import CelebrityRecommendations from '@/components/CelebrityRecommendations';
import type { Locale } from '@/lib/i18n';

// 示例数据类型
interface BookPageExampleProps {
  bookId: string | number;
  locale: Locale;
}

export default function BookPageExample({ bookId, locale }: BookPageExampleProps) {
  // 示例：用户评论数据（实际应从 API 获取）
  const sampleReviews = [
    {
      id: '1',
      userId: 'user1',
      userName: '张三',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      rating: 5,
      content: '这本书真的很棒！作者用简洁的语言讲述了复杂的概念，让我对这个主题有了全新的理解。强烈推荐给所有对此感兴趣的读者。',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 24,
      isLiked: false,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'John Smith',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      rating: 4,
      content: 'Great insights and practical advice. The only reason I gave it 4 stars instead of 5 is that some chapters felt a bit repetitive.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 12,
      isLiked: true,
    },
    {
      id: '3',
      userId: 'user3',
      userName: '李四',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      rating: 5,
      content: '作为初学者，这本书给了我很大的启发。每一章都有实用的例子，让我能够立即应用到实际工作中。',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      isLiked: false,
    },
  ];

  // 示例：名人推荐数据（实际应从 API 获取）
  const sampleCelebrities = [
    {
      id: '1',
      name: 'Elon Musk',
      title: 'CEO of Tesla & SpaceX',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elon',
      recommendation: 'This book provides a comprehensive framework for thinking about the future. Essential reading for anyone building innovative products.',
      verified: true,
    },
    {
      id: '2',
      name: '比尔·盖茨',
      title: '微软联合创始人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bill',
      recommendation: '这本书深入浅出地阐述了复杂的理念，是我今年读过最有价值的书之一。强烈推荐给所有想要深入理解这一领域的人。',
      verified: true,
    },
    {
      id: '3',
      name: 'Tim Ferriss',
      title: 'Author & Entrepreneur',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tim',
      recommendation: 'A masterclass in strategic thinking. The author breaks down complex concepts into actionable insights that anyone can apply.',
      verified: true,
    },
    {
      id: '4',
      name: '雷军',
      title: '小米科技创始人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lei',
      recommendation: '这本书改变了我对产品创新的理解。书中的案例分析非常精彩，值得反复阅读和思考。',
      verified: true,
    },
  ];

  // 示例：当前用户信息（实际应从认证系统获取）
  const currentUser = {
    id: 'current-user',
    name: '当前用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
  };

  // 示例：提交评论处理函数
  const handleSubmitReview = async (review: { rating: number; content: string }) => {
    console.log('提交评论:', review);
    // 实际应调用 API 提交评论
    // await fetch('/api/reviews', { method: 'POST', body: JSON.stringify({ bookId, ...review }) });
  };

  // 示例：点赞评论处理函数
  const handleLikeReview = async (reviewId: string) => {
    console.log('点赞评论:', reviewId);
    // 实际应调用 API 点赞评论
    // await fetch(`/api/reviews/${reviewId}/like`, { method: 'POST' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 书籍详情内容 */}
      <div className="bg-bg-1 rounded-2xl p-8">
        <h1 className="text-4xl font-display font-bold text-text-0 mb-4">
          书籍标题
        </h1>
        <p className="text-text-1">
          这里是书籍的其他内容...
        </p>
      </div>

      {/* 名人推荐板块 */}
      <CelebrityRecommendations
        bookId={bookId}
        locale={locale}
        celebrities={sampleCelebrities}
      />

      {/* 用户评论板块 */}
      <BookReviews
        bookId={bookId}
        locale={locale}
        reviews={sampleReviews}
        currentUser={currentUser}
        onSubmitReview={handleSubmitReview}
        onLikeReview={handleLikeReview}
      />
    </div>
  );
}

/**
 * 集成说明：
 * 
 * 1. 在书籍详情页导入这两个组件：
 *    import BookReviews from '@/components/BookReviews';
 *    import CelebrityRecommendations from '@/components/CelebrityRecommendations';
 * 
 * 2. 准备数据（从 API 获取）：
 *    - reviews: 用户评论列表
 *    - celebrities: 名人推荐列表
 *    - currentUser: 当前登录用户信息（未登录则为 null）
 * 
 * 3. 实现回调函数：
 *    - onSubmitReview: 处理提交评论的逻辑
 *    - onLikeReview: 处理点赞评论的逻辑
 * 
 * 4. 渲染组件：
 *    <CelebrityRecommendations bookId={bookId} locale={locale} celebrities={celebrities} />
 *    <BookReviews 
 *      bookId={bookId} 
 *      locale={locale} 
 *      reviews={reviews}
 *      currentUser={currentUser}
 *      onSubmitReview={handleSubmitReview}
 *      onLikeReview={handleLikeReview}
 *    />
 * 
 * 5. API 端点建议：
 *    - GET /api/books/:id/reviews - 获取评论列表
 *    - POST /api/books/:id/reviews - 提交新评论
 *    - POST /api/reviews/:id/like - 点赞评论
 *    - GET /api/books/:id/celebrities - 获取名人推荐列表
 */
