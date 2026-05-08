const mechanismRows = [
  { index: "01", label: "loop", summary: "observe / decide / act" },
  { index: "02", label: "registry", summary: "typed tool surface" },
  { index: "03", label: "permissions", summary: "approval boundary" },
  { index: "04", label: "result write-back", summary: "tool output returns to context" },
  { index: "05", label: "memory", summary: "durable project state" },
  { index: "06", label: "compact", summary: "context handoff under pressure" },
] as const;

const traceRoute = ["prompt", "loop", "tool call", "write-back", "next turn"] as const;

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
          <span>trace 01</span>
          <span>minimal agent loop</span>
        </div>

        <ol className="mechanism-stack">
          {mechanismRows.map((mechanism) => (
            <li className="mechanism-node" key={mechanism.index}>
              <span className="mechanism-index">{mechanism.index}</span>
              <span className="mechanism-copy">
                <strong>{mechanism.label}</strong>
                <span>{mechanism.summary}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="trace-route" aria-label="Trace route">
          {traceRoute.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
