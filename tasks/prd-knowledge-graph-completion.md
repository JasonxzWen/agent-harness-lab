# Knowledge Graph Completion PRD

## Introduction/Overview

`apps/knowledge-graph` 现在已完成 M2 静态数据和一个早期交互入口。M3-M5 要把它推进到可演示的学习工具：用户能在图谱里点击节点、看 `why / what / how`、搜索、筛选、按路径学习、保存进度，并用键盘正常操作。

本 PRD 只覆盖 `apps/knowledge-graph` 的 M3-M5。每个 user story 必须能由 Ralph Loop 的一次 Codex 执行完成。

## Goals

- 把主画布从静态列表改成真正的交互图谱骨架。
- 完成 hover、click、focus、Esc 和返回焦点。
- 每个知识点都能看到 `why / what / how` 可视化元素。
- 支持搜索、主题筛选、路径模式和进度保存。
- 增加引用面板、内容边界校验和键盘可访问性。
- 每个 story 完成后都通过 Bun 验证、截图检查和 Conventional Commit。

## User Stories

### US-001: 交互图谱骨架

As a learner, I want the main canvas to show nodes and edges as an interactive graph so that I can see how harness mechanisms connect.

Acceptance criteria:

- 主画布显示节点、边、主题、路径和 progress 状态的基础视觉。
- 支持画布拖拽或平移，以及至少一个清楚的缩放入口。
- 节点 hover、focus、active、click 反馈清楚，不使用 `box-shadow`、渐变、缩放或新图标库。
- 未完成的搜索、筛选、路径、进度入口继续显示“暂未实现”。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-002: hover 摘要卡片

As a learner, I want to hover or focus a node and see a short summary card so that I can scan the graph without opening the drawer.

Acceptance criteria:

- hover 和 keyboard focus 节点时显示摘要卡片。
- 摘要卡片包含标题、摘要、前置节点和推荐下一步。
- 卡片文案短、准、中文优先，不遮挡当前节点和主要操作。
- 键盘 focus 下有不依赖 hover 的等效入口。
- 未完成能力继续显示“暂未实现”。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-003: click detail drawer 和焦点管理

As a keyboard user, I want click, Enter, Esc, and close controls to manage the detail drawer so that I can inspect nodes without losing my place.

Acceptance criteria:

- 点击或 Enter 打开 detail drawer。
- `Esc` 和关闭按钮关闭 drawer。
- drawer 打开后有明确 focus 目标，关闭后焦点回到原节点。
- drawer 的 `aria` 属性、标题关联和按钮标签清楚。
- 未完成能力继续显示“暂未实现”。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-004: why / what / how 可视化

As a learner, I want every knowledge node to show a visual `why / what / how` explanation so that I can understand the mechanism and where it lives in this repo.

Acceptance criteria:

- detail drawer 中每个节点都有 `why / what / how` 三段内容。
- 每个节点配一个轻量可视化元素，可以是 Mermaid 风格的步骤、React/CSS 机制条或 reduced-motion 兼容的交互组件。
- 可视化只使用本仓库原创摘要和路径元数据，不复制外部正文。
- 文案回答“为什么需要、它是什么、如何在本仓库实现”。
- 未完成能力继续显示“暂未实现”。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-005: 搜索

As a learner, I want to search nodes by title, summary, tag, and source path so that I can jump to the mechanism I need.

Acceptance criteria:

- 新增搜索输入，支持 title、summary、tag、lab file、mapping path 匹配。
- 搜索结果即时过滤图谱节点和列表计数。
- 空结果有中文提示，并给出清除搜索动作。
- 搜索框 hover、focus、active 和清除反馈清楚。
- 未完成筛选、路径或进度入口继续显示“暂未实现”。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-006: 主题筛选

As a learner, I want to filter nodes by theme so that I can focus on one mechanism area at a time.

Acceptance criteria:

- 新增主题筛选控件，覆盖现有 theme labels。
- 选中主题后，图谱节点、边和计数同步更新。
- 支持清除筛选。
- 筛选控件 hover、focus、active、click 反馈清楚。
- 未完成路径或进度入口继续显示“暂未实现”。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-007: 路径模式

As a learner, I want to switch between learning paths so that I can follow Beginner, Context, Safety, and Advanced routes.

Acceptance criteria:

- 四条路径可切换，当前路径节点和边被清楚标记。
- 路径摘要和当前步骤计数可见。
- 非当前路径节点仍可访问，但视觉权重降低。
- 路径按钮 hover、focus、active、click 反馈清楚。
- 未完成 progress 入口继续显示“暂未实现”。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-008: progress 状态和 localStorage

As a learner, I want to mark node progress and keep it after reload so that I can resume learning later.

