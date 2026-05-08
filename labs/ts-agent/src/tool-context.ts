import type { ToolInputFieldSchema, ToolInputSchema } from "./tool-schema";
import { listTools } from "./tools";

function formatField(name: string, field: ToolInputFieldSchema): string {
  const required = field.required ? "required" : "optional";
  return `  - ${name}: ${field.type}, ${required}. ${field.description}`;
}

function formatSchema(schema: ToolInputSchema): string {
  const fields = Object.entries(schema.properties).map(([name, field]) =>
    formatField(name, field),
  );

  if (fields.length === 0) {
    return "  - no input";
  }

  return fields.join("\n");
}

export function buildToolContext(): string {
  const tools = listTools();
  const sections = tools.map((tool) =>
    [
      `Tool: ${tool.name}`,
      `Description: ${tool.description}`,
      `Permission: ${tool.permission}`,
      "Input:",
      formatSchema(tool.inputSchema),
    ].join("\n"),
  );

  return ["Available tools:", ...sections].join("\n\n");
}

if (import.meta.main) {
  console.log(buildToolContext());
}
