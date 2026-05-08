# TypeScript 与 Bun 入门

本项目选择 TypeScript/Bun 优先，是为了贴近 Claude Code/CCB 的真实工程形态，同时保持实验代码可以快速运行。

## 为什么 Claude Code 适合用 TypeScript

Claude Code 是一个 CLI agent harness。它需要同时处理：

- 大量结构化消息：user、assistant、tool_use、tool_result。
- 大量工具定义：工具名、描述、schema、权限、结果。
- 异步流程：API streaming、工具执行、后台任务、用户中断。
- 终端 UI：React/Ink 组件模型。
- 跨平台运行：macOS、Linux、Windows。
- 与 JavaScript 生态集成：MCP、Node 包、终端库、编辑器协议。

TypeScript 的优势正好对应这些需求：

- 类型系统能描述复杂消息结构，减少工具调用和状态机错误。
- ESM 和 npm 生态适合 CLI、SDK、协议库集成。
- `async/await`、AsyncGenerator 很适合 streaming 和 event pipeline。
- React/Ink 可以复用 React 心智模型构建终端 UI。
- 编译后仍然运行在 JavaScript 生态里，分发和集成成本低。

## 为什么使用 Bun

Bun 在这个项目里主要提供：

- 直接运行 TypeScript：`bun run src/main.ts`
- 快速包管理：`bun install`
- 内置测试：`bun test`
- 打包能力：`Bun.build()`
- 对 Node 生态的较高兼容性

Claude Code/CCB 这类 CLI 工具重视启动速度和单文件/少文件分发，Bun 的运行和构建模型比较匹配。

## 你需要先掌握的 TypeScript

### 1. 基本类型

```ts
const name: string = "Claude";
const turn: number = 1;
const done: boolean = false;
```

### 2. 对象类型

```ts
type Message = {
  role: "user" | "assistant";
  content: string;
};
```

### 3. 联合类型

Agent 消息常常是联合类型：

```ts
type TextBlock = { type: "text"; text: string };
type ToolUseBlock = { type: "tool_use"; name: string; input: unknown };

type ContentBlock = TextBlock | ToolUseBlock;
```

使用时按 `type` 收窄：

```ts
function handleBlock(block: ContentBlock) {
  if (block.type === "text") {
    return block.text;
  }

  return block.name;
}
```

### 4. async/await

```ts
async function callModel(): Promise<string> {
  return "hello";
}

const result = await callModel();
```

### 5. Record

工具输入常用 `Record<string, unknown>` 表示“结构未知但不是 any”：

```ts
type ToolCall = {
  name: string;
  input: Record<string, unknown>;
};
```

## 第一个 Bun 脚本

在 `labs/ts-agent` 中运行：

```bash
bun run src/main.ts
```

最小文件：

```ts
console.log("hello agent");
```

## 学习建议

不要先系统学完整 TypeScript。按 agent harness 需要的顺序学：

1. 类型如何描述 message。
2. 类型如何描述 tool。
3. async 如何表达 model call 和 tool execution。
4. AsyncGenerator 如何表达 streaming。
5. interface/type 如何让大系统可维护。

每学一个语法点，都回到一个问题：

> 这个语法如何让 agent harness 更安全、更清楚、更容易扩展？
