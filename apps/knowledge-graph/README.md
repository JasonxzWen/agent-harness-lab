# Claude Code Harness Knowledge Graph

状态：M2 已完成。站点已发布到 GitHub Pages。

这是 `agent-harness-lab` 的前端入口。它把 Claude Code-like agent harness 的学习内容做成知识图谱。

界面中文优先，必要时保留英文机制名。

线上入口：

```text
https://jasonxzwen.github.io/agent-harness-lab/
```

## 文档入口

- [整体设计](docs/overall-design.md)
- [开发计划](docs/development-plan.md)
- [里程碑](docs/milestones.md)

## 产品边界

MVP 打开后直接进入知识图谱，不做 landing page。

核心功能：

- 查看 34 个机制节点。
- 查看 4 条学习路径。
- 查看主题分组。
- 后续会加入节点详情、搜索、筛选和进度。

## 当前技术栈

- Bun
- Vite
- React
- TypeScript
- GitHub Pages
- GitHub Actions

后续按交互复杂度决定是否引入 React Flow 和状态管理。

## 常用命令

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun install
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run dev
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build:pages
```

## 发布

发布机制：

- workflow：`.github/workflows/deploy-knowledge-graph.yml`
- 构建目录：`apps/knowledge-graph/dist`
- 构建命令：`Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build:pages`
- Pages base path：`/agent-harness-lab/`

GitHub 仓库需要在 `Settings -> Pages -> Build and deployment` 中选择 `GitHub Actions`。之后每次 push 到 `main` 且改动命中 `apps/knowledge-graph/**` 或发布 workflow 时，会自动部署。

## 验收

1. 本地运行：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build:pages
```

2. 推送到 GitHub 后，打开 `Actions -> Deploy Knowledge Graph`，确认 workflow 通过。
3. 打开 `Settings -> Pages`，确认 Source 是 `GitHub Actions`，并查看 published URL。
4. 打开 `https://jasonxzwen.github.io/agent-harness-lab/`，确认首页可访问，浏览器 Network 中 JS/CSS 资源不是 404，资源路径以 `/agent-harness-lab/assets/` 开头。

## 内容安全边界

应用数据只保存原创摘要、路径引用和链接元数据。不要复制 CCB 源码、第三方文章正文、skill-hub 内容或本地 `SKILL.md` 内容。
