# Claude Code Harness 知识图谱开发计划

学习进度：展示型前端开发计划 `[██████████] 100%`

## 阶段 0：工程骨架

目标：

- 在 `D:\learn-cc\apps\knowledge-graph` 建立 Vite + React + TypeScript 应用。
- 配置 Bun scripts。
- 建立基础布局和样式变量。

产出：

- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `src/main.tsx`
- `src/App.tsx`
- `src/styles/`

验收命令：

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

## 阶段 1：图谱数据模型

目标：

- 定义 `KnowledgeNode`、`KnowledgeEdge`、`SourceReference` 等类型。
- 建立第一批 25-35 个知识节点。
- 定义 Beginner、Context、Safety、Advanced 四条路径。

产出：

- `src/types/graph.ts`
- `src/data/knowledgeGraph.ts`
- `src/data/paths.ts`
- `src/data/references.ts`

验收命令：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun test
```

建议提交：

```text
feat: add typed harness knowledge graph data
```

## 阶段 2：React Flow 主画布

目标：

- 渲染可缩放、可拖拽的知识图谱主画布。
- 实现自定义节点和主题色。
- 支持路径节点高亮。

产出：

- `src/components/graph/KnowledgeGraphCanvas.tsx`
- `src/components/graph/KnowledgeNodeCard.tsx`
- `src/components/graph/graphLayout.ts`

验收命令：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
```

手动验收：

- 画布可缩放。
- 节点可拖拽。
- 节点文本不溢出。
- 宽屏和窄屏布局不重叠。

建议提交：

```text
feat: render interactive React Flow explorer
```

## 阶段 3：节点交互和详情抽屉

目标：

- hover 显示摘要、前置知识、推荐下一步。
- click 打开右侧 detail drawer。
- detail drawer 展示机制解释、存在原因、引用、demo 命令、常见误解。

产出：

- `src/components/graph/NodeHoverCard.tsx`
- `src/components/drawer/DetailDrawer.tsx`
- `src/components/references/ReferencePanel.tsx`
- `src/components/ui/CommandBlock.tsx`

验收命令：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
```

建议提交：

```text
feat: add node details and reference panels
```

## 阶段 4：筛选、路径和进度

目标：

- 支持主题过滤、搜索、layer/tag/path 筛选。
- 支持 Beginner、Context、Safety、Advanced 路径模式。
- 支持 progress 状态和 localStorage 持久化。
- 支持“教学版 vs 生产版”对照模式。

产出：

- `src/store/graphStore.ts`
- `src/components/filters/FilterSidebar.tsx`
- `src/components/layout/GraphToolbar.tsx`
- `src/components/drawer/CompareBlock.tsx`
- `src/components/drawer/ProgressControl.tsx`

验收命令：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
Set-Location D:\learn-cc\apps\knowledge-graph; bun test
```

建议提交：

```text
feat: add graph filters paths progress and compare mode
```

## 阶段 5：可访问性、响应式和安全校验

目标：

- 完成键盘导航、focus 管理、tooltip、reduced motion。
- 增加节点列表视图。
- 增加内容边界校验脚本，避免复制 `.external/skill-hub` 或第三方正文。
- 完成 diff review。

产出：

- `src/components/layout/NodeListPanel.tsx`
- `src/components/ui/Tooltip.tsx`
- `src/utils/contentGuards.ts`
- `tests/`

验收命令：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
Set-Location D:\learn-cc\apps\knowledge-graph; bun test
```

手动验收：

- 键盘可打开和关闭详情。
- `Esc` 能关闭 drawer。
- 关闭 drawer 后焦点回到原节点。
- 窄屏下筛选、画布、详情不互相遮挡。
- diff 中没有 `src/`、`packages/`、`docs/` 或 `.external/skill-hub` 内容变更。

建议提交：

```text
fix: improve knowledge graph accessibility and safeguards
```

## MVP 完成标准

- 首屏直接进入知识图谱探索器。
- 34 个左右知识节点可浏览。
- 搜索、主题筛选、路径模式、progress 可用。
- detail drawer 内容完整。
- 引用面板只展示元数据和路径，不复制第三方内容。
- `bun run typecheck` 和 `bun run build` 通过。
