# 落地计划

这个计划把学习路线拆成可执行的项目迭代。每一轮都包含：实现、学习、源码对照、记录。

如果你想按“每个模块先学习，后构建”的节奏走，优先看 `learn/03-zero-to-one-plan.md`。

开始构建前，先按 `learn/04-environment-setup.md` 完成本地环境初始化。

## 展示型前端主线：Knowledge Graph

状态：已规划。

目标：

- 在 `apps/knowledge-graph/` 建立仓库级展示型前端工程。
- 把 Claude Code-like harness 的学习路线、机制对照和 lab 源码引用组织成可交互知识图谱。
- 展示 TypeScript 数据建模、React 组件设计、交互设计、可访问性和 Bun 工程化能力。

文档：

- `apps/knowledge-graph/README.md`
- `apps/knowledge-graph/docs/overall-design.md`
- `apps/knowledge-graph/docs/development-plan.md`
- `apps/knowledge-graph/docs/milestones.md`

阶段：

1. 工程骨架：Vite + React + TypeScript + Bun scripts。
2. 图谱数据模型：知识节点、边、引用和路径。
3. React Flow 主画布：缩放、拖拽、自定义节点。
4. 学习工作流：hover 摘要、detail drawer、引用面板、demo 命令。
5. 筛选和进度：主题、路径、搜索、progress、对照模式。
6. 展示级打磨：可访问性、响应式、内容边界校验。

验收：

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
Set-Location D:\learn-cc\apps\knowledge-graph; bun test
```

建议提交：

```text
docs: plan root knowledge graph app
feat: scaffold knowledge graph app
feat: add typed harness graph data
feat: render harness graph canvas
feat: add graph learning workflow
fix: polish knowledge graph UX and verification
```

## 第 1 轮：项目整理与最小入口

状态：已开始。

目标：

- 把仓库从 CCB 项目入口改成个人学习入口。
- 建立 `labs/ts-agent`。
- 跑通一个不依赖真实模型的 fake agent loop。

产出：

- `README.md`
- `AGENTS.md`
- `learn/00-roadmap.md`
- `learn/01-typescript-bun.md`
- `reference/mechanism-comparison.md`
- `labs/ts-agent`

验收：

```powershell
Set-Location D:\learn-cc\labs\ts-agent; bun run dev "hello agent"
```

你应该能看到 messages 数组中依次出现：

1. user message
2. assistant tool_use
3. user tool_result
4. assistant final text

## 第 2 轮：真实 Tool Registry

目标：

- 把 `echo` 扩展成多个工具。
- 学习 TypeScript 的 union type、Record、函数类型。

实现：

- `read_file`
- `write_file`
- `list_files`
- `run_shell`

源码对照：

- `src/Tool.ts`
- `src/tools.ts`
- `packages/builtin-tools/src/tools/FileReadTool`
- `packages/builtin-tools/src/tools/BashTool`

验收：

- agent 能通过工具读写 `labs/ts-agent/workspace/` 下的文件。
- shell 工具只允许执行安全命令。

## 第 3 轮：接入真实模型

目标：

- 把 `fakeModel()` 替换为真实 Anthropic Messages API 调用。
- 学习 API client、环境变量、异步错误处理。

实现：

- `src/model.ts`
- `.env.example`
- tool schema 转换

验收：

```powershell
Set-Location D:\learn-cc\labs\ts-agent; $env:ANTHROPIC_API_KEY="..."; bun run dev "create hello.txt"
```

agent 能调用工具创建文件，并把工具结果写回 messages。

## 第 4 轮：TodoWrite 与计划状态

目标：

- 给 agent 一个显式计划工具。
- 理解 Todo 和 Task 的区别。

实现：

- `todo_write`
- `todo_read`
- `todos.json`

源码对照：

- CCB Todo/Task tools
- `src/tasks/`

验收：

- agent 在复杂任务前能先写 Todo。
- Todo 状态能从 pending 更新到 in_progress / done。

## 第 5 轮：Context Engineering

目标：

- 学会 system prompt 不是静态字符串，而是动态构造的输入管线。

实现：

- `src/context.ts`
- `AGENT.md` 或 `PROJECT.md` 读取
- memory 文件
- git 状态摘要

源码对照：

- `src/context.ts`
- `src/utils/claudemd.ts`

验收：

- agent 能在 system prompt 中看到项目规则。
- 修改 memory 后，下一轮模型输入会变化。

## 第 6 轮：Permissions

目标：

- 给工具执行加上边界。

实现：

- `allow`
- `ask`
- `deny`
- 命令风险分类
- 写文件目录限制

源码对照：

- `packages/builtin-tools/src/tools/BashTool`
- `src/components/permissions/`

验收：

- 危险命令不会直接执行。
- 文件写入只能发生在实验 workspace 内。

## 第 7 轮：Subagents 与 Background Tasks

目标：

- 理解子 agent 是 context boundary。
- 理解后台任务是 runtime lane，不是第二个主循环。

实现：

- `subagent.ts`
- `background.ts`
- JSONL 事件日志

源码对照：

- AgentTool
- task/background/daemon 相关模块

验收：

- 主 agent 能把一个子任务交给子 agent。
- 长命令可以后台执行，完成后写回观察结果。

## 第 8 轮：Plugin / MCP Lite

目标：

- 理解外部能力如何进入同一个工具执行路径。

实现：

- plugin manifest
- plugin loader
- external tool registration

源码对照：

- `src/plugins/`
- `packages/mcp-client/`

验收：

- 一个插件能注册新工具。
- 插件工具和内置工具共享 permission 与 tool_result write-back。

## 每轮固定动作

每一轮结束都做四件事：

1. 更新 `labs/ts-agent/README.md`。
2. 在 `notes/source-reading/` 写源码对照笔记。
3. 在 `reference/mechanism-comparison.md` 补充差异。
4. 能运行的代码必须保持可运行。

展示型前端每个完整阶段结束也做四件事：

1. 更新 `apps/knowledge-graph/README.md` 或 `apps/knowledge-graph/docs/`。
2. 运行 `Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck`。
3. 运行 `Set-Location D:\learn-cc\apps\knowledge-graph; bun run build`。
4. 做 diff review，确认没有复制 `.external/skill-hub`、第三方正文或 CCB 生产源码内容。
