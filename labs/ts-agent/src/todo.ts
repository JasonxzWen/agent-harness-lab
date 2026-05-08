import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { TodoInput, TodoStatus } from "./tool-schema";

export type Todo = {
  id: string;
  content: string;
  status: TodoStatus;
};

const TODO_FILE = path.resolve(process.cwd(), "workspace", "todos.json");

async function ensureTodoDir(): Promise<void> {
  await mkdir(path.dirname(TODO_FILE), { recursive: true });
}

export async function readTodos(): Promise<Todo[]> {
  try {
    const content = await readFile(TODO_FILE, "utf8");
    const parsed = JSON.parse(content) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isTodo);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writeTodos(items: TodoInput[]): Promise<Todo[]> {
  validateTodos(items);
  await ensureTodoDir();
  const todos = items.map((item, index) => ({
    id: `todo-${index + 1}`,
    content: item.content,
    status: item.status,
  }));

  await writeFile(TODO_FILE, `${JSON.stringify(todos, null, 2)}\n`, "utf8");
  return todos;
}

function validateTodos(items: TodoInput[]): void {
  const emptyContent = items.find((item) => item.content.trim().length === 0);
  if (emptyContent) {
    throw new Error("Todo content cannot be empty");
  }

  const inProgressCount = items.filter(
    (item) => item.status === "in_progress",
  ).length;

  if (inProgressCount > 1) {
    throw new Error("Only one todo can be in_progress at a time");
  }
}

function isTodo(value: unknown): value is Todo {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "content" in value &&
    typeof value.content === "string" &&
    "status" in value &&
    (value.status === "pending" ||
      value.status === "in_progress" ||
      value.status === "completed")
  );
}
