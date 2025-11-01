🌐 AiReading Web 端《页面清单 + 页面结构（最新完整版 · 2025 Q4）》

该版本兼顾「官方精选为主」与「用户上传为辅」的产品定位，
适用于 Next.js + shadcn/ui + Tailwind 前端体系。

⸻

🧭 一、全站信息架构（IA 总览）

AppShell（Header + Main + MiniPlayer）
│
├── 首页（/）
├── 分类浏览（/browse）
│    └── 分类详情页（/category/[slug]）
├── 书籍详情页（/book/[id]）
│    ├── 概览（Overview）
│    ├── 听书（Listen）
│    ├── 对话（Chat）
│    └── 笔记（Notes）
├── 书架（/library）
│    └── 上传（/upload）
├── 我的笔记（/notes）
├── 搜索（/search）
├── 设置（/settings）
│    ├── 个人信息
│    ├── 语言与偏好
│    └── 隐私与版权
└── 帮助 / 关于（/help / /about）


⸻

🏠 二、首页（/）

🎯 目标

让用户一打开网站就能直接听书，沉浸在精选内容中。

📚 页面结构

模块	描述
1️⃣ 顶部导航栏	Logo / 搜索框 / 语言切换 / 用户菜单 / MiniPlayer
2️⃣ Hero Banner（可选）	当期主题推荐（如「时间管理周」「全球好书榜」）
3️⃣ Continue Listening（继续收听）	最近播放的书籍卡片（最多3本）
4️⃣ Editor’s Picks（编辑精选）	官方精选主打内容（本周重点推荐）
5️⃣ Popular Now（热门飙升）	近72小时播放 + 收藏综合榜
6️⃣ AI Playlists（专题合辑）	如「投资入门10本」「写作力进阶」
7️⃣ Quick 3-min（快听3分钟）	AI生成的3分钟速听内容
8️⃣ New Arrivals（新书速览）	最近7天上新书
9️⃣ Community Picks（社区精选） 🆕	用户上传内容中评分高者
🔟 Footer	关于我们 / 使用条款 / 隐私政策 / 语言切换

🧩 关键组件
	•	BookCard（封面、标题、语言徽标、一键播放）
	•	ShelfCarousel（横向滑动）
	•	PlaylistStrip（歌单展示）
	•	SectionHeader（模块标题 + “查看全部”按钮）
	•	MiniPlayer（底部固定播放）

⸻

🗂️ 三、分类页（/browse）

🎯 目标

让用户按主题探索精选内容与UGC作品。

📚 页面结构

模块	描述
分类网格	商业 / 心理 / 文学 / 亲子 / 健康 / 科普 / 成长等
每个分类卡片	封面 + 简介 + “查看该分类”按钮
底部推荐	“你可能喜欢的主题” (embedding 相似度推荐)


⸻

📘 四、分类详情页（/category/[slug]）

模块	描述
分类标题与描述	如“心理成长：更好地理解自己与他人”
精选书籍区	编辑精选（5–10 本）
榜单区	本周最受欢迎
社区作品区（UGC精选）	用户上传且质量高的书
新上架	最近两周的新增
合辑推荐	同类主题的播放列表


⸻

📖 五、书籍详情页（/book/[id]）

📑 顶部信息栏
	•	封面 / 标题 / 作者 / 语言 / 标签 / 来源（官方 or 用户）
	•	操作按钮：收藏、加入书架、分享、举报（UGC）

🧩 主体结构（Tabs）

Tab	模块	描述
Overview（概览）	摘要 SummaryCard	Short 摘要（3分钟速读）
	深度提要 Outline	Deep Summary（10分钟讲书）
	金句精选	自动提取关键引言
	版权声明	来源与合规说明
Listen（听书）	播放器	支持 Short / Deep 两种音频
	播放列表	章节选择、倍速、下载
Chat（与书对话）	ChatWindow	输入框 + 历史对话
	推荐问题	“这本书核心观点？”等
	引用弹窗	显示原文出处
Notes（笔记）	自动笔记	AI 自动生成笔记
	我的笔记	用户编辑与保存
	导出	Markdown / PDF


⸻

