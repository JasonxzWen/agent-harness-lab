import { readFile } from "node:fs/promises";
import path from "node:path";

const MEMORY_PATH = path.resolve(process.cwd(), "memory.md");

export async function readMemory(): Promise<string> {
  try {
    return await readFile(MEMORY_PATH, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return "No memory file found.";
    }

    throw error;
  }
}
