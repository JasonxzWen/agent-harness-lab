import {
  approveToolUse,
  listPendingApprovals,
  readApprovals,
} from "./approval-store";
import type { ToolUseBlock } from "./messages";
import { executeTool } from "./tools";

const toolUse: ToolUseBlock = {
  type: "tool_use",
  id: "approval-store-write",
  name: "write_file",
  input: {
    path: "approval-store-demo.txt",
    content: "This write is tracked through workspace/approvals.json.",
  },
};

const requestResult = await executeTool(toolUse);
const pendingApprovals = await listPendingApprovals();
const approved = await approveToolUse(toolUse.id);
const replayResult = await executeTool(toolUse, {
  approvedToolUseIds: [toolUse.id],
});
const allApprovals = await readApprovals();

console.log("## request result");
console.log(JSON.stringify(requestResult, null, 2));

console.log("\n## pending approvals");
console.log(JSON.stringify(pendingApprovals, null, 2));

console.log("\n## approved record");
console.log(JSON.stringify(approved, null, 2));

console.log("\n## replay result");
console.log(JSON.stringify(replayResult, null, 2));

console.log("\n## approvals store");
console.log(JSON.stringify(allApprovals, null, 2));
