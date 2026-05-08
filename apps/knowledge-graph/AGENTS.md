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

每次改动完成后，回复里都要补一段 Mermaid 验收顺序图，说明用户应先看什么、再运行什么命令、最后检查什么页面状态。

## 全局思维检查

每次 UI 或文案改动后，都要说明这次改动对全局页面的影响：

- 页面元素是否变多，是否需要合并、隐藏或延后展示。
- 新区域是否挤压 hero、画布、详情、导航或移动端布局。
- 用户进入交互路径时，第一步是否清楚，关闭、复制、返回等动作是否容易找到。
- 文案是否回答“这是什么、现在能做什么、下一步是什么”，是否有多余解释。

## 组件交互规则

每次改组件时，都要先检查交互易用性：

- 新增按钮或可点击元素时，必须设计 hover、focus、active、点击后的状态反馈。反馈要清楚，但不能用 `box-shadow`、渐变或缩放。
- 新增文本时，先写用户能扫读的一句话，再决定是否需要补充说明。标题、摘要、按钮文案都要短。
- 新增布局区域时，先判断它和现有导航、hero、画布、详情抽屉、移动端折叠顺序的关系，避免把主操作挤到屏幕外。
- 新增知识点时，必须让用户最快看到 `why / what / how`：为什么需要它、它是什么、它在本仓库如何实现。
- 如果入口对应的功能还没有实现，不能只放一个看起来可用的按钮或链接；点击、hover 或旁边提示必须明确显示“暂未实现”。
