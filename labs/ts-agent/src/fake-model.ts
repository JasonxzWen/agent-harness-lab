import type { LoopState, ToolUseBlock } from "./messages";
import type { Model, ModelResponse } from "./model";

type ToolPayload =
  | { ok: true; content: unknown }
  | { ok: false; error: string };

type TodoSnapshotItem = {
  content: string;
  status: "pending" | "in_progress" | "completed";
};

function parseToolPayload(content: string): ToolPayload | null {
  try {
    const payload = JSON.parse(content) as unknown;

    if (
      typeof payload === "object" &&
      payload !== null &&
      "ok" in payload &&
      payload.ok === true
    ) {
      return payload as ToolPayload;
    }

    if (
      typeof payload === "object" &&
      payload !== null &&
      "ok" in payload &&
      payload.ok === false &&
      "error" in payload &&
      typeof payload.error === "string"
    ) {
      return payload as ToolPayload;
    }
  } catch {
    return null;
  }

  return null;
}

function chooseDemoTool(query: string, turnCount: number): ToolUseBlock {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("planned file task")) {
    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "todo_write",
      input: {
        todos: [
          {
            content: "Plan the file task",
            status: "completed",
          },
          {
            content: "Write planned-output.txt",
            status: "in_progress",
          },
          {
            content: "Mark the file task complete",
            status: "pending",
          },
        ],
      },
    };
  }

  if (lowerQuery.includes("write")) {
    if (lowerQuery.includes("bad input")) {
      return {
        type: "tool_use",
        id: `tool-${turnCount}`,
        name: "write_file",
        input: { path: "broken.txt" },
      };
    }

    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "write_file",
      input: {
        path: "hello.txt",
        content: `Created by ts-agent for: ${query}`,
      },
    };
  }

  if (lowerQuery.includes("read todos")) {
    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "todo_read",
      input: {},
    };
  }

  if (lowerQuery.includes("read approvals")) {
    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "approval_read",
      input: {},
    };
  }

  if (lowerQuery.includes("read")) {
    if (lowerQuery.includes("escape")) {
      return {
        type: "tool_use",
        id: `tool-${turnCount}`,
        name: "read_file",
        input: { path: "../package.json" },
      };
    }

    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "read_file",
      input: { path: "hello.txt" },
    };
  }

  if (lowerQuery.includes("list")) {
    if (lowerQuery.includes("unknown field")) {
      return {
        type: "tool_use",
        id: `tool-${turnCount}`,
        name: "list_files",
        input: { path: ".", recursive: true },
      };
    }

    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "list_files",
      input: { path: "." },
    };
  }

  if (lowerQuery.includes("shell")) {
    if (lowerQuery.includes("unsafe")) {
      return {
        type: "tool_use",
        id: `tool-${turnCount}`,
        name: "run_shell",
        input: { command: "rm", args: ["-rf", "."] },
      };
    }

    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "run_shell",
      input: { command: "bun", args: ["--version"] },
    };
  }

  if (lowerQuery.includes("todo")) {
    if (lowerQuery.includes("bad state")) {
      return {
        type: "tool_use",
        id: `tool-${turnCount}`,
        name: "todo_write",
        input: {
          todos: [
            {
              content: "Start the first task",
              status: "in_progress",
            },
            {
              content: "Start the second task too early",
              status: "in_progress",
            },
          ],
        },
      };
    }

    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "todo_write",
      input: {
        todos: [
          {
            content: "Understand why TodoWrite is a harness tool",
            status: "completed",
          },
          {
            content: "Persist explicit task state to workspace/todos.json",
            status: "in_progress",
          },
          {
            content: "Use todo_read to bring plan state back into messages",
            status: "pending",
          },
        ],
      },
    };
  }

  if (lowerQuery.includes("unknown tool")) {
    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "does_not_exist",
      input: {},
    };
  }

  return {
    type: "tool_use",
    id: `tool-${turnCount}`,
    name: "echo",
    input: { text: `Observed user request: ${query}` },
  };
}

