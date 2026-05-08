import { buildContext } from "./context";
import type { Message } from "./messages";

const messages: Message[] = [
  {
    role: "user",
    content: "Stage 1: explain the agent loop and tool-use handoff.",
  },
  {
    role: "assistant",
    content: [
      {
        type: "text",
        text: "The loop calls a model, observes tool_use blocks, executes tools, then writes tool_result blocks back into messages.",
      },
    ],
  },
  {
    role: "user",
    content: "Stage 2: add TodoWrite so planning becomes durable harness state.",
  },
  {
    role: "assistant",
    content: [
      {
        type: "text",
        text: "TodoWrite records pending, in_progress, and completed items in workspace/todos.json.",
      },
    ],
  },
  {
    role: "user",
    content: "Stage 3: wire context engineering into the model boundary.",
  },
  {
    role: "assistant",
    content: [
      {
        type: "text",
        text: "The loop now builds a ContextBundle before calling the model.",
      },
    ],
  },
  {
    role: "user",
    content: "Stage 4: keep a summary when older messages are trimmed.",
  },
];

const context = await buildContext(messages, { maxMessageChars: 130 });

console.log(context.rendered);
