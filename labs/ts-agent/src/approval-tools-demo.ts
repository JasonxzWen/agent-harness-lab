import { approveToolUse } from "./approval-store";
import type { ToolUseBlock } from "./messages";
import { executeTool } from "./tools";

async function printToolResult(title: string, toolUse: ToolUseBlock): Promise<void> {
  const result = await executeTool(toolUse);

  console.log(`\n## ${title}`);
  console.log(JSON.stringify(result, null, 2));
}

const writeRequest: ToolUseBlock = {
  type: "tool_use",
  id: "approval-tools-write",
  name: "write_file",
  input: {
    path: "approval-tools-demo.txt",
    content: "This write creates a pending approval for approval_read.",
  },
};

await printToolResult("create pending approval", writeRequest);

await printToolResult("agent can read pending approvals", {
  type: "tool_use",
  id: "approval-tools-read",
  name: "approval_read",
  input: {},
});

const approved = await approveToolUse(writeRequest.id);
console.log("\n## user-side approval");
console.log(JSON.stringify(approved, null, 2));

await printToolResult("agent can read approval history", {
  type: "tool_use",
  id: "approval-tools-history",
  name: "approval_history",
  input: {},
});
