import { useState } from "react";
import { KnowledgeGraphCanvas } from "../graph/KnowledgeGraphCanvas";
import { GraphToolbar, type AppScene } from "./GraphToolbar";
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
  const [scene, setScene] = useState<AppScene>("intro");

  function moveToScene(nextScene: AppScene) {
    setScene(nextScene);

    if (nextScene === "map") {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLInputElement>("#graph-search-input")?.focus();
      });
    }
  }

  return (
    <div className="app-shell">
      <GraphToolbar activeScene={scene} onSceneChange={moveToScene} />
      <main
        className="anthropic-page"
        data-scene={scene}
        aria-label="Agent harness 知识图谱工作台"
      >
        <ol className="scene-markers" aria-label="当前横向场景">
          <li data-active={scene === "intro"}>Intro</li>
          <li data-active={scene === "map"}>Map</li>
          <li data-active="false">Detail</li>
        </ol>

        <div className="stage-track">
          <section
            aria-hidden={scene !== "intro"}
            aria-label="学习入口场景"
            className="stage-scene intro-scene"
            id="research"
          >
            <div className="hero-copy">
              <span>LEARNING ENTRY</span>
              <h1>
                从 <span>Message</span> 开始学 Agent Harness
              </h1>
              <p>先走入门路径，再打开图谱看源码和命令。</p>
            </div>

            <aside className="learning-entry" aria-label="推荐学习入口">
              <div className="learning-entry-header">
                <span>当前路径</span>
                <strong>{learningEntry.path.title}</strong>
                <p>{learningEntry.path.summary}</p>
              </div>

              <div className="learning-step">
                <span>第一步</span>
                <strong>{learningEntry.firstStepCopy.title}</strong>
                <p>{learningEntry.firstStepCopy.summary}</p>
              </div>

              <button
                className="learning-entry-cta"
                type="button"
                onClick={() => moveToScene("map")}
              >
                继续学习第一步 →
              </button>
            </aside>
          </section>

          <section
            aria-hidden={scene !== "map"}
            aria-label="横屏学习工作区"
            className="stage-scene workspace-scene"
          >
            <KnowledgeGraphCanvas />

            <section className="feature-band" id="references" aria-label="当前站点状态">
              <div>
                <h2>当前状态</h2>
                <p>图谱、详情、源码路径和命令都在横屏工作区里。</p>
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
          </section>
        </div>
      </main>
    </div>
  );
}
