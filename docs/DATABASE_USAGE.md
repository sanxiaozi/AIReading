# 📚 数据库使用指南

## 快速开始

### 1. 初始化数据库

```bash
# 方法一：使用初始化脚本
node scripts/init-db.js

# 方法二：使用 SQLite 命令行
sqlite3 data/aireading.db < scripts/init-db.sql
```

### 2. 使用数据库

```typescript
import db, { initDatabase } from '@/lib/db';

// 初始化（仅在首次运行时）
initDatabase();

// 执行查询
const users = db.prepare('SELECT * FROM users').all();
```

---

## 使用示例

### 用户管理

```typescript
import {
  createUser,
  getUserByEmail,
  verifyPassword,
  updateUser,
} from '@/lib/models/user';

// 注册用户
const user = await createUser({
  email: 'user@example.com',
  password: 'secure-password',
  username: 'John Doe',
  locale: 'en',
});

// 登录验证
const user = getUserByEmail('user@example.com');
if (user && await verifyPassword(user, password)) {
  console.log('登录成功');
}

// 更新用户信息
const updated = updateUser(user.id, {
  username: 'New Name',
  theme: 'dark',
  playback_speed: 1.5,
});
```

### 收藏管理

```typescript
import {
  addFavorite,
  getUserFavorites,
  isFavorited,
  removeFavorite,
} from '@/lib/models/favorite';

// 添加收藏
const favorite = addFavorite({
  user_id: 1,
  book_id: 42,
  notes: '很喜欢这本书',
  tags: ['科幻', '经典'],
});

// 检查是否已收藏
const favorited = isFavorited(1, 42);

// 获取用户收藏列表
const favorites = getUserFavorites(1, 20, 0);

// 取消收藏
removeFavorite(1, 42);
```

### 播放历史

```typescript
import {
  getOrCreateHistory,
  updateProgress,
  getUserHistory,
  getResumeList,
  getListeningStats,
} from '@/lib/models/history';

// 开始播放（获取或创建记录）
const history = getOrCreateHistory({
  user_id: 1,
  book_id: 42,
  summary_type: 'medium',
  total_seconds: 1200,
  playback_speed: 1.0,
});

// 更新播放进度
const updated = updateProgress(1, 42, 'medium', {
  progress_seconds: 300,
  playback_speed: 1.25,
});

// 获取"继续播放"列表
const resumeList = getResumeList(1, 5);

// 获取播放统计
const stats = getListeningStats(1);
console.log(`已听书籍：${stats.total_books}`);
console.log(`完成书籍：${stats.completed_books}`);
console.log(`总听书时长：${stats.total_listening_time}秒`);
```

---

## API 路由示例

### 注册接口

```typescript
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/models/user';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();
    
    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // 检查邮箱是否已存在
    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    // 创建用户
    const user = await createUser({ email, password, username });
    
    // 返回用户信息（不包含密码）
    const { password_hash, ...userData } = user;
    
    return NextResponse.json(
      { user: userData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 登录接口

```typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword, updateLastLogin } from '@/lib/models/user';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // 查找用户
    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // 验证密码
    const isValid = await verifyPassword(user, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // 更新最后登录时间
    updateLastLogin(user.id);
    
    // 生成 JWT
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);
    
    // 返回 token 和用户信息
    const { password_hash, ...userData } = user;
    
    return NextResponse.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 收藏接口

```typescript
// src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFavorites, addFavorite, removeFavorite } from '@/lib/models/favorite';
import { verifyAuth } from '@/lib/auth';

// 获取收藏列表
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const favorites = getUserFavorites(user.id, limit, offset);
    
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 添加收藏
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { book_id, notes, tags } = await request.json();
    
    const favorite = addFavorite({
      user_id: user.id,
      book_id,
      notes,
      tags,
    });
    
    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error('Add favorite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 删除收藏
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const bookId = parseInt(searchParams.get('book_id') || '0');
    
    const success = removeFavorite(user.id, bookId);
    
    if (!success) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete favorite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 数据库维护

### 定期清理

```typescript
import { cleanExpiredSessions } from '@/lib/db';

// 每小时清理一次过期会话
setInterval(() => {
  cleanExpiredSessions();
}, 60 * 60 * 1000);
```

### 备份

```bash
# 手动备份
sqlite3 data/aireading.db ".backup data/backup-$(date +%Y%m%d).db"

# 定时备份（添加到 crontab）
0 2 * * * sqlite3 /path/to/data/aireading.db ".backup /path/to/backups/aireading-$(date +\%Y\%m\%d).db"
```

### 性能优化

```typescript
import { optimizeDatabase } from '@/lib/db';

// 定期优化（每周一次）
optimizeDatabase();
```

---

## 故障排查

### 常见问题

**问题 1: 外键约束错误**
```sql
-- 检查外键约束是否开启
PRAGMA foreign_keys;

-- 开启外键约束
PRAGMA foreign_keys = ON;
```

**问题 2: 数据库锁定**
```typescript
// 使用事务批量操作
const insertMany = db.transaction((records) => {
  const insert = db.prepare('INSERT INTO favorites ...');
  for (const record of records) {
    insert.run(record);
  }
});
```

**问题 3: 查询慢**
```sql
-- 分析查询计划
EXPLAIN QUERY PLAN SELECT * FROM listening_history WHERE user_id = 1;

-- 更新统计信息
ANALYZE;

-- 重建索引
REINDEX;
```

---

## 最佳实践

### 1. 使用参数化查询
```typescript
// ❌ 危险
const user = db.prepare(`SELECT * FROM users WHERE email = '${email}'`).get();

// ✅ 安全
const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
```

### 2. 使用事务
```typescript
// 批量操作使用事务
const insertMany = db.transaction((records) => {
  const stmt = db.prepare('INSERT INTO ...');
  for (const record of records) {
    stmt.run(record);
  }
});
```

### 3. 错误处理
```typescript
try {
  const user = createUser({ email, password });
} catch (error) {
  if (error.code === 'SQLITE_CONSTRAINT') {
    console.error('Unique constraint violation');
  } else {
    console.error('Database error:', error);
  }
}
```

### 4. 数据验证
```typescript
// 在插入前验证数据
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (!validateEmail(email)) {
  throw new Error('Invalid email format');
}
```

---

## 参考资料

- [SQLite 官方文档](https://sqlite.org/docs.html)
- [better-sqlite3 文档](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- [数据库 Schema 设计](./DATABASE_SCHEMA.md)
