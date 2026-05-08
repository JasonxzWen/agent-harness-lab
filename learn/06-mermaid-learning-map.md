# Mermaid 学习地图

这页用 Mermaid 把学习路线、Claude Code/CCB 对应组件和 agent 工作流画出来。

## 1. 总体学习路线

```mermaid
flowchart TD
    A["模块 0<br/>环境与 TypeScript/Bun 基础"] --> B["模块 1<br/>Message 与 Agent Loop"]
    B --> C["模块 2<br/>Tool Registry"]
    C --> D["模块 3<br/>真实模型接入"]
    D --> E["模块 4<br/>TodoWrite 与计划状态"]
    E --> F["模块 5<br/>Context Engineering"]
    F --> G["模块 6<br/>Permissions"]
    G --> H["模块 7<br/>Hooks 与 Error Recovery"]
    H --> I["模块 8<br/>Subagents"]
    I --> J["模块 9<br/>Task Runtime 与 Background Tasks"]
    J --> K["模块 10<br/>MCP 与 Plugin Lite"]
    K --> L["模块 11<br/>Worktree 与多 Agent 协作"]

    A -.-> A1["learn/01-typescript-bun.md"]
    B -.-> B1["labs/ts-agent/src/loop.ts"]
    C -.-> C1["labs/ts-agent/src/tools.ts"]
    F -.-> F1["labs/ts-agent/src/context.ts"]
    G -.-> G1["labs/ts-agent/src/permissions.ts"]
```

## 2. 每个模块的固定学习节奏

```mermaid
flowchart LR
    A["学习概念"] --> B["阅读最小资料"]
    B --> C["TypeScript/Bun 构建"]
    C --> D["运行验证"]
    D --> E["对照 CCB 源码"]
    E --> F["记录问题与差异"]
    F --> A

    C -.-> C1["labs/ts-agent/"]
    D -.-> D1["bun run typecheck"]
    E -.-> E1["src/ 与 packages/"]
    F -.-> F1["notes/ 与 reference/"]
```

## 3. 教学版 Agent Loop 工作流

这是 `labs/ts-agent` 当前最小版本的工作流。

```mermaid
flowchart TD
    A["User 输入<br/>hello agent"] --> B["main.ts<br/>读取 CLI 参数"]
    B --> C["messages.ts<br/>createInitialState"]
    C --> D["loop.ts<br/>agentLoop"]
    D --> E["fakeModel<br/>读取 messages"]
    E --> F["assistant message<br/>包含 tool_use"]
    F --> G["messages<br/>追加 assistant message"]
    G --> H["tools.ts<br/>executeTool"]
    H --> I["tool_result<br/>工具执行结果"]
    I --> J["messages<br/>追加 user tool_result"]
    J --> K["fakeModel<br/>再次读取 messages"]
    K --> L["assistant final text<br/>结束本轮"]
    L --> M["main.ts<br/>打印 final state"]
```

关键点：

- `messages[]` 是下一轮模型推理输入，不只是显示记录。
- `tool_result` 必须写回 `messages[]`。
- 这就是 agent 从“会说话”变成“会做事”的最小流程。

## 4. 教学版到生产版的组件映射

```mermaid
flowchart TB
    subgraph Lab["labs/ts-agent 教学版"]
        L1["main.ts<br/>CLI 入口"]
        L2["messages.ts<br/>消息类型"]
        L3["loop.ts<br/>最小 agent loop"]
        L4["tools.ts<br/>Tool Registry"]
        L5["context.ts<br/>待实现"]
        L6["permissions.ts<br/>待实现"]
        L7["plugins<br/>待实现"]
    end

    subgraph CCB["CCB / Claude Code 生产版"]
        C1["src/entrypoints/cli.tsx<br/>快速入口"]
        C2["src/main.tsx<br/>Commander CLI"]
        C3["src/query.ts<br/>核心查询循环"]
        C4["src/QueryEngine.ts<br/>会话编排"]
        C5["src/services/api/claude.ts<br/>模型 API 与 streaming"]
        C6["src/Tool.ts<br/>Tool 接口"]
        C7["src/tools.ts<br/>工具注册"]
        C8["packages/builtin-tools/src/tools<br/>具体工具实现"]
        C9["src/context.ts<br/>上下文构造"]
        C10["src/components/permissions<br/>权限 UI"]
        C11["src/plugins 与 packages/mcp-client<br/>插件与 MCP"]
    end

    L1 --> C1
    L1 --> C2
    L2 --> C3
    L3 --> C3
    L3 --> C4
    L3 --> C5
    L4 --> C6
    L4 --> C7
    L4 --> C8
    L5 --> C9
    L6 --> C10
    L7 --> C11
```

