# 🎵 music-recommend-miniprogram

一个基于微信小程序的**音乐推荐 / 专辑探索**应用，支持专辑浏览、详情查看、跨平台搜索跳转，以及云函数驱动的数据管理。

> 小程序 AppID：`touristappid`（公开标识，可在微信开发者工具中替换为你自己的 AppID）

## 功能特性

- 🏠 **首页（home）**：专辑推荐与浏览
- 🔍 **搜索（search / search-result）**：按关键字检索专辑
- 💿 **详情（detail）**：专辑详情，支持一键跳转至 QQ音乐 / Spotify / 汽水音乐 等平台搜索
- 👤 **我的（my）**：个人中心
- 🧩 **自定义底部 Tab（custom-tab-bar）** 与可复用组件（sidebar / skeleton / empty-state）

## 技术栈

- **前端**：微信小程序原生开发（WXML / WXSS / JS），自定义组件与自定义 tabBar
- **后端**：微信云开发（CloudBase），5 个云函数管理专辑数据（增删改查 / 去重 / 流派更新）
- **数据采集**：Python + Scrapy 爬虫（spider/），采集专辑数据后清洗入库
- **工程化**：npm 依赖管理，scripts/ 提供数据导入与部署辅助脚本

## 目录结构

```
.
├── app.js / app.json / app.wxss      # 小程序入口与全局配置
├── pages/                            # 页面（home / detail / search / search-result / my）
├── components/                       # 自定义组件
├── custom-tab-bar/                   # 自定义底部导航
├── cloudfunctions/                   # 云函数
│   ├── getAlbums          # 获取专辑列表
│   ├── clearAlbums        # 清空专辑数据
│   ├── importData         # 导入数据（打包时忽略）
│   ├── removeDuplicates   # 去重
│   └── updateGenre        # 更新流派
├── data/                            # 专辑数据（albums.js / albums.json）
├── scripts/                         # 数据处理 & 云函数部署脚本
├── spider/                          # 数据采集（Scrapy 爬虫）
└── project.config.json              # 微信开发者工具项目配置
```

## 本地运行

1. 用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)打开本项目根目录
2. 在 `project.config.json` 中填入你自己的 AppID（或选择「测试号」）
3. 如需使用云函数，开通云开发并在 `cloudfunctions/` 各函数目录执行：
   ```bash
   npm install
   ```
   然后在开发者工具中右键上传并部署云函数

## 数据处理 / 爬虫

- `scripts/` 下提供了清洗、导入、生成导入 JSON 等脚本
- `spider/` 下是基于 Scrapy 的专辑数据采集器，依赖见 `spider/requirements.txt`

## 说明

- `node_modules/`、`miniprogram_npm/`、`cloudfunctions/*/node_modules/` 及 `project.private.config.json` 已通过 `.gitignore` 排除，不纳入版本库。
- `cloudfunctions/importData` 与 `data/albums_for_import.json` 在微信打包时被忽略，仅用于本地导入。

## License

本项目仅供学习与交流使用。
