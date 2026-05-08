# 从 0 到 1 学习计划

这个计划按“先学习，后构建，再对照”的节奏推进。

每个模块都遵循同一个循环：

```text
学习概念 -> 阅读最小资料 -> 用 TypeScript/Bun 构建 -> 运行验证 -> 对照 CCB 源码 -> 记录问题
```

目标不是一次性读懂 Claude Code，而是自底向上搭一个小型 Claude Code-like agent harness。

## 模块 0：环境与语言基础

学习目标：

- 理解 TypeScript 为什么适合描述 agent 消息、工具和状态。
- 理解 Bun 在 CLI 项目中的角色。
- 能运行一个 `.ts` 文件，能看懂基本类型错误。

先学习：

- `learn/01-typescript-bun.md`
- TypeScript：type、interface、union、async/await、Record
- Bun：`bun run`、`bun test`、`package.json scripts`

后构建：

- 跑通 `labs/ts-agent/src/main.ts`
- 写一个最小 `hello agent`

验收：

```bash
cd labs/ts-agent
bun install
bun run dev "hello agent"
```

## 模块 1：Message 与 Agent Loop

学习目标：

- 理解 agent 的最小工作流程。
- 理解 `messages` 不是聊天展示，而是下一轮推理输入。
- 理解 `tool_result` 必须写回 messages。

先学习：

- https://learn.shareai.run/zh/s01/
- `reference/mechanism-comparison.md` 中 Agent loop 一行

后构建：

- `src/messages.ts`
- `src/loop.ts`
- fake model
- fake `tool_use`
- tool result write-back

验收：

- 输入一条 user message。
- fake model 产生一次 tool_use。
- harness 执行工具。
- tool_result 被追加回 messages。
- fake model 最后返回文本。

对照源码：

- `src/query.ts`
- `src/QueryEngine.ts`
- `src/services/api/claude.ts`

记录：

- 在 `notes/source-reading/01-agent-loop.md` 写下教学版和 CCB 生产版差异。

## 模块 2：Tool Registry

学习目标：

- 理解工具不是普通函数，而是模型可发现、可描述、可执行的动作接口。
- 理解 dispatch map：`tool name -> handler`。
- 理解工具输入需要 schema 和运行时校验。

先学习：

- Learn Claude Code s02 工具使用
- Anthropic Tool Use：https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview

后构建：

- `src/tools.ts`
- `src/tool-schema.ts`
- 工具：
  - `echo`
  - `read_file`
  - `write_file`
  - `list_files`

验收：

- 工具调用可以被统一路由。
- 未知工具返回结构化错误。
- 文件工具只操作 `labs/ts-agent/workspace/`。

对照源码：

- `src/Tool.ts`
- `src/tools.ts`
- `packages/builtin-tools/src/tools/FileReadTool`
- `packages/builtin-tools/src/tools/FileWriteTool`

## 模块 3：真实模型接入

学习目标：

- 理解模型 API 和 harness 的边界。
- 理解 tool schema 如何传给模型。
- 理解模型返回的 `tool_use` 如何变成真实工具执行。

先学习：

- Anthropic Messages API：https://docs.anthropic.com/en/api/messages
- Anthropic Tool Use：https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview

后构建：

- `src/model.ts`
- `.env.example`
- `ANTHROPIC_API_KEY`
- 把 fake model 替换成真实 API 调用

验收：

```bash
bun run dev "在 workspace 里创建 hello.txt，内容是 hello"
```

agent 应该通过工具创建文件，而不是只输出建议。

对照源码：

- `src/services/api/claude.ts`
- `src/utils/model/providers.ts`

## 模块 4：TodoWrite 与计划状态

学习目标：

- 理解复杂任务为什么需要显式计划。
- 区分 Todo、Task、后台任务。

先学习：

- Learn Claude Code s03 TodoWrite

后构建：

- `src/todo.ts`
- `todo_write`
- `todo_read`
- `workspace/todos.json`

验收：

- 多步骤任务开始前，agent 能写 Todo。
- 每完成一步，Todo 状态会变化。

对照源码：

- `src/tasks/`
- Todo/Task 相关工具

## 模块 5：Context Engineering

学习目标：

- 理解 system prompt 是动态组装出来的。
- 理解项目上下文、规则、memory 如何进入模型输入。

先学习：

- Learn Claude Code s05 Skills
- Learn Claude Code s06 Context Compact
- Learn Claude Code s09 Memory
- Learn Claude Code s10 System Prompt
- CCB 白皮书上下文工程部分：https://ccb.agent-aura.top/docs/introduction/why-this-whitepaper

后构建：

