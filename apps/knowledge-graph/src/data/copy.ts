import type { KnowledgeNode } from "../types/graph";

export type NodeDisplayCopy = {
  title: string;
  summary: string;
};

export const nodeDisplayCopy: Record<string, NodeDisplayCopy> = {
  message: {
    title: "消息 Message",
    summary: "agent 的上下文状态，不只是聊天气泡；下一轮推理要靠它继续。",
  },
  "system-prompt": {
    title: "系统提示 System Prompt",
    summary: "harness 动态拼出来的最高层指令，承载规则、记忆和任务边界。",
  },
  "agent-loop": {
    title: "Agent 循环 Agent Loop",
    summary: "从观察、决策、调用工具到写回结果的主控流程。",
  },
  "model-adapter": {
    title: "模型适配器 Model Adapter",
    summary: "让 loop 面向模型契约，而不是绑死在某个 provider 实现上。",
  },
  "tool-use": {
    title: "工具调用 Tool Use",
    summary: "模型发起的结构化动作请求，需要 schema、执行边界和结果回传。",
  },
  "tool-result-write-back": {
    title: "工具结果写回 Tool Result Write-back",
    summary: "把工具输出追加回 messages，让模型下一轮真的看见执行结果。",
  },
  "tool-registry": {
    title: "工具注册表 Tool Registry",
    summary: "把 tool name 映射到 handler、schema、描述和执行策略。",
  },
  "tool-schema": {
    title: "工具参数 Schema",
    summary: "把模型给出的 JSON 参数变成可验证的运行时输入契约。",
  },
  "tool-context": {
    title: "工具上下文 Tool Context",
    summary: "告诉模型有哪些工具、什么时候用、参数长什么样。",
  },
  "read-file": {
    title: "读取文件 read_file",
    summary: "让 agent 在受限 workspace 里观察项目文件。",
  },
  "write-file-list-files": {
    title: "写入 / 列文件",
    summary: "证明 agent 可以受控地改变和发现本地 workspace 状态。",
  },
  "run-shell": {
    title: "执行命令 run_shell",
    summary: "只有配合权限和命令风险分类，shell 工具才是可控能力。",
  },
  "todo-write": {
    title: "计划写入 TodoWrite",
    summary: "把多步骤任务显式写成结构化计划状态。",
  },
  "todo-read": {
    title: "计划读取 TodoRead",
    summary: "让 agent 能读取当前计划，用于继续、恢复和总结任务。",
  },
  "task-state": {
    title: "任务状态 Task State",
    summary: "比 Todo 更完整的工作生命周期：状态、恢复、协调和归属。",
  },
  "project-rules": {
    title: "项目规则 Project Rules",
    summary: "把仓库自己的协作规范注入到模型上下文中。",
  },
  memory: {
    title: "记忆 Memory",
    summary: "把长期偏好和项目事实选择性带入后续推理。",
  },
  skills: {
    title: "技能 Skills",
    summary: "按任务需要加载的一小包专门指令，而不是全部塞进 prompt。",
  },
  compact: {
    title: "压缩 Compact",
    summary: "上下文过长时，保留关键状态并完成下一轮交接。",
  },
  "context-budget": {
    title: "上下文预算 Context Budget",
    summary: "决定哪些历史、规则、工具说明和记忆值得进入当前窗口。",
  },
  permissions: {
    title: "权限 Permissions",
    summary: "harness 对工具动作做 allow / ask / deny，而不是相信模型自觉。",
  },
  "policy-presets": {
    title: "权限预设 Policy Presets",
    summary: "把安全姿态做成清晰模式，而不是散落的布尔开关。",
  },
  "approval-request": {
    title: "审批请求 Approval Request",
    summary: "对高风险动作暂停执行，向用户请求具体、有限的授权。",
  },
  "approval-store": {
    title: "审批记录 Approval Store",
    summary: "保存已批准边界，让重复安全操作不必反复打断用户。",
  },
  "path-guard": {
    title: "路径守卫 Path Guard",
    summary: "通过解析绝对路径，限制文件工具只能访问目标 workspace。",
  },
  "bun-runtime": {
    title: "Bun 运行时 Bun Runtime",
    summary: "本项目运行 TypeScript 实验和前端构建的默认 runtime。",
  },
  "vite-react-shell": {
    title: "前端壳 Vite React Shell",
    summary: "把 harness 学习成果包装成可公开展示的知识图谱作品。",
  },
  "demo-commands": {
    title: "演示命令 Demo Commands",
    summary: "每个机制都应该能指向一条可复制运行的 Bun 命令。",
  },
  subagents: {
    title: "子代理 Subagents",
    summary: "把子任务放进独立 message 上下文，避免污染主循环。",
  },
  "background-tasks": {
    title: "后台任务 Background Tasks",
    summary: "长任务的独立执行通道，不是第二个主 agent loop。",
  },
  "worktree-isolation": {
    title: "工作树隔离 Worktree Isolation",
    summary: "让并行 agent 不在同一份文件上互相覆盖。",
  },
  mcp: {
    title: "模型上下文协议 MCP",
    summary: "让外部能力以工具形式进入同一条发现、执行、写回路径。",
  },
  "plugin-loader": {
    title: "插件加载 Plugin Loader",
    summary: "把插件 manifest 和能力注册进本地 tool registry。",
  },
  "memory-hygiene": {
    title: "记忆治理 Memory Hygiene",
    summary: "清理、分层和刷新 memory，避免长期上下文变成噪音。",
  },
};

export function getNodeDisplayCopy(node: KnowledgeNode): NodeDisplayCopy {
  return nodeDisplayCopy[node.id] ?? { title: node.title, summary: node.summary };
}
