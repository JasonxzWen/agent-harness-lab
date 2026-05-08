import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  knowledgeEdges,
  knowledgeNodes,
  themeLabels,
} from "../src/data/knowledgeGraph";
import { nodeDetailCopy, nodeDisplayCopy } from "../src/data/copy";
import { learningPaths } from "../src/data/paths";
import { sourceReferences } from "../src/data/references";

const nodeIds = new Set(knowledgeNodes.map((node) => node.id));
const referenceKinds = new Set([
  "local-doc",
  "lab-source",
  "ccb-source-mapping",
  "external-link",
]);
const forbiddenCopyTerms = [
  "赋能",
  "打造",
  "沉淀",
  "范式",
  "生态",
  "底座",
  "抓手",
  "心智",
  "信息熵",
  "可探索",
  "闭环",
  "数据底座",
  "高信息密度",
];
const forbiddenPathFragments = [
  ".external/skill-hub",
  "node_modules",
  "dist",
  "labs/ts-agent/workspace",
];
const allowedReferencePrefixes = [
  "learn/",
  "labs/ts-agent/src/",
  "labs/ts-agent/docs/",
  "reference/",
  "apps/knowledge-graph/",
  ".external/ccb/",
  "https://",
];
const allowedCssHexColors = new Set([
  "#F0EEE6",
  "#141413",
  "#1E1D1A",
  "#6B6862",
]);
const disallowedCssPatterns = [
  "box-shadow",
  "linear-gradient",
  "radial-gradient",
  "feTurbulence",
];
const projectRoot = resolve(import.meta.dir, "../../..");
const userFacingDocs = [
  "README.md",
  "apps/knowledge-graph/README.md",
  "apps/knowledge-graph/docs/overall-design.md",
  "apps/knowledge-graph/docs/development-plan.md",
  "apps/knowledge-graph/docs/milestones.md",
  "apps/knowledge-graph/docs/visual-iteration-plan.md",
  "learn/01-typescript-bun.md",
  "learn/03-zero-to-one-plan.md",
  "learn/06-mermaid-learning-map.md",
];
const userFacingSourceFiles = [
  "apps/knowledge-graph/src/components/layout/AppShell.tsx",
  "apps/knowledge-graph/src/components/layout/GraphToolbar.tsx",
  "apps/knowledge-graph/src/components/graph/KnowledgeGraphCanvas.tsx",
  "apps/knowledge-graph/src/components/drawer/DetailDrawer.tsx",
  "apps/knowledge-graph/src/components/ui/CommandBlock.tsx",
  "apps/knowledge-graph/src/data/copy.ts",
  "apps/knowledge-graph/src/data/paths.ts",
];
const cssFiles = [
  "apps/knowledge-graph/src/styles/global.css",
  "apps/knowledge-graph/src/styles/app-shell.css",
];

test("seed graph keeps the MVP node count in range", () => {
  expect(knowledgeNodes.length).toBeGreaterThanOrEqual(25);
  expect(knowledgeNodes.length).toBeLessThanOrEqual(35);
});

test("seed graph ids are unique", () => {
  expect(nodeIds.size).toBe(knowledgeNodes.length);
});

test("learning paths only reference existing nodes", () => {
  expect(learningPaths).toHaveLength(4);

  for (const path of learningPaths) {
    expect(path.nodeIds.length).toBeGreaterThan(0);

    for (const nodeId of path.nodeIds) {
      expect(nodeIds.has(nodeId)).toBe(true);
    }
  }
});

test("edges only connect existing nodes", () => {
  for (const edge of knowledgeEdges) {
    expect(nodeIds.has(edge.source)).toBe(true);
    expect(nodeIds.has(edge.target)).toBe(true);
  }
});

test("nodes use known themes and bounded reference kinds", () => {
  const themes = new Set(Object.keys(themeLabels));

  for (const node of knowledgeNodes) {
    expect(themes.has(node.theme)).toBe(true);

    for (const reference of [
      ...node.labFiles,
      ...node.ccbMappings,
      ...node.externalLinks,
    ]) {
      expect(referenceKinds.has(reference.kind)).toBe(true);

      for (const fragment of forbiddenPathFragments) {
        expect(reference.target.includes(fragment)).toBe(false);
      }
    }
  }
});

test("source references stay inside allowed metadata boundaries", () => {
  const referenceIds = new Set();

  for (const reference of Object.values(sourceReferences)) {
    expect(referenceIds.has(reference.id)).toBe(false);
    referenceIds.add(reference.id);
    expect(referenceKinds.has(reference.kind)).toBe(true);
    expect(reference.title.length).toBeGreaterThan(0);
    expect(reference.title.length).toBeLessThanOrEqual(64);
    expect(reference.target.length).toBeGreaterThan(0);
    expect(
      allowedReferencePrefixes.some((prefix) => reference.target.startsWith(prefix)),
    ).toBe(true);

    if (reference.note) {
      expect(reference.note.length).toBeLessThanOrEqual(96);
    }

    for (const fragment of forbiddenPathFragments) {
      expect(reference.target.includes(fragment)).toBe(false);
    }
  }
});