- `src/context.ts`
- `PROJECT.md`
- `memory.md`
- 简单 skill manifest
- 简单 compact 摘要

验收：

- 修改 `PROJECT.md` 后，模型行为能受规则影响。
- memory 不直接硬编码在代码里，而是由 harness 加载。

对照源码：

- `src/context.ts`
- `src/utils/claudemd.ts`
- `src/services/compact/`

## 模块 6：Permissions

学习目标：

- 理解安全不是“模型乖不乖”，而是 harness 如何限制动作。
- 理解 allow / ask / deny。

先学习：

- Learn Claude Code s07 权限系统
- CCB 白皮书安全与权限部分：https://ccb.agent-aura.top/docs/introduction/why-this-whitepaper

后构建：

- `src/permissions.ts`
- shell 命令风险分类
- 文件写入目录限制
- 危险动作返回 ask/deny

验收：

- 删除文件、访问 workspace 外路径、危险 shell 命令不会静默执行。
- 工具结果会把拒绝原因写回 messages。

对照源码：

- `packages/builtin-tools/src/tools/BashTool`
- `src/components/permissions/`

## 模块 7：Hooks 与 Error Recovery

学习目标：

- 理解 hooks 是生命周期观察/拦截点。
- 理解错误不是终点，而是下一轮推理的观察结果。

先学习：

- Learn Claude Code s08 Hook 系统
- Learn Claude Code s11 错误恢复

后构建：

- `src/hooks.ts`
- `beforeToolUse`
- `afterToolUse`
- `onError`
- 工具错误结构化写回

验收：

- 工具执行前后能记录事件。
- 工具失败后，agent 能看到错误并尝试下一步。

对照源码：

- `src/hooks/`
- `src/query.ts`

## 模块 8：Subagents

学习目标：

- 理解 subagent 首先是 context boundary。
- 理解为什么子任务需要独立 messages。

先学习：

- Learn Claude Code s04 子代理

后构建：

- `src/subagent.ts`
- 子 agent 独立 messages
- 主 agent 接收子 agent 总结

验收：

- 主 agent 能委托一个读取/搜索任务。
- 子 agent 的详细过程不会污染主 messages，只返回总结。

对照源码：

- AgentTool
- task/subagent 相关实现

## 模块 9：Task Runtime 与 Background Tasks

学习目标：

- 理解任务如何持久化。
- 理解后台任务不是第二个主循环。

先学习：

- Learn Claude Code s12 任务系统
- Learn Claude Code s13 后台任务
- Learn Claude Code s14 定时调度

后构建：

- `src/tasks/`
- JSONL event log
- background command
- task graph

验收：

- 长任务可以后台执行。
- 完成后产生观察结果，重新进入主 loop。

对照源码：

- `src/tasks/`
- `src/daemon/`
- background/session 相关实现

## 模块 10：MCP 与 Plugin Lite

学习目标：

- 理解外部能力如何接入同一条工具路径。
- 理解 plugin/MCP 不改变 agent loop。

先学习：

- Learn Claude Code s19 MCP 与插件
- Model Context Protocol：https://modelcontextprotocol.io/

后构建：

- `src/plugins/`
- plugin manifest
- plugin loader
- 外部工具注册

验收：

- 插件能注册一个新工具。
- 插件工具和内置工具共享权限、执行和 tool_result write-back。

对照源码：

- `src/plugins/`
- `packages/mcp-client/`
- `packages/builtin-tools/`

## 模块 11：Worktree 与多 Agent 协作

学习目标：

- 理解工作隔离为什么重要。
- 理解多 agent 协作的关键是状态、协议、隔离。

先学习：

- Learn Claude Code s15 Agent 团队
- Learn Claude Code s16 团队协议
- Learn Claude Code s17 自主代理
- Learn Claude Code s18 Worktree 隔离

后构建：

- 简化 mailbox
- 简化 team protocol
- 简化 worktree manager

验收：

- 两个 agent 不写同一份工作目录。
- 协作消息有 request id / response id。

对照源码：

- coordinator/swarm/task/worktree 相关模块

## 每个模块的学习产物

每个模块结束必须留下四类产物：

1. 可运行代码：`labs/ts-agent/src/...`
2. 学习笔记：`notes/basics/` 或 `notes/source-reading/`
3. 对照记录：更新 `reference/mechanism-comparison.md`
4. 实验记录：更新 `notes/experiments.md`

## 当前第一步

从模块 0 和模块 1 开始：

1. 安装 Bun。
2. 运行当前 fake loop。
3. 手动画出 messages 的增长过程。
4. 确认你能解释：为什么 agent loop 的关键是 tool_result write-back。

具体环境初始化命令见 `learn/04-environment-setup.md`。
