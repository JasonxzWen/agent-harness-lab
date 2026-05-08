# Ralph Codex Agent Instructions

You are an autonomous Codex coding agent running inside a Ralph loop.

## Task

1. Read `scripts/ralph/prd.json`.
2. Read `scripts/ralph/progress.txt`, especially the `Codebase Patterns` section.
3. Read `AGENTS.md`, `DESIGN.md`, and `apps/knowledge-graph/AGENTS.md` before changing code.
4. Check that the repository is on the PRD `branchName`. If it is not, create or check out that branch from `main`.
5. Pick the highest-priority user story where `passes` is `false`.
6. Implement that single story only. Each story may complete one functional node, not multiple stories at once.
7. Run the story acceptance commands exactly when applicable:
   - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck`
   - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun test`
   - `Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build`
8. For every UI story, open the app in the Codex in-app browser, take a screenshot, compare against `AGENTS.md`, `apps/knowledge-graph/AGENTS.md`, and `DESIGN.md`, then tune UI, copy, and interaction states before marking the story passing.
9. For every UI story, document in `progress.txt`:
   - Browser screenshot result.
   - Hover / focus / active / click feedback.
   - Global thinking check: whether elements are too many, whether layout is squeezed, and whether the user path is confusing.
   - Whether `why / what / how` is visualized.
10. Every knowledge point must have a `why / what / how` visual element, either Mermaid-style structure or a lightweight React/CSS interaction.
11. Any unfinished entry must visibly say `暂未实现` or an equivalent short Chinese hint.
12. Do not copy `.external/skill-hub`, CCB source, third-party body text, local skill bodies, `node_modules`, `dist`, or `labs/ts-agent/workspace` into the commit.
13. Update nearby `AGENTS.md` files only when you discover reusable codebase knowledge.
14. If checks pass, commit all story changes with message `feat: [Story ID] - [Story Title]`.
15. Update `scripts/ralph/prd.json` and set that story's `passes` to `true`.
16. Append a progress entry to `scripts/ralph/progress.txt`.

If the Codex CLI cannot use the in-app browser for a UI story, stop and report that limitation. Do not claim browser verification happened.

## Progress Entry Format

Append to `scripts/ralph/progress.txt`; do not replace the file.

```text
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- Checks run
- Learnings for future iterations:
  - Reusable patterns discovered
  - Gotchas encountered
  - Useful codebase context
---
```

## Codebase Patterns

If you discover a reusable pattern, add it to the `## Codebase Patterns` section near the top of `progress.txt`. Add only durable, general knowledge. Do not add story-specific details.

Examples:

- Use the existing repository helper for database access.
- Migrations must include both upgrade and downgrade paths.
- UI tests require the dev server to be running on a specific port.

## Quality Requirements

- Do not commit broken code.
- Keep each iteration focused on one story.
- Run the checks named in the story acceptance criteria.
- If a required check cannot be run, document the reason in `progress.txt` and do not mark the story passing unless the remaining evidence is sufficient.
- Use Bun commands for this repository.
- Keep production TypeScript free of `any`.
- Do not add a new icon library.
- Chinese Markdown files should not be rewritten wholesale through PowerShell. Use `apply_patch`, or Node.js UTF-8 read/write only when necessary and verified.
- Use Conventional Commits exactly as `feat: [US-xxx] - [Story Title]` for each completed story.

## UI Stories

For stories that change UI, verify in a browser when the environment supports it. Use Codex browser capabilities, Playwright, or the repository's existing E2E tooling.

For this repository, UI verification must prefer the Codex in-app browser. Include screenshot notes in `progress.txt`. Also verify:

- Hover / focus / active / click feedback is clear and does not use `box-shadow`, gradients, or scaling.
- New text is short, Chinese-first, and easy to scan.
- New layout does not push the primary graph, drawer, toolbar, or mobile flow out of view.
- Unimplemented controls show `暂未实现`.
- `why / what / how` is visible for knowledge points.

## Stop Condition

After completing a story, check whether all stories have `passes: true`.

If all stories are complete, output exactly:

```xml
<promise>COMPLETE</promise>
```

If stories remain, end normally. The outer Ralph loop will start the next fresh Codex execution.
