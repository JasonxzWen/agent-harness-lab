# Knowledge Graph Agent Comparison PRD

## Introduction / Overview

`Harness Lab` 下一轮要从“单一 Claude Code-like harness 学习图谱”扩展为“同一需求下多种 coding agent 的实现对比”。重点不是比较基础的读写文件、运行命令、搜索代码，而是比较更能体现 harness 设计差异的能力：

- 上下文压缩
- 记忆管理
- 智能体编排
- 权限和沙箱
- MCP / 插件 / 技能
- 会话恢复和任务状态

页面应继续保持当前清晰度重构后的形态：中间用路线图作为使用手册，点击一个能力后展开 why / what / how、不同 agent 的实现差异、关键源码入口和本仓库实验入口。默认不展开大量文字。

优先级说明：本 PRD 排在 `tasks/prd-knowledge-graph-horizontal-mind-map-refactor.md` 之后。先完成横屏工作台和思维导图重构，再添加 Codex / opencode / Claude Code 对比内容。

本轮新增分析对象：

- Codex：`https://github.com/openai/codex`
- opencode：`https://github.com/anomalyco/opencode`
- Claude Code 补充参考：优先使用当前仓库已有引用；如缺少原始结构，可补充 `https://github.com/jarmuine/claude-code`

## Goals

1. 增加“同一能力，多种 agent 实现”的比较视图。
2. 对上下文压缩、记忆管理、智能体编排等高级能力建立结构化数据。
3. 为 Codex、opencode、Claude Code 建立来源索引，只保存链接、路径、摘要和边界说明。
4. 每个比较点继续按 why / what / how 展示。
5. 用 Mermaid-like 路线图展示自下而上的学习路径：先理解需求，再看三种实现，再回到本仓库实验。
6. 不要求设计、编写、构建、测试移动端。

## User Stories

### US-001: 建立 agent 比较数据模型

As a learner, I want each advanced capability to map to Codex, opencode, Claude Code, and local lab references so that I can compare the same requirement across implementations.

Acceptance criteria:

- 新增或扩展 typed data，能表达 `capability`、`agent`、`sourceReferences`、`why`、`what`、`how`、`localExperiment`。
- 首批 capability 至少包含：context compact、memory management、agent orchestration。
- 每个 agent 引用只保存仓库 URL、文件路径、短摘要和边界提示。
- 不复制 Codex、opencode、Claude Code、CCB、skill-hub、第三方正文或本地 `SKILL.md` 内容。
- Typecheck passes.
- Tests pass.

### US-002: 新增比较路线索引

As a learner, I want a route-map style comparison index so that I know whether to start from context, memory, or orchestration.

Acceptance criteria:

- 新增“Agent 对比路线”入口，不替代现有 Beginner Path。
- 路线图自下而上展示：需求 -> Codex -> opencode -> Claude Code -> 本仓库实验。
- 点击 capability 节点后，右侧或当前详情区域展示对应比较内容。
- 默认只露出节点标识和短摘要，不展示长表格。
- Hover / focus / active / click 反馈清楚。
- Verify in browser using Playwright workflow.
- Typecheck passes.
- Tests pass.
- Build passes.

### US-003: 上下文压缩对比

As a learner, I want to compare context compaction across agents so that I can see how long sessions stay usable.

Acceptance criteria:

- 比较 Codex、opencode、Claude Code 和本仓库实验对上下文压缩的触发方式、保留内容、恢复方式。
- Codex 参考至少包含 `codex-rs/core/src/compact.rs` 和公开 memory/compact 文档入口。
- opencode 参考至少包含 agents 文档中的 hidden compaction agent。
- Claude Code 参考优先使用当前仓库已有 `learn-claude-code` compact 教学内容；必要时补充 `jarmuine/claude-code` 的 compact 目录级引用。
- 页面显示一个可视化流程：原始历史 -> 摘要 -> 重新注入关键上下文 -> 继续执行。
- Verify in browser using Playwright workflow.
- Typecheck passes.
- Tests pass.
- Build passes.

### US-004: 记忆管理对比

As a learner, I want to compare memory management across agents so that I can distinguish project rules, session summary, and long-term memory.

Acceptance criteria:

- 比较 Codex memory pipeline、opencode session/summary 相关 agent、Claude Code memory / memdir / extractMemories / teamMemorySync。
- 说明哪些记忆是启动加载，哪些是会话内提取，哪些需要用户显式管理。
- 加入本仓库 `labs/ts-agent/src/memory.ts` 的实验入口。
- 页面用分层卡展示：输入来源、筛选规则、写回位置、失效风险。
- 不展示第三方源码正文，只展示路径和短摘要。
- Verify in browser using Playwright workflow.
- Typecheck passes.
- Tests pass.
- Build passes.

### US-005: 智能体编排对比

As a learner, I want to compare subagents and agent orchestration so that I understand context isolation, permissions, and result write-back.

