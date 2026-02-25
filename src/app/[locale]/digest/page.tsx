import { notFound } from 'next/navigation';
import Link from 'next/link';

interface DigestArticle {
  rank: number;
  title: string;
  titleEn: string;
  url: string;
  source: string;
  timeAgo: string;
  category: string;
  score: number;
  summary: string;
  tags: string[];
}

interface DigestData {
  date: string;
  overview: string;
  top3: DigestArticle[];
  stats: {
    sources: number;
    articles: number;
    selected: number;
  };
  categories: Record<string, number>;
  articles: DigestArticle[];
}

async function getDigest(): Promise<DigestData | null> {
  try {
    const res = await fetch('https://aireading.app/digest-data.json', { 
      cache: 'no-store' 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function DigestPage({ params }: { params: { locale: string } }) {
  const locale = params.locale === 'en' ? 'en' : 'zh';
  const data = await getDigest();
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No digest available</h1>
          <p className="text-gray-400">Please check back later</p>
        </div>
      </div>
    );
  }

  const categoryIcons: Record<string, string> = {
    '⚙️ 工程': '🔧',
    '🛠 工具 / 开源': '🛠',
    '💡 观点 / 杂谈': '💡',
    '🤖 AI / ML': '🤖',
    '📝 其他': '📝',
    '🔒 安全': '🔒',
  };

  const categoryNames: Record<string, Record<string, string>> = {
    zh: {
      '⚙️ 工程': '工程',
      '🛠 工具 / 开源': '工具/💡 观点开源',
      ' / 杂谈': '观点/杂谈',
      '🤖 AI / ML': 'AI/ML',
      '📝 其他': '其他',
      '🔒 安全': '安全',
    },
    en: {
      '⚙️ Engineering': 'Engineering',
      '🛠 Tools': 'Tools',
      '💡 Opinions': 'Opinions',
      '🤖 AI/ML': 'AI/ML',
      '📝 Other': 'Other',
      '🔒 Security': 'Security',
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}/library`} className="text-purple-300 hover:text-white">
              ← Back to Library
            </Link>
            <span className="text-sm text-purple-300">AIreading</span>
          </div>
          <h1 className="text-3xl font-bold mt-4">📰 AI Daily Digest</h1>
          <p className="text-purple-200 mt-2">{data.date}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Overview */}
        <section className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3">📝 今日看点</h2>
          <p className="text-gray-300 leading-relaxed">{data.overview}</p>
        </section>

        {/* Top 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🏆 今日必读</h2>
          <div className="space-y-4">
            {data.top3.map((article) => (
              <a
                key={article.rank}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {article.rank === 1 ? '🥇' : article.rank === 2 ? '🥈' : '🥉'}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{article.title}</h3>
                    <p className="text-purple-400 text-sm mt-1">{article.titleEn}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.timeAgo}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-purple-900 rounded text-purple-300">
                        {article.category}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-3">{article.summary}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 数据概览</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold">{data.stats.sources}</div>
              <div className="text-gray-400 text-sm">Sources</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold">{data.stats.articles}</div>
              <div className="text-gray-400 text-sm">Articles</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">{data.stats.selected}</div>
              <div className="text-gray-400 text-sm">Selected</div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">分类分布</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.categories).map(([cat, count]) => (
                <span key={cat} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                  {cat} {count}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* All Articles by Category */}
        <section>
          <h2 className="text-xl font-semibold mb-4">📚 全部文章</h2>
          {Object.entries(
            data.articles.reduce((acc, article) => {
              if (!acc[article.category]) acc[article.category] = [];
              acc[article.category].push(article);
              return acc;
            }, {} as Record<string, DigestArticle[]>)
          ).map(([category, articles]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                {categoryIcons[category] || '📁'} {category}
              </h3>
              <div className="space-y-3">
                {articles.map((article) => (
                  <a
                    key={article.url}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{article.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{article.source} • {article.timeAgo}</p>
                      </div>
                      <span className="text-purple-400 text-sm">⭐ {article.score}/30</span>
                    </div>
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">{article.summary}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>Generated from 92 RSS sources recommended by Andrej Karpathy</p>
          <p className="mt-1">By AIreading</p>
        </footer>
      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