function chooseRecoveryTool(error: string, turnCount: number): ToolUseBlock | null {
  if (error.includes("Unknown tool")) {
    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "echo",
      input: { text: `Recovered from tool lookup failure: ${error}` },
    };
  }

  if (error.includes("Missing required input: content")) {
    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "write_file",
      input: {
        path: "recovered.txt",
        content: "Recovered by adding the required content field.",
      },
    };
  }

  if (error.includes("Unknown input field")) {
    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "list_files",
      input: { path: "." },
    };
  }

  if (error.includes("Path escapes workspace")) {
    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "read_file",
      input: { path: "hello.txt" },
    };
  }

  if (error.includes("not allowlisted")) {
    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "run_shell",
      input: { command: "bun", args: ["--version"] },
    };
  }

  if (error.includes("Only one todo can be in_progress")) {
    return {
      type: "tool_use",
      id: `tool-${turnCount}`,
      name: "todo_write",
      input: {
        todos: [
          {
            content: "Start the first task",
            status: "in_progress",
          },
          {
            content: "Keep the second task queued",
            status: "pending",
          },
        ],
      },
    };
  }

  return null;
}

function getInitialUserQuery(state: LoopState): string {
  const firstMessage = state.messages[0];
  if (firstMessage?.role === "user" && typeof firstMessage.content === "string") {
    return firstMessage.content;
  }

  return "";
}

function getPreviousToolUse(state: LoopState): ToolUseBlock | null {
  for (let index = state.messages.length - 1; index >= 0; index -= 1) {
    const message = state.messages[index];
    if (message?.role !== "assistant") {
      continue;
    }

    const toolUse = message.content.find((block) => block.type === "tool_use");
    return toolUse ?? null;
  }

  return null;
}

function isTodoSnapshot(value: unknown): value is TodoSnapshotItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "content" in item &&
        typeof item.content === "string" &&
        "status" in item &&
        (item.status === "pending" ||
          item.status === "in_progress" ||
          item.status === "completed"),
    )
  );
}

function choosePlannedWorkflowTool(
  state: LoopState,
  payload: ToolPayload,
): ToolUseBlock | null {
  const initialQuery = getInitialUserQuery(state).toLowerCase();
  if (!initialQuery.includes("planned file task") || !payload.ok) {
    return null;
  }

  const previousToolUse = getPreviousToolUse(state);

  if (
    previousToolUse?.name === "todo_write" &&
    isTodoSnapshot(payload.content) &&
    payload.content.some(
      (todo) =>
        todo.content === "Write planned-output.txt" &&
        todo.status === "in_progress",
    )
  ) {
    return {
      type: "tool_use",
      id: `tool-${state.turnCount}`,
      name: "write_file",
      input: {
        path: "planned-output.txt",
        content: "This file was created by a TodoWrite-driven workflow.",
      },
    };
  }

  if (previousToolUse?.name === "write_file") {
    return {
      type: "tool_use",
      id: `tool-${state.turnCount}`,
      name: "todo_write",
      input: {
        todos: [
          {
            content: "Plan the file task",
            status: "completed",
          },
          {
            content: "Write planned-output.txt",
            status: "completed",
          },
          {
            content: "Mark the file task complete",
            status: "completed",
          },
        ],
      },
    };
  }

  return null;
}

async function complete(state: LoopState): Promise<ModelResponse> {
  const lastMessage = state.messages.at(-1);

  if (lastMessage?.role === "user" && typeof lastMessage.content === "string") {
    const toolUse = chooseDemoTool(lastMessage.content, state.turnCount);

    return {
      stopReason: "tool_use",
      message: {
        role: "assistant",
        content: [toolUse],
      },
    };
  }

  if (
    lastMessage?.role === "user" &&
    Array.isArray(lastMessage.content) &&
    lastMessage.content[0]
  ) {
    const firstToolResult = lastMessage.content[0];
    const payload = parseToolPayload(firstToolResult.content);

    if (firstToolResult.isError && payload?.ok === false && state.turnCount < 3) {
      const recoveryTool = chooseRecoveryTool(payload.error, state.turnCount);

      if (recoveryTool) {
        return {
          stopReason: "tool_use",
          message: {
            role: "assistant",
            content: [recoveryTool],
          },
        };
      }
    }

    if (payload?.ok) {
      const workflowTool = choosePlannedWorkflowTool(state, payload);

      if (workflowTool) {
        return {
          stopReason: "tool_use",
          message: {
            role: "assistant",
            content: [workflowTool],
          },
        };
      }
    }

    return {
      stopReason: "end_turn",
      message: {
        role: "assistant",
        content: [
          {
            type: "text",
            text: `Done. I saw this tool result: ${firstToolResult.content}`,
          },
        ],
      },
    };
  }

  return {
    stopReason: "end_turn",
    message: {
      role: "assistant",
      content: [{ type: "text", text: "Done. Tool result is now in messages." }],
    },
  };
}

export const fakeModel: Model = {
  complete,
};
