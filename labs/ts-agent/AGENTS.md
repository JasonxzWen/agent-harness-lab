# AGENTS.md

Scope: this file applies to `labs/ts-agent/`.

This directory contains the from-scratch TypeScript/Bun learning implementation of a Claude Code-like agent harness.

## Goals

- Build the smallest understandable version first.
- Prefer explicit types and readable control flow.
- Keep the implementation teachable.
- Add complexity only after the current mechanism is understood and verified.

## Commands

```powershell
bun install
bun run dev "hello agent"
bun run typecheck
```

If `bun` is not in PATH on Windows:

```powershell
& 'C:\Users\Admin\.bun\bin\bun.exe' run typecheck
```

## Implementation Rules

- Do not introduce frameworks unless a module explicitly needs one.
- Avoid `any`; use `Record<string, unknown>` for unknown tool input.
- Keep fake model support until the real model path is stable.
- Tool results must be appended back to messages.
- File tools must be constrained to a local workspace directory.
- Permissions must be added before dangerous tools.

## Module Workflow

For each module:

1. Read the module plan in `learn/03-zero-to-one-plan.md`.
2. Implement the smallest working version.
3. Run `bun run typecheck`.
4. Update `labs/ts-agent/CHANGELOG.md`.
5. Add or update notes when useful.

## Testing

At the current stage, `bun run typecheck` is the required check.

As modules grow, add focused tests near the implementation. Do not add broad test scaffolding before there is behavior worth testing.
