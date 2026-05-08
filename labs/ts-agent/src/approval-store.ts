import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ApprovalRequest } from "./permissions";

export type StoredApproval = ApprovalRequest & {
  status: "pending" | "approved";
};

const APPROVALS_FILE = path.resolve(process.cwd(), "workspace", "approvals.json");

async function ensureApprovalsDir(): Promise<void> {
  await mkdir(path.dirname(APPROVALS_FILE), { recursive: true });
}

function isStoredApproval(value: unknown): value is StoredApproval {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "toolUseId" in value &&
    typeof value.toolUseId === "string" &&
    "toolName" in value &&
    typeof value.toolName === "string" &&
    "permission" in value &&
    typeof value.permission === "string" &&
    "reason" in value &&
    typeof value.reason === "string" &&
    "inputPreview" in value &&
    typeof value.inputPreview === "string" &&
    "status" in value &&
    (value.status === "pending" || value.status === "approved")
  );
}

async function writeApprovals(approvals: StoredApproval[]): Promise<void> {
  await ensureApprovalsDir();
  await writeFile(
    APPROVALS_FILE,
    `${JSON.stringify(approvals, null, 2)}\n`,
    "utf8",
  );
}

export async function readApprovals(): Promise<StoredApproval[]> {
  try {
    const content = await readFile(APPROVALS_FILE, "utf8");
    const parsed = JSON.parse(content) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isStoredApproval);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function recordApprovalRequest(
  request: ApprovalRequest,
): Promise<StoredApproval> {
  const approvals = await readApprovals();
  const existing = approvals.find((approval) => approval.id === request.id);
  const stored: StoredApproval = { ...request, status: "pending" };

  if (existing) {
    const next = approvals.map((approval) =>
      approval.id === request.id ? { ...approval, ...stored } : approval,
    );
    await writeApprovals(next);
    return stored;
  }

  await writeApprovals([...approvals, stored]);
  return stored;
}

export async function approveToolUse(
  toolUseId: string,
): Promise<StoredApproval | null> {
  const approvals = await readApprovals();
  const existing = approvals.find(
    (approval) => approval.toolUseId === toolUseId,
  );

  if (!existing) {
    return null;
  }

  const approved: StoredApproval = { ...existing, status: "approved" };
  const next = approvals.map((approval) =>
    approval.id === approved.id ? approved : approval,
  );
  await writeApprovals(next);
  return approved;
}

export async function listPendingApprovals(): Promise<StoredApproval[]> {
  const approvals = await readApprovals();
  return approvals.filter((approval) => approval.status === "pending");
}
