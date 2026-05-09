export type AppScene = "intro" | "map";

type GraphToolbarProps = {
  activeScene: AppScene;
  onSceneChange: (scene: AppScene) => void;
};

const navLinks = [
  { scene: "intro", label: "入口" },
  { scene: "map", label: "机制地图" },
  { scene: "map", label: "当前状态" },
] as const;

export function GraphToolbar({ activeScene, onSceneChange }: GraphToolbarProps) {
  return (
    <header className="graph-toolbar">
      <div className="toolbar-brand" aria-label="Application identity">
        <strong>HARNESS LAB</strong>
      </div>

      <nav className="path-tabs" aria-label="页面导航">
        {navLinks.map((navLink) => (
          <button
            aria-current={activeScene === navLink.scene ? "page" : undefined}
            className={activeScene === navLink.scene ? "is-active" : undefined}
            key={navLink.label}
            type="button"
            onClick={() => onSceneChange(navLink.scene)}
          >
            {navLink.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