Acceptance criteria:

- 比较 Codex MCP server / subagent / session 延续能力、opencode primary agent 与 subagent、Claude Code AgentTool / coordinator / TeamCreateTool。
- 对每个 agent 标出：是否隔离上下文、是否有权限分层、是否支持并行、结果如何回到主线程。
- 页面用 sequenceDiagram 或 React 可视化展示父 agent -> 子 agent -> 结果摘要 -> 主线程写回。
- 加入本仓库 subagent 实验入口或计划入口。
- Verify in browser using Playwright workflow.
- Typecheck passes.
- Tests pass.
- Build passes.

### US-006: 来源边界和引用索引

As a maintainer, I want comparison sources to be explicit and bounded so that the project avoids copying external source bodies.

Acceptance criteria:

- 更新 `reference/sources.md` 或新增同级来源文档，记录 Codex、opencode、jarmuine/claude-code 的用途和边界。
- 更新引用索引生成逻辑或数据校验，确保外部 agent 源只保存 URL、路径、短摘要。
- Tests cover forbidden body-copy cases.
- Typecheck passes.
- Tests pass.

### US-007: 视觉回归和验收文档

As the project owner, I want the agent comparison iteration documented and visually checked so that the next state is easy to review.

Acceptance criteria:

- 更新 `apps/knowledge-graph/README.md`、`docs/development-plan.md`、`docs/milestones.md`。
- Playwright 截图覆盖比较路线入口、一个 capability 展开态、一个源码边界提示。
- `visual:regression` 仍只覆盖桌面。
- 运行：
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run generate:references`
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`
  - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run visual:regression`

## Functional Requirements

- 新增 agent comparison 数据层，不把对比内容硬编码在 JSX 中。
- 支持按 capability 过滤：context compact、memory、orchestration、permissions、MCP/plugins。
- 支持按 agent 过滤：local lab、Codex、opencode、Claude Code。
- 每个 capability 必须有 why / what / how。
- 每个外部引用必须有边界提示：只读路径和摘要，不复制正文。
- 默认 UI 不使用长表格；表格信息要折叠或变成标识卡。
- 不新增移动端规范、代码、构建或测试。

## Non-Goals

- 不克隆或提交 Codex、opencode、Claude Code 源码。
- 不复制外部仓库正文或大段代码。
- 不做性能 benchmark。
- 不评判模型质量，只比较 harness 机制。
- 不加入移动端适配。

## Design Considerations

- 入口应该是一个路线图，而不是表格首页。
- 详细内容采用“标识 + 滑出详情”的卡片结构。
- capability 展开后先显示本需求的 why / what / how，再显示各 agent 差异。
- 源码引用 hover / focus 只展示本仓库 lab 短摘录；外部 agent 只展示路径和边界说明。
- 动效使用边框、下划线、背景切换、轻量位移；继续遵守 `DESIGN.md`。

## Technical Considerations

- Codex 当前公开仓库以 Rust 为主，相关入口包括：
  - `codex-rs/core/src/compact.rs`
  - `codex-rs/core/src/memories/README.md`
  - `docs/advanced.md`
- opencode 公开文档明确区分 primary agents、subagents、hidden compaction / title / summary agents。
- `jarmuine/claude-code` 是非官方研究快照，只能作为补充目录级参考。引用时必须标注非官方、研究用途、不要复制正文。
- 本仓库已有 `reference/vendor/learn-claude-code`，可以优先用其教学章节映射 compact、subagent、agent teams。

## Success Metrics

- 用户能从一个路线图进入“上下文压缩 / 记忆 / 编排”任一比较点。
- 每个比较点能看出 Codex、opencode、Claude Code 和本仓库实验的差异。
- 页面默认信息量不超过当前清晰度重构后的密度。
- `bun run typecheck`、`bun test`、`bun run build`、`bun run visual:regression` 通过。

## Open Questions

1. Claude Code 对比是否只用当前仓库已有 `learn-claude-code`，还是允许引用 `jarmuine/claude-code` 的目录和文件路径。
2. 是否需要把 Codex 和 opencode 的引用更新为固定 commit SHA，避免上游 main/dev 变动。
3. 本轮是否只做 3 个高级能力，还是同时加入 permissions、MCP/plugins、session recovery。
4. 是否需要在 `labs/ts-agent` 补一个最小 agent orchestration 实验，还是先只做知识图谱对比展示。

## Source Links

- Codex repository: https://github.com/openai/codex
- Codex compact source: https://github.com/openai/codex/blob/main/codex-rs/core/src/compact.rs
- Codex memory pipeline: https://github.com/openai/codex/blob/main/codex-rs/core/src/memories/README.md
- opencode repository: https://github.com/anomalyco/opencode
- opencode agents docs: https://opencode.ai/docs/agents/
- Claude Code research snapshot: https://github.com/jarmuine/claude-code
- Local teaching reference: `reference/vendor/learn-claude-code`
