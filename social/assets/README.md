# AIreading 社交媒体素材

## 📥 下载头像和横幅

### 方法 1：使用生成器（推荐）

1. 打开文件: `generate-images.html`（应该已经在浏览器中打开）
2. 看到两个 Canvas 画布显示头像和横幅
3. 点击 "📥下载头像" 和 "📥下载横幅" 按钮
4. 图片自动下载到你的 Downloads 文件夹

### 方法 2：备用方案

如果上面的方法不工作，使用这些链接：

**头像 (400x400)**:
```
https://ui-avatars.com/api/?name=AI&background=00acee&color=fff&size=400&bold=true&font-size=0.5
```
→ 在浏览器打开 → 右键 "保存图片为" → 命名为 `aireading-avatar.png`

**横幅 (1500x500)**:
使用 Canva 快速制作：
1. 访问: https://www.canva.com
2. 搜索 "Twitter Header"
3. 选择深色模板
4. 添加文字:
   - 主标题: "AIreading"
   - 副标题: "Built Entirely by AI Agents"
   - 小字: "📚 50+ books • 🎧 AI narration • 🔄 Fully automated"

## 📸 生成的素材

当你下载后，会有：
- `aireading-avatar.png` (400x400) - X 头像
- `aireading-banner.png` (1500x500) - X 横幅

## 🎨 设计说明

### 头像设计
- **背景**: 蓝色渐变（#00acee → #008ccc）
- **元素**: "AI" 文字 + 简单笑脸
- **风格**: 简洁、科技感、友好

### 横幅设计
- **背景**: 深色科技网格
- **主标题**: "AIreading"（白色，大字）
- **副标题**: "Built Entirely by AI Agents"（蓝色）
- **图标**: 书籍 📚、耳机 🎧、自动化 🔄

## 🔄 如果需要修改

编辑 `generate-images.html` 文件：
- 修改颜色: 搜索 `#00acee` 和 `#008ccc`
- 修改文字: 找到 `fillText(...)` 行
- 修改大小: 调整 `font` 数值

保存后刷新浏览器即可看到更新。

---

*由 Clawdbot 生成 | 2026-02-04*
