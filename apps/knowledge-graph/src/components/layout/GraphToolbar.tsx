const navLinks = [
  { href: "#research", label: "项目定位" },
  { href: "#map", label: "机制地图" },
  { href: "#references", label: "当前进度" },
] as const;

export function GraphToolbar() {
  return (
    <header className="graph-toolbar">
      <div className="toolbar-brand" aria-label="Application identity">
        <strong>HARNESS LAB</strong>
      </div>

      <nav className="path-tabs" aria-label="页面导航">
        {navLinks.map((navLink) => (
          <a
            aria-current={navLink.label === "项目定位" ? "page" : undefined}
            className={navLink.label === "项目定位" ? "is-active" : undefined}
            href={navLink.href}
            key={navLink.href}
          >
            {navLink.label}
          </a>
        ))}
      </nav>

      <a className="toolbar-cta" href="#map">
        打开图谱
      </a>
    </header>
  );
}