📚 六、书架页（/library）

🎯 目标

个人中心 + 轻量上传入口。

模块	描述
Tabs	在读 / 已听完 / 想听 / 上传记录
书籍列表	封面 + 进度 + 最近播放时间
右上角按钮	➕ 上传书籍（弱化入口）
上传状态区	显示上传任务进度（处理中 / 已生成 / 审核中）

📍 上传书籍时弹出 Modal（非独立页），减少“入口显眼度”。

⸻

⬆️ 七、上传页（/upload） [Modal 弹窗 / 内嵌流程]

📑 流程结构
	1.	上传文件（txt / pdf / epub）
	2.	填写信息（书名、作者、语言、版权确认）
	3.	生成选项（Short / Deep / Outline / TTS）
	4.	生成进度条（Job Status）
	5.	生成成功 → 可私享或申请公开（默认私享）
	6.	提交审核 → 审核状态展示

⸻

🧠 八、我的笔记页（/notes）

模块	描述
搜索栏	按书名 / 标签 / 关键词搜索
NotesList	AI 自动笔记 + 用户自写
筛选器	来源（AI / 手写）、时间范围
导出功能	支持导出 Markdown / CSV
“知识卡模式”	按主题整理笔记，便于复习


⸻

🔍 九、搜索页（/search）

模块	描述
搜索框	书名 / 作者 / 主题 / 用户
搜索结果区	分类为：精选书籍 / UGC / 合辑
推荐提示	根据用户历史行为动态推荐


⸻

⚙️ 十、设置页（/settings）

模块	描述
个人资料	名称、头像、邮箱、会员状态
播放偏好	默认倍速 / 自动播放下一章
语言设置	界面语言（zh/en/th/id）+ 内容偏好
隐私设置	上传记录可见性 / 版权声明
账户操作	登出 / 删除账号


⸻

💡 十一、帮助与关于（/help, /about）

页面	模块
帮助中心	FAQ、版权政策、常见错误
关于我们	AiReading 团队介绍、品牌故事、联系方式


⸻

🔒 十二、系统辅助页

页面	功能
/auth/login	登录（邮箱 / Google 登录）
/auth/register	注册
/auth/reset	忘记密码
/error/404	未找到页面
/error/500	系统错误页


⸻

🧱 十三、核心全局组件

组件	功能
AppShell	全局布局（Header / Main / Footer / MiniPlayer）
MiniPlayer	底部播放条（随时播放）
BookCard	通用书籍卡片组件
SectionHeader	模块标题 + 操作
ShelfCarousel	横向滚动组件
UploadModal	弹窗式上传流程
ChatWindow	AI 对话区
NoteCard	笔记展示
LanguageSwitcher	全站语言切换
ConfirmDialog	操作确认弹窗
ToastArea	全局提示通知


⸻

🔧 十四、API 交互总览

功能模块	主要接口
首页内容	GET /home-feed
分类页	GET /categories, GET /categories/:slug/books
书籍详情	GET /book/:id, GET /book/:id/summaries, GET /book/:id/audio
聊天问答	POST /chat/book/:id
笔记	GET /book/:id/notes, POST /book/:id/notes
用户上传	POST /upload, GET /upload/status/:id
设置	GET/PUT /user/settings
搜索	GET /search?q=
用户登录	POST /auth/login, POST /auth/register


⸻

🚀 十五、设计要点（UI / 体验）

维度	要点
视觉基调	极简、干净、阅读感强（白底 + 渐变色点缀）
交互风格	温和、智能、陪伴感（AI语音拟人）
首页布局	模块化信息流，用户一屏能听
移动端兼容	优先适配移动端，渐进式 Web App（PWA）
语言自动识别	根据用户浏览器自动选择语言
播放无缝衔接	MiniPlayer 全局同步，跨页面不断播
AI对话体验	类似 NotebookLM，支持引用与再提问
UGC上传入口	弱化但随时可触达（书架页内按钮）


⸻

📊 十六、未来扩展页（预留）

页面	功能
/collections/[id]	专题歌单页
/author/[id]	作者介绍页
/community	社区活动与优秀用户作品展示
/premium	会员订阅与权益页
