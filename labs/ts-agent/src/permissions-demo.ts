import type { ToolUseBlock } from "./messages";
import { executeTool } from "./tools";

async function runCase(
  title: string,
  toolUse: ToolUseBlock,
  policy?: Parameters<typeof executeTool>[1],
): Promise<void> {
  const result = await executeTool(toolUse, policy);

  console.log(`\n## ${title}`);
  console.log(JSON.stringify(result, null, 2));
}

await runCase("read tools are allowed", {
  type: "tool_use",
  id: "permission-read",
  name: "todo_read",
  input: {},
});

await runCase("workspace writes need approval by default", {
  type: "tool_use",
  id: "permission-write-request",
  name: "write_file",
  input: {
    path: "permission-demo.txt",
    content: "This write is blocked until approval is modeled.",
  },
});

await runCase("unsafe shell is denied before approval", {
  type: "tool_use",
  id: "permission-deny-shell",
  name: "run_shell",
  input: {
    command: "rm",
    args: ["-rf", "."],
  },
});

await runCase(
  "approved workspace write can execute by tool_use id",
  {
    type: "tool_use",
    id: "permission-write-request",
    name: "write_file",
    input: {
      path: "permission-demo.txt",
      content: "This write ran with an approval-like policy.",
    },
  },
  { approvedToolUseIds: ["permission-write-request"] },
);

await runCase(
  "approved allowlisted shell can execute by tool_use id",
  {
    type: "tool_use",
    id: "permission-shell-request",
    name: "run_shell",
    input: {
      command: "bun",
      args: ["--version"],
    },
  },
  { approvedToolUseIds: ["permission-shell-request"] },
);
