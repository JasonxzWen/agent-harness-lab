import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
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
const layoutSettings = {
  layered: {
    columnGap: 160,
    rowGap: 88,
    paddingX: 40,
    paddingY: 48,
    minWidth: 1024,
  },
  compact: {
    columnGap: 144,
    rowGap: 80,
    paddingX: 32,
    paddingY: 40,
    minWidth: 936,
  },
} as const;

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

type LayoutMode = keyof typeof layoutSettings;

type AdvancedControlId = "theme" | "layout" | "progress" | "viewport";
type FeaturePreviewId = "search" | "path" | "progress" | "code";

const featurePreviews: Array<{
  id: FeaturePreviewId;
  marker: string;
  title: string;
  summary: string;
}> = [
  {
    id: "search",
    marker: "搜索",
    title: "输入后只留命中节点",
    summary: "结果卡同步显示命中范围。",
  },
  {
    id: "path",
    marker: "路径",
    title: "点击步骤打开详情",
    summary: "下一步会在路线图里高亮。",
  },
  {
    id: "progress",
    marker: "进度",
    title: "状态写回本地",
    summary: "每个节点可标记学习状态。",
  },
  {
    id: "code",
    marker: "代码",
    title: "源码预览跟着引用走",
    summary: "hover 引用时先看短代码。",
  },
];

type ProgressExportPayload = {
  version: 1;
  exportedAt: string;
  progress: ProgressByNode;
};

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

function normalizeProgressEntries(value: unknown): ProgressByNode {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(
      ([nodeId, status]) => nodeById.has(nodeId) && isProgressStatus(status),
    ),
  ) as ProgressByNode;
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
    return normalizeProgressEntries(parsedValue);
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

