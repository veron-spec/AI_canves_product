# AI Canvas Product

一个基于 React + TypeScript + Vite 构建的现代化画布应用，提供流畅的用户体验和精美的界面设计。

> **💡 AI 提示**：如果你对项目初始化不太熟悉，可以将此 README.md 文件内容提供给 AI（如 ChatGPT、Claude 等），AI 可以根据这份文档帮你完成项目的克隆、依赖安装和启动操作。

## 项目简介

本项目是一个现代化的 Web 应用，主要功能包括：

- 用户认证系统（登录/注册）
- 动态画布背景效果
- 响应式设计，支持多种屏幕尺寸
- 流畅的页面过渡动画
- 工作台界面（开发中）

## 技术栈

- **框架**: React 19.1.0
- **语言**: TypeScript 5.8.3
- **构建工具**: Vite 6.3.4
- **路由**: React Router 7.5.1
- **状态管理**: Zustand 5.0.4
- **样式**: Tailwind CSS 3.4.17
- **动画**: Framer Motion 12.9.4
- **图标**: Lucide React 0.511.0

## 环境要求

在开始之前，请确保你的电脑已经安装以下软件：

### 检查现有版本

打开终端，运行以下命令检查是否已安装相关软件：

```bash
node --version
npm --version
git --version
```

如果显示版本号，说明已安装成功。

### 软件版本要求

| 软件 | 类型 | 最低版本 | 推荐版本 | 用途 |
|------|------|---------|---------|------|
| **Node.js** | 必需 | 18.0.0 | 20.x 或 22.x | JavaScript 运行环境 |
| **npm** | 必需 | 9.0.0 | 10.x | Node.js 包管理器（默认安装） |
| **Git** | 必需 | 2.0.0 | 最新版 | 版本控制工具 |
| **pnpm** | 可选 | 8.x | 最新版 | 更快的包管理器 |

### 安装指南

#### 安装 Node.js

如果未安装 Node.js，请访问 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本。

#### 安装 pnpm（可选）

如果需要使用 pnpm，执行以下命令安装：

```bash
npm install -g pnpm
```

### 开发者环境版本

以下是开发者开发时使用的软件版本，供参考：

| 软件 | 版本 |
|------|------|
| **Node.js** | v22.22.2 |
| **npm** | 10.9.7 |
| **Git** | 2.39.2.windows.1 |
| **pnpm** | 10.33.2 |

## 快速开始

### 方式一：使用 npm

#### 1. 克隆项目

```bash
git clone https://github.com/veron-spec/AI_canves_product.git
```

或者使用 SSH 方式：

```bash
git clone git@github.com:veron-spec/AI_canves_product.git
```

#### 2. 进入项目目录

```bash
cd AI_canves_product
```

#### 3. 安装依赖

```bash
npm install
```

#### 4. 启动开发服务器

```bash
npm run dev
```

启动后，终端会显示本地访问地址，通常是：

```
  VITE v6.3.4  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

在浏览器中打开 `http://localhost:5173/` 即可访问。

### 方式二：使用 pnpm

#### 1. 克隆项目

```bash
git clone https://github.com/veron-spec/AI_canves_product.git
```

#### 2. 进入项目目录

```bash
cd AI_canves_product
```

#### 3. 安装依赖

```bash
pnpm install
```

#### 4. 启动开发服务器

```bash
pnpm dev
```

## 项目结构

```
AI_canves_product/
├── src/
│   ├── components/     # 组件目录
│   │   └── login/      # 登录相关组件
│   ├── pages/          # 页面组件
│   ├── store/          # 状态管理
│   ├── types/          # TypeScript 类型定义
│   ├── App.tsx         # 根组件
│   └── main.tsx        # 入口文件
├── public/             # 静态资源
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
├── tailwind.config.js  # Tailwind CSS 配置
└── vite.config.ts      # Vite 配置
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` / `pnpm dev` | 启动开发服务器 |
| `npm run build` / `pnpm build` | 构建生产版本 |
| `npm run preview` / `pnpm preview` | 预览生产构建 |

## 常见问题

### Q: 安装依赖时出现错误？

A: 尝试删除 `node_modules` 和 `package-lock.json`，然后重新安装：

```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: 端口被占用怎么办？

A: 修改 `vite.config.ts` 中的端口配置，或者使用命令行参数：

```bash
npm run dev -- --port 3000
```

### Q: TypeScript 类型错误？

A: 运行以下命令检查类型：

```bash
npx tsc --noEmit
```

## 许可证

MIT License





















