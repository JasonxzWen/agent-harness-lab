# Knowledge Graph Horizontal Mind Map Refactor PRD

## Introduction / Overview

当前知识图谱已经完成首屏入口减法、控制区收纳、详情折叠和源码 hover 预览，但页面仍然沿用纵向网页结构：首屏之后还需要向下滚动，路线图也偏线性，不能体现“知识脉络”的发散关系。

下一轮更高优先级目标是把 `apps/knowledge-graph` 改成桌面横屏学习工作台：

- 不再要求、设计、编写、构建、测试移动端。
- 页面不依赖纵向下拉展示内容。
- 开页只显示简单说明和继续学习动作。
- 点击继续学习后，内容以横向滑动动画切换到学习工作区。
- 当前纵向堆叠内容改为横屏组件、横向场景、横向详情带。
- 知识路线改成真正的思维导图：中心是 Agent Harness，周围按机制簇展开，点击簇再展开功能点，点击功能点展示 why / what / how、源码入口和命令。

这次重构优先级高于 `tasks/prd-knowledge-graph-agent-comparison.md` 中的 Codex / opencode / Claude Code 对比分析。

## Goals

1. 删除或改写仍然暗示移动端适配、移动端截图、移动端构建、移动端测试的规范。
2. 桌面页面不需要纵向下拉即可进入全部主要内容。
3. 用横向场景切换替代纵向页面堆叠。
4. 点击“继续学习”后，页面内容向左滑动，展示横屏学习工作区。
5. 把现有线性路线图重构为中心发散的思维导图。
6. 功能点详情仍保持 why / what / how、源码入口、命令、引用和测验，但默认以横向折叠组件展示。
7. 继续使用 Playwright 做桌面截图验收。

## User Stories

### US-001: 移除移动端规范残留

As a maintainer, I want the project rules to state that mobile is out of scope so that future iterations do not spend work on mobile layouts or tests.

Acceptance criteria:

- Active specs and docs state: no mobile design, implementation, build, or test is required.
- No active Playwright workflow expects mobile screenshots.
- No active CSS contains mobile breakpoint blocks for this app.
- `rg "mobile|移动端|@media \\(max-width" apps/knowledge-graph DESIGN.md tasks scripts/ralph` returns only explicit desktop-only scope statements or archived files.
- Typecheck passes.
- Tests pass.

### US-002: 桌面单视口应用外壳

As a learner, I want the app to fit into one desktop viewport so that I do not need to scroll down to find the main learning area.

Acceptance criteria:

- `AppShell` becomes a desktop stage shell with a fixed viewport-height learning area.
- On 1365x900 desktop, `document.documentElement.scrollHeight <= window.innerHeight + 2`.
- Header, intro scene, learning workspace, and supporting detail areas fit inside the stage or horizontal panels.
- Page-level vertical scroll is not required for primary content.
- Existing footer/status content is moved into a horizontal panel or compact overlay.
- Verify in browser using Playwright workflow.
- Typecheck passes.
- Tests pass.
- Build passes.

### US-003: 横向场景切换

As a learner, I want the opening explanation to slide left into the learning workspace so that the interface feels like a focused lab rather than a long page.

Acceptance criteria:

- First scene shows only the short intro, current path, first step, and continue action.
- Clicking continue learning switches to the second scene with a left-slide animation.
- Scene state is visible in the UI, for example `Intro` / `Map` / `Detail` markers.
- Keyboard focus moves to the first meaningful control in the new scene after click.
- Reduced motion disables or nearly removes the slide duration.
- Playwright screenshot captures intro scene and post-click map scene.
- Typecheck passes.
- Tests pass.
- Build passes.

### US-004: 思维导图知识脉络

As a learner, I want a real mind-map view so that I can see how Agent Harness mechanisms branch and connect.

Acceptance criteria:

- Replace the current linear route-guide emphasis with a central mind-map component.
- Center node is `Agent Harness`.
- First-level branches at least include: Agent Loop, Tool System, Context System, Safety, Planning, Orchestration, MCP / Plugins.
- Each branch can expand to show related feature nodes.
- Clicking a branch filters or highlights its feature nodes.
- Clicking a feature node opens its why / what / how detail.
- Mind-map edges and nodes are rendered with local React/CSS/SVG, not a screenshot.
- The existing learning paths remain accessible but are secondary to the mind-map.
- Verify in browser using Playwright workflow.
- Typecheck passes.
- Tests pass.
- Build passes.

### US-005: 横屏详情和功能点展开

As a learner, I want feature details to appear as horizontal panels so that long content no longer forces page scrolling.

Acceptance criteria:

