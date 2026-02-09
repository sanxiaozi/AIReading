# 📋 API 测试文档 - 用户认证系统

> **测试日期**: 2026-02-05  
> **API 版本**: v1.0  
> **基础 URL**: `http://localhost:3000/api`

---

## 目录

1. [准备工作](#准备工作)
2. [用户注册 API](#1-用户注册-api)
3. [用户登录 API](#2-用户登录-api)
4. [获取用户信息 API](#3-获取用户信息-api)
5. [更新用户信息 API](#4-更新用户信息-api)
6. [测试场景](#测试场景)
7. [错误代码参考](#错误代码参考)

---

## 准备工作

### 1. 启动开发服务器

```bash
# 安装依赖
npm install

# 初始化数据库（如果还没有）
npm run db:init

# 启动开发服务器
npm run dev
```

服务器默认运行在 `http://localhost:3000`

### 2. 环境变量配置

确保 `.env` 文件包含以下配置：

```env
DATABASE_PATH=./data/aireading.db
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

### 3. 测试工具

推荐使用以下工具之一：
- **curl** - 命令行工具（本文档使用）
- **Postman** - 图形界面工具
- **Insomnia** - 图形界面工具
- **HTTPie** - 命令行工具（更友好）

---

## 1. 用户注册 API

### 接口信息

- **路径**: `POST /api/auth/register`
- **认证**: 不需要
- **描述**: 创建新用户账户

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | string | 是 | 用户邮箱（唯一） |
| `password` | string | 是 | 密码（至少8字符，包含大小写字母和数字） |
| `username` | string | 否 | 用户名 |

### 测试用例

#### ✅ 成功注册

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "username": "Test User"
  }'
```

**预期响应** (201 Created):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "Test User",
    "avatar_url": null,
    "locale": "en",
    "theme": "light",
    "playback_speed": 1.0,
    "subscription_tier": "free",
    "subscription_expires_at": null,
    "is_active": 1,
    "created_at": 1738569600,
    "updated_at": 1738569600,
    "last_login_at": null
  }
}
```

#### ❌ 邮箱已存在

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**预期响应** (409 Conflict):
```json
{
  "error": "Email already registered",
  "code": "EMAIL_EXISTS"
}
```

#### ❌ 邮箱格式错误

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "Test1234"
  }'
```

**预期响应** (400 Bad Request):
```json
{
  "error": "Invalid email format",
  "code": "INVALID_EMAIL"
}
```

#### ❌ 密码强度不足

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "weak@example.com",
    "password": "123"
  }'
```

**预期响应** (400 Bad Request):
```json
{
  "error": "Password must be at least 8 characters long",
  "code": "WEAK_PASSWORD"
}
```

#### ❌ 缺少必填字段

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**预期响应** (400 Bad Request):
```json
{
  "error": "Email and password are required",
  "code": "MISSING_FIELDS"
}
```

---

## 2. 用户登录 API

### 接口信息

- **路径**: `POST /api/auth/login`
- **认证**: 不需要
- **描述**: 用户登录，获取 JWT token

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | string | 是 | 用户邮箱 |
| `password` | string | 是 | 密码 |

### 测试用例

#### ✅ 成功登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**预期响应** (200 OK):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "Test User",
    "locale": "en",
    "theme": "light",
    "playback_speed": 1.0,
    "subscription_tier": "free",
    "is_active": 1,
    "created_at": 1738569600,
    "updated_at": 1738569600,
    "last_login_at": 1738656000
  }
}
```

#### ❌ 邮箱或密码错误

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }'
```

**预期响应** (401 Unauthorized):
```json
{
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

#### ❌ 用户不存在

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "Test1234"
  }'
```

**预期响应** (401 Unauthorized):
```json
{
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

#### ❌ 账户已停用

```bash
# 首先停用账户（需要直接操作数据库或管理员 API）
# 然后尝试登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "deactivated@example.com",
    "password": "Test1234"
  }'
```

**预期响应** (403 Forbidden):
```json
{
  "error": "Account is deactivated",
  "code": "ACCOUNT_DEACTIVATED"
}
```

---

## 3. 获取用户信息 API

### 接口信息

- **路径**: `GET /api/user/profile`
- **认证**: 需要（Bearer Token）
- **描述**: 获取当前登录用户的信息

### 请求头

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `Authorization` | string | 是 | Bearer {token} |

### 测试用例

#### ✅ 成功获取用户信息

```bash
# 先登录获取 token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' \
  | jq -r '.token')

# 使用 token 获取用户信息
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

**预期响应** (200 OK):
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "Test User",
    "avatar_url": null,
    "locale": "en",
    "theme": "light",
    "playback_speed": 1.0,
    "subscription_tier": "free",
    "subscription_expires_at": null,
    "is_active": 1,
    "created_at": 1738569600,
    "updated_at": 1738569600,
    "last_login_at": 1738656000
  }
}
```

#### ❌ 未提供 Token

```bash
curl -X GET http://localhost:3000/api/user/profile
```

**预期响应** (401 Unauthorized):
```json
{
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

#### ❌ Token 无效或过期

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer invalid.token.here"
```

**预期响应** (401 Unauthorized):
```json
{
  "error": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

---

## 4. 更新用户信息 API

### 接口信息

- **路径**: `PUT /api/user/profile`
- **认证**: 需要（Bearer Token）
- **描述**: 更新当前登录用户的信息

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 否 | 用户名 |
| `avatar_url` | string | 否 | 头像URL |
| `locale` | string | 否 | 语言偏好（en, zh, es等） |
| `theme` | string | 否 | 主题（light, dark, auto） |
| `playback_speed` | number | 否 | 播放速度（0.5-2.0） |

### 测试用例

#### ✅ 成功更新用户信息

```bash
# 先登录获取 token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' \
  | jq -r '.token')

# 更新用户信息
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Updated Name",
    "locale": "zh",
    "theme": "dark",
    "playback_speed": 1.5
  }'
```

**预期响应** (200 OK):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "Updated Name",
    "avatar_url": null,
    "locale": "zh",
    "theme": "dark",
    "playback_speed": 1.5,
    "subscription_tier": "free",
    "subscription_expires_at": null,
    "is_active": 1,
    "created_at": 1738569600,
    "updated_at": 1738656100,
    "last_login_at": 1738656000
  }
}
```

#### ❌ 播放速度超出范围

```bash
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "playback_speed": 3.0
  }'
```

**预期响应** (400 Bad Request):
```json
{
  "error": "Playback speed must be between 0.5 and 2.0",
  "code": "INVALID_SPEED"
}
```

#### ❌ 无效的主题值

```bash
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "rainbow"
  }'
```

**预期响应** (400 Bad Request):
```json
{
  "error": "Theme must be one of: light, dark, auto",
  "code": "INVALID_THEME"
}
```

---

## 测试场景

### 完整用户流程测试

以下是一个完整的用户注册、登录、获取信息、更新信息的测试脚本：

```bash
#!/bin/bash

echo "=== AIreading 用户认证系统测试 ==="
echo

# 1. 注册新用户
echo "1. 注册新用户..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123",
    "username": "New User"
  }')
echo $REGISTER_RESPONSE | jq .
REGISTER_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
echo "✅ 注册成功，Token: ${REGISTER_TOKEN:0:50}..."
echo

# 2. 登录用户
echo "2. 登录用户..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123"
  }')
echo $LOGIN_RESPONSE | jq .
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "✅ 登录成功，Token: ${TOKEN:0:50}..."
echo

# 3. 获取用户信息
echo "3. 获取用户信息..."
PROFILE_RESPONSE=$(curl -s -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN")
echo $PROFILE_RESPONSE | jq .
echo "✅ 成功获取用户信息"
echo

# 4. 更新用户信息
echo "4. 更新用户信息..."
UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Updated User",
    "locale": "zh",
    "theme": "dark",
    "playback_speed": 1.5
  }')
echo $UPDATE_RESPONSE | jq .
echo "✅ 成功更新用户信息"
echo

# 5. 再次获取用户信息（验证更新）
echo "5. 验证更新后的用户信息..."
VERIFY_RESPONSE=$(curl -s -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN")
echo $VERIFY_RESPONSE | jq .
echo "✅ 验证成功"
echo

echo "=== 测试完成 ==="
```

保存为 `test-auth.sh`，然后运行：

```bash
chmod +x test-auth.sh
./test-auth.sh
```

### Postman 测试集合

如果使用 Postman，可以导入以下集合：

```json
{
  "info": {
    "name": "AIreading Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"{{email}}\",\n  \"password\": \"{{password}}\",\n  \"username\": \"Test User\"\n}"
        },
        "url": "{{base_url}}/api/auth/register"
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"{{email}}\",\n  \"password\": \"{{password}}\"\n}"
        },
        "url": "{{base_url}}/api/auth/login"
      }
    },
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": "{{base_url}}/api/user/profile"
      }
    },
    {
      "name": "Update Profile",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"Updated Name\",\n  \"locale\": \"zh\",\n  \"theme\": \"dark\",\n  \"playback_speed\": 1.5\n}"
        },
        "url": "{{base_url}}/api/user/profile"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    },
    {
      "key": "email",
      "value": "test@example.com"
    },
    {
      "key": "password",
      "value": "Test1234"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## 错误代码参考

### 客户端错误 (4xx)

| 错误码 | HTTP状态 | 说明 | 解决方法 |
|--------|---------|------|----------|
| `MISSING_FIELDS` | 400 | 缺少必填字段 | 检查请求参数 |
| `INVALID_EMAIL` | 400 | 邮箱格式错误 | 使用有效的邮箱格式 |
| `WEAK_PASSWORD` | 400 | 密码强度不足 | 使用至少8字符，包含大小写字母和数字 |
| `INVALID_SPEED` | 400 | 播放速度超出范围 | 使用 0.5-2.0 之间的值 |
| `INVALID_THEME` | 400 | 无效的主题值 | 使用 light、dark 或 auto |
| `AUTH_REQUIRED` | 401 | 需要认证 | 提供有效的 Bearer Token |
| `INVALID_TOKEN` | 401 | Token无效或过期 | 重新登录获取新 Token |
| `INVALID_CREDENTIALS` | 401 | 邮箱或密码错误 | 检查登录凭证 |
| `ACCOUNT_DEACTIVATED` | 403 | 账户已停用 | 联系管理员 |
| `EMAIL_EXISTS` | 409 | 邮箱已被注册 | 使用其他邮箱或尝试登录 |
| `METHOD_NOT_ALLOWED` | 405 | 不允许的HTTP方法 | 使用正确的HTTP方法 |

### 服务器错误 (5xx)

| 错误码 | HTTP状态 | 说明 | 解决方法 |
|--------|---------|------|----------|
| `SERVER_ERROR` | 500 | 服务器内部错误 | 检查服务器日志，联系开发团队 |
| `FETCH_ERROR` | 500 | 获取数据失败 | 重试请求，检查数据库连接 |
| `UPDATE_ERROR` | 500 | 更新数据失败 | 重试请求，检查数据库连接 |

---

## 性能测试

### 基准测试

使用 `ab` (Apache Bench) 进行简单的性能测试：

```bash
# 登录 API 性能测试
ab -n 100 -c 10 -p login.json -T application/json \
  http://localhost:3000/api/auth/login
```

其中 `login.json`:
```json
{"email":"test@example.com","password":"Test1234"}
```

### 预期性能指标

- **注册 API**: ~50ms (包含 bcrypt hashing)
- **登录 API**: ~50ms (包含 bcrypt 验证)
- **获取用户信息**: ~5ms
- **更新用户信息**: ~10ms

---

## 安全测试

### 1. SQL 注入测试

```bash
# 尝试 SQL 注入（应该失败）
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com OR 1=1--",
    "password": "anything"
  }'
```

**预期**: 返回 401 错误，不应该成功登录

### 2. XSS 测试

```bash
# 尝试 XSS 攻击（应该被清理）
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "<script>alert(\"XSS\")</script>"
  }'
