# Claude Code Harness 知识图谱开发计划

学习进度：展示型前端开发计划 `[■■■■■] 100%`

## 阶段 0：工程骨架

状态：已完成。

目标：

- 在 `D:\agent-harness-lab\apps\knowledge-graph` 建立 Vite + React + TypeScript 应用。
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
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun install
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run dev
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
```

## 阶段 1：图谱数据模型

状态：已完成。

目标：

- 定义 `KnowledgeNode`、`KnowledgeEdge`、`SourceReference` 等类型。
- 建立 34 个知识节点。
- 定义 Beginner、Context、Safety、Advanced 四条路径。

产出：

- `src/types/graph.ts`
- `src/data/knowledgeGraph.ts`
- `src/data/paths.ts`
- `src/data/references.ts`
- `src/data/copy.ts`

验收命令：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
```

## 阶段 2：交互主画布

状态：已完成。

目标：

- 渲染可缩放、可拖拽的知识图谱主画布。
- 实现自定义节点、关系线和主题状态。
- 支持路径节点高亮。
- 支持紧凑 / 分层布局切换。

产出：

- `src/components/graph/KnowledgeGraphCanvas.tsx`
- `src/styles/app-shell.css`

验收命令：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
```

手动验收：

- 画布可缩放。
- 画布可拖拽。
- 节点文本不溢出。
- 桌面布局不重叠。

## 阶段 3：节点交互和详情抽屉

状态：已完成。

目标：

- hover 显示摘要、前置知识、推荐下一步。
- click 打开右侧 detail drawer。
- detail drawer 展示 why / what / how、引用、demo 命令、常见误解、教学版 vs 生产版。
- 节点测验答对后把当前节点标记为已复盘。

产出：

- `src/components/drawer/DetailDrawer.tsx`
- `src/components/ui/CommandBlock.tsx`
- `src/styles/app-shell.css`

验收命令：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
```

## 阶段 4：筛选、路径和进度

状态：已完成。

目标：

- 支持主题筛选、搜索、路径模式。
- 支持 progress 状态和 localStorage 持久化。
- 支持 progress JSON 导入和导出。
- 未实现入口必须显示“暂未实现”；当前页面入口均已实现。

产出：

- `src/components/graph/KnowledgeGraphCanvas.tsx`
- `src/components/layout/AppShell.tsx`
- `tests/knowledgeGraph.test.js`

验收命令：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
```

## 阶段 5：可访问性和安全校验

状态：已完成。

目标：

- 完成键盘导航、focus 管理和 reduced motion。
- `Esc` 关闭详情抽屉，关闭后焦点回到原节点。
- 增加内容边界校验，避免复制 `.external/skill-hub` 或第三方正文。
- 增加 Playwright 视觉回归。
- 从 typed data 生成引用索引。

产出：

- `scripts/generate-reference-index.ts`
- `scripts/visual-regression.mjs`
- `src/data/generatedReferenceIndex.ts`
- `tests/knowledgeGraph.test.js`

验收命令：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run generate:references
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run visual:regression
```

手动验收：

- 键盘可打开和关闭详情。
- `Esc` 能关闭 drawer。
- 关闭 drawer 后焦点回到原节点。
- 桌面下筛选、画布、详情不互相遮挡。
- 不要求设计、编写、构建、测试移动端。
- diff 中没有 `src/`、`packages/`、`docs/` 或 `.external/skill-hub` 正文变更。

## 阶段 6：清晰度重构

状态：已完成。

目标：

- 首屏只保留推荐学习入口、第一步和继续学习按钮。
- 控制区改成分组标识卡，低频操作 hover / focus 滑出，click 固定。
- 路线图作为主要使用手册，按自下而上的步骤展示学习路线。
- 功能预览、源码 hover 预览和详情抽屉都减少默认展开内容。
- hover、focus、active、click 反馈贯穿路线、图谱、摘要和详情。
- 不要求设计、编写、构建、测试移动端。

产出：

- `src/components/layout/AppShell.tsx`
- `src/components/layout/GraphToolbar.tsx`
- `src/components/graph/KnowledgeGraphCanvas.tsx`
- `src/components/drawer/DetailDrawer.tsx`
- `src/styles/app-shell.css`
- `scripts/visual-regression.mjs`
- `output/playwright/regression/desktop.png`
- `output/playwright/regression/detail-drawer.png`
- `output/playwright/regression/source-preview.png`

验收命令：

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run generate:references
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run visual:regression
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build:pages
```

手动验收：

- 首屏干扰减少，用户能直接从 Beginner Path 第一节开始。
- 控制区和详情抽屉默认收纳，标识能说明里面是什么。
- 路线、功能预览、why / what / how 和源码短预览都可视化。
- 桌面布局不挤压、不横向溢出。

## MVP 完成标准

- 首屏直接给出推荐学习入口。
- 34 个知识节点可浏览。
- 搜索、主题筛选、路径模式、progress 可用。
- detail drawer 默认先看 why / what / how，其他内容分组收纳。
- 引用面板只展示元数据和路径，不复制第三方内容。
- 本仓库源码短预览只用于 `labs/ts-agent/src` 引用。
- 不要求设计、编写、构建、测试移动端。
- `bun run typecheck`、`bun test`、`bun run build`、`bun run visual:regression` 通过。
