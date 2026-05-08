# 项目规范

本项目现在按 Codex/AGENTS.md 工作流维护，不再依赖 Claude Code 专用的 `CLAUDE.md`。

## 目录边界

主要构建目录：

- `apps/knowledge-graph/`
- `labs/ts-agent/`

主要学习目录：

- `learn/`
- `notes/`
- `reference/`

生产级参考目录：

- `src/`
- `packages/`
- `docs/`
- `tests/`
- `scripts/`

默认不要修改生产级参考目录。只有当任务明确要求改 CCB 本体时才动。

## 展示型前端工程

`apps/knowledge-graph/` 是仓库级展示型前端工程，用来展示 Claude Code-like harness 学习成果和前端架构能力。

规则：

- 使用 Vite + React + TypeScript。
- 所有命令使用 Bun。
- 页面打开后直接进入知识图谱探索器，不做营销 landing page。
- 知识图谱使用 React Flow；D3 只作为后续布局或动效增强。
- 应用可以引用 `labs/ts-agent/`、`learn/`、`reference/` 中的路径，但不要复制 CCB 源码、第三方正文或 skill-hub 内容。
- 不要引入远程分析脚本、第三方跟踪或危险动态 HTML。

## 模块推进规则

每个模块都按这个节奏：

```text
先学习 -> 后构建 -> 再验证 -> 最后对照源码
```

每个模块完成时至少留下：

1. 可运行代码。
2. 一段学习笔记。
3. 一条机制对照更新。
4. 一条变更记录。

## 最小实现原则

`labs/ts-agent` 的每个能力先做最小版本。

例如：

- tool registry 先支持 `echo`、`read_file`、`write_file`。
- permissions 先支持 allow/deny，再加入 ask。
- memory 先支持一个 markdown 文件，再考虑索引或检索。
- plugin 先支持本地 manifest，再考虑 MCP。

## 验证规则

改 `labs/ts-agent` 后运行：

```powershell
Set-Location D:\learn-cc\labs\ts-agent; bun run typecheck
```

改 `apps/knowledge-graph` 后运行：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
```

改根仓库 CCB 源码后运行：

```powershell
Set-Location D:\learn-cc; bun run typecheck
```

## 文档规则

- 长期稳定规则放 `AGENTS.md`。
- 人类学习入口放 `README.md` 和 `learn/`。
- 展示型前端的设计、计划和里程碑放 `apps/knowledge-graph/docs/`。
- 外部资料放 `reference/links.md`。
- 机制差异放 `reference/mechanism-comparison.md`。
- 每次实验写到 `notes/experiments.md`。
- Mermaid 可视化图放到对应学习文档中；复杂结构优先用多张小图解释。
- Mermaid 节点内换行统一使用 `<br/>`。
- 中文 Markdown 文件不要用 PowerShell 做整文件读写替换，优先用 `apply_patch`。

## Claude Code 专用文件

旧的 `CLAUDE.md` 已归档到：

```text
reference/archive/original-CLAUDE.md
```

后续不维护根目录 `CLAUDE.md`。

如果某个工具需要项目指令，优先读取 `AGENTS.md`。

## 协作踩坑记录

协作过程中出现过的问题和修复方案记录在：

```text
reference/lessons-learned.md
```
