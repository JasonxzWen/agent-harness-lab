# agent-harness-lab

Live Demo: https://jasonxzwen.github.io/agent-harness-lab/

这是一个原创学习仓库，不是 fork。目标是用 TypeScript/Bun 写一个小型 Claude Code-like agent harness，再把学习路线、机制关系和实验命令做成知识图谱。

## 项目定位

- `apps/knowledge-graph/`：Vite + React + TypeScript + Bun 前端，是仓库作品入口。
- `labs/ts-agent/`：从零实现的小型 TypeScript/Bun agent harness 实验区。
- `learn/`：学习路线、章节文档、实践计划。
- `notes/`：源码阅读笔记、问题和实验记录。
- `reference/`：外部资料、机制对照、归档和 submodule。
- `design/`：视觉参考与设计约束。

当前重点不是复刻完整 Claude Code 或 CCB，而是理解并实现 harness 机制：

- agent loop
- tool registry
- tool result write-back
- planning / TodoWrite
- context engineering
- memory
- permissions
- subagents
- background tasks
- MCP / plugins

## 参考边界

- `reference/vendor/learn-claude-code` 是 `shareAI-lab/learn-claude-code` 的 MIT 教学源码 submodule，用于学习和机制对照。
- `anthropics/claude-code` / official Claude Code 只作为官方产品、文档和行为参考，本仓库只链接，不复制源码。
- `claude-code-best/claude-code` 作为生产级工程阅读参考，只放在本地 `.external/` 阅读，不提交源码。
- 本仓库不会提交 CCB 的 `src/`、`packages/`、`docs/`、`vendor/` 等生产源码目录。

更多来源记录见 [reference/sources.md](reference/sources.md)。

## 推荐入口

- [Claude Code Harness 知识图谱前端](apps/knowledge-graph/README.md)
- [知识图谱整体设计](apps/knowledge-graph/docs/overall-design.md)
- [知识图谱开发计划](apps/knowledge-graph/docs/development-plan.md)
- [知识图谱里程碑](apps/knowledge-graph/docs/milestones.md)
- [学习路线](learn/00-roadmap.md)
- [TypeScript 与 Bun 入门](learn/01-typescript-bun.md)
- [落地计划](learn/02-implementation-plan.md)
- [从 0 到 1 学习计划](learn/03-zero-to-one-plan.md)
- [运行环境初始化与检查清单](learn/04-environment-setup.md)
- [项目规范](learn/05-project-rules.md)
- [Mermaid 学习地图](learn/06-mermaid-learning-map.md)

## 常用命令

知识图谱前端：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun install
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run dev
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build:pages
```

教学版 agent harness：

```powershell
Set-Location D:\agent-harness-lab\labs\ts-agent; bun run dev "hello agent"
Set-Location D:\agent-harness-lab\labs\ts-agent; bun run typecheck
```

## 发布

GitHub Pages 地址：

```text
https://jasonxzwen.github.io/agent-harness-lab/
```

发布基建：

- workflow：`.github/workflows/deploy-knowledge-graph.yml`
- 构建目录：`apps/knowledge-graph/dist`
- Pages base path：`/agent-harness-lab/`
- Pages 构建命令：`Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build:pages`

GitHub 仓库需要在 `Settings -> Pages -> Build and deployment` 中选择 `GitHub Actions`。之后每次 push 到 `main` 且改动命中 `apps/knowledge-graph/**` 或发布 workflow 时，会自动部署知识图谱前端。
