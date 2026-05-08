import type { ToolResultBlock, ToolUseBlock } from "./messages";
import type { PermissionPolicyPresetName } from "./permissions";
import { PERMISSION_POLICY_PRESETS } from "./permissions";
import { executeTool } from "./tools";

const presets: PermissionPolicyPresetName[] = [
  "safe",
  "workspace-write-approved",
  "shell-approved",
];

function summarizeToolResult(result: ToolResultBlock): unknown {
  return JSON.parse(result.content) as unknown;
}

async function runTool(
  label: string,
  toolUse: ToolUseBlock,
  preset: PermissionPolicyPresetName,
): Promise<void> {
  const result = await executeTool(toolUse, preset);

  console.log(`\n### ${label}`);
  console.log(
    JSON.stringify(
      {
        isError: result.isError,
        content: summarizeToolResult(result),
      },
      null,
      2,
    ),
  );
}

for (const preset of presets) {
  const presetInfo = PERMISSION_POLICY_PRESETS[preset];

  console.log(`\n## preset: ${presetInfo.name}`);
  console.log(presetInfo.description);

  await runTool(
    "workspace write",
    {
      type: "tool_use",
      id: `policy-${preset}-write`,
      name: "write_file",
      input: {
        path: `policy-presets/${preset}.txt`,
        content: `Written while policy preset is ${preset}.`,
      },
    },
    preset,
  );

  await runTool(
    "allowlisted shell",
    {
      type: "tool_use",
      id: `policy-${preset}-shell`,
      name: "run_shell",
      input: {
        command: "bun",
        args: ["--version"],
      },
    },
    preset,
  );
}
