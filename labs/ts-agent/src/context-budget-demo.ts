import { buildContext } from "./context";
import type { Message } from "./messages";

const messages: Message[] = [
  {
    role: "user",
    content: "Initial request: build a small agent harness.",
  },
  {
    role: "assistant",
    content: [
      {
        type: "text",
        text: "We implemented tool registry and basic tool dispatch.",
      },
    ],
  },
  {
    role: "user",
    content: "Next, add TodoWrite and durable task state.",
  },
  {
    role: "assistant",
    content: [
      {
        type: "text",
        text: "TodoWrite now persists structured todos to workspace/todos.json.",
      },
    ],
  },
  {
    role: "user",
    content: "Now connect dynamic context into the model boundary.",
  },
  {
    role: "assistant",
    content: [
      {
        type: "text",
        text: "Context now includes project rules, memory, tools, and recent messages.",
      },
    ],
  },
];

const context = await buildContext(messages, { maxMessageChars: 180 });

console.log(context.rendered);
