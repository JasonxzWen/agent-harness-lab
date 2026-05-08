import type { KnowledgeNode } from "../types/graph";

export type NodeDisplayCopy = {
  title: string;
  summary: string;
};

export const nodeDisplayCopy: Record<string, NodeDisplayCopy> = {
  message: {
    title: "消息 Message",
    summary: "保存对话和工具结果，供下一轮模型读取。",
  },
  "system-prompt": {
    title: "系统提示 System Prompt",
    summary: "告诉模型角色、规则、记忆和任务边界。",
  },
  "agent-loop": {
    title: "Agent 循环 Agent Loop",
    summary: "让模型思考、调用工具、再读取结果。",
  },
  "model-adapter": {
    title: "模型适配器 Model Adapter",
    summary: "让 loop 不绑死在某个模型 provider 上。",
  },
  "tool-use": {
    title: "工具调用 Tool Use",
    summary: "模型请求执行工具，harness 负责校验和执行。",
  },
  "tool-result-write-back": {
    title: "工具结果写回 Tool Result Write-back",
    summary: "把工具输出写回消息，让模型继续判断。",
  },
  "tool-registry": {
    title: "工具注册表 Tool Registry",
    summary: "记录工具名称、参数、说明和执行函数。",
  },
  "tool-schema": {
    title: "工具参数 Schema",
    summary: "检查模型给出的 JSON 参数是否可用。",
  },
  "tool-context": {
    title: "工具上下文 Tool Context",
    summary: "告诉模型有哪些工具，以及怎么调用。",
  },
  "read-file": {
    title: "读取文件 read_file",
    summary: "在允许的目录里读取项目文件。",
  },
  "write-file-list-files": {
    title: "写入 / 列文件",
    summary: "在允许的目录里写文件、列文件。",
  },
  "run-shell": {
    title: "执行命令 run_shell",
    summary: "执行安全命令，高风险命令先拦住。",
  },
  "todo-write": {
    title: "计划写入 TodoWrite",
    summary: "把多步骤任务写成明确的待办列表。",
  },
  "todo-read": {
    title: "计划读取 TodoRead",
    summary: "读取当前待办，方便继续或总结任务。",
  },
  "task-state": {
    title: "任务状态 Task State",
    summary: "记录任务进度、恢复点和负责人。",
  },
  "project-rules": {
    title: "项目规则 Project Rules",
    summary: "把仓库规则放进模型上下文。",
  },
  memory: {
    title: "记忆 Memory",
    summary: "保存长期偏好和项目事实。",
  },
  skills: {
    title: "技能 Skills",
    summary: "按任务加载专门说明，不一次性全塞进 prompt。",
  },
  compact: {
    title: "压缩 Compact",
    summary: "对话太长时，保留关键状态继续做。",
  },
  "context-budget": {
    title: "上下文预算 Context Budget",
    summary: "选择哪些历史、规则和记忆进入当前请求。",
  },
  permissions: {
    title: "权限 Permissions",
    summary: "对工具动作做允许、询问或拒绝。",
  },
  "policy-presets": {
    title: "权限预设 Policy Presets",
    summary: "把常用权限组合成几个清楚模式。",
  },
  "approval-request": {
    title: "审批请求 Approval Request",
    summary: "高风险动作先暂停，等用户确认。",
  },
  "approval-store": {
    title: "审批记录 Approval Store",
    summary: "保存已批准动作，减少重复确认。",
  },
  "path-guard": {
    title: "路径守卫 Path Guard",
    summary: "限制文件工具只能访问允许目录。",
  },
  "bun-runtime": {
    title: "Bun 运行时 Bun Runtime",
    summary: "运行 TypeScript 实验和前端构建。",
  },
  "vite-react-shell": {
    title: "前端壳 Vite React Shell",
    summary: "承载这个公开展示站点。",
  },
  "demo-commands": {
    title: "演示命令 Demo Commands",
    summary: "每个机制都配一条可运行命令。",
  },
  subagents: {
    title: "子代理 Subagents",
    summary: "把子任务放进独立上下文。",
  },
  "background-tasks": {
    title: "后台任务 Background Tasks",
    summary: "让长任务在后台跑，完成后写回结果。",
  },
  "worktree-isolation": {
    title: "工作树隔离 Worktree Isolation",
    summary: "避免多个 agent 改同一份文件。",
  },
  mcp: {
    title: "模型上下文协议 MCP",
    summary: "把外部工具接入同一个工具流程。",
  },
  "plugin-loader": {
    title: "插件加载 Plugin Loader",
    summary: "读取插件配置，并注册新工具。",
  },
  "memory-hygiene": {
    title: "记忆治理 Memory Hygiene",
    summary: "定期清理 memory，减少无用信息。",
  },
};

export function getNodeDisplayCopy(node: KnowledgeNode): NodeDisplayCopy {
  return nodeDisplayCopy[node.id] ?? { title: node.title, summary: node.summary };
}
