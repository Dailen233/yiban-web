# 译伴用户端 · yiban-web

译伴双语电子书生成系统的用户端，采用 Vue 官方 `create-vue` 起步项目，后续承接公开介绍、账号、上传、任务、个人书库与双语阅读。

[当前范围](#当前范围) · [仓库分工](#仓库分工) · [本地运行](#本地运行) · [代码组织](#代码组织) · [开发流程](#开发流程) · [文档](#文档)

## 当前范围

截至 2026-10-22，已生成官方起步项目，通过本机类型检查、生产构建和两项代码检查，并将 `master`、`develop` 同步到 Gitee 与 GitHub。首次提交为 [`243374b`](https://gitee.com/jin-xinfu/yiban-web/commit/243374bf6130281bc7308cfd75eb1080c7809bcb)。

当前页面仍是 Vue 的 Home、About 示例，另有 Pinia 示例 store。译伴的登录、上传、翻译、任务、书库、阅读与下载尚未接入。本仓当前也没有业务 API 请求封装、PWA 或自动化测试脚本。

首个真实里程碑按中央需求 §3.5 的开发顺序推进：基础注册与登录 → TXT 上传及英语到中文 → 真实翻译与后台进度 → 双语预览 → EPUB 下载 → 个人书库与重新下载。账号、属主、处理、入库和下载鉴权由 `yiban-api` 保证。

EPUB/PDF 输入、更多语言对、PDF 导出、完整阅读体验、PWA 等保留为后续目标；第三方登录按课堂说明属于加分项。该顺序不取消产品最终范围，也不将尚未完成的功能写成已实现。

用户界面沿用 v4 已验收的流程与“现代东方阅读”方向：暖白纸色、墨蓝、玉石绿和少量暖金。v4 作为交互与视觉参考，其 localStorage 模拟鉴权、示例译文和时间推算进度不能直接充当真实实现。

## 仓库分工

三个实现仓库与一个需求、设计、原型入口仓库均在 `~/projects/` 下同级存放，独立维护 Git 历史。

| 仓库 | 职责 | Gitee | GitHub |
|---|---|---|---|
| `bilingual-ebook-generator` | 需求、设计草案、历史原型、课程资料与项目导航 | [入口](https://gitee.com/jin-xinfu/bilingual-ebook-generator) | [镜像](https://github.com/Dailen233/bilingual-ebook-generator) |
| `yiban-web` | 用户端：公开页、账号、上传、配置、任务、书库与阅读 | [主仓库](https://gitee.com/jin-xinfu/yiban-web) | [镜像](https://github.com/Dailen233/yiban-web) |
| `yiban-admin` | 管理端：独立入口与任务、失败信息的只读查看起步 | [主仓库](https://gitee.com/jin-xinfu/yiban-admin) | [镜像](https://github.com/Dailen233/yiban-admin) |
| `yiban-api` | 共享后端：账号、权限、文件、解析、翻译、任务、成果与下载 | [主仓库](https://gitee.com/jin-xinfu/yiban-api) | [镜像](https://github.com/Dailen233/yiban-api) |

当前用户端与管理端均已导入起步代码；后端远程空仓库已创建，尚未导入起步代码。管理端的译伴业务同样尚未实现。Gitee 是开发与 PR 合并入口，GitHub 同步相同提交；校内 GitLab 留到最终提交阶段处理。

## 本地运行

已验证环境：Ubuntu 24.04.4、Node.js `v22.23.2`、npm `10.9.8`。项目声明的 Node 范围是 `^22.18.0 || >=24.12.0`。沿用 npm 和 `package-lock.json`，后续安装按锁文件执行：

```bash
cd ~/projects/yiban-web
npm ci --no-audit --no-fund
npm run dev
```

开发服务器的实际地址以终端输出为准。生产检查命令：

```bash
npm run build
```

`build` 同时执行 `vue-tsc --build` 类型检查和 Vite 构建；`build-only` 只构建。输出目录是 `dist/`，不提交到 Git。

只检查代码、不自动修复：

```bash
./node_modules/.bin/oxlint .
./node_modules/.bin/eslint .
```

现有 `npm run lint` 会执行带 `--fix` 的 Oxlint、ESLint，`npm run format` 会改写 `src/`；使用后需检查实际差异。当前没有 `test` 脚本，也未配置 CI。

初始化验收记录：`npm install --no-audit --no-fund` 成功，安装 305 个包；`npm run build` 成功并转换 44 个模块；只读 Oxlint、ESLint 均通过。此记录来自本机终端，尚不代表译伴业务、浏览器流程、后端权限或线上部署已通过验收。版本与证据详见[起步来源](docs/starter-source.md)。

## 代码组织

| 位置 | 当前内容与用途 |
|---|---|
| `src/main.ts`、`src/App.vue` | 应用入口与根组件，已挂载 Router、Pinia |
| `src/views/` | Home、About 示例；后续按用户场景建立页面 |
| `src/router/` | 路由定义，当前使用 `createWebHistory` |
| `src/stores/` | Pinia 示例；后续只保存需要共享的前端状态 |
| `src/components/`、`src/assets/` | 示例组件、图标与样式；后续沉淀公共阅读组件和视觉变量 |
| `public/` | 原样复制的静态资源 |
| `vite.config.ts`、`tsconfig*.json` | 构建、路径别名与类型检查配置 |
| `package.json`、`package-lock.json` | 命令、依赖范围与实际锁定版本 |
| `docs/` | 起步来源与原始说明 |

业务接入时逐步建立 `src/api/` 的模块请求、`src/types/` 的接口类型与共享请求入口 `src/utils/request.ts`；本批没有创建这些业务文件。路由和菜单用于界面引导，服务端必须独立校验账号、角色与属主。

当前尚未配置业务 API 地址、请求代理或鉴权方案。联调时根据接口契约统一处理；`VITE_*` 可进入浏览器产物，不存放翻译服务密钥等服务端秘密。正式部署需结合现有 history 路由配置静态资源路径与回退，验证内页直接访问和刷新。

## 开发流程

| 分支 | 用途 |
|---|---|
| `master` | 稳定分支，当前默认分支 |
| `develop` | 开发集成分支 |
| `feature/*`、`fix/*`、`docs/*` | 从 `develop` 创建的功能、修复、文档分支 |

变更在 Gitee 发起 PR 合入 `develop`；阶段验收后再合入 `master`。拉取 Gitee 合并后的实际提交，再同步到 GitHub 对应分支，保持相同提交历史。不要在两平台分别合并同一改动。

远程名为 `origin`（Gitee）、`github`（GitHub）。单人开发由本人自查并保存 PR、检查与验收记录；未建立 CI 时不将 CI 设为合并门禁。分支保护设置另行核对，本说明不代表平台已强制执行全部工作约定。

保留首次起步提交，不强推、不重写历史，不提交 `node_modules/`、`dist/` 或秘密配置。任务与验收证据关联 PingCode 的实际任务编号。

## 文档

- [CODEBUDDY.md](CODEBUDDY.md)：本仓范围、技能使用、实现与交付约定。
- [起步来源与基线记录](docs/starter-source.md)：生成命令、首次提交、实际版本和验证证据。
- [起步项目原始 README](docs/upstream-README.md)：逐字节保留的生成说明，当前操作以本 README 为准。
- [中央需求文档](https://gitee.com/jin-xinfu/bilingual-ebook-generator/blob/main/需求分析与设计文档说明.md)：最终目标、首个真实里程碑与后续安排。

数据库模型、状态机及两份接口契约草案位于同级 `../bilingual-ebook-generator/`，按本次任务读取相关章节。起步来源与译伴后续改动分开记录，保留已有源码中的来源注释。
