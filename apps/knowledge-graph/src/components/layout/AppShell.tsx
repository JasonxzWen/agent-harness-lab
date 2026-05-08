import { KnowledgeGraphCanvas } from "../graph/KnowledgeGraphCanvas";
import { GraphToolbar } from "./GraphToolbar";

const featureCards = [
  {
    label: "机制地图",
    summary: "从 Message 到 tool_result write-back，看清 agent loop 的闭环。",
  },
  {
    label: "源码引用",
    summary: "每个机制都会连接到本仓库 lab 文件和 CCB 阅读映射。",
  },
  {
    label: "实验命令",
    summary: "用 Bun 命令跑教学版 harness，先实现，再对照生产版。",
  },
] as const;

export function AppShell() {
  return (
    <div className="app-shell">
      <GraphToolbar />
      <main className="anthropic-page" aria-label="Agent harness 知识图谱工作台">
        <section className="hero-section" id="research">
          <h1>
            把 <span>Agent Harness</span> 拆成能学会的{" "}
            <span>机制地图</span>
          </h1>
          <p>
            这里不是 Claude Code 复刻版，而是一个中文优先的学习作品：
            用 TypeScript/Bun 自己实现小型 harness，再把 loop、tools、
            memory、permissions、subagents 等机制做成可探索图谱。
          </p>
        </section>

        <KnowledgeGraphCanvas />

        <section className="feature-band" id="references" aria-label="当前站点能力">
          <div>
            <h2>当前版本已经完成数据底座，正在进入交互图谱。</h2>
            <p>
              你现在看到的是 M2：34 个机制节点、35 条关系、4 条学习路径。
              下一步会把这些节点变成可点击、可筛选、可查看详情的学习工作台。
            </p>
          </div>
          <div className="feature-cards">
            {featureCards.map((feature) => (
              <article key={feature.label}>
                <h3>{feature.label}</h3>
                <p>{feature.summary}</p>
                <span aria-hidden="true">-&gt;</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
