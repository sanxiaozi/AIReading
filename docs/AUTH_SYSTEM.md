# AIreading 用户认证系统

## 概述

本文档描述了为 AIreading 项目创建的用户登录/注册系统。系统包含完整的前端UI、API路由、表单验证和多语言支持。

## 创建的文件

### 1. 多语言翻译文件

- **src/i18n/messages/en.json** - 英文翻译
- **src/i18n/messages/zh.json** - 中文翻译

包含登录和注册页面的所有文本，包括：
- 页面标题和描述
- 表单字段标签和占位符
- 错误消息
- 按钮文本
- 密码强度指示器文本

### 2. 国际化工具

- **src/lib/i18n.ts** - 国际化工具函数

提供 `useTranslations` hook 用于在组件中访问翻译文本。

```typescript
const { t } = useTranslations(locale);
const title = t('auth.login.title'); // "Welcome Back" or "欢迎回来"
```

### 3. 页面组件

#### src/app/[locale]/login/page.tsx
登录页面组件，功能包括：
- 📧 邮箱和密码输入
- ✅ 实时表单验证
- 🔒 "记住我" 选项
- 🔗 "忘记密码" 链接
- 🌐 中英文支持
- 📱 完全响应式设计

#### src/app/[locale]/register/page.tsx
注册页面组件，功能包括：
- 👤 用户名、邮箱、密码输入
- 🔐 密码确认
- 💪 实时密码强度指示器（弱/中/强）
- ✅ 完整的表单验证
- 📋 服务条款和隐私政策确认
- 🌐 中英文支持
- 📱 完全响应式设计

### 4. API 路由

#### src/app/api/auth/login/route.ts
处理用户登录：
- 验证邮箱和密码
- 检查用户是否存在和激活状态
- 生成 JWT token
- 设置 HTTP-only cookie
- 更新最后登录时间

#### src/app/api/auth/register/route.ts
处理用户注册：
- 验证输入数据（邮箱格式、密码强度）
- 检查邮箱是否已注册
- 创建新用户（密码使用 bcrypt 加密）
- 生成 JWT token
- 设置 HTTP-only cookie

#### src/app/api/auth/logout/route.ts
处理用户登出：
- 清除认证 cookie

#### src/app/api/auth/me/route.ts
获取当前登录用户信息：
- 验证 JWT token
- 返回用户数据（不含密码）

### 5. 认证工具库

- **src/lib/auth.ts** - 认证相关的工具函数

提供的函数：
- `login(input)` - 登录
- `register(input)` - 注册
- `logout()` - 登出
- `getCurrentUser()` - 获取当前用户
- `isValidEmail(email)` - 验证邮箱格式
- `validatePasswordStrength(password)` - 验证密码强度

## 设计特点

### 🎨 视觉设计

1. **深色主题**
   - 背景渐变：从 `bg-0` 到 `bg-2`
   - 卡片使用毛玻璃效果 (`backdrop-blur`)
   - 主色调：紫色 (`primary`) 和青色 (`accent`)

2. **现代UI元素**
   - 圆角设计 (rounded-2xl)
   - 光晕效果 (shadow-glow)
   - 渐变按钮
   - 平滑过渡动画

3. **响应式布局**
   - 移动端优先设计
   - 最大宽度 `max-w-md` 保持阅读舒适度
   - 适配各种屏幕尺寸

### ✅ 表单验证

#### 登录页面验证
- 邮箱格式验证（正则表达式）
- 密码不为空且至少8个字符

#### 注册页面验证
- 用户名：至少3个字符
- 邮箱：格式验证（正则表达式）
- 密码：
  - 至少8个字符
  - 必须包含大写字母、小写字母和数字
  - 实时密码强度检测（弱/中/强）
- 确认密码：必须与密码匹配
- 服务条款：必须接受

### 🔒 安全特性

1. **密码加密**
   - 使用 `bcryptjs` 加密存储
   - Salt rounds: 10

2. **JWT 认证**
   - 使用 `jose` 库生成和验证 token
   - HTTP-only cookies 防止 XSS 攻击
   - 可配置过期时间（登录时 7天，记住我 30天）

3. **密码强度要求**
   - 最少8个字符
   - 至少一个大写字母、一个小写字母、一个数字

## 使用方法

### 访问页面

```
# 登录页面
/en/login  (英文)
/zh/login  (中文)

# 注册页面
/en/register  (英文)
/zh/register  (中文)
```

### 在代码中使用认证功能

```typescript
import { login, register, logout, getCurrentUser } from '@/lib/auth';

// 登录
try {
  const { user, token } = await login({
    email: 'user@example.com',
    password: 'Password123',
    rememberMe: true,
  });
  console.log('Logged in:', user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// 注册
try {
  const { user, token } = await register({
    email: 'new@example.com',
    password: 'Password123',
    username: 'newuser',
    locale: 'en',
  });
  console.log('Registered:', user);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// 获取当前用户
const user = await getCurrentUser();
if (user) {
  console.log('Current user:', user);
}

// 登出
await logout();
```

## 配置

### 环境变量

在 `.env.local` 文件中设置：

```env
# JWT Secret (生产环境必须修改)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 数据库

系统使用现有的用户数据库模型 (`src/lib/models/user.ts`)，无需额外配置。

## 待办事项 / 未来改进

### 功能增强
- [ ] 忘记密码功能
- [ ] 邮箱验证
- [ ] 社交登录（Google、GitHub等）
- [ ] 双因素认证（2FA）
- [ ] 用户资料编辑页面

### 安全增强
- [ ] 登录失败次数限制
- [ ] CAPTCHA 验证
- [ ] 密码历史记录（防止重复使用旧密码）
- [ ] 登录通知（新设备登录提醒）

### 用户体验
- [ ] 加载动画优化
- [ ] 成功/错误消息的 Toast 通知
- [ ] 密码可见性切换按钮
- [ ] 社交登录快速入口

## 样式预览

### 颜色方案
```typescript
// 背景色
bg-0: "#070A12"    // 深蓝黑
bg-1: "#0B1020"    // 稍浅的深蓝
bg-2: "#0F1730"    // 更浅的深蓝

// 文本色
text-0: "#EAF0FF"  // 白色
text-1: "#B8C3E6"  // 浅蓝灰
text-muted: "#7D89B0"  // 灰蓝

// 主题色
primary: "#7C5CFF"     // 紫色
primary-2: "#B26BFF"   // 浅紫色
accent: "#31D7FF"      // 青色

// 状态色
success: "#2EE59D"     // 绿色
warning: "#FFCC66"     // 黄色
danger: "#FF5470"      // 红色
```

## 故障排除

### 常见问题

1. **API 路由在静态导出时不工作**
   - 解决方案：开发时使用 `npm run dev`，生产环境需要服务器支持或使用无服务器函数

2. **JWT_SECRET 未设置警告**
   - 解决方案：在 `.env.local` 中设置自定义的 JWT_SECRET

3. **多语言翻译不显示**
   - 检查：确保访问的URL包含正确的 locale 参数 (`/en/login` 或 `/zh/login`)

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI**: TailwindCSS 4
- **认证**: JWT (jose)
- **密码加密**: bcryptjs
- **数据库**: Better SQLite3
- **类型检查**: TypeScript

## 贡献者

前端开发: AI Frontend Subagent
创建时间: 2024年2月
