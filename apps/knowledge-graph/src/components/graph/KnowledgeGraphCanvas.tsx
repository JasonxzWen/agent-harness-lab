import { useEffect, useMemo, useRef, useState } from "react";
import {
  graphStats,
  knowledgeEdges,
  knowledgeNodes,
  themeLabels,
} from "../../data/knowledgeGraph";
import { getNodeDisplayCopy } from "../../data/copy";
import { learningPaths } from "../../data/paths";
import type {
  KnowledgeNode,
  LearningPathId,
  ProgressStatus,
  Theme,
} from "../../types/graph";
import { DetailDrawer } from "../drawer/DetailDrawer";

const nodeById = new Map(knowledgeNodes.map((node) => [node.id, node]));

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

type ProgressByNode = Partial<Record<string, ProgressStatus>>;

const progressStorageKey = "knowledge-graph-progress";
const progressStatuses: ProgressStatus[] = [
  "not-started",
  "learning",
  "implemented",
  "reviewed",
];

const progressLabels = {
  "not-started": "未开始",
  learning: "学习中",
  implemented: "已实现",
  reviewed: "已复盘",
} satisfies Record<ProgressStatus, string>;

function isProgressStatus(value: unknown): value is ProgressStatus {
  return (
    typeof value === "string" &&
    progressStatuses.includes(value as ProgressStatus)
  );
}

function readStoredProgress(): ProgressByNode {
  if (typeof window === "undefined") {
    return {};
  }

  const rawValue = window.localStorage.getItem(progressStorageKey);

  if (!rawValue) {
    return {};
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedValue as Record<string, unknown>).filter(
        ([nodeId, status]) => nodeById.has(nodeId) && isProgressStatus(status),
      ),
    ) as ProgressByNode;
  } catch {
    return {};
  }
}

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