test("nodes have Chinese-first display copy", () => {
  for (const node of knowledgeNodes) {
    const copy = nodeDisplayCopy[node.id];

    expect(copy).toBeDefined();
    expect(copy.title.length).toBeGreaterThan(0);
    expect(copy.summary.length).toBeGreaterThan(0);
    expect(/[\u4e00-\u9fff]/.test(`${copy.title}${copy.summary}`)).toBe(true);
  }
});

test("display copy stays short and plain", () => {
  for (const node of knowledgeNodes) {
    const copy = nodeDisplayCopy[node.id];
    const text = `${copy.title}${copy.summary}`;

    expect(copy.title.length).toBeLessThanOrEqual(36);
    expect(copy.summary.length).toBeLessThanOrEqual(42);

    for (const term of forbiddenCopyTerms) {
      expect(text.includes(term)).toBe(false);
    }
  }
});

test("node detail copy is complete and Chinese-first", () => {
  for (const node of knowledgeNodes) {
    const copy = nodeDetailCopy[node.id];

    expect(copy).toBeDefined();
    expect(copy.why.length).toBeGreaterThan(0);
    expect(copy.why.length).toBeLessThanOrEqual(72);
    expect(copy.shortExplanation.length).toBeGreaterThan(0);
    expect(copy.shortExplanation.length).toBeLessThanOrEqual(72);
    expect(copy.misconception.length).toBeGreaterThan(0);
    expect(copy.misconception.length).toBeLessThanOrEqual(72);
    expect(copy.compare.teachingVersion.length).toBeGreaterThan(0);
    expect(copy.compare.productionVersion.length).toBeGreaterThan(0);

    const text = `${copy.why}${copy.shortExplanation}${copy.misconception}${copy.compare.teachingVersion}${copy.compare.productionVersion}`;

    expect(/[\u4e00-\u9fff]/.test(text)).toBe(true);

    for (const term of forbiddenCopyTerms) {
      expect(text.includes(term)).toBe(false);
    }
  }
});

test("every node has why, what, and how visual inputs", () => {
  for (const node of knowledgeNodes) {
    const detailCopy = nodeDetailCopy[node.id];
    const displayCopy = nodeDisplayCopy[node.id];
    const sourceReferencesForNode = [
      ...node.labFiles,
      ...node.ccbMappings,
      ...node.externalLinks,
    ];

    expect(detailCopy.why.trim().length).toBeGreaterThan(0);
    expect(displayCopy.summary.trim().length).toBeGreaterThan(0);
    expect(sourceReferencesForNode.length).toBeGreaterThan(0);
  }
});

test("learning path copy stays short and plain", () => {
  for (const path of learningPaths) {
    const text = `${path.title}${path.summary}`;

    expect(path.title.length).toBeLessThanOrEqual(36);
    expect(path.summary.length).toBeLessThanOrEqual(48);

    for (const term of forbiddenCopyTerms) {
      expect(text.includes(term)).toBe(false);
    }
  }
});

test("user-facing docs avoid forbidden filler terms", () => {
  for (const relativePath of userFacingDocs) {
    const content = readFileSync(resolve(projectRoot, relativePath), "utf8");

    for (const term of forbiddenCopyTerms) {
      expect(content.includes(term)).toBe(false);
    }
  }
});

test("user-facing source copy avoids forbidden filler terms", () => {
  for (const relativePath of userFacingSourceFiles) {
    const content = readFileSync(resolve(projectRoot, relativePath), "utf8");

    for (const term of forbiddenCopyTerms) {
      expect(content.includes(term)).toBe(false);
    }
  }
});

test("unfinished entries remain visibly marked", () => {
  const canvasSource = readFileSync(
    resolve(
      projectRoot,
      "apps/knowledge-graph/src/components/graph/KnowledgeGraphCanvas.tsx",
    ),
    "utf8",
  );

  expect(canvasSource.includes("暂未实现")).toBe(true);
});

test("css stays within design color and decoration boundaries", () => {
  for (const relativePath of cssFiles) {
    const content = readFileSync(resolve(projectRoot, relativePath), "utf8");
    const hexColors = content.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];

    for (const color of hexColors) {
      expect(allowedCssHexColors.has(color.toUpperCase())).toBe(true);
    }

    for (const pattern of disallowedCssPatterns) {
      expect(content.includes(pattern)).toBe(false);
    }
  }
});
