import type { LearningPath } from "../types/graph";

export const learningPaths = [
  {
    id: "beginner",
    title: "入门路径 / Beginner Path",
    summary: "从 message 状态一路看到 tool result write-back 的最小闭环。",
    nodeIds: [
      "message",
      "agent-loop",
      "tool-use",
      "tool-result-write-back",
      "tool-registry",
      "read-file",
      "write-file-list-files",
      "todo-write",
      "demo-commands",
    ],
  },
  {
    id: "context",
    title: "上下文路径 / Context Path",
    summary: "理解 prompt、项目规则、memory、skills 和 compact 如何影响行为。",
    nodeIds: [
      "system-prompt",
      "project-rules",
      "memory",
      "context-budget",
      "compact",
      "skills",
      "memory-hygiene",
    ],
  },
  {
    id: "safety",
    title: "安全路径 / Safety Path",
    summary: "追踪工具执行如何被 policy、approval 和 path guard 限制。",
    nodeIds: [
      "permissions",
      "policy-presets",
      "approval-request",
      "approval-store",
      "path-guard",
      "run-shell",
    ],
  },
  {
    id: "advanced",
    title: "进阶路径 / Advanced Path",
    summary: "串起 model boundary、task runtime、多 agent 隔离、MCP 和 plugin。",
    nodeIds: [
      "model-adapter",
      "tool-schema",
      "tool-context",
      "task-state",
      "subagents",
      "background-tasks",
      "worktree-isolation",
      "mcp",
      "plugin-loader",
    ],
  },
] satisfies LearningPath[];
