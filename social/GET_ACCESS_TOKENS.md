# 获取 Access Token 和 Secret

## ⚠️ 还缺少的密钥

你提供的密钥中，我们还需要：
- **Access Token**
- **Access Token Secret**

这两个是用来代表你的账号发推文的。

---

## 📋 如何获取

### 步骤 1：访问开发者门户
1. 访问：https://developer.twitter.com/en/portal/dashboard
2. 登录你的账号

### 步骤 2：进入你的 App
1. 点击左侧菜单 "Projects & Apps"
2. 找到你刚创建的 App（应该叫 "AIreading Bot" 或类似名称）
3. 点击 App 名称进入详情

### 步骤 3：生成 Access Token
1. 在 App 详情页，找到 **"Keys and tokens"** 选项卡
2. 滚动到 **"Access Token and Secret"** 部分
3. 点击 **"Generate"** 按钮
4. **重要**：立即复制保存，窗口关闭后无法再查看！

你会看到：
```
Access Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Access Token Secret: yyyyyyyyyyyyyyyyyyyyyyyyy
```

### 步骤 4：设置权限
⚠️ **重要**：确保 App 权限设置正确

1. 在同一页面，找到 **"App permissions"**
2. 确保设置为：**"Read and Write"** 或 **"Read, Write, and Direct Messages"**
3. 如果不是，点击 "Edit" 修改
4. 修改后需要**重新生成** Access Token

---

## 🔐 目前的密钥状态

已有：
- ✅ API Key (Consumer Key): `esQwoahqLoEaMWn9Ir8T0zIZS`
- ✅ API Secret (Consumer Secret): `glgiFQdpjS7MGNnv3HpynhUd1q9UiYWUSpmMPGONtfBTlUyLsk`
- ✅ Bearer Token: `AAAAAAA...`
- ✅ Client ID: `ZUJzUENfOVNfRmV6RXRIb2VaQWQ6MTpjaQ`
- ✅ Client Secret: `ISuXSE51S-7PryAw5yeyHya6c1Ap-q-mOEFGqmHZQaqeBBq-5o`

还需要：
- ❌ Access Token
- ❌ Access Token Secret

---

## 📸 截图参考

在 Developer Portal 中，你会看到这样的界面：

```
Keys and tokens
├── Consumer Keys (已有)
│   ├── API Key
│   └── API Key Secret
│
├── Authentication Tokens (已有)
│   └── Bearer Token
│
└── Access Token and Secret (需要生成) ⬅️ 这里！
    ├── Access Token          [Generate]
    └── Access Token Secret
```

---

## ⚡ 快速步骤

1. https://developer.twitter.com/en/portal/dashboard
2. Projects & Apps → 你的 App
3. Keys and tokens 选项卡
4. 滚动到 "Access Token and Secret"
5. 点击 "Generate"
6. **立即复制** Access Token 和 Access Token Secret
7. 发给我

---

完成后，把两个新密钥发给我，格式：
```
Access Token: xxxxxx
Access Token Secret: yyyyyy
```

我就可以立即测试发推文了！🚀
