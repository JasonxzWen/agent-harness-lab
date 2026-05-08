# AGENTS.md

作用范围：`apps/knowledge-graph/`。

这是仓库的展示前端。它要像一个清楚的学习工具，不做营销页。

## 产品目标

- 把 `labs/ts-agent/` 里的机制做成知识图谱。
- 让用户能按路径学习、看源码、跑命令。
- 展示 TypeScript 数据建模、React 组件拆分和前端交互能力。

## 技术规则

- 所有命令使用 Bun。
- 使用 Vite + React + TypeScript。
- 图谱先用 typed data + React/CSS 实现。
- 只有交互复杂度需要时，才评估 React Flow。
- 不使用 `any`；优先用 union、typed record 和明确数据模型。
- 不使用 `dangerouslySetInnerHTML`。
- 不添加 analytics、tracking script、远程日志或外部数据上报。

## 文案规则

- 中文优先，必要时保留英文机制名。
- 文案要短、准、具体。先说用户现在能看到什么、能做什么。
- 禁止空泛词：赋能、打造、沉淀、范式、生态、底座、抓手、心智、信息熵。
- 能写文件、命令、节点、动作，就不要写抽象名词。
- 应用数据只保存原创摘要和引用元数据。
- 不复制 CCB 源码、第三方正文或本地 skill 内容。
- `.external/skill-hub` 只能用于说明边界，不得作为提交内容。
- 本地引用路径应指向 `labs/ts-agent/src/loop.ts`、`learn/00-roadmap.md`、`reference/mechanism-comparison.md` 这类文件。

## 命令

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun install
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run dev
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test
```

## 验证

完成一个阶段前，至少运行：

1. `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
2. `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`
3. 桌面和窄屏手动检查一次。
4. 检查 diff，确认没有复制 `src/`、`packages/`、`docs/` 或 `.external/skill-hub` 内容。
