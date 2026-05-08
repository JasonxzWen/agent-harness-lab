const navLinks = [
  { href: "#research", label: "Research" },
  { href: "#map", label: "Mechanisms" },
  { href: "#references", label: "References" },
  { href: "#notes", label: "Learn" },
] as const;

export function GraphToolbar() {
  return (
    <header className="graph-toolbar">
      <div className="toolbar-brand" aria-label="Application identity">
        <strong>HARNESS</strong>
      </div>

      <nav className="path-tabs" aria-label="Learning path modes">
        {navLinks.map((navLink) => (
          <a
            aria-current={navLink.label === "Research" ? "page" : undefined}
            className={navLink.label === "Research" ? "is-active" : undefined}
            href={navLink.href}
            key={navLink.href}
          >
            {navLink.label}
          </a>
        ))}
      </nav>

      <a className="toolbar-cta" href="#map">
        Open Graph
      </a>
    </header>
  );
}
