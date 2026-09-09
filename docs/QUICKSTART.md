# 快速开始指南

## 方案一：使用本地数据（推荐，无需配置）

不需要 Node.js 和云开发，直接运行。

### 步骤：
1. 用微信开发者工具导入本仓库根目录
2. 在 `project.config.json` 填入你的 AppID（或选择「测试号」）
3. 点击「编译」即可看到效果（内置 100 张本地兜底数据）

### 数据位置：
- 本地数据文件：`data/albums.js`
- 数据结构定义：`data/schema.json`

---

## 方案二：使用云开发（完整功能）

### 第一步：开通云开发
1. 在微信开发者工具中，点击「云开发」按钮
2. 点击「开通」，记录你的 **环境 ID**（`app.js` 中已配置）

### 第二步：部署云函数
1. 在开发者工具中进入 `cloudfunctions/` 下各函数目录
2. 右键选择「上传并部署：云端安装依赖」（至少部署 `getAlbums` 和 `importData`）

### 第三步：导入数据
1. 部署 `cloudfunctions/importData`
2. 云开发控制台 → 云函数 → `importData` → 测试
3. 先传 `{ "clear": true }` 清空旧数据，再传 `{}` 导入 100 张专辑

### 第四步：确认数据库权限
云开发控制台 → 数据库 → `albums` 集合 → 权限设置为「所有用户可读，仅创建者可写」

---

## 数据管线（可选：重新生成数据）

```bash
node scripts/prepare-p0-data.js        # 生成种子数据 raw-albums.json
node scripts/clean-data.js             # 清洗 -> albums.json
node scripts/fetch-real-covers-itunes.js  # 补封面
node scripts/fill-missing-tracks.js    # 补曲目
```

更多脚本说明见 `scripts/cloud-setup-guide.md`。

---

## 常见问题

### Q: 不想安装 Node.js 怎么办？
A: 直接使用方案一，本地兜底数据开箱即用。

### Q: 如何添加更多专辑？
A: 编辑 `data/albums.js`，按 `data/schema.json` 的 Schema v1 格式添加。

### Q: 云开发收费吗？
A: 有免费额度，一般开发测试足够用。
