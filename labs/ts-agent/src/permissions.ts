export type PermissionRequirement =
  | "none"
  | "workspace_read"
  | "workspace_write"
  | "shell_execution";

export type PermissionDecision =
  | { type: "allow"; reason: string }
  | { type: "deny"; reason: string }
  | { type: "needs_approval"; reason: string };

export type ApprovalRequest = {
  id: string;
  toolUseId: string;
  toolName: string;
  permission: PermissionRequirement;
  reason: string;
  inputPreview: string;
};

export type PermissionPolicy = {
  requireApprovalForWrites?: boolean;
  requireApprovalForShell?: boolean;
  approvedToolUseIds?: string[];
};

export type PermissionPolicyPresetName =
  | "safe"
  | "workspace-write-approved"
  | "shell-approved";

export type PermissionPolicyInput =
  | PermissionPolicy
  | PermissionPolicyPresetName;

type BasePermissionPolicy = Required<
  Pick<PermissionPolicy, "requireApprovalForWrites" | "requireApprovalForShell">
>;

export type PermissionPolicyPreset = {
  name: PermissionPolicyPresetName;
  description: string;
  policy: BasePermissionPolicy;
};

export const PERMISSION_POLICY_PRESETS: Record<
  PermissionPolicyPresetName,
  PermissionPolicyPreset
> = {
  safe: {
    name: "safe",
    description: "Require explicit approval for workspace writes and shell execution.",
    policy: {
      requireApprovalForWrites: true,
      requireApprovalForShell: true,
    },
  },
  "workspace-write-approved": {
    name: "workspace-write-approved",
    description: "Allow workspace writes while shell execution still needs approval.",
    policy: {
      requireApprovalForWrites: false,
      requireApprovalForShell: true,
    },
  },
  "shell-approved": {
    name: "shell-approved",
    description: "Allow allowlisted shell execution while workspace writes still need approval.",
    policy: {
      requireApprovalForWrites: true,
      requireApprovalForShell: false,
    },
  },
};

export function evaluatePermission(
  requirement: PermissionRequirement,
  policy: PermissionPolicyInput = "safe",
): PermissionDecision {
  const resolvedPolicy = resolvePermissionPolicy(policy);

  if (requirement === "none" || requirement === "workspace_read") {
    return {
      type: "allow",
      reason: `${requirement} is allowed by default.`,
    };
  }

  if (requirement === "workspace_write") {
    if (resolvedPolicy.requireApprovalForWrites) {
      return {
        type: "needs_approval",
        reason: "Workspace writes require explicit approval.",
      };
    }

    return {
      type: "allow",
      reason: "Workspace writes are allowed by the active policy.",
    };
  }

  if (resolvedPolicy.requireApprovalForShell) {
    return {
      type: "needs_approval",
      reason: "Shell execution requires explicit approval.",
    };
  }

  return {
    type: "allow",
    reason: "Shell execution is allowed by the active policy.",
  };
}

export function denyPermission(reason: string): PermissionDecision {
  return { type: "deny", reason };
}

export function createApprovalRequest(input: {
  toolUseId: string;
  toolName: string;
  permission: PermissionRequirement;
  reason: string;
  input: Record<string, unknown>;
}): ApprovalRequest {
  return {
    id: `approval-${input.toolUseId}`,
    toolUseId: input.toolUseId,
    toolName: input.toolName,
    permission: input.permission,
    reason: input.reason,
    inputPreview: JSON.stringify(input.input),
  };
}

export function isToolUseApproved(
  toolUseId: string,
  policy: PermissionPolicyInput = "safe",
): boolean {
  const resolvedPolicy = resolvePermissionPolicy(policy);
  return resolvedPolicy.approvedToolUseIds?.includes(toolUseId) ?? false;
}

export function resolvePermissionPolicy(
  policy: PermissionPolicyInput = "safe",
): PermissionPolicy {
  if (typeof policy === "string") {
    return { ...PERMISSION_POLICY_PRESETS[policy].policy };
  }

  return { ...PERMISSION_POLICY_PRESETS.safe.policy, ...policy };
}
