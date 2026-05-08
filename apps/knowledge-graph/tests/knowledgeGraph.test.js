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
      expect(reference.target.includes(".external/skill-hub")).toBe(false);
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
