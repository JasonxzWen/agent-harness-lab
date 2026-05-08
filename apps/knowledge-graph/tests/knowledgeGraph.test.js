import { expect, test } from "bun:test";
import {
  knowledgeEdges,
  knowledgeNodes,
  themeLabels,
} from "../src/data/knowledgeGraph";
import { learningPaths } from "../src/data/paths";

const nodeIds = new Set(knowledgeNodes.map((node) => node.id));
const referenceKinds = new Set([
  "local-doc",
  "lab-source",
  "ccb-source-mapping",
  "external-link",
]);

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
