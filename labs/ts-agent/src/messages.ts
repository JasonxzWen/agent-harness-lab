export type TextBlock = {
  type: "text";
  text: string;
};

export type ToolUseBlock = {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
};

export type ToolResultBlock = {
  type: "tool_result";
  toolUseId: string;
  content: string;
  isError: boolean;
};

export type AssistantContentBlock = TextBlock | ToolUseBlock;
export type UserContent = string | ToolResultBlock[];

export type UserMessage = {
  role: "user";
  content: UserContent;
};

export type AssistantMessage = {
  role: "assistant";
  content: AssistantContentBlock[];
};

export type Message = UserMessage | AssistantMessage;

export type LoopState = {
  messages: Message[];
  turnCount: number;
  transitionReason: "tool_result" | null;
  stopReason: "end_turn" | "max_tool_turns" | null;
};

export function createInitialState(query: string): LoopState {
  return {
    messages: [{ role: "user", content: query }],
    turnCount: 1,
    transitionReason: null,
    stopReason: null,
  };
}
