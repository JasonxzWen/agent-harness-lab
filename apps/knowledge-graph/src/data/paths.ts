import type { LearningPath } from "../types/graph";

export const learningPaths = [
  {
    id: "beginner",
    title: "Beginner Path",
    summary: "Follow the minimal loop from message state to tool result write-back.",
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
    title: "Context Path",
    summary: "Study how prompts, rules, memory, skills, and compaction shape behavior.",
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
    title: "Safety Path",
    summary: "Trace how tool execution becomes bounded by policy, approval, and paths.",
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
    title: "Advanced Path",
    summary: "Connect model boundaries, task runtime, multi-agent isolation, MCP, and plugins.",
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
