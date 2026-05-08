# apps

这个目录放仓库级展示型应用。它们不是 CCB 生产参考源码，也不是一次性学习实验，而是把 `labs/`、`learn/`、`reference/` 中的学习成果产品化。

## 当前应用

- `knowledge-graph/`：Claude Code Harness 可交互知识图谱前端。

## 边界

- 应用代码优先使用 TypeScript、Bun、Vite、React。
- 应用可以引用 `labs/ts-agent/`、`learn/`、`reference/` 中的本地资料路径，但不要复制 CCB 源码、第三方文档或 skill 内容。
- `src/`、`packages/`、`docs/` 仍然默认作为 CCB 生产级参考源码，不因为 `apps/` 存在而被改造。
