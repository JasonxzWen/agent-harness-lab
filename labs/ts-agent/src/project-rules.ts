import { readFile } from "node:fs/promises";
import path from "node:path";

const PROJECT_RULES_PATH = path.resolve(process.cwd(), "PROJECT.md");

export async function readProjectRules(): Promise<string> {
  try {
    return await readFile(PROJECT_RULES_PATH, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return "No project rules file found.";
    }

    throw error;
  }
}
