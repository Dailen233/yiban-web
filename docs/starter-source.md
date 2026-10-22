# 用户端起步来源与基线记录

记录日期：2026-10-22。区分 Vue 官方生成内容、依赖安装结果与译伴后续修改。

## 来源与选择

| 项目 | 记录 |
|---|---|
| 官方说明 | https://vuejs.org/guide/quick-start.html |
| 起步工具 | https://github.com/vuejs/create-vue |
| 固定工具版本 | `create-vue@3.24.0` |
| 生成选项 | TypeScript、Vue Router、Pinia、ESLint、Prettier；未选择 JSX、测试框架或实验性功能 |
| 原始 README | [upstream-README.md](upstream-README.md)，逐字节保留首次提交中的根 README |
| 原始 README SHA-256 | `b551027265f149c042cd0e711197bde23403a480b41f2d0e9635dba0bdf9a093` |

管理端采用教师提供的 Vue Next Admin Template；用户端选择 Vue 官方轻量起步工具，再按译伴上传、阅读场景开发。这是本项目的工程选择，不写成教师指定用户端必须采用此工具。

生成时在 `~/projects/` 下执行：

```bash
npm create --yes vue@3.24.0 -- yiban-web \
    --typescript \
    --router \
    --pinia \
    --eslint \
    --prettier
```

随后执行 `npm install --no-audit --no-fund`，生成并提交 npm 锁文件。没有在首次提交前进行译伴业务改造。

固定的是生成工具版本；依赖清单含语义化版本范围，实际安装版本由首次提交中的 `package-lock.json` 锁定。今后按锁文件安装，不将重新运行同一生成命令视为可精确复现相同依赖树。

## 首次提交

| 项目 | 记录 |
|---|---|
| 仓库与本地目录 | `yiban-web`；`~/projects/yiban-web` |
| 首次提交 | `243374bf6130281bc7308cfd75eb1080c7809bcb` |
| 提交说明 | `chore: 初始化 Vue 官方用户端起步项目` |
| 基线 Git tree | `2e22fcea685cc7fdb99364cc87690ab9fcf79834` |
| 跟踪文件数 | 34 |
| 锁文件 | `package-lock.json`，lockfileVersion 3 |
| 锁文件 SHA-256 | `152b3f4d321cf19e429de4fe0f523eb1dd6e5799ec282f4f64fc92c8afad38b2` |
| Gitee / origin | `git@gitee-course:jin-xinfu/yiban-web.git` |
| GitHub / github | `git@github.com:Dailen233/yiban-web.git` |

起步内容和 npm 锁文件构成本项目的根提交；该提交号属于译伴仓库，不是 Vue 上游提交号。首次推送时本地与两平台的 `master`、`develop` 均指向该提交。后续改动独立提交，保留基线可追溯性。

## 锁定版本

从基线 `package-lock.json` 核对的实际版本：

| 依赖 | 版本 | 依赖 | 版本 |
|---|---|---|---|
| Vue | 3.5.44 | Pinia | 4.1.0 |
| Vue Router | 5.4.0 | Vite | 8.3.5 |
| TypeScript | 6.0.3 | vue-tsc | 3.3.13 |
| ESLint | 10.13.0 | Oxlint | 1.82.0 |
| Prettier | 3.9.6 | @vitejs/plugin-vue | 6.0.10 |

这是起步时的实际安装记录，不表述为“当前最新版”。用户端与教师管理端独立维护依赖；本批不升级、降级或统一两端的具体版本。

## 本机验证记录

依据：用户在 2026-10-22 提供的初始化、检查及推送终端输出。

| 检查 | 实际结果 |
|---|---|
| 环境 | Ubuntu 24.04.4；Node.js v22.23.2；npm 10.9.8 |
| `npm install --no-audit --no-fund` | 成功，安装 305 个包 |
| `npm run build` | 类型检查与生产构建成功，Vite 转换 44 个模块并生成 `dist/` |
| `./node_modules/.bin/oxlint .` | 17 个文件、127 条规则；0 warning、0 error |
| `./node_modules/.bin/eslint .` | 无错误输出，命令成功后继续执行初始化与提交 |
| Git 检查 | `node_modules/`、`dist/` 被忽略；暂存差异空白检查通过 |
| 推送与状态 | Gitee/GitHub 的 `master`、`develop` 均推送成功；本地 `develop` 跟踪 `origin/develop`，工作区干净 |

以上证明起步可安装、可类型检查、可构建且通过现有静态检查。尚未进行译伴业务、真实 API、浏览器流程、权限或线上部署验收；当前没有自动化测试脚本与 CI。

## 原始说明与后续改动

原始 README 保留工具生成时的英文说明、命令和链接；当前操作以根 README 为准。源码内已有的来源注释保留。起步基线未附独立 `LICENSE` 文件，本批不新增项目许可声明。

本批只修订根 README，新增 CODEBUDDY、来源记录和原始 README 副本。没有修改源码、路由、样式、构建配置、依赖清单、锁文件或中央需求设计文档。
