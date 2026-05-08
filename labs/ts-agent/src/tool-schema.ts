export type TodoStatus = "pending" | "in_progress" | "completed";

export type TodoInput = {
  content: string;
  status: TodoStatus;
};

export type ToolInputFieldType = "string" | "string[]" | "todo[]";

export type ToolInputFieldSchema = {
  type: ToolInputFieldType;
  description: string;
  required?: boolean;
};

export type ToolInputSchema = {
  type: "object";
  properties: Record<string, ToolInputFieldSchema>;
  additionalProperties?: boolean;
};

export type ToolInputValidationResult =
  | { ok: true; input: Record<string, unknown> }
  | { ok: false; error: string };

export function validateToolInput(
  schema: ToolInputSchema,
  input: Record<string, unknown>,
): ToolInputValidationResult {
  if (!schema.additionalProperties) {
    for (const key of Object.keys(input)) {
      if (!(key in schema.properties)) {
        return { ok: false, error: `Unknown input field: ${key}` };
      }
    }
  }

  for (const [key, field] of Object.entries(schema.properties)) {
    const value = input[key];

    if (value === undefined) {
      if (field.required) {
        return { ok: false, error: `Missing required input: ${key}` };
      }
      continue;
    }

    if (field.type === "string" && typeof value !== "string") {
      return { ok: false, error: `Input ${key} must be a string` };
    }

    if (
      field.type === "string[]" &&
      (!Array.isArray(value) || !value.every((item) => typeof item === "string"))
    ) {
      return { ok: false, error: `Input ${key} must be a string array` };
    }

    if (field.type === "todo[]" && !isTodoArray(value)) {
      return {
        ok: false,
        error: `Input ${key} must be a todo array`,
      };
    }
  }

  return { ok: true, input };
}

function isTodoArray(value: unknown): value is TodoInput[] {
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
