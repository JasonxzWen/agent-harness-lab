# Claude Code Harness 知识图谱里程碑

学习进度：里程碑规划 `[██████████] 100%`

## M0：定位与文档

状态：已完成。

目标：

- 确定方案 B：`apps/knowledge-graph` 作为 root-level 展示型前端工程。
- 更新项目说明文档。
- 落地整体设计、开发计划和里程碑。

验收：

```powershell
Set-Location D:\learn-cc; git status --short --untracked-files=all
Set-Location D:\learn-cc; git diff -- apps AGENTS.md README.md learn reference labs
```

建议提交：

```text
docs: plan root knowledge graph app
```

## M1：可运行前端壳

目标：

- Vite + React + TypeScript 应用可启动。
- 页面首屏是知识图谱操作台布局。
- 不做 landing page。

验收：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun install
Set-Location D:\learn-cc\apps\knowledge-graph; bun run dev
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
```

建议提交：

```text
feat: scaffold knowledge graph app
```

## M2：静态知识图谱数据

目标：

- 定义 TypeScript 数据模型。
- 建立第一批 25-35 个知识节点。
- 四条学习路径可被数据表达。

验收：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun test
```

建议提交：

```text
feat: add typed harness graph data
```

## M3：交互画布

目标：

- React Flow 主画布可缩放、拖拽。
- 节点和边能按主题、路径、progress 呈现不同状态。

验收：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
```

建议提交：

```text
feat: render harness graph canvas
```

## M4：学习工作流

目标：

- hover 摘要可用。
- click detail drawer 可用。
- 引用面板、demo 命令、常见误解、对照模式可用。

验收：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
```

建议提交：

```text
feat: add graph learning workflow
```

## M5：展示级打磨

目标：

- 搜索、筛选、路径模式、progress 持久化完整。
- 键盘可用、响应式可用、视觉达到开发工具质感。
- 内容安全边界完成校验。

验收：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
Set-Location D:\learn-cc\apps\knowledge-graph; bun test
```

建议提交：

```text
fix: polish knowledge graph UX and verification
```

## M6：后续增强

目标：

- 从 Markdown 或本地机制对照表生成部分引用索引。
- 增加 Playwright 视觉回归。
- 增加节点学习测验。
- 增加 D3 layout 优化。
- 增加 progress 导入导出。

建议提交：

```text
feat: add generated graph references
```
