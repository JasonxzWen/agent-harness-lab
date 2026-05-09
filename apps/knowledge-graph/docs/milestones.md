# Claude Code Harness 知识图谱里程碑

学习进度：里程碑规划 `[■■■■■] 100%`

## M0：定位与文档

状态：已完成。

目标：

- 确定 `apps/knowledge-graph` 作为仓库级展示型前端工程。
- 更新项目说明文档。
- 落地整体设计、开发计划和里程碑。

验收：

```powershell
Set-Location D:\agent-harness-lab; git status --short --untracked-files=all
Set-Location D:\agent-harness-lab; git diff -- apps AGENTS.md README.md learn reference labs
```

## M1：可运行前端壳

状态：已完成。

目标：

- Vite + React + TypeScript 应用可启动。
- 页面首屏是知识图谱操作台布局。
- 不做 landing page。

验收：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun install
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run dev
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
```

## M2：静态知识图谱数据

状态：已完成。

目标：

- 定义 TypeScript 数据模型。
- 建立第一批 25-35 个知识节点。
- 四条学习路径可由数据表达。

验收：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
```

## M3：交互画布

状态：已完成。

目标：

- 图谱主画布可缩放、拖拽。
- 节点和边能按主题、路径、progress 呈现不同状态。
- 支持紧凑和分层布局，不新增 D3 依赖。

验收：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
```

## M4：学习工作流

状态：已完成。

目标：

- hover 摘要可用。
- click detail drawer 可用。
- 引用面板、demo 命令、常见误解、对照模式可用。
- 每个节点都有 why / what / how 可视化卡片和节点测验。

验收：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
```

## M5：展示级打磨

状态：已完成。

目标：

- 搜索、筛选、路径模式、progress 持久化完整。
- 键盘可用，桌面视觉达到开发工具质感。
- 内容安全边界完成校验。
- 不要求设计、编写、构建、测试移动端。

验收：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
```

## M6：后续增强

状态：已完成。

目标：

- 从 typed data 生成引用索引。
- 增加 Playwright 视觉回归。
- 增加节点学习测验。
- 增加紧凑 / 分层布局切换。
- 增加 progress 导入导出。

验收：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run generate:references
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run visual:regression
```