function buildGraphLayout(
  nodes: KnowledgeNode[],
  layoutMode: LayoutMode,
  activePathNodeIds: Set<string>,
) {
  const settings = layoutSettings[layoutMode];
  const layers = new Map<number, KnowledgeNode[]>();

  for (const node of nodes) {
    const layerNodes = layers.get(node.layer) ?? [];
    layerNodes.push(node);
    layers.set(node.layer, layerNodes);
  }

  const layoutNodes: LayoutNode[] = [];

  for (const [layer, layerNodes] of layers) {
    const sortedNodes = [...layerNodes].sort((a, b) => {
      if (layoutMode === "compact") {
        const pathDelta =
          Number(activePathNodeIds.has(b.id)) - Number(activePathNodeIds.has(a.id));

        if (pathDelta !== 0) {
          return pathDelta;
        }
      }

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
        x: settings.paddingX + (layer - 1) * settings.columnGap,
        y: settings.paddingY + index * settings.rowGap,
      });
    });
  }

  const maxLayer = Math.max(1, ...Array.from(layers.keys()));
  const maxLayerRows = Math.max(
    1,
    ...Array.from(layers.values()).map((layerNodes) => layerNodes.length),
  );
  const graphHeight =
    settings.paddingY * 2 + (maxLayerRows - 1) * settings.rowGap + nodeHeight;
  const graphWidth = Math.max(
    settings.minWidth,
    settings.paddingX * 2 + (maxLayer - 1) * settings.columnGap + nodeWidth,
  );

  return {
    graphHeight,
    graphWidth,
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

function renderFeaturePreviewDemo(previewId: FeaturePreviewId) {
  if (previewId === "search") {
    return (
      <div className="feature-preview-demo is-search">
        <span>输入：tool</span>
        <strong>4 个节点命中</strong>
        <small>Tool Use</small>
        <small>Tool Result Write-back</small>
      </div>
    );
  }

  if (previewId === "path") {
    return (
      <ol className="feature-preview-demo is-path">
        <li>Message</li>
        <li>Agent Loop</li>
        <li>Tool Use</li>
      </ol>
    );
  }

  if (previewId === "progress") {
    return (
      <div className="feature-preview-demo is-progress">
        <span>未开始</span>
        <span>学习中</span>
        <span>已掌握</span>
      </div>
    );
  }

  return (
    <pre className="feature-preview-demo is-code" aria-label="源码 hover 预览示意">
      <code>{`onFocus -> showPreview()
onClick -> openDetail()`}</code>
    </pre>
  );
}

export function KnowledgeGraphCanvas() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState<Theme | "all">("all");
  const [activePathId, setActivePathId] = useState<LearningPathId>(
    "beginner",
  );
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("compact");
  const [activeControlId, setActiveControlId] =
    useState<AdvancedControlId | null>(null);
  const [activeFeaturePreviewId, setActiveFeaturePreviewId] =
    useState<FeaturePreviewId | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [progressByNode, setProgressByNode] =
    useState<ProgressByNode>(readStoredProgress);
  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    zoom: 0.72,
  });
  const dragState = useRef<DragState | null>(null);
  const importProgressInputRef = useRef<HTMLInputElement>(null);
  const graphViewportRef = useRef<HTMLDivElement>(null);
  const selectedNode = selectedNodeId ? nodeById.get(selectedNodeId) : undefined;
  const previewNodeIdToShow = previewNodeId ?? selectedNodeId;
  const previewNode = previewNodeIdToShow
    ? nodeById.get(previewNodeIdToShow)
    : undefined;
  const previewCopy = previewNode ? getNodeDisplayCopy(previewNode) : undefined;
  const interactionState =
    previewNodeId && previewNodeId !== selectedNodeId
      ? "preview"
      : selectedNodeId
        ? "selected"
        : "idle";
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
  const activePath = useMemo(() => getLearningPath(activePathId), [activePathId]);
  const activePathNodeIds = useMemo(
    () => new Set(activePath.nodeIds),
    [activePath],
  );
  const visibleEdges = useMemo(
    () =>
      knowledgeEdges.filter(
        (edge) =>
          filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target),
      ),
    [filteredNodeIds],
  );
  const graphLayout = useMemo(
    () => buildGraphLayout(filteredNodes, layoutMode, activePathNodeIds),
    [activePathNodeIds, filteredNodes, layoutMode],
  );
  const visibleThemeSummaries = useMemo(
    () =>
      Object.entries(themeLabels).map(([theme, label]) => ({
        theme,
        label,
        count: filteredNodes.filter((node) => node.theme === theme).length,
      })),
    [filteredNodes],
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
  const startedProgressCount = knowledgeNodes.length - progressSummary["not-started"];
  const selectedPathIndex = selectedNodeId
    ? activePath.nodeIds.indexOf(selectedNodeId)
    : -1;
  const currentPathNodeId =
    selectedPathIndex >= 0 ? selectedNodeId : null;
  const nextPathNodeId =
    selectedPathIndex >= 0
      ? activePath.nodeIds[selectedPathIndex + 1] ?? null
      : activePath.nodeIds[0];
  const currentPathLabel = currentPathNodeId
    ? getDisplayTitle(currentPathNodeId)
    : "未选择节点";
  const nextPathLabel = nextPathNodeId
    ? getDisplayTitle(nextPathNodeId)
    : "本路径已完成";
  const activeThemeLabel =
    activeTheme === "all" ? "全部主题" : themeLabels[activeTheme];
  const activeRouteSteps = activePath.nodeIds
    .map((nodeId, index) => {
      const node = nodeById.get(nodeId);

      if (!node) {
        return null;
      }

      return {
        copy: getNodeDisplayCopy(node),
        index,
        isCurrent: currentPathNodeId === nodeId,
        isNext: nextPathNodeId === nodeId,
        node,
        status: getProgressStatus(nodeId),
      };
    })
    .filter((step): step is NonNullable<typeof step> => Boolean(step));

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

  function countStartedProgress(progress: ProgressByNode) {
    return Object.keys(progress).filter((nodeId) => progress[nodeId] !== "not-started")
      .length;
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

  function openPathNode(nodeId: string) {
    const layoutNode = graphLayout.nodePositionById.get(nodeId);

    selectNode(nodeId);

    if (layoutNode) {
      revealNodeInViewport(layoutNode.x, layoutNode.y);
    }
  }

  function toggleControl(controlId: AdvancedControlId) {
    setActiveControlId((current) => (current === controlId ? null : controlId));
  }

  function toggleFeaturePreview(previewId: FeaturePreviewId) {
    setActiveFeaturePreviewId((current) =>
      current === previewId ? null : previewId,
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
    setProgressMessage("已清除本地进度");
  }

  function exportProgress() {
    const payload: ProgressExportPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      progress: progressByNode,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = href;
    link.download = "knowledge-graph-progress.json";
    link.click();
    URL.revokeObjectURL(href);
    setProgressMessage(`已导出 ${countStartedProgress(progressByNode)} 个节点`);
  }

  async function importProgressFromFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const parsedValue: unknown = JSON.parse(await file.text());
      const importedValue =
        parsedValue &&
        typeof parsedValue === "object" &&
        "progress" in parsedValue
          ? (parsedValue as ProgressExportPayload).progress
          : parsedValue;
      const nextProgress = normalizeProgressEntries(importedValue);

      setProgressByNode(nextProgress);
      setProgressMessage(`已导入 ${countStartedProgress(nextProgress)} 个节点`);
    } catch {
      setProgressMessage("导入失败：请使用导出的 JSON 文件");
    } finally {
      event.target.value = "";
    }
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
          <div className="path-filter" aria-label="当前学习路径">
            <div className="path-filter-header">
              <span>当前路径</span>
              <strong>
                {visibleActivePathSteps} / {activePath.nodeIds.length} 步可见
              </strong>
            </div>
            <p>{activePath.summary}</p>
            <div className="path-step-summary" aria-label="当前路径下一步">
              <div>
                <span>当前位置</span>
                <strong>{currentPathLabel}</strong>
              </div>
              <div>
                <span>下一步</span>
                <strong>{nextPathLabel}</strong>
              </div>
              {nextPathNodeId ? (
                <button
                  type="button"
                  onClick={() => openPathNode(nextPathNodeId)}
                >
                  打开下一步
                </button>
              ) : null}
            </div>
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
          <div className="control-stack" aria-label="高级图谱控制">
            <section
              className="control-card theme-filter"
              data-open={activeControlId === "theme"}
            >
              <button
                className="control-card-marker"
                type="button"
                onClick={() => toggleControl("theme")}
              >
                <span>主题</span>
                <strong>{activeThemeLabel}</strong>
              </button>
              <div className="control-card-body">
                {activeTheme !== "all" ? (
                  <button type="button" onClick={() => setActiveTheme("all")}>
                    清除主题
                  </button>
                ) : null}
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
            </section>

            <section
              className="control-card layout-filter"
              data-open={activeControlId === "layout"}
            >
              <button
                className="control-card-marker"
                type="button"
                onClick={() => toggleControl("layout")}
              >
                <span>布局</span>
                <strong>{layoutMode === "compact" ? "紧凑" : "分层"}</strong>
              </button>
              <div className="control-card-body layout-filter-options">
                <button
                  data-active={layoutMode === "compact"}
                  type="button"
                  onClick={() => setLayoutMode("compact")}
                >
                  紧凑
                </button>
                <button
                  data-active={layoutMode === "layered"}
                  type="button"
                  onClick={() => setLayoutMode("layered")}
                >
                  分层
                </button>
              </div>
            </section>

            <section
              className="control-card progress-control"
              data-open={activeControlId === "progress"}
            >
              <button
                className="control-card-marker"
                type="button"
                onClick={() => toggleControl("progress")}
              >
                <span>进度</span>
                <strong>
                  {startedProgressCount} / {knowledgeNodes.length} 已开始
                </strong>
              </button>
              <div className="control-card-body">
                <div className="progress-control-counts">
                  {progressStatuses.map((status) => (
                    <span key={status}>
                      {progressLabels[status]} {progressSummary[status]}
                    </span>
                  ))}
                </div>
                <div className="progress-actions">
                  <button type="button" onClick={clearProgress}>
                    清除本地进度
                  </button>
                  <button type="button" onClick={exportProgress}>
                    导出进度
                  </button>
                  <button
                    type="button"
                    onClick={() => importProgressInputRef.current?.click()}
                  >
                    导入进度
                  </button>
                  <input
                    ref={importProgressInputRef}
                    accept="application/json,.json"
                    type="file"
                    onChange={importProgressFromFile}
                  />
                </div>
                {progressMessage ? (
                  <span className="progress-message" role="status">
                    {progressMessage}
                  </span>
                ) : null}
              </div>
            </section>

            <section
              className="control-card viewport-control-group"
              data-open={activeControlId === "viewport"}
            >
              <button
                className="control-card-marker"
                type="button"
                onClick={() => toggleControl("viewport")}
              >
                <span>缩放</span>
                <strong>{Math.round(viewport.zoom * 100)}%</strong>
              </button>
              <div className="control-card-body">
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
            </section>
          </div>
        </div>

        <section className="route-guide-map" aria-label="自下而上的学习路线">
          <div className="route-guide-header">
            <span>学习路线</span>
            <strong>{activePath.title}</strong>
            <p>
              从底部第一步开始。点任一步，右侧打开 why / what / how。
            </p>
          </div>
          <ol className="route-guide-steps">
            {[...activeRouteSteps].reverse().map((step) => (
              <li
                data-preview={previewNodeIdToShow === step.node.id}
                data-route-node-id={step.node.id}
                data-state={
                  step.isCurrent
                    ? "current"
                    : step.isNext
                      ? "next"
                      : step.status === "not-started"
                        ? "idle"
                        : "started"
                }
                key={step.node.id}
              >
                <button
                  data-route-node-id={step.node.id}
                  type="button"
                  onClick={() => openPathNode(step.node.id)}
                  onFocus={() => setPreviewNodeId(step.node.id)}
                  onPointerEnter={() => setPreviewNodeId(step.node.id)}
                  onPointerLeave={() => setPreviewNodeId(null)}
                >
                  <span>STEP {step.index + 1}</span>
                  <strong>{step.copy.title}</strong>
                  <small>{step.copy.summary}</small>
                </button>
              </li>
            ))}
          </ol>
          <div className="route-guide-footer">
            <span>{startedProgressCount} 个节点已开始</span>
            <strong>下一步：{nextPathLabel}</strong>
          </div>
        </section>

        <section className="feature-preview-stack" aria-label="功能效果预览">
          <div className="feature-preview-heading">
            <span>功能预览</span>
            <strong>先看会发生什么</strong>
            <p>悬停标识卡。卡片滑出展示效果。</p>
          </div>
          <div className="feature-preview-cards">
            {featurePreviews.map((preview) => (
              <article
                className="feature-preview-card"
                data-open={activeFeaturePreviewId === preview.id}
                key={preview.id}
              >
                <button
                  aria-controls={`feature-preview-${preview.id}`}
                  aria-expanded={activeFeaturePreviewId === preview.id}
                  className="feature-preview-marker"
                  type="button"
                  onClick={() => toggleFeaturePreview(preview.id)}
                >
                  <span>{preview.marker}</span>
                  <strong>{preview.title}</strong>
                </button>
                <div
                  className="feature-preview-body"
                  id={`feature-preview-${preview.id}`}
                >
                  <p>{preview.summary}</p>
                  {renderFeaturePreviewDemo(preview.id)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div
          aria-live="polite"
          className={`graph-summary-card${previewNode ? "" : " is-empty"}`}
          data-interaction-state={interactionState}
        >
          {previewNode && previewCopy ? (
            <>
              <span>{themeLabels[previewNode.theme]}</span>
              <small className="graph-summary-state">
                {interactionState === "preview" ? "预览中" : "详情已选中"}
              </small>
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
              width: graphLayout.graphWidth,
            }}
          >
            <svg
              aria-hidden="true"
              className="graph-edge-layer"
              height={graphLayout.graphHeight}
              viewBox={`0 0 ${graphLayout.graphWidth} ${graphLayout.graphHeight}`}
              width={graphLayout.graphWidth}
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
                  selectedNodeId === edge.target ||
                  previewNodeIdToShow === edge.source ||
                  previewNodeIdToShow === edge.target;

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
              const isPreviewed = previewNodeIdToShow === node.id;
              const isInActivePath = activePathNodeIds.has(node.id);
              const progressStatus = getProgressStatus(node.id);

              return (
                <button
                  aria-controls="node-detail-drawer"
                  aria-expanded={isSelected}
                  className={`graph-node-button${isSelected ? " is-selected" : ""}`}
                  data-in-path={isInActivePath}
                  data-node-id={node.id}
                  data-preview={isPreviewed}
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
      </div>

      {selectedNode ? (
        <DetailDrawer
          interactionState={
            previewNodeId && previewNodeId !== selectedNodeId
              ? "parked"
              : "selected"
          }
          node={selectedNode}
          progressStatus={getProgressStatus(selectedNode.id)}
          onClose={closeSelectedNode}
          onProgressChange={(status) => setNodeProgress(selectedNode.id, status)}
        />
      ) : (
        <aside
          aria-label="节点详情等待区"
          className="detail-empty-state"
          data-interaction-state={previewNode ? "preview" : "idle"}
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
