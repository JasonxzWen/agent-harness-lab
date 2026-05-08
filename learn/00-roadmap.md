# Claude Code Harness 学习路线

这条路线以 TypeScript/Bun 为主线，以 Claude Code 为样本，目标是自己实现一个小型 agent harness，再回头读懂 CCB 的生产级实现。

完整参考链接见 `reference/links.md`。从 0 到 1 的分模块计划见 `learn/03-zero-to-one-plan.md`。运行环境初始化见 `learn/04-environment-setup.md`。项目规范见 `learn/05-project-rules.md`。可视化地图见 `learn/06-mermaid-learning-map.md`。

## 总原则

先写小系统，再读大系统。

不要一开始硬啃 `src/main.tsx` 和 `src/query.ts` 的全部细节。更稳的方式是：每学一个机制，先在 `labs/ts-agent` 中写出教学版，再对照 CCB 源码看生产版为什么复杂。

## 阶段 0：基础补齐

目标：能看懂并改写 TypeScript/Bun CLI 项目。

学习内容：

- TypeScript：类型、interface、union、async/await、ESM import/export。
- Bun：运行 `.ts` 文件、包管理、脚本、测试。
- CLI：参数、环境变量、stdin/stdout、退出码。
- JSON/JSONL：消息、工具参数、任务日志。
- API：request/response、streaming、重试。

产出：

- `learn/01-typescript-bun.md`
- `notes/basics/typescript.md`
- `notes/basics/bun.md`

## 阶段 1：Agent Loop

对应资料：

- Learn Claude Code s01 Agent 循环
- 当前仓库：`src/query.ts`、`src/QueryEngine.ts`、`src/services/api/claude.ts`

要实现：

- `labs/ts-agent/src/messages.ts`
- `labs/ts-agent/src/loop.ts`
- `labs/ts-agent/src/main.ts`

关键理解：

```text
messages -> model -> tool_use -> execute tool -> tool_result -> messages
```

达标标准：

- 能解释为什么 tool result 必须写回 messages。
- 能用 TypeScript 写出一个最小 loop。
- 能指出 CCB 生产版 loop 多了 streaming、retry、compaction、permission interruption。

## 阶段 2：Tool Registry

对应资料：

- Learn Claude Code s02 工具使用
- 当前仓库：`src/Tool.ts`、`src/tools.ts`、`packages/builtin-tools/src/tools/`

要实现：

- 工具 schema
- `name -> handler` dispatch map
- `read_file`
- `write_file`
- `list_files`
- `run_shell`

关键理解：

- 工具不是随便给模型的函数。
- 一个好工具需要：清晰描述、输入 schema、执行边界、结果格式、错误格式。

## 阶段 3：Planning 与 TodoWrite

对应资料：

- Learn Claude Code s03 TodoWrite
- 当前仓库：Todo/Task 相关工具与 `src/tasks/`

要实现：

- `todo_write`
- `todo_read`
- 简单任务状态：pending / in_progress / done

关键理解：

- Todo 是会话内计划。
- Task 是可持久化、可协调、可恢复的工作单元。

## 阶段 4：Context Engineering

对应资料：

- Learn Claude Code s05 Skills、s06 Context Compact、s09 Memory、s10 System Prompt
- 当前仓库：`src/context.ts`、`src/utils/claudemd.ts`、`src/services/compact/`

要实现：

- 动态 system prompt
- 项目上下文注入
- 简单 memory 文件
- 简单 compact 策略
- skill manifest 与按需加载

关键理解：

- 模型没有真正的项目记忆，harness 负责构造“工作上下文”。
- skill 应该按需注入，不应该一开始全部塞进 system prompt。

## 阶段 5：Permissions 与 Safety

对应资料：

- Learn Claude Code s07 权限系统
- 当前仓库：`packages/builtin-tools/src/tools/BashTool/`、`src/components/permissions/`

要实现：

- allow / ask / deny
- shell 命令风险分类
- 文件写入目录限制

关键理解：

- permission 不是一个布尔值，而是一条 pipeline。
- harness 要区分模型想做什么、用户允许什么、操作系统实际能限制什么。

## 阶段 6：Subagents 与任务运行时

对应资料：

- Learn Claude Code s04、s12-s18
- 当前仓库：`AgentTool`、`src/tasks/`、worktree 相关实现

要实现：

- 子 agent 独立 messages
- background task
- JSONL mailbox
- 简化 task graph

关键理解：

- subagent 首先是 context boundary。
- 多 agent 的关键是协议、状态和隔离，不是简单多开模型。

## 阶段 7：MCP 与 Plugins

对应资料：

- Learn Claude Code s19
- 当前仓库：`src/plugins/`、`packages/mcp-client/`、`packages/builtin-tools/`

要实现：

- 插件 manifest
- plugin loader
- 外部工具注册到同一 tool registry

关键理解：

- MCP/plugin 不是另一套 agent loop。
- 它们最终仍然进入同一条路径：发现工具、执行工具、写回结果。

## 阅读 CCB 源码的顺序

1. `src/entrypoints/cli.tsx`
2. `src/main.tsx`
3. `src/query.ts`
4. `src/QueryEngine.ts`
5. `src/services/api/claude.ts`
6. `src/Tool.ts`
7. `src/tools.ts`
8. `packages/builtin-tools/src/tools/`
9. `src/context.ts`
10. `src/state/`
11. `src/screens/REPL.tsx`

## 每章记录模板

每完成一个机制，在 `notes/source-reading/` 写一页：

```md
# 机制名

## 我实现的教学版

## CCB 对应源码

## 教学版和生产版差异

## 我现在还不懂的问题
```
