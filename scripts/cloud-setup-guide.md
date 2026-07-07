# 微信云开发配置指南

## 一、开通云开发

1. 打开微信开发者工具
2. 点击左上角的 "云开发" 按钮
3. 点击 "开通" 按钮
4. 选择 "免费版" 或按需求选择付费版
5. 记录你的 **环境ID**（后面会用到）

## 二、安装 Node.js 和 wx-server-sdk

### 1. 安装 Node.js
- 访问 https://nodejs.org/
- 下载 LTS 版本（推荐 18.x 或 20.x）
- 按提示安装

### 2. 验证安装
打开命令行，运行：
```bash
node -v
npm -v
```

### 3. 安装 wx-server-sdk
在项目根目录打开命令行，运行：
```bash
npm install wx-server-sdk
```

## 三、配置云开发环境

### 1. 获取云开发密钥
1. 在微信开发者工具中，点击 "云开发" 按钮
2. 进入 "设置" → "环境设置"
3. 复制 **环境ID**

### 2. 配置导入脚本
打开 `scripts/import-to-cloud.js`，修改配置：
```javascript
const CONFIG = {
  env: '你的环境ID',  // ← 替换为你的环境ID
  collection: 'albums',
  batchSize: 500
};
```

## 四、创建数据库集合

1. 在微信开发者工具中，点击 "云开发"
2. 进入 "数据库"
3. 点击 "添加集合"
4. 输入集合名称：`albums`
5. 点击确定

## 五、运行导入脚本

在项目根目录打开命令行，按顺序运行：

```bash
# 1. 爬取数据
node scripts/scrape-albums.js

# 2. 清洗数据
node scripts/clean-data.js

# 3. 导入云开发
node scripts/import-to-cloud.js
```

## 六、在云函数中运行（推荐）

如果本地运行有问题，建议在云函数中运行：

### 1. 创建云函数
1. 右键 `cloudfunctions` 文件夹（如果没有，先创建）
2. 选择 "新建 Node.js 云函数"
3. 命名为 `importAlbums`

### 2. 在云函数中安装依赖
在云函数的 `package.json` 中添加：
```json
{
  "dependencies": {
    "wx-server-sdk": "latest"
  }
}
```

### 3. 复制导入代码
将 `import-to-cloud.js` 的代码复制到云函数的 `index.js` 中

### 4. 上传并运行
1. 右键云函数文件夹
2. 选择 "上传并部署：云端安装依赖"
3. 在云开发控制台中测试运行

## 七、常见问题

### Q1: 提示 "未找到环境"
- 检查环境ID是否正确
- 确保已开通云开发

### Q2: 提示 "权限不足"
- 在云开发控制台 → 数据库 → 权限设置
- 将 `albums` 集合权限改为 "所有用户可读，仅创建者可写"

### Q3: 导入速度慢
- 这是正常的，每批500条，会自动分批导入
- 可以调小 `batchSize` 来减少单次压力

## 八、数据结构

导入后的数据格式：
```json
{
  "_id": "album_xxx",
  "title": "专辑名",
  "artist": "艺术家",
  "year": 2020,
  "genre": ["rock", "indie"],
  "rating": 85,
  "source": "RYM",
  "coverUrl": "",
  "description": "",
  "crawledAt": "2024-01-01T00:00:00.000Z",
  "cleanedAt": "2024-01-01T00:00:00.000Z"
}
```