## 5. Claude Code 生产级主链路

这是从命令行输入到模型调用、工具执行、UI 更新的大致链路。

```mermaid
flowchart TD
    A["用户启动 CLI"] --> B["src/entrypoints/cli.tsx"]
    B --> C{"是否命中特殊快速路径？"}
    C -- "是" --> D["执行快速路径并退出"]
    C -- "否" --> E["src/main.tsx"]
    E --> F["解析命令行参数"]
    F --> G["初始化配置、权限、MCP、上下文"]
    G --> H["launchRepl"]
    H --> I["src/screens/REPL.tsx"]
    I --> J["用户输入 prompt"]
    J --> K["src/query.ts"]
    K --> L["src/services/api/claude.ts"]
    L --> M["Anthropic / Provider API"]
    M --> N{"返回 tool_use？"}
    N -- "是" --> O["Tool Registry"]
    O --> P["Builtin Tool 执行"]
    P --> Q["tool_result 写回 messages"]
    Q --> K
    N -- "否" --> R["assistant final response"]
    R --> S["REPL 渲染消息"]
```

## 6. Agent Harness 核心分层

```mermaid
flowchart TB
    A["User Interface<br/>终端输入、消息展示、权限确认"]
    B["Conversation Runtime<br/>messages、turn loop、stream events"]
    C["Model Adapter<br/>Anthropic / OpenAI / Gemini / Grok"]
    D["Tool System<br/>tool schema、dispatch、result"]
    E["Context System<br/>system prompt、project rules、memory、skills"]
    F["Safety Boundary<br/>permissions、sandbox、path guard"]
    G["Task Runtime<br/>Todo、Task、background、subagent"]
    H["Extension Layer<br/>Plugin、MCP、external tools"]

    A --> B
    B --> C
    B --> D
    B --> E
    D --> F
    B --> G
    D --> H
    H --> F
```

学习时的顺序是自底向上搭：

```mermaid
flowchart LR
    A["Message Types"] --> B["Loop"]
    B --> C["Tools"]
    C --> D["Model Adapter"]
    D --> E["Planning"]
    E --> F["Context"]
    F --> G["Permissions"]
    G --> H["Subagents"]
    H --> I["Tasks"]
    I --> J["Plugins / MCP"]
```

## 7. 模块与产出物关系

```mermaid
flowchart TD
    A["每个学习模块"] --> B["代码产出"]
    A --> C["学习笔记"]
    A --> D["源码对照"]
    A --> E["实验记录"]

    B --> B1["labs/ts-agent/src"]
    B --> B2["labs/ts-agent/tests"]
    B --> B3["labs/ts-agent/CHANGELOG.md"]

    C --> C1["notes/basics"]
    C --> C2["notes/source-reading"]

    D --> D1["reference/mechanism-comparison.md"]
    D --> D2["reference/best-practices.md"]

    E --> E1["notes/experiments.md"]
    E --> E2["notes/questions.md"]
```

## 8. 当前阶段你应该盯住的流程

```mermaid
flowchart TD
    A["读懂 messages.ts"] --> B["读懂 tools.ts"]
    B --> C["读懂 loop.ts"]
    C --> D["运行 bun run dev"]
    D --> E["观察 messages 如何增长"]
    E --> F["解释 tool_result write-back"]
    F --> G["实现 read_file 工具"]
```

当前不要急着接真实模型。先确保你能不用模型也解释清楚：

- message 是什么。
- tool_use 是什么。
- tool_result 为什么要回填。
- loop 为什么会继续跑下一轮。
