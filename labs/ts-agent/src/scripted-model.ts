import type { LoopState } from "./messages";
import type { ContextBundle } from "./context";
import type { Model, ModelResponse } from "./model";

function hasToolResult(state: LoopState): boolean {
  const lastMessage = state.messages.at(-1);
  return lastMessage?.role === "user" && Array.isArray(lastMessage.content);
}

export function createEchoThenDoneModel(): Model {
  return {
    async complete(state: LoopState): Promise<ModelResponse> {
      if (hasToolResult(state)) {
        const lastMessage = state.messages.at(-1);
        const firstResult =
          lastMessage?.role === "user" && Array.isArray(lastMessage.content)
            ? lastMessage.content[0]
            : null;

        return {
          stopReason: "end_turn",
          message: {
            role: "assistant",
            content: [
              {
                type: "text",
                text: `Scripted model finished after observing: ${firstResult?.content}`,
              },
            ],
          },
        };
      }

      return {
        stopReason: "tool_use",
        message: {
          role: "assistant",
          content: [
            {
              type: "tool_use",
              id: `scripted-tool-${state.turnCount}`,
              name: "echo",
              input: {
                text: "Hello from an injected scripted model.",
              },
            },
          ],
        },
      };
    },
  };
}

export function createNeverEndingEchoModel(): Model {
  return {
    async complete(state: LoopState): Promise<ModelResponse> {
      return {
        stopReason: "tool_use",
        message: {
          role: "assistant",
          content: [
            {
              type: "tool_use",
              id: `never-ending-tool-${state.turnCount}`,
              name: "echo",
              input: {
                text: `Loop turn ${state.turnCount}`,
              },
            },
          ],
        },
      };
    },
  };
}

export function createContextProbeModel(): Model {
  return {
    async complete(
      _state: LoopState,
      context?: ContextBundle,
    ): Promise<ModelResponse> {
      const hasProjectRules = Boolean(context?.projectRules.includes("TS Agent"));
      const hasMemory = Boolean(context?.memory.includes("Claude Code-like"));
      const hasToolContext = Boolean(context?.toolContext.includes("todo_write"));
      const messageCount = context?.messages.length ?? 0;

      return {
        stopReason: "end_turn",
        message: {
          role: "assistant",
          content: [
            {
              type: "text",
              text: [
                `projectRules=${hasProjectRules}`,
                `memory=${hasMemory}`,
                `toolContext=${hasToolContext}`,
                `messages=${messageCount}`,
              ].join("\n"),
            },
          ],
        },
      };
    },
  };
}
