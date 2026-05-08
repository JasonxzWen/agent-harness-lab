# ts-agent

这里是从零实现的 TypeScript/Bun 版 Claude Code-like agent harness。

目标不是复刻完整 CCB，而是逐步实现并理解核心机制。

## 与知识图谱前端的关系

`apps/knowledge-graph` 是仓库级展示型前端，会把这里的教学版机制实现作为 lab source 引用。

这个目录继续专注最小可运行 harness；不要为了前端展示而把实验代码写复杂。前端需要的解释、路径和引用元数据应放在 `apps/knowledge-graph` 自己的数据和文档里。

## 路线

1. `s01` agent loop
2. `s02` tool registry
3. `s03` TodoWrite
4. context engineering
5. permissions
6. subagents
7. tasks/background
8. plugins/MCP

## 运行

```bash
bun run dev "hello agent"
```

当前 `s01` 使用 `fakeModel()` 模拟模型返回工具调用，方便先学习 agent loop 的数据流。接入真实模型之前，先把 messages、tool_use、tool_result 的闭环跑通。

## 设计原则

- 每个机制先写最小可运行版本。
- 类型要清楚，避免 `any`。
- 工具结果必须写回 messages。
- 每个模块都要能对应回 CCB 源码中的生产级实现。
