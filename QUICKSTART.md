# 快速开始指南

## 方案一：使用本地数据（推荐，无需配置）

这个方案不需要 Node.js 和云开发，可以直接运行。

### 步骤：
1. 打开微信开发者工具
2. 导入项目 `c:\Users\Search\WeChatProjects\miniprogram-1`
3. 点击 "编译" 即可看到效果

### 数据位置：
- 本地数据文件：`data/albums.js`
- 你可以直接编辑这个文件添加更多专辑

---

## 方案二：使用云开发（需要配置）

### 第一步：安装 Node.js
1. 访问 https://nodejs.org/
2. 下载 LTS 版本
3. 安装并验证：
   ```bash
   node -v
   npm -v
   ```

### 第二步：安装依赖
在项目目录打开命令行：
```bash
npm install wx-server-sdk
```

### 第三步：开通云开发
1. 在微信开发者工具中，点击 "云开发" 按钮
2. 点击 "开通"
3. 记录你的 **环境ID**

### 第四步：配置脚本
编辑 `scripts/import-to-cloud.js`：
```javascript
const CONFIG = {
  env: '你的环境ID',  // ← 替换这里
  collection: 'albums',
  batchSize: 500
};
```

### 第五步：运行脚本
```bash
# 1. 爬取数据
node scripts/scrape-albums.js

# 2. 清洗数据
node scripts/clean-data.js

# 3. 导入云开发
node scripts/import-to-cloud.js
```

### 第六步：启用云开发数据
编辑 `pages/home/index.js`，注释掉本地数据加载，启用云开发：
```javascript
loadAlbums() {
  // 方式1：使用本地数据
  // const localData = require('../../data/albums.js');
  // ...

  // 方式2：使用云开发
  this.loadFromCloud();
}
```

---

## 方案三：手动导入数据（最简单）

### 步骤：
1. 运行爬虫和清洗脚本（如果有 Node.js）
2. 或者使用 `data/albums.js` 中的数据
3. 打开微信开发者工具 → 云开发 → 数据库
4. 创建集合 `albums`
5. 点击 "导入"，选择 `data/cloud-import.json`

---

## 文件说明

```
scripts/
├── scrape-albums.js          # 爬虫脚本
├── clean-data.js             # 数据清洗
├── import-to-cloud.js        # 导入云开发
├── generate-import-json.js   # 生成导入文件
└── cloud-setup-guide.md      # 详细配置指南

data/
├── albums.js                 # 本地数据（可直接使用）
├── raw-albums.json           # 原始爬取数据
├── albums.json               # 清洗后数据
├── cloud-import.json         # 云开发导入格式
└── stats.json                # 统计信息
```

---

## 常见问题

### Q: 不想安装 Node.js 怎么办？
A: 直接使用方案一，编辑 `data/albums.js` 文件即可。

### Q: 如何添加更多专辑？
A: 编辑 `data/albums.js`，按照现有格式添加即可。

### Q: 如何修改专辑信息？
A: 直接编辑 `data/albums.js` 中的数据。

### Q: 云开发收费吗？
A: 有免费额度，一般开发测试足够用。
