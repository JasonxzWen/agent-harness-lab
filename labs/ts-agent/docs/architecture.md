# ts-agent Architecture

`ts-agent` is the learning implementation of a Claude Code-like agent harness.

It starts intentionally small. The goal is to understand the mechanism before matching production complexity.

## Current Data Flow

```text
user input
  -> messages
  -> fake model
  -> assistant tool_use
  -> tool registry
  -> tool_result
  -> messages
  -> fake model final text
```

## Current Modules

### `src/messages.ts`

Defines the message and content block types:

- `UserMessage`
- `AssistantMessage`
- `TextBlock`
- `ToolUseBlock`
- `ToolResultBlock`
- `LoopState`

### `src/tools.ts`

Defines the tool registry:

- `Tool`
- `ToolHandler`
- `registerTool`
- `executeTool`

Currently registered tool:

- `echo`

### `src/loop.ts`

Runs the minimal agent loop:

1. Call `fakeModel`.
2. Append assistant response.
3. Execute tool calls.
4. Append tool results as a user message.
5. Continue until final text.

### `src/main.ts`

CLI entry point for the learning agent.

## Near-Term Architecture

Next modules will add:

- file tools
- workspace boundary
- real model adapter
- TodoWrite
- context builder
- permissions

## Production Comparison

The CCB production equivalents are:

- `src/query.ts`
- `src/QueryEngine.ts`
- `src/services/api/claude.ts`
- `src/Tool.ts`
- `src/tools.ts`
- `packages/builtin-tools/src/tools/`

The production version adds streaming, retry, compaction, permissions, UI events, provider routing, and transcript persistence.
