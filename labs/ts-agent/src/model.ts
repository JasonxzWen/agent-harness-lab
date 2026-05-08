import type { AssistantMessage, LoopState } from "./messages";
import type { ContextBundle } from "./context";

export type ModelResponse = {
  message: AssistantMessage;
  stopReason: "tool_use" | "end_turn";
};

export type Model = {
  complete(state: LoopState, context?: ContextBundle): Promise<ModelResponse>;
};
