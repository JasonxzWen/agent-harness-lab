import { useState } from "react";
import {
  graphStats,
  knowledgeNodes,
  themeLabels,
} from "../../data/knowledgeGraph";
import { getNodeDisplayCopy } from "../../data/copy";
import { learningPaths } from "../../data/paths";
import type { KnowledgeNode } from "../../types/graph";
import { DetailDrawer } from "../drawer/DetailDrawer";

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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = selectedNodeId ? nodeById.get(selectedNodeId) : undefined;

  return (
    <section className="graph-canvas-panel" id="map" aria-label="Agent harness 机制地图">
      <div className="visual-title">
        <span>机制</span>
        <strong>Harness</strong>
        <span>地图</span>
      </div>

      <div className="harness-diagram" aria-label="入门路径机制链路">
        <div className="trace-header">
          <span>{graphStats.nodeCount} 个机制节点</span>
          <span>{graphStats.edgeCount} 条关系</span>
        </div>

        <ol className="mechanism-stack">
          {beginnerPathNodes.map((node, index) => {
            const displayCopy = getNodeDisplayCopy(node);
            const isSelected = selectedNodeId === node.id;

            return (
              <li className="mechanism-node" key={node.id}>
                <button
                  aria-controls="node-detail-drawer"
                  aria-expanded={isSelected}
                  className={`mechanism-node-button${isSelected ? " is-selected" : ""}`}
                  data-node-id={node.id}
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  <span className="mechanism-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mechanism-copy">
                    <strong>{displayCopy.title}</strong>
                    <span>{displayCopy.summary}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="trace-route" aria-label="入门路径前五步">
          {(beginnerPath?.nodeIds ?? []).slice(0, 5).map((nodeId) => {
            const routeNode = nodeById.get(nodeId);

            return (
              <span key={nodeId}>
                {routeNode ? getNodeDisplayCopy(routeNode).title : nodeId}
              </span>
            );
          })}
        </div>
      </div>

      {selectedNode ? (
        <DetailDrawer node={selectedNode} onClose={() => setSelectedNodeId(null)} />
      ) : (
        <aside
          aria-label="节点详情等待区"
          className="detail-empty-state"
          id="node-detail-drawer"
        >
          <span>DETAIL</span>
          <h2>点击一个机制节点</h2>
          <p>右侧会显示一句解释、源码路径、Bun 命令、常见误解和版本对照。</p>
        </aside>
      )}

      <div className="graph-data-strip" aria-label="图谱数据覆盖范围">
        <span>{beginnerPath?.title ?? "Beginner Path"}</span>
        <strong>{learningPaths.length} 条路径</strong>
        <span>{graphStats.themeCount} 个主题</span>
      </div>

      <ul className="theme-grid" aria-label="知识图谱主题数量">
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
