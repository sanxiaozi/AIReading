# AIreading 音频生成执行计划

**创建时间**: 2025-02-05  
**状态**: 待执行  
**预计完成时间**: 按阶段分批进行

---

## 📋 执行概要

根据 `AUDIO_STATUS_REPORT.md` 统计：
- **缺失书籍**: 29本
- **缺失音频文件**: 174个 (29本 × 6个音频文件/本)
- **API配置**: ✅ FISH_API_KEY 已配置
- **内容准备**: ✅ 所有书籍的 zh.json 和 en.json 已就绪

---

## 🎯 优先级分级

### 阶段一：P1 高优先级（4本，24个文件）⭐
这些是用户最关注的核心书籍，建议优先完成：

| ID | 书名 | 英文名 | 作者 | 分类 | 文件数 |
|----|------|--------|------|------|--------|
| 3 | **人类简史** | Sapiens | Yuval Noah Harari | 历史 | 6 |
| 4 | **刻意练习** | Peak | Anders Ericsson | 心理学 | 6 |
| 5 | **影响力** | Influence | Robert Cialdini | 心理学 | 6 |
| 48 | **原子习惯** | Atomic Habits | James Clear | 个人成长 | 6 |

**预计成本**: 约 24 个 API 调用
**预计耗时**: 2-3 小时（含质量检查）

### 阶段二：P2 中优先级（17本，102个文件）
这些书籍具有较高的用户价值和影响力：

**商业管理类**（4本）:
- ID 6: 高效能人士的七个习惯 (Stephen Covey)
- ID 7: 穷查理宝典 (Charlie Munger)
- ID 47: 深度工作 (Cal Newport)
- ID 49: 纳瓦尔宝典 (Eric Jorgenson)

**心理学类**（3本）:
- ID 8: 自控力 (Kelly McGonigal)
- ID 9: 非暴力沟通 (Marshall Rosenberg)

**科学类**（2本）:
- ID 32: 自私的基因 (Richard Dawkins)
- ID 33: 时间简史 (Stephen Hawking)

**传记类**（2本）:
- ID 29: 埃隆·马斯克传 (Walter Isaacson)
- ID 30: 鞋狗 (Phil Knight)

**文学小说类**（4本）:
- ID 37: 小王子 (Antoine de Saint-Exupéry)
- ID 38: 追风筝的人 (Khaled Hosseini)
- ID 39: 百年孤独 (Gabriel García Márquez)
- ID 40: 1984 (George Orwell)

**个人成长类**（2本）:
- ID 44: 如何阅读一本书 (Morterta J. Adler)
- ID 50: 认知觉醒 (周岭)

**预计成本**: 约 102 个 API 调用
**预计耗时**: 8-10 小时

### 阶段三：P3 标准优先级（8本，48个文件）
可在资源允许时完成的书籍：

- ID 31: 基因传 (科学)
- ID 34: 上帝掷骰子吗 (科学)
- ID 35: 失控 (科学)
- ID 36: 奇点临近 (科学)
- ID 41: 动物农场 (文学)
- ID 42: 了不起的盖茨比 (文学)
- ID 43: 月亮与六便士 (文学)
- ID 45: 学会提问 (个人成长)
- ID 46: 金字塔原理 (商业管理)

**预计成本**: 约 48 个 API 调用
**预计耗时**: 4-5 小时

---

## 🛠️ 技术实施方案

### 1. TTS 脚本开发（必需）

**文件位置**: `scripts/generate-audio.js`

