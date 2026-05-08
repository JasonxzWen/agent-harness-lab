# AGENTS.md

Scope: this file applies to `apps/knowledge-graph/`.

This app is the root-level showcase frontend for the Claude Code-like harness learning project. It should feel like a professional developer tool and knowledge operations console, not a marketing landing page.

## Product Goal

- Turn the linear harness learning path into an interactive knowledge graph.
- Make `labs/ts-agent/` mechanisms easier to explore, compare, and demo.
- Showcase frontend architecture, TypeScript modeling, interaction design, and AI agent harness understanding.

## Tech Rules

- Use Bun for all install, run, test, typecheck, and build commands.
- Use Vite + React + TypeScript.
- Use React Flow for the graph canvas.
- D3 may be introduced later for layout or motion, but keep the MVP simple.
- Avoid `any`; prefer explicit unions, typed records, and narrow data models.
- Do not use `dangerouslySetInnerHTML`.
- Do not add analytics, tracking scripts, remote logging, or external data sinks.

## Content Rules

- Store original summaries and reference metadata only.
- Do not copy CCB source, third-party docs, or local skill content into app data.
- Do not use `.external/skill-hub` as committed app content; it may be named only when documenting this boundary.
- Local references should point to paths such as `labs/ts-agent/src/loop.ts`, `learn/00-roadmap.md`, and `reference/mechanism-comparison.md`.

## Commands

```powershell
Set-Location D:\learn-cc\apps\knowledge-graph; bun install
Set-Location D:\learn-cc\apps\knowledge-graph; bun run dev
Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck
Set-Location D:\learn-cc\apps\knowledge-graph; bun run build
Set-Location D:\learn-cc\apps\knowledge-graph; bun test
```

## Verification

Before a complete milestone is considered done, run:

1. `Set-Location D:\learn-cc\apps\knowledge-graph; bun run typecheck`
2. `Set-Location D:\learn-cc\apps\knowledge-graph; bun run build`
3. Manual UI review in desktop and narrow viewport.
4. Diff review to confirm no `src/`, `packages/`, `docs/`, or `.external/skill-hub` content was copied or modified.
