# Knowledge Graph Clarity Refactor PRD

## Introduction / Overview

当前 `apps/knowledge-graph` 已完成 M3-M6 功能，但页面把搜索、筛选、路径、布局、进度、摘要、画布、详情、引用、测验和能力卡同时展开。功能完整不等于好学。用户进入页面后，第一眼看到的是大量按钮、节点和文字，缺少“先做什么、看什么、下一步去哪”的清晰路径。

这次重构目标是把知识图谱从“功能全集”改成“可学习的操作台”：首屏先给入口和路线，复杂控制默认收纳；每个功能点要能看到效果预览；每个知识点在学习时能直接看到相关代码；交互反馈要更强，但仍遵守 `DESIGN.md` 的克制风格，不使用阴影、渐变、缩放或新图标库。

## Current State Reflection

- 首屏元素过多：hero、控制区、摘要卡、画布、详情抽屉和下方能力卡同时出现，视觉重心分散。
- 控制区过满：搜索、主题、路径、布局、进度、缩放、导入导出都直接展开，用户难判断第一步。
- 可视化不足：已有图谱和 why / what / how，但缺少对“搜索、路径、进度、代码查看”等界面功能的效果预览。
- 代码可见性不足：引用面板只显示路径，用户要离开页面才能看代码，学习链路断开。
- 动态反馈不足：hover / focus / active 已有基础反馈，但缺少被捕捉、被预览、被引导的连续感。
- 文案偏多：详情抽屉把 why / what / how、测验、引用、命令、误解、对照说明连续堆叠。
- 路线指引不足：路径按钮能切换，但没有明确当前第几步、下一步、完成后做什么。

## Goals

1. 首屏只保留一个清晰起点：选择路径或继续当前节点。
2. 把低频控制收纳，默认只展示搜索、当前路径和下一步。
3. 给主要界面能力增加轻量效果预览，让用户不用试错也能理解功能。
4. 在详情和引用区增加代码预览，hover / focus 指定区域即可看到本仓库相关代码。
5. 增强 hover、focus、active、click 反馈，让交互更明确。
6. 简化详情抽屉，把长内容分组收纳。
7. 增强学习路线：当前步、下一步、已学节点和建议动作都要可见。

## User Stories

### US-001: 首屏学习入口减法

As a learner, I want the first screen to show one primary learning path entry so that I know where to start.

Acceptance criteria:

- 首屏新增或改造一个 `学习入口` 区域，明确显示当前推荐路径、第一步节点和继续学习按钮。
- hero 文案缩短，避免和图谱控制区重复说明。
- 下方能力卡不再抢首屏注意力，可以减少、收纳或改成简短状态行。
- UI story 必须使用 Playwright 截图。
- 说明 hover / focus / active / click 反馈。
- 说明全局思维检查：元素是否减少、布局是否仍挤、用户第一步是否清楚。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-002: 控制区分层收纳

As a learner, I want advanced controls to be grouped and collapsible so that I can focus on reading the graph first.

Acceptance criteria:

- 搜索、当前路径和下一步保持默认可见。
- 主题筛选、布局、进度导入导出、缩放等低频控制进入清晰分组，可展开 / 收起。
- 收起状态仍能看见当前筛选或进度摘要。
- 展开、收起、按钮 hover、focus、active、click 状态清楚。
- UI story 必须使用 Playwright 截图。
- 全局思维检查必须说明控制数量是否下降、画布是否更突出。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-003: 学习路线指引

As a learner, I want a route guide that shows current step, next step, and progress so that I can follow the graph without guessing.

Acceptance criteria:

- 新增或改造路径指引区，显示当前路径、当前节点、下一步节点、已开始数量。
- 点击路径步骤能聚焦对应节点或打开详情。
- 当没有选择节点时，引导用户从路径第一步开始。
- UI story 必须使用 Playwright 截图。
- 全局思维检查必须说明用户是否知道下一步。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-004: 功能效果预览

As a learner, I want to see visual previews of key interface functions so that I understand what each feature changes before interacting.

Acceptance criteria:

- 增加轻量 `效果预览` 区域，展示搜索、路径、进度、代码预览四类功能效果。
- 每个预览是 React/CSS 轻量组件或静态结构，不使用截图位图、不新增图标库。
- hover / focus 预览卡时显示更具体的效果说明或状态变化。
- 文案短，默认不超过两行。
- UI story 必须使用 Playwright 截图。
- 全局思维检查必须说明该区域是否增加负担，是否需要收纳。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-005: 源码 hover 预览

