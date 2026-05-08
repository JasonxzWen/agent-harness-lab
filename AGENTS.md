# AGENTS.md

这个仓库现在作为个人 Claude Code / AI agent / harness engineering 学习项目使用。

本项目后续按 Codex/AGENTS.md 工作流维护，不再使用根目录 `CLAUDE.md`。旧的 Claude Code 专用说明已归档到 `reference/archive/original-CLAUDE.md`。

## 工作原则

- 默认把 `src/`、`packages/`、`docs/` 当作 CCB 生产级参考源码与白皮书，不做无关重构。
- 展示型前端工程放在 `apps/knowledge-graph/`，它是仓库级作品入口，不放到 `labs/ts-agent/` 内部。
- 新的学习实验优先写在 `labs/ts-agent/`。
- 学习路线、解释性文档写在 `learn/`。
- 源码阅读笔记、问题、实验记录写在 `notes/`。
- 外部资料映射、机制对照、归档写在 `reference/`。

## 技术方向

- TypeScript/Bun 优先。
- 前端展示工程使用 Vite + React + TypeScript，命令、依赖、脚本和验证都优先使用 Bun。
- 目标是自己实现一个小型 Claude Code-like agent harness，再逐层对照 CCB 源码。
- `apps/knowledge-graph/` 用来把 harness 学习成果产品化，展示全栈与前端架构能力。
- 当前重点不是复刻完整 CCB，而是理解并实现 harness 机制：
  - agent loop
  - tool registry
  - tool result write-back
  - planning / TodoWrite
  - context engineering
  - memory
  - permissions
  - subagents
  - background tasks
  - MCP / plugins

## CCB 仓库规则

- Runtime 是 Bun，不要按 Node-only 项目处理。
- 修改 CCB TypeScript 源码后运行：

```bash
bun run typecheck
```

- 项目使用 `bun:bundle` 的 `feature()` 机制。不要把 feature flag 改成普通函数或绕过它。
- `feature('FLAG')` 只能直接用于 `if` 条件或三元表达式条件。
- React/Ink 中 `_c()` 等 React Compiler 输出是反编译产物，不要为了“变整洁”随意重写。
- 生产代码避免 `as any`；测试 mock 必要时可以更宽松。

## Git 规范

提交信息使用 Conventional Commits：

```text
<type>: <描述>
```

常见 type：

- `feat`
- `fix`
- `docs`
- `chore`
- `refactor`

示例：

```text
docs: 整理 Claude Code 学习路线
feat: 添加最小 agent loop 实验
```

## 重要参考

- 知识图谱前端：`apps/knowledge-graph/README.md`
- 知识图谱整体设计：`apps/knowledge-graph/docs/overall-design.md`
- 知识图谱开发计划：`apps/knowledge-graph/docs/development-plan.md`
- 知识图谱里程碑：`apps/knowledge-graph/docs/milestones.md`
- 学习路线：`learn/00-roadmap.md`
- TypeScript/Bun 入门：`learn/01-typescript-bun.md`
- 落地计划：`learn/02-implementation-plan.md`
- 项目规范：`learn/05-project-rules.md`
- 机制对照：`reference/mechanism-comparison.md`
- 最佳实践：`reference/best-practices.md`
- Skills/MCP 计划：`reference/skills-and-mcp-plan.md`
- 协作踩坑记录：`reference/lessons-learned.md`
- 原始说明归档：`reference/archive/original-AGENTS.md`

## 用户偏好

- 用户喜欢用 Mermaid 图理解学习路线、模块关系、组件映射和工作流。
- Mermaid 节点内换行统一使用 `<br/>`，不要使用字面量 `\n`。
- 中文 Markdown 文件不要用 PowerShell 做整文件读写替换；优先用 `apply_patch`，必要时用 Node.js 按 UTF-8 读写并校验。
- 教学时给用户可复制运行的命令，必须带上对应工作路径，例如 `Set-Location D:\learn-cc\labs\ts-agent; bun run dev "hello"`。
- 展示型前端命令也必须带完整路径，例如 `Set-Location D:\learn-cc\apps\knowledge-graph; bun run dev`。
- 教学中改动 agent 代码时，要给出各文件变更摘要，并用 Mermaid 画出这些变更如何组成新的功能模块。
- 能使用时序图表达的时序，就优先使用 Mermaid `sequenceDiagram`，不要改用其他 Mermaid 图形，以免时序关系不直观。
- 教学中展示变更文件时，要标出用户需要重点看的结构、函数、类型定义及其行号。
- 所有教学都需要显示当前章节学习进度条和百分比。
- 用户偏好教学速度快 2-3 倍：少铺垫，快速进入机制、代码、验证和总结。
- 每完成一个完整板块的学习，应该提交一次。