**核心功能**:
```javascript
// 基本结构
const FishAudio = require('@fishaudiopro/api'); // 或使用HTTP请求
const fs = require('fs');
const path = require('path');

// 配置
const FISH_API_KEY = process.env.FISH_API_KEY;
const OUTPUT_DIR = './public/audio';

// 主要函数
async function generateAudio(bookId, language, version) {
  // 1. 读取内容: content/books/{bookId}/{language}.json
  // 2. 根据version提取对应文本 (summary_short/medium/long)
  // 3. 清理HTML标签（如果是medium/long版本）
  // 4. 调用Fish Audio API生成语音
  // 5. 保存到: public/audio/{bookId}/{language}_{version}.mp3
  // 6. 返回生成结果（成功/失败，文件大小，时长等）
}

// 批量生成
async function batchGenerate(bookIds, options = {}) {
  // 支持并发控制、错误重试、进度显示
}
```

**Fish Audio API 调用示例**:
```javascript
// 参考 Fish Audio 官方文档
// 可能的API端点: https://api.fish.audio/v1/tts
const response = await fetch('https://api.fish.audio/v1/tts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${FISH_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: cleanedText,
    language: language === 'zh' ? 'zh-CN' : 'en-US',
    voice: 'default', // 可配置不同音色
    speed: 1.0,
    // 其他参数...
  })
});
```

### 2. 内容处理逻辑

**版本映射**:
```javascript
const VERSION_MAPPING = {
  'short': 'summary_short',   // 3-5分钟
  'medium': 'summary_medium', // 8-12分钟
  'long': 'summary_long'      // 15-25分钟
};
```

**文本清理**:
```javascript
function cleanText(text) {
  // 去除HTML标签
  let cleaned = text.replace(/<[^>]*>/g, '');
  // 处理特殊字符
  cleaned = cleaned.replace(/&[^;]+;/g, ' ');
  // 规范化空白字符
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}
```

### 3. 文件组织结构

```
public/audio/
├── 3/
│   ├── zh_short.mp3
│   ├── zh_medium.mp3
│   ├── zh_long.mp3
│   ├── en_short.mp3
│   ├── en_medium.mp3
│   └── en_long.mp3
├── 4/
│   └── ...
└── ...
```

### 4. 质量控制检查点

每个音频文件生成后验证：
- ✅ 文件是否成功创建
- ✅ 文件大小 > 0 KB
- ✅ 音频时长是否符合预期范围
  - short: 2-6 分钟
  - medium: 6-15 分钟
  - long: 12-30 分钟
- ✅ 音频格式是否正确（MP3）
- ✅ 是否可以正常播放

### 5. 错误处理与日志

```javascript
// 创建详细的执行日志
const logger = {
  success: [],
  failed: [],
  skipped: [],
  
  log(type, bookId, version, message) {
    const entry = {
      timestamp: new Date().toISOString(),
      bookId,
      version,
      message
    };
    this[type].push(entry);
  },
  
  exportReport() {
    // 生成 markdown 格式的执行报告
    return `# 音频生成执行报告\n\n` +
           `成功: ${this.success.length}\n` +
           `失败: ${this.failed.length}\n` +
           `跳过: ${this.skipped.length}\n\n` +
           `## 详细信息\n...`;
  }
};
```

---

## 📅 执行时间表

### Week 1: 准备与P1执行
- **Day 1-2**: 
  - 开发 `generate-audio.js` 脚本
  - 配置 Fish Audio API 连接
  - 单元测试（选择1本书测试）
  
- **Day 3-4**: 
  - 执行阶段一：4本P1书籍（24个文件）
  - 质量检查与修正
  - 生成执行报告

### Week 2: P2 高价值书籍（第一批）
- **Day 5-8**: 
  - 执行阶段二的前8本书（48个文件）
  - 每完成一批进行质量检查

### Week 3: P2 剩余 + P3
- **Day 9-12**: 
  - 完成阶段二剩余9本书（54个文件）
  
- **Day 13-15**: 
  - 执行阶段三：8本P3书籍（48个文件）
  - 最终验证与报告

---

## 💰 成本估算

### Fish Audio API 定价（需确认最新价格）
假设每个音频文件平均成本（基于字符数）：
- Short (500-1000字): ~¥0.5-1
- Medium (1500-3000字): ~¥1.5-3
- Long (3000-6000字): ~¥3-6

**总预估成本**:
- 阶段一（P1）: ¥120-240
- 阶段二（P2）: ¥510-1020
- 阶段三（P3）: ¥240-480
- **总计**: ¥870-1740

**建议**: 先执行阶段一，根据实际成本决定后续批次的执行节奏。

---

## 🔍 执行前检查清单

### 环境准备
- [x] ✅ FISH_API_KEY 已配置在 .env
- [ ] ⏳ 开发 `scripts/generate-audio.js` 脚本
- [ ] ⏳ Fish Audio API 测试通过
- [x] ✅ 所有书籍内容文件存在（content/books/*/zh.json, en.json）
- [ ] ⏳ public/audio/ 目录结构就绪

### 内容验证（阶段一书籍）
- [x] ✅ content/books/3/zh.json & en.json 存在
- [x] ✅ content/books/4/zh.json & en.json 存在
- [x] ✅ content/books/5/zh.json & en.json 存在
- [x] ✅ content/books/48/zh.json & en.json 存在

### 脚本功能要求
- [ ] ⏳ 支持按书籍ID批量生成
- [ ] ⏳ 支持指定语言（zh/en）
- [ ] ⏳ 支持指定版本（short/medium/long）
- [ ] ⏳ 支持断点续传（跳过已存在的文件）
- [ ] ⏳ 提供进度显示
- [ ] ⏳ 错误重试机制（API调用失败）
- [ ] ⏳ 生成执行日志和报告

---

## 📝 脚本使用示例

```bash
# 1. 安装依赖（如果需要）
npm install --save-dev dotenv