- Feature detail uses a horizontal panel strip or side-by-side panes.
- why / what / how, source entry, commands, references, quiz, and comparison are grouped into horizontal cards.
- Cards expose short labels by default; hover / focus slides or expands the card.
- Click pins one card open.
- Source hover preview remains keyboard-accessible.
- No page-level vertical scroll is introduced when details are open.
- Verify in browser using Playwright workflow.
- Typecheck passes.
- Tests pass.
- Build passes.

### US-006: 控制区横向重排

As a learner, I want controls to sit inside the horizontal workspace so that they do not compete with the mind-map.

Acceptance criteria:

- Search, active path, progress, layout, and import/export controls are moved into a horizontal toolbar or compact rail.
- Low-frequency controls remain folded behind marker labels.
- Opening controls does not push the mind-map out of the viewport.
- Hover / focus / active / click feedback remains clear.
- Playwright screenshot covers one collapsed and one expanded control state.
- Typecheck passes.
- Tests pass.
- Build passes.

### US-007: 横屏动效和焦点路径

As a learner, I want slide, hover, focus, and click feedback to make navigation obvious so that I know where I am in the workspace.

Acceptance criteria:

- Scene transitions, branch expansion, card hover, focus, active, and pinned states are visually distinct.
- No box-shadow, gradient, or scale is used.
- `prefers-reduced-motion` keeps the app usable without animated movement.
- Focus never lands outside the visible scene after transition.
- `Esc` closes pinned detail or returns from detail scene to map scene.
- Verify in browser using Playwright workflow.
- Typecheck passes.
- Tests pass.
- Build passes.

### US-008: 桌面视觉回归和文档

As the project owner, I want the horizontal mind-map refactor documented and checked so that the new layout is stable before later agent comparisons.

Acceptance criteria:

- Update `apps/knowledge-graph/README.md`, `docs/development-plan.md`, and `docs/milestones.md`.
- Update `visual:regression` to capture desktop intro scene, mind-map scene, expanded branch, and feature detail panel.
- Playwright asserts no page-level vertical overflow on 1365x900 desktop.
- `visual:regression` remains desktop-only.
- Run:
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run generate:references`
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run visual:regression`
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build:pages`

## Functional Requirements

- The app must be designed as a desktop-only learning workspace.
- The primary app surface must avoid page-level vertical scrolling.
- Main navigation must use horizontal scenes or horizontal panel movement.
- The first scene must stay simple: current learning path, first step, continue action.
- The second scene must center on the mind-map, not on a linear list.
- Mind-map nodes must support branch expansion and feature detail opening.
- Feature detail must preserve why / what / how and source-learning behavior.
- Control and detail content must use compact labels and horizontal expansion.
- The next Codex / opencode / Claude Code comparison work must wait until this refactor is complete.

## Non-Goals

- No mobile layout.
- No mobile screenshot.
- No mobile build or test path.
- No new graph-rendering dependency unless the repo already has it.
- No landing page.
- No long comparison content for Codex / opencode / Claude Code in this iteration.
- No external source body copying.

## Design Considerations

- Treat the app as a lab console, not a scrolling article.
- Scene 1 is the entry card.
- Scene 2 is the mind-map workbench.
- Scene 3 or side panel is the feature detail workspace.
- Use marker labels and horizontal slide-out cards for dense content.
- Keep text short enough to scan in one viewport.
- Use Mermaid-like structure visually, but implement it as React/CSS/SVG so it is interactive.
- Continue using restrained borders, background flips, underlines, and light movement.

## Technical Considerations

- `AppShell` likely needs a scene state such as `intro | map | detail`.
- `KnowledgeGraphCanvas` may need to split graph data from presentation so the mind-map can reuse existing node metadata.
- A new `MindMapCanvas` component may be cleaner than forcing the existing graph layout into a radial structure.
- Existing `DetailDrawer` can be refactored into `FeatureDetailPanel` with horizontal card groups.
- Playwright visual checks should assert:
  - no page-level vertical overflow
  - intro scene visible
  - map scene visible after click
  - expanded branch visible
  - detail panel visible
  - source hover preview visible
- Keep generated screenshots under `output/playwright/`.

## Success Metrics

- On 1365x900 desktop, the user can enter the main learning workspace without scrolling.
- The user can identify the main knowledge branches within 5 seconds.
- The user can click one branch and one feature to see why / what / how without page-level scroll.
- Visual regression passes with desktop-only screenshots.
- All active docs state that mobile is out of scope.

## Open Questions

1. Should the old freeform graph remain as an optional scene, or should the mind-map fully replace it?
2. Should horizontal movement use scene buttons only, or also wheel/trackpad horizontal scrolling?
3. Should feature detail be a third scene, or a right-side panel inside the mind-map scene?
4. Should existing learning paths become colored overlays on the mind-map branches?
