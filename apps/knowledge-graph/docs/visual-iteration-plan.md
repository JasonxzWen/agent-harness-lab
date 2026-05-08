# Knowledge Graph Visual Iteration Plan

Status: current visual direction approved after the Anthropic-style editorial pass.

## Current Decision

The app now uses an editorial showcase entry instead of a dense tool-console shell.
The approved direction keeps:

- large asymmetric hero typography;
- monochrome cream/ink palette from `DESIGN.md`;
- one dark visual block as the main editorial signal;
- a small set of low-friction navigation links;
- three supporting capability cards below the hero.

The goal is not to clone Anthropic exactly. The current version intentionally borrows
the editorial structure, then should diverge through harness-specific visual language
and product behavior in later iterations.

## What Changed In This Pass

- Replaced the previous dashboard-like three-column UI with a landing-like editorial
  entry page.
- Removed permanent filter, drawer, and node-control panels from the first viewport.
- Reduced visible actions to Research, Mechanisms, References, Learn, and the Open
  Graph CTA.
- Converted the graph from a dense interactive canvas preview into a dark editorial
  visual block.
- Removed icon-library usage, gradients, shadows, and non-token colors from source.

## Next Iteration Plan

### 1. Differentiate From Anthropic Without Losing The Style

Keep the editorial layout, but make the visual identity more specific to the harness
learning project:

- replace the current polygon visual with a harness-specific diagram language;
- use terms from agent internals, such as loop, registry, result write-back, memory,
  permissions, and compact;
- avoid copying Anthropic content-block composition one-to-one.

Acceptance:

- the page still feels editorial and restrained;
- the page no longer reads as a direct Anthropic clone;
- no new color token is introduced without updating `DESIGN.md`.

### 2. Turn The Dark Visual Block Into A Product Entry

Make the dark block a deliberate entry point rather than decorative media:

- add a lightweight state for the selected mechanism;
- reveal one mechanism path at a time;
- keep controls minimal and text-based;
- avoid reintroducing sidebars or permanent drawers in the hero viewport.

Acceptance:

- the user can understand the core interaction in under five seconds;
- visible controls stay within three primary actions;
- typecheck and build pass.

### 3. Reintroduce Knowledge Graph Data Behind The Editorial Surface

Move from static presentation to typed graph content:

- define the first typed graph model;
- add 12-18 high-signal harness nodes first, not the full 30+ node set;
- connect references by metadata only;
- keep long explanations behind progressive disclosure.

Acceptance:

- graph data is typed;
- no copied CCB source or third-party body content enters app data;
- the first viewport remains uncluttered.

### 4. Add Responsive And Visual Regression Checks

Formalize visual verification:

- capture desktop and narrow viewport screenshots;
- check that hero text does not overlap;
- check that the dark block remains visible in the first viewport;
- add a lightweight Playwright screenshot script when test tooling is introduced.

Acceptance:

- desktop and mobile screenshots are attached to each visual PR;
- `bun run typecheck` and `bun run build` pass before review.

## Deferred Decisions

- Whether to extend `DESIGN.md` with additional Anthropic-like tinted block tokens.
- Whether OpenSpec should govern the eventual multi-state graph explorer.
- Whether React Flow should appear in the first viewport or only after entering the
  graph explorer.

## Verification Commands

```powershell
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run typecheck
Set-Location D:\agent-harness-lab\apps\knowledge-graph; bun run build
```
