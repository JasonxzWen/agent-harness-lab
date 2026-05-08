import type { ToolResultBlock, ToolUseBlock } from "./messages";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ToolInputSchema } from "./tool-schema";
import { validateToolInput } from "./tool-schema";
import type { TodoInput } from "./tool-schema";
import { readTodos, writeTodos } from "./todo";
import type {
  PermissionDecision,
  PermissionPolicyInput,
  PermissionRequirement,
} from "./permissions";
import {
  createApprovalRequest,
  denyPermission,
  evaluatePermission,
  isToolUseApproved,
} from "./permissions";
import {
  approveToolUse,
  listPendingApprovals,
  recordApprovalRequest,
  readApprovals,
} from "./approval-store";

export type ToolExecutionResult =
  | { ok: true; content: unknown }
  | { ok: false; error: string };

export type ToolHandler = (input: Record<string, unknown>) =>
  | Promise<ToolExecutionResult>
  | ToolExecutionResult;

export type Tool = {
  name: string;
  description: string;
  permission: PermissionRequirement;
  inputSchema: ToolInputSchema;
  handler: ToolHandler;
};

const tools = new Map<string, Tool>();
const WORKSPACE_DIR = path.resolve(process.cwd(), "workspace");
const SAFE_SHELL_COMMANDS = new Set(["bun"]);

function ok(content: unknown): ToolExecutionResult {
  return { ok: true, content };
}

function fail(error: string): ToolExecutionResult {
  return { ok: false, error };
}

function getString(input: Record<string, unknown>, key: string): string {
  const value = input[key];
  if (typeof value !== "string") {
    throw new Error(`Expected string input: ${key}`);
  }
  return value;
}

function getOptionalStringArray(
  input: Record<string, unknown>,
  key: string,
): string[] {
  const value = input[key];
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`Expected string array input: ${key}`);
  }
  return value;
}

function getTodoArray(input: Record<string, unknown>, key: string): TodoInput[] {
  const value = input[key];
  if (!Array.isArray(value)) {
    throw new Error(`Expected todo array input: ${key}`);
  }

  return value as TodoInput[];
}

function resolveWorkspacePath(relativePath: string): string {
  const resolvedPath = path.resolve(WORKSPACE_DIR, relativePath);
  const relativeToWorkspace = path.relative(WORKSPACE_DIR, resolvedPath);

  if (
    relativeToWorkspace.startsWith("..") ||
    path.isAbsolute(relativeToWorkspace)
  ) {
    throw new Error(`Path escapes workspace: ${relativePath}`);
  }

  return resolvedPath;
}

async function ensureWorkspace(): Promise<void> {
  await mkdir(WORKSPACE_DIR, { recursive: true });
}

export function registerTool(tool: Tool): void {
  tools.set(tool.name, tool);
}

export function listTools(): Omit<Tool, "handler">[] {
  return [...tools.values()].map(({ handler: _handler, ...tool }) => tool);
}

async function permissionResult(
  toolUse: ToolUseBlock,
  tool: Tool,
  decision: PermissionDecision,
  input: Record<string, unknown>,
): Promise<ToolResultBlock> {
  if (decision.type === "needs_approval") {
    const approvalRequest = createApprovalRequest({
      toolUseId: toolUse.id,
      toolName: tool.name,
      permission: tool.permission,
      reason: decision.reason,
      input,
    });
    await recordApprovalRequest(approvalRequest);

    return {
      type: "tool_result",
      toolUseId: toolUse.id,
      content: JSON.stringify({
        ok: false,
        status: "approval_required",
        approvalRequest,
      }),
      isError: true,
    };
  }

  return {
    type: "tool_result",
    toolUseId: toolUse.id,
    content: JSON.stringify({
      ok: false,
      status: "denied",
      error: `Permission denied: ${decision.reason}`,
      permission: decision,
    }),
    isError: true,
  };
}

