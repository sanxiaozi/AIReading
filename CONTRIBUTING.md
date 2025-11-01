# Contributing to AiReading

感谢你对 AiReading 项目的关注！我们欢迎所有形式的贡献。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交信息规范](#提交信息规范)
- [Pull Request 流程](#pull-request-流程)
- [问题报告](#问题报告)
- [功能建议](#功能建议)

---

## 行为准则

参与本项目即表示你同意遵守我们的[行为准则](CODE_OF_CONDUCT.md)。请尊重所有贡献者。

---

## 如何贡献

贡献的方式有很多：

1. **报告 Bug** - 发现问题？请创建 Issue
2. **提出功能建议** - 有好的想法？我们很乐意听取
3. **编写代码** - 修复 Bug 或实现新功能
4. **改进文档** - 文档永远可以更好
5. **翻译** - 帮助我们支持更多语言
6. **测试** - 帮助我们测试新功能

---

## 开发流程

### 1. Fork 仓库

点击页面右上角的 "Fork" 按钮，将仓库 fork 到你的 GitHub 账号下。

### 2. 克隆仓库

```bash
git clone https://github.com/your-username/aireading.git
cd aireading
```

### 3. 添加上游仓库

```bash
git remote add upstream https://github.com/sanxiaozi/aireading.git
```

### 4. 创建分支

```bash
# 从 develop 分支创建新分支
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

分支命名规范：
- `feature/xxx` - 新功能
- `fix/xxx` - Bug 修复
- `docs/xxx` - 文档更新
- `refactor/xxx` - 代码重构
- `test/xxx` - 测试相关
- `chore/xxx` - 构建/工具相关

### 5. 开发

遵循[代码规范](#代码规范)进行开发。

### 6. 提交代码

```bash
git add .
git commit -m "feat: add amazing feature"
```

请遵循[提交信息规范](#提交信息规范)。

### 7. 推送到你的仓库

```bash
git push origin feature/your-feature-name
```

### 8. 创建 Pull Request

在 GitHub 上创建 Pull Request，目标分支为 `develop`。

---

## 代码规范

### 前端代码 (TypeScript/JavaScript)

#### 代码风格

我们使用 ESLint + Prettier 进行代码格式化：

```bash
# 运行 Lint
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

#### 命名规范

```typescript
// ✅ 组件名：PascalCase
export function BookCard({ book }: BookCardProps) {}

// ✅ 函数名：camelCase
function fetchBookDetails(id: string) {}

// ✅ 常量名：UPPER_SNAKE_CASE
const MAX_BOOKS_PER_PAGE = 20;

// ✅ 接口/类型：PascalCase
interface BookData {
  id: string;
  title: string;
}

// ✅ 文件名：kebab-case
// book-card.tsx
// use-book-data.ts
```

#### TypeScript 要求

- 使用 TypeScript strict mode
- 所有函数必须有类型注解
- 避免使用 `any`，使用 `unknown` 或具体类型
- 导出的接口和类型必须有 JSDoc 注释

```typescript
/**
 * 书籍卡片组件
 * @param book - 书籍数据对象
 * @param onPlay - 播放按钮点击回调
 */
export function BookCard({ book, onPlay }: BookCardProps) {
  // ...
}
```

### 后端代码 (Python)

#### 代码风格

使用 Black + isort 格式化：

```bash
# 格式化代码
black .
isort .

# 检查
black --check .
mypy .
```

#### 命名规范

```python
# ✅ 函数名：snake_case
def get_book_summary(book_id: str) -> dict:
    pass

# ✅ 类名：PascalCase
class BookService:
    pass

# ✅ 常量：UPPER_SNAKE_CASE
MAX_SUMMARY_LENGTH = 2000

# ✅ 私有变量：_leading_underscore
_internal_cache = {}
```

#### 类型注解

所有函数必须有类型注解：

```python
from typing import List, Optional

def fetch_books(
    category: str,
    limit: int = 20,
    offset: int = 0
) -> List[dict]:
    """
    获取书籍列表

    Args:
        category: 书籍分类
        limit: 返回数量限制
        offset: 分页偏移量

    Returns:
        书籍列表
    """
    pass
```

### React 组件规范

#### 组件结构

```typescript
// BookCard.tsx
import { useState } from 'react';
import { Book } from '@/types';

interface BookCardProps {
  book: Book;
  onPlay?: () => void;
}

export function BookCard({ book, onPlay }: BookCardProps) {
  // 1. Hooks
  const [isPlaying, setIsPlaying] = useState(false);

  // 2. Handlers
  const handlePlay = () => {
    setIsPlaying(true);
    onPlay?.();
  };

  // 3. Render
  return (
    <div className="book-card">
      {/* JSX */}
    </div>
  );
}
```

#### Hooks 规范

- 自定义 Hook 必须以 `use` 开头
- 将业务逻辑提取到自定义 Hook

```typescript
// useBookData.ts
export function useBookData(bookId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => fetchBook(bookId),
  });

  return { book: data, isLoading, error };
}
```

---

## 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构（既不是新功能也不是修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具/依赖更新
- `ci`: CI/CD 相关

### 示例

```bash
# 新功能
git commit -m "feat(book): add book recommendation algorithm"

# Bug 修复
git commit -m "fix(player): resolve audio playback issue on iOS"

# 文档更新
git commit -m "docs(readme): update installation instructions"

# 重构
git commit -m "refactor(api): simplify book fetching logic"

# 带 body 的提交
git commit -m "feat(chat): add AI citation feature

- Add citation extraction from AI responses
- Display citations in popup
- Link citations to original text

Closes #123"
```

### Scope 范围

常用的 scope：
- `book` - 书籍相关
- `chat` - AI 对话
- `player` - 音频播放器
- `library` - 书架
- `search` - 搜索
- `auth` - 认证
- `api` - API
- `db` - 数据库
- `ui` - UI 组件
- `i18n` - 国际化

---

## Pull Request 流程

### 创建 PR 之前

1. **确保代码通过所有检查**

```bash
# 运行所有测试
npm test

# 运行 Lint
npm run lint

# 运行类型检查
npm run type-check

# 构建项目
npm run build
```

2. **更新文档**

如果你的更改影响了 API 或用户界面，请更新相关文档。

3. **添加测试**

新功能必须包含单元测试或集成测试。

### PR 标题

PR 标题应遵循提交信息规范：

```
feat(book): add book recommendation feature
fix(player): resolve audio playback on iOS
docs: update API documentation
```

### PR 描述模板

```markdown
## 📝 变更描述

简要描述此 PR 的目的和内容。

## 🔗 相关 Issue

Closes #123
Related to #456

## ✅ 变更类型

- [ ] Bug fix (不破坏现有功能的修复)
- [ ] New feature (添加新功能)
- [ ] Breaking change (破坏性变更)
- [ ] Documentation update (文档更新)

## 🧪 测试

- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试完成

测试场景：
1. 测试场景 1
2. 测试场景 2

## 📷 截图（如果适用）

[添加截图]

## ✨ 额外说明

[任何额外的上下文或说明]
```

### Code Review

所有 PR 必须经过至少一名维护者的审核才能合并。

审核重点：
- 代码质量和可读性
- 测试覆盖率
- 性能影响
- 安全性
- 文档完整性

---

## 问题报告

### 报告 Bug

使用 [Bug Report 模板](../../issues/new?template=bug_report.md) 创建 Issue。

请包含：
- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 环境信息（浏览器、操作系统、版本等）
- 截图或错误日志

示例：

```markdown
**描述**
在 iOS Safari 上播放音频时，进度条不更新。

**复现步骤**
1. 在 iOS Safari 打开书籍详情页
2. 点击播放按钮
3. 观察进度条

**预期行为**
进度条应随音频播放实时更新。

**实际行为**
进度条保持在 0%。

**环境**
- 设备：iPhone 13
- 系统：iOS 16.5
- 浏览器：Safari 16.5
```

---

## 功能建议

使用 [Feature Request 模板](../../issues/new?template=feature_request.md) 创建 Issue。

请包含：
- 功能描述
- 使用场景
- 期望的解决方案
- 备选方案
- 相关截图或原型

---

## 本地开发环境设置

### 前端

```bash
cd apps/web
npm install
npm run dev
```

访问 http://localhost:3000

### 后端

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

访问 http://localhost:8000

### Docker 完整环境

```bash
docker-compose up
```

包含：PostgreSQL, Redis, MinIO

---

## 常见问题

### Q: 我应该向哪个分支提交 PR？

A: 所有 PR 应提交到 `develop` 分支。只有维护者才能合并到 `main`。

### Q: 我的 PR 被要求修改，如何更新？

A: 在你的分支上继续提交并推送：

```bash
git add .
git commit -m "fix: address review comments"
git push origin feature/your-feature
```

PR 会自动更新。

### Q: 如何保持我的 fork 与上游同步？

A:

```bash
git checkout develop
git pull upstream develop
git push origin develop
```

---

## 获得帮助

- 📖 查看[文档](https://docs.aireading.com)
- 💬 加入 [Discord 社区](https://discord.gg/aireading)
- 📧 发送邮件至 hello@aireading.com

---

## 贡献者名单

感谢所有贡献者！

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

**感谢你的贡献！** 🎉

每一个 PR、每一个 Issue、每一条建议都让 AiReading 变得更好。
