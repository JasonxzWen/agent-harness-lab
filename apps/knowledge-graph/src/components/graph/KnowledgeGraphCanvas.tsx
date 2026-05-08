import { useMemo, useRef, useState } from "react";
import {
  graphStats,
  knowledgeEdges,
  knowledgeNodes,
  themeLabels,
} from "../../data/knowledgeGraph";
import { getNodeDisplayCopy } from "../../data/copy";
import { learningPaths } from "../../data/paths";
import type { KnowledgeNode, ProgressStatus, Theme } from "../../types/graph";
import { DetailDrawer } from "../drawer/DetailDrawer";

const nodeById = new Map(knowledgeNodes.map((node) => [node.id, node]));
const beginnerPath = learningPaths.find((path) => path.id === "beginner");
const activePathNodeIds = new Set(beginnerPath?.nodeIds ?? []);
const activePathEdges = new Set(
  knowledgeEdges
    .filter(
      (edge) =>
        activePathNodeIds.has(edge.source) && activePathNodeIds.has(edge.target),
    )
    .map((edge) => edge.id),
);

const themeSummaries = Object.entries(themeLabels).map(([theme, label]) => ({
  theme,
  label,
  count: knowledgeNodes.filter((node) => node.theme === theme).length,
}));

const themeOrder: Theme[] = [
  "foundation",
  "runtime",
  "tool-system",
  "planning",
  "context",
  "safety",
  "multi-agent",
  "extension",
  "dream",
];

const nodeWidth = 152;
const nodeHeight = 72;
const columnGap = 160;
const rowGap = 88;
const graphPaddingX = 40;
const graphPaddingY = 48;
const graphWidth = 1024;

type LayoutNode = {
  node: KnowledgeNode;
  x: number;
  y: number;
};

