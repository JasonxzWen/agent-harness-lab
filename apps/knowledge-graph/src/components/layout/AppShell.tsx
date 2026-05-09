import { KnowledgeGraphCanvas } from "../graph/KnowledgeGraphCanvas";
import { GraphToolbar } from "./GraphToolbar";
import { referenceIndexStats } from "../../data/generatedReferenceIndex";
import { graphStats, knowledgeNodes } from "../../data/knowledgeGraph";
import { learningPaths } from "../../data/paths";
import { getNodeDisplayCopy } from "../../data/copy";

const nodeById = new Map(knowledgeNodes.map((node) => [node.id, node]));

function getLearningEntry() {
  const path = learningPaths.find((learningPath) => learningPath.id === "beginner");

  if (!path) {
    throw new Error("Beginner learning path is required.");
  }

  const firstStepId = path.nodeIds[0];

  if (!firstStepId) {
    throw new Error("Beginner learning path needs a first step.");
  }

  const firstStep = nodeById.get(firstStepId);

  if (!firstStep) {
    throw new Error(`Unknown first step node: ${firstStepId}`);
  }

  return {
    firstStep,
    firstStepCopy: getNodeDisplayCopy(firstStep),
    path,
  };
}

const learningEntry = getLearningEntry();
const learningProgressPercent = Math.round(
  (1 / learningEntry.path.nodeIds.length) * 100,
);

const learningEntrySteps = [
  {
    label: "why",
    title: "先固定状态",
    summary: "理解消息为什么是下一轮输入。",
  },
  {
    label: "what",
    title: "看一个节点",
    summary: "先读摘要，再决定是否展开详情。",
  },
  {
    label: "how",
    title: "进入图谱",
    summary: "点击继续，打开第一步和后续路径。",
  },
] as const;

const statusItems = [
  {
    label: "节点",
    value: graphStats.nodeCount,
    summary: "点击后看 why / what / how",
  },
  {
    label: "路径",
    value: learningPaths.length,
    summary: "按入门、上下文、安全、进阶阅读",
  },
  {
    label: "引用",
    value: referenceIndexStats.uniqueReferences,
    summary: `覆盖 ${referenceIndexStats.nodeCount} 个节点`,
  },
] as const;

export function AppShell() {
  return (
    <div className="app-shell">
      <GraphToolbar />
      <main className="anthropic-page" aria-label="Agent harness 知识图谱工作台">
        <section className="hero-section" id="research">
          <div className="hero-copy">
            <span>LEARNING ENTRY</span>
            <h1>
              从 <span>Message</span> 开始学 Agent Harness
            </h1>
            <p>先走入门路径，再打开图谱看源码和命令。</p>
          </div>

          <aside className="learning-entry" aria-label="推荐学习入口">
            <div className="learning-entry-header">
              <span>推荐路径</span>
              <strong>{learningEntry.path.title}</strong>
              <p>{learningEntry.path.summary}</p>
            </div>

            <div className="learning-step">
              <span>第一步</span>
              <strong>{learningEntry.firstStepCopy.title}</strong>
              <p>{learningEntry.firstStepCopy.summary}</p>
            </div>

            <a className="learning-entry-cta" href="#map">
              继续学习第一步 →
            </a>

            <div
              aria-label={`当前章节学习进度 ${learningProgressPercent}%`}
              className="learning-progress"
            >
              <div>
                <span>章节进度</span>
                <strong>
                  1 / {learningEntry.path.nodeIds.length} · {learningProgressPercent}%
                </strong>
              </div>
              <span className="learning-progress-track">
                <span style={{ width: `${learningProgressPercent}%` }} />
              </span>
            </div>

            <ol className="learning-entry-map" aria-label="why what how 学习顺序">
              {learningEntrySteps.map((step) => (
                <li key={step.label}>
                  <span>{step.label}</span>
                  <strong>{step.title}</strong>
                  <p>{step.summary}</p>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <KnowledgeGraphCanvas />

        <section className="feature-band" id="references" aria-label="当前站点状态">
          <div>
            <h2>后面能看到什么？</h2>
            <p>图谱、详情、源码路径和命令都在同一条学习线上。</p>
          </div>
          <dl className="feature-status-row">
            {statusItems.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>
                  <strong>{item.value}</strong>
                  <span>{item.summary}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}