function buildGraphLayout(nodes: KnowledgeNode[]) {
  const layers = new Map<number, KnowledgeNode[]>();

  for (const node of nodes) {
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

  const maxLayerRows = Math.max(
    1,
    ...Array.from(layers.values()).map((layerNodes) => layerNodes.length),
  );
  const graphHeight = graphPaddingY * 2 + maxLayerRows * rowGap;

  return {
    graphHeight,
    layoutNodes,
    nodePositionById: new Map(layoutNodes.map((entry) => [entry.node.id, entry])),
  };
}

function clampZoom(value: number) {
  return Math.min(1.2, Math.max(0.68, Number(value.toFixed(2))));
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function nodeMatchesSearch(node: KnowledgeNode, query: string) {
  if (!query) {
    return true;
  }

  const displayCopy = getNodeDisplayCopy(node);
  const searchableText = [
    node.title,
    node.summary,
    displayCopy.title,
    displayCopy.summary,
    ...node.tags,
    ...node.labFiles.map((reference) => reference.target),
    ...node.ccbMappings.map((reference) => reference.target),
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
}

function getLearningPath(pathId: LearningPathId) {
  const path = learningPaths.find((learningPath) => learningPath.id === pathId);

  if (!path) {
    throw new Error(`Unknown learning path: ${pathId}`);
  }

  return path;
}

export function KnowledgeGraphCanvas() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState<Theme | "all">("all");
  const [activePathId, setActivePathId] = useState<LearningPathId>(
    "beginner",
  );
  const [progressByNode, setProgressByNode] =
    useState<ProgressByNode>(readStoredProgress);
  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    zoom: 0.72,
  });
  const dragState = useRef<DragState | null>(null);
  const graphViewportRef = useRef<HTMLDivElement>(null);
  const selectedNode = selectedNodeId ? nodeById.get(selectedNodeId) : undefined;
  const previewNodeIdToShow = previewNodeId ?? selectedNodeId;
  const previewNode = previewNodeIdToShow
    ? nodeById.get(previewNodeIdToShow)
    : undefined;
  const previewCopy = previewNode ? getNodeDisplayCopy(previewNode) : undefined;
  const normalizedSearch = normalizeSearch(searchQuery);
  const searchMatchedNodes = useMemo(
    () => knowledgeNodes.filter((node) => nodeMatchesSearch(node, normalizedSearch)),
    [normalizedSearch],
  );
  const filteredNodes = useMemo(
    () =>
      activeTheme === "all"
        ? searchMatchedNodes
        : searchMatchedNodes.filter((node) => node.theme === activeTheme),
    [activeTheme, searchMatchedNodes],
  );
  const filteredNodeIds = useMemo(
    () => new Set(filteredNodes.map((node) => node.id)),
    [filteredNodes],
  );
  const visibleEdges = useMemo(
    () =>
      knowledgeEdges.filter(
        (edge) =>
          filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target),
      ),
    [filteredNodeIds],
  );
  const graphLayout = useMemo(() => buildGraphLayout(filteredNodes), [filteredNodes]);
  const visibleThemeSummaries = useMemo(
    () =>
      Object.entries(themeLabels).map(([theme, label]) => ({
        theme,
        label,
        count: filteredNodes.filter((node) => node.theme === theme).length,
      })),
    [filteredNodes],
  );
  const activePath = useMemo(() => getLearningPath(activePathId), [activePathId]);
  const activePathNodeIds = useMemo(
    () => new Set(activePath.nodeIds),
    [activePath],
  );
  const activePathEdges = useMemo(
    () =>
      new Set(
        knowledgeEdges
          .filter(
            (edge) =>
              activePathNodeIds.has(edge.source) &&
              activePathNodeIds.has(edge.target),
          )
          .map((edge) => edge.id),
      ),
    [activePathNodeIds],
  );
  const visibleActivePathSteps = activePath.nodeIds.filter((nodeId) =>
    filteredNodeIds.has(nodeId),
  ).length;
  const themeFilterOptions = useMemo(
    () =>
      Object.entries(themeLabels).map(([theme, label]) => ({
        theme: theme as Theme,
        label,
        count: searchMatchedNodes.filter((node) => node.theme === theme).length,
      })),
    [searchMatchedNodes],
  );
  const progressSummary = useMemo(() => {
    const counts = progressStatuses.reduce(
      (summary, status) => ({
        ...summary,
        [status]: 0,
      }),
      {} as Record<ProgressStatus, number>,
    );

    for (const node of knowledgeNodes) {
      counts[progressByNode[node.id] ?? "not-started"] += 1;
    }

    return counts;
  }, [progressByNode]);

  useEffect(() => {
    window.localStorage.setItem(progressStorageKey, JSON.stringify(progressByNode));
  }, [progressByNode]);

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

  function revealNodeInViewport(nodeX: number, nodeY: number) {
    const viewportElement = graphViewportRef.current;

    if (!viewportElement) {
      return;
    }

    setViewport((current) => {
      const viewportPadding = 24;
      const scaledLeft = nodeX * current.zoom + current.x;
      const scaledRight = (nodeX + nodeWidth) * current.zoom + current.x;
      const scaledTop = nodeY * current.zoom + current.y;
      const scaledBottom = (nodeY + nodeHeight) * current.zoom + current.y;
      const visibleRight = viewportElement.clientWidth - viewportPadding;
      const visibleBottom = viewportElement.clientHeight - viewportPadding;
      let nextX = current.x;
      let nextY = current.y;

      if (scaledLeft < viewportPadding) {
        nextX += viewportPadding - scaledLeft;
      } else if (scaledRight > visibleRight) {
        nextX -= scaledRight - visibleRight;
      }

      if (scaledTop < viewportPadding) {
        nextY += viewportPadding - scaledTop;
      } else if (scaledBottom > visibleBottom) {
        nextY -= scaledBottom - visibleBottom;
      }

      return nextX === current.x && nextY === current.y
        ? current
        : { ...current, x: nextX, y: nextY };
    });
  }

  function getProgressStatus(nodeId: string): ProgressStatus {
    return progressByNode[nodeId] ?? "not-started";
  }

  function setNodeProgress(nodeId: string, status: ProgressStatus) {
    setProgressByNode((current) => {
      const nextProgress = { ...current };

      if (status === "not-started") {
        delete nextProgress[nodeId];
      } else {
        nextProgress[nodeId] = status;
      }

      return nextProgress;
    });
  }

  function selectNode(nodeId: string) {
    setSelectedNodeId(nodeId);
    setPreviewNodeId(nodeId);
    setProgressByNode((current) =>
      current[nodeId]
        ? current
        : {
            ...current,
            [nodeId]: "learning",
          },
    );
  }

  function closeSelectedNode() {
    const nodeId = selectedNodeId;

    setSelectedNodeId(null);
    setPreviewNodeId(null);

    if (!nodeId) {
      return;
    }

    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLButtonElement>(`button[data-node-id="${nodeId}"]`)
        ?.focus();
    });
  }

  function clearProgress() {
    setProgressByNode({});
  }

  return (
    <section className="graph-canvas-panel" id="map" aria-label="Agent harness 机制地图">
      <div className="harness-diagram" aria-label="可交互知识图谱">
        <div className="trace-header">
          <span>{filteredNodes.length} / {graphStats.nodeCount} 个机制节点</span>
          <span>{visibleEdges.length} / {graphStats.edgeCount} 条关系</span>
        </div>

        <div className="graph-controls" aria-label="图谱视口控制">
          <div className="graph-search" role="search">
            <label htmlFor="graph-search-input">搜索</label>
            <div>
              <input
                id="graph-search-input"
                placeholder="标题、标签、源码路径"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              {searchQuery ? (
                <button type="button" onClick={() => setSearchQuery("")}>
                  清除
                </button>
              ) : null}
            </div>
          </div>
          <div className="theme-filter" aria-label="主题筛选">
            <div className="theme-filter-header">
              <span>主题筛选</span>
              {activeTheme !== "all" ? (
                <button type="button" onClick={() => setActiveTheme("all")}>
                  清除主题
                </button>
              ) : null}
            </div>
            <div className="theme-filter-options">
              <button
                data-active={activeTheme === "all"}
                data-theme-filter="all"
                type="button"
                onClick={() => setActiveTheme("all")}
              >
                全部 <span>{searchMatchedNodes.length}</span>
              </button>
              {themeFilterOptions.map((option) => (
                <button
                  data-active={activeTheme === option.theme}
                  data-theme-filter={option.theme}
                  key={option.theme}
                  type="button"
                  onClick={() => setActiveTheme(option.theme)}
                >
                  {option.label} <span>{option.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="path-filter" aria-label="路径模式">
            <div className="path-filter-header">
              <span>路径模式</span>
              <strong>
                {visibleActivePathSteps} / {activePath.nodeIds.length} 步可见
              </strong>
            </div>
            <p>{activePath.summary}</p>
            <div className="path-filter-options">
              {learningPaths.map((path) => (
                <button
                  data-active={activePathId === path.id}
                  data-path-filter={path.id}
                  key={path.id}
                  type="button"
                  onClick={() => setActivePathId(path.id)}
                >
                  {path.title} <span>{path.nodeIds.length}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="progress-control" aria-label="学习进度">
            <div className="progress-control-header">
              <span>学习进度</span>
              <strong>
                {knowledgeNodes.length - progressSummary["not-started"]} /{" "}
                {knowledgeNodes.length} 已开始
              </strong>
            </div>
            <div className="progress-control-counts">
              {progressStatuses.map((status) => (
                <span key={status}>
                  {progressLabels[status]} {progressSummary[status]}
                </span>
              ))}
            </div>
            <button type="button" onClick={clearProgress}>
              清除本地进度
            </button>
          </div>
          <p>拖动画布。点击节点看详情。</p>
          <div className="viewport-controls" aria-label="画布缩放">
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
          ref={graphViewportRef}
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
              {visibleEdges.map((edge) => {
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
                  onFocus={() => {
                    setPreviewNodeId(node.id);
                    revealNodeInViewport(x, y);
                  }}
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
          {filteredNodes.length === 0 ? (
            <div className="graph-empty-results" role="status">
              <strong>没有匹配节点</strong>
              <p>换个关键词，或清除搜索回到完整图谱。</p>
              <button type="button" onClick={() => setSearchQuery("")}>
                清除搜索
              </button>
            </div>
          ) : null}
        </div>

        <div className="trace-route" aria-label="入门路径前五步">
          {activePath.nodeIds.slice(0, 5).map((nodeId) => {
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
        <DetailDrawer
          node={selectedNode}
          progressStatus={getProgressStatus(selectedNode.id)}
          onClose={closeSelectedNode}
          onProgressChange={(status) => setNodeProgress(selectedNode.id, status)}
        />
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
        <span>{activePath.title}</span>
        <strong>{learningPaths.length} 条路径</strong>
        <span>{graphStats.themeCount} 个主题</span>
      </div>

      <p className="pending-notice">
        暂未实现：内容边界自动校验、最终视觉验收。当前可搜索、筛选、切换路径、保存进度并查看引用。
      </p>

      <ul className="theme-grid" aria-label="知识图谱主题数量">
        {visibleThemeSummaries.map((themeSummary) => (
          <li key={themeSummary.theme}>
            <strong>{themeSummary.count}</strong>
            <span>{themeSummary.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
