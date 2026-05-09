# Claude Code Harness Knowledge Graph

状态：M6 已完成。站点已发布到 GitHub Pages。

这是 `agent-harness-lab` 的前端入口。它把 Claude Code-like agent harness 的学习内容做成可交互知识图谱。

线上入口：

```text
https://jasonxzwen.github.io/agent-harness-lab/
```

## 文档入口

- [整体设计](docs/overall-design.md)
- [开发计划](docs/development-plan.md)
- [里程碑](docs/milestones.md)

## 当前能力

- 查看 34 个机制节点和 35 条关系。
- 按 4 条学习路径浏览节点。
- 首屏只保留推荐入口、第一步和继续学习按钮。
- 路线图用自下而上的步骤卡展示学习顺序，点击步骤打开对应详情。
- 搜索节点，按主题筛选，切换紧凑或分层布局。
- 控制区、功能预览和详情内容使用标识卡收纳，hover / focus 滑出，click 固定。
- hover / focus 看摘要和本仓库源码短预览，click 打开详情，`Esc` 关闭并回到原节点。
- 查看 why / what / how 可视化卡片、引用面板、Bun 命令和节点测验。
- 本地保存学习进度，支持导入和导出 JSON。
- 从 typed data 生成引用索引，不复制 CCB、skill-hub 或第三方正文。
- 当前不要求设计、编写、构建、测试移动端。

## 技术栈

- Bun
- Vite
- React
- TypeScript
- Playwright CLI 视觉回归
- GitHub Pages
- GitHub Actions

当前不引入 React Flow、D3 或额外图标库。布局用本仓库的 typed data、React 状态和 CSS 实现。

## 常用命令

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun install
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run dev
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run generate:references
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run visual:regression
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build:pages
```

`visual:regression` 只覆盖桌面：首屏、详情抽屉、源码 hover 预览。

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
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run generate:references
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run visual:regression
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build:pages
```

2. 推送到 GitHub 后，打开 `Actions -> Deploy Knowledge Graph`，确认 workflow 通过。
3. 打开 `Settings -> Pages`，确认 Source 是 `GitHub Actions`，并查看 published URL。
4. 打开 `https://jasonxzwen.github.io/agent-harness-lab/`，确认首页可访问，浏览器 Network 中 JS/CSS 资源不是 404，资源路径以 `/agent-harness-lab/assets/` 开头。

## 内容安全边界

应用数据只保存原创摘要、路径引用和链接元数据。不要复制 CCB 源码、第三方文章正文、skill-hub 内容或本地 `SKILL.md` 内容。
