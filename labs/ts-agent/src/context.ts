import type { Message } from "./messages";
import { readMemory } from "./memory";
import { readProjectRules } from "./project-rules";
import { buildToolContext } from "./tool-context";

const DEFAULT_MAX_MESSAGE_CHARS = 4_000;

export type BuildContextOptions = {
  maxMessageChars?: number;
};

export type ContextBundle = {
  projectRules: string;
  memory: string;
  toolContext: string;
  conversationSummary: string | null;
  messages: Message[];
  omittedMessageCount: number;
  messageCharBudget: number;
  rendered: string;
};

function serializeMessageContent(message: Message): string {
  return typeof message.content === "string"
    ? message.content
    : JSON.stringify(message.content, null, 2);
}

function renderMessages(messages: Message[], omittedMessageCount: number): string {
  const omittedLine =
    omittedMessageCount > 0
      ? [`[context trimmed ${omittedMessageCount} earlier message(s)]`]
      : [];

  const renderedMessages = messages.map((message, index) => {
    return `[${index + 1}] ${message.role}\n${serializeMessageContent(message)}`;
  });

  return [...omittedLine, ...renderedMessages]
    .join("\n\n");
}

function trimMessagesToBudget(
  messages: Message[],
  maxMessageChars: number,
): {
  messages: Message[];
  omittedMessages: Message[];
  omittedMessageCount: number;
} {
  const selected: Message[] = [];
  let usedChars = 0;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message) {
      continue;
    }

    const messageChars = serializeMessageContent(message).length;
    if (selected.length > 0 && usedChars + messageChars > maxMessageChars) {
      break;
    }

    selected.unshift(message);
    usedChars += messageChars;
  }

  return {
    messages: selected,
    omittedMessages: messages.slice(0, messages.length - selected.length),
    omittedMessageCount: messages.length - selected.length,
  };
}

function getMessagePreview(message: Message): string {
  const content = serializeMessageContent(message)
    .replace(/\s+/g, " ")
    .trim();

  if (content.length <= 90) {
    return content;
  }

  return `${content.slice(0, 87)}...`;
}

function summarizeOmittedMessages(messages: Message[]): string | null {
  if (messages.length === 0) {
    return null;
  }

  const lines = messages.map((message, index) => {
    return `- ${index + 1}. ${message.role}: ${getMessagePreview(message)}`;
  });

  return [
    `Earlier conversation summary (${messages.length} message(s) omitted):`,
    ...lines,
  ].join("\n");
}

function renderContextBundle(
  projectRules: string,
  memory: string,
  toolContext: string,
  conversationSummary: string | null,
  messages: Message[],
  omittedMessageCount: number,
  messageCharBudget: number,
): string {
  return [
    "# Project Rules",
    projectRules.trim(),
    "# Memory",
    memory.trim(),
    "# Tool Context",
    toolContext.trim(),
    "# Context Budget",
    `Message character budget: ${messageCharBudget}`,
    `Omitted earlier messages: ${omittedMessageCount}`,
    "# Conversation Summary",
    conversationSummary ?? "No earlier messages were summarized.",
    "# Conversation Messages",
    renderMessages(messages, omittedMessageCount),
  ].join("\n\n");
}

export async function buildContext(
  messages: Message[],
  options: BuildContextOptions = {},
): Promise<ContextBundle> {
  const messageCharBudget =
    options.maxMessageChars ?? DEFAULT_MAX_MESSAGE_CHARS;
  const [projectRules, memory] = await Promise.all([
    readProjectRules(),
    readMemory(),
  ]);
  const toolContext = buildToolContext();
  const trimmed = trimMessagesToBudget(messages, messageCharBudget);
  const conversationSummary = summarizeOmittedMessages(trimmed.omittedMessages);

  return {
    projectRules,
    memory,
    toolContext,
    conversationSummary,
    messages: trimmed.messages,
    omittedMessageCount: trimmed.omittedMessageCount,
    messageCharBudget,
    rendered: renderContextBundle(
      projectRules,
      memory,
      toolContext,
      conversationSummary,
      trimmed.messages,
      trimmed.omittedMessageCount,
      messageCharBudget,
    ),
  };
}