# 2. 测试单本书
node scripts/generate-audio.js --book 3 --language zh --version short

# 3. 生成阶段一所有音频（P1优先级）
node scripts/generate-audio.js --phase 1

# 4. 生成特定书籍的所有音频
node scripts/generate-audio.js --book 3,4,5,48

# 5. 只生成中文音频
node scripts/generate-audio.js --phase 1 --language zh

# 6. 断点续传模式（跳过已存在文件）
node scripts/generate-audio.js --phase 1 --skip-existing

# 7. 生成完整报告
node scripts/generate-audio.js --report
```

---

## 🎬 执行流程（阶段一示例）

```bash
# Step 1: 开发脚本
# 创建 scripts/generate-audio.js
# 参考上面的技术实施方案

# Step 2: 单元测试
node scripts/generate-audio.js --book 3 --language zh --version short
# 验证: public/audio/3/zh_short.mp3 是否生成且可播放

# Step 3: 执行阶段一
node scripts/generate-audio.js --phase 1

# 预期输出:
# ✅ [3/24] 人类简史 zh_short.mp3 生成成功 (2.3MB, 4:23)
# ✅ [3/24] 人类简史 zh_medium.mp3 生成成功 (5.8MB, 10:45)
# ...
# ✅ [24/24] 原子习惯 en_long.mp3 生成成功 (12.1MB, 18:32)
# 
# 📊 执行完成！
# 成功: 24个文件
# 失败: 0个文件
# 总耗时: 2小时15分钟
# 总大小: 156.7MB

# Step 4: 质量检查
node scripts/check-audio-quality.js --books 3,4,5,48