function evaluateToolPermission(
  tool: Tool,
  input: Record<string, unknown>,
  policy?: PermissionPolicyInput,
): PermissionDecision {
  if (tool.name === "run_shell") {
    const command = input.command;
    const args = Array.isArray(input.args) ? input.args : [];
    const forbidden = /[;&|<>`$]/;

    if (typeof command !== "string") {
      return denyPermission("Shell command must be a string.");
    }

    if (!SAFE_SHELL_COMMANDS.has(command)) {
      return denyPermission(`Shell command is not allowlisted: ${command}`);
    }

    if (
      forbidden.test(command) ||
      args.some((arg) => typeof arg === "string" && forbidden.test(arg))
    ) {
      return denyPermission("Shell control operators are not allowed.");
    }
  }

  return evaluatePermission(tool.permission, policy);
}

export async function executeTool(
  toolUse: ToolUseBlock,
  policy?: PermissionPolicyInput,
): Promise<ToolResultBlock> {
  const tool = tools.get(toolUse.name);

  if (!tool) {
    return {
      type: "tool_result",
      toolUseId: toolUse.id,
      content: JSON.stringify({
        ok: false,
        error: `Unknown tool: ${toolUse.name}`,
      }),
      isError: true,
    };
  }

  const validation = validateToolInput(tool.inputSchema, toolUse.input);
  if (!validation.ok) {
    return {
      type: "tool_result",
      toolUseId: toolUse.id,
      content: JSON.stringify({ ok: false, error: validation.error }),
      isError: true,
    };
  }

  const permissionDecision = evaluateToolPermission(
    tool,
    validation.input,
    policy,
  );
  if (
    permissionDecision.type === "needs_approval" &&
    isToolUseApproved(toolUse.id, policy)
  ) {
    await approveToolUse(toolUse.id);
    // Continue into the handler: this specific tool_use has been approved.
  } else if (permissionDecision.type !== "allow") {
    return await permissionResult(
      toolUse,
      tool,
      permissionDecision,
      validation.input,
    );
  }

  try {
    const result = await tool.handler(validation.input);

    return {
      type: "tool_result",
      toolUseId: toolUse.id,
      content: JSON.stringify(result),
      isError: !result.ok,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    return {
      type: "tool_result",
      toolUseId: toolUse.id,
      content: JSON.stringify({ ok: false, error: `Tool failed: ${message}` }),
      isError: true,
    };
  }
}

registerTool({
  name: "echo",
  description: "Return the provided text.",
  permission: "none",
  inputSchema: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "Text to return.",
        required: true,
      },
    },
  },
  handler(input) {
    return ok(getString(input, "text"));
  },
});

registerTool({
  name: "read_file",
  description: "Read a UTF-8 file from the local agent workspace.",
  permission: "workspace_read",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Workspace-relative file path.",
        required: true,
      },
    },
  },
  async handler(input) {
    await ensureWorkspace();
    const filePath = resolveWorkspacePath(getString(input, "path"));
    const content = await readFile(filePath, "utf8");
    return ok(content);
  },
});

registerTool({
  name: "write_file",
  description: "Write a UTF-8 file inside the local agent workspace.",
  permission: "workspace_write",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Workspace-relative file path.",
        required: true,
      },
      content: {
        type: "string",
        description: "UTF-8 file content.",
        required: true,
      },
    },
  },
  async handler(input) {
    await ensureWorkspace();
    const filePath = resolveWorkspacePath(getString(input, "path"));
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, getString(input, "content"), "utf8");
    return ok(`Wrote ${path.relative(WORKSPACE_DIR, filePath)}`);
  },
});

registerTool({
  name: "list_files",
  description: "List files and folders inside the local agent workspace.",
  permission: "workspace_read",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Workspace-relative directory path.",
      },
    },
  },
  async handler(input) {
    await ensureWorkspace();
    const dirPath = resolveWorkspacePath(
      typeof input.path === "string" ? input.path : ".",
    );
    const entries = await readdir(dirPath, { withFileTypes: true });
    const lines = entries.map((entry) => `${entry.isDirectory() ? "dir" : "file"} ${entry.name}`);
    return ok(lines.join("\n"));
  },
});

registerTool({
  name: "run_shell",
  description: "Run a small allowlisted shell command in the local agent workspace.",
  permission: "shell_execution",
  inputSchema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "Executable name. Only allowlisted commands can run.",
        required: true,
      },
      args: {
        type: "string[]",
        description: "Command arguments.",
      },
    },
  },
  async handler(input) {
    await ensureWorkspace();
    const command = getString(input, "command");
    const args = getOptionalStringArray(input, "args");

    if (!SAFE_SHELL_COMMANDS.has(command)) {
      return fail(`Command is not allowlisted: ${command}`);
    }

    const forbidden = /[;&|<>`$]/;
    if (forbidden.test(command) || args.some((arg) => forbidden.test(arg))) {
      return fail("Shell control operators are not allowed");
    }

    const proc = Bun.spawn([command, ...args], {
      cwd: WORKSPACE_DIR,
      stdout: "pipe",
      stderr: "pipe",
    });
    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;

    return ok({
      exitCode,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
    });
  },
});

registerTool({
  name: "todo_write",
  description: "Replace the current agent todo list with explicit task state.",
  permission: "workspace_write",
  inputSchema: {
    type: "object",
    properties: {
      todos: {
        type: "todo[]",
        description:
          "Todo items with content and status: pending, in_progress, or completed.",
        required: true,
      },
    },
  },
  async handler(input) {
    const todos = await writeTodos(getTodoArray(input, "todos"));
    return ok(todos);
  },
});

registerTool({
  name: "todo_read",
  description: "Read the current agent todo list.",
  permission: "workspace_read",
  inputSchema: {
    type: "object",
    properties: {},
  },
  async handler() {
    const todos = await readTodos();
    return ok(todos);
  },
});

registerTool({
  name: "approval_read",
  description: "Read pending approval requests recorded by the harness.",
  permission: "workspace_read",
  inputSchema: {
    type: "object",
    properties: {},
  },
  async handler() {
    const approvals = await listPendingApprovals();
    return ok(approvals);
  },
});

registerTool({
  name: "approval_history",
  description: "Read all approval records recorded by the harness.",
  permission: "workspace_read",
  inputSchema: {
    type: "object",
    properties: {},
  },
  async handler() {
    const approvals = await readApprovals();
    return ok(approvals);
  },
});
