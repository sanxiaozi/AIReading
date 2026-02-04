# 🎨 设计系统 - AiReading

## 🎨 设计师产出物 | Day 1

---

## 品牌定位

### 品牌关键词
**智慧 · 温暖 · 高效 · 优雅**

### 品牌调性
- 专业但不冰冷
- 知识感但不学究
- 现代感但有温度
- 简洁但不简单

---

## 色彩系统

### 主色 (Primary)
```css
--amber-50:  #fffbeb;
--amber-100: #fef3c7;
--amber-200: #fde68a;
--amber-300: #fcd34d;
--amber-400: #fbbf24;
--amber-500: #f59e0b;  /* 主色 */
--amber-600: #d97706;
--amber-700: #b45309;
--amber-800: #92400e;
--amber-900: #78350f;
```

### 强调色 (Accent)
```css
--orange-400: #fb923c;
--orange-500: #f97316;  /* 强调色 */
--orange-600: #ea580c;
```

### 中性色 (Neutral)
```css
--gray-50:  #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;  /* 次要文字 */
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;  /* 卡片背景 */
--gray-900: #111827;  /* 深色背景 */
--gray-950: #030712;
```

### 语义色 (Semantic)
```css
--success: #22c55e;  /* 成功/完成 */
--warning: #eab308;  /* 警告 */
--error:   #ef4444;  /* 错误 */
--info:    #3b82f6;  /* 信息 */
```

---

## 字体规范

### 字体家族
```css
/* 英文字体 */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* 中文字体 */
font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;

/* 代码字体 */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### 字体大小
| 名称 | 大小 | 行高 | 用途 |
|------|------|------|------|
| display | 48px | 1.1 | 大标题 |
| h1 | 36px | 1.2 | 页面标题 |
| h2 | 24px | 1.3 | 区块标题 |
| h3 | 20px | 1.4 | 卡片标题 |
| body | 16px | 1.6 | 正文 |
| small | 14px | 1.5 | 辅助文字 |
| caption | 12px | 1.4 | 标签/说明 |

### 字重
```css
--font-normal:   400;  /* 正文 */
--font-medium:   500;  /* 强调 */
--font-semibold: 600;  /* 小标题 */
--font-bold:     700;  /* 大标题 */
```

---

## 间距系统

### 基准单位: 4px

| 名称 | 值 | 用途 |
|------|-----|------|
| xs | 4px | 最小间距 |
| sm | 8px | 紧凑间距 |
| md | 16px | 默认间距 |
| lg | 24px | 宽松间距 |
| xl | 32px | 区块间距 |
| 2xl | 48px | 大区块间距 |
| 3xl | 64px | 页面间距 |

---

## 圆角规范

| 名称 | 值 | 用途 |
|------|-----|------|
| sm | 4px | 小按钮/标签 |
| md | 8px | 输入框/卡片 |
| lg | 12px | 大卡片 |
| xl | 16px | 弹窗 |
| 2xl | 24px | 特大卡片 |
| full | 9999px | 圆形/胶囊 |

---

## 阴影系统

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## 组件规范

### 按钮 (Button)

**主要按钮**
```css
.btn-primary {
  background: linear-gradient(to right, var(--amber-500), var(--orange-500));
  color: black;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
}
```

**次要按钮**
```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 12px;
}
```

### 输入框 (Input)
```css
.input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
}

.input:focus {
  border-color: var(--amber-500);
  outline: none;
}
```

### 卡片 (Card)
```css
.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
}

.card:hover {
  border-color: rgba(245, 158, 11, 0.3);
}
```

---

## 响应式断点

| 断点 | 宽度 | 设备 |
|------|------|------|
| sm | 640px | 手机横屏 |
| md | 768px | 平板竖屏 |
| lg | 1024px | 平板横屏 |
| xl | 1280px | 笔记本 |
| 2xl | 1536px | 台式机 |

---

## 动画规范

### 过渡时间
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

### 缓动函数
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

---

## 图标规范

- 图标库: Lucide Icons
- 默认大小: 20px
- 描边宽度: 2px
- 颜色: currentColor

---

## 竞品分析

| 竞品 | 优点 | 可借鉴 |
|------|------|--------|
| Blinkist | 播放器体验好 | 迷你播放器设计 |
| 得到 | 中文排版优秀 | 阅读体验 |
| Audible | 功能全面 | 章节导航 |
| 微信读书 | 社交分享 | 分享海报 |

---

*文档版本: v1.0*
*创建日期: 2026-01-28*
*负责人: UI/UX设计师*
