# AiReading - 全球多语言 AI 读书平台

> "让每个人都能与知识对话" - 用 AI 15 分钟听懂一本书

![AiReading Logo](https://aireading.com/logo.png)

[![Website](https://img.shields.io/badge/website-aireading.com-blue)](https://aireading.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 🌟 项目简介

AiReading 是一个全球化的 AI 读书与讲书平台，通过 AI 技术自动生成多语言书籍摘要、音频讲书，并支持用户与书籍进行智能对话，让用户在 15 分钟内理解一本书的精华。

### 核心特性

- 📚 **AI 书籍摘要**: 3 分钟快速摘要 + 10 分钟深度讲解
- 🎧 **多语言音频**: 支持中文、英文、泰语、印尼语 TTS 朗读
- 💬 **与书对话**: NotebookLM 式 AI 问答，带引用标注
- 📝 **智能笔记**: 自动生成知识卡片，支持导出
- 🌍 **全球化**: 4 种语言界面，自动语言检测
- 📱 **全端支持**: Web + iOS + Android 无缝体验
- 🎨 **用户上传**: UGC 内容生态，AI 自动生成讲书稿

---

## 🚀 快速开始

### 在线访问

**官网**: [https://aireading.com](https://aireading.com)

### 本地开发

#### 前置要求

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Python 3.10+ (如果使用 FastAPI)

#### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/your-org/aireading.git
cd aireading

# 安装依赖
npm install

# 启动开发环境（Docker）
docker-compose up -d

# 运行数据库迁移
npm run db:migrate

# 启动前端开发服务器
npm run dev

# 启动后端服务器
cd backend
npm run dev
# 或
python -m uvicorn main:app --reload
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

---

## 📁 项目结构

```
aireading/
├── apps/
│   ├── web/                    # Next.js Web 应用
│   ├── mobile/                 # React Native 移动应用
│   └── cms/                    # CMS 管理后台
├── packages/
│   ├── ui/                     # 共享 UI 组件库
│   ├── api-client/             # API 客户端
│   └── shared/                 # 共享工具和类型
├── backend/
│   ├── api/                    # FastAPI/Node.js API
│   ├── workers/                # Celery 异步任务
│   └── scripts/                # 脚本工具
├── config/
│   └── site.config.yaml        # 站点配置
├── ai/
│   └── ab-variants.json        # A/B 测试变体
├── docs/                       # 项目文档
│   ├── AiReadingProject.md     # 项目文档
│   ├── AIReadingWebDesign.md   # Web 设计文档
│   ├── TechnicalSpecification.md  # 技术规范
│   ├── DevelopmentTaskList.md     # 开发任务清单
│   ├── SEO-UX-Audit-Checklist.md  # SEO/UX 审核清单
│   └── DOMAIN_CONFIG.md        # 域名配置文档
├── openspec/
│   └── project.md              # OpenSpec 项目上下文
├── docker-compose.yml
├── package.json
└── README.md                   # 本文件
```

---

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **UI 库**: shadcn/ui + Tailwind CSS
- **语言**: TypeScript
- **状态管理**: Zustand
- **数据获取**: TanStack Query
- **移动端**: React Native (Expo)

### 后端
- **API**: FastAPI (Python) 或 Node.js + Express
- **数据库**: PostgreSQL 15 + pgvector
- **缓存**: Redis
- **队列**: Celery / Bull
- **存储**: MinIO / AWS S3

### AI & ML
- **LLM**: OpenAI GPT-4 / Anthropic Claude / Google Gemini
- **TTS**: OpenAI TTS / ElevenLabs / Azure TTS
- **翻译**: DeepL / NLLB
- **Embeddings**: OpenAI text-embedding-3

### DevOps
- **容器化**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **部署**: Vercel (前端) + Fly.io (后端)
- **监控**: Sentry + DataDog + Plausible

---

## 📖 核心文档

| 文档 | 描述 |
|------|------|
| [项目文档](AiReadingProject.md) | 项目愿景、产品定位、功能规划 |
| [Web 设计](AIReadingWebDesign.md) | 页面清单和结构设计 |
| [技术规范](TechnicalSpecification.md) | 系统架构、数据库设计、API 规范 |
| [开发任务](DevelopmentTaskList.md) | 详细的开发任务清单（157 个任务） |
| [SEO 审核](SEO-UX-Audit-Checklist.md) | SEO 和 UX 审核清单 |
| [域名配置](DOMAIN_CONFIG.md) | 域名和 DNS 配置文档 |
| [OpenSpec](openspec/project.md) | OpenSpec 项目上下文 |

---

## 🎯 开发路线图

### Phase 1: MVP (0-3 个月) ✅ 进行中
- [x] 项目初始化
- [ ] 核心页面开发（首页、书籍详情、书架、搜索）
- [ ] 后端 API（书籍、用户、认证）
- [ ] AI 摘要生成与 RAG
- [ ] TTS 音频生成
- [ ] SEO 优化
- [ ] MVP 上线（20+ 本种子书籍）

### Phase 2: Enhancement (3-6 个月)
- [ ] 移动端 App（iOS + Android）
- [ ] UGC 用户上传功能
- [ ] CMS 编辑后台
- [ ] 泰语和印尼语支持
- [ ] 个性化推荐系统

### Phase 3: Scale (6-12 个月)
- [ ] 企业版 API
- [ ] AI 讲师人格化
- [ ] 知识图谱
- [ ] 跨书提问
- [ ] 国际化扩展（日语、西班牙语）

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

### 如何贡献

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 代码规范

- 前端：ESLint + Prettier + TypeScript strict mode
- 后端：Black (Python) / Prettier (Node.js)
- 提交信息：遵循 [Conventional Commits](https://www.conventionalcommits.org/)
- Git 分支：GitFlow (main, develop, feature/*, hotfix/*)

---

## 📊 项目统计

| 指标 | 数值 |
|------|------|
| 总任务数 | 157 个 |
| 前端任务 | 62 个 |
| 后端任务 | 53 个 |
| AI/ML 任务 | 26 个 |
| DevOps 任务 | 16 个 |
| 支持语言 | 4 种（en, zh, th, id） |
| 预计上线 | 3 个月 MVP |

---

## 👥 团队

### 核心团队

- **CEO / 产品负责人**: 贾冻冻 - 战略方向、内容精选
- **技术负责人**: [待招募] - 架构设计、AI 集成
- **前端负责人**: [待招募] - Web + 移动端开发
- **AI 内容负责人**: [待招募] - AI 提示词优化、模型调参
- **设计负责人**: [待招募] - 品牌视觉、交互体验

### 加入我们

我们正在招募优秀的工程师和设计师！如果你对 AI、教育科技、全球化产品感兴趣，欢迎联系：

📧 Email: hello@aireading.com

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可。

---

## 🔗 相关链接

- **官网**: [https://aireading.com](https://aireading.com)
- **文档**: [https://docs.aireading.com](https://docs.aireading.com)
- **API 文档**: [https://api.aireading.com/docs](https://api.aireading.com/docs)
- **状态页**: [https://status.aireading.com](https://status.aireading.com)
- **Twitter**: [@aireading](https://twitter.com/aireading)
- **Discord**: [加入社区](https://discord.gg/aireading)

---

## 📞 联系我们

- **用户支持**: support@aireading.com
- **商务合作**: hello@aireading.com
- **媒体咨询**: press@aireading.com
- **安全报告**: security@aireading.com

---

## ⭐ Star History

如果这个项目对你有帮助，请给我们一个 Star ⭐️！

[![Star History Chart](https://api.star-history.com/svg?repos=your-org/aireading&type=Date)](https://star-history.com/#your-org/aireading&Date)

---

**Built with ❤️ by the AiReading Team**

*让每个人都能与知识对话*
