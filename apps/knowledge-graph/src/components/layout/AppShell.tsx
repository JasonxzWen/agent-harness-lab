import { KnowledgeGraphCanvas } from "../graph/KnowledgeGraphCanvas";
import { GraphToolbar } from "./GraphToolbar";

const featureCards = [
  { label: "Mechanism Map", summary: "Trace the loop from prompt to tool result." },
  { label: "Source Notes", summary: "Keep CCB references close to each concept." },
  { label: "Lab Command", summary: "Run the current Bun harness experiment." },
] as const;

export function AppShell() {
  return (
    <div className="app-shell">
      <GraphToolbar />
      <main className="anthropic-page" aria-label="Knowledge graph workspace">
        <section className="hero-section" id="research">
          <h1>
            <span>Agent harnesses</span> that make{" "}
            <span>mechanisms</span> visible
          </h1>
          <p>
            A focused learning surface for studying agent loops, tool calls,
            memory, permissions, and the system boundaries behind code agents.
          </p>
        </section>

        <KnowledgeGraphCanvas />

        <section className="feature-band" id="references" aria-label="Core capabilities">
          <div>
            <h2>Study the harness as a system</h2>
            <p>
              The interface keeps only the core map, references, and command
              path visible. Everything else becomes supporting material.
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
