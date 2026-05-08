import { KnowledgeGraphCanvas } from "../graph/KnowledgeGraphCanvas";
import { GraphToolbar } from "./GraphToolbar";

const featureCards = [
  {
    label: "节点详情",
    summary: "点开机制，先看 why / what / how。",
    status: "已实现",
  },
  {
    label: "源码引用",
    summary: "查看 lab 源码和 CCB 本地对照路径。",
    status: "已实现",
  },
  {
    label: "实验命令",
    summary: "复制 Bun 命令，在 labs/ts-agent 跑起来。",
    status: "已实现",
  },
  {
    label: "搜索筛选",
    summary: "搜索节点，切换主题和路径，保存学习状态。",
    status: "已实现",
  },
] as const;

export function AppShell() {
  return (
    <div className="app-shell">
      <GraphToolbar />
      <main className="anthropic-page" aria-label="Agent harness 知识图谱工作台">
        <section className="hero-section" id="research">
          <h1>
            用一张中文图，学会 <span>Agent Harness</span>
          </h1>
          <p>
            先用 TypeScript/Bun 写一个小 harness，再把每个机制做成节点。
            你可以按路径学习，也可以直接看源码和命令。
          </p>
        </section>

        <KnowledgeGraphCanvas />

        <section className="feature-band" id="references" aria-label="当前站点能力">
          <div>
            <h2>现在能看什么？</h2>
            <p>
              当前有 34 个节点、35 条关系、4 条路径。点击节点后，
              可以先看 why / what / how，再看源码、命令和版本对照。
            </p>
          </div>
          <div className="feature-cards">
            {featureCards.map((feature) => (
              <article
                className={
                  "isPending" in feature && feature.isPending
                    ? "is-pending"
                    : undefined
                }
                key={feature.label}
              >
                <h3>{feature.label}</h3>
                <p>{feature.summary}</p>
                <span>{feature.status}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
