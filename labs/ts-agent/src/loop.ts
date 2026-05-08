import type { AssistantMessage, LoopState, ToolUseBlock } from "./messages";
import { fakeModel } from "./fake-model";
import type { Model } from "./model";
import { buildContext } from "./context";
import type { PermissionPolicyInput } from "./permissions";
import { executeTool } from "./tools";

export type AgentLoopOptions = {
  maxToolTurns?: number;
  permissionPolicy?: PermissionPolicyInput;
};

const DEFAULT_MAX_TOOL_TURNS = 10;

function findToolUses(message: AssistantMessage): ToolUseBlock[] {
  return message.content.filter((block) => block.type === "tool_use");
}

export async function agentLoop(
  state: LoopState,
  model: Model = fakeModel,
  options: AgentLoopOptions = {},
): Promise<LoopState> {
  const maxToolTurns = options.maxToolTurns ?? DEFAULT_MAX_TOOL_TURNS;

  while (true) {
    if (state.turnCount > maxToolTurns) {
      state.messages.push({
        role: "assistant",
        content: [
          {
            type: "text",
            text: `Stopped after reaching max tool turns: ${maxToolTurns}`,
          },
        ],
      });
      state.transitionReason = null;
      state.stopReason = "max_tool_turns";
      return state;
    }

    const context = await buildContext(state.messages);
    const response = await model.complete(state, context);

    state.messages.push(response.message);

    if (response.stopReason !== "tool_use") {
      state.transitionReason = null;
      state.stopReason = "end_turn";
      return state;
    }

    const toolResults = await Promise.all(
      findToolUses(response.message).map((toolUse) =>
        executeTool(toolUse, options.permissionPolicy),
      ),
    );

    state.messages.push({ role: "user", content: toolResults });
    state.turnCount += 1;
    state.transitionReason = "tool_result";
    state.stopReason = null;
  }
}