# Step 5: 生成报告
node scripts/generate-audio.js --report > docs/AUDIO_GENERATION_REPORT_PHASE1.md
```

---

## 🚨 风险与注意事项

### 技术风险
1. **API 限流**: Fish Audio 可能有请求频率限制
   - **解决方案**: 在脚本中添加请求延迟（如每个请求间隔2-3秒）

2. **内容长度限制**: API可能对单次请求的文本长度有限制
   - **解决方案**: 检查API文档，必要时分段生成后合并

3. **网络不稳定**: API调用可能失败
   - **解决方案**: 实现3次重试机制

4. **存储空间**: 174个音频文件总大小可能达到1-2GB
   - **解决方案**: 确认服务器存储空间充足

### 内容风险
1. **文本清理不彻底**: HTML标签可能影响语音质量
   - **解决方案**: 完善文本清理函数，测试多种情况

2. **特殊字符**: 中英文混合、数字、符号等
   - **解决方案**: 在文本预处理中标准化这些字符

3. **时长不符**: 生成的音频时长可能超出预期范围
   - **解决方案**: 调整文本内容或语速参数

### 成本控制
1. **超预算**: 实际成本可能高于估算
   - **解决方案**: 
     - 先执行阶段一验证成本
     - 根据实际情况调整后续计划
     - 考虑只生成中文版本以节省50%成本

---

## 📊 进度追踪

使用以下文件追踪执行进度：

### 进度文件: `docs/AUDIO_GENERATION_PROGRESS.json`
```json
{
  "lastUpdated": "2025-02-05T10:00:00Z",
  "phases": {
    "phase1": {
      "status": "pending",
      "booksTotal": 4,
      "booksCompleted": 0,
      "filesTotal": 24,
      "filesCompleted": 0,
      "startTime": null,
      "endTime": null,
      "books": {
        "3": {"completed": false, "files": []},
        "4": {"completed": false, "files": []},
        "5": {"completed": false, "files": []},
        "48": {"completed": false, "files": []}
      }
    },
    "phase2": {
      "status": "not_started",
      "booksTotal": 17,
      "booksCompleted": 0
    },
    "phase3": {
      "status": "not_started",
      "booksTotal": 8,
      "booksCompleted": 0
    }
  },
  "totalCost": 0,
  "totalDuration": 0
}
```

---

## ✅ 验收标准

### 阶段一完成标准
1. ✅ 4本书的24个音频文件全部生成
2. ✅ 所有文件格式正确（MP3）
3. ✅ 音频时长符合预期范围
4. ✅ 文件可在网站播放器中正常播放
5. ✅ 无明显的语音错误或杂音
6. ✅ 生成执行报告并归档

### 最终验收标准（所有阶段）
1. ✅ 29本书共174个音频文件全部生成
2. ✅ 更新 `AUDIO_STATUS_REPORT.md` 显示100%完成
3. ✅ 所有音频文件在生产环境可访问
4. ✅ 总成本在预算范围内
5. ✅ 完整的质量检查报告

---

## 🔄 后续维护计划

1. **新书籍添加流程**:
   - 准备内容JSON（zh.json, en.json）
   - 运行音频生成脚本
   - 质量检查
   - 更新状态报告

2. **音频更新机制**:
   - 当书籍内容更新时，重新生成对应音频
   - 保留版本历史（可选）

3. **质量监控**:
   - 定期检查用户反馈
   - 监控播放失败率
   - 根据需要重新生成低质量音频

---

## 📞 支持资源

### Fish Audio 文档
- API文档: [需查询官方文档]
- 定价页面: [需查询]
- 技术支持: [需查询]

### 内部资源
- 内容文件: `content/books/*/zh.json`, `content/books/*/en.json`
- 书籍列表: `content/booklist.json`
- 状态报告: `docs/AUDIO_STATUS_REPORT.md`
- 环境配置: `.env`

---

## 📝 总结

本计划提供了一个分阶段、可控制成本的音频生成方案：

1. **优先级明确**: P1（4本）→ P2（17本）→ P3（8本）
2. **技术可行**: 内容已就绪，API已配置，需开发生成脚本
3. **成本可控**: 分阶段执行，可根据实际情况调整
4. **质量保证**: 多重检查点确保音频质量
5. **进度透明**: 详细的日志和报告机制

**下一步行动**: 
1. ✅ 审核本计划
2. ⏳ 开发 `scripts/generate-audio.js` 脚本
3. ⏳ 执行单元测试
4. ⏳ 启动阶段一生成（P1优先级书籍）

---

**计划创建者**: AIreading 内容运营  
**计划版本**: v1.0  
**最后更新**: 2025-02-05
