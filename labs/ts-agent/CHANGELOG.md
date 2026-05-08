# Changelog

## Unreleased

- Added named permission policy presets and a demo for safe, workspace-write-approved, and shell-approved execution.
- Added stage 2 tool registry concepts: input schemas, validation, structured success/error results, and name-to-handler dispatch.
- Added workspace-bounded `read_file`, `write_file`, and `list_files` tools.
- Added a simplified allowlisted `run_shell` tool.
- Added a tool catalog script and fake-model demos for schema, unknown-tool, path-boundary, and shell-boundary errors.
- Documented the Tool Registry learning model and demo commands.
- Added one-step fake-model recovery from structured tool errors.
- Clarified that Tool Registry demo commands must run from `labs/ts-agent/`.
- Added a `tool-context` script that formats the registry as model-facing tool context.
- Added the first TodoWrite experiment with `todo_write`, `todo_read`, and persisted `workspace/todos.json` state.
- Fixed fake-model intent ordering so `read todos` dispatches to `todo_read` before generic `read_file`.
- Added a TodoWrite-driven fake workflow that writes a file and then marks the plan complete.
- Added TodoWrite state invariants and recovery from an invalid multi-`in_progress` todo list.
- Split fake model behavior out of `loop.ts` into `fake-model.ts` so the agent loop only owns orchestration.
- Documented the teaching harness module boundaries.
- Added a `Model` interface so `agentLoop` can accept any model implementation, with `fakeModel` as the default.
- Added a second scripted model implementation and a `model-demo` script to prove model injection works.
- Added `maxToolTurns` to the agent loop plus a never-ending scripted model demo to show loop boundaries.
- Added `LoopState.stopReason` so callers can distinguish normal end turns from loop-limit stops.
- Updated model demos to print the full `LoopState`, including `stopReason`.
- Added a Stage 3 checkpoint that summarizes TodoWrite, model injection, and loop boundary mechanisms.
- Added the initial fake agent loop.
- Added message types for user, assistant, tool use, and tool result.
- Added a minimal tool registry with an `echo` tool.
- Added TypeScript/Bun project configuration.