As a learner, I want to hover or focus a source reference and see a small code excerpt so that I can connect the concept to local code immediately.

Acceptance criteria:

- 为本仓库 lab source 引用增加代码预览数据，只使用 `labs/ts-agent` 本仓库代码短摘录。
- hover / focus 本仓库源码引用时显示代码预览。
- CCB mapping、外部链接、skill 内容不得展示正文，只显示路径和边界提示。
- 代码预览必须可键盘触发，不依赖鼠标。
- UI story 必须使用 Playwright 截图。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-006: 详情抽屉分组收纳

As a learner, I want detail content to be grouped into compact sections so that I can choose between explanation, code, references, and quiz.

Acceptance criteria:

- 详情抽屉默认先展示 why / what / how 和主要代码入口。
- 引用、命令、常见误解、对照说明进入清晰分组，可展开 / 收起。
- 分组标题必须说明里面是什么，不写长解释。
- `Esc` 关闭和焦点返回不回退。
- UI story 必须使用 Playwright 截图。
- 全局思维检查必须说明详情内容是否变短、桌面是否更容易扫读。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-007: 交互动效和焦点捕捉

As a learner, I want hover and focus interactions to visibly connect controls, graph nodes, summary, and detail so that I can feel what changed.

Acceptance criteria:

- 选中、hover、focus 节点时，摘要、路径指引和详情入口有一致的状态反馈。
- 控件 hover / focus / active 使用边框、下划线、背景切换或轻量 CSS 状态，不使用 `box-shadow`、渐变、缩放。
- 支持 `prefers-reduced-motion`，不强制动画。
- 新增动效不影响键盘和桌面阅读。
- UI story 必须使用 Playwright 截图。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`

### US-008: 最终验收、文档和视觉回归

As the project owner, I want the refactor documented and verified so that the project state is clear after the Ralph loop finishes.

Acceptance criteria:

- 更新 `apps/knowledge-graph/README.md`、`docs/development-plan.md`、`docs/milestones.md`，说明本次清晰度重构完成。
- 更新或扩展 Playwright 视觉回归，覆盖首屏、详情抽屉、源码 hover 预览。
- 测试覆盖新增源码预览边界，不复制 CCB、外部正文或 skill 内容。
- 最终截图包含桌面。
- 不要求设计、编写、构建、测试移动端。
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run generate:references`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`
- `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run visual:regression`

## Functional Requirements

1. The graph page must expose a primary learning start action near the first viewport.
2. Advanced controls must be grouped, not all expanded by default.
3. Key features must have visual previews.
4. Source references must support local code preview for allowed lab files.
5. Drawer content must be shorter by default and allow focused expansion.
6. Route guidance must show next action.
7. Interaction states must be visible and consistent.
8. Browser screenshots and Bun verification must pass before marking completion.

## Non-Goals

- No new graph engine, D3, React Flow, state library, or icon library.
- No backend, auth, analytics, remote logging, or external data fetch.
- No copying CCB source, external article body text, `.external/skill-hub`, local skill bodies, `node_modules`, `dist`, or `labs/ts-agent/workspace`.
- No full redesign outside `apps/knowledge-graph` unless needed for docs or Ralph files.

## Design Considerations

- Keep the editorial minimal visual system from `DESIGN.md`.
- Prefer fewer visible regions.
- Use progressive disclosure before adding new permanent panels.
- Do not use card-in-card layouts.
- Use border, underline, token background, and focus outline for interaction feedback.
- Do not add mobile-specific design, code, build, or tests.

## Technical Considerations

- Work in `apps/knowledge-graph`.
- Use Bun for commands.
- Keep TypeScript strict; no production `any`.
- Use existing data modules where possible.
- New code preview data should live in typed data, not inline inside JSX.
- Tests should enforce content boundaries and code preview safety.
- Ralph must run on `main` because the repository rule says not to create extra development branches.

## Success Metrics

- A first-time user can name the next action within 5 seconds: choose / continue a path, then click the current node.
- The visible control count in the default graph area is reduced.
- Code preview is visible from at least lab source references without leaving the page.
- `typecheck`, `test`, `build`, and visual regression pass.

## Open Questions

- Whether future iterations should replace text-heavy node detail copy with more diagrams.
- Whether code preview should eventually read snippets from files at build time instead of typed data.
- Whether a separate node list view is still needed after route guidance and search are improved.
