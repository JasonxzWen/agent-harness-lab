import {
  graphStats,
  knowledgeNodes,
  themeLabels,
} from "../../data/knowledgeGraph";
import { learningPaths } from "../../data/paths";
import type { KnowledgeNode } from "../../types/graph";

const nodeById = new Map(knowledgeNodes.map((node) => [node.id, node]));
const beginnerPath = learningPaths.find((path) => path.id === "beginner");
const beginnerPathNodes =
  beginnerPath?.nodeIds
    .map((nodeId) => nodeById.get(nodeId))
    .filter((node): node is KnowledgeNode => node !== undefined) ?? [];

const themeSummaries = Object.entries(themeLabels).map(([theme, label]) => ({
  theme,
  label,
  count: knowledgeNodes.filter((node) => node.theme === theme).length,
}));

export function KnowledgeGraphCanvas() {
  return (
    <section className="graph-canvas-panel" id="map" aria-label="Harness visual">
      <div className="visual-title">
        <span>Agent</span>
        <strong>Harness</strong>
        <span>Trace</span>
      </div>

      <div className="harness-diagram" aria-label="Agent harness mechanism trace">
        <div className="trace-header">
          <span>{graphStats.nodeCount} typed nodes</span>
          <span>{graphStats.edgeCount} relationships</span>
        </div>

        <ol className="mechanism-stack">
          {beginnerPathNodes.map((node, index) => (
            <li className="mechanism-node" key={node.id}>
              <span className="mechanism-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mechanism-copy">
                <strong>{node.title}</strong>
                <span>{node.summary}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="trace-route" aria-label="Learning path route">
          {(beginnerPath?.nodeIds ?? []).slice(0, 5).map((nodeId) => (
            <span key={nodeId}>{nodeById.get(nodeId)?.title ?? nodeId}</span>
          ))}
        </div>
      </div>

      <div className="graph-data-strip" aria-label="Graph data coverage">
        <span>{beginnerPath?.title ?? "Beginner Path"}</span>
        <strong>{learningPaths.length} paths</strong>
        <span>{graphStats.themeCount} themes</span>
      </div>

      <ul className="theme-grid" aria-label="Knowledge graph theme counts">
        {themeSummaries.map((themeSummary) => (
          <li key={themeSummary.theme}>
            <strong>{themeSummary.count}</strong>
            <span>{themeSummary.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
