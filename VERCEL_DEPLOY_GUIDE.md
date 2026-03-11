# Vercel 部署指南 - 更新音频到 aireading.com

## 📊 当前状态

### ✅ 已完成
- [x] 音频文件已添加到 Git 仓库
  - ID 3: Sapiens (人类简史) - 2 个文件
  - ID 29: Elon Musk - 2 个文件
- [x] 已推送到 GitHub: `git@github.com:sanxiaozi/AIReading.git`
- [x] 最新 commit: `773edd6` (2026-02-09 06:32:52)

### ⏳ 待完成
- [ ] Vercel 部署更新到 aireading.com

---

## 🔧 方案 1: 通过 Vercel Dashboard（推荐）

### 步骤 1: 登录 Vercel
访问: https://vercel.com/dashboard

### 步骤 2: 找到项目
项目名称: **aireading**  
Project ID: `prj_92f9IoAe97bLaBObyIYz5xOMxIYc`

### 步骤 3: 触发重新部署
有两种方式：

#### 方式 A: 自动部署（如果已配置 GitHub 集成）
Vercel 应该会自动检测到 GitHub 的 push 并开始部署。

检查部署状态：
- 进入项目 → Deployments 标签
- 查看是否有最新的部署正在进行
- 如果没有，点击 "Redeploy" 按钮

#### 方式 B: 手动触发
1. 进入项目页面
2. 点击右上角 "..." 菜单
3. 选择 "Redeploy"
4. 确认重新部署

### 步骤 4: 等待部署完成
- 部署时间: 约 2-5 分钟
- 完成后会显示 "Ready" 状态

### 步骤 5: 验证
访问以下 URL 确认音频可用：
- https://aireading.com/audio/3/zh_short.mp3
- https://aireading.com/audio/29/zh_short.mp3

---

## 🔧 方案 2: 通过 CLI 部署（需要 Token）

### 前置条件
需要 Vercel API Token。获取方式：
1. 访问 https://vercel.com/account/tokens
2. 创建新 token（选择合适的权限）
3. 保存 token（只显示一次）

### 使用 Token 部署

#### 选项 A: 设置环境变量
```bash
export VERCEL_TOKEN="your_token_here"
cd /Users/arcade/aireading
vercel --prod
```

#### 选项 B: 直接使用 --token 参数
```bash
cd /Users/arcade/aireading
vercel --prod --token="your_token_here"
```

#### 选项 C: 保存到配置（一次性设置）
```bash
vercel login
# 或
echo '{"token":"your_token_here"}' > ~/.vercel/auth.json
```

然后部署：
```bash
cd /Users/arcade/aireading
vercel --prod
```

---

## 🔧 方案 3: 配置 GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'public/audio/**'
      - 'src/**'
      - 'package.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

需要在 GitHub 仓库设置 Secrets：
- `VERCEL_TOKEN`: 从 Vercel 获取
- `ORG_ID`: team_9zTxolFgW6gTLr0e8AFqOY7X
- `PROJECT_ID`: prj_92f9IoAe97bLaBObyIYz5xOMxIYc

---

## ⚠️ 注意事项

### 大文件问题
当前音频文件夹大小: **308 MB**

如果 Vercel 部署失败，可能是因为：
1. **文件大小限制**: Vercel 免费版有限制
2. **构建时间限制**: 上传大文件可能超时

### 解决方案

#### 选项 1: 使用 CDN 托管音频
将音频文件上传到：
- Cloudflare R2
- AWS S3
- Aliyun OSS

然后在代码中引用 CDN URL。

#### 选项 2: 使用 Git LFS
```bash
# 安装 Git LFS
git lfs install

# 追踪 mp3 文件
git lfs track "*.mp3"

# 提交 .gitattributes
git add .gitattributes
git commit -m "Add Git LFS tracking for mp3 files"

# 推送 LFS 文件
git lfs push --all origin main
```

#### 选项 3: 分离音频服务器
保持当前架构：
- **aireading.com**: 主站点（Vercel）
- **trading.aireading.com**: 音频服务器（本地 + Cloudflare Tunnel）

在主站点中配置音频 URL 指向 trading.aireading.com。

---

## 📝 当前推荐方案

基于现状，我建议：

### 短期方案（立即可用）
**使用 trading.aireading.com 作为音频 CDN**

1. 保持音频文件在本地服务器
2. 修改主站点代码，音频 URL 指向 trading.aireading.com
3. 这样主站部署时不需要包含大文件

修改示例：
```javascript
// 之前
const audioUrl = `/audio/${bookId}/zh_short.mp3`;

// 修改为
const audioUrl = `https://trading.aireading.com/audio/${bookId}/zh_short.mp3`;
```

### 长期方案（可选）
1. 使用专业 CDN（如 Cloudflare R2）托管音频
2. 或者升级 Vercel 套餐以支持更大文件
3. 配置 GitHub Actions 自动部署

---

## 🚀 快速执行（推荐）

如果你现在就想更新 aireading.com：

### 方式 1: Vercel Dashboard 重新部署（最简单）
1. 访问 https://vercel.com/dashboard
2. 找到 aireading 项目
3. 点击 "Redeploy" 按钮
4. 等待 2-5 分钟
5. 测试 https://aireading.com/audio/29/zh_short.mp3

### 方式 2: 告诉我你的 Vercel Token
```bash
# 我可以运行
vercel --prod --token="your_token"
```

### 方式 3: 使用分离架构（0 配置）
修改前端代码指向 trading.aireading.com，无需重新部署大文件。

---

**需要我执行哪个方案？** 🤔