```

**预期**: 字符串应该被正确存储和返回（不执行脚本）

### 3. Token 过期测试

```bash
# 等待 token 过期（7天后），或使用过期的 token
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer expired.token.here"
```

**预期**: 返回 401 错误

---

## 故障排查

### 问题：无法连接到服务器

**检查**:
```bash
# 检查服务是否运行
curl http://localhost:3000/api/health

# 检查端口占用
lsof -i :3000
```

### 问题：数据库错误

**检查**:
```bash
# 检查数据库文件
ls -l data/aireading.db

# 查看数据库日志
tail -f logs/database.log
```

### 问题：Token 验证失败

**检查**:
1. 确认 JWT_SECRET 环境变量正确设置
2. 检查 token 格式是否正确（Bearer {token}）
3. 确认 token 未过期

---

## 附录

### 密码强度要求

- ✅ 至少 8 个字符
- ✅ 至少 1 个小写字母 (a-z)
- ✅ 至少 1 个大写字母 (A-Z)
- ✅ 至少 1 个数字 (0-9)

### 有效密码示例

- ✅ `Password123`
- ✅ `SecurePass1`
- ✅ `MyP@ssw0rd`
- ❌ `password` (无大写和数字)
- ❌ `12345678` (无字母)
- ❌ `Pass1` (太短)

### JWT Token 结构

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ← Header
.
eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdC...  ← Payload
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_... ← Signature
```

解码 payload:
```json
{
  "userId": 1,
  "email": "test@example.com",
  "iat": 1738569600,
  "exp": 1739174400
}
```

---

**文档版本**: v1.0  
**最后更新**: 2026-02-05  
**维护者**: 后端开发团队