Acceptance criteria:

- 每个节点支持 `not-started`、`learning`、`implemented`、`reviewed` 状态。
- 状态保存到 `localStorage`，刷新后恢复。
- 有清除本地进度入口，点击前后反馈清楚。
- progress 状态影响节点视觉和详情区。
- 未完成能力继续显示“暂未实现”。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-009: 引用面板

As a learner, I want a reference panel for local docs, lab files, mappings, and external links so that I can verify each node without copied source text.

Acceptance criteria:

- detail drawer 增加引用面板，按本仓库文档、实验源码、CCB 对照路径、外部链接分组。
- 引用只展示标题、类型、路径、note 和链接元数据，不复制第三方正文或 skill 内容。
- 空分组不占用大块空间。
- 引用项 hover、focus、active、click 反馈清楚。
- 未完成能力继续显示“暂未实现”。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-010: 键盘可访问性打磨

As a keyboard user, I want the graph, controls, hover card, and drawer to remain usable so that I can study without a mouse.

Acceptance criteria:

- 键盘可以进入搜索、筛选、路径、节点、progress 和 drawer。
- `prefers-reduced-motion` 下没有强制动画。
- focus ring、hover、active、click 反馈符合 DESIGN.md。
- 未完成能力继续显示“暂未实现”。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-011: 内容边界校验和测试

As a maintainer, I want automated content guards so that the app does not accidentally include forbidden filler terms, copied source text, or `.external/skill-hub` paths.

Acceptance criteria:

- 增加或扩展测试，覆盖节点、引用、文案、CSS token 和未实现入口提示。
- 校验不得引用 `.external/skill-hub`、`node_modules`、`dist`、`labs/ts-agent/workspace`。
- 校验禁止用户指定的空泛词。
- 校验每个节点都有 `why / what / how` 数据或可视化入口。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-012: 最终视觉、文案、交互验收

As the project owner, I want a final polish pass so that the knowledge graph is coherent, restrained, and ready to show.

Acceptance criteria:

- 对照 `AGENTS.md`、`apps/knowledge-graph/AGENTS.md` 和 `DESIGN.md` 检查 UI、文案、布局、交互。
- 没有 token 外颜色、`box-shadow`、渐变、图标库或多余深色块。
- 页面元素没有过度堆叠，用户第一步操作清楚。
- 所有未完成入口都有“暂未实现”或同义可见提示。
- 最终截图覆盖桌面。
- UI story 必须 in-app browser 截图。
- UI story 必须说明 hover / focus / active / click 反馈。
- UI story 必须说明全局思维检查：元素是否过多、是否挤压布局、用户是否会疑惑。
- UI story 必须说明 why / what / how 是否可视化。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

## Functional Requirements

- Use Bun for install, typecheck, test, build, and dev server commands.
- Keep frontend work inside `apps/knowledge-graph`.
- Do not add a new icon library.
- Do not copy CCB, skill-hub, or third-party body text.
- Preserve Chinese-first, short, concrete copy.
- Every unfinished entry must show “暂未实现” or an equivalent visible hint.
- Every completed story must update `scripts/ralph/prd.json`, append `scripts/ralph/progress.txt`, and commit with `feat: [US-xxx] - [Story Title]`.

## Non-Goals

- Do not introduce React Flow unless one story explicitly proves typed React/CSS cannot meet the current scope.
- Do not add backend services, analytics, remote logging, or external data upload.
- Do not modify CCB reference source directories.
- Do not submit `.external/`, `node_modules`, `dist`, or `labs/ts-agent/workspace`.
- Do not require mobile design, code, build, or tests.

## Design Considerations

- Follow `DESIGN.md`: editorial, restrained, monochrome, asymmetric, publication-like.
- Use only existing design tokens.
- Keep controls dense and readable. Avoid landing-page composition.
- Avoid layout shifts when hover cards, toolbars, drawers, and progress controls appear.
- UI feedback must use border, underline, text, or token background changes.

## Technical Considerations

- Prefer typed data and React/CSS over new dependencies.
- Use explicit TypeScript unions and records. Avoid production `as any`.
- Keep tests close to existing `tests/knowledgeGraph.test.js`.
- Browser screenshot checks are required for UI stories.
- If the Codex CLI cannot access in-app browser, stop and report instead of claiming screenshot verification.

## Success Metrics

- All 12 stories have `passes: true`.
- `bun run typecheck`, `bun test`, and `bun run build` pass for every completed story.
- UI stories include screenshot evidence and written checks in `progress.txt`.
- Final app supports graph interaction, search, theme filter, path mode, progress persistence, references, and keyboard use.

## Open Questions

- None for the first Ralph run. Scope is constrained by the 12 stories above.