type ViewportState = {
  x: number;
  y: number;
  zoom: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

const progressLabels = {
  "not-started": "未开始",
  learning: "学习中",
  implemented: "已实现",
  reviewed: "已复盘",
} satisfies Record<ProgressStatus, string>;

function getDisplayTitle(nodeId: string) {
  const node = nodeById.get(nodeId);

  return node ? getNodeDisplayCopy(node).title : nodeId;
}

function getRelatedLabels(nodeIds: string[], fallback: string) {
  if (nodeIds.length === 0) {
    return fallback;
  }

  return nodeIds.map(getDisplayTitle).join("、");
}

function buildGraphLayout() {
  const layers = new Map<number, KnowledgeNode[]>();

  for (const node of knowledgeNodes) {
    const layerNodes = layers.get(node.layer) ?? [];
    layerNodes.push(node);
    layers.set(node.layer, layerNodes);
  }

  const layoutNodes: LayoutNode[] = [];

  for (const [layer, layerNodes] of layers) {
    const sortedNodes = [...layerNodes].sort((a, b) => {
      const themeDelta =
        themeOrder.indexOf(a.theme) - themeOrder.indexOf(b.theme);

      if (themeDelta !== 0) {
        return themeDelta;
      }

      return a.title.localeCompare(b.title);
    });

    sortedNodes.forEach((node, index) => {
      layoutNodes.push({
        node,
        x: graphPaddingX + (layer - 1) * columnGap,
        y: graphPaddingY + index * rowGap,
      });
    });
  }

  const graphHeight =
    graphPaddingY * 2 +
    Math.max(...Array.from(layers.values()).map((nodes) => nodes.length)) *
      rowGap;

  return {
    graphHeight,
    layoutNodes,
    nodePositionById: new Map(layoutNodes.map((entry) => [entry.node.id, entry])),
  };
}

function clampZoom(value: number) {
  return Math.min(1.2, Math.max(0.68, Number(value.toFixed(2))));
}

export function KnowledgeGraphCanvas() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    zoom: 0.72,
  });
  const dragState = useRef<DragState | null>(null);
  const selectedNode = selectedNodeId ? nodeById.get(selectedNodeId) : undefined;
  const previewNodeIdToShow = previewNodeId ?? selectedNodeId;
  const previewNode = previewNodeIdToShow
    ? nodeById.get(previewNodeIdToShow)
    : undefined;
  const previewCopy = previewNode ? getNodeDisplayCopy(previewNode) : undefined;
  const graphLayout = useMemo(() => buildGraphLayout(), []);

  function zoomBy(delta: number) {
    setViewport((current) => ({
      ...current,
      zoom: clampZoom(current.zoom + delta),
    }));
  }

  function resetViewport() {
    setViewport({ x: 0, y: 0, zoom: 0.72 });
  }

  function beginPan(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target;

    if (target instanceof HTMLElement && target.closest("button")) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: viewport.x,
      originY: viewport.y,
    };
  }

  function movePan(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragState.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    setViewport((current) => ({
      ...current,
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    }));
  }

  function endPan(event: React.PointerEvent<HTMLDivElement>) {
    if (dragState.current?.pointerId === event.pointerId) {
      dragState.current = null;
    }
  }

  function getProgressStatus(nodeId: string): ProgressStatus {
    if (selectedNodeId === nodeId) {
      return "learning";
    }

    return "not-started";
  }

  function selectNode(nodeId: string) {
    setSelectedNodeId(nodeId);
    setPreviewNodeId(nodeId);
  }

  return (
    <section className="graph-canvas-panel" id="map" aria-label="Agent harness 机制地图">
      <div className="visual-title">
        <span>机制</span>
        <strong>地图</strong>
      </div>

      <div className="harness-diagram" aria-label="可交互知识图谱">
        <div className="trace-header">
          <span>{graphStats.nodeCount} 个机制节点</span>
          <span>{graphStats.edgeCount} 条关系</span>
        </div>

        <div className="graph-controls" aria-label="图谱视口控制">
          <p>拖动画布。点击节点看详情。</p>
          <div>
            <button type="button" onClick={() => zoomBy(-0.08)}>
              缩小
            </button>
            <span>{Math.round(viewport.zoom * 100)}%</span>
            <button type="button" onClick={() => zoomBy(0.08)}>
              放大
            </button>
            <button type="button" onClick={resetViewport}>
              复位
            </button>
          </div>
        </div>

        <div
          aria-live="polite"
          className={`graph-summary-card${previewNode ? "" : " is-empty"}`}
        >
          {previewNode && previewCopy ? (
            <>
              <span>{themeLabels[previewNode.theme]}</span>
              <strong>{previewCopy.title}</strong>
              <p>{previewCopy.summary}</p>
              <dl>
                <div>
                  <dt>前置</dt>
                  <dd>{getRelatedLabels(previewNode.prerequisites, "无需前置")}</dd>
                </div>
                <div>
                  <dt>下一步</dt>
                  <dd>{getRelatedLabels(previewNode.recommendedNext, "暂无推荐")}</dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <span>SUMMARY</span>
              <strong>悬停或聚焦节点</strong>
              <p>先看摘要，再决定是否打开详情。</p>
            </>
          )}
        </div>

        <div
          className="graph-viewport"
          aria-label="可拖拽知识图谱画布"
          onPointerCancel={endPan}
          onPointerDown={beginPan}
          onPointerMove={movePan}
          onPointerUp={endPan}
        >
          <div
            className="graph-surface"
            style={{
              height: graphLayout.graphHeight,
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
              width: graphWidth,
            }}
          >
            <svg
              aria-hidden="true"
              className="graph-edge-layer"
              height={graphLayout.graphHeight}
              viewBox={`0 0 ${graphWidth} ${graphLayout.graphHeight}`}
              width={graphWidth}
            >
              {knowledgeEdges.map((edge) => {
                const source = graphLayout.nodePositionById.get(edge.source);
                const target = graphLayout.nodePositionById.get(edge.target);

                if (!source || !target) {
                  return null;
                }

                const sourceX = source.x + nodeWidth;
                const sourceY = source.y + nodeHeight / 2;
                const targetX = target.x;
                const targetY = target.y + nodeHeight / 2;
                const midX = sourceX + (targetX - sourceX) / 2;
                const isActive =
                  activePathEdges.has(edge.id) ||
                  selectedNodeId === edge.source ||
                  selectedNodeId === edge.target;

                return (
                  <path
                    className={isActive ? "is-active" : undefined}
                    d={`M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`}
                    data-relation={edge.relation}
                    key={edge.id}
                  />
                );
              })}
            </svg>

            {graphLayout.layoutNodes.map(({ node, x, y }) => {
              const displayCopy = getNodeDisplayCopy(node);
              const isSelected = selectedNodeId === node.id;
              const isInActivePath = activePathNodeIds.has(node.id);
              const progressStatus = getProgressStatus(node.id);

              return (
                <button
                  aria-controls="node-detail-drawer"
                  aria-expanded={isSelected}
                  className={`graph-node-button${isSelected ? " is-selected" : ""}`}
                  data-in-path={isInActivePath}
                  data-node-id={node.id}
                  data-progress={progressStatus}
                  key={node.id}
                  style={{ left: x, top: y }}
                  type="button"
                  onBlur={() => setPreviewNodeId(null)}
                  onClick={() => selectNode(node.id)}
                  onFocus={() => setPreviewNodeId(node.id)}
                  onPointerEnter={() => setPreviewNodeId(node.id)}
                  onPointerLeave={() => setPreviewNodeId(null)}
                >
                  <span className="graph-node-meta">
                    <span>{themeLabels[node.theme]}</span>
                    <span className="graph-node-status">
                      {progressLabels[progressStatus]}
                    </span>
                  </span>
                  <strong>{displayCopy.title}</strong>
                  <span>{displayCopy.summary}</span>
                </button>
              );
            })}
          </div>
        </div>

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
          <p>右侧会先说明 why / what / how，再给出源码路径和 Bun 命令。</p>
        </aside>
      )}

      <div className="graph-data-strip" aria-label="图谱数据覆盖范围">
        <span>{beginnerPath?.title ?? "Beginner Path"}</span>
        <strong>{learningPaths.length} 条路径</strong>
        <span>{graphStats.themeCount} 个主题</span>
      </div>

      <p className="pending-notice">
        暂未实现：搜索、主题筛选、路径切换和学习进度保存。当前先拖动画布、缩放视口、点击节点查看详情。
      </p>

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
