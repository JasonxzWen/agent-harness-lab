import type { ToolUseBlock } from "./messages";
import { executeTool } from "./tools";

const writeRequest: ToolUseBlock = {
  type: "tool_use",
  id: "approval-demo-write",
  name: "write_file",
  input: {
    path: "approval-demo.txt",
    content: "This write only runs after the tool_use id is approved.",
  },
};

const approvalRequired = await executeTool(writeRequest);
const approvedReplay = await executeTool(writeRequest, {
  approvedToolUseIds: [writeRequest.id],
});

console.log("## approval request");
console.log(JSON.stringify(approvalRequired, null, 2));

console.log("\n## approved replay");
console.log(JSON.stringify(approvedReplay, null, 2));
